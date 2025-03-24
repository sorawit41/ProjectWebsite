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
        {/* Button Search  */}
        
        {/* Buger  */}
        <div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex md:hidden justify-center items-center hover:bg-black/[0.05] cursor-pointer">
          {mobileMenu ? (
            <VscChromeClose onClick={() => setMobileMenu(false)} className="text-[16px]" />
          ) : (
            <BiMenuAltRight onClick={() => setMobileMenu(true)} className="text-[20px]" />
          )}
        </div>
        {/* Left Menu  */}
        <LeftMenu />

        {/* Logo  */}
        <Logo imageUrl="/src/assets/imgs/blackneko-icon.png" altText="BlackNeko Logo" />

        {/* Right Menu  */}
        <RightMenu />

        {/* mobile menu */}
        {mobileMenu && <MenuMobile setMobileMenu={setMobileMenu}/>}
      </div>
    </header>
  );
};

export default Header;