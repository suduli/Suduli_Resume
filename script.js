// Particle.js Configuration with deferred init (handles CDN failure + async fallback)
const PARTICLE_CONFIG = {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: ["#00f5ff", "#ff6b6b", "#00ff88"] },
        shape: { type: "circle", stroke: { width: 0, color: "#000000" }, polygon: { nb_sides: 5 } },
        opacity: { value: 0.5, random: false, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
        size: { value: 3, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false } },
        line_linked: { enable: true, distance: 150, color: "#00f5ff", opacity: 0.4, width: 1 },
        move: { enable: true, speed: 1.5, direction: "none", random: false, straight: false, out_mode: "out", bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 } }
    },
    interactivity: {
        // Use 'window' so interactions still work even if other content overlays the canvas
        detect_on: "window",
        events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
        modes: {
            grab: { distance: 400, line_linked: { opacity: 1 } },
            bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 }
        }
    },
    retina_detect: true
};

function initParticlesWithRetry(maxAttempts = 40, intervalMs = 125){
    let attempts = 0;
    const timer = setInterval(() => {
        attempts++;
        if (typeof window.particlesJS === 'function') {
            try {
                window.particlesJS('particles-js', PARTICLE_CONFIG);
                console.info('[particles] initialized after', attempts, 'attempt(s)');
                attachParticleVisibilityOptimization();
                logParticleDiagnostics();
            } catch (e) {
                console.error('[particles] initialization error:', e);
            }
            clearInterval(timer);
        } else if (attempts >= maxAttempts) {
            clearInterval(timer);
            console.error('[particles] failed to initialize: particlesJS not available');
            const placeholder = document.getElementById('particles-js');
            if (placeholder) {
                placeholder.innerHTML = '<div style="color:#ff6b6b;font:14px/1.4 system-ui,Arial,sans-serif;padding:8px;">Particle background unavailable.</div>';
            }
        }
    }, intervalMs);
}

// Start polling after DOM ready (fallback may be injected async on CDN error)
document.addEventListener('DOMContentLoaded', () => initParticlesWithRetry());

// Performance: attach optimization only after particles initialized
function attachParticleVisibilityOptimization(){
    function handleVisibility(){
        if(!window.pJSDom || !pJSDom[0]) return;
        const pJS = pJSDom[0].pJS;
        if(document.hidden){
            if(!pJS._origCount) pJS._origCount = pJS.particles.array.length;
            const target = Math.max(10, Math.round(pJS._origCount * 0.25));
            while(pJS.particles.array.length > target){ pJS.particles.array.pop(); }
        } else if(pJS._origCount){
            const deficit = pJS._origCount - pJS.particles.array.length;
            if(deficit > 0 && pJS.fn && pJS.fn.modes && pJS.fn.modes.pushParticles){
                pJS.fn.modes.pushParticles(deficit);
            }
        }
    }
    document.addEventListener('visibilitychange', handleVisibility, { once:false });
}

// Diagnostics to verify container & interaction readiness
function logParticleDiagnostics(){
    const el = document.getElementById('particles-js');
    if(!el){ console.warn('[particles][diag] container not found'); return; }
    const cs = getComputedStyle(el);
    console.info('[particles][diag] container styles', {
        zIndex: cs.zIndex,
        width: cs.width,
        height: cs.height,
        pointerEvents: cs.pointerEvents
    });
    console.info('[particles][diag] detect_on =', PARTICLE_CONFIG.interactivity.detect_on);
    // Check that the internal canvas exists
    const canvas = el.querySelector('canvas');
    if(canvas){
        const ccs = getComputedStyle(canvas);
        console.info('[particles][diag] canvas styles', { pointerEvents: ccs.pointerEvents, width: canvas.width, height: canvas.height });
    } else {
        console.warn('[particles][diag] canvas element not yet present');
    }
}

