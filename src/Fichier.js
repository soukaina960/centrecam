import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Fichier = () => {
  const location = useLocation();
  const { level, class: selectedClass, subject } = location.state || {};
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Veuillez sélectionner un fichier à télécharger.');
      return;
    }

    setUploadedFiles([...uploadedFiles, selectedFile.name]);
    setSelectedFile(null);
    alert('Fichier téléchargé avec succès !');
  };

  return (
    <div className="fichier-container">
      <h2>Gérer les fichiers pour {subject} - {selectedClass} ({level})</h2>

      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Télécharger</button>
      </div>

      <div className="file-list">
        <h3>Fichiers disponibles :</h3>
        <ul>
          {uploadedFiles.length === 0 ? (
            <p>Aucun fichier disponible.</p>
          ) : (
            uploadedFiles.map((file, index) => <li key={index}>{file}</li>)
          )}
        </ul>
      </div>
    </div>
  );
};

export default Fichier;
