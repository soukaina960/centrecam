import React, { useState, useEffect, useCallback } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import "./primaire.css";
import { useNavigate } from "react-router-dom";

const Lycee = () => {
  const [files, setFiles] = useState({ S1: {}, S2: {} });
  const [classSelect, setClassSelect] = useState("");
  const [filiere, setFiliere] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState({});
  const navigate = useNavigate();

  // Données des matières
  const subjects = {
    lycee: {
      tc: {
        filieres: ["Sciences", "Technologies", "Lettres et Sciences Humaines"],
        matieres: {
          Sciences: ["Mathématiques", "Physique et chimie", "SVT", "Français", "Arabe", "Anglais", "Philosophie", "Histoire-Géographie", "education islamique"],
          Technologies: ["Physique et chimie", "SVT", "Mathématiques", "Français", "Arabe", "Philosophie", "Anglais", "Histoire-Géographie", "education islamique"],
          "Lettres et Sciences Humaines": ["Philosophie", "Mathématiques", "SVT", "Français", "Arabe", "Anglais", "Histoire-Géographie", "education islamique"],
        },
      },
      bac1: {
        filieres: ["Sciences Mathématiques", "Sciences Expérimentales", "Sciences Économiques et Gestion", "Lettres et Sciences Humaines"],
        matieres: {
          "Sciences Mathématiques": ["Mathématiques", "Physique et chimie", "SVT", "Français", "Arabe", "Anglais", "Philosophie", "Histoire-Géographie", "education islamique"],
          "Sciences Expérimentales": ["Physique et chimie", "SVT", "Mathématiques", "Français", "Arabe", "Anglais", "Philosophie", "Histoire-Géographie", "education islamique"],
          "Sciences Économiques et Gestion": ["Économie", "Gestion", "Comptabilité", "Mathématiques", "Français", "Arabe", "Anglais", "Histoire-Géographie", "education islamique"],
          "Lettres et Sciences Humaines": ["Philosophie", "Mathématiques", "Histoire", "Géographie", "Français", "Arabe", "Anglais", "Histoire-Géographie", "education islamique"],
        },
      },
      bac2: {
        filieres: ["Mathématiques A", "Mathématiques B", "Sciences Physiques", "Sciences de la Vie et de la Terre (SVT)", "Sciences Économiques", "Lettres et Sciences Humaines", "Sciences de Gestion Comptable (SGC)"],
        matieres: {
          "Mathématiques A": ["Mathématiques", "Physique et chimie", "SVT", "Français", "Arabe", "Anglais", "education islamique"],
          "Mathématiques B": ["Mathématiques", "Physique et chimie", "Sciences de l'ingenieur", "Français", "Arabe", "Anglais", "education islamique"],
          "Sciences Physiques": ["Mathématiques", "Physique et chimie", "SVT", "Français", "Arabe", "Anglais", "education islamique"],
          "Sciences de la Vie et de la Terre (SVT)": ["Mathématiques", "Physique et chimie", "SVT", "Français", "Arabe", "Anglais", "education islamique"],
          "Sciences Économiques": ["Économie et Organisation Administrative des Entreprises", "Comptabilité et Mathématiques financières", "Philosophie", "Français", "Histoire Géographie", "Arabe", "Anglais", "education islamique", "Mathématiques"],
          "Lettres": ["Philosophie", "Français", "Histoire Géographie", "Arabe", "Anglais", "education islamique", "Mathématiques"],
          "Sciences Humaines": ["Philosophie", "Français", "Histoire Géographie", "Arabe", "Anglais", "education islamique", "Mathématiques"],
          "Sciences de Gestion Comptable (SGC)": ["Mathématiques", "Français", "Arabe", "Anglais", "education islamique", "Économie et Organisation Administrative des Entreprises", "Comptabilité et Mathématiques financières", "Philosophie", "Français", "Histoire Géographie"],
        },
      },
    },
  };

  // Récupérer les fichiers depuis l'API
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
          file.level === "lycee" &&
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
              series: [],
              devoir1: [],
              devoir2: [],
              devoir3: [],
              examlocal: [],
              examregional: [],
              examnational: [],
              concours: [],
              conseils: [],
              youtube_link: file.youtube_link || null,
            };
          }

          switch (file.course_type) {
            case "cours":
              groupedFiles[semester][lessonKey].courses.push(file);
              break;
            case "serie":
              groupedFiles[semester][lessonKey].series.push(file);
              break;
            case "devoir1":
              groupedFiles[semester][lessonKey].devoir1.push(file);
              break;
            case "devoir2":
              groupedFiles[semester][lessonKey].devoir2.push(file);
              break;
            case "devoir3":
              groupedFiles[semester][lessonKey].devoir3.push(file);
              break;
            case "examlocal":
              groupedFiles[semester][lessonKey].examlocal.push(file);
              break;
            case "examregional":
              groupedFiles[semester][lessonKey].examregional.push(file);
              break;
            case "examnational":
              groupedFiles[semester][lessonKey].examnational.push(file);
              break;
            case "concours":
              groupedFiles[semester][lessonKey].concours.push(file);
              break;
            case "conseils":
              groupedFiles[semester][lessonKey].conseils.push(file);
              break;
            default:
              break;
          }
        }
      });

      setFiles(groupedFiles); // Mettre à jour l'état `files`
    } catch (error) {
      console.error("Erreur lors du chargement des fichiers:", error);
      setError("Erreur lors du chargement des fichiers. Veuillez réessayer.");
      setFiles({ S1: {}, S2: {} }); // Réinitialiser l'état en cas d'erreur
    } finally {
      setLoading(false); // Arrêter le chargement
    }
  }, [classSelect, subject]);

  // Charger les fichiers lorsque la classe, la filière ou la matière change
  useEffect(() => {
    if (classSelect && filiere && subject) {
      fetchFiles();
    } else {
      setFiles({ S1: {}, S2: {} });
    }
  }, [classSelect, filiere, subject, fetchFiles]);

  // Gestion des sections cliquées
  const handleSectionClick = (section, title) => {
    setSelectedSection((prev) => ({
      ...prev,
      [section]: prev[section] === title ? null : title,
    }));
  };

  // Ouvrir un fichier avec Google Drive
  const handleFileClick = (file) => {
    const fileType = getFileType(file.name);
    const fileUrl = `http://127.0.0.1:8000/storage/${file.path}`;

    if (fileType === "pdf" || fileType === "doc" || fileType === "docx") {
      const googleDriveUrl = `https://drive.google.com/viewerng/viewer?url=${encodeURIComponent(fileUrl)}`;
      window.open(googleDriveUrl, "_blank");
    } else {
      navigate(`/file-preview?filePath=${file.path}&fileType=${fileType}`);
    }
  };

  // Déterminer le type de fichier
  const getFileType = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
      return "image";
    } else if (ext === "pdf") {
      return "pdf";
    } else if (["doc", "docx"].includes(ext)) {
      return "doc";
    }
    return "unknown";
  };

  return (
    <div className="primaire">
      <Header />
      <Navigation />
      <div className="primaire-container">
        <h1>Lycée</h1>
        <p>Contenu pour les élèves du lycée.</p>

        <div className="filters">
          <label>Classe :</label>
          <select value={classSelect} onChange={(e) => setClassSelect(e.target.value)}>
            <option value="">Sélectionner une classe</option>
            <option value="tc">TC</option>
            <option value="bac1">1Bac</option>
            <option value="bac2">2Bac</option>
          </select>

          {classSelect && subjects.lycee[classSelect]?.filieres?.length > 0 && (
            <>
              <label>Filière :</label>
              <select value={filiere} onChange={(e) => setFiliere(e.target.value)}>
                <option value="">Sélectionner une filière</option>
                {subjects.lycee[classSelect].filieres.map((filiere) => (
                  <option key={filiere} value={filiere}>
                    {filiere}
                  </option>
                ))}
              </select>
            </>
          )}

          <label>Matière :</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">Sélectionner une matière</option>
            {filiere &&
              subjects.lycee[classSelect]?.matieres[filiere]?.map((matiere) => (
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
                    {Object.values(files[semester]).map(({ title, courses, series, devoir1, devoir2, devoir3, examlocal, examregional, examnational, concours, conseils, youtube_link }) => (
                      <div key={title} className="lesson">
                        <h4 className="lesson-title" onClick={() => handleSectionClick("lesson", title)}>
                          {title}
                        </h4>
                        {selectedSection.lesson === title && (
                          <div>
                            {courses.length > 0 && (
                              <FileSection
                                title="📘 Cours"
                                files={courses}
                                sectionKey="courses"
                                selectedSection={selectedSection}
                                handleSectionClick={handleSectionClick}
                                handleFileClick={handleFileClick}
                              />
                            )}
                            {series.length > 0 && (
                              <FileSection
                                title="📝 Séries"
                                files={series}
                                sectionKey="series"
                                selectedSection={selectedSection}
                                handleSectionClick={handleSectionClick}
                                handleFileClick={handleFileClick}
                              />
                            )}
                            {devoir1.length > 0 && (
                              <FileSection
                                title="📝 Devoir 1"
                                files={devoir1}
                                sectionKey="devoir1"
                                selectedSection={selectedSection}
                                handleSectionClick={handleSectionClick}
                                handleFileClick={handleFileClick}
                              />
                            )}
                            {devoir2.length > 0 && (
                              <FileSection
                                title="📝 Devoir 2"
                                files={devoir2}
                                sectionKey="devoir2"
                                selectedSection={selectedSection}
                                handleSectionClick={handleSectionClick}
                                handleFileClick={handleFileClick}
                              />
                            )}
                            {devoir3.length > 0 && (
                              <FileSection
                                title="📝 Devoir 3"
                                files={devoir3}
                                sectionKey="devoir3"
                                selectedSection={selectedSection}
                                handleSectionClick={handleSectionClick}
                                handleFileClick={handleFileClick}
                              />
                            )}
                            {examlocal.length > 0 && (
                              <FileSection
                                title="📝 Examens Locaux"
                                files={examlocal}
                                sectionKey="examlocal"
                                selectedSection={selectedSection}
                                handleSectionClick={handleSectionClick}
                                handleFileClick={handleFileClick}
                              />
                            )}
                            {examregional.length > 0 && (
                              <FileSection
                                title="📝 Examens Régionaux"
                                files={examregional}
                                sectionKey="examregional"
                                selectedSection={selectedSection}
                                handleSectionClick={handleSectionClick}
                                handleFileClick={handleFileClick}
                              />
                            )}
                            {examnational.length > 0 && (
                              <FileSection
                                title="📝 Examens Nationaux"
                                files={examnational}
                                sectionKey="examnational"
                                selectedSection={selectedSection}
                                handleSectionClick={handleSectionClick}
                                handleFileClick={handleFileClick}
                              />
                            )}
                            {concours.length > 0 && (
                              <FileSection
                                title="📝 Concours"
                                files={concours}
                                sectionKey="concours"
                                selectedSection={selectedSection}
                                handleSectionClick={handleSectionClick}
                                handleFileClick={handleFileClick}
                              />
                            )}
                            {conseils.length > 0 && (
                              <FileSection
                                title="📝 Conseils"
                                files={conseils}
                                sectionKey="conseils"
                                selectedSection={selectedSection}
                                handleSectionClick={handleSectionClick}
                                handleFileClick={handleFileClick}
                              />
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

// Composant réutilisable pour afficher une section de fichiers
const FileSection = ({ title, files, sectionKey, selectedSection, handleSectionClick, handleFileClick }) => (
  <div>
    <h5 onClick={() => handleSectionClick(sectionKey, title)} style={{ cursor: "pointer" }}>
      {title}
    </h5>
    {selectedSection[sectionKey] === title && (
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            <a
              href={`http://127.0.0.1:8000/storage/${file.path}`}
              download
              onClick={(e) => {
                e.preventDefault();
                handleFileClick(file);
              }}
              style={{ display: "block", marginBottom: "10px" }}
            >
              {file.name}
            </a>
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
    )}
  </div>
);

export default React.memo(Lycee);
import React, { useState, useEffect, useCallback } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import "./primaire.css";
import { useNavigate } from "react-router-dom";

const Lycee = () => {
  const [files, setFiles] = useState({ S1: {}, S2: {}, concours: {} }); // Initialisation correcte de `files`
  const [classSelect, setClassSelect] = useState("");
  const [filiere, setFiliere] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDevoir1, setSelectedDevoir1] = useState(null);
  const [selectedDevoir2, setSelectedDevoir2] = useState(null);
  const [selectedDevoir3, setSelectedDevoir3] = useState(null);
  const [selectedExamlocal, setSelectedExamlocal] = useState(null);
  const [selectedExamregional, setSelectedExamregional] = useState(null);
  const [selectedExamnational, setSelectedExamnational] = useState(null);
  const [selectedConcours, setSelectedConcours] = useState(null);
  const [selectedConseils, setSelectedConseils] = useState(null);
  const navigate = useNavigate();

  // Données des matières par classe et filière
  const subjects = {
    tc: {
      filieres: ["Sciences", "Technologies", "Lettres et Sciences Humaines"],
      matieres: {
        Sciences: ["Mathématiques", "Physique et chimie", "SVT", "Français", "Arabe", "Anglais", "Philosophie", "Histoire-Géographie", "education islamique"],
        Technologies: ["Physique et chimie", "SVT", "Mathématiques", "Français", "Arabe", "Philosophie", "Anglais", "Histoire-Géographie", "education islamique"],
        "Lettres et Sciences Humaines": ["Philosophie", "Mathématiques", "SVT", "Français", "Arabe", "Anglais", "Histoire-Géographie", "education islamique"],
      },
    },
    bac1: {
      filieres: ["Sciences Mathématiques", "Sciences Expérimentales", "Sciences Économiques et Gestion", "Lettres et Sciences Humaines"],
      matieres: {
        "Sciences Mathématiques": ["Mathématiques", "Physique et chimie", "SVT", "Français", "Arabe", "Anglais", "Philosophie", "Histoire-Géographie", "education islamique"],
        "Sciences Expérimentales": ["Physique et chimie", "SVT", "Mathématiques", "Français", "Arabe", "Anglais", "Philosophie", "Histoire-Géographie", "education islamique"],
        "Sciences Économiques et Gestion": ["Économie", "Gestion", "Comptabilité", "Mathématiques", "Français", "Arabe", "Anglais", "Histoire-Géographie", "education islamique"],
        "Lettres et Sciences Humaines": ["Philosophie", "Mathématiques", "Histoire", "Géographie", "Français", "Arabe", "Anglais", "Histoire-Géographie", "education islamique"],
      },
    },
    bac2: {
      filieres: ["Sciences Mathématiques A", "Sciences Mathématiques B", "Sciences Physiques", "Sciences de la Vie et de la Terre (SVT)", "Sciences Économiques", "Lettres", "Sciences Humaines", "Sciences de Gestion Comptable (SGC)"],
      matieres: {
        "Sciences Mathématiques A": ["Mathématiques", "Physique et chimie", "SVT", "Français", "Arabe", "Anglais", "education islamique"],
        "Sciences Mathématiques B": ["Mathématiques", "Physique et chimie", "Sciences de l'ingenieur", "Français", "Arabe", "Anglais", "education islamique"],
        "Sciences Physiques": ["Mathématiques", "Physique et chimie", "SVT", "Français", "Arabe", "Anglais", "education islamique"],
        "Sciences de la Vie et de la Terre (SVT)": ["Mathématiques", "Physique et chimie", "SVT", "Français", "Arabe", "Anglais", "education islamique"],
        "Sciences Économiques": ["Économie et Organisation Administrative des Entreprises", "Comptabilité et Mathématiques financières", "Philosophie", "Français", "Histoire Géographie", "Arabe", "Anglais", "education islamique", "Mathématiques"],
        Lettres: ["Philosophie", "Français", "Histoire Géographie", "Arabe", "Anglais", "education islamique", "Mathématiques"],
        "Sciences Humaines": ["Philosophie", "Français", "Histoire Géographie", "Arabe", "Anglais", "education islamique", "Mathématiques"],
        "Sciences de Gestion Comptable (SGC)": ["Mathématiques", "Français", "Arabe", "Anglais", "education islamique", "Économie et Organisation Administrative des Entreprises", "Comptabilité et Mathématiques financières", "Philosophie", "Français", "Histoire Géographie"],
      },
    },
  };

  // Charger les fichiers en fonction de la classe et de la matière
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

      // Filtrage des fichiers
      const filteredFiles = data.filter(
        (file) =>
          file.level === "lycee" &&
          (!classSelect || file.class === classSelect) &&
          (!filiere || file.filiere === filiere) &&
          (!subject || file.subject === subject)
      );

      console.log("Fichiers filtrés :", filteredFiles); // Log de débogage

      // Regroupement des fichiers par semestre et par leçon
      const groupedFiles = { S1: {}, S2: {}, concours: {} };

      filteredFiles.forEach((file) => {
        const semester = file.category && file.category.toUpperCase() === "S2" ? "S2" : "S1";
        const lessonKey = file.lesson?.trim().toLowerCase();

        if (lessonKey) {
          if (!groupedFiles[semester][lessonKey]) {
            groupedFiles[semester][lessonKey] = {
              title: file.lesson.trim(),
              courses: [],
              series: [],
              devoir1: [],
              devoir2: [],
              devoir3: [],
              examlocal: [],
              examregional: [],
              examnational: [],
              concours: [],
              conseils: [],
              youtube_link: file.youtube_link || null,
            };
          }

          switch (file.course_type) {
            case "cours":
              groupedFiles[semester][lessonKey].courses.push(file);
              break;
            case "serie":
              groupedFiles[semester][lessonKey].series.push(file);
              break;
            case "devoir1":
              groupedFiles[semester][lessonKey].devoir1.push(file);
              break;
            case "devoir2":
              groupedFiles[semester][lessonKey].devoir2.push(file);
              break;
            case "devoir3":
              groupedFiles[semester][lessonKey].devoir3.push(file);
              break;
            case "examlocal":
              groupedFiles[semester][lessonKey].examlocal.push(file);
              break;
            case "examregional":
              groupedFiles[semester][lessonKey].examregional.push(file);
              break;
            case "examnational":
              groupedFiles[semester][lessonKey].examnational.push(file);
              break;
            case "concours":
              groupedFiles[semester][lessonKey].concours.push(file);
              // Ajouter également à la catégorie "concours"
              if (!groupedFiles.concours[lessonKey]) {
                groupedFiles.concours[lessonKey] = {
                  title: file.lesson.trim(),
                  concours: [],
                };
              }
              groupedFiles.concours[lessonKey].concours.push(file);
              break;
            case "conseils":
              groupedFiles[semester][lessonKey].conseils.push(file);
              break;
            default:
              break;
          }
        }
      });

      console.log("Fichiers groupés :", groupedFiles); // Log de débogage

      setFiles(groupedFiles);
    } catch (error) {
      console.error("Erreur lors du chargement des fichiers:", error);
      setError("Erreur lors du chargement des fichiers. Veuillez réessayer.");
      setFiles({ S1: {}, S2: {}, concours: {} }); // Réinitialisation en cas d'erreur
    } finally {
      setLoading(false);
    }
  }, [classSelect, filiere, subject]);

  // Charger les fichiers lorsque la classe ou la matière change
  useEffect(() => {
    if (classSelect && subject) {
      fetchFiles();
    } else {
      setFiles({ S1: {}, S2: {}, concours: {} }); // Réinitialisation si les filtres ne sont pas valides
    }
  }, [classSelect, subject, fetchFiles]);

  // Gestion des clics sur les éléments
  const handleLessonClick = useCallback((title) => {
    setSelectedLesson((prev) => (prev === title ? null : title));
    setSelectedCourse(null);
    setSelectedSeries(null);
    setSelectedDevoir1(null);
    setSelectedDevoir2(null);
    setSelectedDevoir3(null);
    setSelectedExamlocal(null);
    setSelectedExamregional(null);
    setSelectedExamnational(null);
    setSelectedConcours(null);
    setSelectedConseils(null);
  }, []);

  const handleCourseClick = useCallback((title) => {
    setSelectedCourse((prev) => (prev === title ? null : title));
  }, []);

  const handleSeriesClick = useCallback((title) => {
    setSelectedSeries((prev) => (prev === title ? null : title));
  }, []);

  const handleDevoir1Click = useCallback((title) => {
    setSelectedDevoir1((prev) => (prev === title ? null : title));
  }, []);

  const handleDevoir2Click = useCallback((title) => {
    setSelectedDevoir2((prev) => (prev === title ? null : title));
  }, []);

  const handleDevoir3Click = useCallback((title) => {
    setSelectedDevoir3((prev) => (prev === title ? null : title));
  }, []);

  const handleExamlocalClick = useCallback((title) => {
    setSelectedExamlocal((prev) => (prev === title ? null : title));
  }, []);

  const handleExamregionalClick = useCallback((title) => {
    setSelectedExamregional((prev) => (prev === title ? null : title));
  }, []);

  const handleExamnationalClick = useCallback((title) => {
    setSelectedExamnational((prev) => (prev === title ? null : title));
  }, []);

  const handleConcoursClick = useCallback((title) => {
    setSelectedConcours((prev) => (prev === title ? null : title));
  }, []);

  const handleConseilsClick = useCallback((title) => {
    setSelectedConseils((prev) => (prev === title ? null : title));
  }, []);

  const handleFileClick = (file) => {
    const fileUrl = encodeURIComponent(`http://127.0.0.1:8000/storage/${file.path}`);
    const googleDriveViewerUrl = `https://drive.google.com/viewerng/viewer?url=${fileUrl}`;
    window.open(googleDriveViewerUrl, "_blank");
  };

  return (
    <div className="primaire">
      <Header />
      <Navigation />
      <div className="primaire-container">
        <h1>Lycée</h1>
        <p>Contenu pour les élèves du lycée.</p>

        {/* Filtres pour la classe, la filière et la matière */}
        <div className="filters">
          <label>Classe :</label>
          <select
            value={classSelect}
            onChange={(e) => {
              setClassSelect(e.target.value);
              setFiliere("");
              setSubject("");
            }}
          >
            <option value="">Sélectionner une classe</option>
            <option value="tc">TC</option>
            <option value="bac1">1Bac</option>
            <option value="bac2">2Bac</option>
          </select>

          {classSelect && subjects[classSelect]?.filieres?.length > 0 && (
            <>
              <label>Filière :</label>
              <select
                value={filiere}
                onChange={(e) => {
                  setFiliere(e.target.value);
                  setSubject("");
                }}
              >
                <option value="">Sélectionner une filière</option>
                {subjects[classSelect].filieres.map((filiere) => (
                  <option key={filiere} value={filiere}>
                    {filiere}
                  </option>
                ))}
              </select>
            </>
          )}

          {filiere && subjects[classSelect]?.matieres[filiere]?.length > 0 && (
            <>
              <label>Matière :</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="">Sélectionner une matière</option>
                {subjects[classSelect].matieres[filiere].map((matiere) => (
                  <option key={matiere} value={matiere}>
                    {matiere}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        {loading ? (
          <p>Chargement des fichiers...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            {/* Section Semestre 1 */}
            {files.S1 && Object.keys(files.S1).length > 0 && (
              <div>
                <h2>📌 Semestre 1</h2>
                <div className="lesson-list">
                  {Object.values(files.S1).map(
                    ({
                      title,
                      courses,
                      series,
                      devoir1,
                      devoir2,
                      devoir3,
                      examlocal,
                      examregional,
                      examnational,
                      concours,
                      conseils,
                      youtube_link,
                    }) => (
                      <div key={title} className="lesson">
                        <h4
                          className="lesson-title"
                          onClick={() => handleLessonClick(title)}
                        >
                          {title}
                        </h4>
                        {selectedLesson === title && (
                          <div>
                            {/* Afficher les cours, séries, devoirs, examens, etc. */}
                            {courses.length > 0 && (
                              <div>
                                <h5
                                  onClick={() => handleCourseClick(title)}
                                  style={{ cursor: "pointer" }}
                                >
                                  📘 Cours :
                                </h5>
                                {selectedCourse === title && (
                                  <ul>
                                    {courses.map((file) => (
                                      <li key={file.id}>
                                        <a
                                          href="#"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleFileClick(file);
                                          }}
                                          style={{
                                            display: "block",
                                            marginBottom: "10px",
                                            cursor: "pointer",
                                          }}
                                        >
                                          {file.name}
                                        </a>
                                        {file.youtube_link && (
                                          <div>
                                            <a
                                              href={file.youtube_link}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              Voir l'explication sur YouTube
                                            </a>
                                          </div>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}

                            {/* Afficher les séries */}
                            {series.length > 0 && (
                              <div>
                                <h5
                                  onClick={() => handleSeriesClick(title)}
                                  style={{ cursor: "pointer" }}
                                >
                                  📝 Séries :
                                </h5>
                                {selectedSeries === title && (
                                  <ul>
                                    {series.map((file) => (
                                      <li key={file.id}>
                                        <a
                                          href="#"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleFileClick(file);
                                          }}
                                          style={{
                                            display: "block",
                                            marginBottom: "10px",
                                            cursor: "pointer",
                                          }}
                                        >
                                          {file.name}
                                        </a>
                                        {file.youtube_link && (
                                          <div>
                                            <a
                                              href={file.youtube_link}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              Voir la correction de série
                                            </a>
                                          </div>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}

                            {/* Afficher les devoirs, examens, etc. */}
                            {/* ... (ajoutez les autres sections ici) ... */}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Section Semestre 2 */}
            {files.S2 && Object.keys(files.S2).length > 0 && (
              <div>
                <h2>📌 Semestre 2</h2>
                <div className="lesson-list">
                  {Object.values(files.S2).map(
                    ({
                      title,
                      courses,
                      series,
                      devoir1,
                      devoir2,
                      devoir3,
                      examlocal,
                      import React, { useState, useEffect, useCallback } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import "./primaire.css";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Configuration de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Primaire = () => {
  const [files, setFiles] = useState({ S1: {}, S2: {} });
  const [classSelect, setClassSelect] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [globalCorrectionCount, setGlobalCorrectionCount] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null); // Pour afficher les fichiers
  const [numPages, setNumPages] = useState(null); // Pour les PDF
  const navigate = useNavigate();

  const subjects = [
    "Mathématiques",
    "Français",
    "Arabe",
    "Anglais",
    "Histoire-Géo",
    "Sciences",
    "education islamique",
  ];

  // Charger les fichiers dès le premier rendu
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

      // Filtrer les fichiers de niveau "primaire"
      const filteredFiles = data.filter((file) => file.level === "primaire");

      // Grouper les fichiers par semestre et leçon
      const groupedFiles = { S1: {}, S2: {} };

      filteredFiles.forEach((file) => {
        const semester = file.category && file.category.toUpperCase() === "S2" ? "S2" : "S1";
        const lessonKey = file.lesson?.trim().toLowerCase();

        if (lessonKey) {
          if (!groupedFiles[semester][lessonKey]) {
            groupedFiles[semester][lessonKey] = {
              title: file.lesson.trim(),
              courses: [],
              series: [],
              devoir1: [],
              devoir2: [],
              devoir3: [],
              examlocal: [],
              examregional: [],
              examnational: [],
              concours: [],
              conseils: [],
              youtube_link: file.youtube_link || null,
            };
          }

          // Ajouter les fichiers en fonction de leur type
          switch (file.course_type) {
            case "cours":
              groupedFiles[semester][lessonKey].courses.push(file);
              break;
            case "serie":
              groupedFiles[semester][lessonKey].series.push(file);
              break;
            case "devoir1":
              groupedFiles[semester][lessonKey].devoir1.push(file);
              break;
            case "devoir2":
              groupedFiles[semester][lessonKey].devoir2.push(file);
              break;
            case "devoir3":
              groupedFiles[semester][lessonKey].devoir3.push(file);
              break;
            case "examlocal":
              groupedFiles[semester][lessonKey].examlocal.push(file);
              break;
            case "examregional":
              groupedFiles[semester][lessonKey].examregional.push(file);
              break;
            case "examnational":
              groupedFiles[semester][lessonKey].examnational.push(file);
              break;
            case "concours":
              groupedFiles[semester][lessonKey].concours.push(file);
              break;
            case "conseils":
              groupedFiles[semester][lessonKey].conseils.push(file);
              break;
            default:
              break;
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
  }, []);

  useEffect(() => {
    fetchFiles(); // Charger les fichiers dès le premier rendu
  }, [fetchFiles]);

  // Gestion des clics sur les leçons, cours, séries, etc.
  const handleLessonClick = useCallback((title) => {
    setSelectedLesson((prev) => (prev === title ? null : title));
    setSelectedCourse(null);
    setSelectedSeries(null);
    setSelectedDevoir1(null);
    setSelectedDevoir2(null);
    setSelectedDevoir3(null);
    setSelectedExamlocal(null);
    setSelectedExamregional(null);
    setSelectedExamnational(null);
    setSelectedConcours(null);
    setSelectedConseils(null);
  }, []);

  const handleCourseClick = useCallback((title) => {
    setSelectedCourse((prev) => (prev === title ? null : title));
  }, []);

  const handleSeriesClick = useCallback((title) => {
    setSelectedSeries((prev) => (prev === title ? null : title));
  }, []);

  const handleDevoir1Click = useCallback((title) => {
    setSelectedDevoir1((prev) => (prev === title ? null : title));
  }, []);

  const handleDevoir2Click = useCallback((title) => {
    setSelectedDevoir2((prev) => (prev === title ? null : title));
  }, []);

  const handleDevoir3Click = useCallback((title) => {
    setSelectedDevoir3((prev) => (prev === title ? null : title));
  }, []);

  const handleExamlocalClick = useCallback((title) => {
    setSelectedExamlocal((prev) => (prev === title ? null : title));
  }, []);

  const handleExamregionalClick = useCallback((title) => {
    setSelectedExamregional((prev) => (prev === title ? null : title));
  }, []);

  const handleExamnationalClick = useCallback((title) => {
    setSelectedExamnational((prev) => (prev === title ? null : title));
  }, []);

  const handleConcoursClick = useCallback((title) => {
    setSelectedConcours((prev) => (prev === title ? null : title));
  }, []);

  const handleConseilsClick = useCallback((title) => {
    setSelectedConseils((prev) => (prev === title ? null : title));
  }, []);

  // Gestion des clics sur les fichiers
  const handleFileClick = (file) => {
    const fileUrl = `http://127.0.0.1:8000/storage/${file.path}`;

    if (file.name.endsWith(".pdf")) {
      setSelectedFile(fileUrl); // Afficher le PDF dans une visionneuse intégrée
    } else if (file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
      window.open(fileUrl, "_blank"); // Ouvrir l'image dans une nouvelle fenêtre
    } else {
      window.open(fileUrl, "_blank"); // Ouvrir les autres fichiers dans une nouvelle fenêtre
    }
  };

  // Fermer la visionneuse de fichiers
  const closeFileViewer = () => {
    setSelectedFile(null);
  };

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
            <option value="">اختر السنة</option>
            <option value="1er">السنة الأولى ابتدائي</option>
            <option value="2eme">السنة الثانية ابتدائي</option>
            <option value="3eme">السنة الثالثة ابتدائي</option>
            <option value="4eme">السنة الرابعة ابتدائي</option>
            <option value="5eme">السنة الخامسة ابتدائي</option>
            <option value="6eme">السنة السادسة ابتدائي</option>
          </select>

          <label>Matière :</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">اختر مادة</option>
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
                    {Object.values(files[semester]).map(({ title, courses, series, devoir1, devoir2, devoir3, examlocal, examregional, examnational, concours, conseils, youtube_link }) => (
                      <div key={title} className="lesson">
                        <h4 className="lesson-title" onClick={() => handleLessonClick(title)}>
                          {title}
                        </h4>
                        {selectedLesson === title && (
                          <div>
                            {/* Afficher les cours, séries, devoirs, etc. */}
                            {courses.length > 0 && (
                              <div>
                                <h5 onClick={() => handleCourseClick(title)} style={{ cursor: "pointer" }}>📘 Cours :</h5>
                                {selectedCourse === title && (
                                  <ul>
                                    {courses.map((file) => (
                                      <li key={file.id}>
                                        <a
                                          href="#"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleFileClick(file);
                                          }}
                                          style={{ display: "block", marginBottom: "10px", cursor: "pointer" }}
                                        >
                                          {file.name}
                                        </a>
                                        {file.youtube_link && (
                                          <div className="youtube-container">
                                            <a
                                              href={file.youtube_link}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              onClick={() => setGlobalCorrectionCount((prev) => prev + 1)}
                                            >
                                              شرح الدرس
                                            </a>
                                          </div>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}
                            {/* Répétez pour les autres types de fichiers */}
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

        {/* Visionneuse de fichiers */}
        {selectedFile && (
          <div className="file-viewer">
            <button onClick={closeFileViewer}>Fermer</button>
            {selectedFile.endsWith(".pdf") ? (
              <Document file={selectedFile} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
                {Array.from(new Array(numPages), (el, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
              </Document>
            ) : (
              <img src={selectedFile} alt="Fichier image" style={{ maxWidth: "100%" }} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Primaire;