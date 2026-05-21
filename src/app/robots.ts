import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/results', '/detail', '/api/'],
      },
    ],
    sitemap: 'https://torzo.vercel.app/sitemap.xml',
  };
}
