/**
 * Data Service
 * Implementation for task T030
 * Performance optimizations for task T054
 * 
 * This service is responsible for:
 * - Loading data from JSON files
 * - Providing data to components
 * - Caching data in localStorage and memory
 */

import localforage from 'localforage';

// Constants
const CACHE_VERSION = '1.1';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CACHE_METADATA_KEY = 'portfolio_cache_metadata';

// In-memory cache for even faster data access
const memoryCache = new Map();

/**
 * Get cache key for a specific data type
 * @param {string} dataType - The type of data (e.g., 'profile', 'experience')
 * @returns {string} The cache key
 */
const getCacheKey = (dataType) => `portfolio_${dataType}_data`;

/**
 * DataService class for handling data loading and caching
 */
class DataService {
  constructor() {
    // Configure localforage
    localforage.config({
      name: 'portfolio-cache',
      storeName: 'portfolio-data',
      description: 'Portfolio website data cache'
    });
    
    this.initializePrefetch();
  }
  
  /**
   * Initialize prefetching of critical data
   * This improves performance by loading data in the background
   */
  async initializePrefetch() {
    // Prefetch most critical data in the background
    setTimeout(() => {
      this.loadProfile().catch(err => console.warn('Prefetch profile failed:', err));
      this.loadSkills().catch(err => console.warn('Prefetch skills failed:', err));
    }, 100);
    
    // Prefetch secondary data with a delay
    setTimeout(() => {
      this.loadExperience().catch(err => console.warn('Prefetch experience failed:', err));
      this.loadProjects().catch(err => console.warn('Prefetch projects failed:', err));
    }, 1000);
    
    // Preload any images that may be referenced in the data
    this.preloadImages();
  }
  
  /**
   * Preload images used in the portfolio
   */
  preloadImages() {
    // Common image paths that should be preloaded
    const imagesToPreload = [
      '/images/logo.png',
      '/images/favicon.ico',
      '/images/profile.jpg'
    ];
    
    // Create image objects to trigger loading
    imagesToPreload.forEach(path => {
      const img = new Image();
      img.src = path;
    });
  }

  /**
   * Fetch data from a JSON file with retries
   * @param {string} path - The path to the JSON file
   * @param {string} dataType - The type of data being fetched (for error messages)
   * @param {number} retries - Number of retries (default: 2)
   * @returns {Promise<any>} The parsed JSON data
   * @throws {Error} If the fetch fails or the response is not OK
   */
  async fetchData(path, dataType, retries = 2) {
    try {
      // Detect Safari Mobile
      const isSafariMobile = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      
      let response;
      
      if (isSafariMobile) {
        // Special handling for Safari Mobile
        // Avoid using Promise.race and timeouts that can cause issues
        response = await fetch(path, { 
          headers: { 
            'Cache-Control': 'no-cache', 
            'Pragma': 'no-cache',
            // Safari Mobile sometimes needs this explicit content type
            'Accept': 'application/json'
          },
          credentials: 'same-origin',
          // Use a longer cache time for Safari Mobile
          cache: 'default'
        });
      } else {
        // Standard approach for other browsers
        // Use Promise with timeout instead of AbortController for better browser support
        const fetchPromise = fetch(path, { 
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
          credentials: 'same-origin'
        });
        
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          const id = setTimeout(() => {
            clearTimeout(id);
            reject(new Error('Request timed out'));
          }, 10000);
        });
        
        // Race the fetch against the timeout
        response = await Promise.race([fetchPromise, timeoutPromise]);
      }
      
