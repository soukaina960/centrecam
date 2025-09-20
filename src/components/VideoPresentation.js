import React, { useEffect } from 'react';
import $ from 'jquery'; // Importer jQuery
import 'magnific-popup/dist/jquery.magnific-popup.min.js'; // Importer Magnific Popup
import 'magnific-popup/dist/magnific-popup.css'; // Importer les styles CSS de Magnific Popup
import useScrollAnimation from '../useScrollAnimation';
import videoUrl from '../assests/images/Capture-removebg-preview-removebg-preview__1_-removebg-preview copy.png'; // Chemin correct (ASCII)
import imageUrl from '../assests/images/WhatsApp Image 2025-02-19 à 13.08.18_10c49313.jpg';



function VideoPresentation() {
  const [ref, isVisible] = useScrollAnimation(); // Utilisation du hook pour détecter la visibilité

  useEffect(() => {
    // Initialiser Magnific Popup après le rendu du composant
    $('.popup-youtube').magnificPopup({
      type: 'iframe', // Type de contenu (iframe pour les vidéos)
      mainClass: 'mfp-fade', // Classe CSS pour l'effet de transition
      removalDelay: 300, // Délai avant la fermeture
      preloader: false, // Désactiver le préchargeur
      fixedContentPos: true, // Position fixe du contenu
    });

    // Nettoyer Magnific Popup lors du démontage du composant
    return () => {
      $('.popup-youtube').magnificPopup('destroy');
    };
  }, []);

  return (
    <div ref={ref} id="scroll-target" className={`video-presentation ${isVisible ? 'visible' : ''}`}>
      <div className="basic-4">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h2>Video Presentation</h2>

              {/* Video Preview */}
              <div className="image-container">
                <div className="video-wrapper">
                  <a className="popup-youtube" href={videoUrl}>
                    <img className="img-fluid" src={imageUrl} alt="Video Preview" />
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
    </div>
  );
}

export default VideoPresentation;