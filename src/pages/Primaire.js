import React, { useState, useEffect, useCallback } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import "./primaire.css"; // Utilisation du même fichier CSS

const Primaire = () => {
  const [files, setFiles] = useState({ S1: {}, S2: {} });
  const [classSelect, setClassSelect] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const subjects = ["Mathématiques", "Français", "Arabe", "Anglais", "Histoire-Géo", "Sciences"];

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/files");
      if (!response.ok) throw new Error("Erreur lors de la récupération des fichiers");
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Données invalides");
      }

      const filteredFiles = data.filter(
        (file) =>
          file.level === "primaire" &&
          (!classSelect || file.class === classSelect) &&
          (!subject || file.subject === subject)
      );

      const groupedFiles = { S1: {}, S2: {} };

      filteredFiles.forEach((file) => {
        const semester = file.category && file.category.toUpperCase() === "S2" ? "S2" : "S1";
        const lessonKey = file.lesson?.trim().toLowerCase();

        if (lessonKey) {
          if (!groupedFiles[semester][lessonKey]) {
            groupedFiles[semester][lessonKey] = {
              title: file.lesson.trim(),
              courses: [],
              exercises: [],
              youtube_link: file.youtube_link || null,
            };
          }

          if (file.course_type === "cours") {
            groupedFiles[semester][lessonKey].courses.push(file);
          } else if (file.course_type === "exercice") {
            groupedFiles[semester][lessonKey].exercises.push(file);
          }
        }
      });

      setFiles(groupedFiles);
    } catch (error) {
      console.error("Erreur lors du chargement des fichiers:", error);
      setError("Erreur lors du chargement des fichiers. Veuillez réessayer.");
      setFiles({ S1: {}, S2: {} });
    } finally {
      setLoading(false);
    }
  }, [classSelect, subject]);

  useEffect(() => {
    if (classSelect && subject) {
      fetchFiles();
    } else {
      setFiles({ S1: {}, S2: {} });
    }
  }, [classSelect, subject, fetchFiles]);

  const handleLessonClick = useCallback((title) => {
    setSelectedLesson((prev) => (prev === title ? null : title));
    setSelectedCourse(null);
    setSelectedExercise(null);
  }, []);

  const handleCourseClick = useCallback((title) => {
    setSelectedCourse((prev) => (prev === title ? null : title));
  }, []);

  const handleExerciseClick = useCallback((title) => {
    setSelectedExercise((prev) => (prev === title ? null : title));
  }, []);

  return (
    <div className="primaire">
      <Header />
      <Navigation />
      <div className="primaire-container">
        <h1>Primaire</h1>
        <p>Contenu pour les élèves du primaire.</p>

        <div className="filters">
          <label>Classe :</label>
          <select value={classSelect} onChange={(e) => setClassSelect(e.target.value)}>
            <option value="">Sélectionner une classe</option>
            <option value="1er">1ère Année </option>
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

        {loading ? (
          <p>Chargement des fichiers...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            {["S1", "S2"].map((semester) => (
              Object.keys(files[semester]).length > 0 && (
                <div key={semester}>
                  <h2>📌 Semestre {semester === "S1" ? "1" : "2"}</h2>
                  <div className="lesson-list">
                    {Object.values(files[semester]).map(({ title, courses, exercises, youtube_link }) => (
                      <div key={title} className="lesson">
                        <h4 className="lesson-title" onClick={() => handleLessonClick(title)}>
                          {title}
                        </h4>
                        {selectedLesson === title && (
                          <div>
                            {youtube_link && (
                              <div>
                                <h5>📺 Vidéo :</h5>
                                <a href={youtube_link} target="_blank" rel="noopener noreferrer">Voir la vidéo</a>
                              </div>
                            )}

                            {courses.length > 0 && (
                              <div>
                                <h5 onClick={() => handleCourseClick(title)}>📘 Cours :</h5>
                                {selectedCourse === title && (
                                  <ul>
                                    {courses.map((file) => (
                                      <li key={file.id}>
                                        <a href={`http://127.0.0.1:8000/storage/${file.path}`} download>
                                          {file.name}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}

                            {exercises.length > 0 && (
                              <div>
                                <h5 onClick={() => handleExerciseClick(title)}>📝 Exercices :</h5>
                                {selectedExercise === title && (
                                  <ul>
                                    {exercises.map((file) => (
                                      <li key={file.id}>
                                        <a href={`http://127.0.0.1:8000/storage/${file.path}`} download>
                                          {file.name}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(Primaire);


