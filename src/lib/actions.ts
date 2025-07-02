'use server';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
  getDoc
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { z } from 'zod';

import { db, storage } from '@/lib/firebase';
import type { Post } from '@/types';

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
  title: z.string().min(1, 'El título es requerido.').max(150, 'El título es muy largo.'),
  excerpt: z.string().min(1, 'El extracto es requerido.').max(300, 'El extracto es muy largo.'),
  content: z.string().min(1, 'El contenido es requerido.'),
  status: z.enum(['draft', 'published']),
  category: z.string().min(1, 'La categoría es requerida.'),
  newCategory: z.string().optional(),
});

// Function to upload image to Firebase Storage
async function uploadImage(image: File): Promise<string> {
  const storageRef = ref(storage, `posts/${Date.now()}_${image.name}`);
  await uploadBytes(storageRef, image);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

// CREATE POST ACTION
export async function createPost(formData: FormData) {
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
      finalCategory = newCategory;
      const categorySlug = createSlug(newCategory);
      const categoryRef = doc(db, 'categories', categorySlug);
      const categorySnap = await getDoc(categoryRef);
      if (!categorySnap.exists()) {
        await updateDoc(categoryRef, { name: newCategory, slug: categorySlug }, { merge: true });
      }
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
    });

  } catch (error) {
    console.error("Error creating post: ", error);
    throw new Error('No se pudo crear la publicación.');
  }
}

// UPDATE POST ACTION
export async function updatePost(postId: string, formData: FormData) {
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
        // Here you might want to delete the old image from storage
        updateData.featuredImageUrl = await uploadImage(image);
    }
    
    let finalCategory = category;
    if (category === 'new_category' && newCategory) {
      finalCategory = newCategory;
      const categorySlug = createSlug(newCategory);
      const categoryRef = doc(db, 'categories', categorySlug);
       const categorySnap = await getDoc(categoryRef);
      if (!categorySnap.exists()) {
        await updateDoc(categoryRef, { name: newCategory, slug: categorySlug }, { merge: true });
      }
    }
    updateData.categories = [finalCategory];

    await updateDoc(postRef, updateData);

  } catch (error) {
    console.error("Error updating post: ", error);
    throw new Error('No se pudo actualizar la publicación.');
  }
}

// DELETE POST ACTION
export async function deletePost(postId: string, imageUrl?: string) {
  try {
    if (imageUrl) {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef).catch(error => {
        // Don't throw if image not found, just log it
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

// GET PUBLISHED POSTS for the blog feed
export async function getPublishedPosts(): Promise<Post[]> {
  const postsCollection = collection(db, 'posts');
  const q = query(postsCollection, where('status', '==', 'published'), limit(20));
  const querySnapshot = await getDocs(q);
  const posts: Post[] = [];
  querySnapshot.forEach((doc) => {
    posts.push({ id: doc.id, ...doc.data() } as Post);
  });
  return posts;
}

// GET POST BY SLUG for the blog detail page
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const postsCollection = collection(db, 'posts');
  const q = query(postsCollection, where('slug', '==', slug), limit(1));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return null;
  }
  const docSnap = querySnapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as Post;
}
