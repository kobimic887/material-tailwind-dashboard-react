const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy /api requests to your backend logic (example: Stripe)
// If your backend logic is in Express, mount the router here
// If not, use a proxy to the backend server
// Example: app.use('/api', stripeServer);

// Test email configuration endpoint
app.get('/api/test-email', async (req, res) => {
  const configs = [
    {
      name: 'Titan STARTTLS 587',
      host: 'smtp.titan.email',
      port: 587,
      secure: false,
      requireTLS: true,
      tls: { rejectUnauthorized: false }
    },
    {
      name: 'Titan SSL 465',
      host: 'smtp.titan.email', 
      port: 465,
      secure: true,
      tls: { rejectUnauthorized: false }
    },
    {
      name: 'Alternative Titan STARTTLS',
      host: 'mail.titan.email',
      port: 587,
      secure: false,
      requireTLS: true,
      tls: { rejectUnauthorized: false }
    },
    {
      name: 'Titan Basic 587',
      host: 'smtp.titan.email',
      port: 587,
      secure: false,
      ignoreTLS: false
    }
  ];

  for (let config of configs) {
    try {
      console.log(`Testing config: ${config.name}`);
      const transporter = nodemailer.createTransporter({
        ...config,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        }
      });

      await transporter.verify();
      return res.json({ 
        success: true, 
        message: `Email configuration working with: ${config.name}`,
        config: config.name
      });
    } catch (error) {
      console.error(`${config.name} failed:`, error.message);
    }
  }

  res.status(500).json({ 
    success: false, 
    error: 'All email configurations failed',
    details: 'Please check your Titan Mail credentials and settings'
  });
});

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, subject, message, recipientEmail } = req.body;

    // Validate required fields
    if (!name || !subject || !message || !recipientEmail) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields including recipient email are required' 
      });
    }

    // Try multiple configurations until one works
    const configs = [
      {
        host: 'smtp.titan.email',
        port: 587,
        secure: false,
        requireTLS: true,
        tls: { rejectUnauthorized: false }
      },
      {
        host: 'smtp.titan.email', 
        port: 465,
        secure: true,
        tls: { rejectUnauthorized: false }
      },
      {
        host: 'mail.titan.email',
        port: 587,
        secure: false,
        requireTLS: true,
        tls: { rejectUnauthorized: false }
      }
    ];

    let emailSent = false;
    for (let config of configs) {
      try {
        const transporter = nodemailer.createTransporter({
          ...config,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          }
        });

        // Email content
        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: recipientEmail,
          subject: `${subject}`,
          html: `
            <h2>Message from ${name}</h2>
            <p><strong>From:</strong> ${name} (via ${process.env.EMAIL_FROM})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <hr>
            <p style="color: #666; font-size: 12px;">
              This email was sent from ${process.env.EMAIL_FROM} via the email client.
            </p>
          `,
          text: `
            Message from ${name}
            
            From: ${name} (via ${process.env.EMAIL_FROM})
            Subject: ${subject}
            
            Message:
            ${message}
            
            ---
            This email was sent from ${process.env.EMAIL_FROM} via the email client.
          `
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;
        break;
      } catch (configError) {
        console.error(`Config failed:`, configError.message);
        continue;
      }
    }

    if (emailSent) {
      res.json({ success: true, message: 'Email sent successfully' });
    } else {
      throw new Error('All email configurations failed');
    }
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send email. Please check email configuration.' 
    });
  }
});

// Basic test endpoint for GET requests
app.get('/api/hello', (req, res) => {
  res.json({ success: true, data: 'Hello from Express!', timestamp: new Date().toISOString() });
});

// Example endpoint to proxy a GET request to another site
app.get('/api/proxy', async (req, res) => {
  try {
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`Express server running on port ${PORT}`));
