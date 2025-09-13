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

// ================= Dynamic Skill Carousels =================
// Data model for categorized skills (deduplicated & structured)
const SKILL_CATEGORIES = [
    {
        title: 'Technical Skills', icon: 'fa-gears', color: 'teal',
        description: 'Core testing capabilities & collaborative strengths',
        skills: [
            'Black Box Testing','Regression Testing','Integration Testing','White Box Testing','Manual Testing','Test Case Design','Execution & Defect Reporting','Automation Testing','Clear Communication','Continuous Learning','Cross Functional Collaboration','Solution Driven'
        ]
    },
    {
        title: 'Protocols & Standards', icon: 'fa-network-wired', color: 'blue',
        description: 'Automotive communication & safety frameworks',
        skills: ['UDS','CAN','AUTOSAR','ISO 26262 Guidelines','LIN']
    },
    {
        title: 'Programming & Scripting', icon: 'fa-code', color: 'green',
        description: 'Implementation & automation languages',
        skills: ['Embedded C','Python','CAPL']
    },
    {
        title: 'Testing Methodologies', icon: 'fa-vials', color: 'purple',
        description: 'Structured approaches & lifecycle strategies',
        skills: ['White/Black Box','HIL Testing','SIL Testing','System Testing','Unit Testing','Integration Testing','Regression Testing','Agile Model']
    },
    {
        title: 'Testing Tools', icon: 'fa-toolbox', color: 'orange',
        description: 'Platforms & suites for automotive validation',
        skills: [
            'Vector Tools (CANoe, CANalyzer, CANdb, CANdela, VectorCast, vTESTstudio)',
            'Trace32','UnderstandC','dSPACE','ECU-Test Tool','RQM','RTC','VectorCast','VtestStudio'
        ]
    },
    {
        title: 'Debugging & Analysis', icon: 'fa-bug', color: 'red',
        description: 'Root-cause, flashing & static/dynamic insights',
        skills: ['Flashing','Trace32 Debugging','Code Analysis']
    },
    {
        title: 'Software Lifecycle', icon: 'fa-diagram-project', color: 'rose',
        description: 'End-to-end engineering process mastery',
        skills: ['SDLC','STLC','Bug Life Cycle']
    },
    {
        title: 'Coverage Analysis', icon: 'fa-chart-pie', color: 'gold',
        description: 'Quality measurement & structural assurance',
        skills: ['Structural Coverage (Statement, Branch, Singular Point)','MC/DC Expertise']
    },
    {
        title: 'Requirements Management', icon: 'fa-clipboard-list', color: 'teal',
        description: 'Traceability & model-driven engineering',
        skills: ['DOORS','Rhapsody']
    },
    {
        title: 'Version Control', icon: 'fa-code-branch', color: 'blue',
        description: 'Configuration & collaboration systems',
        skills: ['Git','SVN']
    },
    {
        title: 'Other Tools & Platforms', icon: 'fa-layer-group', color: 'green',
        description: 'Complementary ecosystem competencies',
        skills: [
            'Python','CAN','CAPL','SIL','HIL','CANoe','Jira','RTC ROM','Understand C','dSPACE','Git','Visual Studio'
        ]
    }
];

