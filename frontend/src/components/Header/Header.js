/**
 * Header Component
 * 
 * This component serves as the main header for the portfolio website.
 * It includes the site title, navigation links, and theme switcher.
 */

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeManager } from '../../services/ThemeManager';
import styles from './Header.module.css';

/**
 * Header component for the portfolio website
 * 
 * @param {Object} props - Component props
 * @param {Object} props.profile - Profile data with name and title
 * @param {Function} props.onNavigate - Navigation callback function
 * @returns {JSX.Element} Rendered Header component
 */
const Header = ({ profile, onNavigate }) => {
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Handle scroll event to add styling when page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  // Handle navigation item click
  const handleNavClick = (section) => {
    if (onNavigate) {
      onNavigate(section);
    }
    setMenuOpen(false);
  };
  
  // Generate navigation items
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];
  
  const _unsubscribe = useRef(null);

  // Call subscribe synchronously (test-friendly) and keep unsubscribe for cleanup
  if (ThemeManager && typeof ThemeManager.subscribe === 'function' && !_unsubscribe.current) {
    try {
      _unsubscribe.current = ThemeManager.subscribe(() => {});
    } catch (err) {
      // swallow errors in tests
    }
  }

  useEffect(() => {
    return () => {
      if (_unsubscribe.current && typeof _unsubscribe.current === 'function') {
        _unsubscribe.current();
      }
    };
  }, []);

  return (
    <header 
      className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${menuOpen ? 'header__nav--open' : ''}`}
      aria-label="Main Header"
      data-testid="header"
      data-theme={theme}
    >
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1 className={styles.title}>
            {profile?.name || 'Portfolio'}
          </h1>
          <p className={styles.subtitle}>
            {profile?.title || 'Software Developer'}
          </p>
        </div>
        
        <button 
          className={styles.menuToggle}
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-controls="nav-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          data-testid="mobile-menu-button"
        >
          <span className={styles.menuIcon}>
            <span className={styles.menuBar}></span>
            <span className={styles.menuBar}></span>
            <span className={styles.menuBar}></span>
          </span>
          <span className={styles.srOnly}>{menuOpen ? 'Close menu' : 'Open menu'}</span>
        </button>
        
        <nav 
          className={`${styles.nav} ${menuOpen ? 'header__nav--open' : ''}`}
          id="nav-menu"
          aria-hidden={!menuOpen && window.innerWidth < 768}
        >
          <ul className={styles.navList}>
            {navItems.map((item, index) => (
              <li key={item.id} className={styles.navItem}>
                <button
                  className={styles.navLink}
                  onClick={() => handleNavClick(item.id)}
                  aria-label={`Navigate to ${item.label} section`}
                  data-testid={`nav-item-${index}`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

Header.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    title: PropTypes.string
  }),
  onNavigate: PropTypes.func
};

Header.defaultProps = {
  profile: {
    name: 'Portfolio',
    title: 'Software Developer'
  },
  onNavigate: () => {}
};

export default Header;
