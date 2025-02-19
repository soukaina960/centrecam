import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import "./primaire.css";

const College = () => {
  const [files, setFiles] = useState({});
  const [classSelect, setClassSelect] = useState("");
  const [subject, setSubject] = useState("");

  // Matières du collège
  const subjects = ['Mathématiques', 'Physique', 'SVT', 'Français', 'Arabe', 'Anglais', 'Histoire-Géo'];



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
          file.level === "college" &&
          (!classSelect || file.class === classSelect) &&
          (!subject || file.subject === subject)
      );

      // Regrouper les fichiers par leçon (en ignorant les espaces et les majuscules)
      const groupedFiles = filteredFiles.reduce((acc, file) => {
        const lessonKey = file.lesson?.trim().toLowerCase(); // Vérification de `file.lesson`
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
      setFiles({}); // Évite un état undefined en cas d'erreur
    }
  };

  return (
    <div className="primaire-container">
      <Header />
      <Navigation />
      <h1>Collège</h1>
      <p>Contenu pour les élèves du collège.</p>

      <div className="filters">
        <label>Classe :</label>
        <select value={classSelect} onChange={(e) => setClassSelect(e.target.value)}>
          <option value="">Sélectionner une classe</option>
          <option value="1ac">1ère Année</option>
          <option value="2ac">2ème Année</option>
          <option value="3ac">3ème Année</option>
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

export default College;
