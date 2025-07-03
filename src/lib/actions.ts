'use server';

import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, // Añadir esta importación
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from './firebase';
import type { Post } from '@/types';
import { summarizeImpactAndLearnings } from '@/ai/flows/summarize-impact-and-learnings';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';

// GET PUBLISHED POSTS for the blog feed (Server Action)
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

// GET POST BY SLUG for the blog detail page (Server Action)
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

// GENERATE IMPACT SUMMARY (Server Action)
export async function generateImpactSummary(input: { projectOverview: string; }) {
  return await summarizeImpactAndLearnings(input);
}

// NEW: Create or Update Post via Firebase Function (Server Action)
export async function createOrUpdatePostViaFunctionServer(
  postData: {
    title: string;
    excerpt: string;
    content: string;
    status: 'draft' | 'published';
    category: string;
    newCategory?: string;
  },
  imageData?: string,
  imageName?: string,
  imageType?: string,
  postId?: string
): Promise<{ success: boolean; postId?: string; message: string }> {
  try {
    const createOrUpdatePost = httpsCallable(functions, 'createOrUpdatePost');
    const result = await createOrUpdatePost({
      postData,
      imageData,
      imageName,
      imageType,
      postId,
    });

    return result.data as { success: boolean; postId?: string; message: string };
  } catch (error) {
    console.error('Error calling Firebase Function from server:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Error al procesar la publicación a través de Firebase Functions desde el servidor.'
    );
  }
}

// ===== STUDIES ACTIONS =====

export interface Study {
  id: string;
  title: string;
  description: string;
  category: 'innovation' | 'impact' | 'research' | 'case-study';
  pdfUrl: string;
  thumbnailUrl?: string;
  author: string;
  publishDate: string;
  tags: string[];
  downloadCount: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudyFormData {
  title: string;
  description: string;
  category: Study['category'];
  pdfUrl: string;
  thumbnailUrl?: string;
  author: string;
  publishDate: string;
  tags: string[];
  featured: boolean;
}

export async function createStudy(data: StudyFormData): Promise<void> {
  try {
    const studyData = {
      ...data,
      downloadCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await addDoc(collection(db, 'studies'), studyData);
  } catch (error) {
    console.error('Error creating study:', error);
    throw new Error('Error al crear el estudio');
  }
}

export async function getStudies(): Promise<Study[]> {
  try {
    const studiesRef = collection(db, 'studies');
    const q = query(studiesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        description: data.description || '',
        category: data.category || 'research',
        pdfUrl: data.pdfUrl || '',
        thumbnailUrl: data.thumbnailUrl || null,
        author: data.author || '',
        publishDate: data.publishDate || '',
        tags: data.tags || [],
        downloadCount: data.downloadCount || 0,
        featured: data.featured || false,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('Error getting studies:', error);
    return [];
  }
}

export async function getFeaturedStudies(): Promise<Study[]> {
  try {
    const studiesRef = collection(db, 'studies');
    const q = query(
      studiesRef, 
      where('featured', '==', true),
      orderBy('createdAt', 'desc'),
      limit(6)
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        description: data.description || '',
        category: data.category || 'research',
        pdfUrl: data.pdfUrl || '',
        thumbnailUrl: data.thumbnailUrl || null,
        author: data.author || '',
        publishDate: data.publishDate || '',
        tags: data.tags || [],
        downloadCount: data.downloadCount || 0,
        featured: data.featured || false,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('Error getting featured studies:', error);
    return [];
  }
}

// AÑADIR ESTA FUNCIÓN QUE FALTA
export async function getStudyById(id: string): Promise<Study | null> {
  try {
    const studyRef = doc(db, 'studies', id);
    const snapshot = await getDoc(studyRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    const data = snapshot.data();
    return {
      id: snapshot.id,
      title: data.title || '',
      description: data.description || '',
      category: data.category || 'research',
      pdfUrl: data.pdfUrl || '',
      thumbnailUrl: data.thumbnailUrl || null,
      author: data.author || '',
      publishDate: data.publishDate || '',
      tags: data.tags || [],
      downloadCount: data.downloadCount || 0,
      featured: data.featured || false,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting study by ID:', error);
    return null;
  }
}

export async function updateStudy(id: string, data: Partial<StudyFormData>): Promise<void> {
  try {
    const studyRef = doc(db, 'studies', id);
    await updateDoc(studyRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating study:', error);
    throw new Error('Error al actualizar el estudio');
  }
}

export async function deleteStudy(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'studies', id));
  } catch (error) {
    console.error('Error deleting study:', error);
    throw new Error('Error al eliminar el estudio');
  }
}

export async function incrementDownloadCount(studyId: string): Promise<void> {
  try {
    const studyRef = doc(db, 'studies', studyId);
    await updateDoc(studyRef, {
      downloadCount: increment(1),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error incrementing download count:', error);
  }
}

// AÑADIR ESTA FUNCIÓN PARA OBTENER TODOS LOS ESTUDIOS
export async function getAllStudies(): Promise<Study[]> {
  try {
    const studiesRef = collection(db, 'studies');
    const q = query(studiesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        description: data.description || '',
        category: data.category || 'research',
        pdfUrl: data.pdfUrl || '',
        thumbnailUrl: data.thumbnailUrl || null,
        author: data.author || '',
        publishDate: data.publishDate || '',
        tags: data.tags || [],
        downloadCount: data.downloadCount || 0,
        featured: data.featured || false,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('Error getting all studies:', error);
    return [];
  }
}
