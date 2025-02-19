import React from 'react';

function Contact() {
  return (
    <div id="contact" className="form-3">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="text-container">
              <h2>Contact Details</h2>
              <p>For registration questions please get in touch using the contact details below. For any questions use the form.</p>
              <h3>Main Office Location</h3>
              <ul className="list-unstyled li-space-lg">
                <li className="media">
                  <i className="fas fa-map-marker-alt"></i>
                  <div className="media-body">54 Rue ikhlass sect nahda laayayda sale</div>
                </li>
                <li className="media">
                  <i className="fas fa-mobile-alt"></i>
                  <div className="media-body">+212 666738349, &nbsp;&nbsp;<i className="fas fa-mobile-alt"></i>&nbsp; +212 771284243 </div>
                </li>
                <li className="media">
                  <i className="fas fa-envelope"></i>
                  <div className="media-body"><a className="light-gray" href="mailto:centreelmoumen@gmail.com">centreelmoumen@gmail.com</a> <i className="fas fa-globe"></i><a className="light-gray" href="#your-link">www.elmoumen.academy</a></div>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-6">
            <form id="contactForm" data-toggle="validator" data-focus="false">
              <div className="form-group">
                <input type="text" className="form-control-input" id="cname" required />
                <label className="label-control" for="cname">Name</label>
                <div className="help-block with-errors"></div>
              </div>
              <div className="form-group">
                <input type="email" className="form-control-input" id="cemail" required />
                <label className="label-control" for="cemail">Email</label>
                <div className="help-block with-errors"></div>
              </div>
              <div className="form-group">
                <textarea className="form-control-textarea" id="cmessage" required></textarea>
                <label className="label-control" for="cmessage">Your message</label>
                <div className="help-block with-errors"></div>
              </div>
              
              <div className="form-group">
                <button type="submit" className="form-control-submit-button">SUBMIT</button>
              </div>
              <div className="form-message">
                <div id="cmsgSubmit" className="h3 text-center hidden"></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;