// Theme Toggle Functionality
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        this.currentTheme = 'dark';
        
        this.init();
    }
    
    init() {
        // Check for saved theme or system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            this.currentTheme = savedTheme;
        } else {
            this.currentTheme = prefersDark ? 'dark' : 'light';
        }
        
        this.applyTheme(this.currentTheme);
        this.updateIcon();
        
        // Add event listener for theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Add keyboard support for theme toggle
        this.themeToggle.addEventListener('keydown', (e) => {
            // Support Enter and Space keys
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.currentTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(this.currentTheme);
                this.updateIcon();
            }
        });
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        this.updateIcon();
        localStorage.setItem('theme', this.currentTheme);
    }
    
    applyTheme(theme) {
        // Add loading class for smooth transition
        document.documentElement.classList.add('theme-transitioning');
        
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        
        // Update particles colors for the theme
        this.updateParticlesTheme(theme);
        
        // Update navbar background for current scroll position
        updateNavbarBackground();
        
        // Remove transition class after transition completes
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const transitionDuration = prefersReducedMotion ? 0 : 300;
        
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
        }, transitionDuration);
    }
    
    updateIcon() {
        if (this.currentTheme === 'dark') {
            this.themeIcon.className = 'fas fa-sun';
            this.themeToggle.setAttribute('aria-label', 'Switch to light theme');
            this.themeToggle.setAttribute('title', 'Switch to light theme');
        } else {
            this.themeIcon.className = 'fas fa-moon';
            this.themeToggle.setAttribute('aria-label', 'Switch to dark theme');
            this.themeToggle.setAttribute('title', 'Switch to dark theme');
        }
        
        // Announce theme change to screen readers
        this.announceThemeChange();
    }
    
    announceThemeChange() {
        // Create or update live region for screen reader announcements
        let announcement = document.getElementById('theme-announcement');
        if (!announcement) {
            announcement = document.createElement('div');
            announcement.id = 'theme-announcement';
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'visually-hidden';
            document.body.appendChild(announcement);
        }
        
        // Clear and set new announcement
        announcement.textContent = '';
        setTimeout(() => {
            announcement.textContent = `Theme changed to ${this.currentTheme} mode`;
        }, 100);
    }
    
    updateParticlesTheme(theme) {
        // Update particles.js colors dynamically
        if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
            const pJS = window.pJSDom[0].pJS;
            if (theme === 'light') {
                pJS.particles.color.value = ['#0070f3', '#f56565', '#38a169'];
                pJS.particles.line_linked.color = '#0070f3';
            } else {
                pJS.particles.color.value = ['#00f5ff', '#ff6b6b', '#00ff88'];
                pJS.particles.line_linked.color = '#00f5ff';
            }
            pJS.fn.particlesRefresh();
        }
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect - Theme aware
function updateNavbarBackground() {
    const navbar = document.querySelector('.navbar');
    const isLightTheme = document.documentElement.hasAttribute('data-theme');
    const scrolled = window.scrollY > 50;
    
    if (isLightTheme) {
        // Light theme colors
        navbar.style.background = scrolled ? 'rgba(248, 250, 252, 0.98)' : 'rgba(248, 250, 252, 0.95)';
    } else {
        // Dark theme colors
        navbar.style.background = scrolled ? 'rgba(12, 12, 12, 0.98)' : 'rgba(12, 12, 12, 0.95)';
    }
}

window.addEventListener('scroll', updateNavbarBackground);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Animate skill progress bars
            if (entry.target.classList.contains('skills')) {
                animateSkillBars();
            }
            
            // Animate stats counters
            if (entry.target.classList.contains('about')) {
                animateCounters();
            }
        }
    });
}, observerOptions);

// Observe sections for scroll animations
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Skill bar animations
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        setTimeout(() => {
            bar.style.width = progress + '%';
        }, 300);
    });
}

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace('+', ''));
        const increment = target / 50;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + '+';
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + '+';
            }
        }, 40);
    });
}

