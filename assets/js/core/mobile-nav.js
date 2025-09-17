// Enhanced Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        // Toggle menu when hamburger is clicked
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
            
            // Accessibility
            const expanded = hamburger.classList.contains('active');
            hamburger.setAttribute('aria-expanded', expanded);
            navMenu.setAttribute('aria-hidden', !expanded);
        });
        
        // Close menu when a nav link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
                
                // Accessibility
                hamburger.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
                
                // Accessibility
                hamburger.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
            }
        });
        
        // Add aria attributes for accessibility
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-controls', 'nav-menu');
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        navMenu.setAttribute('aria-hidden', 'true');
        navMenu.setAttribute('id', 'nav-menu');
    }

    // Enhanced touch handling for mobile devices
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Add touch-specific listeners
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.classList.add('touch-focus');
            }, {passive: true});
            
            card.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-focus');
                }, 300);
            }, {passive: true});
        });
    }
    
    // Detect scroll direction for enhanced mobile navigation
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 70) {
                // Scrolling down
                navbar.classList.add('nav-hidden');
            } else {
                // Scrolling up
                navbar.classList.remove('nav-hidden');
            }
            
            lastScrollTop = scrollTop;
        }, {passive: true});
    }
});

// Responsive image loading based on viewport
function loadResponsiveImages() {
    const images = document.querySelectorAll('[data-src]');
    const isMobile = window.innerWidth <= 768;
    
    images.forEach(img => {
        const mobileSrc = img.getAttribute('data-src-mobile');
        const desktopSrc = img.getAttribute('data-src');
        
        if (isMobile && mobileSrc) {
            img.src = mobileSrc;
        } else {
            img.src = desktopSrc;
        }
        
        img.onload = function() {
            img.classList.add('loaded');
        };
    });
}

// Initialize responsive images
window.addEventListener('DOMContentLoaded', loadResponsiveImages);
window.addEventListener('resize', debounce(loadResponsiveImages, 200));

// Debounce helper function
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}
