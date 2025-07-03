import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://cideacc.org';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
