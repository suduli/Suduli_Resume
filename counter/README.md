# Visit Counter Setup & Usage Guide

This document provides instructions for setting up and maintaining the visit counter feature on your resume website.

## Overview

The visit counter tracks and displays:

1. Total page views
2. Unique visitors

It's designed to be visually unobtrusive, privacy-friendly, and integrates seamlessly with the existing website design.

## Technology Stack

The counter uses a dual approach for maximum compatibility:

- **Server-side (PHP)**: For accurate tracking with a PHP-enabled server
- **Client-side (JavaScript)**: As a fallback for static hosting or Python HTTP servers

### Files Structure

```
counter/
├── counter.php             # PHP backend API
├── counter.js              # Main JavaScript implementation
├── counter-fallback.js     # JavaScript-only fallback using localStorage
├── counter.css             # Styling for the counter
├── counter-data.json       # Data storage file (created automatically)
├── fallback-test.html      # Testing page for the fallback version
├── counter-implementation.js # Implementation guide (not for production)
└── README.md               # This documentation file
```

## Setup Instructions

### Option 1: PHP Server Setup (Recommended)

1. Ensure your web server supports PHP (version 5.6 or higher)
2. Upload the entire `counter` directory to your web server
3. Ensure the server has write permissions for the `counter` directory (for the counter-data.json file)
4. Add the required HTML to your page (see below)
5. Include the required CSS and JS files in your HTML head

### Option 2: Static Hosting or Python HTTP Server

For GitHub Pages, Netlify, Python HTTP server, or other static hosting:

1. Upload all files, including the fallback script
2. The system will automatically use localStorage for tracking visits
3. All counting will happen on the client-side

### Required HTML

Add this HTML where you want the counter to appear:

```html
<div class="visit-counter">
    <div class="counter-item total-visits">
        <i class="fas fa-eye"></i>
        <span>Total Views: </span>
        <span class="count">0</span>
    </div>
    <div class="counter-item unique-visits">
        <i class="fas fa-user"></i>
        <span>Unique Visitors: </span>
        <span class="count">0</span>
    </div>
</div>
```

### Required Files

Include these in your HTML `<head>` section:

```html
<!-- Font Awesome (for icons) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

<!-- Counter Styles -->
<link rel="stylesheet" href="counter/counter.css">

<!-- Counter Script -->
<script src="counter/counter.js"></script>
```

## Privacy Considerations

The counter implements the following privacy measures:

1. No personal data is collected
2. IP addresses are partially anonymized (only first two octets used)
3. User agent strings are truncated
4. Visitor IDs are hashed using MD5
5. All tracking is done via first-party cookies (24-hour expiration)

## Maintenance

### Resetting the Counter

To reset the visit counter:

1. **PHP Version**: Visit `yourdomain.com/counter/counter.php?action=reset&key=your-secret-reset-key`
   - You'll need to configure the secret key in counter.php
2. **Local Storage Version**: Visit `fallback-test.html` and use the reset button

### Backing Up Data

To backup the visit data:

1. Download the `counter-data.json` file periodically
2. For higher traffic sites, consider implementing a more robust database solution

## Customization

### Styling

Edit `counter.css` to change the appearance. The counter uses CSS variables:

- `--text-primary`: Primary text color
- `--text-secondary`: Secondary text color
- `--accent-primary`: Primary accent color (for total visits)
- `--accent-secondary`: Secondary accent color (for unique visits)

### Behavior

You can customize the counter behavior by passing options to the VisitCounter constructor:

```javascript
const visitCounter = new VisitCounter({
    apiEndpoint: 'counter/counter.php',      // Path to PHP counter
    counterSelector: '.visit-counter',        // CSS selector for counter container
    updateInterval: 60000,                    // Update interval in milliseconds
    animationDuration: 1000,                  // Counter animation duration
    updateOnLoad: true,                       // Whether to increment on page load
    countUpAnimation: true,                   // Whether to animate the counter
    fallbackScript: 'counter/counter-fallback.js' // Path to fallback script
});
```

## Troubleshooting

### Common Issues

1. **Counter not displaying**: Check browser console for errors, verify file paths
2. **PHP errors**: Check server error logs, verify PHP version and permissions
3. **Counter not incrementing**: Check that cookies are enabled in the browser
4. **Data not saving**: Ensure write permissions on the counter directory

### Support

For issues or questions, please contact the developer or submit an issue on the project repository.

## Future Enhancements

Potential improvements for future versions:

1. Database integration for higher traffic sites
2. More detailed analytics (time spent, entry/exit pages)
3. Admin dashboard for monitoring
4. Bot detection to filter out non-human traffic
5. Time-based statistics (daily/weekly/monthly views)
