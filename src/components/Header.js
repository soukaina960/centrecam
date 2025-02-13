import React from 'react';

function Header() {
  var imageheader = "/Capture-removebg-preview-removebg-preview__1_-removebg-preview copy.png";

  return (
    <header id="header" className="header">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-container">
              <div className="countdown">
                <span id="clock"></span>
              </div>
              <div className="countdown mb-5">
                <span id="clock"></span>
              </div>
              {/* Remplacer le titre par l'image */}
              <h1>
                <img src={imageheader} alt="CAM logo" className="img-fluid" style={{ width: '300px' }} />
              </h1>
              <p className="p-large">! Nous sommes une institution dédiée à fournir des services de haute qualité dans le domaine du développement personnel et professionnel. Que vous cherchiez à améliorer vos compétences, explorer de nouvelles passions ou atteindre vos objectifs, notre centre est là pour vous soutenir à chaque étape.</p>
             
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
