/**
 * SEO Utility Functions
 * Part of task T059 - Implement SEO optimizations
 */

/**
 * Generates structured data for a Person (portfolio owner)
 * @param {Object} profile - The profile data object
 * @returns {Object} - JSON-LD structured data object
 */
export function generatePersonStructuredData(profile) {
  // Defensive mapping: the profile data in the project uses a nested `contact`
  // object and different field names (photo, about, etc.). Map common
  // variants to the structured data shape and avoid throwing when fields
  // are missing.
  const contact = profile && profile.contact ? profile.contact : {};
  const socialLinks = [];
  if (contact.linkedIn) socialLinks.push(contact.linkedIn);
  if (contact.github) socialLinks.push(contact.github);
  if (contact.twitter) socialLinks.push(contact.twitter);
  if (Array.isArray(profile && profile.socialLinks)) {
    socialLinks.push(...profile.socialLinks.map(link => link.url));
  }

  const skills = Array.isArray(profile && profile.skills)
    ? profile.skills.map(s => s.name).join(', ')
    : '';

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': profile?.name || '',
    'jobTitle': profile?.title || '',
    'url': profile?.website || contact.website || '',
    'image': profile?.avatar || profile?.photo || contact.avatar || '',
    'email': contact.email || profile?.email || '',
    'telephone': contact.phone || profile?.phone || '',
    'description': profile?.summary || profile?.about || profile?.objective || '',
    'sameAs': socialLinks,
    'worksFor': {
      '@type': 'Organization',
      'name': profile?.currentCompany || contact.currentCompany || ''
    },
    'skills': skills
  };
}

/**
 * Generates structured data for a Project
 * @param {Object} project - The project data object
 * @returns {Object} - JSON-LD structured data object
 */
export function generateProjectStructuredData(project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    'name': project?.title || '',
    'description': project?.description || '',
    // Try to derive repository and live URLs from common fields
    'codeRepository': project?.repoUrl || (project?.links || []).find(l => /github|repo/i.test(l.type || l.url || ''))?.url || '',
    'dateCreated': project?.startDate || null,
    'dateModified': project?.endDate || new Date().toISOString(),
    'programmingLanguage': Array.isArray(project?.technologies) ? project.technologies.join(', ') : '',
    'url': project?.liveUrl || (project?.links || []).find(l => /demo|live/i.test(l.type || l.url || ''))?.url || '',
    'author': {
      '@type': 'Person',
      'name': project?.authorName || project?.author || ''
    },
    'image': project?.thumbnail || project?.image || ''
  };
}

/**
 * Generates meta tags for a specific page
 * @param {Object} pageInfo - Information about the page
 * @param {string} pageInfo.title - The page title
 * @param {string} pageInfo.description - The page description
 * @param {string} pageInfo.path - The page path
 * @param {string} pageInfo.image - The page image for social sharing
 * @param {Object} siteInfo - General site information
 * @param {string} siteInfo.name - The site name
 * @param {string} siteInfo.url - The base site URL
 * @returns {Object} - Meta tags for the page
 */
export function generateMetaTags(pageInfo, siteInfo) {
  const fullUrl = `${siteInfo.url}${pageInfo.path}`;
  const imageUrl = pageInfo.image ? `${siteInfo.url}${pageInfo.image}` : null;
  
  return {
    // Basic meta tags
    title: `${pageInfo.title} | ${siteInfo.name}`,
    description: pageInfo.description,
    
    // Open Graph tags (Facebook, LinkedIn)
    'og:title': pageInfo.title,
    'og:description': pageInfo.description,
    'og:url': fullUrl,
    'og:type': 'website',
    'og:site_name': siteInfo.name,
    ...(imageUrl ? { 'og:image': imageUrl } : {}),
    
    // Twitter Card tags
    'twitter:card': imageUrl ? 'summary_large_image' : 'summary',
    'twitter:title': pageInfo.title,
    'twitter:description': pageInfo.description,
    ...(imageUrl ? { 'twitter:image': imageUrl } : {}),
    
    // Canonical URL
    canonical: fullUrl
  };
}

/**
 * Creates or updates meta tags in the document head
 * @param {Object} metaTags - Object with meta tag properties
 */
