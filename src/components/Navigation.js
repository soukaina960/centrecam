import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Navigation() {
    const imageheader = "Capture-removebg-preview-removebg-preview__1_-removebg-preview copy.png"; 
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`navbar navbar-expand-lg navbar-light navbar-custom fixed-top ${scrolled ? "scrolled" : ""}`}>
            <Link to="/" className="navbar-brand logo-image">
                <img src={imageheader} alt="Logo" />
            </Link>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault">
                <span className="navbar-toggler-awesome fas fa-bars"></span>
                <span className="navbar-toggler-awesome fas fa-times"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">ACCUEIL</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/description" className="nav-link">ABOUT</Link>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown">COURS</a>
                        <div className="dropdown-menu">
                            <Link to="/primaire" className="dropdown-item">PRIMAIRE</Link>
                            <div className="dropdown-divider"></div>
                            <Link to="/lycee" className="dropdown-item">LYCÉE</Link>
                            <div className="dropdown-divider"></div>
                            <Link to="/college" className="dropdown-item">COLLÈGE</Link>
                        </div>
                    </li>
                    <li className="nav-item">
                        <Link to="/contact" className="nav-link">CONTACT</Link>
                    </li>
                </ul>

                {/* Bouton Prof */}
                <Link to="/login">
                    <button className="btn btn-warning text-white">
                        <i className="fas fa-chalkboard-teacher"></i> Prof
                    </button>
                </Link>

                {/* Réseaux sociaux */}
                <span className="nav-item social-icons">
                    <span className="fa-stack">
                        <a href="#your-link">
                            <i className="fas fa-circle fa-stack-2x"></i>
                            <i className="fab fa-facebook-f fa-stack-1x"></i>
                        </a>
                    </span>
                    <span className="fa-stack">
                        <a href="https://www.youtube.com/@AbdelwahedElMoumen">
                            <i className="fas fa-circle fa-stack-2x"></i>
                            <i className="fab fa-twitter fa-stack-1x"></i>
                        </a>
                    </span>
                    <span className="fa-stack">
                        <a href="https://www.youtube.com/">
                            <i className="fas fa-circle fa-stack-2x"></i>
                            <i className="fab fa-youtube fa-stack-1x"></i>
                        </a>
                    </span>
                </span>
            </div>
        </nav>
    );
}

export default Navigation;
