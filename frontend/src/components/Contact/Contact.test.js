import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import Contact from './Contact';
import { renderWithProviders } from '../../../tests/test-utils';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockImplementation((callback) => {
  return {
    observe: jest.fn().mockImplementation(() => {
      callback([{ isIntersecting: true }]);
    }),
    disconnect: jest.fn(),
    unobserve: jest.fn(),
  };
});

window.IntersectionObserver = mockIntersectionObserver;

// Mock data for testing
const mockContactInfo = {
  email: 'test@example.com',
  phone: '123-456-7890',
  location: 'Test City, Country',
  socialLinks: [
    { name: 'LinkedIn', url: 'https://linkedin.com/in/test' },
    { name: 'GitHub', url: 'https://github.com/test' },
  ],
};

describe('Contact Component', () => {
  const renderWithTheme = (ui) => renderWithProviders(ui);

  test('renders the Contact component with title', () => {
    renderWithTheme(<Contact contactInfo={mockContactInfo} />);
    
    const titleElement = screen.getByText('Get In Touch');
    expect(titleElement).toBeInTheDocument();
  });

  test('displays contact information correctly', () => {
    renderWithTheme(<Contact contactInfo={mockContactInfo} />);
    
    // Use more specific queries to avoid multiple matches
    const emailHeadings = screen.getAllByText('Email');
    expect(emailHeadings.length).toBeGreaterThan(0);
    expect(screen.getByText('test@example.com')).toBeInTheDocument();

    const phoneHeadings = screen.getAllByText('Phone');
    expect(phoneHeadings.length).toBeGreaterThan(0);
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();

    const locationHeadings = screen.getAllByText('Location');
    expect(locationHeadings.length).toBeGreaterThan(0);
    expect(screen.getByText('Test City, Country')).toBeInTheDocument();

    expect(screen.getByText('Connect With Me')).toBeInTheDocument();
    
    // Social links should have correct attributes
    const socialLinks = screen.getAllByRole('link', { name: /LinkedIn|GitHub/i });
    expect(socialLinks).toHaveLength(2);
    expect(socialLinks[0]).toHaveAttribute('href', 'https://linkedin.com/in/test');
    expect(socialLinks[1]).toHaveAttribute('href', 'https://github.com/test');
  });

  test('form validation works correctly', async () => {
    renderWithTheme(<Contact contactInfo={mockContactInfo} />);
    
    const submitButton = screen.getByTestId('submit-button');
    
    // Submit empty form - should show validation errors
    fireEvent.click(submitButton);
    
    expect(screen.getByTestId('name-error')).toBeInTheDocument();
    expect(screen.getByTestId('email-error')).toBeInTheDocument();
    expect(screen.getByTestId('subject-error')).toBeInTheDocument();
    expect(screen.getByTestId('message-error')).toBeInTheDocument();
    
    // Fill in form with valid data
    fireEvent.change(screen.getByTestId('name-input'), { 
      target: { value: 'Test User' } 
    });
    
    fireEvent.change(screen.getByTestId('email-input'), { 
      target: { value: 'test@example.com' } 
    });
    
    fireEvent.change(screen.getByTestId('subject-input'), { 
      target: { value: 'Test Subject' } 
    });
    
    fireEvent.change(screen.getByTestId('message-input'), { 
      target: { value: 'This is a test message that is long enough.' } 
    });
    
    // Submit form with valid data
    fireEvent.click(submitButton);
    
    // Should not show validation errors
    expect(screen.queryByTestId('name-error')).not.toBeInTheDocument();
    expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
    expect(screen.queryByTestId('subject-error')).not.toBeInTheDocument();
    expect(screen.queryByTestId('message-error')).not.toBeInTheDocument();
    
    // Should show loading state
    expect(submitButton).toHaveTextContent('Sending...');
    expect(submitButton).toBeDisabled();
    
    // Wait for success message and assert content
    const result = await screen.findByTestId('submit-result');
    expect(result).toHaveTextContent(
      'Thank you for your message! I will get back to you soon.'
    );
    
    // Button should return to normal state
    expect(submitButton).toHaveTextContent('Send Message');
    expect(submitButton).not.toBeDisabled();
    
    // Form should be reset
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('email-input')).toHaveValue('');
    expect(screen.getByTestId('subject-input')).toHaveValue('');
    expect(screen.getByTestId('message-input')).toHaveValue('');
  });

  test('form validation catches invalid email', () => {
    renderWithTheme(<Contact contactInfo={mockContactInfo} />);
    
    const submitButton = screen.getByTestId('submit-button');
    
    // Fill in form with invalid email
    fireEvent.change(screen.getByTestId('name-input'), { 
      target: { value: 'Test User' } 
    });
    
    fireEvent.change(screen.getByTestId('email-input'), { 
      target: { value: 'invalid-email' } 
    });
    
    fireEvent.change(screen.getByTestId('subject-input'), { 
      target: { value: 'Test Subject' } 
    });
    
    fireEvent.change(screen.getByTestId('message-input'), { 
      target: { value: 'This is a test message that is long enough.' } 
    });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Should show email validation error
    expect(screen.getByTestId('email-error')).toBeInTheDocument();
    expect(screen.getByTestId('email-error')).toHaveTextContent('Email is invalid');
  });
});
