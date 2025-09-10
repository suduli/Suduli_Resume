/**
 * Browser Compatibility Utility
 * Part of task T058 - Perform cross-browser testing
 * 
 * This utility provides browser detection and feature detection
 * functions to help handle browser-specific issues.
 */

/**
 * Browser detection (use only when absolutely necessary)
 * Prefer feature detection over browser detection.
 */
export const browser = {
  /**
   * Check if current browser is Internet Explorer
   * @returns {boolean} True if the browser is IE
   */
  isIE: () => {
    return /*@cc_on!@*/false || !!document.documentMode;
  },
  
  /**
   * Check if current browser is Edge (EdgeHTML, not Chromium Edge)
   * @returns {boolean} True if the browser is Legacy Edge
   */
  isEdgeLegacy: () => {
    return !browser.isIE() && !!window.StyleMedia;
  },
  
  /**
   * Check if current browser is Firefox
   * @returns {boolean} True if the browser is Firefox
   */
  isFirefox: () => {
    return typeof InstallTrigger !== 'undefined';
  },
  
  /**
   * Check if current browser is Safari
   * @returns {boolean} True if the browser is Safari
   */
  isSafari: () => {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  },
  
  /**
   * Check if current browser is Chrome
   * @returns {boolean} True if the browser is Chrome
   */
  isChrome: () => {
    // More reliable Chrome detection that works better on mobile
    return !!window.chrome && 
      (!!window.chrome.webstore || !!window.chrome.runtime || 
       navigator.userAgent.indexOf('Chrome') > -1);
  },
  
  /**
   * Check if current device is iOS
   * @returns {boolean} True if the device is running iOS
   */
  isIOS: () => {
    return ((/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) || 
      // Detect iOS browsers with newer iPad User-Agent
      (/Macintosh/.test(navigator.userAgent) && 'ontouchend' in document));
  },
  
  /**
   * Check if current device is Android
   * @returns {boolean} True if the device is running Android
   */
  isAndroid: () => {
    return /Android/i.test(navigator.userAgent);
  },
  
  /**
   * Check if current device is mobile
   * @returns {boolean} True if the device is mobile
   */
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },
  
  /**
   * Get the current browser name and version
   * @returns {Object} Object with browser name and version
   */
  getBrowserInfo: () => {
    const ua = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';
    let match;
    
    // Chrome
    if ((match = ua.match(/(Chrome|Chromium)\/([0-9]+)\./))) {
      browserName = match[1];
      browserVersion = match[2];
    }
    // Firefox
    else if ((match = ua.match(/(Firefox)\/([0-9]+)\./))) {
      browserName = match[1];
      browserVersion = match[2];
    }
    // Safari
    else if ((match = ua.match(/(Safari)\/([0-9]+)\./))) {
      browserName = match[1];
      // Safari version is actually in the Version string
      const versionMatch = ua.match(/Version\/([0-9]+)\./);
      browserVersion = versionMatch ? versionMatch[1] : 'Unknown';
    }
    // IE
    else if ((match = ua.match(/(MSIE |Trident\/.*rv:)([0-9]+)\./))) {
      browserName = 'Internet Explorer';
      browserVersion = match[2];
    }
    // Edge
    else if ((match = ua.match(/(Edge|Edg)\/([0-9]+)\./))) {
      browserName = 'Edge';
      browserVersion = match[2];
    }
    
    return {
      name: browserName,
      version: browserVersion
    };
  }
};

/**
 * Feature detection (recommended approach)
 */
