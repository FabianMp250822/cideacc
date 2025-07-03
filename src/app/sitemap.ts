import { getPublishedPosts, getAllStudies } from '@/lib/actions';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://cideacc.org';

  const posts = await getPublishedPosts();
  const postUrls = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt ? post.updatedAt.toDate() : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const studies = await getAllStudies();
  const studyUrls = studies.map(study => ({
    url: `${baseUrl}/studies/${study.id}`,
    lastModified: new Date(study.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const staticRoutes = [
    '/',
    '/about',
    '/solutions',
    '/impact',
    '/blog',
    '/contact',
  ];

  const staticUrls = staticRoutes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1.0 : 0.7,
  }));

  return [...staticUrls, ...postUrls, ...studyUrls];
}
