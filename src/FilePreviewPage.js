import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const FilePreviewPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const filePath = params.get("filePath");
  const fileType = params.get("fileType");
  const [loading, setLoading] = useState(true);

  // Construire l'URL du fichier
  const fileUrl = `http://127.0.0.1:8000/storage/${filePath}`;

  // Simuler un temps de chargement
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simule un temps de chargement de 2 secondes

    return () => clearTimeout(timer);
  }, [fileUrl]);

  // Gestion des erreurs de chargement
  const handleError = () => {
    Swal.fire({
      icon: "error",
      title: "Erreur",
      text: "Impossible de charger le fichier. Veuillez réessayer.",
    });
    setLoading(false);
  };

  // Ouvrir le fichier avec Google Drive Viewer
  const openWithGoogleDriveViewer = () => {
    const encodedFileUrl = encodeURIComponent(fileUrl);
    const driveViewerUrl = `https://drive.google.com/viewerng/viewer?url=${encodedFileUrl}`;
    window.open(driveViewerUrl, "_blank");
  };

  return (
    <div className="file">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
          padding: "20px",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center" }}>
            <p>Chargement en cours...</p>
          </div>
        ) : (
          <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
            {/* Affichage selon le type de fichier */}
            {fileType === "image" && (
              <img
                src={fileUrl}
                alt="File Preview"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                onError={handleError}
              />
            )}

            {fileType === "pdf" && (
              <div style={{ textAlign: "center" }}>
                <button
                  onClick={openWithGoogleDriveViewer}
                  style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    cursor: "pointer",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  Ouvrir avec Google Drive Viewer
                </button>
                <p style={{ marginTop: "10px" }}>
                  Ou <a href={fileUrl} download>Télécharger le PDF</a>
                </p>
              </div>
            )}

            {(fileType === "doc" || fileType === "docx") && (
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(
                  fileUrl
                )}&embedded=true`}
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: "none" }}
                onError={handleError}
                title="Document Preview"
              ></iframe>
            )}

            {fileType !== "image" &&
              fileType !== "pdf" &&
              fileType !== "doc" &&
              fileType !== "docx" && (
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  🗂️ Aperçu non disponible pour ce fichier.
                </p>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePreviewPage;