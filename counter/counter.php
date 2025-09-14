<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Configuration
$dataFile = __DIR__ . '/visits.json';

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
        return $data;
    }
    
    return json_decode(file_get_contents($dataFile), true);
}

// Save visit data
function saveVisits($data) {
    global $dataFile;
    file_put_contents($dataFile, json_encode($data));
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
    
    return md5($ip . substr($agent, 0, 20));
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

// Handle the request
$action = isset($_GET['action']) ? $_GET['action'] : 'get';
$data = loadVisits();

switch ($action) {
    case 'increment':
        // Increment total visits
        $data['totalVisits']++;
        
        // Check if unique visit
        if (isNewUniqueVisit()) {
            $data['uniqueVisits']++;
        }
        
        saveVisits($data);
        break;
        
    case 'reset':
        // Optional: Add security check here before allowing reset
        $data = [
            'totalVisits' => 0,
            'uniqueVisits' => 0,
            'lastReset' => time()
        ];
        saveVisits($data);
        break;
}

// Return the current data
echo json_encode($data);
?>
