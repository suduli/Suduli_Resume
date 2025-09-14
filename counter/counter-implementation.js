/**
 * Counter Implementation Guide
 * 
 * This file provides instructions on how to implement the visit counter
 * on your website. You have two options:
 * 
 * 1. PHP-based counter (requires PHP on server)
 * 2. JavaScript localStorage fallback (works without PHP)
 * 
 * The system automatically falls back to localStorage if PHP is not available.
 */

/*
 * STEP 1: Add the counter HTML to your website
 * 
 * Place this HTML where you want the counter to appear:
 *
 * <div class="visit-counter">
 *     <div class="counter-item total-visits">
 *         <i class="fas fa-eye"></i>
 *         <span>Total Views: </span>
 *         <span class="count">0</span>
 *     </div>
 *     <div class="counter-item unique-visits">
 *         <i class="fas fa-user"></i>
 *         <span>Unique Visitors: </span>
 *         <span class="count">0</span>
 *     </div>
 * </div>
 */

/*
 * STEP 2: Include the required files
 * 
 * Add these in your HTML <head> section:
 *
 * <!-- Font Awesome (for icons) -->
 * <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
 *
 * <!-- Counter Styles -->
 * <link rel="stylesheet" href="counter/counter.css">
 *
 * <!-- Counter Script (automatically handles PHP/JS fallback) -->
 * <script src="counter/counter.js"></script>
 */

/*
 * STEP 3: Create counter.php in the counter directory
 * 
 * This file handles server-side counting. Create the file
 * with the following content:
 *
 * <?php
 * // Counter storage file path
 * $counterFile = __DIR__ . '/counter-data.json';
 *
 * // Create the file if it doesn't exist
 * if (!file_exists($counterFile)) {
 *     $initialData = json_encode(['totalVisits' => 0, 'uniqueVisits' => 0]);
 *     file_put_contents($counterFile, $initialData);
 *     chmod($counterFile, 0666); // Make sure it's writable
 * }
 *
 * // Get visitor's IP and user agent for identifying unique visitors
 * $ipAddress = $_SERVER['REMOTE_ADDR'];
 * $userAgent = $_SERVER['HTTP_USER_AGENT'];
 * $visitorId = md5($ipAddress . $userAgent);
 *
 * // Cookie name for tracking visitor
 * $cookieName = 'resume_visitor_id';
 * $isNewVisitor = false;
 *
 * // Check if this is a new visitor
 * if (!isset($_COOKIE[$cookieName])) {
 *     setcookie($cookieName, $visitorId, time() + (86400 * 30), '/'); // 30 days
 *     $isNewVisitor = true;
 * }
 *
 * // Load current counter data
 * $counterData = json_decode(file_get_contents($counterFile), true);
 *
 * // Increment counters
 * $counterData['totalVisits']++;
 * if ($isNewVisitor) {
 *     $counterData['uniqueVisits']++;
 * }
 *
 * // Save counter data
 * file_put_contents($counterFile, json_encode($counterData));
 *
 * // Return counter data as JSON
 * header('Content-Type: application/json');
 * echo json_encode($counterData);
 * ?>
 */

/*
 * STEP 4: Create counter.js in the counter directory
 * 
 * This file tries to use PHP first, then falls back to localStorage:
 *
 * // Visit Counter with PHP and localStorage Fallback
 * document.addEventListener('DOMContentLoaded', function() {
 *     initCounter();
 * });
 *
 * function initCounter() {
 *     // Find counter elements
 *     const counter = document.querySelector('.visit-counter');
 *     if (!counter) return;
 *     
 *     // Try to use PHP counter first
 *     fetch('counter/counter.php')
 *         .then(response => {
 *             if (!response.ok) throw new Error('PHP counter not available');
 *             return response.json();
 *         })
 *         .then(data => {
 *             updateCounterDisplay(data);
 *         })
 *         .catch(error => {
 *             console.log('Falling back to localStorage counter:', error.message);
 *             // Load fallback script
 *             loadScript('counter/counter-fallback.js');
 *         });
 * }
 *
 * function updateCounterDisplay(data) {
 *     const totalElement = document.querySelector('.total-visits .count');
 *     const uniqueElement = document.querySelector('.unique-visits .count');
 *     
 *     if (totalElement) {
 *         animateCount(totalElement, data.totalVisits);
 *     }
 *     
 *     if (uniqueElement) {
 *         animateCount(uniqueElement, data.uniqueVisits);
 *     }
 * }
 *
 * function animateCount(element, targetValue) {
 *     const startValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
 *     const duration = 1000; // 1 second
 *     const startTime = performance.now();
 *     
 *     function updateCount(currentTime) {
 *         const elapsed = currentTime - startTime;
 *         
 *         if (elapsed < duration) {
 *             const progress = elapsed / duration;
 *             const currentCount = Math.floor(startValue + progress * (targetValue - startValue));
 *             element.textContent = formatNumber(currentCount);
 *             requestAnimationFrame(updateCount);
 *         } else {
 *             element.textContent = formatNumber(targetValue);
 *         }
 *     }
 *     
 *     requestAnimationFrame(updateCount);
 * }
 *
 * function formatNumber(num) {
 *     return new Intl.NumberFormat().format(num);
 * }
 *
 * function loadScript(src) {
 *     const script = document.createElement('script');
 *     script.src = src;
 *     document.head.appendChild(script);
 * }
 */

/*
 * TROUBLESHOOTING
 * 
 * 1. Make sure the 'counter' directory exists and is writable
 * 2. For PHP counter, ensure counter-data.json is writable
 * 3. Test the fallback system using fallback-test.html
 * 4. Use developer tools to check for any JavaScript errors
 */
