import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';
import './Loading.css';

/**
 * A reusable loading component that displays a spinner or skeleton based on the current theme.
 * It can be customized with different sizes and messages.
 */
const Loading = ({ size = 'medium', message = 'Loading...', fullScreen = false }) => {
  const { theme } = useTheme();
  
  const loadingClasses = [
    'loading-spinner',
    `theme-${theme}`,
    `size-${size}`,
    fullScreen ? 'full-screen' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={`loading-container ${fullScreen ? 'full-screen' : ''}`}>
      <div className={loadingClasses} aria-hidden="true">
        <div className="spinner-inner"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

Loading.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  message: PropTypes.string,
  fullScreen: PropTypes.bool
};

export default Loading;
