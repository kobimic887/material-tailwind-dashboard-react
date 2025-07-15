import React, { useEffect, useRef } from "react";
import { Card, CardHeader, CardBody, Typography, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export function Molstar3D() {
  const molstarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const pdbUrl = localStorage.getItem('molstar_pdb_url');
    const sdfUrl = localStorage.getItem('molstar_sdf_url');
    const simulationKey = localStorage.getItem('molstar_simulation_key');

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
    }
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
                onClick={handleBackToSimulation}
                className="border-white text-white hover:bg-white hover:text-blue-500"
              >
                Back to Simulation
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0 flex-1">
          <iframe
            ref={molstarRef}
            src="/molstar/index.html"
            className="w-full h-full border-0"
            title="Molstar 3D Viewer"
          />
        </CardBody>
      </Card>
    </div>
  );
}

export default Molstar3D;
