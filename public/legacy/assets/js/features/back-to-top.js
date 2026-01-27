/**
 * Back to Top Button
 * Adds a floating button that appears when scrolling down and allows users to quickly return to the top of the page
 */
document.addEventListener('DOMContentLoaded', function() {
    // Create the back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(backToTopBtn);
    
    // Show/hide the button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, { passive: true });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Use smooth scrolling if supported
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            // Fallback for browsers that don't support smooth scrolling
            window.scrollTo(0, 0);
        }
    });
    
    // Add touch effect for mobile
    if ('ontouchstart' in window) {
        backToTopBtn.addEventListener('touchstart', function() {
            this.classList.add('active');
        }, { passive: true });
        
        backToTopBtn.addEventListener('touchend', function() {
            this.classList.remove('active');
        }, { passive: true });
    }
});
