# Quickstart Guide: Interactive Portfolio Website

This guide provides instructions for setting up, developing, and testing the interactive portfolio website for Suduli Kumar Balabantaray.

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Git
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Code editor (VS Code recommended)

## Project Setup

1. Clone the repository:

```bash
git clone https://github.com/suduli/portfolio-website.git
cd portfolio-website
```

2. Install dependencies:

```bash
npm install
# or with yarn
yarn install
```

3. Start the development server:

```bash
npm run dev
# or with yarn
yarn dev
```

4. Open your browser and navigate to http://localhost:3000

## Project Structure

```
├── src/                 # Source code
│   ├── assets/          # Static assets
│   │   ├── images/      # Image files
│   │   ├── fonts/       # Font files
│   │   └── data/        # JSON data files
│   ├── styles/          # CSS styles
│   │   ├── base/        # Base styles
│   │   ├── components/  # Component styles
│   │   └── sections/    # Section styles
│   ├── scripts/         # JavaScript files
│   │   ├── core/        # Core utilities
│   │   ├── animations/  # Animation controllers
│   │   ├── components/  # UI components
│   │   └── sections/    # Section-specific code
│   └── pages/           # HTML pages
│       └── index.html   # Main HTML file
├── tests/               # Test files
│   ├── e2e/             # End-to-end tests
│   ├── integration/     # Integration tests
│   └── unit/            # Unit tests
├── .github/             # GitHub workflows
├── package.json         # Dependencies
└── README.md            # Project documentation
```

## Data Configuration

1. Edit the JSON files in `src/assets/data/` to update your personal information:

- `profile.json` - Personal details and contact information
- `experience.json` - Work experience entries
- `projects.json` - Portfolio projects
- `skills.json` - Skills and proficiency levels
- `education.json` - Educational background
- `awards.json` - Professional awards and achievements
- `languages.json` - Language proficiencies

2. Update your profile photo in `src/assets/images/` (recommended size: 500x500px)

3. Add project screenshots to `src/assets/images/projects/` (recommended size: 1280x720px)

## Development Workflow

### Adding a New Section

1. Create a new HTML section in `index.html`:

```html
<section id="new-section" class="section new-section">
  <div class="container">
    <h2 class="section-title">New Section</h2>
    <!-- Section content here -->
  </div>
</section>
```

2. Create a new CSS file in `src/styles/sections/`:

```css
/* src/styles/sections/new-section.css */
.new-section {
  padding: 100px 0;
  background-color: var(--bg-color);
}

/* Add section-specific styles */
```

3. Create a new JavaScript component in `src/scripts/sections/`:

```javascript
// src/scripts/sections/new-section.js
import { BaseComponent } from '../core/base-component.js';

class NewSectionComponent extends BaseComponent {
  constructor(element) {
    super(element);
    this.initialize();
  }
  
  initialize() {
    // Initialize the component
    this.bindEvents();
  }
  
  bindEvents() {
    // Add event listeners
  }
  
  // Add component-specific methods
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('new-section');
  if (section) {
    new NewSectionComponent(section);
  }
});

export { NewSectionComponent };
```

4. Import the new files in the main entry points:

```css
/* In src/styles/main.css */
@import 'sections/new-section.css';
```

```javascript
// In src/scripts/main.js
import './sections/new-section.js';
```

### Adding a New Animation

1. Use the animation controllers to create new animations:

```javascript
// Example: Text animation
import { textAnimationController } from '../animations/text-animation-controller.js';

const titleElement = document.querySelector('.section-title');
const titleAnimation = textAnimationController.createTextReveal(titleElement, {
  direction: 'lr',
  duration: 800,
  stagger: 50,
  easing: 'easeOutExpo'
});

// Play animation when element enters viewport
import { scrollAnimationController } from '../animations/scroll-animation-controller.js';

scrollAnimationController.revealElement(titleElement, {
  delay: 200,
  distance: '20px',
  origin: 'bottom',
  opacity: 0,
  callback: () => titleAnimation.play()
});
```

