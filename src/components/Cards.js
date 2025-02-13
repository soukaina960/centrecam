import React from 'react';
import { Link } from 'react-router-dom'; // Importez Link depuis react-router-dom
import '../assests/css/bootstrap.css';  
import '../assests/css/fontawesome-all.css';  
import '../assests/css/swiper.css';  
import '../assests/css/styles.css';  
import '../assests/css/magnific-popup.css';

function Cards() {
  return (
    <div className="cards">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h2>Principaux Enseignements</h2>
            <p className="p-heading">Voici les principaux sujets qui seront abordés dans notre programme d'enseignement pour les élèves du primaire, collège et lycée. Ces thèmes couvrent les bases essentielles et des stratégies avancées pour chaque niveau scolaire.</p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            {/* Carte pour le Primaire */}
            <Link to="/primaire" className="card-link">
              <div className="card">
                <div className="card-image">
                  <i className="fas fa-book-open"></i> {/* Icône pour le primaire */}
                </div>
                <div className="card-body">
                  <h4 className="card-title">Primaire</h4>
                </div>
              </div>
            </Link>

            {/* Carte pour le Collège */}
            <Link to="/college" className="card-link">
              <div className="card">
                <div className="card-image">
                  <i className="fas fa-school"></i> {/* Icône pour le collège */}
                </div>
                <div className="card-body">
                  <h4 className="card-title">Collège</h4>
                </div>
              </div>
            </Link>

            {/* Carte pour le Lycée */}
            <Link to="/lycee" className="card-link">
              <div className="card">
                <div className="card-image">
                  <i className="fas fa-graduation-cap"></i> {/* Icône pour le lycée */}
                </div>
                <div className="card-body">
                  <h4 className="card-title">Lycée</h4>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cards;