function buildSkillCarousels(){
    const container = document.getElementById('skills-dynamic');
    if(!container) return;
    container.innerHTML = '';
    SKILL_CATEGORIES.forEach((cat, idx) => {
        const section = document.createElement('div');
        section.className = 'skill-carousel';
        section.setAttribute('data-category-color', cat.color || 'blue');
        section.setAttribute('role','group');
        section.setAttribute('aria-label', cat.title);

        const header = document.createElement('div');
        header.className = 'skill-carousel-header';
        header.innerHTML = `
            <h3 class="skill-carousel-title"><i class="fas ${cat.icon}" aria-hidden="true"></i><span>${cat.title}</span></h3>
            <div class="skill-carousel-controls">
                <button class="skill-btn prev" aria-label="Scroll ${cat.title} left" data-dir="-1"><i class="fas fa-chevron-left" aria-hidden="true"></i></button>
                <button class="skill-btn next" aria-label="Scroll ${cat.title} right" data-dir="1"><i class="fas fa-chevron-right" aria-hidden="true"></i></button>
                <div class="skill-progress-bar" aria-hidden="true"><div class="skill-progress-fill"></div></div>
            </div>`;
        section.appendChild(header);

        const trackWrapper = document.createElement('div');
        trackWrapper.className = 'skill-track-wrapper';
        const track = document.createElement('div');
        track.className = 'skill-track';
        track.setAttribute('tabindex','0');
        track.setAttribute('aria-label', `${cat.title} skills horizontal list`);

        cat.skills.forEach(skill => {
            const card = document.createElement('div');
            card.className = 'skill-card';
            const iconClass = pickIconForSkill(skill);
            card.innerHTML = `
                <div class="skill-card-icon"><i class="fas ${iconClass}" aria-hidden="true"></i></div>
                <div class="skill-card-title">${skill}</div>
                <div class="skill-card-tags"></div>`;
            track.appendChild(card);
        });

        trackWrapper.appendChild(track);
        const dragHint = document.createElement('div');
        dragHint.className = 'skill-drag-hint';
        dragHint.textContent = 'Drag / Scroll';
        trackWrapper.appendChild(dragHint);
        section.appendChild(trackWrapper);
        container.appendChild(section);

        setupCarouselInteractions(section, track);
    });
}

function pickIconForSkill(name){
    const lower = name.toLowerCase();
    if(lower.includes('python')) return 'fa-python';
    if(lower.includes('git')) return 'fa-code-branch';
    if(lower.includes('coverage') || lower.includes('mcdc')) return 'fa-chart-line';
    if(lower.includes('door')) return 'fa-door-open';
    if(lower.includes('trace32') || lower.includes('debug')) return 'fa-microchip';
    if(lower.includes('test') || lower.includes('unit')) return 'fa-vial';
    if(lower.includes('integration') || lower.includes('system')) return 'fa-layer-group';
    if(lower.includes('automation')) return 'fa-robot';
    if(lower.includes('agile')) return 'fa-sync-alt';
    if(lower.includes('can')) return 'fa-network-wired';
    if(lower.includes('uds')) return 'fa-shield-alt';
    if(lower.includes('autosar')) return 'fa-car';
    if(lower.includes('rhapsody')) return 'fa-cube';
    if(lower.includes('dspace')) return 'fa-satellite-dish';
    if(lower.includes('jira')) return 'fa-ticket';
    return 'fa-circle-notch';
}

function setupCarouselInteractions(section, track){
    const prevBtn = section.querySelector('.skill-btn.prev');
    const nextBtn = section.querySelector('.skill-btn.next');
    const progressFill = section.querySelector('.skill-progress-fill');
    const wrapper = section.querySelector('.skill-track-wrapper');

    const updateScrollState = () => {
        const maxScroll = track.scrollWidth - track.clientWidth;
        const sc = track.scrollLeft;
        const pct = maxScroll > 0 ? (sc / maxScroll) * 100 : 0;
        progressFill.style.width = pct + '%';
        prevBtn.disabled = sc <= 0; 
        nextBtn.disabled = sc >= maxScroll - 2; 
        wrapper.dataset.scrollStart = sc <= 0 ? 'true' : 'false';
        wrapper.dataset.scrollEnd = sc >= maxScroll - 2 ? 'true' : 'false';
    };

    const scrollByAmount = (dir) => {
        const amount = track.clientWidth * 0.7 * dir; // 70% viewport of track
        track.scrollBy({ left: amount, behavior: 'smooth' });
    };

    prevBtn.addEventListener('click', () => scrollByAmount(-1));
    nextBtn.addEventListener('click', () => scrollByAmount(1));
    track.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);

    // Keyboard horizontal scrolling
    track.addEventListener('keydown', (e) => {
        if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){
            e.preventDefault();
            if(e.key==='ArrowRight') scrollByAmount(1);
            else if(e.key==='ArrowLeft') scrollByAmount(-1);
            else if(e.key==='Home') track.scrollTo({ left:0, behavior:'smooth'});
            else if(e.key==='End') track.scrollTo({ left: track.scrollWidth, behavior:'smooth'});
        }
    });

    // Drag to scroll (mouse / touch)
    let isDown = false, startX=0, scrollStart=0; let dragMoved=false;
    const start = (clientX) => { isDown=true; startX=clientX; scrollStart=track.scrollLeft; dragMoved=false; track.dataset.dragging='true'; };
    const move = (clientX) => { if(!isDown) return; const dx = clientX - startX; track.scrollLeft = scrollStart - dx; if(Math.abs(dx) > 5) dragMoved=true; };
    const end = () => { isDown=false; track.dataset.dragging='false'; };
    track.addEventListener('mousedown', e => { start(e.clientX); });
    track.addEventListener('mousemove', e => { if(isDown){ e.preventDefault(); move(e.clientX);} });
    track.addEventListener('mouseleave', end);
    track.addEventListener('mouseup', end);
    track.addEventListener('click', e => { if(dragMoved) e.preventDefault(); });
    track.addEventListener('touchstart', e => { const t=e.touches[0]; start(t.clientX); }, {passive:true});
    track.addEventListener('touchmove', e => { const t=e.touches[0]; move(t.clientX); }, {passive:true});
    track.addEventListener('touchend', end);

    // Initial state
    requestAnimationFrame(updateScrollState);
}

