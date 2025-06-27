import React from "react";

export function Molstar3D() {
  return (
    <div style={{ width: "100%", height: "100vh", background: "#f5f5f5" }}>
      <iframe
        src="/molstar/index.html"
        title="Molstar 3D Molecular Viewer"
        style={{ width: "100%", height: "100vh", border: "2px solid #ccc", borderRadius: 8, background: "white" }}
        allowFullScreen
      />
    </div>
  );
}

export default Molstar3D;
