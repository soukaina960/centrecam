import React, { useState, useEffect } from 'react';
import './Dashboard.css';
const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [level, setLevel] = useState('primaire');
  const [classSelect, setClassSelect] = useState('');
  const [subject, setSubject] = useState('');
  const [courseType, setCourseType] = useState('cours');
  const [lesson, setLesson] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [editFile, setEditFile] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  // Classes par niveau
  const classes = {
    primaire: ['1er', '2eme', '3eme', '4eme', '5eme', '6eme'],
    college: ['1ac', '2ac', '3ac'],
    lycee: ['tc', '1bac', '2bac']
  };

  // Matières par niveau
  const subjects = {
    primaire: ['Mathématiques', 'Français', 'Arabe', 'Sciences', 'Histoire', 'Géographie'],
    college: ['Mathématiques', 'Physique', 'SVT', 'Français', 'Arabe', 'Anglais', 'Histoire-Géo'],
    lycee: ['Mathématiques', 'Physique', 'SVT', 'Philosophie', 'Français', 'Anglais', 'Informatique']
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

  const handleLevelChange = (e) => {
    setLevel(e.target.value);
    setClassSelect('');
    setSubject('');
    setLesson('');
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
    formData.append('lesson', lesson); // Ajout de la leçon
    formData.append('youtube_link', youtubeLink);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/upload', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
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
    setLevel(file.level);
    setClassSelect(file.class);
    setSubject(file.subject);
    setCourseType(file.course_type);
    setLesson(file.lesson);
    setYoutubeLink(file.youtube_link || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editFile || !editFile.id) {
      setError("Aucun fichier sélectionné pour modification.");
      return;
    }

    const updatedData = {
      level,
      class: String(classSelect),
      subject,
      course_type: courseType,
      lesson, // Mise à jour de la leçon
      youtube_link: youtubeLink,
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/files/${editFile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
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
      console.error('Détails de l\'erreur:', error);
    }
  };

  // Regrouper les fichiers par leçon
  const groupedByLesson = files.reduce((acc, file) => {
    const key = file.lesson || 'Autre Leçon';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(file);
    return acc;
  }, {});

  return (
    <div>
      <h2>Tableau de bord</h2>

      <form onSubmit={handleFileUpload}>
        <div>
          <label>Niveau :</label>
          <select value={level} onChange={handleLevelChange} required>
            <option value="primaire">Primaire</option>
            <option value="college">Collège</option>
            <option value="lycee">Lycée</option>
          </select>
        </div>

        <div>
          <label>Classe :</label>
          <select value={classSelect} onChange={handleClassChange} required>
            <option value="">Sélectionner une classe</option>
            {classes[level]?.map((classe) => (
              <option key={classe} value={classe}>{classe}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Matière :</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} required>
            <option value="">Sélectionner une matière</option>
            {subjects[level]?.map((matiere) => (
              <option key={matiere} value={matiere}>{matiere}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Type de cours :</label>
          <select value={courseType} onChange={(e) => setCourseType(e.target.value)} required>
            <option value="cours">Cours</option>
            <option value="exercice">Exercice</option>
          </select>
        </div>

        <div>
          <label>Leçon :</label>
          <input 
            type="text" 
            value={lesson} 
            onChange={(e) => setLesson(e.target.value)} 
            placeholder="Nom de la leçon (ex. Cours de pollution de 1)"
            required 
          />
        </div>

        <div>
          <label>Sélectionner un fichier :</label>
          <input type="file" onChange={handleFileChange} required />
        </div>

        <div>
          <label>Lien YouTube (facultatif) :</label>
          <input 
            type="url" 
            value={youtubeLink} 
            onChange={(e) => setYoutubeLink(e.target.value)} 
            placeholder="https://www.youtube.com/watch?v=..." 
          />
        </div>

        <button type="submit">Télécharger</button>
      </form>

      {editFile && (
        <form onSubmit={handleUpdate}>
          <h3>Modifier le fichier</h3>
          <button type="submit">Mettre à jour</button>
        </form>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <h3>Fichiers téléchargés :</h3>
      {Object.entries(groupedByLesson).map(([lesson, files]) => (
        <div key={lesson}>
          <h3>{lesson}</h3>
          <ul>
            {files.map((file) => (
              <li key={file.id}>
                <a href={`http://127.0.0.1:8000/storage/${file.path}`} target="_blank" rel="noopener noreferrer">
                  {file.name}
                </a> 
                ({file.subject} - {file.course_type})
                {file.youtube_link && (
                  <div>
                    <a href={file.youtube_link} target="_blank" rel="noopener noreferrer">
                      Voir la vidéo YouTube
                    </a>
                  </div>
                )}
                <button onClick={() => handleDelete(file.id)}>Supprimer</button>
                <button onClick={() => handleEdit(file)}>Modifier</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