export const features = {
  /**
   * Check if CSS Grid is supported
   * @returns {boolean} True if CSS Grid is supported
   */
  supportsGrid: () => {
    return window.CSS && CSS.supports && CSS.supports('display', 'grid');
  },
  
  /**
   * Check if CSS Flexbox is supported
   * @returns {boolean} True if CSS Flexbox is supported
   */
  supportsFlexbox: () => {
    return window.CSS && CSS.supports && CSS.supports('display', 'flex');
  },
  
  /**
   * Check if CSS Custom Properties (Variables) are supported
   * @returns {boolean} True if CSS Custom Properties are supported
   */
  supportsCustomProperties: () => {
    return window.CSS && CSS.supports && CSS.supports('--test', '0');
  },
  
  /**
   * Check if Intersection Observer API is supported
   * @returns {boolean} True if Intersection Observer is supported
   */
  supportsIntersectionObserver: () => {
    return 'IntersectionObserver' in window;
  },
  
  /**
   * Check if WebGL is supported
   * @returns {boolean} True if WebGL is supported
   */
  supportsWebGL: () => {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  },
  
  /**
   * Check if ES6 features are supported
   * @returns {boolean} True if ES6 features are supported
   */
  supportsES6: () => {
    try {
      // Test arrow functions
      eval('const test = () => {};');
      // Test template literals
      eval('const test = `template literal`;');
      // Test destructuring
      eval('const { a, b } = { a: 1, b: 2 };');
      return true;
    } catch (e) {
      return false;
    }
  },
  
  /**
   * Check if Local Storage is supported and available
   * @returns {boolean} True if Local Storage is supported
   */
  supportsLocalStorage: () => {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  },
  
  /**
   * Check if Web Animations API is supported
   * @returns {boolean} True if Web Animations API is supported
   */
  supportsWebAnimations: () => {
    return 'animate' in document.createElement('div');
  }
};

/**
 * Browser-specific CSS classes
 * Adds classes to the html element for browser-specific styling
 */
export const addBrowserClasses = () => {
  const html = document.documentElement;
  const browserInfo = browser.getBrowserInfo();
  
  // Add browser name class
  html.classList.add(`browser-${browserInfo.name.toLowerCase().replace(/\s+/g, '-')}`);
  
  // Add browser version class
  html.classList.add(`browser-version-${browserInfo.version}`);
  
  // Add device type class
  if (browser.isMobile()) {
    html.classList.add('is-mobile');
    
    if (browser.isIOS()) {
      html.classList.add('is-ios');
    }
    
    if (browser.isAndroid()) {
      html.classList.add('is-android');
    }
  } else {
    html.classList.add('is-desktop');
  }
  
  // Add feature support classes
  if (!features.supportsGrid()) {
    html.classList.add('no-grid');
  }
  
  if (!features.supportsFlexbox()) {
    html.classList.add('no-flexbox');
  }
  
  if (!features.supportsCustomProperties()) {
    html.classList.add('no-css-variables');
  }
  
  if (!features.supportsWebGL()) {
    html.classList.add('no-webgl');
  }
  
  if (!features.supportsWebAnimations()) {
    html.classList.add('no-web-animations');
  }
  
  return browserInfo;
};

/**
 * Apply browser-specific fixes
 * This function applies workarounds for known browser issues
 */
export const applyBrowserFixes = () => {
  // Fix for Safari flexbox gap support
  if (browser.isSafari() && !CSS.supports('gap', '1px')) {
    document.documentElement.classList.add('no-flex-gap');
  }
  
  // Fix for IE11 custom property support
  if (browser.isIE()) {
    // Polyfill CSS Variables for IE11
    // This would typically be handled by a proper polyfill like css-vars-ponyfill
    console.warn('Internet Explorer detected. Some features may not work correctly.');
  }
  
  // Fix for iOS viewport height issues
  if (browser.isIOS()) {
    // Add viewport height fix for iOS
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);
    setVh();
  }
};

/**
 * Initialize browser compatibility handling
 * Call this function once at application startup
 * @returns {Object} Browser information
 */
export const initBrowserCompatibility = () => {
  const browserInfo = addBrowserClasses();
  applyBrowserFixes();
  
  // Log browser information in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log('Browser:', browserInfo.name, browserInfo.version);
    console.log('Mobile:', browser.isMobile());
    console.log('Features:', {
      grid: features.supportsGrid(),
      flexbox: features.supportsFlexbox(),
      cssVars: features.supportsCustomProperties(),
      intersectionObserver: features.supportsIntersectionObserver(),
      webGL: features.supportsWebGL(),
      es6: features.supportsES6(),
      localStorage: features.supportsLocalStorage(),
      webAnimations: features.supportsWebAnimations()
    });
  }
  
  return browserInfo;
};

export default {
  browser,
  features,
  addBrowserClasses,
  applyBrowserFixes,
  initBrowserCompatibility
};
