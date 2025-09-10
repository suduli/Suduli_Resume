import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './Card.module.css';

/**
 * Card component for displaying content in a bordered container
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.title - Optional card title
 * @param {boolean} props.elevated - Whether to add elevation (shadow)
 * @param {boolean} props.bordered - Whether to add a border
 * @param {string} props.className - Additional CSS class
 * @returns {JSX.Element} Rendered Card component
 */
const Card = ({
  children,
  title,
  elevated = false,
  bordered = true,
  className,
  ...props
}) => {
  const { theme } = useTheme();

  const cardClasses = [
    styles.card,
    styles[`card-${theme}`],
    elevated ? styles.elevated : '',
    bordered ? styles.bordered : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} data-testid="card" {...props}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  elevated: PropTypes.bool,
  bordered: PropTypes.bool,
  className: PropTypes.string
};

export default Card;
