// Particle.js Configuration
particlesJS('particles-js', {
    "particles": {
        "number": {
            "value": 80,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": ["#00f5ff", "#ff6b6b", "#00ff88"]
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            },
            "polygon": {
                "nb_sides": 5
            }
        },
        "opacity": {
            "value": 0.5,
            "random": false,
            "anim": {
                "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 40,
                "size_min": 0.1,
                "sync": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#00f5ff",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 1.5,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "repulse"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 400,
                "line_linked": {
                    "opacity": 1
                }
            },
            "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
            },
            "repulse": {
                "distance": 200,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 4
            },
            "remove": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": true
});

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

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: linear-gradient(45deg, #00ff88, #00cc6a);' : 'background: linear-gradient(45deg, #ff6b6b, #ff5252);'}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
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