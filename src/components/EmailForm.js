import React, { useState } from "react";
import Header from "./Header";
import { Nav } from "react-bootstrap";
import Navigation from "./Navigation";
import Footer from "./Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Envoi en cours...");

    try {
      const response = await fetch("https://formspree.io/f/xqaejgga", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("Email envoyé avec succès !");
        setFormData({ name: "", email: "", message: "" }); // Réinitialiser le formulaire
      } else {
        setStatus("Erreur lors de l'envoi.");
      }
    } catch (error) {
      setStatus("Erreur lors de l'envoi.");
      console.error(error);
    }
  };

  return (
    <div className="contact">
        <Header/>
        <Navigation/>
    <div className="contact-container">
     
      <h2>Contactez-nous</h2>
      <div id="contact" className="form-3">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="text-container">
                <h2>Coordonnées</h2>
                <p>
                  Pour toute question concernant l'inscription, veuillez nous contacter en utilisant les
                  coordonnées ci-dessous. Pour toute autre question, utilisez le formulaire.
                </p>
                <h3>Adresse du bureau principal</h3>
                <ul className="list-unstyled li-space-lg">
                  <li className="media">
                    <i className="fas fa-map-marker-alt"></i>
                    <div className="media-body">54 Rue Ikhlas, Secteur Nahda, Laayayda, Salé</div>
                  </li>
                  <li className="media">
                    <i className="fas fa-mobile-alt"></i>
                    <div className="media-body">
                      +212 666738349, &nbsp;&nbsp;<i className="fas fa-mobile-alt"></i>&nbsp; +212
                      771284243
                    </div>
                  </li>
                  <li className="media">
                    <i className="fas fa-envelope"></i>
                    <div className="media-body">
                      <a className="light-gray" href="mailto:centreelmoumen@gmail.com">
                        centreelmoumen@gmail.com
                      </a>{' '}
                      <i className="fas fa-globe"></i>
                      <a className="light-gray" href="#your-link">
                        www.elmoumen.academy
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6" id="contactForm">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Nom :</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                  <label htmlFor="email">Email :</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                  <label htmlFor="message">Message :</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required />

                  <button type="submit" className="btn btn-warning text-white">Envoyer</button>
                  <p>{status}</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default Contact;