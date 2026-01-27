# Accessibility Features

This website includes comprehensive accessibility features to ensure WCAG 2.1 AA compliance.

## Theme Toggle Accessibility

The theme toggle button includes the following accessibility enhancements:

### Screen Reader Support
- **Dynamic ARIA Labels**: Button announces current state and intended action
  - Dark mode: "Switch to light theme" 
  - Light mode: "Switch to dark theme"
- **Live Announcements**: Screen readers announce theme changes via ARIA live region
- **Semantic HTML**: Proper `role="button"` and `aria-hidden="true"` for icons

### Keyboard Navigation
- **Tab Navigation**: Button is fully accessible via Tab key
- **Activation Keys**: Supports both Enter and Space keys for activation
- **Focus Indicators**: High-contrast focus outlines meeting WCAG AA standards
- **Focus Management**: Maintains focus state during theme transitions

### Motion & Animation
- **Reduced Motion**: Respects `prefers-reduced-motion: reduce` user preference
- **Smooth Transitions**: Optional smooth theme transitions for users who don't prefer reduced motion
- **Loading States**: Visual feedback during theme changes with accessibility considerations

### Color Contrast
- **WCAG AA Compliance**: All color combinations meet minimum 4.5:1 contrast ratio for normal text
- **Focus Indicators**: Focus states provide sufficient contrast for visibility
- **Theme Adaptation**: Focus styles adapt appropriately to both light and dark themes

## Implementation Details

### HTML Enhancements
```html
<button class="theme-toggle" id="theme-toggle" 
        aria-label="Toggle theme" 
        role="button" 
        tabindex="0"
        title="Toggle between light and dark theme">
    <i class="fas fa-moon" id="theme-icon" aria-hidden="true"></i>
</button>
```

### JavaScript Features
- Dynamic aria-label updates
- Live region announcements
- Keyboard event handling
- Motion preference detection

### CSS Accessibility
- High-contrast focus indicators
- Reduced motion support
- Smooth transitions with accessibility considerations

## Testing

The accessibility features have been tested with:
- Keyboard navigation (Tab, Enter, Space keys)
- Screen reader compatibility
- Motion preference settings
- Focus management
- WCAG contrast requirements

## Browser Support

These accessibility features work in all modern browsers and are backwards compatible with older browsers that support basic CSS custom properties.