      if (!response.ok) {
        const errorMessage = `Failed to load ${dataType} data: ${response.status} ${response.statusText}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
      
      // For improved browser compatibility, handle JSON parsing errors separately
      try {
        // Prefer text() parsing to match environment compatibility
        const text = await response.text();
        // Catch empty responses
        if (!text || !text.trim()) {
          throw new Error('Empty response');
        }
        try {
          return JSON.parse(text);
        } catch (jsonError) {
          // Fallback: some tests/mock implementations return a json() method instead
          if (typeof response.json === 'function') {
            try {
              return await response.json();
            } catch (fJsonErr) {
              console.error(`Fallback JSON parse failed for ${dataType}:`, fJsonErr);
              throw new Error(`Failed to parse ${dataType} data: Invalid JSON`);
            }
          }
          console.error(`Error parsing JSON for ${dataType}:`, jsonError);
          throw new Error(`Failed to parse ${dataType} data: Invalid JSON`);
        }
      } catch (textError) {
        // If response.text() itself fails (or was empty), try response.json()
        if (typeof response.json === 'function') {
          try {
            return await response.json();
          } catch (err) {
            console.error(`Error parsing JSON via response.json for ${dataType}:`, err);
            throw new Error(`Failed to parse ${dataType} data: Invalid JSON`);
          }
        }
        console.error(`Error parsing response for ${dataType}:`, textError);
        throw new Error(`Failed to load ${dataType} data`);
      }
    } catch (error) {
      // If we have retries left and it's a network error or timeout, retry
      if (retries > 0 && (
        error.name === 'AbortError' || 
        error.name === 'TypeError' || 
        error.message === 'Request timed out' ||
        error.message.includes('NetworkError') ||
        error.message.includes('Empty response')
      )) {
        console.warn(`Retrying fetch for ${dataType} (${retries} retries left)`);
        // Add exponential backoff delay for network issues
        await new Promise(resolve => setTimeout(resolve, 1000 * (3 - retries)));
        return this.fetchData(path, dataType, retries - 1);
      }
      
      // If it's already our custom error with status code, rethrow it
      if (error.message.startsWith(`Failed to load ${dataType} data: `)) {
        throw error;
      }
      
      // Otherwise, wrap it in our custom error
      console.error(`Error fetching ${dataType} data:`, error);
      throw new Error(`Failed to load ${dataType} data`);
    }
  }

  /**
   * Save data to both memory cache and persistent storage
   * @param {string} dataType - The type of data being cached
   * @param {any} data - The data to cache
   */
  async saveToCache(dataType, data) {
    try {
      const cacheKey = getCacheKey(dataType);
      const cacheItem = {
        data,
        timestamp: Date.now()
      };
      
      // Save to memory cache for fast access
      memoryCache.set(cacheKey, cacheItem);
      
      // Save to persistent storage (localforage)
      await localforage.setItem(cacheKey, cacheItem);
      
      // Update cache metadata
      await this.updateCacheMetadata();
    } catch (error) {
      console.warn(`Failed to cache ${dataType} data:`, error);
    }
  }

  /**
   * Get data from cache (first checks memory, then persistent storage)
   * @param {string} dataType - The type of data to retrieve
   * @returns {Promise<any|null>} The cached data or null if not in cache or expired
   */
  async getFromCache(dataType) {
    try {
      const cacheKey = getCacheKey(dataType);
      
      // First check memory cache for fastest access
      if (memoryCache.has(cacheKey)) {
        const memoryCachedItem = memoryCache.get(cacheKey);
        
        // Check if memory cache is still valid
        if (Date.now() - memoryCachedItem.timestamp <= CACHE_DURATION) {
          return memoryCachedItem.data;
        }
        
        // Memory cache expired, remove it
        memoryCache.delete(cacheKey);
      }
      
      // Check persistent storage
      const cachedItem = await localforage.getItem(cacheKey);
      
      if (!cachedItem) return null;
      
      // Check if the persistent cache is still valid
      if (Date.now() - cachedItem.timestamp > CACHE_DURATION) {
        // Cache is expired
        await localforage.removeItem(cacheKey);
        return null;
      }
      
      // Add to memory cache for future fast access
      memoryCache.set(cacheKey, cachedItem);
      
      return cachedItem.data;
    } catch (error) {
      console.warn(`Failed to retrieve ${dataType} data from cache:`, error);
      return null;
    }
  }

  /**
   * Update cache metadata with the current timestamp and version
   */
  async updateCacheMetadata() {
    try {
      const metadata = {
        timestamp: Date.now(),
        version: CACHE_VERSION
      };
      
      await localforage.setItem(CACHE_METADATA_KEY, metadata);
    } catch (error) {
      console.warn('Failed to update cache metadata:', error);
    }
  }

  /**
   * Get cache metadata
   * @returns {Promise<Object|null>} The cache metadata or null if not available
   */
  async getCacheMetadata() {
    try {
      return await localforage.getItem(CACHE_METADATA_KEY);
    } catch (error) {
      console.warn('Failed to get cache metadata:', error);
      return null;
    }
  }

  /**
   * Load data with caching
   * @param {string} path - The path to the JSON file
   * @param {string} dataType - The type of data being loaded
   * @param {boolean} forceRefresh - Whether to force a refresh from the server
   * @returns {Promise<any>} The loaded data
   */
  async loadDataWithCaching(path, dataType, forceRefresh = false) {
    // If not forcing a refresh, try to get from cache first
    if (!forceRefresh) {
      const cachedData = await this.getFromCache(dataType);
      
      if (cachedData) {
        return cachedData;
      }
    }
    
    // Not in cache, expired, or forcing refresh - fetch fresh data
    const data = await this.fetchData(path, dataType);
    
    // Save to cache for future use
    await this.saveToCache(dataType, data);
    
    return data;
  }

  /**
   * Load profile data
   * @param {boolean} forceRefresh - Whether to force a refresh from the server
   * @returns {Promise<Object>} Profile data
   */
  async loadProfile(forceRefresh = false) {
    return await this.loadDataWithCaching('/data/profile.json', 'profile', forceRefresh);
  }
  
  /**
   * Load experience data
   * @param {boolean} forceRefresh - Whether to force a refresh from the server
   * @returns {Promise<Array>} Experience data
   */
  async loadExperience(forceRefresh = false) {
    return await this.loadDataWithCaching('/data/experience.json', 'experience', forceRefresh);
  }
  
  /**
   * Load projects data
   * @param {boolean} forceRefresh - Whether to force a refresh from the server
   * @returns {Promise<Array>} Projects data
   */
  async loadProjects(forceRefresh = false) {
    return await this.loadDataWithCaching('/data/projects.json', 'projects', forceRefresh);
  }
  
  /**
   * Load skills data
   * @param {boolean} forceRefresh - Whether to force a refresh from the server
   * @returns {Promise<Object>} Skills data
   */
  async loadSkills(forceRefresh = false) {
    return await this.loadDataWithCaching('/data/skills.json', 'skills', forceRefresh);
  }
  
  /**
   * Load education data
   * @param {boolean} forceRefresh - Whether to force a refresh from the server
   * @returns {Promise<Array>} Education data
   */
  async loadEducation(forceRefresh = false) {
    return await this.loadDataWithCaching('/data/education.json', 'education', forceRefresh);
  }
  
  /**
   * Load awards data
   * @param {boolean} forceRefresh - Whether to force a refresh from the server
   * @returns {Promise<Array>} Awards data
   */
  async loadAwards(forceRefresh = false) {
    return await this.loadDataWithCaching('/data/awards.json', 'awards', forceRefresh);
  }
  
  /**
   * Load languages data
   * @param {boolean} forceRefresh - Whether to force a refresh from the server
   * @returns {Promise<Array>} Languages data
   */
  async loadLanguages(forceRefresh = false) {
    return await this.loadDataWithCaching('/data/languages.json', 'languages', forceRefresh);
  }
  
  /**
   * Load contact form data
   * @param {boolean} forceRefresh - Whether to force a refresh from the server
   * @returns {Promise<Object>} Contact form data
   */
  async loadContactForm(forceRefresh = false) {
    return await this.loadDataWithCaching('/data/contact-form.json', 'contactForm', forceRefresh);
  }
  
  /**
   * Load all data at once, optimized with Promise.allSettled to handle partial failures
   * @param {boolean} forceRefresh - Whether to force a refresh from the server
   * @returns {Promise<Object>} Complete portfolio data
   */
  async loadAll(forceRefresh = false) {
    const results = await Promise.allSettled([
      this.loadProfile(forceRefresh),
      this.loadExperience(forceRefresh),
      this.loadProjects(forceRefresh),
      this.loadSkills(forceRefresh),
      this.loadEducation(forceRefresh),
      this.loadAwards(forceRefresh),
      this.loadLanguages(forceRefresh),
      this.loadContactForm(forceRefresh)
    ]);
    
    // Process results, providing defaults for any that failed
    return {
      profile: results[0].status === 'fulfilled' ? results[0].value : {},
      experience: results[1].status === 'fulfilled' ? results[1].value : [],
      projects: results[2].status === 'fulfilled' ? results[2].value : [],
      skills: results[3].status === 'fulfilled' ? results[3].value : [],
      education: results[4].status === 'fulfilled' ? results[4].value : [],
      awards: results[5].status === 'fulfilled' ? results[5].value : [],
      languages: results[6].status === 'fulfilled' ? results[6].value : [],
      contactForm: results[7].status === 'fulfilled' ? results[7].value : {}
    };
  }
  
  /**
   * Clear all cached data (both memory and persistent)
   */
  async clearCache() {
    try {
      // Clear memory cache
      memoryCache.clear();
      
      // Clear persistent storage
      await localforage.clear();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }
  
  /**
   * Check if the cache is valid
   * @returns {Promise<boolean>} True if the cache is valid, false otherwise
   */
  async isCacheValid() {
    const metadata = await this.getCacheMetadata();
    
    if (!metadata) return false;
    
    // Check if the cache version is current
    if (metadata.version !== CACHE_VERSION) return false;
    
    // Check if the cache is still within the duration limit
    return (Date.now() - metadata.timestamp <= CACHE_DURATION);
  }
  
  /**
   * Get the age of the cache in seconds
   * @returns {Promise<number>} The age of the cache in seconds, or 0 if no cache
   */
  async getCacheAge() {
    const metadata = await this.getCacheMetadata();
    
    if (!metadata) return 0;
    
    return Math.floor((Date.now() - metadata.timestamp) / 1000);
  }
}

export default DataService;
