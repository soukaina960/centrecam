import React from 'react';

function Description() {
  return (
    <div id="description" className="basic-2">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h2>Ce Que Vous Apprendrez Dans Notre Cours De Soutien</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <ul className="list-unstyled li-space-lg first">
              <li className="media">
                <i className="bullet">1</i>
                <div className="media-body">
                  <h4>Renforcer vos bases en mathématiques</h4>
                  <p>Nous vous aiderons à maîtriser les concepts fondamentaux en mathématiques, que ce soit pour le primaire ou le lycée.</p>
                </div>
              </li>
              <li className="media">
                <i className="bullet">2</i>
                <div className="media-body">
                  <h4>Maîtriser la grammaire et la conjugaison en français</h4>
                  <p>Apprenez à structurer vos phrases et à conjuguer correctement les verbes, quel que soit votre niveau.</p>
                </div>
              </li>
              <li className="media">
                <i className="bullet">3</i>
                <div className="media-body">
                  <h4>Perfectionner vos compétences en sciences</h4>
                  <p>Nous vous guiderons à travers les concepts clés des sciences, que ce soit la physique, la chimie ou la biologie.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="col-lg-6">
            <ul className="list-unstyled li-space-lg second">
              <li className="media">
                <i className="bullet">4</i>
                <div className="media-body">
                  <h4>Réviser efficacement pour vos examens</h4>
                  <p>Apprenez à organiser vos révisions et à gérer votre temps pour maximiser vos résultats lors des examens.</p>
                </div>
              </li>
              <li className="media">
                <i className="bullet">5</i>
                <div className="media-body">
                  <h4>Renforcer votre compréhension de l'anglais</h4>
                  <p>Que ce soit pour la grammaire, la lecture ou l'expression orale, nous vous aiderons à progresser en anglais.</p>
                </div>
              </li>
              <li className="media">
                <i className="bullet">6</i>
                <div className="media-body">
                  <h4>Acquérir des méthodes de travail efficaces</h4>
                  <p>Nous vous apprendrons des techniques d'apprentissage adaptées à votre niveau et à vos besoins.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Description;
