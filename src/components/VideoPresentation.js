import React from 'react';

function VideoPresentation() {
  // Déclarez la variable image
  var imageUrl = "/details-slide-1.jpg";

  return (
    <div className="basic-4">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h2>Course Video Presentation</h2>

            {/* Video Preview */}
            <div className="image-container">
              <div className="video-wrapper">
                <a className="popup-youtube" href="https://youtu.be/qjUqVPeICnw?si=ncSfu7uzGqm6neYl" data-effect="fadeIn">
                  {/* Utilisation de la variable imageUrl dans src */}
                  <img className="img-fluid" src={imageUrl} alt="alternative" />
                  <span className="video-play-button">
                    <span></span>
                  </span>
                </a>
              </div>
            </div>
            {/* End of Video Preview */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPresentation;
