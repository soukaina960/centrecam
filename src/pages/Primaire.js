import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import "./primaire.css";

const Primaire = () => {
  const [files, setFiles] = useState([]);
  const [classSelect, setClassSelect] = useState("");
  const [subject, setSubject] = useState("");

  // Matières du primaire
  const subjects = ["Mathématiques", "Français", "Arabe", "Sciences", "Histoire-Géo"];

  useEffect(() => {
    fetchFiles();
  }, [classSelect, subject]);

  const fetchFiles = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/files");
      const data = await response.json();
      const filteredFiles = data.filter(
        (file) => file.level === "primaire" && file.class === classSelect && file.subject === subject
      );

      // Regrouper les fichiers par leçon
      const groupedFiles = filteredFiles.reduce((acc, file) => {
        if (!acc[file.lesson]) {
          acc[file.lesson] = [];
        }
        acc[file.lesson].push(file);
        return acc;
      }, {});

      setFiles(groupedFiles);
    } catch (error) {
      console.error("Erreur lors du chargement des fichiers:", error);
    }
  };

  return (
    <div className="primaire-container">
      <Header />
      <Navigation />
      <h1>Primaire</h1>
      <p>Contenu pour les élèves du primaire.</p>

      <div className="filters">
        <label>Classe :</label>
        <select value={classSelect} onChange={(e) => setClassSelect(e.target.value)}>
          <option value="">Sélectionner une classe</option>
          <option value="1er">1ère Année</option>
          <option value="2eme">2ème Année</option>
          <option value="3eme">3ème Année</option>
          <option value="4eme">4ème Année</option>
          <option value="5eme">5ème Année</option>
          <option value="6eme">6ème Année</option>
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
      {Object.keys(files).length > 0 ? (
        <div className="lesson-list">
          {Object.entries(files).map(([lesson, lessonFiles]) => (
            <div key={lesson} className="lesson">
              <h4 className="lesson-title">{lesson}</h4>
              <ul>
                {lessonFiles.map((file) => (
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

export default Primaire;
