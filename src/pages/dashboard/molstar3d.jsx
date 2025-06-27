import React, { useEffect, useRef, useState, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  Input,
  Textarea,
  Select,
  Option,
  Alert,
  Spinner,
} from "@material-tailwind/react";
import { 
  CubeTransparentIcon,
  DocumentArrowUpIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { createPluginUI } from 'molstar/lib/mol-plugin-ui/index';
import { PluginUIContext } from 'molstar/lib/mol-plugin-ui/context';
import { DefaultPluginSpec } from 'molstar/lib/mol-plugin/spec';
import { PluginConfig } from 'molstar/lib/mol-plugin/config';

export function Molstar3D() {
  const molstarRef = useRef(null);
  const [plugin, setPlugin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pdbId, setPdbId] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [loadType, setLoadType] = useState('pdb');

  // Sample PDB IDs for quick testing
  const samplePDBs = [
    { id: '1mbo', name: 'Myoglobin' },
    { id: '2hmi', name: 'Hemoglobin' },
    { id: '3j3q', name: 'SARS-CoV-2 Spike Protein' },
    { id: '1bna', name: 'B-DNA' },
    { id: '4hhb', name: 'Deoxyhemoglobin' }
  ];

  useEffect(() => {
    if (molstarRef.current && !plugin) {
      initializeMolstar();
    }

    return () => {
      if (plugin) {
        plugin.dispose();
      }
    };
  }, []);

  const initializeMolstar = async () => {
    try {
      setLoading(true);
      
      // Create the plugin with React rendering
      const pluginUI = await createPluginUI({
        target: molstarRef.current,
        render: (component, container) => {
          const root = createRoot(container);
          root.render(component);
        }
      });

      setPlugin(pluginUI);
      setSuccess('Molstar initialized successfully! Ready to load molecular structures.');
    } catch (err) {
      console.error('Failed to initialize Molstar:', err);
      setError('Failed to initialize Molstar viewer. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const loadPDBStructure = async (pdbId) => {
    if (!plugin || !pdbId) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Clear existing structures
      plugin.clear();

      // Load PDB structure from RCSB using the correct API
      const url = `https://files.rcsb.org/download/${pdbId.toUpperCase()}.pdb`;
      
      // Use the plugin's loadStructureFromUrl method if available
      const data = await plugin.builders.data.download({ 
        url: url,
        isBinary: false 
      });

      const trajectory = await plugin.builders.structure.parseTrajectory(data, 'pdb');
      const model = await plugin.builders.structure.createModel(trajectory);
      const structure = await plugin.builders.structure.createStructure(model);

      // Create structure component
      const component = await plugin.builders.structure.tryCreateComponentStatic(structure, 'all');
      
      if (component) {
        // Add cartoon representation
        await plugin.builders.structure.representation.addRepresentation(component, { 
          type: 'cartoon'
        });
      }

      setSuccess(`Successfully loaded PDB structure: ${pdbId.toUpperCase()}`);
    } catch (err) {
      console.error('Failed to load PDB structure:', err);
      setError(`Failed to load PDB structure ${pdbId}. Please check if the PDB ID is valid.`);
    } finally {
      setLoading(false);
    }
  };

  const loadFromFile = async (content, format) => {
    if (!plugin || !content) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Clear existing structures
      plugin.clear();

      // Create data from string
      const data = await plugin.builders.data.rawData({
        data: content,
        label: `User uploaded ${format.toUpperCase()}`
      });

      const trajectory = await plugin.builders.structure.parseTrajectory(data, format);
      const model = await plugin.builders.structure.createModel(trajectory);
      const structure = await plugin.builders.structure.createStructure(model);

      // Create structure component
      const component = await plugin.builders.structure.tryCreateComponentStatic(structure, 'all');
      
      if (component) {
        // Add cartoon representation
        await plugin.builders.structure.representation.addRepresentation(component, {
          type: 'cartoon'
        });
      }

      setSuccess(`Successfully loaded ${format.toUpperCase()} structure from file`);
    } catch (err) {
      console.error('Failed to load structure from file:', err);
      setError(`Failed to load structure from file. Please check the file format and content.`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const takeScreenshot = async () => {
    if (!plugin) return;

    try {
      const canvas = plugin.canvas3d?.webgl?.gl?.canvas;
      if (canvas) {
        const link = document.createElement('a');
        link.download = 'molstar-screenshot.png';
        link.href = canvas.toDataURL();
        link.click();
        setSuccess('Screenshot saved successfully!');
      }
    } catch (err) {
      console.error('Failed to take screenshot:', err);
      setError('Failed to take screenshot.');
    }
  };

  const resetView = async () => {
    if (!plugin) return;

    try {
      await plugin.builders.camera.reset();
      setSuccess('View reset successfully!');
    } catch (err) {
      console.error('Failed to reset view:', err);
      setError('Failed to reset view.');
    }
  };

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <CubeTransparentIcon className="w-10 h-10 text-white" />
          </CardHeader>
          <CardBody className="px-6 text-center">
            <Typography variant="h5" className="mb-2" color="blue-gray">
              3D Molecular Visualization
            </Typography>
            <Typography className="font-normal text-blue-gray-600">
              Advanced 3D visualization powered by Molstar for exploring molecular structures
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            variant="gradient"
            color="green"
            className="mb-4 grid h-28 place-items-center"
          >
            <DocumentArrowUpIcon className="w-10 h-10 text-white" />
          </CardHeader>
          <CardBody className="px-6 text-center">
            <Typography variant="h5" className="mb-2" color="blue-gray">
              Multiple Formats
            </Typography>
            <Typography className="font-normal text-blue-gray-600">
              Support for PDB, mmCIF, and other molecular structure formats
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            variant="gradient"
            color="orange"
            className="mb-4 grid h-28 place-items-center"
          >
            <MagnifyingGlassIcon className="w-10 h-10 text-white" />
          </CardHeader>
          <CardBody className="px-6 text-center">
            <Typography variant="h5" className="mb-2" color="blue-gray">
              Interactive Analysis
            </Typography>
            <Typography className="font-normal text-blue-gray-600">
              Rotate, zoom, and analyze molecular structures in real-time
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* Alert Messages */}
      {error && (
        <Alert color="red" className="mb-4">
          {error}
        </Alert>
      )}
      {success && (
        <Alert color="green" className="mb-4">
          {success}
        </Alert>
      )}

      <div className="mb-6 grid gap-y-6 gap-x-6 md:grid-cols-2">
        {/* Load from PDB */}
        <Card>
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-12 place-items-center"
          >
            <Typography variant="h6" color="white">
              Load from PDB Database
            </Typography>
          </CardHeader>
          <CardBody>
            <div className="mb-4">
              <Input
                size="lg"
                label="PDB ID (e.g., 1mbo)"
                value={pdbId}
                onChange={(e) => setPdbId(e.target.value)}
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
            <Button
              size="sm"
              color="blue"
              onClick={() => loadPDBStructure(pdbId)}
              disabled={loading || !pdbId}
              className="mb-4 w-full"
            >
              {loading ? <Spinner className="h-4 w-4" /> : 'Load Structure'}
            </Button>
            
            <Typography variant="small" color="blue-gray" className="mb-2">
              Quick Examples:
            </Typography>
            <div className="flex flex-wrap gap-2">
              {samplePDBs.map((sample) => (
                <Button
                  key={sample.id}
                  size="sm"
                  variant="outlined"
                  color="blue"
                  onClick={() => {
                    setPdbId(sample.id);
                    loadPDBStructure(sample.id);
                  }}
                  disabled={loading}
                  className="text-xs"
                >
                  {sample.id}
                </Button>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Load from File */}
        <Card>
          <CardHeader
            variant="gradient"
            color="green"
            className="mb-4 grid h-12 place-items-center"
          >
            <Typography variant="h6" color="white">
              Load from File
            </Typography>
          </CardHeader>
          <CardBody>
            <div className="mb-4">
              <Select
                size="lg"
                label="File Format"
                value={loadType}
                onChange={(val) => setLoadType(val)}
              >
                <Option value="pdb">PDB</Option>
                <Option value="mmcif">mmCIF</Option>
                <Option value="sdf">SDF</Option>
              </Select>
            </div>
            <div className="mb-4">
              <input
                type="file"
                accept=".pdb,.cif,.sdf,.mol"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <Button
              size="sm"
              color="green"
              onClick={() => loadFromFile(fileContent, loadType)}
              disabled={loading || !fileContent}
              className="w-full"
            >
              {loading ? <Spinner className="h-4 w-4" /> : 'Load from File'}
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Controls */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-wrap gap-4">
            <Button
              size="sm"
              color="blue"
              variant="outlined"
              onClick={resetView}
              disabled={loading || !plugin}
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Reset View
            </Button>
            <Button
              size="sm"
              color="green"
              variant="outlined"
              onClick={takeScreenshot}
              disabled={loading || !plugin}
            >
              <PhotoIcon className="h-4 w-4 mr-2" />
              Screenshot
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Molstar Viewer */}
      <Card>
        <CardHeader
          variant="gradient"
          color="blue-gray"
          className="mb-4 grid h-12 place-items-center"
        >
          <Typography variant="h6" color="white">
            Molstar 3D Viewer
          </Typography>
        </CardHeader>
        <CardBody>
          <div 
            ref={molstarRef} 
            className="w-full h-96 border border-gray-200 rounded-lg"
            style={{ minHeight: '600px' }}
          />
          {loading && (
            <div className="flex justify-center items-center mt-4">
              <Spinner className="h-8 w-8" />
              <Typography className="ml-2">Loading molecular structure...</Typography>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default Molstar3D;