2. Register the animation with the main controller:

```javascript
import { animationController } from '../animations/animation-controller.js';

animationController.register('new-section-title', titleAnimation);
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

### Creating Tests

1. Create a new unit test:

```javascript
// tests/unit/components/navigation.test.js
import { NavigationComponent } from '../../../src/scripts/components/navigation.js';

describe('NavigationComponent', () => {
  let navComponent;
  let element;
  
  beforeEach(() => {
    // Set up DOM element
    document.body.innerHTML = `
      <nav id="main-nav">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
        </ul>
      </nav>
    `;
    
    element = document.getElementById('main-nav');
    navComponent = new NavigationComponent(element);
  });
  
  test('should initialize correctly', () => {
    expect(navComponent).toBeDefined();
    expect(navComponent.items.length).toBe(2);
  });
  
  test('should set active item', () => {
    navComponent.setActive('about');
    const activeItem = element.querySelector('a[href="#about"]').parentElement;
    expect(activeItem.classList.contains('active')).toBe(true);
  });
});
```

2. Create an integration test:

```javascript
// tests/integration/sections/hero.test.js
import { HeroComponent } from '../../../src/scripts/sections/hero.js';
import { AnimationController } from '../../../src/scripts/animations/animation-controller.js';

describe('Hero Section Integration', () => {
  let heroComponent;
  let animationController;
  
  beforeEach(() => {
    // Set up DOM and dependencies
    document.body.innerHTML = `
      <section id="hero">
        <h1 class="hero-title">Suduli Kumar Balabantaray</h1>
        <p class="hero-subtitle">Embedded Test Engineer</p>
      </section>
    `;
    
    animationController = new AnimationController();
    heroComponent = new HeroComponent(document.getElementById('hero'), animationController);
  });
  
  test('should initialize and register animations', () => {
    expect(heroComponent).toBeDefined();
    expect(animationController.getAnimation('hero-title')).toBeDefined();
    expect(animationController.getAnimation('hero-subtitle')).toBeDefined();
  });
  
  test('should play intro animation sequence', async () => {
    const spy = jest.spyOn(animationController, 'play');
    await heroComponent.startAnimation();
    expect(spy).toHaveBeenCalledWith('hero-title', expect.any(Object));
    expect(spy).toHaveBeenCalledWith('hero-subtitle', expect.any(Object));
  });
});
```

## Performance Optimization

1. Check Lighthouse performance regularly:

```bash
npm run lighthouse
```

2. Optimize images before adding them to the project:

```bash
npm run optimize-images
```

3. Monitor animation performance in Chrome DevTools Performance tab

## Deployment

### GitHub Pages Deployment

1. Update the `homepage` field in `package.json`:

```json
{
  "homepage": "https://suduli.github.io/portfolio-website"
}
```

2. Deploy to GitHub Pages:

```bash
npm run deploy
```

### Custom Domain Setup

1. Add your custom domain in the GitHub repository settings

2. Create a CNAME file in the `public` directory with your domain:

```
portfolio.suduli.com
```

3. Update DNS records with your domain provider:
   - A record: Points to GitHub Pages IP addresses
   - CNAME record: www subdomain to your GitHub Pages URL

## Troubleshooting

### Animation Performance Issues

- Check browser console for warnings
- Reduce particle count in background animations
- Disable complex animations on mobile devices
- Use the Performance Monitor to identify bottlenecks

### Cross-Browser Compatibility

- Test in all target browsers (Chrome, Firefox, Safari, Edge)
- Use autoprefixer for CSS properties
- Implement feature detection and fallbacks

### Mobile Responsiveness

- Test on multiple device sizes using browser dev tools
- Check for touch event handling issues
- Ensure tap targets are at least 44×44px

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Help and Support

For questions or support, please contact: suduli.office@gmail.com
