import { createServer } from 'vite';
import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import Stripe from 'stripe';

// Load environment variables
configDotenv();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Express app for API routes
const api = express();
api.use(cors());
api.use(express.json());

// Stripe API routes
api.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { planName, price, isYearly } = req.body;
    
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
            unit_amount: Math.round(price * 100),
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

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

api.get('/api/checkout-session/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json(session);
  } catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create Vite server
const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'spa'
});

// Use Vite's connect middleware
api.use(vite.ssrFixStacktrace);
api.use(vite.middlewares);

const PORT = process.env.PORT || 5174;
api.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Vite + Stripe integration ready!`);
});
