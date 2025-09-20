import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CoursList = () => {
    const [cours, setCours] = useState([]);

    useEffect(() => {
        const fetchCours = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/cours');
                setCours(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des cours', error);
            }
        };

        fetchCours();
    }, []);

    return (
        <div>
            <h2>Liste des Cours</h2>
            {cours.length > 0 ? (
                <ul>
                    {cours.map((cours) => (
                        <li key={cours.id}>
                            <h3>{cours.titre}</h3>
                            <p>{cours.description}</p>
                            <a href={`http://localhost:8000/storage/${cours.fichier}`} target="_blank" rel="noopener noreferrer">Télécharger</a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucun cours disponible.</p>
            )}
        </div>
    );
};

export default CoursList;
