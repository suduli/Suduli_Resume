/**
 * Local Storage Visit Counter
 * A robust script to track and display website visits using localStorage
 */

class LocalVisitCounter {
    constructor(options = {}) {
        this.options = {
            counterSelector: options.counterSelector || '.visit-counter',
            totalSelector: options.totalSelector || '.total-visits .count',
            uniqueSelector: options.uniqueSelector || '.unique-visits .count',
            storageKey: options.storageKey || 'resume_visit_counter',
            visitorKey: options.visitorKey || 'resume_visitor_id',
            cookieExpiration: options.cookieExpiration || 24,
            updateInterval: options.updateInterval || 60000, // 1 minute
            animationDuration: options.animationDuration || 1000
        };
        
        this.counterData = {
            totalVisits: 0,
            uniqueVisits: 0,
            lastVisit: 0
        };
        
        this.elements = {
            counter: document.querySelector(this.options.counterSelector),
            totalVisits: document.querySelector(this.options.totalSelector),
            uniqueVisits: document.querySelector(this.options.uniqueSelector)
        };
        
        // Check if localStorage is available
        this.hasLocalStorage = this.checkLocalStorage();
        
        if (this.hasLocalStorage) {
            this.init();
        } else {
            console.warn('localStorage is not available. Visit counter will not work.');
        }
    }
    
    checkLocalStorage() {
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    init() {
        // Load existing data
        this.loadData();
        
        // Record this visit
        this.recordVisit();
        
        // Display counter
        this.updateDisplay();
        
        // Set interval for periodic updates if needed
        if (this.options.updateInterval > 0) {
            setInterval(() => this.updateDisplay(), this.options.updateInterval);
        }
    }
    
    loadData() {
        try {
            const storedData = localStorage.getItem(this.options.storageKey);
            if (storedData) {
                this.counterData = JSON.parse(storedData);
            }
        } catch (e) {
            console.error('Error loading counter data:', e);
        }
    }
    
    saveData() {
        try {
            localStorage.setItem(this.options.storageKey, JSON.stringify(this.counterData));
        } catch (e) {
            console.error('Error saving counter data:', e);
        }
    }
    
    isNewVisitor() {
        const visitorKey = this.options.visitorKey;
        
        // Check if visitor ID exists in localStorage
        if (!localStorage.getItem(visitorKey)) {
            // Store the visitor ID
            localStorage.setItem(visitorKey, this.getVisitorId());
            return true;
        }
        
        // Not a new visitor
        return false;
    }
    
    getVisitorId() {
        // Simple visitor ID based on browser and device
        const userAgent = navigator.userAgent;
        const screenSize = `${window.screen.width}x${window.screen.height}`;
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const random = Math.random().toString(36).substring(2, 15);
        
        // Create a simple hash string
        const visitorString = `${userAgent}|${screenSize}|${timeZone}|${Date.now()}|${random}`;
        
        // Create a simple hash
        let hash = 0;
        for (let i = 0; i < visitorString.length; i++) {
            const char = visitorString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        
        return Math.abs(hash).toString(36);
    }
    
    recordVisit() {
        // Increment total visits
        this.counterData.totalVisits++;
        
        // Check if this is a new visitor
        if (this.isNewVisitor()) {
            this.counterData.uniqueVisits++;
        }
        
        // Update last visit timestamp
        this.counterData.lastVisit = Date.now();
        
        // Save data
        this.saveData();
    }
    
    formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    }
    
    updateDisplay() {
        if (!this.elements.counter) return;
        
        // Ensure counter is visible
        this.elements.counter.style.opacity = '1';
        
        // Update counter elements if they exist
        if (this.elements.totalVisits) {
            this.animateCounter(this.elements.totalVisits, this.counterData.totalVisits);
        }
        
        if (this.elements.uniqueVisits) {
            this.animateCounter(this.elements.uniqueVisits, this.counterData.uniqueVisits);
        }
    }
    
    animateCounter(element, targetValue) {
        // Get current displayed value
        const currentValue = parseInt(element.textContent.replace(/,/g, ''), 10) || 0;
        
        // Don't animate if the values are the same
        if (currentValue === targetValue) return;
        
        // Animate the counter
        const duration = this.options.animationDuration;
        const startTime = performance.now();
        const updateCount = timestamp => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease out cubic)
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            // Calculate current count value
            const currentCount = Math.floor(currentValue + (targetValue - currentValue) * easeProgress);
            
            // Update element
            element.textContent = this.formatNumber(currentCount);
            
            // Continue animation if not complete
            if (progress < 1) {
                requestAnimationFrame(updateCount);
            }
        };
        
        requestAnimationFrame(updateCount);
    }
}

// Initialize counter on page load
(function() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCounter);
    } else {
        initCounter();
    }

    function initCounter() {
        // Initialize the counter
        window.localVisitCounter = new LocalVisitCounter();
        
        // Log for debugging
        console.log('LocalVisitCounter initialized');
    }
})();
