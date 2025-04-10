import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '/src/assets/imgs/blackneko-icon.png';
import MenuNavBar from './MenuNavBar';
import ContactNav from './ContactNav';

const Header = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [show, setShow] = useState("translate-y-0");
  const [lastScrollY, setLastScrollY] = useState(0);

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

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <header
      className={`w-full h-[60px] md:h-[80px] bg-white flex items-center justify-between z-20 fixed top-0 left-0 right-0 transition-transform duration-300 ${show}`}
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
              src={logoImage}
              alt="BlackNeko Logo"
              className="cursor-pointer object-contain w-auto h-full max-h-[60px] md:max-h-[80px] logo"
            />
          </Link>
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
