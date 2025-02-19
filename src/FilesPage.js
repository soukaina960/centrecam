import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FilesPage = () => {
  const location = useLocation();
  const { level, subject } = location.state || { level: '', subject: '' };
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [classSelect, setClassSelect] = useState('');
  const [courseType, setCourseType] = useState('cours');
  const [lesson, setLesson] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (level && subject) {
      fetchFiles();
    } else {
      navigate('/selection'); // Rediriger si aucune sélection n'est faite
    }
  }, [level, subject, navigate]);

  const fetchFiles = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/files?level=${level}&subject=${subject}`
      );
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Erreur lors du chargement des fichiers:', error);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!file || !classSelect || !lesson) {
      setError('Veuillez sélectionner un fichier, une classe et une leçon.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('level', level);
    formData.append('class', classSelect);
    formData.append('subject', subject);
    formData.append('course_type', courseType);
    formData.append('lesson', lesson);
    formData.append('youtube_link', youtubeLink);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSuccessMessage('Fichier téléchargé avec succès !');
        fetchFiles();
      } else {
        setError('Erreur lors du téléchargement.');
      }
    } catch (error) {
      setError('Erreur lors du téléchargement: ' + error.message);
    }
  };

  return (
    <div className="files-page">
      <h1>Fichiers pour {subject} ({level})</h1>

      <form onSubmit={handleFileUpload}>
        <div className="form-group">
          <label>Classe :</label>
          <select value={classSelect} onChange={(e) => setClassSelect(e.target.value)} required>
            <option value="">Sélectionnez une classe</option>
            {['1er', '2eme', '3eme', '4eme', '5eme', '6eme'].map((classe) => (
              <option key={classe} value={classe}>
                {classe}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Type de cours :</label>
          <select value={courseType} onChange={(e) => setCourseType(e.target.value)} required>
            <option value="cours">Cours</option>
            <option value="exercice">Exercice</option>
          </select>
        </div>

        <div className="form-group">
          <label>Leçon :</label>
          <input
            type="text"
            value={lesson}
            onChange={(e) => setLesson(e.target.value)}
            placeholder="Nom de la leçon"
            required
          />
        </div>

        <div className="form-group">
          <label>Sélectionner un fichier :</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        </div>

        <div className="form-group">
          <label>Lien YouTube (facultatif) :</label>
          <input
            type="url"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <button type="submit">Ajouter un fichier</button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <h2>Fichiers disponibles :</h2>
      {files.length > 0 ? (
        <ul>
          {files.map((file) => (
            <li key={file.id}>
              <a href={`http://127.0.0.1:8000/storage/${file.path}`} target="_blank" rel="noopener noreferrer">
                {file.name}
              </a>
              <p>Leçon : {file.lesson}</p>
              <p>Classe : {file.class}</p>
              {file.youtube_link && (
                <a href={file.youtube_link} target="_blank" rel="noopener noreferrer">
                  Voir la vidéo YouTube
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun fichier disponible pour cette matière et ce niveau.</p>
      )}
    </div>
  );
};

export default FilesPage;