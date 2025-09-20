import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleCardClick = (level) => {
    navigate('/selection', { 
      state: { 
        preselectedLevel: level  // Pass the selected level directly
      }  
    });
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Tableau de bord</h2>

      <div className="card-container">
        <div className="card bg-gold" onClick={() => handleCardClick('primaire')}>
          <h3>Primaire</h3>
        </div>
        <div className="card bg-dark" onClick={() => handleCardClick('college')}>
          <h3>Collège</h3>
        </div>
        <div className="card bg-gold" onClick={() => handleCardClick('lycee')}>
          <h3>Lycée</h3>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;