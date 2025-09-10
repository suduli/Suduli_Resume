import React, { useState } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import LoadingSpinner from './LoadingSpinner';
import './LazyLoad.css';

const LazyLoad = ({ children, placeholder = <LoadingSpinner />, height = '300px', threshold = 0.1 }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [ref, isIntersecting] = useIntersectionObserver({
    triggerOnce: true,
    threshold
  });

  // When the component is about to enter the viewport, start loading
  React.useEffect(() => {
    if (isIntersecting && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [isIntersecting, shouldLoad]);

  return (
    <div 
      ref={ref} 
      className="lazy-load-container"
      style={{ minHeight: shouldLoad ? 'auto' : height }}
    >
      {shouldLoad ? children : placeholder}
    </div>
  );
};

export default LazyLoad;
