import React from "react";
import Header from "./Header";
import Navigation from "./Navigation";
import salle from "../assests/images/IMG-20250324-WA0002.jpg";
import bibliotheque from "../assests/images/IMG-20250324-WA0001.jpg";
import espace from "../assests/images/IMG-20250324-WA0004.jpg";
import image2 from "../assests/images/IMG-20250324-WA0005.jpg";
import image3 from "../assests/images/IMG-20250324-WA0006.jpg";
import image4 from "../assests/images/IMG-20250324-WA0007.jpg";
import "./Detail.css";
import Footer from "./Footer";

const Detail = () => {
    return (
        <div>
            <Header />
            <Navigation />

            {/* Présentation du centre */}
            <div className="container mt-5">
                <h2 className="text-center mb-4">Bienvenue à notre centre</h2>
                <p className="text-center lead">
                    Notre centre de soutien scolaire offre des cours de qualité pour tous les niveaux : primaire, collège et lycée. Nous mettons à disposition des enseignants expérimentés et un environnement propice à l’apprentissage.
                </p>

                {/* Section d'images avec effet de survol */}
                <div className="row mt-5">
                    <div className="col-md-4 mb-4">
                        <div className="image-card">
                            <img src={salle} className="img-fluid rounded shadow" alt="Salle de cours" />
                            <div className="image-overlay">
                         
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="image-card">
                            <img src={bibliotheque} className="img-fluid rounded shadow" alt="Bibliothèque" />
                            
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="image-card">
                            <img src={espace} className="img-fluid rounded shadow" alt="Espace de travail" />
                           
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="image-card">
                            <img src={image2} className="img-fluid rounded shadow" alt="Espace de travail" />
                            
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="image-card">
                            <img src={image3} className="img-fluid rounded shadow" alt="Espace de travail" />
                          
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="image-card">
                            <img src={image4} className="img-fluid rounded shadow" alt="Espace de travail" />
                            <div className="image-overlay">
                                <p className="image-text">Salle polyvalente</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description détaillée avec icônes */}
                <div className="mt-5">
                    <h3 className="text-center mb-4">Nos Services</h3>
                    <div className="row">
                        <div className="col-md-3 text-center">
                            <i className="fas fa-book fa-3x mb-3"></i>
                            <h5>Cours de soutien</h5>
                            <p>Pour tous les niveaux : primaire, collège, lycée.</p>
                        </div>
                        <div className="col-md-3 text-center">
                            <i className="fas fa-user-graduate fa-3x mb-3"></i>
                            <h5>Suivi personnalisé</h5>
                            <p>Un suivi adapté à chaque élève.</p>
                        </div>
                        <div className="col-md-3 text-center">
                            <i className="fas fa-chalkboard-teacher fa-3x mb-3"></i>
                            <h5>Enseignants qualifiés</h5>
                            <p>Des professeurs expérimentés et dévoués.</p>
                        </div>
                        <div className="col-md-3 text-center">
                            <i className="fas fa-laptop fa-3x mb-3"></i>
                            <h5>Matériel moderne</h5>
                            <p>Des outils pédagogiques à la pointe.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="footer">
                <Footer />
            </div>
        </div>
    );
};

export default Detail;