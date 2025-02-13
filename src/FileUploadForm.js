import React, { useState } from 'react';

const FileUploadForm = () => {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('');
  const [type, setType] = useState('cours');

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleTypeChange = (e) => setType(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique pour envoyer les données vers le back-end (Laravel)
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Choisir la catégorie :</label>
        <select value={category} onChange={handleCategoryChange}>
          <option value="primaire">Primaire</option>
          <option value="college">Collège</option>
          <option value="lycee">Lycée</option>
        </select>
      </div>

      <div>
        <label>Type de fichier :</label>
        <select value={type} onChange={handleTypeChange}>
          <option value="cours">Cours</option>
          <option value="exercice">Exercice</option>
        </select>
      </div>

      <div>
        <label>Choisir un fichier :</label>
        <input type="file" onChange={handleFileChange} required />
      </div>

      <button type="submit">Ajouter</button>
    </form>
  );
};

export default FileUploadForm;
