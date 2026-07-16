import { MetadataRoute } from 'next';
import { getCmsBase, getSiteUrl } from '../lib/seoConfig';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cmsBase = getCmsBase();
  let siteUrl = getSiteUrl();
  
  // Try to load siteUrl from global SEO settings
  try {
    const settingsRes = await fetch(`${cmsBase}/api/seo/settings`, { 
      next: { revalidate: 3600 } 
    });
    if (settingsRes.ok) {
      const json = await settingsRes.json();
      if (json.success && json.data?.siteUrl) {
        siteUrl = json.data.siteUrl.trim();
        if (siteUrl.endsWith('/')) {
          siteUrl = siteUrl.slice(0, -1);
        }
      }
    }
  } catch (err) {
    console.error('Failed to load siteUrl from SEO settings:', err);
  }

  try {
    const res = await fetch(`${cmsBase}/api/page-routes`, { 
      next: { revalidate: 3600 } 
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch routes: ${res.status}`);
    }
    
    const json = await res.json();
    
    if (json.success && Array.isArray(json.data)) {
      return json.data.map((route: { value: string }) => {
        const path = route.value.startsWith('/') ? route.value : `/${route.value}`;
        
        let priority = 0.5;
        let changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly';
        
        if (path === '/') {
          priority = 1.0;
          changeFrequency = 'daily';
        } else if (path.startsWith('/blogs')) {
          priority = 0.8;
          changeFrequency = 'weekly';
        } else if (path.startsWith('/products')) {
          priority = 0.8;
          changeFrequency = 'weekly';
        } else if (path.startsWith('/services')) {
          priority = 0.7;
          changeFrequency = 'weekly';
        }
        
        return {
          url: `${siteUrl}${path}`,
          lastModified: new Date(),
          changeFrequency,
          priority,
        };
      });
    }
  } catch (err) {
    console.error('Error generating dynamic sitemap from CMS routes, using fallback:', err);
  }
  
  // Static fallback if CMS api is unreachable
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    }
  ];
}
