import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { FaCalculator, FaBookOpen, FaLanguage, FaFlask, FaGlobe } from "react-icons/fa"; // Importer les icônes
import Select from "react-select";

import "./primaire.css";
const Primaire = () => {
  const [files, setFiles] = useState([]);
  const [classSelect, setClassSelect] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");

  // Matières du primaire avec des icônes FontAwesome
  const subjects = [
    { value: "Mathématiques", label: "Mathématiques", icon: <FaCalculator /> },
    { value: "Français", label: "Français", icon: <FaBookOpen /> },
    { value: "Arabe", label: "Arabe", icon: <FaLanguage /> },
    { value: "Sciences", label: "Sciences", icon: <FaFlask /> },
    { value: "Histoire-Géo", label: "Histoire-Géo", icon: <FaGlobe /> },
  ];

  // Classes
  const classes = [
    { value: "1er", label: "1ère Année" },
    { value: "2eme", label: "2ème Année" },
    { value: "3eme", label: "3ème Année" },
    { value: "4eme", label: "4ème Année" },
    { value: "5eme", label: "5ème Année" },
    { value: "6eme", label: "6ème Année" },
  ];

  // Catégories
  const categories = [
    { value: "S1", label: "S1" },
    { value: "S2", label: "S2" },
    { value: "S3", label: "S3" },
    { value: "S4", label: "S4" },
  ];

  useEffect(() => {
    fetchFiles();
  }, [classSelect, subject, category]);

  const fetchFiles = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/files");
      const data = await response.json();
      const filteredFiles = data.filter(
        (file) =>
          file.level === "primaire" &&
          file.class === classSelect &&
          file.subject === subject &&
          file.category === category
      );

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
      <Header/>
      <Navigation />
      <h1>Primaire</h1>
      <p>Contenu pour les élèves du primaire.</p>

      <div className="filters">
        <label>Classe :</label>
        <Select
          value={classes.find((classe) => classe.value === classSelect)}
          onChange={(selectedOption) => setClassSelect(selectedOption.value)}
          options={classes}
          placeholder="Sélectionner une classe"
        />

        <label>Matière :</label>
        <Select
          value={subjects.find((subject) => subject.value === subject)}
          onChange={(selectedOption) => setSubject(selectedOption.value)}
          options={subjects}
          getOptionLabel={(e) => (
            <div>
              {e.icon} {e.label}
            </div>
          )}
          placeholder="Sélectionner une matière"
        />

        <label>Catégorie :</label>
        <Select
          value={categories.find((cat) => cat.value === category)}
          onChange={(selectedOption) => setCategory(selectedOption.value)}
          options={categories}
          placeholder="Sélectionner une catégorie"
        />
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
