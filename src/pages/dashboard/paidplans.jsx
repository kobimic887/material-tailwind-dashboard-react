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
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RdEJXRoUpt5JJL5UJhyggws1ET7O0L54fJGG8pR6Ndg30rlbUGRIZhhRD2ego47TjMTqqVlaLendVMlLgw2EM5o00ABLhg6Hg');

export function PaidPlans() {
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Check for payment success/cancel from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success')) {
      setMessage('Payment successful! Your subscription is now active.');
      setMessageType('success');
    } else if (urlParams.get('canceled')) {
      setMessage('Payment was canceled. You can try again anytime.');
      setMessageType('error');
    }
  }, []);

  const plans = [
    {
      name: 'Starter',
      subtitle: 'Perfect for students and basic research',
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      popular: false,
      description: 'Affordable access for students and researchers with light computational needs.',
      features: [
        'Up to 50 molecular simulations/month',
        '2D molecule visualization',
        'Basic SMILES parsing',
        'Email support',
        'Standard processing priority',
        'Export results as PNG/SVG',
        'Basic molecular properties'
      ],
      buttonText: 'Start Free Trial',
      buttonColor: 'blue-gray'
    },
    {
      name: 'Professional',
      subtitle: 'Best for active research projects',
      monthlyPrice: 29.99,
      yearlyPrice: 299.99,
      popular: true,
      description: 'The best choice for active research projects needing more computational power.',
      features: [
        'Up to 500 molecular simulations/month',
        'Advanced 3D molecular modeling',
        'SMILES and InChI support',
        'Priority email support',
        'High processing priority',
        'Export in multiple formats',
        'Advanced molecular properties',
        'Batch processing capabilities',
        'API access',
        'Collaboration tools'
      ],
      buttonText: 'Start Free Trial',
      buttonColor: 'blue'
    },
    {
      name: 'Enterprise',
      subtitle: 'For large-scale research institutions',
      monthlyPrice: 99.99,
      yearlyPrice: 999.99,
      popular: false,
      description: 'Designed for serious academic research with unlimited computational demands.',
      features: [
        'Unlimited molecular simulations',
        'Full 3D molecular dynamics',
        'All molecular formats supported',
        'Dedicated support manager',
        'Highest processing priority',
        'Custom export formats',
        'Complete molecular analysis suite',
        'Advanced batch processing',
        'Full API access with webhooks',
        'Team collaboration tools',
        'Custom integrations',
        'On-premises deployment option'
      ],
      buttonText: 'Contact Sales',
      buttonColor: 'gray'
    }
  ];
  const handlePlanSelection = async (plan) => {
    if (plan.name === 'Enterprise') {
      // Handle enterprise contact separately
      window.open('mailto:sales@yourdomain.com?subject=Enterprise Plan Inquiry&body=I am interested in the Enterprise plan for molecular research tools.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3001/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName: plan.name,
          price: isYearly ? plan.yearlyPrice : plan.monthlyPrice,
          isYearly: isYearly,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      setMessage('Failed to start checkout process. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">      <div className="max-w-7xl mx-auto">
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
            <Switch
              checked={isYearly}
              onChange={(e) => setIsYearly(e.target.checked)}
              color="blue"
              className="h-6 w-12"
            />
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
                      {isYearly && (
                        <Typography className="text-green-600 text-sm mt-1">
                          Save ${(plan.monthlyPrice * 12 - plan.yearlyPrice).toFixed(0)}/year
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