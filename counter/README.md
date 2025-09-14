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
- **Client-side (JavaScript)**: As a fallback for static hosting

### Files Structure

```
counter/
├── counter.php        # PHP backend API
├── counter.js         # Main JavaScript implementation
├── counter-fallback.js # JavaScript-only fallback
├── counter.css        # Styling for the counter
├── visits.json        # Data storage file (created automatically)
├── test.html          # Testing page
└── .htaccess          # Apache security configuration
```

## Setup Instructions

### Option 1: PHP Server Setup (Recommended)

1. Ensure your web server supports PHP (version 5.6 or higher)
2. Upload the entire `counter` directory to your web server
3. Ensure the server has write permissions for the `counter` directory (for the visits.json file)
4. Test by visiting `yourdomain.com/counter/test.html`

### Option 2: Static Hosting

For GitHub Pages, Netlify, or other static hosting:

1. Upload all files, including the fallback script
2. The system will automatically use local storage for tracking visits

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

1. **PHP Version**: Visit `yourdomain.com/counter/counter.php?action=reset`
2. **Local Storage Version**: Clear browser storage or add a reset button in the test page

### Backing Up Data

To backup the visit data:

1. Download the `visits.json` file periodically
2. For higher traffic sites, consider implementing a more robust database solution

## Customization

### Styling

Edit `counter.css` to change the appearance. The counter uses CSS variables from your main theme for seamless integration.

### Behavior

Edit `counter.js` to modify functionality:

- `updateInterval`: How often to refresh the counter (default: 60 seconds)
- `animationDuration`: Speed of the count-up animation (default: 1 second)
- `formatNumbers`: Whether to add commas to large numbers (default: true)

## Troubleshooting

### Common Issues

1. **Counter not displaying**: Check browser console for errors, verify file paths
2. **PHP errors**: Check server error logs, verify PHP version and permissions
3. **Counter not incrementing**: Check that cookies are enabled in the browser

### Support

For issues or questions, please contact the developer or submit an issue on the project repository.

## Future Enhancements

Potential improvements for future versions:

1. Database integration for higher traffic sites
2. More detailed analytics (time spent, entry/exit pages)
3. Admin dashboard for monitoring
4. Bot detection to filter out non-human traffic