// Initialize after DOM content & after fonts to avoid layout shift
document.addEventListener('DOMContentLoaded', () => {
    buildSkillCarousels();
});
// ===========================================================

// ===================== Skills Explorer Redesign =====================
// Data model for enhanced skills explorer (richer than carousel)
const SKILLS_DATA = [
    { id:'s1', name:'Black Box Testing', category:'Testing Methodologies', level:92, description:'Validation approach focusing on functional behavior without internal code awareness.', keywords:['functional','system','validation'], attributes:{ Type:'Functional', Focus:'External Behavior'} },
    { id:'s2', name:'Regression Testing', category:'Testing Methodologies', level:88, description:'Ensuring existing functionality remains stable after changes or integrations.', keywords:['stability','maintenance'], attributes:{ Scope:'Broad', Trigger:'Code Change'} },
    { id:'s3', name:'Integration Testing', category:'Testing Methodologies', level:86, description:'Verifies interactions and data flow between integrated modules.', keywords:['interfaces','modules'], attributes:{ Level:'Mid-tier', Focus:'Interfaces'} },
    { id:'s4', name:'Manual Testing', category:'Testing Methodologies', level:90, description:'Human-driven exploratory & scripted execution for nuanced defect discovery.', keywords:['exploratory','scripted'], attributes:{ Strength:'Contextual Insight'} },
    { id:'s5', name:'Automation Testing', category:'Testing Methodologies', level:75, description:'Accelerated repeatable execution leveraging tool-based frameworks.', keywords:['repeatability','speed'], attributes:{ Benefit:'Scalability'} },
    { id:'s6', name:'UDS', category:'Protocols & Standards', level:70, description:'Unified Diagnostic Services protocol used for ECU diagnostics & flashing.', keywords:['diagnostics','ecu','iso14229'], attributes:{ Domain:'Automotive', Type:'Protocol'} },
    { id:'s7', name:'CAN', category:'Protocols & Standards', level:85, description:'Controller Area Network communication backbone in automotive distributed systems.', keywords:['bus','network','embedded'], attributes:{ Speed:'Classical / FD'} },
    { id:'s8', name:'AUTOSAR', category:'Protocols & Standards', level:65, description:'Standardized automotive software architecture enabling portability & reuse.', keywords:['architecture','standard'], attributes:{ Layering:'MCAL/APPL'} },
    { id:'s9', name:'ISO 26262 Guidelines', category:'Protocols & Standards', level:60, description:'Functional safety standard guiding lifecycle risk reduction in road vehicles.', keywords:['safety','compliance'], attributes:{ Domain:'Safety', Aspect:'Process'} },
    { id:'s10', name:'Embedded C', category:'Programming & Scripting', level:82, description:'Low-level implementation for performance-critical embedded components.', keywords:['firmware','memory','pointers'], attributes:{ Paradigm:'Procedural'} },
    { id:'s11', name:'Python', category:'Programming & Scripting', level:78, description:'Automation, report generation & analysis scripting for validation ecosystems.', keywords:['scripting','automation','analysis'], attributes:{ Style:'Multi-purpose'} },
    { id:'s12', name:'CAPL', category:'Programming & Scripting', level:72, description:'Vector tool-focused language for CAN simulation & message orchestration.', keywords:['simulation','vector','bus'], attributes:{ Tool:'Vector'} },
    { id:'s13', name:'Trace32 Debugging', category:'Debugging & Analysis', level:74, description:'Hardware-level program control & inspection for embedded targets.', keywords:['jtag','breakpoints','firmware'], attributes:{ Mode:'On-target'} },
    { id:'s14', name:'VectorCast', category:'Testing Tools', level:80, description:'Unit & integration test environment enabling structural coverage insights.', keywords:['unit','coverage','automation'], attributes:{ Coverage:'MC/DC'} },
    { id:'s15', name:'dSPACE', category:'Testing Tools', level:68, description:'HIL platform enabling real-time simulation for control system validation.', keywords:['hil','simulation','realtime'], attributes:{ Domain:'HIL'} },
    { id:'s16', name:'ECU-Test Tool', category:'Testing Tools', level:66, description:'Test automation suite for ECU function & integration workflows.', keywords:['automation','ecu','vector'], attributes:{ Type:'Framework'} },
    { id:'s17', name:'Code Analysis (UnderstandC)', category:'Debugging & Analysis', level:70, description:'Static exploration of complexity, dependencies & potential risk hotspots.', keywords:['static','complexity','metrics'], attributes:{ Benefit:'Risk Visibility'} },
    { id:'s18', name:'MC/DC Expertise', category:'Coverage Analysis', level:78, description:'Modified Condition/Decision Coverage to assure decision logic robustness.', keywords:['coverage','safety','logic'], attributes:{ Context:'Safety-Critical'} },
    { id:'s19', name:'DOORS', category:'Requirements Management', level:75, description:'Requirement traceability & change linkage across verification artifacts.', keywords:['traceability','requirements'], attributes:{ Strength:'Impact Tracking'} },
    { id:'s20', name:'Rhapsody', category:'Requirements Management', level:55, description:'Model-driven systems & software design with UML/SysML constructs.', keywords:['modeling','uml'], attributes:{ Domain:'Systems'} },
    { id:'s21', name:'Git', category:'Version Control', level:82, description:'Distributed version control ensuring efficient collaboration & branching.', keywords:['scm','branches','merge'], attributes:{ Strategy:'Feature Branching'} },
    { id:'s22', name:'SVN', category:'Version Control', level:60, description:'Centralized repository control for legacy or regulated environments.', keywords:['centralized','legacy'], attributes:{ Mode:'Central'} },
    { id:'s23', name:'HIL Testing', category:'Testing Methodologies', level:70, description:'Hardware-in-the-loop validation of control logic with real-time constraints.', keywords:['real-time','platform'], attributes:{ Layer:'System'} },
    { id:'s24', name:'SIL Testing', category:'Testing Methodologies', level:68, description:'Software-in-loop validation using simulation for early defect detection.', keywords:['simulation','automation'], attributes:{ Benefit:'Early Shift-left'} },
    { id:'s25', name:'System Testing', category:'Testing Methodologies', level:84, description:'End-to-end validation of integrated functional and non-functional goals.', keywords:['end-to-end','requirements'], attributes:{ Scope:'Full Stack'} },
    { id:'s26', name:'Unit Testing', category:'Testing Methodologies', level:83, description:'Fine-grained verification of isolated logic with deterministic inputs.', keywords:['granular','logic'], attributes:{ Benefit:'Fast Feedback'} },
    { id:'s27', name:'Flashing', category:'Debugging & Analysis', level:76, description:'Reliable deployment & verification of firmware images to ECUs.', keywords:['firmware','ecu','bootloader'], attributes:{ Concern:'Integrity'} },
    { id:'s28', name:'Structural Coverage', category:'Coverage Analysis', level:77, description:'Statement & branch metrics illuminate unverified execution pathways.', keywords:['metrics','gaps'], attributes:{ Levels:'Stmt/Branch'} },
    { id:'s29', name:'SDLC', category:'Software Lifecycle', level:82, description:'Governed phases from requirements through maintenance for quality delivery.', keywords:['process','phases'], attributes:{ Focus:'Lifecycle'} },
    { id:'s30', name:'STLC', category:'Software Lifecycle', level:80, description:'Structured test lifecycle progression aligning verification maturity.', keywords:['test process','planning'], attributes:{ Alignment:'Quality Gates'} },
    { id:'s31', name:'Bug Life Cycle', category:'Software Lifecycle', level:85, description:'Managed transition states ensuring resolution accountability & clarity.', keywords:['defect','workflow'], attributes:{ Tracking:'State Progression'} }
];

