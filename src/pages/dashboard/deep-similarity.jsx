import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  Input,
  Spinner,
  Alert,
} from "@material-tailwind/react";
import { API_CONFIG } from "@/utils/constants";

export function DeepSimilarity() {
  const [searchType, setSearchType] = useState("exact");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setResults([]);
    
    try {
      let url = "";
      const smiles = encodeURIComponent(searchQuery);
      
      if (searchType === "exact") {
        url = API_CONFIG.buildUrl(`/tanimoto/v1/search/exact?smiles=${smiles}`);
      } else if (searchType === "similarity") {
        url = API_CONFIG.buildUrl(`/tanimoto/v1/search/similarity?smiles=${smiles}`);
      } else if (searchType === "substructure") {
        url = API_CONFIG.buildUrl(`/tanimoto/v1/search/substructure?smiles=${smiles}`);
      }
      
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      setError("Search failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-6 w-full">
      <CardHeader>
        <Typography variant="h5">Deep Similarity Search</Typography>
      </CardHeader>
      <CardBody>
        <div className="flex gap-4 mb-4">
          <Input
            label="Search Query (SMILES)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <select
            value={searchType}
            onChange={e => setSearchType(e.target.value)}
            className="border border-blue-gray-300 rounded px-3 py-2 font-medium"
          >
            <option value="exact">Exact</option>
            <option value="similarity">Similarity</option>
            <option value="substructure">Substructure</option>
          </select>
          <Button onClick={handleSearch} disabled={loading || !searchQuery}>
            {loading ? <Spinner size="sm" /> : "Search"}
          </Button>
        </div>
        {error && <Alert color="red">{error}</Alert>}
        {results.length > 0 && (
          <Typography variant="small" className="mb-4 text-blue-gray-600">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </Typography>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {results.map((item, idx) => (
            <Card key={idx} className="border border-blue-gray-100 p-4">
              <div className="mb-3 flex justify-between items-start">
                <Typography variant="small" color="blue-gray" className="font-semibold">
                  ID: {item.molecule_id}
                </Typography>
                {item.similarity && (
                  <Typography variant="small" color="green" className="font-semibold">
                    {(item.similarity * 100).toFixed(1)}%
                  </Typography>
                )}
              </div>
              <Typography variant="small" className="mb-2 break-words text-xs font-mono">
                {item.canonical_smiles}
              </Typography>
              <hr className="my-2" />
              <div className="text-xs space-y-1">
                {item.metadata?.compound_id && (
                  <Typography variant="small" color="blue-gray">
                    <strong>Compound:</strong> {item.metadata.compound_id}
                  </Typography>
                )}
                {item.metadata?.molecular_formula && (
                  <Typography variant="small" color="blue-gray">
                    <strong>Formula:</strong> {item.metadata.molecular_formula}
                  </Typography>
                )}
                {item.metadata?.monoisotopic_mass && (
                  <Typography variant="small" color="blue-gray">
                    <strong>Mass:</strong> {item.metadata.monoisotopic_mass}
                  </Typography>
                )}
                {item.metadata?.activity_score && (
                  <Typography variant="small" color="blue-gray">
                    <strong>Activity:</strong> {item.metadata.activity_score}
                  </Typography>
                )}
              </div>
            </Card>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export default DeepSimilarity;
