import { useEffect } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';

function setMeta(selector: string, attribute: 'name' | 'property', key: string, value: string | null | undefined) {
  if (!value) return;
  let element = document.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = value;
}

export default function PageMetadata() {
  const { siteSettings, seoSettings, profile } = usePortfolio();

  useEffect(() => {
    const title = seoSettings?.seo_title || siteSettings?.website_title;
    const description = seoSettings?.meta_description || siteSettings?.meta_description;
    if (title) document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', seoSettings?.og_title || title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', seoSettings?.og_description || description);
    setMeta('meta[property="og:image"]', 'property', 'og:image', seoSettings?.og_image_url || siteSettings?.default_og_image_url);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', seoSettings?.og_title || title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', seoSettings?.og_description || description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', seoSettings?.twitter_image_url || siteSettings?.default_og_image_url);

    const personScript = document.querySelector<HTMLScriptElement>('#person-structured-data');
    if (personScript && profile) {
      personScript.textContent = JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Person',
        name: profile.full_name,
        jobTitle: profile.professional_title,
        description: profile.hero_description,
      });
    }

    if (seoSettings?.canonical_url) {
      let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = seoSettings.canonical_url;
    }
    if (siteSettings?.favicon_url) {
      let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = siteSettings.favicon_url;
    }
    const accent = siteSettings?.accent_color;
    if (accent && /^#[0-9a-f]{6}$/i.test(accent)) {
      document.documentElement.style.setProperty('--accent', accent);
      const channels = [1, 3, 5].map((start) => parseInt(accent.slice(start, start + 2), 16));
      document.documentElement.style.setProperty('--accent-rgb', channels.join(' '));
    }
  }, [siteSettings, seoSettings, profile]);

  return null;
}
