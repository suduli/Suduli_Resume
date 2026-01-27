/**
 * Mobile Swipe Navigation for Projects
 * Enables swipe gestures for navigating through projects on touch devices
 */
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on touch devices
    if (!('ontouchstart' in window)) return;
    
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return;
    
    const projectCards = projectsSection.querySelectorAll('.project-card');
    if (projectCards.length <= 1) return;
    
    // Initialize swipe tracking variables
    let touchStartX = 0;
    let touchEndX = 0;
    let currentIndex = 0;
    
    // Add swipe detection
    projectsSection.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    projectsSection.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        // Calculate swipe distance
        const swipeDistance = touchEndX - touchStartX;
        
        // Minimum distance to register a swipe (pixels)
        const minSwipeDistance = 50;
        
        if (Math.abs(swipeDistance) < minSwipeDistance) {
            return;
        }
        
        if (swipeDistance > 0) {
            // Swipe right (previous)
            navigateProjects('prev');
        } else {
            // Swipe left (next)
            navigateProjects('next');
        }
    }
    
    function navigateProjects(direction) {
        // Hide current project
        if (projectCards[currentIndex]) {
            projectCards[currentIndex].classList.add('swipe-hide');
            
            // Determine new index
            if (direction === 'next') {
                currentIndex = (currentIndex + 1) % projectCards.length;
            } else {
                currentIndex = (currentIndex - 1 + projectCards.length) % projectCards.length;
            }
            
            // Show new project after animation
            setTimeout(() => {
                projectCards.forEach((card, index) => {
                    if (index === currentIndex) {
                        card.classList.remove('swipe-hide');
                        card.classList.add('swipe-show');
                    } else {
                        card.classList.remove('swipe-show');
                    }
                });
            }, 300);
        }
    }
    
    // Add swipe indicator on mobile
    if (window.innerWidth <= 768) {
        const swipeIndicator = document.createElement('div');
        swipeIndicator.className = 'swipe-indicator';
        swipeIndicator.innerHTML = '<span>← Swipe →</span>';
        projectsSection.querySelector('.section-heading').after(swipeIndicator);
        
        // Auto hide the indicator after user's first swipe
        projectsSection.addEventListener('touchend', function() {
            setTimeout(() => {
                swipeIndicator.classList.add('hide');
            }, 1500);
        }, { once: true, passive: true });
    }
});
