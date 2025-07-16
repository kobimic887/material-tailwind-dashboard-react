import React, { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardBody, Typography, Button, Chip } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export function Molstar3D() {
  const molstarRef = useRef(null);
  const navigate = useNavigate();
  const [sdfData, setSdfData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
      };
    }
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

  const loadTestSDF = () => {
    // For testing, we'll load a sample SDF file
    const testSdfUrl = '/pdbs/sample-docking-results.sdf';
    loadSdfData(testSdfUrl);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Card className="m-4 flex-1">
        <CardHeader
          variant="gradient"
          color="blue"
          className="mb-4 grid h-16 place-items-center"
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
        
        <div className="flex-1 flex flex-col">
          <CardBody className="p-0 flex-1">
            <iframe
              ref={molstarRef}
              src="/molstar/index.html"
              className="w-full h-full border-0"
              title="Molstar 3D Viewer"
            />
          </CardBody>
          
          {/* SDF Results Table */}
          <div className="p-4 border-t border-gray-200 bg-white max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" color="blue-gray">
                SDF Docking Results
              </Typography>
              {isLoading && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <Typography variant="small" color="gray">
                    Loading...
                  </Typography>
                </div>
              )}
              {sdfData.length > 0 && (
                <Chip
                  value={`${sdfData.length} molecules`}
                  variant="gradient"
                  color="blue"
                  size="sm"
                />
              )}
            </div>
            
            {sdfData.length > 0 ? (
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
                          Name
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-3">
                        <Typography variant="small" color="blue-gray" className="font-bold leading-none">
                          Model
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-3">
                        <Typography variant="small" color="blue-gray" className="font-bold leading-none">
                          Score
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-3">
                        <Typography variant="small" color="blue-gray" className="font-bold leading-none">
                          TORSDO
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-3">
                        <Typography variant="small" color="blue-gray" className="font-bold leading-none">
                          Ligand ID
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
                    {sdfData.map((molecule, index) => {
                      const isLast = index === sdfData.length - 1;
                      const classes = isLast ? "p-3" : "p-3 border-b border-blue-gray-50";
                      const scoreValue = parseFloat(molecule.score);
                      const scoreColor = scoreValue < -7 ? "green" : scoreValue < -5 ? "amber" : "red";
                      
                      return (
                        <tr key={molecule.id} className="hover:bg-blue-gray-50 transition-colors">
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              {molecule.id}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {molecule.name}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {molecule.model}
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
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {molecule.torsdo}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {molecule.ligand_id}
                            </Typography>
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
            ) : (
              !isLoading && (
                <div className="text-center py-8">
                  <Typography variant="small" color="gray">
                    No SDF data available. Load an SDF file to see docking results.
                  </Typography>
                </div>
              )
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Molstar3D;
