import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from './Card';

// Mock the ThemeContext
jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

describe('Card Component', () => {
  test('renders children content', () => {
    render(
      <Card>
        <p>Test content</p>
      </Card>
    );
    
    const content = screen.getByText('Test content');
    expect(content).toBeInTheDocument();
  });

  test('renders with title when provided', () => {
    render(
      <Card title="Card Title">
        <p>Test content</p>
      </Card>
    );
    
    const title = screen.getByText('Card Title');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H3');
  });

  test('applies elevated class when elevated prop is true', () => {
    render(
      <Card elevated>
        <p>Test content</p>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('elevated');
  });

  test('applies bordered class by default', () => {
    render(
      <Card>
        <p>Test content</p>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('bordered');
  });

  test('does not apply bordered class when bordered prop is false', () => {
    render(
      <Card bordered={false}>
        <p>Test content</p>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).not.toHaveClass('bordered');
  });

  test('applies additional className when provided', () => {
    render(
      <Card className="custom-class">
        <p>Test content</p>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('custom-class');
  });

  test('applies theme-specific class', () => {
    render(
      <Card>
        <p>Test content</p>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('card-light');
  });
});
