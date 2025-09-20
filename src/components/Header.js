import React from 'react';

function Header() {
 

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
                <span id="clock">
                <p className="p-large">CENTRE EL MOUMEN</p>
                </span>
              </div>
              {/* Remplacer le titre par l'image */}
              
            
             
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