// Config
const SKILLS_UI = {
    storageViewKey:'skillsViewMode',
    selectors:{
        results:'#skills-results', search:'#skill-search', clearSearch:'#skill-clear-search', chips:'#skill-chips', count:'#skills-count', clearFilters:'#skills-clear-filters', sort:'#skill-sort'
    }
};

let activeView = localStorage.getItem(SKILLS_UI.storageViewKey) || 'grid';
let activeSearch = '';
let activeCategories = new Set();
let activeSort = 'category';

function initSkillsExplorer(){
    const resultsEl = qs(SKILLS_UI.selectors.results);
    if(!resultsEl) return; // abort if markup missing
    resultsEl.dataset.view = activeView;
    buildCategoryChips();
    bindControls();
    renderSkills();
}

function qs(sel, root=document){ return root.querySelector(sel); }
function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

function buildCategoryChips(){
    const chipWrap = qs(SKILLS_UI.selectors.chips);
    if(!chipWrap) return;
    chipWrap.innerHTML = '';
    const categories = Array.from(new Set(SKILLS_DATA.map(s=>s.category))).sort();
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.type='button';
        btn.className='skill-chip';
        btn.textContent=cat;
        btn.setAttribute('role','listitem');
        btn.dataset.color = pickCategoryColor(cat);
        btn.setAttribute('aria-pressed','false');
        btn.addEventListener('click', () => toggleCategory(cat, btn));
        chipWrap.appendChild(btn);
    });
}

