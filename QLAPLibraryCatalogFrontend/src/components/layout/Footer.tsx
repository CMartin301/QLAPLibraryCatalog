// src/components/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row g-4">
          {/* Brand section */}
          <div className="col-lg-4">
            <div className="d-flex align-items-center mb-3">
              <div>
                <h5 className="mb-1 fw-bold">QLAP</h5>
                <small className="text-white-50">Queer Library & Archive Project</small>
              </div>
            </div>
            <p className="text-white-75 mb-3">
              Preserving LGBTQ+ stories, building community, and ensuring our 
              voices are heard and remembered.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-white-50 fs-5" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-white-50 fs-5" aria-label="Twitter">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-white-50 fs-5" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-white-50 fs-5" aria-label="Email">
                <i className="bi bi-envelope"></i>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="col-lg-2 col-6">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/about" className="text-white-50 text-decoration-none">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/books" className="text-white-50 text-decoration-none">
                  Browse Books
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/archive" className="text-white-50 text-decoration-none">
                  Archive
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/community" className="text-white-50 text-decoration-none">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-lg-2 col-6">
            <h6 className="fw-bold mb-3">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/help" className="text-white-50 text-decoration-none">
                  Help Center
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-white-50 text-decoration-none">
                  Contact Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/donate" className="text-white-50 text-decoration-none">
                  Donate
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/volunteer" className="text-white-50 text-decoration-none">
                  Volunteer
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-lg-2 col-6">
            <h6 className="fw-bold mb-3">Resources</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/safety" className="text-white-50 text-decoration-none">
                  Safety Guidelines
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/privacy" className="text-white-50 text-decoration-none">
                  Privacy Policy
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/terms" className="text-white-50 text-decoration-none">
                  Terms of Service
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/accessibility" className="text-white-50 text-decoration-none">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div className="col-lg-2 col-6">
            <h6 className="fw-bold mb-3">Connect</h6>
            <div className="text-white-75 small">
              <div className="mb-2">
                <i className="bi bi-envelope me-2"></i>
                qlap-houston@proton.me
              </div>
              <div className="mb-2">
                <i className="bi bi-geo-alt me-2"></i>
                Community-Based
              </div>
              {/* <div>
                <i className="bi bi-clock me-2"></i>
                Always Available
              </div> */}
            </div>
          </div>
        </div>

        <hr className="my-4 text-white-25" />

        {/* Bottom footer */}
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-white-50 small mb-0">
              © {currentYear} Queer Library and Archive Project. 
              Built with ❤️ for our community.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <small className="text-white-50">
              <i className="bi bi-heart-fill text-danger me-1"></i>
              Made by and for the LGBTQ+ community
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;