// Anime.js animations
document.addEventListener('DOMContentLoaded', function() {
    // Hero section animations
    anime({
        targets: '.title-line',
        translateY: [-30, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: 500,
        easing: 'easeOutExpo'
    });

    anime({
        targets: '.title-main',
        translateY: [-50, 0],
        opacity: [0, 1],
        duration: 1200,
        delay: 700,
        easing: 'easeOutExpo'
    });

    anime({
        targets: '.title-subtitle',
        translateY: [-30, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: 900,
        easing: 'easeOutExpo'
    });

    anime({
        targets: '.hero-description',
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: 1100,
        easing: 'easeOutExpo'
    });

    anime({
        targets: '.hero-buttons',
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: 1300,
        easing: 'easeOutExpo'
    });

    // Floating animation for hero visual
    anime({
        targets: '.floating-element',
        translateY: [-10, 10],
        duration: 3000,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine'
    });

    // Stagger animation for timeline items
    anime({
        targets: '.timeline-item',
        translateX: function(el, i) {
            return i % 2 === 0 ? [-100, 0] : [100, 0];
        },
        opacity: [0, 1],
        duration: 1000,
        delay: anime.stagger(200, {start: 500}),
        easing: 'easeOutExpo'
    });

    // Project cards animation
    anime({
        targets: '.project-card',
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(150),
        easing: 'easeOutElastic(1, .8)'
    });

    // Education items animation
    anime({
        targets: '.education-item',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: anime.stagger(200),
        easing: 'easeOutExpo'
    });
});

// Contact form handling
const contactForm = document.querySelector('.form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('.btn-primary');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Phone number reveal functionality
document.addEventListener('DOMContentLoaded', function() {
    const revealButton = document.getElementById('reveal-phone');
    const phoneHidden = document.getElementById('phone-hidden');
    const phoneNumber = document.getElementById('phone-number');
    
    if (revealButton && phoneHidden && phoneNumber) {
        revealButton.addEventListener('click', function() {
            phoneHidden.classList.add('hidden');
            phoneNumber.classList.remove('hidden');
            revealButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
            revealButton.classList.add('revealed');
            
            // Change button functionality to copy to clipboard
            revealButton.removeEventListener('click', arguments.callee);
            revealButton.addEventListener('click', function() {
                const phoneText = phoneNumber.textContent;
                navigator.clipboard.writeText(phoneText)
                    .then(() => {
                        revealButton.innerHTML = '<i class="fas fa-check"></i> Copied';
                        showNotification('Phone number copied to clipboard!', 'success');
                        
                        setTimeout(() => {
                            revealButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Could not copy text: ', err);
                        showNotification('Failed to copy. Please try again.', 'error');
                    });
            });
        });
    }
});

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Force reflow to ensure animation works
    notification.offsetHeight;
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide and remove notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const floatingElement = document.querySelector('.floating-element');
    
    if (heroContent && floatingElement) {
        heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
        floatingElement.style.transform = `translateY(${scrolled * 0.1}px) rotate(${scrolled * 0.05}deg)`;
    }
});

// Cursor trail effect
let mouseX = 0;
let mouseY = 0;
let trail = [];

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    trail.push({x: mouseX, y: mouseY});
    if (trail.length > 20) {
        trail.shift();
    }
});

function drawTrail() {
    const canvas = document.getElementById('cursor-trail');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    trail.forEach((point, index) => {
        const opacity = index / trail.length;
        const size = (index / trail.length) * 5;
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 245, 255, ${opacity * 0.5})`;
        ctx.fill();
    });
    
    requestAnimationFrame(drawTrail);
}

// Initialize cursor trail
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'cursor-trail';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 999;
    `;
    document.body.appendChild(canvas);
    drawTrail();
});

// Loading animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
    
    // Start hero animations
    anime({
        targets: '.hero',
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutExpo'
    });
});

// Scroll progress indicator
const scrollProgress = document.createElement('div');
scrollProgress.style.cssText = `
    position: fixed;
    top: 70px;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(45deg, #00f5ff, #ff6b6b);
    z-index: 1001;
    transition: width 0.1s ease;
`;
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// Auto-typing effect for hero subtitle
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    setTimeout(type, 1500); // Start after other animations
}

document.addEventListener('DOMContentLoaded', () => {
    const subtitle = document.querySelector('.title-subtitle');
    if (subtitle) {
        const originalText = subtitle.textContent;
        typeWriter(subtitle, originalText, 80);
    }
});

// Enhanced hover effects for interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.05,
                duration: 300,
                easing: 'easeOutExpo'
            });
        });
        
        btn.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 300,
                easing: 'easeOutExpo'
            });
        });
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.project-card, .education-item, .timeline-content');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                translateY: -5,
                scale: 1.02,
                duration: 300,
                easing: 'easeOutExpo'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                translateY: 0,
                scale: 1,
                duration: 300,
                easing: 'easeOutExpo'
            });
        });
    });
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Scroll-based animations and effects
    const scrolled = window.pageYOffset;
    
    // Update navbar background (theme-aware)
    updateNavbarBackground();
    
    // Update scroll progress
    const progress = (scrolled / (document.body.scrollHeight - window.innerHeight)) * 100;
    scrollProgress.style.width = progress + '%';
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// ================= Skills Carousel Implementation =================

// Import skills data
import { SKILLS, CATEGORY_COLORS, colorForCategory } from './skills/skills-data.js';

console.log('Skills data imported successfully:', SKILLS.length, 'skills loaded');

