import React from "react";

export default function AboutUs() {
  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="row align-items-center mb-5">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <img
            src="/img/pyxis-team.jpg"
            alt="Pyxis Discovery Team"
            className="img-fluid rounded shadow"
            style={{ maxHeight: 400, objectFit: "cover", width: "100%" }}
          />
        </div>
        <div className="col-lg-6">
          <h1 className="display-4 fw-bold mb-3">About Pyxis Discovery</h1>
          <p className="lead">
            Pyxis Discovery is a chemistry-driven company specializing in the design and synthesis of macrocyclic compound libraries for drug discovery. Our mission is to accelerate the development of new medicines by providing unique, high-quality chemical space and innovative solutions for pharmaceutical research.
          </p>
        </div>
      </div>

      {/* Our Mission */}
      <div className="row mb-5">
        <div className="col">
          <h2 className="h3 fw-bold mb-3">Our Mission</h2>
          <p>
            We are committed to enabling the discovery of future medicines by unlocking the potential of macrocyclic chemistry. Our scaffold-based approach to chemical space exploration offers significant advantages for machine learning, automation, and medicinal chemistry innovation.
          </p>
        </div>
      </div>

      {/* Our Team */}
      <div className="row align-items-center mb-5">
        <div className="col-lg-6 order-lg-2 mb-4 mb-lg-0">
          <img
            src="/img/pyxis-lab.jpg"
            alt="Pyxis Discovery Lab"
            className="img-fluid rounded shadow"
            style={{ maxHeight: 400, objectFit: "cover", width: "100%" }}
          />
        </div>
        <div className="col-lg-6 order-lg-1">
          <h2 className="h3 fw-bold mb-3">Our Team</h2>
          <p>
            Pyxis Discovery was founded by a group of experienced scientists with backgrounds in medicinal chemistry, computational chemistry, and chemical biology. Our team combines deep scientific expertise with a passion for innovation and collaboration.
          </p>
        </div>
      </div>

      {/* Our Approach */}
      <div className="row mb-5">
        <div className="col">
          <h2 className="h3 fw-bold mb-3">Our Approach</h2>
          <p>
            We embrace scaffold-based chemical space exploration, focusing on drug-like, synthetically tractable macrocycles. Our libraries are designed to be compatible with modern drug discovery workflows, including AI-driven design, high-throughput screening, and structure-based drug design.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="row">
        <div className="col text-center">
          <h2 className="h4 fw-bold mb-3">Contact Us</h2>
          <p>
            Interested in learning more about Pyxis Discovery or collaborating with us?{" "}
            <a href="/main/contact-us" className="btn btn-success ms-2">
              Contact Us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}