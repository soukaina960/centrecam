import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Création du contexte
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Fonction pour connecter l'utilisateur
    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:8000/api/login', { email, password });
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            // Optionnel : récupérer les données utilisateur
            setUser({ email });
        } catch (error) {
            console.error('Erreur lors de la connexion', error);
        }
    };

    // Fonction pour se déconnecter
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    useEffect(() => {
        if (token) {
            axios.defaults.headers['Authorization'] = `Bearer ${token}`;
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
