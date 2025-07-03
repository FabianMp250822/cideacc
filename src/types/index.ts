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
