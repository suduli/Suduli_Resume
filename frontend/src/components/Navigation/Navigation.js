import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import styles from './Navigation.module.css';

/**
 * Navigation component that provides site navigation and theme switching
 * @param {Object} props - Component props
 * @param {Array} props.navItems - Array of navigation items
 * @param {Function} props.onNavigate - Navigation callback function
 * @param {boolean} props.showThemeSwitcher - Whether to show the theme switcher
 * @returns {JSX.Element} Rendered Navigation component
 */
const Navigation = ({
  navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ],
  onNavigate,
  showThemeSwitcher = true,
  className,
  ...props
}) => {
  const { theme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const navRef = useRef(null);
  
  // Detect touch device
  useEffect(() => {
    setIsTouchDevice(
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 || 
      navigator.msMaxTouchPoints > 0
    );
  }, []);
  
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Auto-close mobile menu on resize to desktop
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);
  
  // Handle scroll to detect when to change navigation style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Determine active section based on scroll position
      const sections = navItems.map(item => item.id);
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && 
          !navRef.current.contains(event.target) && 
          isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);
  
  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isMobileMenuOpen]);
  
  // Handle mobile menu body scroll locking
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Handle navigation click
  const handleNavClick = (sectionId) => {
    // Chrome Mobile sometimes has issues with smooth scrolling
    const isChromeOnMobile = /Android.*Chrome\//.test(navigator.userAgent) || 
                             /Chrome.*Mobile/.test(navigator.userAgent);
                             
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      // Default behavior: scroll to section
      const section = document.getElementById(sectionId);
      if (section) {
        // Use different scrolling behavior for Chrome Mobile
        if (isChromeOnMobile) {
          // Use regular scrolling for Chrome Mobile
          window.scrollTo(0, section.offsetTop - 80);
        } else {
          // Use smooth scrolling for other browsers
          window.scrollTo({
            top: section.offsetTop - 80, // Account for fixed header
            behavior: 'smooth'
          });
        }
      }
    }
    
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };
  
  // Handle swipe gesture on mobile menu
  const handleTouchStart = useRef({ x: 0, y: 0 });
  const handleTouchMove = useRef({ x: 0, y: 0 });
  
  const onTouchStart = (e) => {
    // Only track touch if we have valid touch data
    if (e && e.touches && e.touches[0]) {
      handleTouchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }
  };
  
  const onTouchMove = (e) => {
    // Only track touch if we have valid touch data
    if (e && e.touches && e.touches[0]) {
      handleTouchMove.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }
  };
  
  const onTouchEnd = () => {
    // Ensure we have valid coordinates before calculating
    if (!handleTouchStart.current.x || !handleTouchMove.current.x) {
      return;
    }
    
    const deltaX = handleTouchStart.current.x - handleTouchMove.current.x;
    const deltaY = handleTouchStart.current.y - handleTouchMove.current.y;
    
    // If horizontal swipe is greater than vertical swipe and exceeds threshold
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
      // If swipe right to left when menu is open
      if (deltaX > 30 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
      // If swipe left to right when menu is closed (and near edge)
      else if (deltaX < -30 && !isMobileMenuOpen && handleTouchStart.current.x < 50) {
        setIsMobileMenuOpen(true);
      }
    }
    
    // Reset touch data after processing
    handleTouchStart.current = { x: 0, y: 0 };
    handleTouchMove.current = { x: 0, y: 0 };
  };
  
  // Combine class names
  const navClasses = [
    styles.navigation,
    styles[`navigation-${theme}`],
    isScrolled ? styles.scrolled : '',
    isMobileMenuOpen ? styles.mobileOpen : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <nav 
      ref={navRef}
      className={navClasses} 
      aria-label="Main Navigation"
      data-testid="navigation"
      onTouchStart={isTouchDevice ? onTouchStart : undefined}
      onTouchMove={isTouchDevice ? onTouchMove : undefined}
      onTouchEnd={isTouchDevice ? onTouchEnd : undefined}
      {...props}
    >
      <div className={styles.container}>
        {/* Mobile menu toggle button */}
        <button 
          className={styles.mobileMenuToggle}
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-controls="navigation-menu"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          data-testid="mobile-menu-toggle"
        >
          <span className={styles.menuIcon}>
            <span className={styles.menuBar}></span>
            <span className={styles.menuBar}></span>
            <span className={styles.menuBar}></span>
          </span>
        </button>
        
        {/* Navigation items */}
        <ul 
          id="navigation-menu"
          className={styles.navList}
          aria-hidden={!isMobileMenuOpen && windowWidth < 768}
        >
          {navItems.map((item) => (
            <li key={item.id} className={styles.navItem}>
              <button
                className={`${styles.navLink} ${activeSection === item.id ? styles.active : ''}`}
                onClick={() => handleNavClick(item.id)}
                aria-current={activeSection === item.id ? 'page' : undefined}
                data-testid={`nav-link-${item.id}`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className={styles.activeIndicator} aria-hidden="true"></span>
                )}
              </button>
            </li>
          ))}
        </ul>
        
        {/* Theme Switcher */}
        {showThemeSwitcher && (
          <div className={styles.themeSwitcherContainer}>
            <ThemeSwitcher size="small" showLabel={false} />
          </div>
        )}
      </div>
    </nav>
  );
};

Navigation.propTypes = {
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  onNavigate: PropTypes.func,
  showThemeSwitcher: PropTypes.bool,
  className: PropTypes.string
};

export default Navigation;
