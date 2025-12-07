import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
}

const DEFAULT_TITLE = 'Upskill - Master In-Demand Tech Skills';
const DEFAULT_DESCRIPTION = 'Platform belajar programming online terbaik di Indonesia. Pelajari React, Node.js, Python, UI/UX Design dengan mentor ahli.';

/**
 * Hook for managing SEO meta tags dynamically
 * Updates document title and meta tags when props change
 */
export const useSEO = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  canonical,
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    const fullTitle = title ? `${title} | Upskill` : DEFAULT_TITLE;
    document.title = fullTitle;

    // Helper function to update or create meta tag
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Update meta description
    updateMetaTag('description', description || DEFAULT_DESCRIPTION);

    // Update keywords if provided
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    // Update Open Graph tags
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description || DEFAULT_DESCRIPTION, true);
    updateMetaTag('og:type', ogType, true);

    if (ogImage) {
      updateMetaTag('og:image', ogImage, true);
    }

    // Update Twitter Card tags
    updateMetaTag('twitter:title', fullTitle, true);
    updateMetaTag('twitter:description', description || DEFAULT_DESCRIPTION, true);

    if (ogImage) {
      updateMetaTag('twitter:image', ogImage, true);
    }

    // Update canonical URL
    if (canonical) {
      let canonicalElement = document.querySelector('link[rel="canonical"]');
      if (canonicalElement) {
        canonicalElement.setAttribute('href', canonical);
      } else {
        canonicalElement = document.createElement('link');
        canonicalElement.setAttribute('rel', 'canonical');
        canonicalElement.setAttribute('href', canonical);
        document.head.appendChild(canonicalElement);
      }
    }

    // Cleanup - restore defaults when component unmounts
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title, description, keywords, ogImage, ogType, canonical]);
};

export default useSEO;
