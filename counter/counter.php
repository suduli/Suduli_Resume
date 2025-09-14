<?php
/**
 * Server-side Visit Counter
 * Tracks total visits and unique visitors
 */

// Set headers to prevent caching
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
header('Access-Control-Allow-Origin: *');

// Configuration
$dataFile = __DIR__ . '/counter-data.json';

// Initialize or load visit data
function loadVisits() {
    global $dataFile;
    if (!file_exists($dataFile)) {
        $data = [
            'totalVisits' => 0,
            'uniqueVisits' => 0,
            'lastReset' => time()
        ];
        file_put_contents($dataFile, json_encode($data));
        chmod($dataFile, 0666); // Make writable
        return $data;
    }
    
    $content = file_get_contents($dataFile);
    if (empty($content)) {
        $data = [
            'totalVisits' => 0,
            'uniqueVisits' => 0,
            'lastReset' => time()
        ];
        file_put_contents($dataFile, json_encode($data));
        return $data;
    }
    
    return json_decode($content, true);
}

// Save visit data
function saveVisits($data) {
    global $dataFile;
    
    // Ensure directory exists
    $directory = dirname($dataFile);
    if (!file_exists($directory)) {
        mkdir($directory, 0755, true);
    }
    
    // Save data
    try {
        file_put_contents($dataFile, json_encode($data));
        return true;
    } catch (Exception $e) {
        error_log('Error saving visit data: ' . $e->getMessage());
        return false;
    }
}

// Get visitor's ID (hashed IP + user agent)
function getVisitorId() {
    $ip = $_SERVER['REMOTE_ADDR'];
    $agent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'Unknown';
    
    // Only use part of the IP address for privacy
    $ipParts = explode('.', $ip);
    if (count($ipParts) > 2) {
        $ip = $ipParts[0] . '.' . $ipParts[1];
    }
    
    return md5($ip . substr($agent, 0, 20) . $_SERVER['HTTP_ACCEPT_LANGUAGE']);
}

// Check if this is a new unique visit
function isNewUniqueVisit() {
    $visitorId = getVisitorId();
    $cookieName = 'resume_visitor_id';
    
    // Check for cookie
    if (isset($_COOKIE[$cookieName]) && $_COOKIE[$cookieName] === $visitorId) {
        return false;
    }
    
    // Set cookie for 24 hours
    setcookie($cookieName, $visitorId, time() + 86400, '/');
    return true;
}

// Error handler
function handleError($message) {
    http_response_code(500);
    echo json_encode(['error' => $message]);
    exit;
}

// Try to load data
try {
    $data = loadVisits();
} catch (Exception $e) {
    handleError('Could not load visit data: ' . $e->getMessage());
}

// Handle the request
$action = isset($_GET['action']) ? $_GET['action'] : 'get';

switch ($action) {
    case 'increment':
        // Increment total visits
        $data['totalVisits']++;
        
        // Check if unique visit
        if (isNewUniqueVisit()) {
            $data['uniqueVisits']++;
        }
        
        // Save data
        if (!saveVisits($data)) {
            handleError('Could not save visit data.');
        }
        break;
        
    case 'reset':
        // Optional: Add security check here before allowing reset
        // For example, check for admin key or password
        if (isset($_GET['key']) && $_GET['key'] === 'your-secret-reset-key') {
            $data = [
                'totalVisits' => 0,
                'uniqueVisits' => 0,
                'lastReset' => time()
            ];
            saveVisits($data);
        } else {
            handleError('Unauthorized reset attempt.');
        }
        break;
}

// Return the current data
echo json_encode($data);
?>
