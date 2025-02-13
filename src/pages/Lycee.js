import React, { useState, useEffect } from "react";

const Lycee = () => {
  const [files, setFiles] = useState([]);
  const [classSelect, setClassSelect] = useState('');
  const [subject, setSubject] = useState('');

  // Matières du lycée
  const subjects = ['Mathématiques', 'Physique', 'SVT', 'Philosophie', 'Français', 'Anglais', 'Informatique'];

  useEffect(() => {
    fetchFiles();
  }, [classSelect, subject]);

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/files');
      const data = await response.json();
      const filteredFiles = data.filter(file => file.level === 'lycee' && file.class === classSelect && file.subject === subject);
      setFiles(filteredFiles);
    } catch (error) {
      console.error('Erreur lors du chargement des fichiers:', error);
    }
  };

  return (
    <div>
      <h1>Lycée</h1>
      <p>Contenu pour les élèves du lycée.</p>

      <label>Classe :</label>
      <select value={classSelect} onChange={(e) => setClassSelect(e.target.value)}>
        <option value="">Sélectionner une classe</option>
        <option value="tc">Tronc Commun</option>
        <option value="1bac">1ère Année Bac</option>
        <option value="2bac">2ème Année Bac</option>
      </select>

      <label>Matière :</label>
      <select value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option value="">Sélectionner une matière</option>
        {subjects.map((matiere) => (
          <option key={matiere} value={matiere}>{matiere}</option>
        ))}
      </select>

      <h3>Fichiers disponibles :</h3>
      {files.length > 0 ? (
        <ul>
          {files.map((file) => (
            <li key={file.id}>
              <a href={`http://127.0.0.1:8000/storage/${file.path}`} target="_blank" rel="noopener noreferrer">
                {file.name}
              </a> ({file.course_type})
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun fichier disponible.</p>
      )}
    </div>
  );
};

export default Lycee;
