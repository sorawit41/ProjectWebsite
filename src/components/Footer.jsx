import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Footer = () => {
  return (
    <footer className="bg-black text-white py-4 dark:bg-black dark:text-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
        <p className="text-sm">
          © {new Date().getFullYear()} Black Neko
        </p>
        <div className="flex space-x-4">
          <a
            href="https://www.facebook.com/BLACKNEKOMBK"
            className="text-white hover:text-gray-400 dark:hover:text-gray-200"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebook className="w-6 h-6" />
          </a>
          <a
            href="https://www.instagram.com/blackneko.mbk/"
            className="text-white hover:text-gray-400 dark:hover:text-gray-200"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram className="w-6 h-6" />
          </a>
          <a
            href="https://www.tiktok.com/@blackneko.mbk" // Replace with your TikTok handle
            className="text-white hover:text-gray-400 dark:hover:text-gray-200"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
          >
            <FaTiktok className="w-6 h-6" />
          </a>
        </div>
        <Link to="./Privacy" className="text-sm text-white hover:text-gray-400 dark:hover:text-gray-200">
          Privacy Policy
        </Link>
        
      </div>
    </footer>
    
  );
};

export default Footer;
