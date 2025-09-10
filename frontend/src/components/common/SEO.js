import React from 'react';
import PropTypes from 'prop-types';

/**
 * SEO helper component to update document title, meta tags, and structured data
 * Usage: <SEO title="Page Title" description="Page description" url="..." image="..."/>
 */
const SEO = ({ title, description, url, image, jsonLd }) => {
  React.useEffect(() => {
    if (title) document.title = title;

    const setMeta = (name, content, property=false) => {
      if (!content) return;
      const selector = property ? `meta[property='${name}']` : `meta[name='${name}']`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (property) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:url', url, true);
    setMeta('og:image', image, true);
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);

    // JSON-LD structured data
    if (jsonLd) {
      let script = document.getElementById('seo-json-ld');
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'seo-json-ld';
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(jsonLd, null, 2);
    }

    return () => {
      // leaving meta tags intact to avoid removing global metadata
    };
  }, [title, description, url, image, jsonLd]);

  return null;
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  url: PropTypes.string,
  image: PropTypes.string,
  jsonLd: PropTypes.object
};

export default SEO;