export function updateMetaTags(metaTags) {
  // Update title
  if (metaTags.title) {
    document.title = metaTags.title;
  }
  
  // Update description
  updateOrCreateMetaTag('description', metaTags.description);
  
  // Update Open Graph and Twitter tags
  Object.entries(metaTags).forEach(([key, value]) => {
    if (key.startsWith('og:')) {
      updateOrCreateMetaTag('property', key, value);
    } else if (key.startsWith('twitter:')) {
      updateOrCreateMetaTag('name', key, value);
    }
  });
  
  // Update canonical link
  if (metaTags.canonical) {
    let canonicalLink = document.querySelector('link[rel=\'canonical\']');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = metaTags.canonical;
  }
}

/**
 * Updates or creates a meta tag
 * @param {string} attributeType - The attribute type (name or property)
 * @param {string} name - The meta tag name or property
 * @param {string} content - The content value
 */
function updateOrCreateMetaTag(attributeType, name, content) {
  if (!content) {
    content = name;
    name = attributeType;
    attributeType = 'name';
  }
  
  let metaTag = document.querySelector(`meta[${attributeType}="${name}"]`);
  
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute(attributeType, name);
    document.head.appendChild(metaTag);
  }
  
  metaTag.setAttribute('content', content);
}

/**
 * Generates a sitemap.xml string for all pages
 * @param {Array} pages - Array of page objects with url and lastmod properties
 * @param {string} baseUrl - The base URL of the site
 * @returns {string} - XML string for sitemap
 */
export function generateSitemap(pages, baseUrl) {
  const sitemapItems = pages.map(page => {
    return `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq || 'monthly'}</changefreq>
    <priority>${page.priority || '0.8'}</priority>
  </url>`;
  }).join('');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapItems}
</urlset>`;
}

/**
 * Adds JSON-LD structured data to the document head
 * @param {Object} structuredData - The structured data object
 */
export function addStructuredData(structuredData) {
  // Remove any existing structured data with the same @type
  if (structuredData['@type']) {
    const existingScript = document.querySelector(
      `script[type="application/ld+json"][data-type="${structuredData['@type']}"]`
    );
    if (existingScript) {
      existingScript.remove();
    }
  }
  
  // Create new script element
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  if (structuredData['@type']) {
    script.dataset.type = structuredData['@type'];
  }
  script.textContent = JSON.stringify(structuredData);
  
  // Add to document head
  document.head.appendChild(script);
}

/**
 * Optimizes heading structure on the page for SEO
 * Makes sure there's one H1 and proper hierarchy of headings
 */
export function optimizeHeadingStructure() {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const h1Elements = document.querySelectorAll('h1');
  
  // Check if there's more than one H1
  if (h1Elements.length > 1) {
    console.warn('Multiple H1 elements detected. This may impact SEO.');
  }
  
  // Check heading hierarchy
  let previousLevel = 0;
  headings.forEach(heading => {
    const currentLevel = parseInt(heading.tagName.charAt(1));
    
    // Check for skipped heading levels (e.g., H2 followed by H4)
    if (previousLevel > 0 && currentLevel - previousLevel > 1) {
      console.warn(`Heading hierarchy issue: H${previousLevel} followed by H${currentLevel}. Consider adding H${previousLevel + 1} in between.`);
    }
    
    previousLevel = currentLevel;
  });
}

/**
 * Adds alt text to images missing it
 * @param {string} defaultAlt - Default alt text to use if none is provided
 */
export function ensureImagesHaveAltText(defaultAlt = 'Portfolio image') {
  const images = document.querySelectorAll('img:not([alt])');
  images.forEach(img => {
    console.warn('Image without alt text detected:', img.src);
    img.alt = defaultAlt;
  });
}

/**
 * Initialize SEO optimizations
 * @param {Object} siteInfo - Site information
 */
export function initSEO(siteInfo) {
  // Optimize heading structure
  optimizeHeadingStructure();
  
  // Ensure all images have alt text
  ensureImagesHaveAltText();
  
  // Set default meta tags for the site
  const defaultMetaTags = generateMetaTags(
    {
      title: 'Portfolio',
      description: siteInfo.description,
      path: '/'
    },
    siteInfo
  );
  
  // Update meta tags with defaults
  updateMetaTags(defaultMetaTags);
  
  // Add structured data for the person if profile data is available
  if (siteInfo.profile) {
    const personData = generatePersonStructuredData(siteInfo.profile);
    addStructuredData(personData);
  }
}
