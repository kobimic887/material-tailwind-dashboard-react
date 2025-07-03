const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Import your backend server(s)
const stripeServer = require('./simple-stripe-server.js');
// If you have other backend servers, require them here

const app = express();

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy /api requests to your backend logic (example: Stripe)
// If your backend logic is in Express, mount the router here
// If not, use a proxy to the backend server
// Example: app.use('/api', stripeServer);

// If you want to proxy to another server:
// app.use('/api', createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true }));

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
