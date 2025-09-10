import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';
import TextAnimation from '../common/TextAnimation';
import styles from './Contact.module.css';

/**
 * Contact component provides a form for users to get in touch.
 * It includes form validation and submission handling.
 */
const Contact = ({ contactInfo, contactForm }) => {
  // useTheme hook used to trigger theme-based side effects in child components
  useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Observer to detect when the section enters viewport
  useEffect(() => {
    let observer = null;
    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (observer && typeof observer.disconnect === 'function') {
              observer.disconnect();
            }
          }
        },
        { threshold: 0.2 }
      );
    } catch (e) {
      observer = null;
    }

    const contactSection = document.getElementById('contact-section');
    if (contactSection && observer && typeof observer.observe === 'function') {
      try { observer.observe(contactSection); } catch (e) { /* ignore */ }
    } else {
      // Fallback for test environments with malformed IntersectionObserver mocks
      setIsVisible(true);
    }

    return () => {
      if (contactSection && observer && typeof observer.disconnect === 'function') {
        try { observer.disconnect(); } catch (e) { /* ignore */ }
      }
    };
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation - Fix comparison logic
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Name is required';
    }
    
    // Email validation - Using an even simpler, more widely compatible approach
    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = 'Email is required';
    } else {
      // Split validation into multiple simpler checks that work better in Chrome
      const hasAtSign = formData.email.includes('@');
      const hasDot = formData.email.includes('.');
      const hasTextBeforeAt = formData.email.split('@')[0].trim().length > 0;
      const hasTextAfterAt = formData.email.split('@')[1] && formData.email.split('@')[1].trim().length > 0;
      
      if (!hasAtSign || !hasDot || !hasTextBeforeAt || !hasTextAfterAt) {
        newErrors.email = 'Email is invalid';
      }
    }
    
    // Subject validation - Fix comparison logic
    if (!formData.subject || formData.subject.trim() === '') {
      newErrors.subject = 'Subject is required';
    }
    
    // Message validation - Fix comparison logic
    if (!formData.message || formData.message.trim() === '') {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Detect Safari Mobile
    const isSafariMobile = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    // For Safari Mobile, add extra validation
    if (isSafariMobile) {
      // Manual field validation for Safari Mobile
      const newErrors = {};
      
      if (!formData.name || formData.name.trim() === '') {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.email || formData.email.trim() === '') {
        newErrors.email = 'Email is required';
      } else {
        // Using the same improved email validation for Safari
        const hasAtSign = formData.email.includes('@');
        const hasDot = formData.email.includes('.');
        const hasTextBeforeAt = formData.email.split('@')[0].trim().length > 0;
        const hasTextAfterAt = formData.email.split('@')[1] && formData.email.split('@')[1].trim().length > 0;
        
        if (!hasAtSign || !hasDot || !hasTextBeforeAt || !hasTextAfterAt) {
          newErrors.email = 'Email is invalid';
        }
      }
      
      if (!formData.subject || formData.subject.trim() === '') {
        newErrors.subject = 'Subject is required';
      }
      
      if (!formData.message || formData.message.trim() === '') {
        newErrors.message = 'Message is required';
      } else if (formData.message.trim().length < 10) {
        newErrors.message = 'Message must be at least 10 characters';
      }
      
      setErrors(newErrors);
      
      if (Object.keys(newErrors).length > 0) {
        return; // Don't proceed if there are validation errors
      }
    } else if (!validateForm()) {
      return; // Don't proceed if standard validation fails
    }
    
    setIsSubmitting(true);
    setSubmitResult(null);
    
    try {
      // Mock API call - in a real app, replace with actual API call
      // In tests we want a faster turnaround

      const delay = process && process.env && process.env.NODE_ENV === 'test' ? 10 : 1500;
      await new Promise(resolve => setTimeout(resolve, delay));

      // Simulate successful submission
      setSubmitResult({
        success: true,
        message: 'Thank you for your message! I will get back to you soon.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitResult({
        success: false,
        message: 'Something went wrong. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact-section" 
      className={styles.contact}
      data-testid="contact-component"
    >
      <div className={styles.container}>
        <TextAnimation 
          text="Get In Touch" 
          className={styles.title}
          animation="fadeIn"
        />
        
        <div className={styles.contactContent}>
          {/* Contact Information */}
          <div 
            className={`${styles.contactInfo} ${isVisible ? styles.visible : ''}`}
            data-testid="contact-info"
          >
            <h3 className={styles.infoTitle}>Contact Information</h3>
            
            <div className={styles.infoItems}>
              {contactInfo.email && (
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>✉️</div>
                  <div className={styles.infoText}>
                    <h4>Email</h4>
                    <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                  </div>
                </div>
              )}
              
              {contactInfo.phone && (
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>📱</div>
                  <div className={styles.infoText}>
                    <h4>Phone</h4>
                    <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
                  </div>
                </div>
              )}
              
              {contactInfo.location && (
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>📍</div>
                  <div className={styles.infoText}>
                    <h4>Location</h4>
                    <p>{contactInfo.location}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Social Links */}
            {contactInfo.socialLinks && contactInfo.socialLinks.length > 0 && (
              <div className={styles.socialLinks}>
                <h4 className={styles.socialTitle}>Connect With Me</h4>
                <div className={styles.socialIcons}>
                  {contactInfo.socialLinks.map((link, index) => (
                    <a 
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialIcon}
                      aria-label={link.name}
                      title={link.name}
                    >
                      {/* Use emoji as placeholder, would use actual icons in production */}
                      {link.name === 'LinkedIn' && '🔗'}
                      {link.name === 'GitHub' && '🐙'}
                      {link.name === 'Twitter' && '🐦'}
                      {link.name === 'Instagram' && '📸'}
                      {!['LinkedIn', 'GitHub', 'Twitter', 'Instagram'].includes(link.name) && '🌐'}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Contact Form */}
          <div 
            className={`${styles.contactForm} ${isVisible ? styles.visible : ''}`}
            data-testid="contact-form"
          >
            <h3 className={styles.formTitle}>Send a Message</h3>
            
            {submitResult && (
              <div 
                className={`${styles.submitResult} ${submitResult.success ? styles.success : styles.error}`}
                data-testid="submit-result"
              >
                {submitResult.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} noValidate>
              {/* If contactForm with formFields is provided, render inputs dynamically */}
              {contactForm && Array.isArray(contactForm.formFields) ? (
                contactForm.formFields.map(field => (
                  <div className={styles.formGroup} key={field.id}>
                    <label htmlFor={field.id} className={styles.label}>{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.id}
                        name={field.id}
                        value={formData[field.id] || ''}
                        onChange={handleChange}
                        className={`${styles.textarea} ${errors[field.id] ? styles.errorInput : ''}`}
                        placeholder={field.placeholder || ''}
                        rows={field.rows || 5}
                        data-testid={`${field.id}-input`}
                        disabled={isSubmitting}
                      ></textarea>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        id={field.id}
                        name={field.id}
                        value={formData[field.id] || ''}
                        onChange={handleChange}
                        className={`${styles.input} ${errors[field.id] ? styles.errorInput : ''}`}
                        placeholder={field.placeholder || ''}
                        data-testid={`${field.id}-input`}
                        disabled={isSubmitting}
                      />
                    )}
                    {errors[field.id] && (
                      <span className={styles.errorMessage} data-testid={`${field.id}-error`}>
                        {errors[field.id]}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                // Fallback to the previous hard-coded fields
                <>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.name ? styles.errorInput : ''}`}
                      placeholder="Your name"
                      data-testid="name-input"
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <span className={styles.errorMessage} data-testid="name-error">{errors.name}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
                      placeholder="Your email"
                      data-testid="email-input"
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <span className={styles.errorMessage} data-testid="email-error">{errors.email}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="subject" className={styles.label}>Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.subject ? styles.errorInput : ''}`}
                      placeholder="Subject of your message"
                      data-testid="subject-input"
                      disabled={isSubmitting}
                    />
                    {errors.subject && (
                      <span className={styles.errorMessage} data-testid="subject-error">{errors.subject}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="message" className={styles.label}>Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className={`${styles.textarea} ${errors.message ? styles.errorInput : ''}`}
                      placeholder="Your message"
                      rows="5"
                      data-testid="message-input"
                      disabled={isSubmitting}
                    ></textarea>
                    {errors.message && (
                      <span className={styles.errorMessage} data-testid="message-error">{errors.message}</span>
                    )}
                  </div>
                </>
              )}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
                data-testid="submit-button"
              >
                {isSubmitting ? (contactForm && contactForm.submitButton ? contactForm.submitButton.loadingText : 'Sending...') : (contactForm && contactForm.submitButton ? contactForm.submitButton.text : 'Send Message')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

Contact.propTypes = {
  contactInfo: PropTypes.shape({
    email: PropTypes.string,
    phone: PropTypes.string,
    location: PropTypes.string,
    socialLinks: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        icon: PropTypes.string,
      })
    ),
  }),
  contactForm: PropTypes.shape({
    formFields: PropTypes.array,
    submitButton: PropTypes.object,
    successMessage: PropTypes.string,
    errorMessage: PropTypes.string
  })
};

// Default props with mock data
Contact.defaultProps = {
  contactInfo: {
    email: 'john.doe@example.com',
    phone: '+1 (123) 456-7890',
    location: 'San Francisco, CA',
    socialLinks: [
      { name: 'LinkedIn', url: 'https://linkedin.com/in/johndoe' },
      { name: 'GitHub', url: 'https://github.com/johndoe' },
      { name: 'Twitter', url: 'https://twitter.com/johndoe' },
    ],
  },
  contactForm: null,
};

export default Contact;
