// Cards.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../assests/css/bootstrap.css';  
import '../assests/css/fontawesome-all.css';  
import '../assests/css/swiper.css';  
import '../assests/css/styles.css';  
import '../assests/css/magnific-popup.css';
import useScrollAnimation from '../useScrollAnimation'; // Importez le hook personnalisé

function Cards() {
  const levels = [
    { name: "Primaire", icon: "fas fa-book-open", path: "/primaire" },
    { name: "Collège", icon: "fas fa-school", path: "/college" },
    { name: "Lycée", icon: "fas fa-graduation-cap", path: "/lycee" },
  ];

  // Utilisation correcte du hook
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div ref={ref} id="scroll-target" className={`cards ${isVisible ? 'visible' : ''}`}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h2>Principaux Enseignements</h2>
            <p className="p-heading">
              Voici les principaux sujets qui seront abordés dans notre programme d'enseignement
              pour les élèves du primaire, collège et lycée. Ces thèmes couvrent les bases
              essentielles et des stratégies avancées pour chaque niveau scolaire.
            </p>
          </div>
        </div>

        <div className="row d-flex justify-content-center">
          {levels.map((level, index) => (
            <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <Link to={level.path} className="card-link">
                <div className="card text-center">
                  <div className="card-image">
                    <i className={`${level.icon} fa-3x`}></i>
                  </div>
                  <div className="card-body">
                    <h4 className="card-title">{level.name}</h4>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Cards;