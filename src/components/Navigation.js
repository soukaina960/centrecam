import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from '../assests/images/Capture-removebg-preview-removebg-preview__1_-removebg-preview copy.png';
function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false); // État pour le menu déroulant

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Fonction pour scroller vers une section spécifique
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setMenuOpen(false); // Fermer le menu après clic
        }
    };

    // Fonction pour basculer le menu déroulant
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };



    return (
        <nav className={`navbar navbar-expand-lg navbar-light navbar-custom fixed-top ${scrolled ? "scrolled" : ""}`}>
            <Link to="/" className="navbar-brand logo-image">
                <img src={logo} alt="Logo" />
            </Link>

            {/* Bouton pour afficher/fermer le menu en mode mobile */}
            <button
                className="navbar-toggler"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle navigation"
                aria-expanded={menuOpen}
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            {/* Menu principal */}
            <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`} id="navbarsExampleDefault">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
                            ACCUEIL
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/detail" className="nav-link" onClick={() => setMenuOpen(false)}>
                            ABOUT
                        </Link>
                    </li>

                    {/* Menu déroulant pour les cours */}
                    <li className={`nav-item dropdown ${dropdownOpen ? "show" : ""}`}>
                        <a
                            className="nav-link dropdown-toggle"
                            id="navbarDropdown"
                            role="button"
                            onClick={toggleDropdown}
                            aria-expanded={dropdownOpen}
                        >
                            COURS
                        </a>
                        <div className={`dropdown-menu ${dropdownOpen ? "show" : ""}`} aria-labelledby="navbarDropdown">
                            <Link to="/primaire" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                                PRIMAIRE
                            </Link>
                            <div className="dropdown-divider"></div>
                            <Link to="/college" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                                COLLÈGE
                            </Link>
                            <div className="dropdown-divider"></div>
                            <Link to="/lycee" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                                LYCÉE
                            </Link>
                        </div>
                    </li>

                    <li className="nav-item">
                        <Link to="/email" className="nav-link" onClick={() => setMenuOpen(false)}>
                            CONTACT
                        </Link>
                    </li>
                </ul>

                {/* Bouton Prof */}
                <Link to="/login">
                    <button className="btn btn-warning text-white" onClick={() => setMenuOpen(false)}>
                        <i className="fas fa-chalkboard-teacher"></i> Prof
                    </button>
                </Link>
            </div>
        </nav>
    );
}

export default Navigation;