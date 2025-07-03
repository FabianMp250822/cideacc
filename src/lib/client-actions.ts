// This file contains actions that are intended to be run on the client,
// especially those that need the user's authentication context from the browser.

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';
import { z } from 'zod';

import { auth, db, storage } from '@/lib/firebase';

// Helper function to create a slug from a title
export const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Zod Schema for Contact Form
const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

// Step 1: Manage Category
export async function manageCategory(category: string, newCategory?: string): Promise<string> {
  const trimmedNewCategory = newCategory?.trim();
  if (category === 'new_category' && trimmedNewCategory) {
    if (trimmedNewCategory.length < 2) {
      throw new Error('El nombre de la nueva categoría debe tener al menos 2 caracteres.');
    }
    const categorySlug = createSlug(trimmedNewCategory);
    const categoryRef = doc(db, 'categories', categorySlug);
    await setDoc(categoryRef, { name: trimmedNewCategory, slug: categorySlug }, { merge: true });
    return trimmedNewCategory;
  }
  return category;
}

// Step 2: Upload Image with Progress
export function uploadImage(image: File, onProgress: (progress: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!auth.currentUser) {
      return reject(new Error('Usuario no autenticado para subir imagen.'));
    }
    const storageRef = ref(storage, `posts/${Date.now()}_${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error) => {
        console.error("Firebase Storage upload error: ", error);
        reject(new Error("Error al subir la imagen. Revisa la configuración de Firebase Storage y los permisos de CORS."));
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
           console.error("Error getting download URL: ", error);
          reject(new Error("No se pudo obtener la URL de descarga de la imagen."));
        }
      }
    );
  });
}

// Step 3: Create Post Document in Firestore
export async function createPostDocument(postData: any): Promise<void> {
   if (!auth.currentUser) {
    throw new Error('Usuario no autenticado para crear la publicación.');
  }
  const postsCollection = collection(db, 'posts');
  await addDoc(postsCollection, {
    ...postData,
    authorId: auth.currentUser.uid
  });
}

// Step 3 (alternative): Update Post Document in Firestore
export async function updatePostDocument(postId: string, postData: any): Promise<void> {
  if (!auth.currentUser) {
    throw new Error('Usuario no autenticado para actualizar la publicación.');
  }
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, postData);
}

// Helper for image rollback or deletion
export async function deleteImage(imageUrl: string): Promise<void> {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef).catch(error => {
        // Don't throw if object doesn't exist, just log it.
        if(error.code !== 'storage/object-not-found') {
            console.error("Error deleting image:", error);
            // Optionally re-throw if it's a critical error other than not found
            // throw new Error("Could not delete image from storage.");
        }
    });
}

// DELETE POST ACTION (Client-side)
export async function deletePost(postId: string, imageUrl?: string) {
   if (!auth.currentUser) {
    throw new Error('Debes iniciar sesión para eliminar una publicación.');
  }
  try {
    if (imageUrl) {
      await deleteImage(imageUrl);
    }
    await deleteDoc(doc(db, 'posts', postId));
  } catch (error) {
    console.error("Error deleting post: ", error);
    throw new Error('No se pudo eliminar la publicación.');
  }
}

// SEND CONTACT MESSAGE (Client-side)
export async function sendContactMessage(data: z.infer<typeof contactSchema>) {
  const validatedFields = contactSchema.safeParse(data);
  if (!validatedFields.success) {
    throw new Error('Datos de contacto inválidos.');
  }
  console.log('Contact message received:', validatedFields.data);
}

// NEW: Create or Update Post via Firebase Function (Client-side)
export async function createOrUpdatePostViaFunction(
  postData: {
    title: string;
    excerpt: string;
    content: string;
    status: string;
    category: string;
    newCategory?: string;
  },
  imageFile?: File,
  postId?: string
): Promise<{ success: boolean; message: string; postId?: string }> {
  try {
    // Prepare the data according to your function's schema
    const requestData: {
      postData: {
        title: string;
        excerpt: string;
        content: string;
        status: 'draft' | 'published';
        category: string;
        newCategory?: string;
      };
      imageData?: string;
      imageName?: string;
      imageType?: string;
      postId?: string;
    } = {
      postData: {
        title: postData.title,
        excerpt: postData.excerpt,
        content: postData.content,
        status: postData.status as 'draft' | 'published',
        category: postData.category,
        newCategory: postData.newCategory,
      },
    };

    // Add postId if updating
    if (postId) {
      requestData.postId = postId;
    }

    // Handle image if provided
    if (imageFile) {
      // Convert image to base64
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          // Remove data URL prefix (data:image/jpeg;base64,)
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      requestData.imageData = imageData;
      requestData.imageName = imageFile.name;
      requestData.imageType = imageFile.type;
    }

    // Call the Firebase Function
    const createOrUpdatePostFunction = httpsCallable(functions, 'createOrUpdatePost');
    const result = await createOrUpdatePostFunction(requestData);

    return result.data as { success: boolean; message: string; postId?: string };
  } catch (error) {
    console.error('Error calling Firebase Function:', error);
    
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }
    
    return {
      success: false,
      message: 'Error desconocido al procesar la publicación',
    };
  }
}

// Función para convertir archivo a base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remover el prefijo "data:type/subtype;base64,"
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
};

// Función para crear estudio con archivos
export const createStudyWithFiles = async (
  studyData: {
    title: string;
    description: string;
    category: string;
    author: string;
    publishDate: string;
    tags: string[];
    featured: boolean;
  },
  pdfFile?: File,
  thumbnailFile?: File
) => {
  try {
    const createStudyFunction = httpsCallable(functions, 'createStudyWithFiles');
    
    const payload: any = {
      ...studyData,
    };

    // Convertir archivos a base64 si existen
    if (pdfFile) {
      const pdfBase64 = await fileToBase64(pdfFile);
      payload.pdfFile = {
        data: pdfBase64,
        name: pdfFile.name,
        type: pdfFile.type
      };
    }

    if (thumbnailFile) {
      const thumbnailBase64 = await fileToBase64(thumbnailFile);
      payload.thumbnailFile = {
        data: thumbnailBase64,
        name: thumbnailFile.name,
        type: thumbnailFile.type
      };
    }

    const result = await createStudyFunction(payload);
    return result.data;
  } catch (error) {
    console.error('Error creating study with files:', error);
    throw error;
  }
};

// Función para actualizar estudio con archivos
export const updateStudyWithFiles = async (
  studyId: string,
  studyData: {
    title: string;
    description: string;
    category: string;
    author: string;
    publishDate: string;
    tags: string[];
    featured: boolean;
  },
  pdfFile?: File,
  thumbnailFile?: File,
  currentPdfUrl?: string,
  currentThumbnailUrl?: string
) => {
  try {
    const updateStudyFunction = httpsCallable(functions, 'updateStudyWithFiles');
    
    const payload: any = {
      studyId,
      ...studyData,
      currentPdfUrl,
      currentThumbnailUrl
    };

    // Convertir archivos a base64 si existen
    if (pdfFile) {
      const pdfBase64 = await fileToBase64(pdfFile);
      payload.pdfFile = {
        data: pdfBase64,
        name: pdfFile.name,
        type: pdfFile.type
      };
    }

    if (thumbnailFile) {
      const thumbnailBase64 = await fileToBase64(thumbnailFile);
      payload.thumbnailFile = {
        data: thumbnailBase64,
        name: thumbnailFile.name,
        type: thumbnailFile.type
      };
    }

    const result = await updateStudyFunction(payload);
    return result.data;
  } catch (error) {
    console.error('Error updating study with files:', error);
    throw error;
  }
};

// Función para eliminar estudio con archivos
export const deleteStudyWithFiles = async (studyId: string) => {
  try {
    const deleteStudyFunction = httpsCallable(functions, 'deleteStudyWithFiles');
    const result = await deleteStudyFunction({ studyId });
    return result.data;
  } catch (error) {
    console.error('Error deleting study with files:', error);
    throw error;
  }
};

// Nueva función para convertir datos de Firestore a objetos planos
export function serializeFirestoreData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (data instanceof Timestamp) {
    return data.toDate().toISOString();
  }

  if (Array.isArray(data)) {
    return data.map(item => serializeFirestoreData(item));
  }

  if (typeof data === 'object') {
    const serialized: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        serialized[key] = serializeFirestoreData(data[key]);
      }
    }
    return serialized;
  }

  return data;
}

// Función para obtener posts serializados
export async function getSerializedPosts() {
  const postsCollection = collection(db, 'posts');
  const snapshot = await getDocs(postsCollection);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...serializeFirestoreData(doc.data())
  }));
}
