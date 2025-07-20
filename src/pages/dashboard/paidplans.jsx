import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Switch,
  Chip,
  Alert,
  Spinner,
} from "@material-tailwind/react";
import { CheckIcon, XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export function PaidPlans() {
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Check if Stripe is properly configured
  const isStripeConfigured = !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  // Handle toggle change
  const handleToggleChange = () => {
    const newValue = !isYearly;
    console.log('Toggle changed from', isYearly, 'to', newValue);
    setIsYearly(newValue);
  };

  // Check for payment success/cancel from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success')) {
      issueSimulationTokens(50);
      setMessage('Payment received! Your subscription is now active.');
      setMessageType('success');
    } else if (urlParams.get('canceled')) {
      setMessage('Payment was canceled. You can try again anytime.');
      setMessageType('error');
    }
  }, []);

  const plans = [
     {
      name: 'Trial',
      subtitle: 'Affordable access for anyone to understand the concept',
      monthlyPrice: null,
      yearlyPrice: null,
      popular: false,
      description: 'Affordable access for anyone to understand the concept',
      features: [
        'Trial',
        '4 credits',        
        'Low job priority',
        'Most models & settings',
        'Email Support',
        'Guaranteed Confidentiality',
      ],
      buttonText: 'Get Tokens and Try',
      buttonColor: 'gray'
    },
    {
      name: 'Budget',
      subtitle: 'Affordable access for students and researchers',
      monthlyPrice: 6.42,
      yearlyPrice: 77.04,
      popular: false,
      description: 'Affordable access for students and researchers with light computational needs.',
      features: [
        'Academic Use',
        '84 credits/year',
        '7 parallel jobs',
        'Low job priority',
        'Most models & settings',
        'Email Support',
        'Guaranteed Confidentiality',
        'Unlimited Data Storage',
        'Full Pipelines Access',
        'Full API Access',
        'Max 5k Residues Protein Folding',
        'Access to Molecular Dynamics',
        'Folding Simulation Not Included'
      ],
      buttonText: 'Purchase',
      buttonColor: 'blue-gray'
    },
    {
      name: 'Standard',
      subtitle: 'Best for active research projects',
      monthlyPrice: 12.08,
      yearlyPrice: 144.96,
      popular: false,
      description: 'The best choice for active research projects needing more power.',
      features: [
        'Academic Use',
        '168 credits/year',
        '14 parallel jobs',
        'Medium job priority',
        'Most models & settings',
        'Email Support',
        'Guaranteed Confidentiality',
        'Unlimited Data Storage',
        'Full Pipelines Access',
        'Full API Access',
        'Max 5k Residues Protein Folding',
        'Access to Molecular Dynamics',
        'Folding Simulation Not Included'
      ],
      buttonText: 'Purchase',
      buttonColor: 'blue'
    },
    {
      name: 'Academic',
      subtitle: 'For serious academic research',
      monthlyPrice: 21.25,
      yearlyPrice: 255.00,
      popular: true,
      description: 'Designed for serious academic research with higher compute demands.',
      features: [
        'Academic Use',
        '300 credits/year',
        '30 parallel jobs',
        'Medium job priority',
        'Most models & settings',
        'Preferred Support',
        'Guaranteed Confidentiality',
        'Unlimited Data Storage',
        'Full Pipelines Access',
        'Full API Access',
        'Max 5k Residues Protein Folding',
        'Access to Molecular Dynamics',
        'Folding Simulation Not Included'
      ],
      buttonText: 'Purchase',
      buttonColor: 'indigo'
    },
    {
      name: 'Professional',
      subtitle: 'The powerhouse plan for professionals',
      monthlyPrice: 66.67,
      yearlyPrice: 800.04,
      popular: false,
      description: 'The powerhouse plan for professionals needing large-scale computation.',
      features: [
        'Commercial Use',
        '720 credits/year',
        '60 parallel jobs',
        'High job priority',
        'All models & settings',
        'Priority Support',
        'Guaranteed Confidentiality',
        'Unlimited Data Storage',
        'Full Pipelines Access',
        'Full API Access',
        'Max 5k Residues Protein Folding',
        'Access to Molecular Dynamics',
        'Folding Simulation Not Included'
      ],
      buttonText: 'Purchase',
      buttonColor: 'purple'
    },
    {
      name: 'Enterprise',
      subtitle: 'Custom solutions for businesses and large-scale projects',
      monthlyPrice: null,
      yearlyPrice: null,
      popular: false,
      description: 'Commercial use rights, unlimited users, unlimited parallel jobs, custom models/pipelines/visualizations. Contact for pricing.',
      features: [
        'Commercial Use',
        'Unlimited users',
        'Unlimited parallel jobs',
        'Custom models, pipelines, visualizations',
        'Pyxis-discover Teams',
        'Contact for pricing'
      ],
      buttonText: 'Contact Us',
      buttonColor: 'gray'
    }
  ];  const handlePlanSelection = async (plan) => {
    // Check if Stripe is configured
    if (!isStripeConfigured) {
      setMessage('Stripe is not configured. Please check the setup instructions.');
      setMessageType('error');
      return;
    }

    if (plan.name === 'Trial') {
      // Handle trial
      issueSimulationTokens(4);
      setMessage('Your subscription is now active.');
      setMessageType('success');
      return;
    }
    if (plan.name === 'Enterprise') {
      // Handle enterprise contact separately
      window.open('mailto:sales@asinex.com?subject=Enterprise Plan Inquiry&body=I am interested in the Enterprise plan for molecular research tools.');
      return;
    }
    setLoading(true);
    setMessage('');

    try {
      const result = await createCheckoutSession(plan, isYearly);
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Redirect to checkout
      window.location.href = result.url;
      
    } catch (error) {
      console.error('Error:', error);
      setMessage(`Failed to start checkout: ${error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to create checkout session
  const createCheckoutSession = async (plan, isYearly) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`https://${window.location.hostname}:3000/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          planName: plan.name,
          price: isYearly ? plan.yearlyPrice : plan.monthlyPrice,
          isYearly: isYearly,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return { error: error.message };
    }
  };

  // Helper to issue simulation tokens after payment
  const issueSimulationTokens = async (tokensAmount) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`https://${window.location.hostname}:3000/api/issueSimulationTokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ simulationTokens: tokensAmount })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to issue simulation tokens');
      }
      const data = await response.json();
      localStorage.setItem("simulation_tokens", JSON.stringify(tokensAmount));
      console.log('Simulation tokens issued:', data);
      // Scroll to top so user sees the message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Dispatch custom event to update tokens in dashboard navbar
      if (data && typeof data.tokens === 'number') {
        window.dispatchEvent(new CustomEvent('tokensUpdated', { detail: { tokens: data.tokens } }));
      }
      // Optionally, show a message or update UI
    } catch (error) {
      console.error('Error issuing simulation tokens:', error);
      // Optionally, show an error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Stripe Configuration Error */}
        {!isStripeConfigured && (
          <div className="mb-8">
            <Alert
              color="red"
              icon={<XMarkIcon className="h-5 w-5" />}
            >
              <div>
                <Typography className="font-semibold mb-2">Stripe Not Configured</Typography>
                <Typography className="text-sm">
                  Stripe payment integration is not properly configured. Please check the STRIPE_SETUP.md file for setup instructions.
                </Typography>
              </div>
            </Alert>
          </div>
        )}

        {/* Success/Error Messages */}
        {message && (
          <div className="mb-8">
            <Alert
              color={messageType === 'success' ? 'green' : 'red'}
              icon={messageType === 'success' ? <CheckCircleIcon className="h-5 w-5" /> : <XMarkIcon className="h-5 w-5" />}
              onClose={() => setMessage('')}
              dismissible
            >
              {message}
            </Alert>
          </div>
        )}

        {/* Header Section */}
        <div className="text-center mb-16">
          <Typography variant="h1" className="mb-4 text-4xl lg:text-5xl font-bold text-gray-900">
            Choose Your Plan
          </Typography>
          <Typography variant="lead" className="mb-8 text-xl text-gray-600 max-w-3xl mx-auto">
            Elevate your molecular research without breaking the bank! Our pricing options make 
            advanced computational tools accessible to every researcher and scientist.
          </Typography>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <Typography className={`text-lg font-medium ${!isYearly ? 'text-blue-600' : 'text-gray-500'}`}>
              Billed Monthly
            </Typography>
            <div className="relative">
              <button
                onClick={handleToggleChange}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isYearly ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isYearly ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Typography className={`text-lg font-medium ${isYearly ? 'text-blue-600' : 'text-gray-500'}`}>
                Billed Yearly
              </Typography>
              <Chip
                value="Save up to 20%"
                className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1"
              />
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className="relative">
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Chip
                    value="Most Popular"
                    className="bg-blue-600 text-white font-semibold px-4 py-2"
                  />
                </div>
              )}
              
              <Card className={`h-full ${plan.popular ? 'ring-2 ring-blue-600 shadow-xl scale-105' : 'shadow-lg hover:shadow-xl'} transition-all duration-300`}>
                <CardBody className="p-8">
                  <div className="text-center mb-8">
                    <Typography variant="h4" className="mb-2 font-bold text-gray-900">
                      {plan.name}
                    </Typography>
                    <Typography className="text-gray-600 mb-6">
                      {plan.subtitle}
                    </Typography>
                    
                    <div className="mb-4">
                      <div className="flex items-baseline justify-center">
                        <Typography variant="h2" className="text-4xl font-bold text-gray-900">
                          ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                        </Typography>
                        <Typography className="text-gray-500 ml-2">
                          /{isYearly ? 'year' : 'month'}
                        </Typography>
                      </div>
                      {isYearly && plan.yearlyPrice && plan.monthlyPrice && (
                        <Typography className="text-green-600 text-sm mt-1">
                          Save ${((plan.monthlyPrice * 12) - plan.yearlyPrice).toFixed(0)}/year
                        </Typography>
                      )}
                    </div>
                    
                    <Typography className="text-gray-600 text-sm mb-6">
                      {plan.description}
                    </Typography>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <Typography className="text-gray-700 text-sm">
                          {feature}
                        </Typography>
                      </div>
                    ))}
                  </div>                  <Button
                    onClick={() => handlePlanSelection(plan)}
                    color={plan.buttonColor}
                    size="lg"
                    className="w-full"
                    variant={plan.popular ? "filled" : "outlined"}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <Spinner className="h-4 w-4 mr-2" />
                        Processing...
                      </div>
                    ) : (
                      plan.buttonText
                    )}
                  </Button>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 text-center">
          <Typography className="text-gray-600 mb-4">
            All plans include a 14-day free trial. No credit card required to start.
          </Typography>
          <Typography className="text-gray-500 text-sm">
            Questions about our plans? <a href="#" className="text-blue-600 hover:underline">Contact our sales team</a>
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default PaidPlans;