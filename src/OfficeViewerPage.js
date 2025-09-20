import React from "react";
import { useLocation } from "react-router-dom";

const OfficeViewerPage = () => {
  const location = useLocation();
  const { fileUrl, fileName } = location.state || {};

  if (!fileUrl) {
    return <div className="error">Fichier non trouvé.</div>;
  }

  const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;

  return (
    <div className="office-viewer">
      <h1>Prévisualisation du fichier : {fileName}</h1>
      <iframe
        src={officeViewerUrl}
        title="Office Viewer"
        style={{ width: "100%", height: "80vh", border: "none" }}
      />
    </div>
  );
};

export default OfficeViewerPage;