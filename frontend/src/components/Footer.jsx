import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          {/* Link Sections */}
          <div className="links-section">
            <div>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact Us</Link>
              {/* <Link to="/careers">Careers</Link>
              <Link to="/blog">Blog</Link> */}
            </div>
            {/* <div>
              <Link to="/udemy-business">Udemy Business</Link>
              <Link to="/teach">Teach On Udemy</Link>
              <Link to="/app">Get The App</Link>
            </div> */}
            <div>
              <Link to="/help">Help & Support</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </div>
          </div>

          {/* Social Media */}
          <div className="social-media">
            <span>Follow Us:</span>
            <a href="https://www.instagram.com" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://www.twitter.com" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://www.youtube.com" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>
      </footer>

      {/* Inline CSS */}
      <style>
        {`
          .footer {
            width: 100%;
            background-color: #18423d;
            padding: 30px 20px;
            color: white;
          }

          .footer-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .links-section {
            display: flex;
            gap: 50px;
            flex-wrap: wrap;
          }

          .links-section div {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .links-section a {
            color: white;
            text-decoration: none;
            font-size: 14px;
          }

          .links-section a:hover {
            text-decoration: underline;
          }

          .social-media {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 20px;
          }

          .social-media span {
            font-size: 14px;
            margin-right: 8px;
          }

          .social-media a {
            color: white;
            font-size: 18px;
            transition: color 0.3s ease-in-out;
          }

          .social-media a:hover {
            color: #ddd;
          }

          @media (max-width: 768px) {
            .footer-container {
              flex-direction: column;
              align-items: center;
              text-align: center;
              gap: 30px;
            }

            .links-section {
              flex-direction: column;
              align-items: center;
              gap: 20px;
            }

            .social-media {
              justify-content: center;
            }
          }
        `}
      </style>
    </>
  );
};

export default Footer;
