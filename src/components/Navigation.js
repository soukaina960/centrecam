import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
    const imageheader = "Capture-removebg-preview-removebg-preview__1_-removebg-preview copy.png"; // Ensure this path is correct
    const [scrolled, setScrolled] = React.useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <nav className={`navbar navbar-expand-lg navbar-light navbar-custom fixed-top ${scrolled ? "scrolled" : ""}`}>
             <a className="navbar-brand logo-image" href="index.html">
                <img src={imageheader} alt="alternative" />
            </a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-awesome fas fa-bars"></span>
                <span className="navbar-toggler-awesome fas fa-times"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <a className="nav-link page-scroll" href="#register">ACCEUIL <span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link page-scroll" href="#description">ABOUT</a>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle page-scroll" href="#date" id="navbarDropdown" role="button" aria-haspopup="true" aria-expanded="false">COURS</a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <a className="dropdown-item" href="#primaire"><span className="item-text">PRIMAIRE</span></a>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" href="#lycee"><span className="item-text">LYCEE</span></a>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" href="#college"><span className="item-text">COLLEGE</span></a>
                        </div>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link page-scroll" href="#contact">CONTACT</a>
                    </li>
                </ul>
                            {/* Bouton Prof avec icône */}
                            <Link to="/Login">
                <button className="btn btn-warning text-white">
                    <i className="fas fa-chalkboard-teacher"></i> Prof
                </button>
            </Link>
 
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
                    {/* Icône YouTube */}
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