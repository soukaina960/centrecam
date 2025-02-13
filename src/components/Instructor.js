import React from 'react';

function Instructor() {
    var imagein="/capture.PNG";
  return (
    <div id="instructor" className="basic-1">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <img className="img-fluid" src={imagein} alt="alternative" />
          </div>
          <div className="col-lg-6">
            <div className="text-container">
              <h2>I’m Garry Your Trainer</h2>
              <p>Hi everybody! I am Garry and I will be your main instructor during the SEO training course. I have more than 10 years experience in SEO and I am very passionate about this field. Register for the course and let's meet.</p>
              <p>Teaching students all about the best SEO techniques is something I love to do as a full-time job</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Instructor;