import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '/src/assets/imgs/logo1.jpg';
import logoImage1 from '/src/assets/imgs/blackneko-icon.png';
import { FaSun, FaMoon } from 'react-icons/fa'; // ไอคอนสำหรับ Dark Mode
import MenuNavBar from './MenuNavBar';
import ContactNav from './ContactNav';

const Header = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [show, setShow] = useState("translate-y-0");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const controlNavbar = () => {
    if (window.scrollY > 200) {
      if (window.scrollY > lastScrollY && !mobileMenu) {
        setShow("-translate-y-[80px]");
      } else {
        setShow("shadow-md");
      }
    } else {
      setShow("translate-y-0");
    }
    setLastScrollY(window.scrollY);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark'); // Toggle dark mode for body
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <header
      className={`w-full h-[60px] md:h-[80px] bg-white dark:bg-black flex items-center justify-between z-20 fixed top-0 left-0 right-0 transition-transform duration-300 ${show}`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-8">
        {/* Left Section - Menu Navigation */}
        <div className="flex items-center">
          <MenuNavBar />
        </div>

        {/* Center Section - Logo */}
        <div className="flex items-center justify-center flex-grow">
        <Link to="/">
            <img
              src={isDarkMode ? logoImage : logoImage1}
              alt="BlackNeko Logo"
              className="cursor-pointer object-contain h-[60px] md:h-[80px] w-auto"
            />
          </Link>
        </div>

        {/* Dark Mode Toggle */}
        <div className="mx-2">
          <button
            onClick={toggleDarkMode}
            className="text-yellow-500 dark:text-white text-xl p-2 rounded-full transition-transform duration-500 hover:rotate-180"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {/* Right Section - Contact Information */}
        <div className="flex items-center">
          <ContactNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
