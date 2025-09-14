/**
 * Vercel Serverless Function for Visitor Tracking
 * File: /api/visitors.js
 * 
 * This function handles visitor tracking with rate limiting and data validation
 * Supports both Firebase Firestore and Supabase as database backends
 */

// Database configuration - Choose your preferred database
const DATABASE_TYPE = process.env.DATABASE_TYPE || 'firestore'; // 'firestore' or 'supabase'

// Import database modules based on configuration
let db;
if (DATABASE_TYPE === 'firestore') {
    // Firebase Firestore configuration
    const admin = require('firebase-admin');
    
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
            databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
        });
    }
    
    db = admin.firestore();
} else if (DATABASE_TYPE === 'supabase') {
    // Supabase configuration
    const { createClient } = require('@supabase/supabase-js');
    
    db = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
    );
}

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;
const rateLimitMap = new Map();

/**
 * Main handler function
 */
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Rate limiting
        const clientIP = getClientIP(req);
        if (!isRequestAllowed(clientIP)) {
            return res.status(429).json({ 
                error: 'Too many requests',
                message: 'Rate limit exceeded. Please try again later.' 
            });
        }

        if (req.method === 'GET') {
            return await handleGetVisitors(req, res);
        } else if (req.method === 'POST') {
            return await handleTrackVisit(req, res);
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'An unexpected error occurred' 
        });
    }
}

/**
 * Handle GET requests - Return current visitor statistics
 */
async function handleGetVisitors(req, res) {
    try {
        const stats = await getVisitorStats();
        
        res.status(200).json({
            success: true,
            counters: stats,
            timestamp: Date.now()
        });
    } catch (error) {
        console.error('Error fetching visitor stats:', error);
        res.status(500).json({ 
            error: 'Failed to fetch visitor statistics',
            message: error.message 
        });
    }
}

/**
 * Handle POST requests - Track a new visit
 */
async function handleTrackVisit(req, res) {
    try {
        const { action, data, counters } = req.body;

        if (action !== 'track_visit' || !data) {
            return res.status(400).json({ 
                error: 'Invalid request',
                message: 'Missing required fields: action, data' 
            });
        }

        // Validate visitor data
        if (!isValidVisitorData(data)) {
            return res.status(400).json({ 
                error: 'Invalid visitor data',
                message: 'Visitor data validation failed' 
            });
        }

        // Save visitor record
        await saveVisitorRecord(data);

        // Update counters
        const updatedStats = await updateVisitorStats(counters, data);

        res.status(200).json({
            success: true,
            message: 'Visit tracked successfully',
            counters: updatedStats,
            timestamp: Date.now()
        });
    } catch (error) {
        console.error('Error tracking visit:', error);
        res.status(500).json({ 
            error: 'Failed to track visit',
            message: error.message 
        });
    }
}

/**
 * Database operations for Firestore
 */
async function getVisitorStatsFirestore() {
    const doc = await db.collection('website_stats').doc('visitor_counters').get();
    
    if (!doc.exists) {
        // Initialize default stats
        const defaultStats = {
            uniqueVisitors: 0,
            totalPageViews: 0,
            returnVisitors: 0,
            lastUpdated: Date.now(),
            createdAt: Date.now()
        };
        
        await db.collection('website_stats').doc('visitor_counters').set(defaultStats);
        return defaultStats;
    }
    
    return doc.data();
}

async function updateVisitorStatsFirestore(counters, visitorData) {
    const docRef = db.collection('website_stats').doc('visitor_counters');
    
    await docRef.update({
        uniqueVisitors: counters.uniqueVisitors,
        totalPageViews: counters.totalPageViews,
        returnVisitors: counters.returnVisitors,
        lastUpdated: Date.now()
    });
    
    return counters;
}

async function saveVisitorRecordFirestore(data) {
    await db.collection('visitor_logs').add({
        ...data,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: Date.now()
    });
}

/**
 * Database operations for Supabase
 */
