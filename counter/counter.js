/**
 * Visit Counter JavaScript
 * A lightweight script to track and display website visits
 */

class VisitCounter {
    constructor(options = {}) {
        this.options = {
            apiEndpoint: options.apiEndpoint || '/counter/counter.php',
            counterSelector: options.counterSelector || '.visit-counter',
            updateInterval: options.updateInterval || 60000, // 1 minute in ms
            animationDuration: options.animationDuration || 1000,
            updateOnLoad: options.updateOnLoad !== false,
            countUpAnimation: options.countUpAnimation !== false,
            formatNumbers: options.formatNumbers !== false
        };
        
        this.counterElements = {
            totalVisits: null,
            uniqueVisits: null
        };
        
        this.data = {
            totalVisits: 0,
            uniqueVisits: 0
        };
        
        this.init();
    }
    
    /**
     * Initialize the visit counter
     */
    init() {
        // Initialize counter elements once DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            this.findCounterElements();
            
            // Get initial counter data
            this.fetchCounterData()
                .then(() => {
                    if (this.options.updateOnLoad) {
                        this.incrementCounter();
                    }
                })
                .catch(error => console.error('Visit counter error:', error));
            
            // Set up periodic updates if needed
            if (this.options.updateInterval > 0) {
                setInterval(() => this.fetchCounterData(), this.options.updateInterval);
            }
        });
    }
    
    /**
     * Find and store references to counter elements
     */
    findCounterElements() {
        const container = document.querySelector(this.options.counterSelector);
        if (!container) return;
        
        this.counterElements.totalVisits = container.querySelector('.total-visits .count');
        this.counterElements.uniqueVisits = container.querySelector('.unique-visits .count');
    }
    
    /**
     * Format numbers with comma separators
     */
    formatNumber(num) {
        if (!this.options.formatNumbers) return num.toString();
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                const currentCount = Math.floor(startValue + progress * (targetValue - startValue));
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
            const response = await fetch(`${this.options.apiEndpoint}?action=get&t=${Date.now()}`);
            if (!response.ok) throw new Error('Failed to fetch counter data');
            
            const data = await response.json();
            this.data.totalVisits = parseInt(data.totalVisits) || 0;
            this.data.uniqueVisits = parseInt(data.uniqueVisits) || 0;
            
            this.updateCounterDisplay();
            return data;
        } catch (error) {
            console.error('Error fetching counter data:', error);
            return this.data;
        }
    }
    
    /**
     * Increment the counter on the server
     */
    async incrementCounter() {
        try {
            const response = await fetch(`${this.options.apiEndpoint}?action=increment&t=${Date.now()}`);
            if (!response.ok) throw new Error('Failed to increment counter');
            
            const data = await response.json();
            this.data.totalVisits = parseInt(data.totalVisits) || 0;
            this.data.uniqueVisits = parseInt(data.uniqueVisits) || 0;
            
            this.updateCounterDisplay();
            return data;
        } catch (error) {
            console.error('Error incrementing counter:', error);
            return this.data;
        }
    }
}

// Initialize the visit counter with default options
const visitCounter = new VisitCounter({
    apiEndpoint: '/counter/counter.php',
    updateOnLoad: true,
    countUpAnimation: true
});
