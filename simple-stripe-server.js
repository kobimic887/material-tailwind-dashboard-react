import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';

// Load environment variables
dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY not found in environment variables');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Proxy endpoint for API test (to bypass CORS)
app.get('/api-proxy', async (req, res) => {
  try {
    console.log('🔄 Proxying request to api.chemtest.tech:3000');
    
    const response = await fetch('http://api.chemtest.tech:3000');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.text();
    console.log('✅ API proxy successful');
    
    res.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString(),
      source: 'api.chemtest.tech:3000'
    });
    
  } catch (error) {
    console.error('❌ API proxy error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Simple test endpoint for http://13.51.13.81:3000/api/hello
app.get('/test-hello', async (req, res) => {
  try {
    const response = await fetch('http://13.51.13.81:3000/api/hello');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.text();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create checkout session
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { planName, price, isYearly } = req.body;
    
    if (!planName || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    console.log(`Creating checkout session for ${planName} - $${price} (${isYearly ? 'yearly' : 'monthly'})`);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${planName} Plan`,
              description: `${planName} subscription for molecular research tools`,
            },
            unit_amount: Math.round(price * 100), // Convert to cents
            recurring: {
              interval: isYearly ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin || 'http://localhost:5174'}/dashboard/paidplans?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'http://localhost:5174'}/dashboard/paidplans?canceled=true`,
      metadata: {
        plan: planName,
        billing: isYearly ? 'yearly' : 'monthly'
      }
    });

    console.log('✅ Checkout session created:', session.id);
    res.json({ url: session.url, sessionId: session.id });
    
  } catch (error) {
    console.error('❌ Error creating checkout session:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get session details
app.get('/checkout-session/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json(session);
  } catch (error) {
    console.error('❌ Error retrieving session:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3002; // Use a different port to avoid conflicts
app.listen(PORT, () => {
  console.log(`🚀 Stripe API server running on http://localhost:${PORT}`);
  console.log(`✅ Ready to handle checkout sessions`);
});
