# Interactive Portfolio Website

This is an advanced interactive portfolio website for Suduli Kumar Balabantaray. The website showcases professional information, projects, skills, and experience using modern web technologies and interactive elements.

## Features

- **Responsive Design**: Fully responsive design that works on all devices from mobile to desktop
- **Interactive UI**: Dynamic and engaging user interface with animations and transitions
- **Theme System**: Comprehensive theming with light/dark modes and customizable color schemes
- **Accessibility**: Full WCAG compliance with screen reader support and reduced motion options
- **Performance Optimized**: Code splitting, lazy loading, and memoization for optimal performance
- **Data-Driven**: All content is loaded dynamically from JSON files for easy updates
- **Animations**: Multiple animation types including scroll-triggered, hover, and interactive elements
- **Modern Architecture**: Built with React Context API and custom hooks for state management

## Project Structure

The project follows a modern React application structure:

```
frontend/
├── public/             # Static files and JSON data
│   ├── data/           # JSON data files for content
│   ├── index.html      # Entry HTML file
│   └── manifest.json   # PWA manifest
├── src/                # Source code
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # React components organized by feature
│   ├── contexts/       # React Context providers
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Third-party libraries and wrappers
│   ├── models/         # Data models with validation
│   ├── pages/          # Page components
│   ├── services/       # Services for data and theme management
│   ├── styles/         # CSS files
│   └── utils/          # Utility functions
├── tests/              # Test files
│   ├── contract/       # Contract tests for interfaces
│   ├── integration/    # Integration tests
│   ├── unit/           # Unit tests
│   └── __mocks__/      # Test mocks
├── docs/               # Documentation
└── jest.config.js      # Jest configuration
```

## Technologies Used

- **React.js**: Frontend framework for building the UI components
- **React Router**: For navigation between different sections
- **React Context API**: For global state management (themes and data)
- **Animation Libraries**:
  - anime.js: For text and UI animations
  - react-tsparticles: For background particle effects
  - Three.js: For 3D skill visualizations
  - GSAP: For scroll-triggered animations
  - Framer Motion: For component transitions
- **Testing**: Jest and React Testing Library for TDD approach
- **ESLint & Prettier**: For code quality and consistent formatting
- **Husky & lint-staged**: For pre-commit hooks

## Theme System

The website includes a comprehensive theme system with:

- Light/Dark mode toggle
- System preference detection (respects OS settings)
- Custom theme support with variable CSS properties
- Animation adaptations based on current theme
- Theme persistence with localStorage
- Smooth transitions between themes

## Accessibility Features

The portfolio website prioritizes accessibility with:

- ARIA attributes for screen readers
- Keyboard navigation support throughout
- Focus management for interactive elements
- Prefers-reduced-motion support
- Color contrast compliance
- Semantic HTML structure
- Skip links for keyboard users
- Text alternatives for non-text content

## Performance Optimizations

Performance is a key focus with these optimizations:

- Code splitting with React.lazy and Suspense
- Component memoization to prevent unnecessary re-renders
- Multi-layer caching system for data
- Image optimization and lazy loading
- Optimized animations with GPU acceleration
- Resource prefetching for critical assets
- Memory management with proper cleanup

## Data Architecture

The portfolio data is structured into several entities:

- Profile information
- Work experience with timeline
- Projects with categories and filters
- Skills organized by categories
- Education history
- Awards and achievements
- Languages with proficiency levels
- Contact form configuration

## Development

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Setup

1. Clone the repository:

   ```
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start development server:
   ```
   npm start
   ```

### Testing

The project follows Test-Driven Development (TDD) principles:

```
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- src/components/Header/Header.test.js
```

### Linting and Formatting

```
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Building

To create a production-optimized build:

```
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Performance Goals

- Initial load time under 2 seconds
- Time to Interactive under 3.5 seconds
- 60fps animations and transitions
- Lighthouse score above 90 in all categories:
  - Performance
  - Accessibility
  - Best Practices
  - SEO

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- iOS Safari (latest 2 versions)
- Android Chrome (latest 2 versions)

## Contributing

For contributing to this project, please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
