import React, { useRef, useEffect, FormEvent } from 'react';
import logo from '../../assets/images/thePrint/logo_dark.png';
import usedbookLogo from '../../assets/images/footer/logo-white.png';
import arrow from '../../assets/images/footer/arrow.png';
import callIcon from '../../assets/images/thePrint/footer-callicon.png';
import locationIcon from '../../assets/images/thePrint/footer-locationicon.png';
import emailIcon from '../../assets/images/thePrint/footer-emailicon.png';
import Qrcode from '../../assets/images/thePrint/QR-code-bookStore.png';
// import footerRightImage from '../../assets/images/footer/footer-rightimage.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter } from '@fortawesome/free-brands-svg-icons';

import '../../assets/css/style.css';
import '../../assets/css/color.css';
import '../../assets/css/custom-animate.css';
import '../../assets/css/flaticon.css';
import '../../assets/css/jquery.fancybox.min.css';
import '../../assets/css/bootstrap.min.css';
import './FooterStyle.css';

const Footer: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setAttribute('autoComplete', 'off');
    }
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
  }

  return (
    <section className='footer-section'>
      <div className='container'>
        <div className='middle-portion'>
          <div className='row'>
            <div className='col-lg-3 col-md-4 col-sm-6 col-12'>
              <div className='logo-content'>
                <a href='./index.html'>
                  <figure className='footer-logo'>
                    <img src={logo} className='img-fluid' alt='' />
                  </figure>
                </a>
                <a href='/usedBook'>
                  <figure className='footer-logo'>
                    <img src={usedbookLogo} className='img-fluid' alt='' />
                  </figure>
                </a>
                {/* <h6 className='text-white'>
                  Want monthly book recommendations?
                </h6> */}
                <div className='footer-button'>
                  <a
                    className='get_started text-decoration-none'
                    href='./contact.html'
                  >
                    Follow Us
                  </a>
                  <a
                    className='image-button text-decoration-none'
                    href='./contact.html'
                  >
                    <figure className='arrow mb-0'>
                      <img src={arrow} alt='' className='img-fluid' />
                    </figure>
                  </a>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
              <div className='links'>
                <h4 className='text-white'>Contact Info:</h4>
                <div className='lower-content'>
                  <figure className='icon'>
                    <img src={callIcon} alt='' className='img-fluid' />
                  </figure>
                  <div className='content'>
                    <span className='text-size-16'>Call us at:</span>
                    <a
                      className='text-size-16 mb-0 text-decoration-none'
                      href='tel:03-8868886'
                    >
                      03-8868886
                    </a>
                  </div>
                </div>
                <div className='lower-content'>
                  <figure className='icon'>
                    <img src={locationIcon} alt='' className='img-fluid' />
                  </figure>
                  <div className='content'>
                    <span className='text-size-16'>Our Location:</span>
                    <p className='text text-size-16'>
                      桃園市中壢區新生路二段421號
                    </p>
                  </div>
                </div>
                <div className='lower-content'>
                  <figure className='icon icon3'>
                    <img src={emailIcon} alt='' className='img-fluid' />
                  </figure>
                  <div className='content'>
                    <span className='text-size-16'>Email us at:</span>
                    <a
                      href='mailto:used.books.a.new.lease.of.life@gmail.com'
                      className='text-size-16 mb-0 text-decoration-none'
                    >
                      the.print.of.time@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div
              className='col-lg-4 col-md-4 col-sm-4 col-12 d-lg-block d-none'
              style={{ paddingLeft: '108px' }}
            >
              <div className='info'>
                <h4 className='text-white'>Subscribe to Our Newsletter:</h4>
                <form onSubmit={handleSubmit}>
                  <div className='form-group'>
                    <input
                      ref={inputRef}
                      type='text'
                      className='form_style'
                      placeholder='Enter Your Email Address:'
                      name='email'
                      style={{ userSelect: 'none' }}
                    />
                    <button type='submit'>
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                    <hr />
                  </div>
                </form>

                <div className='social-icons position-relative'>
                  <ul className='list-unstyled mb-0 p-0 position-absolute '>
                    <img src={Qrcode} alt='' style={{ width: '30%' }} />
                  </ul>
                  <p
                    style={{
                      fontSize: '15px',
                      color: '#ffff',
                      paddingTop: '20px',
                      paddingLeft: '120px'
                    }}
                  >
                    掃描加入官方Line，
                    <br />
                    優惠消息不漏接!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <img src={footerRightImage} alt="decorative" className="footer-right-img" /> */}
      <div className='copyright'>
        <div className='container'>
          <div className='row'>
            <div className='col-12'>
              <p className='text-size-14'>
                Copyright © 2024 The Print Of Time All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
