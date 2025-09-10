import React, { useState, useEffect } from 'react';
import './LazyImage.css';

const LazyImage = ({ src, alt, className, placeholder = null }) => {
  const [imageSrc, setImageSrc] = useState(placeholder || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48L3N2Zz4=');
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Create a new image object
    const img = new Image();
    img.src = src;
    
    // When the image loads, update state
    img.onload = () => {
      setImageSrc(src);
      setImageLoaded(true);
    };
    
    // Cleanup function
    return () => {
      img.onload = null;
    };
  }, [src]);

  return (
    <div className={`lazy-image-container ${className || ''}`}>
      <img 
        src={imageSrc} 
        alt={alt} 
        className={`lazy-image ${imageLoaded ? 'loaded' : 'loading'}`}
      />
      {!imageLoaded && (
        <div className="lazy-image-placeholder">
          <div className="loading-shimmer"></div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
