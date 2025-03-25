import React, { useState, useEffect } from 'react';
import LeftMenu from './LeftMenu';
import Logo from './Logo';
import RightMenu from './RightMenu';

import { BiMenuAltRight } from 'react-icons/bi';
import { VscChromeClose } from 'react-icons/vsc';
import MenuMobile from './MenuMobile';

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
      className={`w-full h-[60px] md:h-[80px] bg-white flex items-center justify-between z-20 sticky top-0 transition-transform duration-300 ${show}`}
    >
      <div className='container mx-auto flex items-center justify-between px-4 md:px-8'>
        {/* Button Search - Consider adding this component if needed */}
        {/* <div className="hidden md:flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
          />
          <button className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Search
          </button>
        </div> */}

        {/* Buger Icon for Mobile Menu */}
        <div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex md:hidden justify-center items-center hover:bg-gray-100 cursor-pointer transition-colors duration-200">
          {mobileMenu ? (
            <VscChromeClose onClick={() => setMobileMenu(false)} className="text-xl" />
          ) : (
            <BiMenuAltRight onClick={() => setMobileMenu(true)} className="text-2xl" />
          )}
        </div>

        {/* Left Menu */}
        <LeftMenu />

        {/* Logo */}
        <Logo imageUrl="/src/assets/imgs/blackneko-icon.png" altText="BlackNeko Logo" className="cursor-pointer" /> {/* Added cursor-pointer for better UX */}

        {/* Right Menu */}
        <RightMenu />

        {/* Mobile menu */}
        {mobileMenu && <MenuMobile setMobileMenu={setMobileMenu} />}
      </div>
    </header>
  );
};

export default Header;