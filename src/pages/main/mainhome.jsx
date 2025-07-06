import React from "react";
import { Typography, Card, CardHeader, CardBody, Button } from "@material-tailwind/react";
import { pyxisImages } from "@/data/pyxisImages";

export function MainHome() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div
        className="w-full h-[340px] flex flex-col justify-center items-center text-center relative bg-cover bg-center"
        style={{
          backgroundImage: `url('${pyxisImages.hero}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <Typography variant="h2" color="white" className="mb-4 font-bold drop-shadow-lg">
            Accelerate and advance your medicine R&D process with our Compound Libraries
          </Typography>
          <Typography variant="lead" color="white" className="mb-6 drop-shadow">
            Create future medicines by unlocking the potential of macrocyclic chemistry
          </Typography>
        </div>
      </div>

      {/* Scaffold-based Chemical Space Section */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <Typography variant="h4" color="blue-gray" className="mb-4">
          Pyxis embraces the concept of scaffold-based chemical space exploration
        </Typography>
        <Typography variant="paragraph" className="text-blue-gray-700 mb-2">
          This library design approach offers several advantages over alternative methods of chemical space enrichment as it is easy to combine with existing machine learning and statistical modelling algorithms and chemistry process automation. All Pyxis scaffolds are drug-like and synthetically tractable, featuring Fsp3-rich linkers and ring-systems found in known drugs or natural products. The peripheral building blocks can be attached to the core scaffold in a step-by-step fashion using well-validated protocols of parallel chemistry.
        </Typography>
      </section>

      {/* Macrocyclic ChemSpace Section */}
      <section className="bg-blue-gray-50 py-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 px-4">
          <img src={pyxisImages.macrocyclicChemspace} alt="Macrocyclic ChemSpace" className="w-full md:w-1/2 rounded-lg shadow-md object-cover" />
          <div className="flex-1">
            <Typography variant="h4" color="blue-gray" className="mb-2">
              Macrocyclic ChemSpace
            </Typography>
            <Typography variant="paragraph" className="mb-2 text-blue-gray-700">
              3-tier ChemSpace:
            </Typography>
            <ul className="list-disc ml-6 text-blue-gray-700 text-base mb-2">
              <li>10,000 Off-the-shelf molecules (1mg, ready-to-ship, 10μmol format)</li>
              <li>1,000,000 Synthesis-on-demand molecules (3-day turnaround)</li>
              <li>1,000,000,000 Fully enumerated, synthetically feasible macrocycles</li>
            </ul>
            <Typography variant="small" className="mb-2 block text-blue-gray-600">
              All scaffolds are drug-like, synthetically tractable, and compatible with machine learning and automation.
            </Typography>
            <Button size="sm" color="blue" variant="outlined" className="mt-2" as="a" href="https://www.pyxis-discovery.com/wp-content/uploads/2025/01/Macrocycles-Final-10k-Compounds.zip" target="_blank" rel="noopener noreferrer">
              Download 10,000 Macrocyclic ChemSpace (SDF)
            </Button>
          </div>
        </div>
      </section>

      {/* Macrocycles for CNS Section */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row-reverse items-center gap-8 px-4">
          <img src={pyxisImages.cnsMacrocycles} alt="CNS Macrocycles" className="w-full md:w-1/2 rounded-lg shadow-md object-cover" />
          <div className="flex-1">
            <Typography variant="h4" color="blue-gray" className="mb-2">
              Macrocycles for CNS
            </Typography>
            <Typography variant="paragraph" className="mb-2 text-blue-gray-700">
              Uniquely designed macrocycles for CNS drug discovery, offering excellent solubility, cellular permeability, and diverse shapes for modulating CNS targets.
            </Typography>
            <ul className="list-disc ml-6 text-blue-gray-700 text-base mb-2">
              <li>2,870 in-stock macrocycles (0.5μmol in DMSO, 90% purity)</li>
              <li>Pre-plated, ready for screening</li>
            </ul>
            <Button size="sm" color="blue" variant="outlined" className="mt-2" as="a" href="https://www.pyxis-discovery.com/wp-content/uploads/2024/11/Macrocycles-Final-Compounds-0.5umol.zip" target="_blank" rel="noopener noreferrer">
              Download CNS Macrocycles (SDF)
            </Button>
          </div>
        </div>
      </section>

      {/* Macrocycles as Molecular Glues Section */}
      <section className="bg-blue-gray-50 py-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 px-4">
          <img src={pyxisImages.molecularGlues} alt="Molecular Glues" className="w-full md:w-1/2 rounded-lg shadow-md object-cover" />
          <div className="flex-1">
            <Typography variant="h4" color="blue-gray" className="mb-2">
              Macrocycles as Molecular Glues
            </Typography>
            <Typography variant="paragraph" className="mb-2 text-blue-gray-700">
              Diversity-oriented macrocyclic library for unbiased molecular glue screening, targeting protein-protein interactions and non-traditional binding sites.
            </Typography>
            <ul className="list-disc ml-6 text-blue-gray-700 text-base mb-2">
              <li>1,277 in-stock macrocycles (0.5μmol in DMSO, 90% purity)</li>
              <li>Pre-plated, ready for screening</li>
            </ul>
            <Button size="sm" color="blue" variant="outlined" className="mt-2" as="a" href="https://www.pyxis-discovery.com/wp-content/uploads/2024/11/protac-in-vitro-1277.zip" target="_blank" rel="noopener noreferrer">
              Download Molecular Glues Library (SDF)
            </Button>
          </div>
        </div>
      </section>

      {/* Macrocycles for Covalent Drug Discovery Section */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row-reverse items-center gap-8 px-4">
          <img src={pyxisImages.covalentMacrocycles} alt="Covalent Macrocycles" className="w-full md:w-1/2 rounded-lg shadow-md object-cover" />
          <div className="flex-1">
            <Typography variant="h4" color="blue-gray" className="mb-2">
              Macrocycles for Covalent Drug Discovery
            </Typography>
            <Typography variant="paragraph" className="mb-2 text-blue-gray-700">
              Cysteine-oriented electrophilic macrocycles for covalent drug discovery, enabling SAR exploration and targeting challenging proteins.
            </Typography>
            <ul className="list-disc ml-6 text-blue-gray-700 text-base mb-2">
              <li>13,948 on-demand macrocycles (2μmol dry, 90% purity, 4-week turnaround)</li>
            </ul>
            <Button size="sm" color="blue" variant="outlined" className="mt-2" as="a" href="https://www.pyxis-discovery.com/wp-content/uploads/2024/11/macrocyclic-covalent-library-13948.zip" target="_blank" rel="noopener noreferrer">
              Download Covalent Macrocycles Library (SDF)
            </Button>
          </div>
        </div>
      </section>

      {/* Contact/CTA Section */}
      <section className="bg-blue-gray-50 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <Typography variant="h5" color="blue-gray" className="mb-2">
            Looking for advice or a screening partner?
          </Typography>
          <Button size="lg" color="green" as="a" href="https://www.pyxis-discovery.com/contact/" target="_blank" rel="noopener noreferrer">
            Contact Pyxis Discovery
          </Button>
        </div>
      </section>
    </div>
  );
}

export default MainHome;
