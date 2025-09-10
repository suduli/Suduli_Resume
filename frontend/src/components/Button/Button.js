import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './Button.module.css';

/**
 * Button component with various styles and sizes
 * @param {Object} props - Component props
 * @param {string} props.label - Button text
 * @param {string} props.variant - Button style variant ('primary', 'secondary', 'outline', 'text')
 * @param {string} props.size - Button size ('small', 'medium', 'large')
 * @param {string} props.href - Optional URL for anchor buttons
 * @param {Function} props.onClick - Click handler function
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {string} props.type - Button type attribute
 * @param {boolean} props.fullWidth - Whether the button should take full width
 * @param {React.ReactNode} props.icon - Optional icon to display
 * @param {string} props.iconPosition - Position of the icon ('left' or 'right')
 * @returns {JSX.Element} Rendered Button component
 */
const Button = ({
  label,
  variant = 'primary',
  size = 'medium',
  href,
  onClick,
  disabled = false,
  type = 'button',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className,
  ...props
}) => {
  const { theme } = useTheme();
  
  const buttonClasses = [
    styles.button,
    styles[`button-${variant}`],
    styles[`button-${size}`],
    styles[`button-${theme}`],
    fullWidth ? styles.fullWidth : '',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  const buttonContent = (
    <>
      {icon && iconPosition === 'left' && (
        <span className={styles.iconLeft}>{icon}</span>
      )}
      
      {label && <span className={styles.label}>{label}</span>}
      
      {icon && iconPosition === 'right' && (
        <span className={styles.iconRight}>{icon}</span>
      )}
    </>
  );

  // Render as anchor if href is provided
  if (href) {
    return (
      <a
        href={disabled ? undefined : href}
        className={buttonClasses}
        onClick={handleClick}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        rel={href && href.startsWith('http') ? 'noopener noreferrer' : undefined}
        target={href && href.startsWith('http') ? '_blank' : undefined}
        data-testid={disabled ? 'disabled-link' : 'button-link'}
        {...props}
      >
        {buttonContent}
      </a>
    );
  }

  // Render as button
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
      data-testid="button-element"
      {...props}
    >
      {buttonContent}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'text']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  href: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string
};

export default Button;
