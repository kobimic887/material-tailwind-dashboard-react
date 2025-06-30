import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  Alert,
  Spinner,
} from "@material-tailwind/react";
import { 
  CloudIcon,
  ArrowPathIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

export function ApiTest() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const isDevelopment = window.location.hostname === 'localhost';
  const proxyEndpoint = isDevelopment 
    ? 'http://localhost:3002/api-proxy' 
    : '/api-proxy (Cloudflare Pages Function)';

  const fetchApiData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Determine the correct endpoint based on environment
      const isDevelopment = window.location.hostname === 'localhost';
      const apiUrl = isDevelopment 
        ? 'http://localhost:3002/api-proxy'  // Development proxy
        : '/api-proxy';                      // Cloudflare Pages function
      
      console.log(`Using API endpoint: ${apiUrl}`);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setResponse(result.data);
        setLastUpdated(result.timestamp);
      } else {
        throw new Error(result.error || 'Unknown error from proxy');
      }
      
    } catch (err) {
      console.error('API request failed:', err);
      setError(`Failed to fetch data: ${err.message}`);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on component mount
  useEffect(() => {
    fetchApiData();
  }, []);

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <CloudIcon className="w-10 h-10 text-white" />
          </CardHeader>
          <CardBody className="px-6 text-center">
            <Typography variant="h5" className="mb-2" color="blue-gray">
              API Test
            </Typography>
            <Typography className="font-normal text-blue-gray-600">
              Test connection to api.chemtest.tech:3000
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            variant="gradient"
            color="green"
            className="mb-4 grid h-28 place-items-center"
          >
            <CodeBracketIcon className="w-10 h-10 text-white" />
          </CardHeader>
          <CardBody className="px-6 text-center">
            <Typography variant="h5" className="mb-2" color="blue-gray">
              Live Response
            </Typography>
            <Typography className="font-normal text-blue-gray-600">
              Real-time API response data
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            variant="gradient"
            color="orange"
            className="mb-4 grid h-28 place-items-center"
          >
            <ArrowPathIcon className="w-10 h-10 text-white" />
          </CardHeader>
          <CardBody className="px-6 text-center">
            <Typography variant="h5" className="mb-2" color="blue-gray">
              Auto Refresh
            </Typography>
            <Typography className="font-normal text-blue-gray-600">
              Click refresh to get latest data
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* Controls */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h6" color="blue-gray">
                API Endpoint: api.chemtest.tech:3000 (via proxy)
              </Typography>
              <Typography variant="small" color="gray" className="mb-1">
                Proxy: {proxyEndpoint}
              </Typography>
              <Typography variant="small" color="blue-gray" className="mb-1">
                Environment: {isDevelopment ? 'Development' : 'Production'}
              </Typography>
              {lastUpdated && (
                <Typography variant="small" color="gray">
                  Last updated: {new Date(lastUpdated).toLocaleString()}
                </Typography>
              )}
            </div>
            <Button
              size="sm"
              color="blue"
              onClick={fetchApiData}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <ArrowPathIcon className="h-4 w-4" />
              )}
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert color="red" className="mb-6">
          <div className="flex items-center gap-2">
            <Typography variant="h6">Error:</Typography>
            <Typography>{error}</Typography>
          </div>
        </Alert>
      )}

      {/* Response Display */}
      <Card>
        <CardHeader
          variant="gradient"
          color="blue-gray"
          className="mb-4 grid h-12 place-items-center"
        >
          <Typography variant="h6" color="white">
            API Response
          </Typography>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner className="h-8 w-8" />
              <Typography className="ml-2">Fetching data from API...</Typography>
            </div>
          ) : response ? (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <Typography variant="small" color="gray" className="mb-2">
                Raw Response:
              </Typography>
              <pre className="whitespace-pre-wrap text-sm font-mono bg-white p-4 rounded border overflow-auto max-h-96">
                {response}
              </pre>
            </div>
          ) : (
            <div className="text-center py-12">
              <Typography color="gray">
                No data available. Click refresh to fetch from the API.
              </Typography>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default ApiTest;
