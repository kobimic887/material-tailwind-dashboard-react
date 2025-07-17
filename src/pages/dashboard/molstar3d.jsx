import React, { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardBody, Typography, Button, Chip } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export function Molstar3D() {
  const molstarRef = useRef(null);
  const navigate = useNavigate();
  const [sdfData, setSdfData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', or ''

  // Function to parse SDF data
  const parseSdfData = (sdfText) => {
    const molecules = sdfText.split('$$$$').filter(entry => entry.trim());
    
    return molecules.map((molecule, index) => {
      const lines = molecule.split('\n');
      const properties = {};
      
      // Extract properties from SDF format
      let currentProperty = null;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Look for property headers like >  <PROPERTY_NAME>
        if (line.startsWith('>') && line.includes('<') && line.includes('>')) {
          const match = line.match(/<([^>]+)>/);
          if (match) {
            currentProperty = match[1];
          }
        } else if (currentProperty && line && !line.startsWith('>')) {
          // This is the value for the current property
          properties[currentProperty] = line;
          currentProperty = null;
        }
      }
      
      // Extract the molecule name/ID from the first line
      const moleculeName = lines[0]?.trim() || `Molecule ${index + 1}`;
      
      return {
        id: index + 1,
        name: moleculeName,
        model: properties.MODEL || 'N/A',
        torsdo: properties.TORSDO || 'N/A',
        score: properties.SCORE || 'N/A',
        ligand_id: properties.ligand_id || 'N/A',
        original_smiles: properties.original_smiles || 'N/A',
        smiles: properties.smiles || 'N/A'
      };
    });
  };

  // Function to load SDF data from URL
  const loadSdfData = async (url) => {
    try {
      setIsLoading(true);
      const response = await fetch(url);
      if (response.ok) {
        const sdfText = await response.text();
        const parsedData = parseSdfData(sdfText);
        setSdfData(parsedData);
        console.log('SDF data loaded:', parsedData.length, 'molecules');
      } else {
        console.error('Failed to load SDF data:', response.status);
      }
    } catch (error) {
      console.error('Error loading SDF data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const pdbUrl = localStorage.getItem('molstar_pdb_url');
    const sdfUrl = localStorage.getItem('molstar_sdf_url');
    const simulationKey = localStorage.getItem('molstar_simulation_key');

    // Load SDF data if URL is available
    if (sdfUrl) {
      loadSdfData(sdfUrl);
    }

    // Listen for messages from Molstar iframe
    const handleMessage = (event) => {
      if (event.data.type === 'smilesLoaded') {
        setMessage(`Successfully loaded ${event.data.name || 'molecule'} into Molstar viewer`);
        setMessageType('success');
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 3000);
      } else if (event.data.type === 'smilesLoadError') {
        setMessage(`Failed to load molecule: ${event.data.error}`);
        setMessageType('error');
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 5000);
      }
    };

    window.addEventListener('message', handleMessage);

    if (pdbUrl && sdfUrl && simulationKey) {
      const handleIframeLoad = () => {
        // Wait a bit more for Molstar to fully initialize
        setTimeout(() => {
          if (molstarRef.current) {
            console.log('Loading PDB structure:', pdbUrl);
            // Load PDB structure first
            molstarRef.current.contentWindow.postMessage({
              type: 'loadStructureFromUrl',
              url: pdbUrl,
              format: 'pdb'
            }, '*');
            
            // Load SDF structure after a delay
            setTimeout(() => {
              if (molstarRef.current) {
                console.log('Loading SDF structure:', sdfUrl);
                molstarRef.current.contentWindow.postMessage({
                  type: 'loadStructureFromUrl',
                  url: sdfUrl,
                  format: 'sdf'
                }, '*');
              }
            }, 2000);
          }
        }, 2000);
      };

      // Add load event listener to iframe
      if (molstarRef.current) {
        molstarRef.current.addEventListener('load', handleIframeLoad);
      }

      return () => {
        if (molstarRef.current) {
          molstarRef.current.removeEventListener('load', handleIframeLoad);
        }
        window.removeEventListener('message', handleMessage);
      };
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleBackToSimulation = () => {
    navigate('/dashboard/simulation');
  };

  const loadPDBStructure = () => {
    const pdbUrl = localStorage.getItem('molstar_pdb_url');
    if (pdbUrl && molstarRef.current) {
      console.log('Manually loading PDB:', pdbUrl);
      molstarRef.current.contentWindow.postMessage({
        type: 'loadStructureFromUrl',
        url: pdbUrl,
        format: 'pdb'
      }, '*');
    }
  };

  const loadSDFStructure = () => {
    const sdfUrl = localStorage.getItem('molstar_sdf_url');
    if (sdfUrl && molstarRef.current) {
      console.log('Manually loading SDF:', sdfUrl);
      molstarRef.current.contentWindow.postMessage({
        type: 'loadStructureFromUrl',
        url: sdfUrl,
        format: 'sdf'
      }, '*');
      
      // Also reload the SDF data for the table
      loadSdfData(sdfUrl);
    }
  };

  // Function to load SMILES structure into Molstar
  const loadSmilesIntoMolstar = (smiles, moleculeName) => {
    if (molstarRef.current && smiles && smiles !== 'N/A') {
      console.log('Loading SMILES into Molstar:', smiles, 'for molecule:', moleculeName);
      
      // Show loading feedback
      setMessage(`Loading ${moleculeName} into Molstar viewer...`);
      setMessageType('info');
      
      // Send SMILES data to Molstar iframe
      molstarRef.current.contentWindow.postMessage({
        type: 'loadSmilesStructure',
        smiles: smiles,
        name: moleculeName
      }, '*');
      
      // Clear message after a delay
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    }
  };

  const loadTestSDF = () => {
    // For testing, we'll load a sample SDF file
    const testSdfUrl = '/pdbs/sample-docking-results.sdf';
    loadSdfData(testSdfUrl);
  };

  // Function to send SMILES to Molstar for visualization
  const sendSmilesToMolstar = (smiles) => {
    if (molstarRef.current && smiles && smiles !== 'N/A') {
      console.log('Sending SMILES to Molstar:', smiles);
      molstarRef.current.contentWindow.postMessage({
        type: 'loadSmilesStructure',
        smiles: smiles
      }, '*');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Card className="relative bg-clip-border rounded-xl bg-white text-gray-700 shadow-md m-4 flex-1 flex flex-col" style={{ minHeight: '85vh' }}>
        <CardHeader
          variant="gradient"
          color="blue"
          className="mb-4 grid h-16 place-items-center flex-shrink-0"
        >
          <div className="flex items-center justify-between w-full px-4">
            <Typography variant="h5" color="white">
              Molstar 3D Structure Viewer
            </Typography>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outlined"
                color="white"
                onClick={loadPDBStructure}
                className="border-white text-white hover:bg-white hover:text-blue-500"
              >
                Load PDB
              </Button>
              <Button
                size="sm"
                variant="outlined"
                color="white"
                onClick={loadSDFStructure}
                className="border-white text-white hover:bg-white hover:text-blue-500"
              >
                Load SDF
              </Button>
              <Button
                size="sm"
                variant="outlined"
                color="white"
                onClick={loadTestSDF}
                className="border-white text-white hover:bg-white hover:text-blue-500"
              >
                Test SDF
              </Button>
              <Button
                size="sm"
                variant="outlined"
                color="white"
                onClick={handleBackToSimulation}
                className="border-white text-white hover:bg-white hover:text-blue-500"
              >
                Back to Simulation
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {/* Message Display for SMILES Loading */}
        {message && (
          <div className="px-4 pb-2">
            <div className={`p-3 rounded-lg flex items-center gap-2 ${
              messageType === 'info' ? 'bg-blue-50 border border-blue-200' : 
              messageType === 'success' ? 'bg-green-50 border border-green-200' : 
              messageType === 'error' ? 'bg-red-50 border border-red-200' : 
              'bg-gray-50 border border-gray-200'
            }`}>
              {messageType === 'info' && (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              )}
              <Typography variant="small" className={
                messageType === 'info' ? 'text-blue-700' : 
                messageType === 'success' ? 'text-green-700' : 
                messageType === 'error' ? 'text-red-700' : 
                'text-gray-700'
              }>
                {message}
              </Typography>
            </div>
          </div>
        )}

        {/* Molstar Iframe - Double Height */}
        <CardBody className="p-0 flex-1" style={{ minHeight: '800px' }}>
          <iframe
            ref={molstarRef}
            src="/molstar/index.html"
            className="w-full h-full border-0"
            title="Molstar 3D Viewer"
            style={{ minHeight: '800px' }}
          />
        </CardBody>
      </Card>
      
      {/* SDF Results Table - Below the iframe */}
      {sdfData.length > 0 && (
        <Card className="mx-4 mb-4 flex-shrink-0">
          <div className="p-4 bg-white max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Typography variant="h6" color="blue-gray">
                  SDF Docking Results
                </Typography>
                <Typography variant="small" color="gray" className="mt-1">
                  Click on any row to load the molecule into the 3D viewer
                </Typography>
              </div>
              {isLoading && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <Typography variant="small" color="gray">
                    Loading...
                  </Typography>
                </div>
              )}
              <Chip
                value={`Top 2 of ${sdfData.length} molecules`}
                variant="gradient"
                color="blue"
                size="sm"
              />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-3">
                      <Typography variant="small" color="blue-gray" className="font-bold leading-none">
                        ID
                      </Typography>
                    </th>           
                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-3">
                      <Typography variant="small" color="blue-gray" className="font-bold leading-none">
                        Score
                      </Typography>
                    </th>    
           
                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-3">
                      <Typography variant="small" color="blue-gray" className="font-bold leading-none">
                        SMILES
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sdfData
                    .filter((molecule, index, self) => {
                      // Filter for unique molecules based on SMILES
                      return index === self.findIndex(m => m.smiles === molecule.smiles && m.smiles !== 'N/A');
                    })
                    .sort((a, b) => parseFloat(a.score) - parseFloat(b.score)) // Sort by score (most negative first)
                    .slice(0, 2) // Take only top 2 unique molecules
                    .map((molecule, index) => {
                    const isLast = index === 1; // Only 2 items, so last is index 1
                    const classes = isLast ? "p-3" : "p-3 border-b border-blue-gray-50";
                    const scoreValue = parseFloat(molecule.score);
                    const scoreColor = scoreValue < -7 ? "green" : scoreValue < -5 ? "amber" : "red";
                    
                    return (
                      <tr 
                        key={molecule.id} 
                        className="hover:bg-blue-gray-50 transition-colors cursor-pointer"
                        onClick={() => loadSmilesIntoMolstar(molecule.smiles, molecule.name)}
                        title={`Click to load ${molecule.name} into Molstar viewer`}
                      >
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            {molecule.id}
                          </Typography>
                        </td>
                       
                       
                        <td className={classes}>
                          <Chip
                            value={molecule.score}
                            variant="ghost"
                            color={scoreColor}
                            size="sm"
                            className="font-mono"
                          />
                        </td>
                
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-mono text-xs max-w-xs truncate" title={molecule.smiles}>
                            {molecule.smiles}
                          </Typography>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
      
      {/* Loading/Empty State for SDF Data */}
      {!sdfData.length && !isLoading && (
        <Card className="mx-4 mb-4 flex-shrink-0">
          <div className="p-4 bg-white">
            <div className="text-center py-8">
              <Typography variant="small" color="gray">
                No SDF data available. Click "Test SDF" or load an SDF file to see docking results.
              </Typography>
            </div>
          </div>
        </Card>
      )}
      
      {/* Loading State */}
      {isLoading && (
        <Card className="mx-4 mb-4 flex-shrink-0">
          <div className="p-4 bg-white">
            <div className="flex items-center justify-center gap-2 py-8">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <Typography variant="small" color="gray">
                Loading SDF data...
              </Typography>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default Molstar3D;
