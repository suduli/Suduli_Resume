import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Hero from './Hero';

// Mock the ThemeContext
jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

// Mock the Button component
jest.mock('../Button/Button', () => {
  return function MockButton({ label, onClick }) {
    return (
      <button onClick={onClick} data-testid="mock-button">
        {label}
      </button>
    );
  };
});

describe('Hero Component', () => {
  const mockProps = {
    title: 'Welcome to My Portfolio',
    subtitle: 'Frontend Developer & UI/UX Designer',
    description: 'I create beautiful, responsive websites with modern technologies.',
    buttons: [
      { label: 'View Projects', href: '/projects', variant: 'primary' },
      { label: 'Contact Me', href: '/contact', variant: 'secondary' }
    ],
    imageSrc: '/images/hero.jpg',
    imageAlt: 'Hero image'
  };

  test('renders all content correctly', () => {
    render(<Hero {...mockProps} />);
    
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.subtitle)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
    
    const buttons = screen.getAllByTestId('mock-button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('View Projects');
    expect(buttons[1]).toHaveTextContent('Contact Me');
    
    const image = screen.getByAltText('Hero image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/hero.jpg');
  });

  test('renders with missing props', () => {
    render(<Hero title={mockProps.title} />);
    
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    expect(screen.queryByAltText('Hero image')).not.toBeInTheDocument();
  });

  test('handles button click events', () => {
    const handleClick = jest.fn();
    const buttonsWithClickHandler = [
      { label: 'Click Me', onClick: handleClick }
    ];
    
    render(<Hero title="Test" buttons={buttonsWithClickHandler} />);
    
    const button = screen.getByTestId('mock-button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies custom background color when provided', () => {
    render(
      <Hero title="Test" backgroundColor="rgb(240, 240, 240)" />
    );
    
    // Using getByRole to get the banner element
    const heroSection = screen.getByRole('banner', { name: 'Hero section' });
    expect(heroSection).toHaveStyle('background-color: rgb(240, 240, 240)');
  });
});