async function getVisitorStatsSupabase() {
    const { data, error } = await db
        .from('visitor_counters')
        .select('*')
        .single();
    
    if (error || !data) {
        // Initialize default stats
        const defaultStats = {
            unique_visitors: 0,
            total_page_views: 0,
            return_visitors: 0,
            last_updated: new Date().toISOString(),
            created_at: new Date().toISOString()
        };
        
        await db.from('visitor_counters').insert(defaultStats);
        
        return {
            uniqueVisitors: defaultStats.unique_visitors,
            totalPageViews: defaultStats.total_page_views,
            returnVisitors: defaultStats.return_visitors,
            lastUpdated: Date.now()
        };
    }
    
    return {
        uniqueVisitors: data.unique_visitors,
        totalPageViews: data.total_page_views,
        returnVisitors: data.return_visitors,
        lastUpdated: new Date(data.last_updated).getTime()
    };
}

async function updateVisitorStatsSupabase(counters, visitorData) {
    const { error } = await db
        .from('visitor_counters')
        .update({
            unique_visitors: counters.uniqueVisitors,
            total_page_views: counters.totalPageViews,
            return_visitors: counters.returnVisitors,
            last_updated: new Date().toISOString()
        })
        .eq('id', 1);
    
    if (error) {
        throw new Error(`Failed to update stats: ${error.message}`);
    }
    
    return counters;
}

async function saveVisitorRecordSupabase(data) {
    const { error } = await db
        .from('visitor_logs')
        .insert({
            session_id: data.sessionId,
            is_new_visitor: data.isNewVisitor,
            user_agent: data.userAgent,
            referrer: data.referrer,
            url: data.url,
            viewport: data.viewport,
            timezone: data.timezone,
            timestamp: new Date(data.timestamp).toISOString(),
            created_at: new Date().toISOString()
        });
    
    if (error) {
        throw new Error(`Failed to save visitor record: ${error.message}`);
    }
}

/**
 * Wrapper functions for database operations
 */
async function getVisitorStats() {
    if (DATABASE_TYPE === 'firestore') {
        return await getVisitorStatsFirestore();
    } else if (DATABASE_TYPE === 'supabase') {
        return await getVisitorStatsSupabase();
    }
}

async function updateVisitorStats(counters, visitorData) {
    if (DATABASE_TYPE === 'firestore') {
        return await updateVisitorStatsFirestore(counters, visitorData);
    } else if (DATABASE_TYPE === 'supabase') {
        return await updateVisitorStatsSupabase(counters, visitorData);
    }
}

async function saveVisitorRecord(data) {
    if (DATABASE_TYPE === 'firestore') {
        return await saveVisitorRecordFirestore(data);
    } else if (DATABASE_TYPE === 'supabase') {
        return await saveVisitorRecordSupabase(data);
    }
}

/**
 * Utility functions
 */
function getClientIP(req) {
    return req.headers['x-forwarded-for'] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
           '127.0.0.1';
}

function isRequestAllowed(clientIP) {
    const now = Date.now();
    const clientData = rateLimitMap.get(clientIP) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
    
    // Reset counter if window has passed
    if (now > clientData.resetTime) {
        clientData.count = 0;
        clientData.resetTime = now + RATE_LIMIT_WINDOW;
    }
    
    // Check if request is allowed
    if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
        return false;
    }
    
    // Increment counter
    clientData.count++;
    rateLimitMap.set(clientIP, clientData);
    
    return true;
}

function isValidVisitorData(data) {
    return data &&
           typeof data.sessionId === 'string' &&
           typeof data.isNewVisitor === 'boolean' &&
           typeof data.timestamp === 'number' &&
           data.timestamp > 0 &&
           data.timestamp <= Date.now() + 5000; // Allow 5 second clock skew
}

// Clean up rate limit map periodically
setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of rateLimitMap.entries()) {
        if (now > data.resetTime) {
            rateLimitMap.delete(ip);
        }
    }
}, RATE_LIMIT_WINDOW);
