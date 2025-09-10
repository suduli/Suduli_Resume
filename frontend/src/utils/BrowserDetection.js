/**
 * Browser Detection Utility
 * 
 * This utility provides consistent browser detection methods across the application.
 * It helps identify specific browsers like Edge and Safari Mobile for targeted fixes.
 */

const BrowserDetection = {
  /**
   * Check if the browser is Microsoft Edge
   * @returns {boolean} True if the browser is Edge
   */
  isEdge() {
    return /Edg/.test(navigator.userAgent);
  },
  
  /**
   * Check if the browser is Google Chrome
   * @returns {boolean} True if the browser is Chrome (and not Edge)
   */
  isChrome() {
    return /Chrome/.test(navigator.userAgent) && !/Edge|Edg/.test(navigator.userAgent);
  },
  
  /**
   * Check if the browser is Safari on iOS (iPhone, iPad, iPod)
   * @returns {boolean} True if the browser is Safari Mobile
   */
  isSafariMobile() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  },
  
  /**
   * Check if the browser is Safari (desktop or mobile)
   * @returns {boolean} True if the browser is Safari
   */
  isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  },
  
  /**
   * Check if the browser is Firefox
   * @returns {boolean} True if the browser is Firefox
   */
  isFirefox() {
    return /Firefox/.test(navigator.userAgent);
  },
  
  /**
   * Check if the device is iOS (iPhone, iPad, iPod)
   * @returns {boolean} True if the device is iOS
   */
  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  },
  
  /**
   * Check if the device is Android
   * @returns {boolean} True if the device is Android
   */
  isAndroid() {
    return /Android/.test(navigator.userAgent);
  },
  
  /**
   * Check if the device is a mobile device
   * @returns {boolean} True if the device is mobile
   */
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },
  
  /**
   * Apply browser-specific CSS classes to the document root element
   * This helps with CSS targeting specific browsers for fixes
   */
  applyBrowserClasses() {
    const html = document.documentElement;
    
    if (this.isEdge()) {
      html.classList.add('browser-edge');
    }
    
    if (this.isChrome()) {
      html.classList.add('browser-chrome');
    }
    
    if (this.isSafariMobile()) {
      html.classList.add('browser-safari-mobile');
    } else if (this.isSafari()) {
      html.classList.add('browser-safari');
    }
    
    if (this.isFirefox()) {
      html.classList.add('browser-firefox');
    }
    
    if (this.isMobile()) {
      html.classList.add('device-mobile');
      
      if (this.isIOS()) {
        html.classList.add('device-ios');
      } else if (this.isAndroid()) {
        html.classList.add('device-android');
      }
    } else {
      html.classList.add('device-desktop');
    }
  }
};

export default BrowserDetection;
