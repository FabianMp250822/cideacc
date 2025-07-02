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
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { z } from 'zod';

import { auth, db, storage } from '@/lib/firebase';

// Helper function to create a slug from a title
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Zod Schema for Post Form
const postSchema = z.object({
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres.').max(150),
  excerpt: z.string().min(10, 'El extracto debe tener al menos 10 caracteres.').max(300),
  content: z.string().min(20, 'El contenido debe tener al menos 20 caracteres.'),
  status: z.enum(['draft', 'published']),
  category: z.string().min(1, 'Debes seleccionar una categoría.'),
  newCategory: z.string().optional(),
}).refine(data => {
    if (data.category === 'new_category') {
        return !!data.newCategory && data.newCategory.trim().length > 1;
    }
    return true;
}, {
    message: 'El nombre de la nueva categoría es requerido y debe tener al menos 2 caracteres.',
    path: ['newCategory'],
});


// Zod Schema for Contact Form
const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

// Function to upload image to Firebase Storage (Client-side)
async function uploadImage(image: File): Promise<string> {
  if (!auth.currentUser) {
    throw new Error('Usuario no autenticado.');
  }
  const storageRef = ref(storage, `posts/${Date.now()}_${image.name}`);
  await uploadBytes(storageRef, image);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

// CREATE POST ACTION (Client-side)
export async function createPost(formData: FormData) {
  if (!auth.currentUser) {
    throw new Error('Debes iniciar sesión para crear una publicación.');
  }

  const data = Object.fromEntries(formData);
  const validatedFields = postSchema.safeParse(data);

  if (!validatedFields.success) {
    throw new Error('Datos del formulario inválidos.');
  }

  const { title, excerpt, content, status, category, newCategory } = validatedFields.data;
  const image = formData.get('featuredImage') as File;
  
  if (!image || image.size === 0) {
    throw new Error('La imagen destacada es requerida.');
  }

  try {
    const imageUrl = await uploadImage(image);
    const slug = createSlug(title);

    let finalCategory = category;
    if (category === 'new_category' && newCategory) {
      const trimmedCategory = newCategory.trim();
      finalCategory = trimmedCategory;
      const categorySlug = createSlug(trimmedCategory);
      const categoryRef = doc(db, 'categories', categorySlug);
      await setDoc(categoryRef, { name: trimmedCategory, slug: categorySlug }, { merge: true });
    }
    
    const postsCollection = collection(db, 'posts');
    await addDoc(postsCollection, {
      title,
      slug,
      excerpt,
      content,
      featuredImageUrl: imageUrl,
      status,
      categories: [finalCategory],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      viewsCount: 0,
      likesCount: 0,
      authorId: auth.currentUser.uid,
    });

  } catch (error) {
    console.error("Error creating post: ", error);
    throw error;
  }
}

// UPDATE POST ACTION (Client-side)
export async function updatePost(postId: string, formData: FormData) {
  if (!auth.currentUser) {
    throw new Error('Debes iniciar sesión para actualizar una publicación.');
  }
  
  const data = Object.fromEntries(formData);
  const validatedFields = postSchema.safeParse(data);

  if (!validatedFields.success) {
    throw new Error('Datos del formulario inválidos.');
  }
  
  const { title, excerpt, content, status, category, newCategory } = validatedFields.data;
  const image = formData.get('featuredImage') as File;
  const postRef = doc(db, 'posts', postId);

  try {
    const updateData: any = {
      title,
      slug: createSlug(title),
      excerpt,
      content,
      status,
      updatedAt: serverTimestamp(),
    };

    if (image && image.size > 0) {
        const postSnap = await getDoc(postRef);
        const oldImageUrl = postSnap.data()?.featuredImageUrl;
        if (oldImageUrl) {
            try {
                const oldImageRef = ref(storage, oldImageUrl);
                await deleteObject(oldImageRef);
            } catch (err: any) {
                if (err.code !== 'storage/object-not-found') console.error("Could not delete old image", err);
            }
        }
        updateData.featuredImageUrl = await uploadImage(image);
    }
    
    let finalCategory = category;
    if (category === 'new_category' && newCategory) {
      const trimmedCategory = newCategory.trim();
      finalCategory = trimmedCategory;
      const categorySlug = createSlug(trimmedCategory);
      const categoryRef = doc(db, 'categories', categorySlug);
      await setDoc(categoryRef, { name: trimmedCategory, slug: categorySlug }, { merge: true });
    }
    updateData.categories = [finalCategory];

    await updateDoc(postRef, updateData);

  } catch (error) {
    console.error("Error updating post: ", error);
    throw error;
  }
}

// DELETE POST ACTION (Client-side)
export async function deletePost(postId: string, imageUrl?: string) {
   if (!auth.currentUser) {
    throw new Error('Debes iniciar sesión para eliminar una publicación.');
  }
  try {
    if (imageUrl) {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef).catch(error => {
        if(error.code !== 'storage/object-not-found') {
            console.error("Error deleting image:", error);
        }
      });
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
  // This would ideally write to a 'contacts' collection in Firestore,
  // but that would require different security rules for unauthenticated users.
  // For now, we just log it.
  console.log('Contact message received:', validatedFields.data);
}
