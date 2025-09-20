import React from 'react';
import { Link } from 'react-router-dom';
//import "../src/assests/css/styles.css";

function Footer() {
  return (
    <div className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <div className="footer-col first">
              <h1>CAM</h1>
            </div>
          </div>
          <div className="col-md-4">
            <div className="footer-col second">
              <h5>Liens</h5>
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    ACCUEIL
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/detail" className="nav-link">
                    ABOUT
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/email" className="nav-link">
                    CONTACT
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-2"></div>
          <div className="col-md-3">
            <div className="footer-col fourth">
              <h5>Réseaux sociaux</h5>
              <p className="p-small">Suivez-nous pour les dernières nouvelles</p>
              <div className="social-links">
                <a href="https://www.facebook.com/share/1KQuLC3hqN/">
                  <i className="fab fa-facebook-f"></i>
                </a>
               
                <a href="https://www.instagram.com/centreelmoumen?igsh=ejE2MGo5aDF5Y3dl">
                  <i className="fab fa-instagram"></i>
                </a>
              
                <a href="https://www.youtube.com/@AbdelwahedElMoumen">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;