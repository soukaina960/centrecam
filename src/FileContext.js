import React, { createContext, useState, useEffect } from "react";

export const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/files");
      if (!response.ok) throw new Error("Erreur lors de la récupération des fichiers");
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error("Erreur lors du chargement des fichiers:", error);
      setError("Erreur lors du chargement des fichiers. Veuillez réessayer.");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFileOrder = async (updatedFiles) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/update-file-order", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ files: updatedFiles }),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour de l'ordre des fichiers");
      setFiles(updatedFiles);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'ordre des fichiers:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <FileContext.Provider value={{ files, loading, error, fetchFiles, updateFileOrder }}>
      {children}
    </FileContext.Provider>
  );
};