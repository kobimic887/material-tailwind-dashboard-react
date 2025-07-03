import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  Alert,
  Spinner,
  Input,
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
  const [apiUrl, setApiUrl] = useState('/api/httpbin');
  const [useHttpbin, setUseHttpbin] = useState(true);

  const fetchApiData = async () => {
    setLoading(true);
    setError('');
    try {
      let fetchUrl = apiUrl;
      if (useHttpbin) {
        fetchUrl = '/api/httpbin';
      }
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      if (result.success !== false) {
        setResponse(result.data);
        setLastUpdated(result.timestamp || new Date().toISOString());
      } else {
        throw new Error(result.error || 'Unknown error from API');
      }
    } catch (err) {
      setError(`Failed to fetch data: ${err.message}`);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on component mount
  useEffect(() => {
    fetchApiData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="mt-12">
      <div className="mb-6 flex items-center gap-4">
        <label className="flex items-center mr-4">
          <input
            type="checkbox"
            checked={useHttpbin}
            onChange={e => setUseHttpbin(e.target.checked)}
            className="mr-2"
          />
          Use /api/httpbin (guaranteed to work)
        </label>
        <Input
          label="API URL"
          value={apiUrl}
          onChange={e => setApiUrl(e.target.value)}
          className="w-full max-w-xl"
          disabled={useHttpbin}
        />
        <Button
          size="sm"
          color="blue"
          onClick={fetchApiData}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? <Spinner className="h-4 w-4" /> : <ArrowPathIcon className="h-4 w-4" />}
          {loading ? 'Loading...' : 'Fetch'}
        </Button>
      </div>
      {error && (
        <Alert color="red" className="mb-6">
          <div className="flex items-center gap-2">
            <Typography variant="h6">Error:</Typography>
            <Typography>{error}</Typography>
          </div>
        </Alert>
      )}
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
                {typeof response === 'object' ? JSON.stringify(response, null, 2) : String(response)}
              </pre>
            </div>
          ) : (
            <div className="text-center py-12">
              <Typography color="gray">
                No data available. Click fetch to get data from the API.
              </Typography>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default ApiTest;
