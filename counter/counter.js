/**
 * Visit Counter JavaScript
 * A lightweight script to track and display website visits
 * With automatic fallback to localStorage if PHP is not available
 */

class VisitCounter {
    constructor(options = {}) {
        this.options = {
            apiEndpoint: options.apiEndpoint || 'counter.php',
            counterSelector: options.counterSelector || '.visit-counter',
            updateInterval: options.updateInterval || 60000, // 1 minute in ms
            animationDuration: options.animationDuration || 1000,
            updateOnLoad: options.updateOnLoad !== false,
            countUpAnimation: options.countUpAnimation !== false,
            formatNumbers: options.formatNumbers !== false,
            fallbackScript: options.fallbackScript || 'counter-fallback.js',
            storageKey: options.storageKey || 'resume_visit_counter',
            visitorKey: options.visitorKey || 'resume_visitor_id'
        };
        
        this.counterElements = {
            totalVisits: null,
            uniqueVisits: null
        };
        
        this.data = {
            totalVisits: 0,
            uniqueVisits: 0
        };
        
        this.usingFallback = false;
        
        // Initialize immediately if DOM is already loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    /**
     * Initialize the visit counter
     */
    init() {
        // Find counter elements
        this.findCounterElements();
        
        // Try to use PHP counter first
        this.fetchCounterData()
            .then(() => {
                if (this.options.updateOnLoad && !this.usingFallback) {
                    this.incrementCounter();
                }
            })
            .catch(error => {
                console.warn('Visit counter PHP error, using fallback:', error);
                this.loadFallbackCounter();
            });
        
        // Set up periodic updates if needed
        if (this.options.updateInterval > 0) {
            setInterval(() => {
                if (!this.usingFallback) {
                    this.fetchCounterData().catch(() => {});
                }
            }, this.options.updateInterval);
        }
    }
    
    /**
     * Load the fallback counter implementation
     */
    loadFallbackCounter() {
        this.usingFallback = true;
        
        // Use a simple in-memory counter if the fallback script fails
        this.data.totalVisits = parseInt(localStorage.getItem('totalVisits') || '0');
        this.updateCounterDisplay();
        
        const script = document.createElement('script');
        script.src = this.options.fallbackScript;
        script.onload = () => {
            console.log('Fallback counter loaded successfully');
        };
        script.onerror = (error) => {
            console.error('Error loading fallback counter:', error);
        };
        document.head.appendChild(script);
    }
    
    /**
     * Find and store references to counter elements
     */
    findCounterElements() {
        const container = document.querySelector(this.options.counterSelector);
        if (!container) {
            console.warn('Counter container not found:', this.options.counterSelector);
            return;
        }
        
        this.counterElements.totalVisits = container.querySelector('.total-visits .count');
        this.counterElements.uniqueVisits = container.querySelector('.unique-visits .count');
        
        if (!this.counterElements.totalVisits) {
            console.warn('Total visits counter element not found');
        }
        
        if (!this.counterElements.uniqueVisits) {
            console.warn('Unique visits counter element not found');
        }
    }
    
    /**
     * Format numbers with comma separators
     */
    formatNumber(num) {
        if (!this.options.formatNumbers) return num.toString();
        return new Intl.NumberFormat().format(num);
    }
    
    /**
     * Animate counting up to a number
     */
    animateCount(element, targetValue) {
        if (!element) return;
        
        const startValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
        const duration = this.options.animationDuration;
        const startTime = performance.now();
        
        const updateCount = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            
            if (elapsedTime < duration) {
                const progress = elapsedTime / duration;
                // Easing function (ease out cubic)
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentCount = Math.floor(startValue + easeProgress * (targetValue - startValue));
                element.textContent = this.formatNumber(currentCount);
                requestAnimationFrame(updateCount);
            } else {
                element.textContent = this.formatNumber(targetValue);
            }
        };
        
        if (this.options.countUpAnimation) {
            requestAnimationFrame(updateCount);
        } else {
            element.textContent = this.formatNumber(targetValue);
        }
    }
    
    /**
     * Update counter display elements
     */
    updateCounterDisplay() {
        if (this.counterElements.totalVisits) {
            this.animateCount(this.counterElements.totalVisits, this.data.totalVisits);
        }
        
        if (this.counterElements.uniqueVisits) {
            this.animateCount(this.counterElements.uniqueVisits, this.data.uniqueVisits);
        }
    }
    
    /**
     * Fetch current counter data from the server
     */
    async fetchCounterData() {
        try {
            if (this.usingFallback) {
                // If using fallback, just return the current data
                this.updateCounterDisplay();
                return this.data;
            }
            
            const response = await fetch(`${this.options.apiEndpoint}?action=get&t=${Date.now()}`);
            if (!response.ok) throw new Error('Failed to fetch counter data');
            
            const data = await response.json();
            this.data.totalVisits = parseInt(data.totalVisits) || 0;
            this.data.uniqueVisits = parseInt(data.uniqueVisits) || 0;
            
            this.updateCounterDisplay();
            return data;
        } catch (error) {
            console.error('Error fetching counter data:', error);
            if (!this.usingFallback) {
                this.loadFallbackCounter();
                return this.fetchCounterData(); // Try again with fallback
            }
            throw error;
        }
    }
    
    /**
     * Increment the counter on the server
     */
    async incrementCounter() {
        try {
            if (this.usingFallback) {
                // If using fallback, increment manually
                this.data.totalVisits++;
                this.data.uniqueVisits = Math.max(1, this.data.uniqueVisits);
                localStorage.setItem('totalVisits', this.data.totalVisits.toString());
                this.updateCounterDisplay();
                return this.data;
            }
            
            const response = await fetch(`${this.options.apiEndpoint}?action=increment&t=${Date.now()}`);
            if (!response.ok) throw new Error('Failed to increment counter');
            
            const data = await response.json();
            this.data.totalVisits = parseInt(data.totalVisits) || 0;
            this.data.uniqueVisits = parseInt(data.uniqueVisits) || 0;
            
            this.updateCounterDisplay();
            return data;
        } catch (error) {
            console.error('Error incrementing counter:', error);
            if (!this.usingFallback) {
                this.loadFallbackCounter();
                return this.incrementCounter(); // Try again with fallback
            }
            return this.data;
        }
    }
    
    /**
     * Decrement the counter 
     */
    decrementCounter() {
        // Don't go below zero
        if (this.data.totalVisits > 0) {
            this.data.totalVisits--;
            
            // Update the display
            this.updateCounterDisplay();
            
            // Store the value if in fallback mode
            if (this.usingFallback) {
                localStorage.setItem('totalVisits', this.data.totalVisits.toString());
            }
        }
        
        return this.data;
    }
}

// Initialize the visit counter with default options
const visitCounter = new VisitCounter({
    apiEndpoint: 'counter.php',  // Relative path from where the script is included
    updateOnLoad: false,         // Don't update on load for testing
    countUpAnimation: true,
    fallbackScript: 'counter-fallback.js'  // Relative path from where the script is included
});
