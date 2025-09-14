/**
 * Local Storage Visit Counter
 * A fallback for environments without PHP
 */

// Check if PHP counter is available
(function() {
    // If the main counter class is not initialized yet, use local fallback
    if (typeof VisitCounter === 'undefined') {
        initLocalCounter();
    } else {
        // Test if PHP endpoint is accessible
        fetch('/counter/counter.php?action=get')
            .then(response => {
                if (!response.ok) {
                    throw new Error('PHP counter not available');
                }
                return response.json();
            })
            .catch(error => {
                console.log('Using localStorage fallback for visit counter');
                initLocalCounter();
            });
    }
    
    /**
     * Initialize local storage based counter
     */
    function initLocalCounter() {
        class LocalVisitCounter {
            constructor() {
                this.counterContainer = document.querySelector('.visit-counter');
                if (!this.counterContainer) return;
                
                this.totalElement = this.counterContainer.querySelector('.total-visits .count');
                this.uniqueElement = this.counterContainer.querySelector('.unique-visits .count');
                
                this.storageKey = 'resume_visit_counter';
                this.visitorIdKey = 'resume_visitor_id';
                
                this.init();
            }
            
            init() {
                // Load or initialize counter data
                const data = this.getCounterData();
                
                // Check if this is a new visit
                if (this.isNewVisit()) {
                    data.totalVisits++;
                    data.uniqueVisits++;
                    this.saveCounterData(data);
                }
                
                // Update display
                this.updateDisplay(data);
            }
            
            getCounterData() {
                const storedData = localStorage.getItem(this.storageKey);
                if (!storedData) {
                    return { totalVisits: 0, uniqueVisits: 0 };
                }
                return JSON.parse(storedData);
            }
            
            saveCounterData(data) {
                localStorage.setItem(this.storageKey, JSON.stringify(data));
            }
            
            isNewVisit() {
                const visitorId = this.generateVisitorId();
                const storedVisitorId = localStorage.getItem(this.visitorIdKey);
                
                if (!storedVisitorId) {
                    localStorage.setItem(this.visitorIdKey, visitorId);
                    return true;
                }
                
                return false;
            }
            
            generateVisitorId() {
                // Simple hash for visitor ID
                const randomPart = Math.random().toString(36).substring(2, 15);
                const datePart = Date.now().toString(36);
                return randomPart + datePart;
            }
            
            updateDisplay(data) {
                if (this.totalElement) {
                    this.animateCount(this.totalElement, data.totalVisits);
                }
                
                if (this.uniqueElement) {
                    this.animateCount(this.uniqueElement, data.uniqueVisits);
                }
            }
            
            animateCount(element, value) {
                const duration = 1000;
                const startValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
                const startTime = performance.now();
                
                const animate = (currentTime) => {
                    const elapsedTime = currentTime - startTime;
                    
                    if (elapsedTime < duration) {
                        const progress = elapsedTime / duration;
                        const currentCount = Math.floor(startValue + progress * (value - startValue));
                        element.textContent = this.formatNumber(currentCount);
                        requestAnimationFrame(animate);
                    } else {
                        element.textContent = this.formatNumber(value);
                    }
                };
                
                requestAnimationFrame(animate);
            }
            
            formatNumber(num) {
                return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        }
        
        // Initialize the local counter
        document.addEventListener('DOMContentLoaded', () => {
            new LocalVisitCounter();
        });
    }
})();