function pickCategoryColor(cat){
    const map = ['blue','green','orange','purple','red','teal','gold','rose'];
    const idx = Math.abs(hashString(cat)) % map.length; return map[idx];
}
function hashString(str){ let h=0; for(let i=0;i<str.length;i++){ h = Math.imul(31,h) + str.charCodeAt(i) | 0;} return h; }

function toggleCategory(category, btn){
    if(activeCategories.has(category)) { activeCategories.delete(category); btn.setAttribute('aria-pressed','false'); }
    else { activeCategories.add(category); btn.setAttribute('aria-pressed','true'); }
    updateFiltersState();
    renderSkills(true);
}

function bindControls(){
    const searchEl = qs(SKILLS_UI.selectors.search);
    const clearSearchBtn = qs(SKILLS_UI.selectors.clearSearch);
    const sortEl = qs(SKILLS_UI.selectors.sort);
    const clearFiltersBtn = qs(SKILLS_UI.selectors.clearFilters);
    const resultsEl = qs(SKILLS_UI.selectors.results);

    // Search
    if(searchEl){
        searchEl.addEventListener('input', e => {
            activeSearch = e.target.value.trim();
            clearSearchBtn.hidden = activeSearch.length === 0;
            renderSkills();
        });
    }
    if(clearSearchBtn){
        clearSearchBtn.addEventListener('click', ()=> { searchEl.value=''; activeSearch=''; clearSearchBtn.hidden=true; searchEl.focus(); renderSkills(); });
    }
    // View toggle
    qsa('.view-btn').forEach(btn => btn.addEventListener('click', ()=>{
        const view = btn.dataset.view; if(view === activeView) return; activeView=view; localStorage.setItem(SKILLS_UI.storageViewKey, view); qsa('.view-btn').forEach(b=>b.setAttribute('aria-pressed', b===btn ? 'true':'false')); resultsEl.dataset.view=view; renderSkills(true);
    }));
    // Sort
    if(sortEl){ sortEl.addEventListener('change', e=> { activeSort = e.target.value; renderSkills(true); }); }
    // Clear filters
    if(clearFiltersBtn){ clearFiltersBtn.addEventListener('click', ()=> { activeCategories.clear(); qsa('.skill-chip').forEach(ch=>ch.setAttribute('aria-pressed','false')); renderSkills(true); updateFiltersState(); }); }

    // Keyboard shortcut: / focuses search
    document.addEventListener('keydown', e => { if(e.key === '/' && document.activeElement !== searchEl){ e.preventDefault(); searchEl.focus(); } });
}

