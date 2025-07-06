import React from "react";
import { Typography, Card, CardBody, Button } from "@material-tailwind/react";
import { pyxisServicesImages } from "@/data/pyxisServicesImages";

export default function Services() {
  return (
    <div className="bg-white">
      <div className="w-full h-[260px] flex flex-col justify-center items-center text-center relative bg-blue-gray-900">
        <div className="absolute inset-0 bg-blue-gray-900/80" />
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <Typography variant="h2" color="white" className="mb-4 font-bold drop-shadow-lg">
            Virtual Screening & Synthesis on Demand
          </Typography>
          <Typography variant="lead" color="white" className="mb-6 drop-shadow">
            Pyxis has a proven track record of supporting computational modeling, virtual docking and bioavailability optimization projects using an array of commercial and proprietary computational tools.
          </Typography>
        </div>
      </div>

      {/* Structure Based Selections */}
      <section className="max-w-5xl mx-auto py-12 px-4 flex flex-col md:flex-row items-center gap-8">
        <img src={pyxisServicesImages.structureBased} alt="Structure Based Selections" className="w-full md:w-1/2 rounded-lg shadow-md object-cover" />
        <div className="flex-1">
          <Typography variant="h4" color="blue-gray" className="mb-2">
            Structure Based Selections
          </Typography>
          <Typography variant="paragraph" className="mb-2 text-blue-gray-700">
            With the development and free availability of AlphaFold, an interest in ultra large chemical libraries has spiked. Responding to demand, we created a unique database of <a href="https://www.pyxis-discovery.com/wp-content/uploads/2025/02/Macrocycles-Final-1M-Compounds.zip" className="text-blue-600 underline">1 million</a> and 1 billion (<a href="https://www.pyxis-discovery.com/contact/" className="text-blue-600 underline">available on request</a>) cell-permeable macrocycles. Our library consists of only drug-like macrocyclic compounds, validated for high synthesis success rate using our proprietary platform. We also offer structure-based virtual screening services using the MOE software package.
          </Typography>
          <Button size="sm" color="blue" variant="outlined" className="mt-2" as="a" href="https://www.pyxis-discovery.com/contact/" target="_blank" rel="noopener noreferrer">
            Request Structure-Based Screening
          </Button>
        </div>
      </section>

      {/* Query Based Selections */}
      <section className="max-w-5xl mx-auto py-12 px-4 flex flex-col md:flex-row-reverse items-center gap-8">
        <img src={pyxisServicesImages.queryBased} alt="Query Based Selections" className="w-full md:w-1/2 rounded-lg shadow-md object-cover" />
        <div className="flex-1">
          <Typography variant="h4" color="blue-gray" className="mb-2">
            Query Based Selections
          </Typography>
          <Typography variant="paragraph" className="mb-2 text-blue-gray-700">
            The rapidly growing size of tangible chemical space can create technical challenges in handling and navigating structurally-rich datasets. To facilitate this, we offer ready-to-go products and services for analog and molecule selection. <a href="https://www.pyxis-discovery.com/wp-content/uploads/2025/01/Macrocycles-Final-10k-Compounds.zip" className="text-blue-600 underline">Browse 10,000 chemotypes</a>, explore <a href="https://www.pyxis-discovery.com/wp-content/uploads/2025/02/Macrocycles-Final-1M-Compounds.zip" className="text-blue-600 underline">1 million macrocycles</a>, or <a href="https://www.pyxis-discovery.com/contact/" className="text-blue-600 underline">contact us</a> for scaffold-based, substructure, or pharmacophore-based queries within a larger (up to 1 billion) chemical space.
          </Typography>
          <Button size="sm" color="blue" variant="outlined" className="mt-2" as="a" href="https://www.pyxis-discovery.com/contact/" target="_blank" rel="noopener noreferrer">
            Request Query-Based Selection
          </Button>
        </div>
      </section>

      {/* Property Based Filtering */}
      <section className="max-w-5xl mx-auto py-12 px-4 flex flex-col md:flex-row items-center gap-8">
        <img src={pyxisServicesImages.propertyBased} alt="Property Based Filtering" className="w-full md:w-1/2 rounded-lg shadow-md object-cover" />
        <div className="flex-1">
          <Typography variant="h4" color="blue-gray" className="mb-2">
            Property Based Filtering
          </Typography>
          <Typography variant="paragraph" className="mb-2 text-blue-gray-700">
            Pyxis has years of experience in designing cell-permeable and CNS-like compounds, as demonstrated in our <a href="https://pubs.acs.org/doi/10.1021/acs.jmedchem.1c02090" className="text-blue-600 underline">publication</a>. Our cell-permeable macrocycles are based on proprietary PAMPA data and all products are designed with cell-permeability in mind. Explore our databases of <a href="https://www.pyxis-discovery.com/wp-content/uploads/2025/01/Macrocycles-Final-10k-Compounds.zip" className="text-blue-600 underline">10,000</a>, <a href="https://www.pyxis-discovery.com/wp-content/uploads/2025/02/Macrocycles-Final-1M-Compounds.zip" className="text-blue-600 underline">1 million</a>, and 1 billion (<a href="https://www.pyxis-discovery.com/contact/" className="text-blue-600 underline">available on request</a>) compounds.
          </Typography>
          <Button size="sm" color="blue" variant="outlined" className="mt-2" as="a" href="https://www.pyxis-discovery.com/contact/" target="_blank" rel="noopener noreferrer">
            Request Property-Based Filtering
          </Button>
        </div>
      </section>

      {/* Synthesis on Demand */}
      <section className="max-w-5xl mx-auto py-12 px-4 flex flex-col md:flex-row-reverse items-center gap-8">
        <img src={pyxisServicesImages.synthesisOnDemand} alt="Synthesis on Demand" className="w-full md:w-1/2 rounded-lg shadow-md object-cover" />
        <div className="flex-1">
          <Typography variant="h4" color="blue-gray" className="mb-2">
            Synthesis on Demand
          </Typography>
          <Typography variant="paragraph" className="mb-2 text-blue-gray-700">
            Our unique platform of high throughput experimentation allows us to instantly and cost-efficiently produce molecules for your research. Consult our databases of <a href="https://www.pyxis-discovery.com/wp-content/uploads/2025/02/Macrocycles-Final-1M-Compounds.zip" className="text-blue-600 underline">1 million</a> and 1 billion (<a href="https://www.pyxis-discovery.com/contact/" className="text-blue-600 underline">available on request</a>) molecules.
          </Typography>
          <Button size="sm" color="blue" variant="outlined" className="mt-2" as="a" href="https://www.pyxis-discovery.com/contact/" target="_blank" rel="noopener noreferrer">
            Request Synthesis on Demand
          </Button>
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
