import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Chip,
} from "@material-tailwind/react";

const filters = [
  "ADMET Prediction",
  "Antibodies",
  "Antibody Design",
  "Drug Design",
  "Drug Discovery",
  "Inverse Folding",
  "Molecular Docking",
  "Molecular Dynamics",
  "Multiple Sequence Alignment",
  "Phylogenetics",
  "Protein Annotation",
  "Protein Clustering",
  "Protein Conformations",
  "Protein Design",
  "Protein Expression",
  "Protein Folding",
  "Protein Localization",
  "Protein Solubility",
  "Protein Stability",
  "RNASeq / Transcriptome Analysis",
  "Signal Peptide Detection",
  "Toxicity Prediction",
];

const additionalLinks = [
  { label: "neurosnap", url: "https://checm.software/" },
  { label: "Tools", url: "https://checm.software/services" },
  { label: "Blog", url: "https://checm.software/blog" },
  { label: "Contact Us", url: "https://checm.software/support" },
  { label: "Pricing", url: "https://checm.software/#pricing" },
  { label: "Sign In", url: "https://checm.software/login" },
  { label: "Try Free", url: "https://checm.software/register" },
];

export function Tables() {
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h4" color="white">
            Available bioinformatic tools and services
          </Typography>
        </CardHeader>
        <CardBody>
          <Typography variant="h6" className="mb-4">
            Filters
          </Typography>
          <div className="flex flex-wrap gap-2 mb-8">
            {filters.map((filter) => (
              <Chip
                key={filter}
                value={filter}
                color="blue-gray"
                className="text-xs"
              />
            ))}
          </div>
          <Typography variant="h6" className="mb-2">
            Can't find what you're looking for?
          </Typography>
          <Typography className="mb-4">
            Contact our support team and we'll add it to our platform.
          </Typography>
          <Button
            color="blue"
            as="a"
            href="https://chem.software/support"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-8"
          >
            Contact Support
          </Button>
          <Typography variant="h6" className="mb-2">
            Additional Links
          </Typography>
          {/* <ul className="mb-4">
            {additionalLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul> */}
          <Typography variant="small" color="gray" className="mt-8">
            © 2022-2025 Asinex Inc. All Rights Reserved.
          </Typography>
        </CardBody>
      </Card>
    </div>
  );
}

export default Tables;