// Carousel state
let currentCategory = null;
let carouselInitialized = false;

// Initialize carousel after DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeSkillsCarousel();
});

function initializeSkillsCarousel() {
    try {
        if (carouselInitialized) return;

        console.log('Initializing skills carousel...');
        
        const carouselContainer = document.querySelector('.categories-carousel');
        const detailPanel = document.querySelector('.skills-detail-panel');

        if (!carouselContainer || !detailPanel) {
            console.warn('Skills carousel elements not found');
            return;
        }

        console.log('Carousel elements found, proceeding with initialization...');

        // Group skills by category
        const skillsByCategory = groupSkillsByCategory();
        console.log('Skills grouped by category:', Object.keys(skillsByCategory));

        // Create category items
        createCategoryItems(carouselContainer, skillsByCategory);

        // Setup event listeners
        setupCarouselEvents(carouselContainer, detailPanel, skillsByCategory);

        carouselInitialized = true;
        console.log('Skills carousel initialized successfully');
    } catch (error) {
        console.error('Error initializing skills carousel:', error);
    }
}

function groupSkillsByCategory() {
    return SKILLS.reduce((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
    }, {});
}

function createCategoryItems(container, skillsByCategory) {
    console.log('Creating category items for categories:', Object.keys(skillsByCategory));
    
    // Custom sort to move "Learning" category to the end
    const categories = Object.keys(skillsByCategory).sort((a, b) => {
        if (a === 'Learning') return 1;  // Move "Learning" to end
        if (b === 'Learning') return -1; // Move "Learning" to end
        return a.localeCompare(b);      // Sort others alphabetically
    });

    categories.forEach(category => {
        const skills = skillsByCategory[category];
        const categoryColor = colorForCategory(category);

        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.dataset.category = category;
        categoryItem.setAttribute('role', 'button');
        categoryItem.setAttribute('tabindex', '0');
        categoryItem.setAttribute('aria-label', `View ${skills.length} skills in ${category}`);

        categoryItem.innerHTML = `
            <div class="category-icon">
                <i class="fas ${getCategoryIcon(category)}" aria-hidden="true"></i>
            </div>
            <div class="category-title">${category}</div>
            <div class="category-count">${skills.length} skills</div>
        `;

        // Add color class for theming
        categoryItem.classList.add(`category-${categoryColor}`);

        container.appendChild(categoryItem);
        console.log('Created category item for:', category);
    });
    
    console.log('Total category items created:', container.children.length);
}

function getCategoryIcon(category) {
    const iconMap = {
        'Testing': 'fa-vials',
        'Simulation': 'fa-cogs',
        'Programming': 'fa-code',
        'Protocols': 'fa-network-wired',
        'Safety': 'fa-shield-alt',
        'Tools': 'fa-toolbox',
        'Coverage': 'fa-chart-pie',
        'Requirements': 'fa-clipboard-list',
        'Version Control': 'fa-code-branch',
        'Learning': 'fa-brain'
    };

    return iconMap[category] || 'fa-circle-notch';
}

function setupCarouselEvents(carouselContainer, detailPanel, skillsByCategory) {
    const categoryItems = carouselContainer.querySelectorAll('.category-item');

    categoryItems.forEach(item => {
        // Click event
        item.addEventListener('click', () => {
            const category = item.dataset.category;
            selectCategory(category, item, detailPanel, skillsByCategory);
        });

        // Keyboard events
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const category = item.dataset.category;
                selectCategory(category, item, detailPanel, skillsByCategory);
            }
        });

        // Hover events for preview (optional)
        item.addEventListener('mouseenter', () => {
            if (currentCategory !== item.dataset.category) {
                item.classList.add('hover');
            }
        });

        item.addEventListener('mouseleave', () => {
            item.classList.remove('hover');
        });
    });

    // Close detail panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!carouselContainer.contains(e.target) && !detailPanel.contains(e.target)) {
            closeDetailPanel(detailPanel);
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && detailPanel.classList.contains('active')) {
            closeDetailPanel(detailPanel);
        }
    });
}

function selectCategory(category, item, detailPanel, skillsByCategory) {
    console.log('Category selected:', category);
    
    // Update active state
    document.querySelectorAll('.category-item').forEach(catItem => {
        catItem.classList.remove('active');
    });
    item.classList.add('active');

    // Update current category
    currentCategory = category;

    // Populate and show detail panel
    populateDetailPanel(detailPanel, category, skillsByCategory[category]);

    // Animate panel in
    showDetailPanel(detailPanel);
}

