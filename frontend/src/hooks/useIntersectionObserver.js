import { useEffect, useRef, useState } from 'react';

/**
 * A custom hook that detects when an element enters the viewport
 * @param {Object} options - Intersection Observer API options
 * @returns {Array} [ref, isIntersecting] - ref to attach to element, boolean indicating if element is in viewport
 */
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Update our state when observer callback fires
      setIntersecting(entry.isIntersecting);
      
      // If it's intersecting and we only want to trigger once, unobserve
      if (entry.isIntersecting && options.triggerOnce) {
        observer.unobserve(entry.target);
      }
    }, options);
    
    const currentRef = ref.current;
    
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);
  
  return [ref, isIntersecting];
};

export default useIntersectionObserver;
