import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import "../pages/Lycee.css";

const Lycee = () => {
  const [files, setFiles] = useState({});
  const [classSelect, setClassSelect] = useState("");
  const [subject, setSubject] = useState("");

  // Matières du lycée
  const subjects = [
    "Mathématiques",
    "Physique-Chimie",
    "SVT",
    "Français",
    "Philosophie",
    "Histoire-Géo",
    "Anglais",
    "Économie",
  ];

  useEffect(() => {
    if (classSelect && subject) {
      fetchFiles();
    } else {
      setFiles({});
    }
  }, [classSelect, subject]);

  const fetchFiles = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/files");
      const data = await response.json();

      const filteredFiles = data.filter(
        (file) =>
          file.level === "lycee" &&
          (!classSelect || file.class === classSelect) &&
          (!subject || file.subject === subject)
      );

      // Regrouper les fichiers par leçon (normalisation pour éviter les doublons)
      const groupedFiles = filteredFiles.reduce((acc, file) => {
        const lessonKey = file.lesson?.trim().toLowerCase(); // Vérification et normalisation
        if (lessonKey) {
          if (!acc[lessonKey]) {
            acc[lessonKey] = { title: file.lesson.trim(), files: [] };
          }
          acc[lessonKey].files.push(file);
        }
        return acc;
      }, {});

      setFiles(groupedFiles);
    } catch (error) {
      console.error("Erreur lors du chargement des fichiers:", error);
      setFiles({});
    }
  };

  return (
    <div className="lycee-container">
      <Header />
      <Navigation />
      <h1>Lycée</h1>
      <p>Contenu pour les élèves du lycée.</p>

      <div className="filters">
        <label>Classe :</label>
        <select value={classSelect} onChange={(e) => setClassSelect(e.target.value)}>
          <option value="">Sélectionner une classe</option>
          <option value="1bac">1ère Année Bac</option>
          <option value="2bac">2ème Année Bac</option>
        </select>

        <label>Matière :</label>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">Sélectionner une matière</option>
          {subjects.map((matiere) => (
            <option key={matiere} value={matiere}>
              {matiere}
            </option>
          ))}
        </select>
      </div>

      <h3>Fichiers disponibles :</h3>
      {Object.keys(files || {}).length > 0 ? (
        <div className="lesson-list">
          {Object.values(files || {}).map(({ title, files }) => (
            <div key={title} className="lesson">
              <h4 className="lesson-title">{title}</h4>
              <ul>
                {files.map((file) => (
                  <li key={file.id}>
                    <a href={`http://127.0.0.1:8000/storage/${file.path}`} download>
                      {file.name}
                    </a>{" "}
                    ({file.course_type})
                    {file.youtube_link && (
                      <div>
                        <a href={file.youtube_link} target="_blank" rel="noopener noreferrer">
                          Voir la correction sur YouTube
                        </a>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucun fichier disponible.</p>
      )}
    </div>
  );
};

export default Lycee;
