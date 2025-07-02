import type { Timestamp } from 'firebase/firestore';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImageUrl?: string;
  status: 'draft' | 'published';
  categories: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  viewsCount?: number;
  likesCount?: number;
}
