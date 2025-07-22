import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { ShoppingCartIcon } from '@heroicons/react/24/solid';

export function Simulation() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [apiUrl, setApiUrl] = useState('/api/hello');
  const [useHttpbin, setUseHttpbin] = useState(true);
  const [searchCode, setSearchCode] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [simPdbId, setSimPdbId] = useState("");
  const [simSmiles, setSimSmiles] = useState("");
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);
  const [simError, setSimError] = useState("");
  
  const [topMolecules, setTopMolecules] = useState([]);
  const [topLoading, setTopLoading] = useState(false);
  const [topError, setTopError] = useState("");

  const [searchType, setSearchType] = useState("similarity"); // Add searchType state
  const [topLimit, setTopLimit] = useState(8); // Add topLimit state

  const [mculeSmiles, setMculeSmiles] = useState(""); // For drawing in mcule component

  const [cart, setCart] = useState([]);

  const navigate = useNavigate();
  
  const fetchApiData = async () => {
    setLoading(true);
    setError('');
    try {
      let fetchUrl = apiUrl;
      if (useHttpbin) {
        fetchUrl = '/api/hello';
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

  const handleSearch = async () => {
    setSearchLoading(true);
    setSearchError("");
    setSearchResult(null);
    try {
      let searchMode = 3;
      if (searchType === "similarity") searchMode = 3;
      else if (searchType === "substructure") searchMode = 2;
      else if (searchType === "exact") searchMode = 1;
      const body = {
        searchMode,
        smiles: "",
        codes: [searchCode],
        requestid:  "7b09275b-da07-491f-93d2-784f0a868528",
        orderBy: 1,
        page: 0,
        order: "desc",
        perPage: 25,
        minMW: 0,
        maxMW: 500,
        minHAC: 0,
        maxHAC: 5,
        minCLP: -10,
        maxCLP: 10,
        subset: 0,
        headers: {}
      };
      const token = localStorage.getItem('auth_token');
      const query = encodeURIComponent(searchCode);
      const res = await fetch(`https://${window.location.hostname}:3000/api/mol-price/search?query=${query}&limit=10&skip=0`, {
        method: "GET",
        headers: { 'accept': 'application/json' },
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${res.statusText} - ${errorText}`);
      }
      const result = await res.json();
      //setSearchResult(result);
      setTopMolecules(Array.isArray(result.molecules) ? result.molecules : []); // Render results in topMolecules
    } catch (err) {
      setSearchError(`Failed to search: ${err.message}`);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSimulation = async () => {
    setSimLoading(true);
    setSimError("");
    setSimResult(null);
    try {
      const params = new URLSearchParams({ pdbid: simPdbId, smiles: simSmiles });
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`https://${window.location.hostname}:3000/api/simulation?${params.toString()}`, {
        method: "GET",
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const result = await res.json();
      setSimResult(result);
    } catch (err) {
      setSimError(`Failed to simulate: ${err.message}`);
    } finally {
      setSimLoading(false);
    }
  };

  // Redirect to Molstar3D when simulation results are available
  useEffect(() => {
    if (simResult && simResult.simulationKey) {
      const pdbUrl = `https://${window.location.hostname}:3000/api/sanitizedpdb/${simResult.simulationKey}`;      
      const sdfUrl = `https://${window.location.hostname}:3000/api/sanitizedminimalsdf/${simResult.simulationKey}`;
      
      // Store URLs in localStorage and navigate to Molstar3D
      localStorage.setItem('molstar_pdb_url', pdbUrl);
      localStorage.setItem('molstar_sdf_url', sdfUrl);
      localStorage.setItem('molstar_simulation_key', simResult.simulationKey);
      
      navigate('/dashboard/molstar3d');
    }
  }, [simResult, navigate]);

  // Auto-fetch on component mount
  useEffect(() => {
    //fetchApiData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchTopMolecules = async () => {
      setTopLoading(true);
      setTopError("");
      try {
        const res = await fetch(`https://${window.location.hostname}:3000/api/mol-price?limit=${topLimit}&skip=0`);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        const result = await res.json();
        console.log('API /api/mol-price result:', result); // Debug log
        setTopMolecules(Array.isArray(result.molecules) ? result.molecules.slice(0, topLimit) : []);
      } catch (err) {
        setTopError(`Failed to fetch top molecules: ${err.message}`);
      } finally {
        setTopLoading(false);
      }
    };
    fetchTopMolecules();
  }, [topLimit]); // Depend on topLimit

  const handleCellClick = value => {
    setSearchCode(value);
  };

  const addToCart = (molecule, amount, price) => {
    if (!molecule || !price) return;
    setCart(prev => [
      ...prev,
      {
        name: molecule.BRUTTO_FORMULA || molecule.formula || molecule.SMILES_STRING || molecule.smiles || molecule.ASINEX_ID || 'Molecule',
        amount,
        price,
        id: molecule.ASINEX_ID || molecule.id || Math.random().toString(36).slice(2),
        smiles: molecule.SMILES_STRING || molecule.smiles || '',
        formula: molecule.BRUTTO_FORMULA || molecule.formula || '',
      }
    ]);
  };

  return (
    <div className="h-[80vh] flex flex-col pt-8 pb-8 bg-gray-50">
      <div className="mb-6 flex flex-col gap-2">        
        <div className="flex items-center gap-0"> {/* gap-0 removes space between input and button */}
          <Input
            label="Add molecule ID, SMILES, CAS Number, IUPAC name, InChI or InChIKey here"
            value={searchCode}
            onChange={e => setSearchCode(e.target.value)}
            className="flex-1 min-w-0" // changed to flex-1 min-w-0 for full width till button
          />
          <Button
            size="md"
            color="green"
            onClick={handleSearch}
            disabled={searchLoading || !searchCode}
            className="flex items-center gap-2"
          >
            {searchLoading ? <Spinner className="h-4 w-4" /> : <CloudIcon className="h-4 w-4" />}
            {searchLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <Typography variant="small" color="blue-gray" className="mr-2">Search type:</Typography>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="searchType"
              value="similarity"
              checked={searchType === "similarity"}
              onChange={() => setSearchType("similarity")}
            />
            <span>Similarity</span>
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="searchType"
              value="substructure"
              checked={searchType === "substructure"}
              onChange={() => setSearchType("substructure")}
            />
            <span>Substructure</span>
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="searchType"
              value="exact"
              checked={searchType === "exact"}
              onChange={() => setSearchType("exact")}
            />
            <span>Exact</span>
          </label>
        </div>
      </div>
      {searchError && (
        <Alert color="red" className="mb-6">
          <div className="flex items-center gap-2">
            <Typography variant="h6">Search Error:</Typography>
            <Typography>{searchError}</Typography>
          </div>
        </Alert>
      )}
      {searchResult && (
        <Card className="mb-6">
          <CardHeader
            variant="gradient"
            color="green"
            className="mb-4 grid h-12 place-items-center"
          >
            <Typography variant="h6" color="white">
              Search Result
            </Typography>
          </CardHeader>
          <CardBody>
            <pre className="whitespace-pre-wrap text-sm font-mono bg-white p-4 rounded border overflow-auto max-h-96">
              {JSON.stringify(searchResult, null, 2)}
            </pre>
          </CardBody>
        </Card>
      )}

      <div style={{ display: "flex", width: "100%", height: "70vh" }}>
        <div style={{ width: "40%", height: "70vh", background: "#f5f5f5" }}>
          <iframe
            src="/ketcher/index.html"
            title="Ketcher 2D Chemical Editor"
            style={{ width: "100%", height: "70vh", border: "2px solid #ccc", borderRadius: 8, background: "white" }}
            allowFullScreen
          />
        </div>
        <div style={{ width: "60%", height: "70vh", background: "#e3e8ef", overflowY: "auto", padding: 32 }}>
          {/* Header as a block element, not wrapping Card or div */}
          <div className="mb-4">
            <Typography as="h5" variant="h5" color="blue-gray">Top {topMolecules.length} Molecules</Typography>
          </div>
          {topLoading && (
            <div className="flex items-center gap-2 mb-4">
              <Spinner className="h-5 w-5 text-blue-500" />
              <Typography>Loading...</Typography>
            </div>
          )}
          {topError && (
            <Alert color="red" className="mb-4">{topError}</Alert>
          )}
          {!topLoading && !topError && topMolecules.length > 0 && (
            <Card className="mb-4">
              <CardBody>
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="p-2 font-bold">#</th>
                      <th className="p-2 font-bold">ASINEX_ID</th>
                      <th className="p-2 font-bold">IUPAC Name</th>
                      <th className="p-2 font-bold">SMILES</th>
                      <th className="p-2 font-bold">InChI</th>
                      <th className="p-2 font-bold">InChIKey</th>
                      <th className="p-2 font-bold">Formula</th>
                      <th className="p-2 font-bold">MW</th>
                      <th className="p-2 font-bold">Available (mg)</th>
                      <th className="p-2 font-bold">Price 1mg</th>
                      <th className="p-2 font-bold">Price 2mg</th>
                      <th className="p-2 font-bold">Price 5mg</th>
                      <th className="p-2 font-bold">Price 10mg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topMolecules.map((mol, idx) => (
                      <tr key={mol.ASINEX_ID || mol.id || idx} className="border-b">
                        <td className="p-2">{idx + 1}</td>
                        <td
                          className="p-2 cursor-pointer hover:bg-blue-100"
                          title={mol.ASINEX_ID ? mol.ASINEX_ID.replace(/^ASN/i, "") : "N/A"}
                          onClick={() => setSearchCode(mol.ASINEX_ID ? mol.ASINEX_ID.replace(/^ASN/i, "") : "")}
                        >
                          {(mol.ASINEX_ID ? mol.ASINEX_ID.replace(/^ASN/i, "") : "N/A").toString().slice(0,10)}{(mol.ASINEX_ID ? mol.ASINEX_ID.replace(/^ASN/i, "") : "N/A").toString().length > 10 ? '...' : ''}
                        </td>
                        <td
                          className="p-2 cursor-pointer hover:bg-blue-100"
                          title={mol.IUPAC_NAME || "N/A"}
                          onClick={() => setSearchCode(mol.IUPAC_NAME || "")}
                        >
                          {(mol.IUPAC_NAME || "N/A").toString().slice(0,10)}{(mol.IUPAC_NAME || "N/A").toString().length > 10 ? '...' : ''}
                        </td>
                        <td
                          className="p-2 font-mono text-xs cursor-pointer hover:bg-blue-100"
                          title={mol.SMILES_STRING || mol.SMILES || mol.smiles || "N/A"}
                          onClick={async () => {
                            const smiles = mol.SMILES_STRING || mol.SMILES || mol.smiles || "";
                            setSearchCode(smiles);
                            try {
                              await navigator.clipboard.writeText(smiles);
                            } catch (err) {
                              alert("Failed to copy SMILES to clipboard: " + err);
                            }
                          }}
                        >
                          {(mol.SMILES_STRING || mol.SMILES || mol.smiles || "N/A").toString().slice(0,10)}{(mol.SMILES_STRING || mol.SMILES || mol.smiles || "N/A").toString().length > 10 ? '...' : ''}
                        </td>
                        <td
                          className="p-2 font-mono text-xs cursor-pointer hover:bg-blue-100"
                          title={mol.INCHI || "N/A"}
                          onClick={async () => {
                            const inchi = mol.INCHI || "";
                            setSearchCode(inchi);
                            try {
                              await navigator.clipboard.writeText(inchi);
                            } catch (err) {
                              alert("Failed to copy InChI to clipboard: " + err);
                            }
                          }}
                        >
                          {(mol.INCHI || "N/A").toString().slice(0,10)}{(mol.INCHI || "N/A").toString().length > 10 ? '...' : ''}
                        </td>
                        <td
                          className="p-2 font-mono text-xs cursor-pointer hover:bg-blue-100"
                          title={mol.INCHIKEY || "N/A"}
                          onClick={() => setSearchCode(mol.INCHIKEY || "")}
                        >
                          {(mol.INCHIKEY || "N/A").toString().slice(0,10)}{(mol.INCHIKEY || "N/A").toString().length > 10 ? '...' : ''}
                        </td>
                        <td className="p-2" title={mol.BRUTTO_FORMULA || "N/A"}>{(mol.BRUTTO_FORMULA || "N/A").toString().slice(0,10)}{(mol.BRUTTO_FORMULA || "N/A").toString().length > 10 ? '...' : ''}</td>
                        <td className="p-2" title={mol.MW_STRUCTURE || "N/A"}>{(mol.MW_STRUCTURE || "N/A").toString().slice(0,10)}{(mol.MW_STRUCTURE || "N/A").toString().length > 10 ? '...' : ''}</td>
                        <td className="p-2" title={mol.AVAILABLE_MG || "N/A"}>{(mol.AVAILABLE_MG || "N/A").toString().slice(0,10)}{(mol.AVAILABLE_MG || "N/A").toString().length > 10 ? '...' : ''}</td>
                        <td className="p-2 cursor-pointer group" title={mol.PRICE_1MG ? `$${mol.PRICE_1MG}` : "-"}
                          onClick={() => addToCart(mol, 1, mol.PRICE_1MG)}
                        >
                          <span>{(mol.PRICE_1MG ? `$${mol.PRICE_1MG}` : "-").toString().slice(0,10)}{(mol.PRICE_1MG ? `$${mol.PRICE_1MG}` : "-").toString().length > 10 ? '...' : ''}</span>
                          {mol.PRICE_1MG && (
                            <ShoppingCartIcon
                              className="inline-block h-5 w-5 text-green-600 ml-2 cursor-pointer opacity-70 group-hover:opacity-100"
                              title="Add 1mg to cart"
                            />
                          )}
                        </td>
                        <td className="p-2 cursor-pointer group" title={mol.PRICE_2MG ? `$${mol.PRICE_2MG}` : "-"}
                          onClick={() => addToCart(mol, 2, mol.PRICE_2MG)}
                        >
                          <span>{(mol.PRICE_2MG ? `$${mol.PRICE_2MG}` : "-").toString().slice(0,10)}{(mol.PRICE_2MG ? `$${mol.PRICE_2MG}` : "-").toString().length > 10 ? '...' : ''}</span>
                          {mol.PRICE_2MG && (
                            <ShoppingCartIcon
                              className="inline-block h-5 w-5 text-green-600 ml-2 cursor-pointer opacity-70 group-hover:opacity-100"
                              title="Add 2mg to cart"
                            />
                          )}
                        </td>
                        <td className="p-2 cursor-pointer group" title={mol.PRICE_5MG ? `$${mol.PRICE_5MG}` : "-"}
                          onClick={() => addToCart(mol, 5, mol.PRICE_5MG)}
                        >
                          <span>{(mol.PRICE_5MG ? `$${mol.PRICE_5MG}` : "-").toString().slice(0,10)}{(mol.PRICE_5MG ? `$${mol.PRICE_5MG}` : "-").toString().length > 10 ? '...' : ''}</span>
                          {mol.PRICE_5MG && (
                            <ShoppingCartIcon
                              className="inline-block h-5 w-5 text-green-600 ml-2 cursor-pointer opacity-70 group-hover:opacity-100"
                              title="Add 5mg to cart"
                            />
                          )}
                        </td>
                        <td className="p-2 cursor-pointer group" title={mol.PRICE_10MG ? `$${mol.PRICE_10MG}` : "-"}
                          onClick={() => addToCart(mol, 10, mol.PRICE_10MG)}
                        >
                          <span>{(mol.PRICE_10MG ? `$${mol.PRICE_10MG}` : "-").toString().slice(0,10)}{(mol.PRICE_10MG ? `$${mol.PRICE_10MG}` : "-").toString().length > 10 ? '...' : ''}</span>
                          {mol.PRICE_10MG && (
                            <ShoppingCartIcon
                              className="inline-block h-5 w-5 text-green-600 ml-2 cursor-pointer opacity-70 group-hover:opacity-100"
                              title="Add 10mg to cart"
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          )}
          {!topLoading && !topError && topMolecules.length === 0 && (
            <Typography>No records found.</Typography>
          )}
        </div>
      </div>
      <div className="mb-6 flex flex-col gap-4 w-full p-6 pb-[10%] rounded-lg shadow-lg bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 border border-blue-300" id="simulation-inputs">
        <Typography variant="h6" color="blue" className="mb-2">Run 1 Click Docking</Typography>
        <Input
          label="PDB ID"
          value={simPdbId}
          onChange={e => setSimPdbId(e.target.value)}
          className="w-full max-w-xs"
        />
        <div className="flex items-center gap-0">
          <Input
            label="SMILES"
            value={simSmiles}
            onChange={e => setSimSmiles(e.target.value)}
            className="flex-1 min-w-0"
          />
          <Button
            size="md"
            color="blue"
            onClick={handleSimulation}
            disabled={simLoading || !simPdbId || !simSmiles}
            className="items-center gap-2"
          >
            {simLoading ? 'Simulating...' : 'Simulate'}
          </Button>
        </div>
      </div>
      {simLoading && (
        <div className="flex justify-center items-center mb-6">
          <Spinner className="h-8 w-8 text-blue-500" />
          <Typography className="ml-2">Running simulation...</Typography>
        </div>
      )}
      {simError && (
        <Alert color="red" className="mb-6">
          <div className="flex items-center gap-2">
            <Typography variant="h6">Simulation Error:</Typography>
            <Typography>{simError}</Typography>
          </div>
        </Alert>
      )}
      {simResult && (
        <Card className="mb-6">
          <CardHeader
            variant="gradient"
            className="mb-4 grid h-12 place-items-center"
          >
            <Typography variant="h6" color="black">
              Simulation Result
            </Typography>
          </CardHeader>
          <CardBody>
            <pre className="whitespace-pre-wrap text-sm font-mono bg-white p-4 rounded border overflow-auto max-h-48">
              {JSON.stringify(simResult, null, 2)}
            </pre>
            {simResult.simulationKey && (
              <div className="mt-4 flex gap-2">
                <a download
                  className="inline-block px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition"
                  href={`https://${window.location.hostname}:3000/api/sanitizedpdb/${simResult.simulationKey}`}
                  target="_blank"
                >
                  View Sanitized PDB Result
                </a>
                <a download
                  className="inline-block px-4 py-2 border border-green-500 text-green-500 rounded hover:bg-green-50 transition"
                  href={`https://${window.location.hostname}:3000/api/sanitizedminimalsdf/${simResult.simulationKey}`}
                  target="_blank"
                >
                  View Sanitized SDF Result
                </a>
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export default Simulation;
