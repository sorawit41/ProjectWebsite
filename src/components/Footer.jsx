import React from 'react';
import './Footer.css';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">&copy; {new Date().getFullYear()} Black Neko</p>
        <div className="footer-icons">
          <a href="https://www.facebook.com/BLACKNEKOMBK" className="footer-icon" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="h-6 w-6 text-white" />
          </a>
          <a href="https://twitter.com/blacknekomall" className="footer-icon" target="_blank" rel="noopener noreferrer">
            <FaXTwitter className="h-6 w-6 text-white" />
          </a>
          <a href="https://www.instagram.com/blackneko.mbk/" className="footer-icon" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="h-6 w-6 text-white" />
          </a>
        </div>
        <a href="#" className="footer-privacy">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default Footer;