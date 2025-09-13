# Suduli - Automotive Professional Resume Website

A futuristic and interactive resume website showcasing professional automotive expertise and experience. Built with modern web technologies and inspired by cutting-edge design principles.

## 🚀 Features

- **Interactive Particle Background** - Dynamic particle system using particles.js
- **Smooth Animations** - Powered by anime.js for fluid transitions
- **Modern Gradient Design** - Inspired by futuristic UI/UX trends
- **Responsive Design** - Optimized for all devices and screen sizes
- **Professional Sections**:
  - Hero section with animated introduction
  - About section with statistics
  - Experience timeline
  - Skills showcase with progress bars
    - Interactive Skills Explorer (search, category chips, view toggle, accessibility focused)
  - Education highlights
  - Featured projects portfolio
  - Contact form

## 🛠️ Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with gradients, animations, and flexbox/grid
- **JavaScript** - Interactive functionality and animations
- **Particles.js** - Interactive particle background system
- **Anime.js** - Smooth animations and transitions
- **Font Awesome** - Professional icons
- **Google Fonts** - Orbitron and Rajdhani font families

## 🎨 Design Inspiration

The website design is inspired by:
- [Anime.js](https://animejs.com/) - Smooth animations
- [ITSVG Portfolio](https://itsvg.in/) - Modern layout concepts
- [Particles.js Demo](https://vincentgarreau.com/particles.js/) - Interactive backgrounds
- [Particles Showcase](https://particles.wannathis.one/) - Creative particle effects
- [Gradienty](https://gradienty.codes/) - Modern gradient designs
- [Bruno Simon](https://bruno-simon.com/) - Interactive elements

## 📱 Responsive Features

- Mobile-first design approach
- Hamburger navigation for mobile devices
- Optimized touch interactions
- Fluid typography and spacing
- Adaptive layouts for all screen sizes

## 🌟 Interactive Elements

- **Particle Background** - Mouse hover and click interactions
- **Smooth Scrolling** - Enhanced navigation experience
- **Hover Effects** - Dynamic button and card animations
- **Skills Explorer**
  - Real-time search across names, descriptions & keywords
  - Filter by category using accessible toggle chips
  - Grid and List (accordion) view modes with persistence (localStorage)
  - Expandable skill detail panels (attributes, tags)
  - Keyboard shortcuts ( / focuses search ) & full keyboard navigation
  - Live results count announcements (ARIA polite region)
  - Animated progress indicators with reduced‑motion safeguards
- **Progress Bars** - Animated skill level indicators
- **Counter Animation** - Animated statistics in about section
- **Contact Form** - Interactive form with validation

## 🚀 Getting Started

### Live Website
Visit the live website at: [https://suduli.github.io/Suduli_Resume_Automotive/](https://suduli.github.io/Suduli_Resume_Automotive/)

### Local Development
1. Clone the repository
2. Open `index.html` in your web browser
3. No build process required - pure HTML, CSS, and JavaScript

### Deployment
The website is automatically deployed to GitHub Pages using GitHub Actions whenever changes are pushed to the main branch.

## 📄 Professional Information

The website showcases professional information including:
- Automotive engineering expertise
- Project management experience
- Technical skills and certifications
- Educational background
- Featured projects and achievements
- Contact information and social links

## 🔗 Links

- **Live Website**: [https://suduli.github.io/Suduli_Resume_Automotive/](https://suduli.github.io/Suduli_Resume_Automotive/)
- **LinkedIn Profile**: [linkedin.com/in/suduli](https://www.linkedin.com/in/suduli/)
- **Local Development**: Open `index.html` in your browser

## 📞 Contact

## 🧩 Modifying the Skills Explorer

The redesigned Skills & Expertise section is data-driven. Update or extend skills by editing the `SKILLS_DATA` array inside `script.js` ("Skills Explorer Redesign" block).

Skill object schema:
```
{
  id: 'unique-id',
  name: 'Skill Name',
  category: 'Category Group',        // Used for grouping & filtering
  level: 0-100,                      // Numeric proficiency (visual bar)
  description: 'Short descriptive sentence.',
  keywords: ['search','tags'],       // Aids search & tag rendering (first 5 shown)
  attributes: { Key:'Value', ... }   // Rendered in detail panel as definition list
}
```

Add a new category simply by introducing a new `category` value. Color assignment is deterministic (hash → palette) so no extra config required.

Accessibility notes:
- All interactive elements have focus styles and ARIA labels.
- Results region uses `aria-live="polite"` for count updates.
- List view groups are accordion sections with proper `aria-expanded` states.
- Press `/` anywhere to jump to search.

To switch default view mode, change the `activeView` initialization (`grid` or `list`). User preference persists via `localStorage` key `skillsViewMode`.

For any inquiries or collaborations, please use the contact form on the website or reach out through the provided contact methods.

---

*Built with ❤️ for the automotive industry*