function populateDetailPanel(panel, category, skills) {
    const categoryColor = colorForCategory(category);
    const categoryIcon = getCategoryIcon(category);

    panel.innerHTML = `
        <div class="detail-header">
            <div class="detail-icon">
                <i class="fas ${categoryIcon}" aria-hidden="true"></i>
            </div>
            <div class="detail-title">${category}</div>
        </div>
        <div class="detail-description">
            Explore ${skills.length} specialized skills in ${category.toLowerCase()}.
        </div>
        <div class="skills-list">
            ${skills.map(skill => createSkillItemHTML(skill)).join('')}
        </div>
    `;

    // Add color class to panel
    panel.className = `skills-detail-panel category-${categoryColor}`;

    // Animate progress bars after panel is visible
    setTimeout(() => {
        animateProgressBars(panel);
    }, 300);
}

function createSkillItemHTML(skill) {
    const tagsHTML = skill.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('');

    return `
        <div class="skill-detail-item" data-skill="${skill.name}">
            <div class="skill-name">
                <i class="fas fa-check-circle" aria-hidden="true"></i>
                ${skill.name}
            </div>
            <div class="skill-level">${skill.level}% Proficiency</div>
            <div class="skill-progress-bar">
                <div class="skill-progress-fill" style="width: 0%; transition-delay: ${Math.random() * 0.5}s;"></div>
            </div>
            <div class="skill-description">${skill.desc}</div>
            <div class="skill-experience">
                <i class="fas fa-clock" aria-hidden="true"></i>
                ${skill.experience}
            </div>
            <div class="skill-endorsements">
                <i class="fas fa-thumbs-up" aria-hidden="true"></i>
                ${skill.endorsements} endorsements
            </div>
            <div class="skill-tags">
                ${tagsHTML}
            </div>
        </div>
    `;
}

function showDetailPanel(panel) {
    panel.classList.add('active');
    panel.style.transform = 'translateX(0)';
    panel.style.opacity = '1';

    // Announce to screen readers
    panel.setAttribute('aria-hidden', 'false');
}

function closeDetailPanel(panel) {
    panel.classList.remove('active');
    panel.style.transform = 'translateX(100%)';
    panel.style.opacity = '0';

    // Clear active state
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
    });

    currentCategory = null;

    // Announce to screen readers
    panel.setAttribute('aria-hidden', 'true');
}

function animateProgressBars(panel) {
    const progressBars = panel.querySelectorAll('.skill-progress-fill');

    progressBars.forEach((bar, index) => {
        const skillItem = bar.closest('.skill-detail-item');
        const skillName = skillItem.dataset.skill;
        const skill = SKILLS.find(s => s.name === skillName);

        if (skill) {
            // Stagger the animations
            setTimeout(() => {
                bar.style.width = `${skill.level}%`;
            }, index * 100);
        }
    });
}

// Utility function for grouping (if needed elsewhere)
function groupBy(array, key) {
    return array.reduce((result, item) => {
        const group = item[key];
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(item);
        return result;
    }, {});
}

// ================= End Skills Carousel Implementation =================

// Test function to verify carousel functionality
window.testCarousel = function() {
    console.log('Testing carousel functionality...');
    
    const carouselContainer = document.querySelector('.categories-carousel');
    const detailPanel = document.querySelector('.skills-detail-panel');
    
    if (!carouselContainer) {
        console.error('Categories carousel container not found!');
        return;
    }
    
    if (!detailPanel) {
        console.error('Skills detail panel not found!');
        return;
    }
    
    console.log('Carousel elements found');
    console.log('Categories carousel:', carouselContainer);
    console.log('Detail panel:', detailPanel);
    
    const categoryItems = carouselContainer.querySelectorAll('.category-item');
    console.log('Category items found:', categoryItems.length);
    
    if (categoryItems.length > 0) {
        console.log('First category item:', categoryItems[0]);
        console.log('Category data:', {
            category: categoryItems[0].dataset.category,
            text: categoryItems[0].textContent.trim()
        });
    }
    
    console.log('Carousel test complete');
};

// Auto-run test after carousel initialization
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for carousel to initialize
    setTimeout(() => {
        if (typeof window.testCarousel === 'function') {
            console.log('Running carousel test...');
            window.testCarousel();
        }
    }, 1000);
});



