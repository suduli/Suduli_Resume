/**
 * Lazy Loading for Images
 * Improves page load performance by loading images only when they are about to enter the viewport
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if Intersection Observer API is available
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img.lazy-load');
        
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.classList.add('loaded');
                        img.classList.remove('lazy-load');
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, {
            // Start loading when image is 200px from viewport
            rootMargin: '200px 0px',
            threshold: 0.01
        });
        
        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
            
            // Add a placeholder or blur-up effect
            if (!img.style.background) {
                img.style.background = '#f0f0f0';
            }
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        function lazyLoadFallback() {
            const lazyImages = document.querySelectorAll('img.lazy-load');
            
            lazyImages.forEach(function(img) {
                const rect = img.getBoundingClientRect();
                const isVisible = (
                    rect.top <= (window.innerHeight || document.documentElement.clientHeight) + 200 &&
                    rect.bottom >= 0
                );
                
                if (isVisible) {
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.classList.add('loaded');
                        img.classList.remove('lazy-load');
                    }
                }
            });
        }
        
        // Run on load and scroll events
        document.addEventListener('scroll', debounce(lazyLoadFallback, 200));
        window.addEventListener('resize', debounce(lazyLoadFallback, 200));
        window.addEventListener('orientationchange', debounce(lazyLoadFallback, 200));
        document.addEventListener('DOMContentLoaded', lazyLoadFallback);
    }
    
    // Ensure debounce function is available
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
});
