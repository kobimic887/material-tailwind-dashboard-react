import React, { useState, useEffect, useRef } from 'react';
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
import ProfessionalMoleculeViewer from '../../components/ProfessionalMoleculeViewer';
import { API_CONFIG } from "@/utils/constants";

export function Simulation() {
  // Popup state for clipboard copy
  const [showClipboardPopup, setShowClipboardPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  // State for toggling simulation inputs
  const [showSimInputs, setShowSimInputs] = useState(false);
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
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);
  const [simError, setSimError] = useState("");
  const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success', 'error', or ''
  const [topMolecules, setTopMolecules] = useState([]);
  const [topLoading, setTopLoading] = useState(false);
  const [topError, setTopError] = useState("");

  const [searchType, setSearchType] = useState("similarity"); // Add searchType state
  const [queryType, setQueryType] = useState("draw"); // Default to Draw molecule
  const [topLimit, setTopLimit] = useState(8); // Add topLimit state
  const [moleculeLimit, setMoleculeLimit] = useState(30); // Add moleculeLimit state

  const [mculeSmiles, setMculeSmiles] = useState(""); // For drawing in mcule component

  const [cart, setCart] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [allMolecules, setAllMolecules] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Hover preview state
  const [hoveredPreview, setHoveredPreview] = useState(null);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  
  // Checkbox selection state
  const [selectedMolecules, setSelectedMolecules] = useState(new Set());

  // Refs to prevent infinite loops in scroll handler
  const hasMoreRef = useRef(true);
  const topLoadingRef = useRef(false);
  const currentPageRef = useRef(0);
  const initialLoadingRef = useRef(true);
  const isLoadingPageRef = useRef(false); // Prevent multiple simultaneous requests
  const ketcherIframeRef = useRef(null);

  const navigate = useNavigate();
  
  // Update refs when state changes
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    topLoadingRef.current = topLoading;
  }, [topLoading]);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    initialLoadingRef.current = initialLoading;
  }, [initialLoading]);

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

  // Function to fetch molecules from /asinex/all/x_10
  const fetchAllMolecules = async (page = 0, append = false) => {
    // Prevent multiple simultaneous requests
    if (isLoadingPageRef.current) {
      console.log('Already loading, skipping request');
      return;
    }
    
    isLoadingPageRef.current = true;
    
    try {
      if (!append) {
        setTopLoading(true);
        setTopError("");
      }
      
      console.log(`Fetching page ${page} from /asinex/all/${page}_10`);
      
      const token = localStorage.getItem('auth_token');
      const res = await fetch(API_CONFIG.buildApiUrl(`/asinex/all/${page}_10`), {
        method: "GET",
        headers: { 
          'accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const result = await res.json();
      console.log('Fetched molecules from /asinex/all:', result);
      
      let formattedMolecules = [];
      
      // Handle different response formats
      if (Array.isArray(result)) {
        formattedMolecules = result.map(molecule => ({
          ASINEX_ID: molecule.id_number || molecule.id,
          SMILES_STRING: molecule.smiles_string,
          BRUTTO_FORMULA: molecule.brutto_formula,
          MW_STRUCTURE: molecule.mol_weight,
          AVAILABLE_MG: molecule.available_mg,
          PRICE_1MG: molecule.price_1mg,
          PRICE_5MG: molecule.price_5mg,
          PRICE_10MG: molecule.price_10mg,
          IUPAC_NAME: molecule.iupac_name || "N/A",
          INCHI: molecule.inchi || "N/A", 
          INCHIKEY: molecule.inchikey || "N/A",
          PRICE_2MG: molecule.price_2mg || "N/A"
        }));
      } else if (result.data && Array.isArray(result.data)) {
        formattedMolecules = result.data.map(molecule => ({
          ASINEX_ID: molecule.id_number || molecule.id,
          SMILES_STRING: molecule.smiles_string,
          BRUTTO_FORMULA: molecule.brutto_formula,
          MW_STRUCTURE: molecule.mol_weight,
          AVAILABLE_MG: molecule.available_mg,
          PRICE_1MG: molecule.price_1mg,
          PRICE_5MG: molecule.price_5mg,
          PRICE_10MG: molecule.price_10mg,
          IUPAC_NAME: molecule.iupac_name || "N/A",
          INCHI: molecule.inchi || "N/A", 
          INCHIKEY: molecule.inchikey || "N/A",
          PRICE_2MG: molecule.price_2mg || "N/A"
        }));
      }
      
      if (append) {
        setAllMolecules(prev => [...prev, ...formattedMolecules]);
        setTopMolecules(prev => [...prev, ...formattedMolecules]);
      } else {
        setAllMolecules(formattedMolecules);
        setTopMolecules(formattedMolecules);
        // Clear selected molecules when loading new data (not appending)
        setSelectedMolecules(new Set());
      }
      
      // Check if we have more data (if we got less than 10, we're at the end)
      if (formattedMolecules.length < 10) {
        setHasMore(false);
        console.log('No more data available');
      } else {
        setHasMore(true);
      }
      
      setCurrentPage(page);
      
    } catch (err) {
      setTopError(`Failed to fetch molecules: ${err.message}`);
      console.error('Error fetching molecules:', err);
    } finally {
      setTopLoading(false);
      setInitialLoading(false);
      isLoadingPageRef.current = false; // Always reset the loading flag
    }
  };

  const handleSearch = async () => {
    setSearchLoading(true);
    setSearchError("");
    setSearchResult(null);
    
    // Reset pagination when searching
    setCurrentPage(0);
    setAllMolecules([]);
    setHasMore(true);
    
    // Clear selected molecules when doing a new search
    setSelectedMolecules(new Set());
    
    try {
      let searchMode = 3;
      if (searchType === "similarity") searchMode = 3;
      else if (searchType === "substructure") searchMode = 2;
      else if (searchType === "exact") searchMode = 1;
      
      const token = localStorage.getItem('auth_token');
      const query = encodeURIComponent(searchCode);
      
      let res;
      // Use different API endpoint for exact search
      if (searchType === "exact") {
        res = await fetch(API_CONFIG.buildApiUrl(`/asinex/exact/${query}`), {
          method: "GET",
          headers: { 
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
      } else if (searchType === "substructure" || searchType === "similarity") {
        res = await fetch(API_CONFIG.buildApiUrl(`/asinex/substructure/0_50/${query}`), {
          method: "GET",
          headers: { 
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
      } else {
        // Use regular search API for similarity
        res = await fetch(API_CONFIG.buildApiUrl(`/mol-price/search?query=${query}&limit=10&skip=0`), {
          method: "GET",
          headers: { 'accept': 'application/json' },
        });
      }
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${res.statusText} - ${errorText}`);
      }
      const result = await res.json();
      //setSearchResult(result);
      console.log('Search result data structure:', result); // Debug log
      
      // Handle the new response structure
      if (result.data) {
        // Single result with data object (old format)
        const molecule = result.data;
        // Convert to array format for consistency with existing table rendering
        const formattedMolecule = {
          ASINEX_ID: molecule.id_number || molecule.id,
          SMILES_STRING: molecule.smiles_string,
          BRUTTO_FORMULA: molecule.brutto_formula,
          MW_STRUCTURE: molecule.mol_weight,
          AVAILABLE_MG: molecule.available_mg,
          PRICE_1MG: molecule.price_1mg,
          PRICE_5MG: molecule.price_5mg,
          PRICE_10MG: molecule.price_10mg,
          // Add other fields that might be missing
          IUPAC_NAME: molecule.iupac_name || "N/A",
          INCHI: molecule.inchi || "N/A", 
          INCHIKEY: molecule.inchikey || "N/A",
          PRICE_2MG: molecule.price_2mg || "N/A"
        };
        setTopMolecules([formattedMolecule]);
        // Clear selected molecules when loading new search results
        setSelectedMolecules(new Set());
      } else if (Array.isArray(result)) {
        // Direct array format (new format)
        const formattedMolecules = result.map(molecule => ({
          ASINEX_ID: molecule.id_number || molecule.id,
          SMILES_STRING: molecule.smiles_string,
          BRUTTO_FORMULA: molecule.brutto_formula,
          MW_STRUCTURE: molecule.mol_weight,
          AVAILABLE_MG: molecule.available_mg,
          PRICE_1MG: molecule.price_1mg,
          PRICE_5MG: molecule.price_5mg,
          PRICE_10MG: molecule.price_10mg,
          // Add other fields that might be missing
          IUPAC_NAME: molecule.iupac_name || "N/A",
          INCHI: molecule.inchi || "N/A", 
          INCHIKEY: molecule.inchikey || "N/A",
          PRICE_2MG: molecule.price_2mg || "N/A"
        }));
        setTopMolecules(formattedMolecules);
        // Clear selected molecules when loading new search results
        setSelectedMolecules(new Set());
      } else if (result.id || result.id_number) {
        // Single object format (new format)
        const formattedMolecule = {
          ASINEX_ID: result.id_number || result.id,
          SMILES_STRING: result.smiles_string,
          BRUTTO_FORMULA: result.brutto_formula,
          MW_STRUCTURE: result.mol_weight,
          AVAILABLE_MG: result.available_mg,
          PRICE_1MG: result.price_1mg,
          PRICE_5MG: result.price_5mg,
          PRICE_10MG: result.price_10mg,
          // Add other fields that might be missing
          IUPAC_NAME: result.iupac_name || "N/A",
          INCHI: result.inchi || "N/A", 
          INCHIKEY: result.inchikey || "N/A",
          PRICE_2MG: result.price_2mg || "N/A"
        };
        setTopMolecules([formattedMolecule]);
        // Clear selected molecules when loading new search results  
        setSelectedMolecules(new Set());
      } else if (Array.isArray(result.molecules)) {
        // Array format with molecules property (old format)
        setTopMolecules(result.molecules);
        // Clear selected molecules when loading new search results
        setSelectedMolecules(new Set());
      } else {
        // Fallback for other formats
        setTopMolecules([]);
        // Clear selected molecules when loading new search results
        setSelectedMolecules(new Set());
      }
    } catch (err) {
      setSearchError("not found");
      setTimeout(() => {
        setSearchError("");
      }, 2000);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSimulation = async () => {
    // Check if we have a SMILES from the search
    if (!searchCode) {
      setSimError("Please search for a molecule first to get the SMILES code for docking");
      return;
    }

    setSimLoading(true);
    setSimError("");
    setSimResult(null);
    try {
      const params = new URLSearchParams({ pdbid: simPdbId, smiles: searchCode });
      const token = localStorage.getItem('auth_token');
      const res = await fetch(API_CONFIG.buildApiUrl(`/simulation?${params.toString()}`), {
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
      const pdbUrl = API_CONFIG.buildApiUrl(`/sanitizedpdb/${simResult.simulationKey}`);      
      const sdfUrl = API_CONFIG.buildApiUrl(`/sanitizedminimalsdf/${simResult.simulationKey}`);
      
      // Store URLs in localStorage and navigate to Molstar3D
      localStorage.setItem('molstar_pdb_url', pdbUrl);
      localStorage.setItem('molstar_sdf_url', sdfUrl);
      localStorage.setItem('molstar_simulation_key', simResult.simulationKey);
      
      navigate('/dashboard/molstar3d');
    }
  }, [simResult, navigate]);

  // Auto-fetch on component mount
  useEffect(() => {
    // Load initial molecules when component mounts
    fetchAllMolecules(0, false);
  }, []); // Only run once on mount

  // Separate useEffect for scroll handling
  useEffect(() => {
    let scrollTimeout;
    
    const handleScroll = () => {
      // Clear previous timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      // Debounce scroll events
      scrollTimeout = setTimeout(() => {
        if (
          window.innerHeight + document.documentElement.scrollTop
          >= document.documentElement.offsetHeight - 1000 && // Load when 1000px from bottom
          hasMoreRef.current &&
          !topLoadingRef.current &&
          !initialLoadingRef.current &&
          !isLoadingPageRef.current // Additional check
        ) {
          console.log('Scroll triggered - Loading next page:', currentPageRef.current + 1);
          fetchAllMolecules(currentPageRef.current + 1, true);
        }
      }, 250); // 250ms debounce
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, []); // Empty dependency array - only set up once


  const handleCellClick = value => {
    setSearchCode(value);
  };

  const saveCartToStorage = (cartData) => {
    try {
      localStorage.setItem('moleculeCart', JSON.stringify(cartData));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  };
  const addToCart = (molecule, amount, price) => {
    console.log(`Adding to cart: ${molecule}, Amount: ${amount}, Price: ${price}`);
    if (!molecule || !price) return;
    const priceNum = typeof price === 'number' ? price : Number(price) || 0;
    const cartItem = {
      name: molecule.BRUTTO_FORMULA || molecule.formula || molecule.SMILES_STRING || molecule.smiles || molecule.ASINEX_ID || 'Molecule',
      amount,
      price: priceNum,
      pricePerMg: priceNum, // for compatibility with dashboard-navbar
      totalPrice: priceNum, // Do not multiply by amount - just use the price as is
      id: molecule.ASINEX_ID || molecule.id || Math.random().toString(36).slice(2),
      smiles: molecule.SMILES_STRING || molecule.smiles || '',
      formula: molecule.BRUTTO_FORMULA || molecule.formula || '',
    };
    const updatedCart = [...cart, cartItem];
    setCart(updatedCart);
    saveCartToStorage(updatedCart);
    setMessage(`Added ${amount}mg of ${cartItem.name} to cart`);
    setMessageType('success');
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  // Hover preview functions
  const handleMouseEnter = (smiles, event, type) => {
    // Debug: Let's see what SMILES we're getting
    console.log('Hover SMILES data:', smiles, 'Type:', type);
    
    if (smiles && smiles !== 'N/A' && smiles.trim() !== '') {
      const rect = event.currentTarget.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const previewWidth = 220; // Preview width + padding
      
      // Calculate position - show on right if there's space, otherwise on left
      let xPosition = rect.right + 10;
      if (xPosition + previewWidth > windowWidth) {
        xPosition = rect.left - previewWidth - 10;
      }
      
      setPreviewPosition({
        x: Math.max(10, xPosition), // Ensure it doesn't go off-screen
        y: rect.top
      });
      setHoveredPreview({
        smiles: smiles.trim(), // Trim whitespace
        type: type
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredPreview(null);
  };

  // Helper function to extract SMILES from molecule object
  const extractSmiles = (mol) => {
    console.log('Full molecule object:', mol);
    console.log('Available fields:', Object.keys(mol));
    
    // Try different possible field names for SMILES
    const possibleFields = [
      'SMILES_STRING', 'SMILES', 'smiles', 'canonical_smiles', 
      'Canonical_SMILES', 'smi', 'structure', 'mol_smiles'
    ];
    
    for (const field of possibleFields) {
      if (mol[field] && typeof mol[field] === 'string' && mol[field].trim() !== '') {
        const smiles = mol[field].trim();
        // Basic SMILES validation - should contain typical SMILES characters
        if (smiles.length > 1 && /[A-Za-z0-9\[\]()@=#+\-\\/\\\\]/.test(smiles)) {
          console.log(`Found valid SMILES in field: ${field}, value: ${smiles}`);
          return smiles;
        } else {
          console.log(`Invalid SMILES format in field: ${field}, value: ${smiles}`);
        }
      }
    }
    
    console.log('No valid SMILES found in molecule:', mol);
    return null;
  };

  // Handle checkbox selection
  const handleCheckboxChange = (molecule, isChecked) => {
    const moleculeId = molecule.ASINEX_ID || molecule.id || Math.random().toString(36).slice(2);
    const smiles = molecule.SMILES_STRING || molecule.SMILES || molecule.smiles || '';
    
    setSelectedMolecules(prev => {
      const newSelected = new Set(prev);
      if (isChecked) {
        newSelected.add(moleculeId);
      } else {
        newSelected.delete(moleculeId);
      }
      
      // Update search box with concatenated SMILES for all selected molecules
      const selectedSmiles = [];
      topMolecules.forEach(mol => {
        const id = mol.ASINEX_ID || mol.id || Math.random().toString(36).slice(2);
        const molSmiles = mol.SMILES_STRING || mol.SMILES || mol.smiles || '';
        if (newSelected.has(id) && molSmiles) {
          selectedSmiles.push(molSmiles);
        }
      });
      
      setSearchCode(selectedSmiles.join(';'));
      return newSelected;
    });
  };

  const handleCopySmiles = async () => {
    if (ketcherIframeRef.current) {
      try {
        const ketcher = ketcherIframeRef.current.contentWindow.ketcher;
        if (ketcher) {
          const smiles = await ketcher.getSmiles();
          if (smiles) {
            await navigator.clipboard.writeText(smiles);
            setSearchCode(smiles); // Also update the search box
            setShowClipboardPopup(true);
            setTimeout(() => setShowClipboardPopup(false), 3000);
          } else {
            alert("No molecule drawn to get SMILES from.");
          }
        } else {
          alert("Ketcher editor not available.");
        }
      } catch (err) {
        console.error("Failed to get SMILES from Ketcher:", err);
        alert("Failed to get SMILES. Make sure a molecule is drawn.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-4 pb-4 bg-gray-50 w-full px-2 sm:px-4">
      {/* Hover Preview Tooltip */}
      {hoveredPreview && (
        <div 
          className="fixed z-50 bg-white border-2 border-gray-300 rounded-lg shadow-xl p-3"
          style={{
            left: `${previewPosition.x}px`,
            top: `${previewPosition.y}px`,
            transform: 'translateY(-50%)',
            maxWidth: '220px'
          }}
        >
          <div className="text-xs text-gray-600 mb-2 font-medium">
            {hoveredPreview.type} Preview
          </div>
          {/* Use simple image-based molecule viewer */}
          <div className="border border-gray-300 rounded overflow-hidden bg-white" style={{ width: '200px', height: '150px' }}>
            <img 
              src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(hoveredPreview.smiles)}/PNG?record_type=2d&image_size=200x150`}
              alt="Molecule structure"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={(e) => {
                console.warn('Failed to load molecule image for SMILES:', hoveredPreview.smiles, 'URL:', e.target.src);
                
                // Try different approaches in sequence using data attributes to track attempts
                if (!e.target.getAttribute('data-fallback-attempted')) {
                  e.target.setAttribute('data-fallback-attempted', '1');
                  // Try simplified SMILES encoding (remove special characters that might cause issues)
                  const simplifiedSmiles = hoveredPreview.smiles.replace(/[^\w\[\]()@=#+\-\\/\\\\]/g, '');
                  if (simplifiedSmiles !== hoveredPreview.smiles) {
                    console.log('Trying simplified SMILES:', simplifiedSmiles);
                    e.target.src = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(simplifiedSmiles)}/PNG?record_type=2d&image_size=200x150`;
                    return;
                  }
                }
                
                if (e.target.getAttribute('data-fallback-attempted') === '1') {
                  e.target.setAttribute('data-fallback-attempted', '2');
                  // Try different image size parameter
                  console.log('Trying different image size for SMILES:', hoveredPreview.smiles);
                  e.target.src = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(hoveredPreview.smiles)}/PNG?image_size=small`;
                  return;
                }
                
                // Final fallback - show text message
                console.log('All fallbacks failed, showing text for SMILES:', hoveredPreview.smiles);
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div 
              className="flex items-center justify-center bg-gray-50 text-gray-500 text-sm w-full h-full"
              style={{ display: 'none' }}
            >
              <div className="text-center">
                <div>Structure Preview</div>
                <div className="text-xs mt-1">Service Unavailable</div>
                <div className="text-xs mt-1">Complex SMILES format</div>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2 font-mono break-all">
            {hoveredPreview.smiles.length > 25 
              ? `${hoveredPreview.smiles.substring(0, 25)}...` 
              : hoveredPreview.smiles
            }
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-2 w-full">        
        {/* Query type radio buttons above search box */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-2 w-full">
          <Typography variant="small" color="blue-gray" className="mr-2">Query:</Typography>
          <label className="flex items-center gap-1 w-full sm:w-auto">
            <input
              type="radio"
              name="queryType"
              value="draw"
              checked={queryType === "draw"}
              onChange={() => setQueryType("draw")}
            />
            <span>Draw molecule</span>
          </label>
          <label className="flex items-center gap-1 w-full sm:w-auto">
            <input
              type="radio"
              name="queryType"
              value="text"
              checked={queryType === "text"}
              onChange={() => setQueryType("text")}
            />
            <span>Molecule ID, SMILES, CAS Number, IUPAC name, InChI, InChIKey</span>
          </label>
        </div>
        {/* Search type radio buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-2 w-full">
          <Typography variant="small" color="blue-gray" className="mr-2">Search type:</Typography>
          <label className="flex items-center gap-1 w-full sm:w-auto">
            <input
              type="radio"
              name="searchType"
              value="similarity"
              checked={searchType === "similarity"}
              onChange={() => setSearchType("similarity")}
            />
            <span>Similarity</span>
          </label>
          <label className="flex items-center gap-1 w-full sm:w-auto">
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
        {queryType !== "draw" && (
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          {/* Search section */}
          <div id="molecule-search" className="flex flex-col sm:flex-row items-stretch gap-2 w-full lg:w-1/2"> {/* 50% width search bar */}
            <Input
              label="Add molecule ID, SMILES, CAS Number, IUPAC name, InChI or InChIKey here"
              value={searchCode}
              onChange={e => setSearchCode(e.target.value)}
              className="flex-1 min-w-0 w-full" // full width within the container
            />
            <Button
              size="lg"
              color="green"
              onClick={handleSearch}
              disabled={searchLoading || !searchCode || selectedMolecules.size > 1}
              className="flex items-center gap-3 px-6 py-3 text-lg font-semibold shadow-md whitespace-nowrap"
            >
              {searchLoading ? <Spinner className="h-5 w-5" /> : <CloudIcon className="h-5 w-5" />}
              {searchLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
   

          {/* Docking section */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4 p-6 rounded-lg shadow-lg bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 border border-blue-300 self-start">
            <button
              type="button"
              className="text-blue-700 underline text-left mb-2 w-fit focus:outline-none hover:text-blue-900 transition-colors"
              tabIndex={0}
              onClick={() => setShowSimInputs(v => !v)}
            >
              Run 1 Click Docking
            </button>
            {showSimInputs && (
              <div id="simulation-inputs" className="flex items-center gap-0">
                <Input
                  label="PDB ID"
                  value={simPdbId}
                  onChange={e => setSimPdbId(e.target.value)}
                  className="w-full max-w-xs border border-black"
                />
                <Button
                  size="md"
                  color="blue"
                  onClick={handleSimulation}
                  disabled={simLoading || !simPdbId || !searchCode}
                  className="items-center gap-2"
                >
                  {simLoading ? 'Simulating...' : 'Simulate'}
                </Button>
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      {/* Simulating Status Message */}
      {simLoading && (
        <Card className="mb-6">
          <CardBody className="text-center py-8">
            <div className="flex flex-col items-center gap-4">
              <Spinner className="h-8 w-8" color="blue" />
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Processing Your Simulation
              </Typography>
              <Typography variant="small" color="gray" className="max-w-md">
                You will be redirected soon to 3D model viewer of the result. The SMILES will appear below the 3D model.
              </Typography>
            </div>
          </CardBody>
        </Card>
      )}

      {searchError && (
        <Alert color="yellow" className="mb-6">
          <Typography>{searchError}</Typography>
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

      {queryType !== "text" && (
        <div id="editor" style={{ display: "flex", flexDirection: "row", width: "100%", height: "70vh", gap: "16px" }}>
          {/* Ketcher Editor - Half width */}
          <div style={{ width: "50%", height: "70vh", background: "#f5f5f5" }}>
            <iframe
              ref={ketcherIframeRef}
              src="/ketcher/index.html"
              title="Ketcher 2D Chemical Editor"
              style={{ width: "100%", height: "70vh", border: "2px solid #ccc", borderRadius: 8, background: "white" }}
              allowFullScreen
            />
          </div>
          
          {/* Controls Panel - Half width */}
          <div className="flex flex-col gap-4 w-1/2 p-4 bg-white rounded-lg shadow-lg">
            {/* Copy SMILES Button */}
            <Button 
              onClick={handleCopySmiles}
              color="orange"
              size="lg"
              className="w-full"
            >
              Copy SMILES from Drawing
            </Button>
            
            {/* Search section */}
            <div className="flex flex-col gap-2">
              <Typography variant="h6" color="blue-gray">Search Molecules</Typography>
              <Input
                label="Add molecule ID, SMILES, CAS Number, IUPAC name, InChI or InChIKey here"
                value={searchCode}
                onChange={e => setSearchCode(e.target.value)}
                className="w-full"
              />
              <Button
                size="lg"
                color="green"
                onClick={handleSearch}
                disabled={searchLoading || !searchCode || selectedMolecules.size > 1}
                className="flex items-center justify-center gap-3 w-full"
              >
                {searchLoading ? <Spinner className="h-5 w-5" /> : <CloudIcon className="h-5 w-5" />}
                {searchLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {/* Docking section */}
            <div className="flex flex-col gap-4 p-4 rounded-lg bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 border border-blue-300">
              <button
                type="button"
                className="text-blue-700 underline text-left w-fit focus:outline-none hover:text-blue-900 transition-colors"
                tabIndex={0}
                onClick={() => setShowSimInputs(v => !v)}
              >
                Run 1 Click Docking
              </button>
              {showSimInputs && (
                <div className="flex flex-col gap-2">
                  <Input
                    label="PDB ID"
                    value={simPdbId}
                    onChange={e => setSimPdbId(e.target.value)}
                    className="w-full"
                  />
                  <Button
                    size="md"
                    color="blue"
                    onClick={handleSimulation}
                    disabled={simLoading || !simPdbId || !searchCode}
                    className="flex items-center justify-center gap-2 w-full"
                  >
                    {simLoading ? 'Simulating...' : 'Simulate'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
        <div id="results" style={{ width: "100%", height: "70vh", background: "#e3e8ef" }}>
          {/* Header as a block element, not wrapping Card or div */}
          {/* <div className="mb-4">
            <Typography as="h5" variant="h5" color="blue-gray">Top {topMolecules.length} Molecules</Typography>
          </div> */}
          {topLoading && topMolecules.length === 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Spinner className="h-5 w-5 text-blue-500" />
              <Typography>Loading molecules...</Typography>
            </div>
          )}
          {topError && (
            <Alert color="red" className="mb-4">{topError}</Alert>
          )}
          {!initialLoading && !topError && topMolecules.length > 0 && (
            <Card className="mb-4">
              <CardBody>
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="p-2 font-bold">Select</th>
                      <th className="p-2 font-bold">#</th>
                      <th className="p-2 font-bold">ID</th>
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
                    {topMolecules.map((mol, idx) => {
                      const moleculeId = mol.ASINEX_ID || mol.id || Math.random().toString(36).slice(2);
                      const isChecked = selectedMolecules.has(moleculeId);
                      
                      return (
                        <tr key={moleculeId} className="border-b">
                          <td className="p-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => handleCheckboxChange(mol, e.target.checked)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </td>
                          <td className="p-2">{idx + 1}</td>
                        <td
                          className="p-2 cursor-pointer hover:bg-blue-100"
                          title={mol.ASINEX_ID ? mol.ASINEX_ID.replace(/^ASN/i, "") : "N/A"}
                          onClick={() => setSearchCode(mol.ASINEX_ID ? mol.ASINEX_ID.replace(/^ASN/i, "") : "")}
                          onMouseEnter={(e) => handleMouseEnter(extractSmiles(mol), e, "mcule ID")}
                          onMouseLeave={handleMouseLeave}
                        >
                          {(mol.ASINEX_ID ? mol.ASINEX_ID.replace(/^ASN/i, "") : "N/A").toString().slice(0,moleculeLimit)}{(mol.ASINEX_ID ? mol.ASINEX_ID.replace(/^ASN/i, "") : "N/A").toString().length > moleculeLimit ? '...' : ''}
                        </td>
                        <td
                          className="p-2 cursor-pointer hover:bg-blue-100"
                          title={mol.IUPAC_NAME || "N/A"}
                          onClick={() => setSearchCode(mol.IUPAC_NAME || "")}
                          onMouseEnter={(e) => handleMouseEnter(extractSmiles(mol), e, "IUPAC Name")}
                          onMouseLeave={handleMouseLeave}
                        >
                          {(mol.IUPAC_NAME || "N/A").toString().slice(0,moleculeLimit)}{(mol.IUPAC_NAME || "N/A").toString().length > moleculeLimit ? '...' : ''}
                        </td>
                        <td
                          className="p-2 font-mono text-xs cursor-pointer hover:bg-blue-100"
                          title={mol.SMILES_STRING || mol.SMILES || mol.smiles || "N/A"}
                          onClick={async () => {
                            const smiles = mol.SMILES_STRING || mol.SMILES || mol.smiles || "";
                            setSearchCode(smiles);
                            try {
                              await navigator.clipboard.writeText(smiles);
                              setShowClipboardPopup(true);
                              setTimeout(() => setShowClipboardPopup(false), 3000);
                            } catch (err) {
                              alert("Failed to copy SMILES to clipboard: " + err);
                            }
                          }}
                          onMouseEnter={(e) => handleMouseEnter(extractSmiles(mol), e, "SMILES")}
                          onMouseLeave={handleMouseLeave}
                        >
                          {(mol.SMILES_STRING || mol.SMILES || mol.smiles || "N/A").toString().slice(0,moleculeLimit)}{(mol.SMILES_STRING || mol.SMILES || mol.smiles || "N/A").toString().length > moleculeLimit ? '...' : ''}
                        </td>
                        <td
                          className="p-2 font-mono text-xs cursor-pointer hover:bg-blue-100"
                          title={mol.INCHI || "N/A"}
                          onClick={async () => {
                            const inchi = mol.INCHI || "";
                            setSearchCode(inchi);
                            try {
                              await navigator.clipboard.writeText(inchi);
                              setShowClipboardPopup(true);
                              setTimeout(() => setShowClipboardPopup(false), 3000);
                            } catch (err) {
                              alert("Failed to copy InChI to clipboard: " + err);
                            }
                          }}
                          onMouseEnter={(e) => handleMouseEnter(extractSmiles(mol), e, "InChI")}
                          onMouseLeave={handleMouseLeave}
                        >
                          {(mol.INCHI || "N/A").toString().slice(0,moleculeLimit)}{(mol.INCHI || "N/A").toString().length > moleculeLimit ? '...' : ''}
                        </td>
                        <td
                          className="p-2 font-mono text-xs cursor-pointer hover:bg-blue-100"
                          title={mol.INCHIKEY || "N/A"}
                          onClick={() => setSearchCode(mol.INCHIKEY || "")}
                          onMouseEnter={(e) => handleMouseEnter(extractSmiles(mol), e, "InChIKey")}
                          onMouseLeave={handleMouseLeave}
                        >
                          {(mol.INCHIKEY || "N/A").toString().slice(0,moleculeLimit)}{(mol.INCHIKEY || "N/A").toString().length > moleculeLimit ? '...' : ''}
                        </td>
                        <td className="p-2" title={mol.BRUTTO_FORMULA || "N/A"}>{(mol.BRUTTO_FORMULA || "N/A").toString().slice(0,moleculeLimit)}{(mol.BRUTTO_FORMULA || "N/A").toString().length > moleculeLimit ? '...' : ''}</td>
                        <td className="p-2" title={mol.MW_STRUCTURE || "N/A"}>{(mol.MW_STRUCTURE || "N/A").toString().slice(0,moleculeLimit)}{(mol.MW_STRUCTURE || "N/A").toString().length > moleculeLimit ? '...' : ''}</td>
                        <td className="p-2" title={mol.AVAILABLE_MG || "N/A"}>{(mol.AVAILABLE_MG || "N/A").toString().slice(0,moleculeLimit)}{(mol.AVAILABLE_MG || "N/A").toString().length > moleculeLimit ? '...' : ''}</td>
                        <td className="p-2 cursor-pointer group" title={mol.PRICE_1MG ? `$${mol.PRICE_1MG}` : "-"}
                          onClick={() => addToCart(mol, 1, mol.PRICE_1MG)}
                        >
                          <span>{(mol.PRICE_1MG ? `$${mol.PRICE_1MG}` : "-").toString().slice(0,moleculeLimit)}{(mol.PRICE_1MG ? `$${mol.PRICE_1MG}` : "-").toString().length > moleculeLimit ? '...' : ''}</span>
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
                          <span>{(mol.PRICE_2MG ? `$${mol.PRICE_2MG}` : "-").toString().slice(0,moleculeLimit)}{(mol.PRICE_2MG ? `$${mol.PRICE_2MG}` : "-").toString().length > moleculeLimit ? '...' : ''}</span>
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
                          <span>{(mol.PRICE_5MG ? `$${mol.PRICE_5MG}` : "-").toString().slice(0,moleculeLimit)}{(mol.PRICE_5MG ? `$${mol.PRICE_5MG}` : "-").toString().length > moleculeLimit ? '...' : ''}</span>
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
                          <span>{(mol.PRICE_10MG ? `$${mol.PRICE_10MG}` : "-").toString().slice(0,moleculeLimit)}{(mol.PRICE_10MG ? `$${mol.PRICE_10MG}` : "-").toString().length > moleculeLimit ? '...' : ''}</span>
                          {mol.PRICE_10MG && (
                            <ShoppingCartIcon
                              className="inline-block h-5 w-5 text-green-600 ml-2 cursor-pointer opacity-70 group-hover:opacity-100"
                              title="Add 10mg to cart"
                            />
                          )}
                        </td>
                      </tr>
                    )
                    })}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          )}
          
          {/* Pagination Loading Indicator */}
          {topLoading && topMolecules.length > 0 && (
            <div className="flex items-center justify-center gap-2 mb-4 py-4">
              <Spinner className="h-5 w-5 text-blue-500" />
              <Typography variant="small" color="gray">Loading more molecules...</Typography>
            </div>
          )}
          
          {/* No More Data Message */}
          {!hasMore && topMolecules.length > 0 && !topLoading && (
            <div className="text-center py-4 mb-4">
              <Typography variant="small" color="gray">
                No more molecules to load. Showing {topMolecules.length} total molecules.
              </Typography>
            </div>
          )}
          
          {/* No Data State */}
          {!initialLoading && !topLoading && !topError && topMolecules.length === 0 && (
            <div className="text-center py-8">
              <Typography variant="small" color="gray">
                No molecules found. Try searching for specific compounds.
              </Typography>
            </div>
          )}
        </div>
      {showClipboardPopup && (
        <Alert color="green" className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-fit px-6 py-3 text-center shadow-lg">
          Ctrl+V into Draw molecule
        </Alert>
      )}
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
                  href={API_CONFIG.buildApiUrl(`/sanitizedpdb/${simResult.simulationKey}`)}
                  target="_blank"
                >
                  View Sanitized PDB Result
                </a>
                <a download
                  className="inline-block px-4 py-2 border border-green-500 text-green-500 rounded hover:bg-green-50 transition"
                  href={API_CONFIG.buildApiUrl(`/sanitizedminimalsdf/${simResult.simulationKey}`)}
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
