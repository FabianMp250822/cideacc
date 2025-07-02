// This file contains actions that are intended to be run on the client,
// especially those that need the user's authentication context from the browser.

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
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
