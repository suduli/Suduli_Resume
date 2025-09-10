/**
 * Mock implementation for IntersectionObserver
 * This mock handles both the constructor and instance methods properly
 */

export class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
    this.observerEntries = [];
    
    // Important: These methods need to be defined directly on the instance
    // or the JavaScript engine won't recognize them as functions
    this.observe = this.observe.bind(this);
    this.unobserve = this.unobserve.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.takeRecords = this.takeRecords.bind(this);
  }

  observe(element) {
    this.elements.add(element);
    
    // Simulate an intersection immediately for testing
    const entry = {
      isIntersecting: true,
      intersectionRatio: 1,
      target: element,
      time: Date.now(),
      boundingClientRect: element.getBoundingClientRect ? element.getBoundingClientRect() : {},
      intersectionRect: element.getBoundingClientRect ? element.getBoundingClientRect() : {},
      rootBounds: null
    };
    
    this.observerEntries.push(entry);
    
    // Call the callback asynchronously
    setTimeout(() => {
      this.callback([entry], this);
    }, 0);
    
    return this;
  }

  unobserve(element) {
    this.elements.delete(element);
    return this;
  }

  disconnect() {
    this.elements.clear();
    this.observerEntries = [];
    return this;
  }

  takeRecords() {
    return this.observerEntries;
  }
  
  // Helper method to manually trigger intersections for testing
  simulateIntersection(isIntersecting = true) {
    const entries = Array.from(this.elements).map(element => ({
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
      target: element,
      time: Date.now(),
      boundingClientRect: element.getBoundingClientRect ? element.getBoundingClientRect() : {},
      intersectionRect: isIntersecting && element.getBoundingClientRect ? element.getBoundingClientRect() : {},
      rootBounds: null
    }));
    
    if (entries.length > 0) {
      this.callback(entries, this);
    }
    
    return this;
  }
}

// Export the mocked class as the default export
const globalIntersectionObserver = IntersectionObserverMock;
export default globalIntersectionObserver;
