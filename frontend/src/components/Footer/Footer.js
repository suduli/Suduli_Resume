import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './Footer.module.css';

/**
 * Footer component that displays copyright information and social links
 * @param {Object} props - Component props
 * @param {string} props.copyright - Copyright text to display
 * @param {Array} props.socialLinks - Array of social media links
 * @returns {JSX.Element} Rendered Footer component
 */
const Footer = ({ copyright, socialLinks }) => {
  const { theme } = useTheme();
  
  const currentYear = new Date().getFullYear();
  const copyrightText = copyright.replace('{year}', currentYear);

  return (
    <footer className={`${styles.footer} ${styles[`footer-${theme}`]}`}>
      <div className={styles.container}>
        <div className={styles.copyright}>
          <p>{copyrightText}</p>
        </div>
        
        {socialLinks && socialLinks.length > 0 && (
          <div className={styles.socialLinks}>
            {socialLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.url} 
                aria-label={link.name}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                {link.icon ? (
                  <span className={styles.icon}>{link.icon}</span>
                ) : (
                  link.name
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
};

Footer.propTypes = {
  copyright: PropTypes.string.isRequired,
  socialLinks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      icon: PropTypes.node
    })
  )
};

Footer.defaultProps = {
  copyright: '© {year} Portfolio. All rights reserved.',
  socialLinks: []
};

export default Footer;
