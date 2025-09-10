import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';
import BrowserDetection from '../../utils/BrowserDetection';
import styles from './ThemeSwitcher.module.css';



/**
 * ThemeSwitcher component that allows users to toggle between light and dark themes
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the switch ('small', 'medium', 'large')
 * @param {boolean} props.showLabel - Whether to show a text label
 * @param {string} props.labelPosition - Position of the label ('left' or 'right')
 * @returns {JSX.Element} Rendered ThemeSwitcher component
 */
const ThemeSwitcher = ({
  size = 'medium',
  showLabel = true,
  labelPosition = 'right',
  className,
  ...props
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [isChanging, setIsChanging] = useState(false);
  
  // Enhanced click handler with browser-specific optimizations
  const handleThemeToggle = useCallback((e) => {
    e.preventDefault();
    
    // Use browser detection utility
    const isEdge = BrowserDetection.isEdge();
    const isSafariMobile = BrowserDetection.isSafariMobile();
    
    // Set visual feedback state
    setIsChanging(true);
    
    if (isEdge) {
      // Edge-specific handling
      document.documentElement.classList.add('theme-transition');
      
      // Delay theme toggle to ensure visual feedback
      setTimeout(() => {
        toggleTheme();
        
        // Clean up after transition
        setTimeout(() => {
          document.documentElement.classList.remove('theme-transition');
          setIsChanging(false);
        }, 400);
      }, 50);
    } else if (isSafariMobile) {
      // Safari Mobile specific handling
      // First, remove transitions to ensure immediate application
      document.documentElement.classList.remove('safari-transitions-enabled');
      
      // Use a longer delay and force style recalculation
      setTimeout(() => {
        toggleTheme();
        
        // Force style recalculation
        const body = document.body;
        const display = body.style.display;
        body.style.display = 'none';
        void body.offsetHeight; // Trigger reflow
        body.style.display = display;
        
        // Force repaint the switcher component
        const switcher = document.querySelector(`.${styles.switcher}`);
        if (switcher) {
          const switcherDisplay = switcher.style.display;
          switcher.style.display = 'none';
          void switcher.offsetHeight; // Trigger reflow
          switcher.style.display = switcherDisplay;
        }
        
        // Re-enable transitions after theme change
        setTimeout(() => {
          document.documentElement.classList.add('safari-transitions-enabled');
          
          // Reset changing state after a longer delay
          setTimeout(() => {
            setIsChanging(false);
          }, 300);
        }, 200);
      }, 50);
    } else {
      // Standard handling for other browsers
      toggleTheme();
      
      // Reset state after animation completes
      setTimeout(() => {
        setIsChanging(false);
      }, 300);
    }
  }, [toggleTheme]);
  
  const switcherClasses = [
    styles.switcher,
    styles[`switcher-${size}`],
    isChanging ? styles.switching : '',
    className
  ].filter(Boolean).join(' ');
  
  const containerClasses = [
    styles.container,
    showLabel ? styles[`label-${labelPosition}`] : ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={containerClasses} data-testid="theme-switcher-container" {...props}>
      {showLabel && labelPosition === 'left' && (
        <span className={styles.label}>
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
      
      <button 
        type="button"
        className={switcherClasses}
        onClick={handleThemeToggle}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        data-testid="theme-switcher"
      >
        <div 
          className={`${styles.toggle} ${isDark ? styles.toggleDark : styles.toggleLight}`}
          aria-hidden="true"
        >
          <div className={styles.iconContainer}>
            {/* Sun icon for light mode */}
            <svg 
              className={`${styles.icon} ${styles.sunIcon}`} 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0-7a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm0 15a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1zM5.64 5.64a1 1 0 0 1 1.42 0l.7.7a1 1 0 0 1-1.41 1.42l-.7-.7a1 1 0 0 1 0-1.42zm10.6 10.6a1 1 0 0 1 1.42 0l.7.7a1 1 0 1 1-1.41 1.42l-.7-.7a1 1 0 0 1 0-1.42zM3 12a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2H4a1 1 0 0 1-1-1zm15 0a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2h-1a1 1 0 0 1-1-1zM5.64 18.36a1 1 0 0 1 0-1.42l.7-.7a1 1 0 0 1 1.42 1.42l-.7.7a1 1 0 0 1-1.42 0zm10.6-10.6a1 1 0 0 1 0-1.42l.7-.7a1 1 0 0 1 1.42 1.42l-.7.7a1 1 0 0 1-1.42 0z" />
            </svg>
            
            {/* Moon icon for dark mode */}
            <svg 
              className={`${styles.icon} ${styles.moonIcon}`} 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
            </svg>
          </div>
        </div>
      </button>
      
      {showLabel && labelPosition === 'right' && (
        <span className={styles.label}>
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </div>
  );
};

ThemeSwitcher.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showLabel: PropTypes.bool,
  labelPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string
};

export default ThemeSwitcher;
