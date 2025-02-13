import React, { useState } from 'react';

const FileUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [className, setClassName] = useState('');
  const [fileType, setFileType] = useState('');

  // Gérer la sélection du fichier
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Gérer la saisie du nom du fichier
  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  };

  // Gérer le type de fichier (cours ou exercice)
  const handleFileTypeChange = (event) => {
    setFileType(event.target.value);
  };

  // Gérer la classe
  const handleClassChange = (event) => {
    setClassName(event.target.value);
  };

  // Générer un nom unique pour le fichier
  const generateFileName = () => {
    const date = new Date();
    const dateString = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
    const timeString = `${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}`;
    return `${className}_${fileType}_${fileName}_${dateString}_${timeString}.pdf`;
  };

  // Gérer l'envoi du fichier
  const handleSubmit = (event) => {
    event.preventDefault();
    if (file) {
      const newFileName = generateFileName();
      onFileUpload(file, newFileName); // Appeler la fonction passée en prop
      alert("Fichier téléchargé avec succès !");
    } else {
      alert("Veuillez sélectionner un fichier.");
    }
  };

  return (
    <div>
      <h2>Importer un fichier PDF</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom du fichier :</label>
          <input type="text" value={fileName} onChange={handleFileNameChange} placeholder="Nom du fichier" />
        </div>
        <div>
          <label>Classe :</label>
          <select value={className} onChange={handleClassChange}>
            <option value="primaire">Primaire</option>
            <option value="college">Collège</option>
            <option value="lycee">Lycée</option>
          </select>
        </div>
        <div>
          <label>Type de fichier :</label>
          <select value={fileType} onChange={handleFileTypeChange}>
            <option value="cours">Cours</option>
            <option value="exercice">Exercice</option>
          </select>
        </div>
        <div>
          <input type="file" onChange={handleFileChange} accept=".pdf" />
        </div>
        <button type="submit">Télécharger</button>
      </form>
    </div>
  );
};

export default FileUpload;
