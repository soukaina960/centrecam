import React, { useState, useEffect } from "react";
import axios from "axios";

const FileList = ({ className, fileType }) => {
  const [files, setFiles] = useState([]);
  
  // Fonction pour récupérer les fichiers du serveur
  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/files", {
        params: { className, fileType },
      });
      setFiles(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des fichiers", error);
    }
  };

  useEffect(() => {
    if (className && fileType) {
      fetchFiles();
    }
  }, [className, fileType]);

  return (
    <div>
      <h3>Fichiers disponibles pour {className} - {fileType}</h3>
      <ul>
        {files.length === 0 ? (
          <li>Aucun fichier trouvé.</li>
        ) : (
          files.map((file, index) => (
            <li key={index}>
              <a href={`http://localhost:5000/uploads/${className}/${fileType}/${file}`} target="_blank" rel="noopener noreferrer">
                {file}
              </a>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default FileList;
