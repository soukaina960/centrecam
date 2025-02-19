import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Assure-toi d'avoir un fichier CSS correspondant

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "soso@gmail.com" && password === "123456") {
      localStorage.setItem("token", "your-jwt-token-here");
      navigate("/dashboard");
    } else {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="wrapper">
      <form className="form" onSubmit={handleLogin}>
        <span className="title">Login</span>

        <div className="input-container">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="black" fill="none" strokeWidth="1">
              <path d="M21.6365 5H3L12.2275 12.3636L21.6365 5Z"></path>
              <path d="M16.5 11.5L22.5 6.5V17L16.5 11.5Z"></path>
              <path d="M8 11.5L2 6.5V17L8 11.5Z"></path>
              <path d="M9.5 12.5L2.81805 18.5002H21.6362L15 12.5L12 15L9.5 12.5Z"></path>
            </g>
          </svg>
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-container">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="black" fill="none" strokeWidth="1">
              <path d="M3.5 15.5503L9.20029 9.85L12.3503 13L11.6 13.7503H10.25L9.8 15.1003L8 16.0003L7.55 18.2503L5.5 19.6003H3.5V15.5503Z"></path>
              <path d="M16 3.5H11L8.5 6L16 13.5L21 8.5L16 3.5Z"></path>
              <path d="M16 10.5L18 8.5L15 5.5H13L12 6.5L16 10.5Z"></path>
            </g>
          </svg>
          <input
            className="input"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{background: "black"}}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="login-button">
          <input className="input" type="submit" value="Se connecter" />
        </div>
      </form>
    </div>
  );
}

export default Login;