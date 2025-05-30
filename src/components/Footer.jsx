import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Footer = () => {
  return (
    <footer className="bg-black text-white py-4 dark:bg-black dark:text-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 text-center md:text-left">
        <p className="text-sm mb-2 md:mb-0"> {/* Add margin-bottom for spacing on mobile */}
          © {new Date().getFullYear()} Black Neko
        </p>
        <Link to="./Privacy" className="text-sm text-white hover:text-gray-400 dark:hover:text-gray-200">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
};

export default Footer;