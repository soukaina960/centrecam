import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Selection.css';

const Selection = () => {
  const location = useLocation();
  const { level } = location.state || { level: 'primaire' };

  const [file, setFile] = useState(null);
  const [classSelect, setClassSelect] = useState('');
  const [subject, setSubject] = useState('');
  const [courseType, setCourseType] = useState('cours');
  const [lesson, setLesson] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [editFile, setEditFile] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [draggedFile, setDraggedFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const classes = {
    primaire: ['1er', '2eme', '3eme', '4eme', '5eme', '6eme'],
    college: ['1ac', '2ac', '3ac'],
    lycee: ['tc', '1bac', '2bac'],
  };

  const subjects = {
    primaire: ['Mathématiques', 'Français', 'Arabe', 'Sciences', 'Histoire', 'Géographie'],
    college: ['Mathématiques', 'Physique', 'SVT', 'Français', 'Arabe', 'Anglais', 'Histoire-Géo'],
    lycee: ['Mathématiques', 'Physique', 'SVT', 'Philosophie', 'Français', 'Anglais', 'Informatique'],
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/files');
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Erreur lors du chargement des fichiers:', error);
    }
  };

  const handleClassChange = (e) => {
    setClassSelect(e.target.value);
    setSubject('');
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!file || !classSelect || !subject || !lesson) {
      setError('Veuillez sélectionner un fichier, une classe, une matière et une leçon.');
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
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Fichier téléchargé avec succès !');
        fetchFiles();
      } else {
        setError(data.message || 'Erreur lors du téléchargement.');
      }
    } catch (error) {
      setError('Erreur lors du téléchargement: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/files/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setSuccessMessage('Fichier supprimé avec succès');
        fetchFiles();
      } else {
        setError('Erreur lors de la suppression');
      }
    } catch (error) {
      setError('Erreur : ' + error.message);
    }
  };

  const handleEdit = (file) => {
    setEditFile(file);
    setClassSelect(file.class);
    setSubject(file.subject);
    setCourseType(file.course_type);
    setLesson(file.lesson);
    setYoutubeLink(file.youtube_link || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editFile || !editFile.id) {
      setError('Aucun fichier sélectionné pour modification.');
      return;
    }

    const updatedData = {
      level,
      class: String(classSelect),
      subject,
      course_type: courseType,
      lesson,
      youtube_link: youtubeLink,
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/files/${editFile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Fichier mis à jour avec succès !');
        setEditFile(null);
        fetchFiles();
      } else {
        setError(data.message || 'Erreur lors de la mise à jour.');
      }
    } catch (error) {
      setError('Erreur lors de la mise à jour: ' + error.message);
    }
  };

  const handleDragStart = (e, file) => {
    setDraggedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetFile) => {
    e.preventDefault();
    if (draggedFile === targetFile) return;

    const updatedFiles = [...files];
    const draggedIndex = updatedFiles.indexOf(draggedFile);
    const targetIndex = updatedFiles.indexOf(targetFile);

    updatedFiles.splice(draggedIndex, 1);
    updatedFiles.splice(targetIndex, 0, draggedFile);

    setFiles(updatedFiles);
    setDraggedFile(null);
  };

  const filteredFiles = files.filter((file) => {
    return (
      file.level === level &&
      (classSelect ? file.class === classSelect : true) &&
      (subject ? file.subject === subject : true)
    );
  });

  return (
    <div className="selection-container">
      <h2 className="selection-title">Sélection pour le niveau {level}</h2>

      <form className="upload-form" onSubmit={handleFileUpload}>
        <div className="form-group">
          <label className="form-label">Classe :</label>
          <select className="form-select" value={classSelect} onChange={handleClassChange} required>
            <option value="">Sélectionner une classe</option>
            {classes[level]?.map((classe) => (
              <option key={classe} value={classe}>
                {classe}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Matière :</label>
          <select className="form-select" value={subject} onChange={(e) => setSubject(e.target.value)} required>
            <option value="">Sélectionner une matière</option>
            {subjects[level]?.map((matiere) => (
              <option key={matiere} value={matiere}>
                {matiere}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Type de cours :</label>
          <select className="form-select" value={courseType} onChange={(e) => setCourseType(e.target.value)} required>
            <option value="cours">Cours</option>
            <option value="exercice">Exercice</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Leçon :</label>
          <input
            className="form-input"
            type="text"
            value={lesson}
            onChange={(e) => setLesson(e.target.value)}
            placeholder="Nom de la leçon (ex. Cours de pollution de 1)"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Sélectionner un fichier :</label>
          <input className="form-file" type="file" onChange={handleFileChange} required />
        </div>

        <div className="form-group">
          <label className="form-label">Lien YouTube (facultatif) :</label>
          <input
            className="form-input"
            type="url"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <button className="form-button" type="submit">
          Télécharger
        </button>
      </form>

      {editFile && (
        <form className="edit-form" onSubmit={handleUpdate}>
          <h3 className="edit-title">Modifier le fichier</h3>
          <button className="edit-button" type="submit">
            Mettre à jour
          </button>
        </form>
      )}

      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <h3 className="files-title">Fichiers téléchargés :</h3>
      {filteredFiles.length > 0 ? (
        <ul className="files-list">
          {filteredFiles.map((file) => (
            <li
              key={file.id}
              className="file-item"
              draggable
              onDragStart={(e) => handleDragStart(e, file)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, file)}
            >
              <p className="file-lesson">
                <strong>Leçon :</strong> {file.lesson}
              </p>
              <a className="file-link" href={`http://127.0.0.1:8000/storage/${file.path}`} target="_blank" rel="noopener noreferrer">
                {file.name}
              </a>
              <span className="file-info">
                ({file.subject} - {file.course_type})
              </span>
              {file.youtube_link && (
                <div className="youtube-link">
                  <a href={file.youtube_link} target="_blank" rel="noopener noreferrer">
                    Voir la vidéo YouTube
                  </a>
                </div>
              )}
              <button className="delete-button" onClick={() => handleDelete(file.id)}>
                Supprimer
              </button>
              <button className="edit-button" onClick={() => handleEdit(file)}>
                Modifier
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun fichier trouvé pour cette sélection.</p>
      )}
    </div>
  );
};

export default Selection;