function updateFiltersState(){
    const clearFiltersBtn = qs(SKILLS_UI.selectors.clearFilters);
    if(clearFiltersBtn) clearFiltersBtn.hidden = activeCategories.size === 0;
}

function sortSkills(list){
    switch(activeSort){
        case 'name': return list.sort((a,b)=> a.name.localeCompare(b.name));
        case 'level-desc': return list.sort((a,b)=> b.level - a.level);
        case 'level-asc': return list.sort((a,b)=> a.level - b.level);
        case 'category': default: return list.sort((a,b)=> a.category.localeCompare(b.category) || b.level - a.level);
    }
}

function filterSkills(){
    let list = SKILLS_DATA.slice();
    if(activeCategories.size){ list = list.filter(s => activeCategories.has(s.category)); }
    if(activeSearch){
        const q = activeSearch.toLowerCase();
        list = list.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || (s.keywords && s.keywords.some(k=>k.includes(q))));
    }
    return sortSkills(list);
}

function renderSkills(animate=false){
    const resultsEl = qs(SKILLS_UI.selectors.results); if(!resultsEl) return;
    const list = filterSkills();
    updateCount(list.length);
    const emptyEl = qs('#skills-empty');
    if(list.length === 0){ resultsEl.innerHTML=''; if(emptyEl) emptyEl.hidden=false; return; } else if(emptyEl) emptyEl.hidden=true;
    if(activeView === 'grid') renderGrid(list, resultsEl, animate); else renderListView(list, resultsEl, animate);
    // Focus management after view change
    if(animate){ setTimeout(()=> { resultsEl.focus({ preventScroll:true }); }, 20); }
}

function updateCount(count){ const countEl = qs(SKILLS_UI.selectors.count); if(!countEl) return; countEl.textContent = `${count} skill${count!==1?'s':''} displayed`; }

function renderGrid(list, container, animate){
    container.innerHTML='';
    const tmpl = qs('#skill-card-template');
    list.forEach(skill => {
        const clone = tmpl.content.firstElementChild.cloneNode(true);
        clone.dataset.skillId = skill.id;
        const nameEl = clone.querySelector('.skill-name'); nameEl.textContent = skill.name; nameEl.id = `skill-name-${skill.id}`;
        const lvlEl = clone.querySelector('.skill-level-badge'); lvlEl.textContent = skill.level + '%';
        const catBadge = clone.querySelector('.skill-category-badge'); catBadge.textContent = skill.category;
        const desc = clone.querySelector('.skill-description'); desc.textContent = skill.description;
        const prog = clone.querySelector('.skill-progress-fill-ex'); requestAnimationFrame(()=> prog.style.width = skill.level + '%');
        const tagsWrap = clone.querySelector('.skill-tags'); if(skill.keywords){ skill.keywords.slice(0,5).forEach(k => { const span=document.createElement('span'); span.className='tag-sm'; span.textContent=k; tagsWrap.appendChild(span); }); }
        const expandBtn = clone.querySelector('.skill-expand-btn'); const panel = clone.querySelector('.skill-panel'); expandBtn.setAttribute('aria-controls', `skill-panel-${skill.id}`); panel.id = `skill-panel-${skill.id}`;
        expandBtn.addEventListener('click', ()=> togglePanel(expandBtn, panel));
        // Attributes
        const dl = clone.querySelector('.skill-attributes'); Object.entries(skill.attributes || {}).forEach(([k,v])=> { const dt=document.createElement('dt'); dt.textContent=k; const dd=document.createElement('dd'); dd.textContent=v; dl.append(dt,dd); });
        // Keyboard expand with Enter/Space on card
        clone.addEventListener('keydown', e=> { if(e.key==='Enter' || e.key===' '){ e.preventDefault(); expandBtn.click(); } });
        container.appendChild(clone);
    });
}

