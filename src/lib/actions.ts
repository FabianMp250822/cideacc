'use server';

import { collection, getDocs, limit, query, where, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Post } from '@/types';
import { summarizeImpactAndLearnings } from '@/ai/flows/summarize-impact-and-learnings';

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
