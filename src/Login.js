import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    if (!formData.email || !formData.password) {
      Swal.fire({
        icon: "error",
        title: "Champs requis",
        text: "Veuillez entrer votre email et mot de passe.",
      });
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', formData);
      const token = response.data.authorisation.token;
      const user = response.data.user;

      sessionStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      Swal.fire({
        icon: "success",
        title: "Connexion réussie",
        text: "Bienvenue sur CENTRE EL MOUMEN !",
      }).then(() => {
        navigate("/dashboard");
      });
    } catch (error) {
      console.error(error);
      if (error.response) {
        if (error.response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Échec de connexion",
            text: "Email ou mot de passe incorrect. Veuillez réessayer.",
          });
        } else if (error.response.status === 422) {
          setValidationErrors(error.response.data.errors);
        } else {
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: "Une erreur inattendue s'est produite. Veuillez réessayer plus tard.",
          });
        }
      }
    }
  };

  return (
    <section className="vh-100 bg-image">
      <div className="maskk">
        <div className="cardd">
          <form onSubmit={handleSubmit}>
            <label>Email :</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Entrez votre Email" 
              className="form-control" 
              value={formData.email} 
              onChange={handleChange} 
            />
            {validationErrors.email && <span className="text-danger">{validationErrors.email[0]}</span>}

            <label>Mot de passe :</label>
            <input 
              type="password" 
              name="password" 
              placeholder="Entrez votre mot de passe" 
              className="form-control" 
              value={formData.password} 
              onChange={handleChange} 
            />
            {validationErrors.password && <span className="text-danger">{validationErrors.password[0]}</span>}

            <button type="submit" className="btn btn-warning text-white">Se connecter</button>

            <div className="mt-3">
      
           
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
