import React from 'react';
import { Link } from 'react-router-dom';
import imagein from '../assests/images/Capture.PNG'; // Importez l'image correctement
import useScrollAnimation from '../useScrollAnimation'; // Importez le hook personnalisé


function Instructor() {
  const [ref, isVisible] = useScrollAnimation(); // Utilisez le hook pour détecter la visibilité

  return (
    <div ref={ref} id="instructor" className={`basic-1 ${isVisible ? 'visible' : ''}`}>
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <img className="img-fluid instructor-image" src={imagein} alt="Instructor" />
          </div>
          <div className="col-lg-6">
            <div className="text-container">
              <h1>Bienvenue à notre centre CAM</h1>
              <p>
                Notre centre de soutien scolaire offre des cours de qualité pour tous les niveaux : primaire, collège et lycée.<br />
                Nous mettons à disposition des enseignants expérimentés et un environnement propice à l’apprentissage.
              </p>
              <Link to="/detail">
                <button className="btn-solid-reg">Register Now</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Instructor;