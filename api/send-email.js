/**
 * Vercel Serverless Function for Email Sending
 * File: /api/send-email.js
 * 
 * This function handles contact form submissions by sending emails to suduli.office@gmail.com
 */

const nodemailer = require('nodemailer');

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3; // Max 3 emails per minute per IP
const rateLimitMap = new Map();

/**
 * Main handler function
 */
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ 
            error: 'Method not allowed',
            message: 'Only POST requests are allowed' 
        });
    }

    try {
        // Rate limiting
        const clientIP = getClientIP(req);
        if (!isRequestAllowed(clientIP)) {
            return res.status(429).json({ 
                error: 'Too many requests',
                message: 'Rate limit exceeded. Please wait before sending another message.' 
            });
        }

        // Validate request body
        const { name, email, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                message: 'Name, email, and message are required' 
            });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ 
                error: 'Invalid email',
                message: 'Please provide a valid email address' 
            });
        }

        // Sanitize inputs
        const sanitizedData = {
            name: sanitizeInput(name),
            email: sanitizeInput(email),
            message: sanitizeInput(message)
        };

        // Send email
        await sendContactEmail(sanitizedData);

        res.status(200).json({
            success: true,
            message: 'Email sent successfully! I will get back to you soon.',
            timestamp: Date.now()
        });

    } catch (error) {
        console.error('Email sending error:', error);
        
        // Don't expose internal errors to client
        res.status(500).json({ 
            error: 'Failed to send email',
            message: 'An unexpected error occurred. Please try again later.' 
        });
    }
}

/**
 * Send contact email using nodemailer
 */
async function sendContactEmail({ name, email, message }) {
    // Create transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER || 'suduli.office@gmail.com',
            pass: process.env.GMAIL_APP_PASSWORD // Gmail App Password required
        },
        secure: true,
        tls: {
            rejectUnauthorized: false
        }
    });

    // Email options
    const mailOptions = {
        from: `"Portfolio Contact Form" <${process.env.GMAIL_USER || 'suduli.office@gmail.com'}>`,
        to: 'suduli.office@gmail.com',
        replyTo: email,
        subject: `New Contact Form Message from ${name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <div style="background: linear-gradient(135deg, #00f5ff, #ff6b6b); padding: 20px; text-align: center; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Message</h1>
                    <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">From your automotive portfolio website</p>
                </div>
                
                <div style="padding: 20px 0;">
                    <h2 style="color: #333; margin-bottom: 15px; font-size: 18px;">Contact Details:</h2>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                        <p style="margin: 0 0 10px 0; color: #555;"><strong>Name:</strong> ${name}</p>
                        <p style="margin: 0 0 10px 0; color: #555;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #00f5ff; text-decoration: none;">${email}</a></p>
                        <p style="margin: 0; color: #555;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                    </div>
                    
                    <h2 style="color: #333; margin-bottom: 15px; font-size: 18px;">Message:</h2>
                    <div style="background: #ffffff; padding: 20px; border: 1px solid #e9ecef; border-radius: 6px; line-height: 1.6;">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 6px 6px; margin: 20px -20px -20px -20px;">
                    <p style="margin: 0; color: #666; font-size: 14px;">
                        This message was sent from your portfolio contact form.<br>
                        You can reply directly to this email to respond to ${name}.
                    </p>
                </div>
            </div>
        `,
        text: `
New Contact Form Message

From: ${name}
Email: ${email}
Date: ${new Date().toLocaleString()}

Message:
${message}

---
This message was sent from your portfolio contact form.
Reply to this email to respond to ${name}.
        `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    return info;
}

/**
 * Utility functions
 */
function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] || 
           req.connection?.remoteAddress || 
           req.socket?.remoteAddress ||
           req.headers['x-real-ip'] ||
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

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .substring(0, 1000); // Limit length
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