function renderListView(list, container, animate){
    container.innerHTML='';
    const categories = groupBy(list, s=>s.category);
    const catTmpl = qs('#skill-list-category-template');
    const itemTmpl = qs('#skill-list-item-template');
    Object.entries(categories).sort((a,b)=> a[0].localeCompare(b[0])).forEach(([cat, skills]) => {
        const catClone = catTmpl.content.firstElementChild.cloneNode(true);
        const catBtn = catClone.querySelector('.category-accordion-btn');
        const catPanel = catClone.querySelector('.skill-category-panel');
        const catName = catClone.querySelector('.cat-name'); catName.textContent = cat;
        const catCount = catClone.querySelector('.cat-count'); catCount.textContent = skills.length;
        const panelId = `cat-panel-${hashString(cat)}`; catPanel.id = panelId; catBtn.setAttribute('aria-controls', panelId);
        catBtn.addEventListener('click', ()=> togglePanel(catBtn, catPanel));
        const listUl = catClone.querySelector('.skill-list');
        skills.sort((a,b)=> b.level - a.level).forEach(skill => {
            const row = itemTmpl.content.firstElementChild.cloneNode(true);
            row.dataset.skillId = skill.id;
            const toggle = row.querySelector('.skill-row-toggle');
            const rowPanel = row.querySelector('.skill-row-panel');
            const nameSpan = row.querySelector('.skill-row-name'); nameSpan.textContent = skill.name;
            const levelSpan = row.querySelector('.skill-row-level'); levelSpan.textContent = skill.level + '%';
            const progFill = row.querySelector('.skill-row-progress-fill'); requestAnimationFrame(()=> progFill.style.width = skill.level + '%');
            const desc = row.querySelector('.skill-row-desc'); desc.textContent = skill.description;
            const tags = row.querySelector('.skill-row-tags'); (skill.keywords||[]).slice(0,6).forEach(k=> { const t=document.createElement('span'); t.className='tag-sm'; t.textContent=k; tags.appendChild(t); });
            toggle.setAttribute('aria-controls', `row-panel-${skill.id}`); rowPanel.id = `row-panel-${skill.id}`;
            toggle.addEventListener('click', ()=> togglePanel(toggle, rowPanel));
            listUl.appendChild(row);
        });
        container.appendChild(catClone);
    });
}

function togglePanel(control, panel){
    const expanded = control.getAttribute('aria-expanded') === 'true';
    control.setAttribute('aria-expanded', String(!expanded));
    if(expanded){ panel.hidden = true; }
    else { panel.hidden = false; animatePanel(panel); }
}

function animatePanel(panel){
    panel.style.opacity=0; panel.style.transform='translateY(-4px)';
    requestAnimationFrame(()=> { panel.style.transition='opacity .35s ease, transform .35s ease'; panel.style.opacity=1; panel.style.transform='translateY(0)'; setTimeout(()=> { panel.style.transition=''; }, 400); });
}

function groupBy(arr, keyFn){ return arr.reduce((acc,item)=>{ const k=keyFn(item); (acc[k]=acc[k]||[]).push(item); return acc; }, {}); }

// Initialize after DOM content loaded
document.addEventListener('DOMContentLoaded', initSkillsExplorer);
// ===================== End Skills Explorer Redesign =====================