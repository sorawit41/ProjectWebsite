import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Asset Imports
import logoDarkMode from '/src/assets/logo/logo.png';       // Logo สำหรับ Dark Mode (โลโก้เดิม)
import logoLightMode from '/src/assets/logo/logo.png'; // โลโก้สีขาวสำหรับ Light Mode (ต้องสร้างไฟล์นี้ขึ้นมา)

// Icon Imports
// import { FaSun, FaMoon } from 'react-icons/fa'; // Comment out or remove these imports

// Component Imports
import MenuNavBar from './MenuNavBar';
import ContactNav from './ContactNav';
import LoginNav from './LoginNav'; // ตรวจสอบเส้นทางของ LoginNav, ถ้าเดิมเป็น './LoginNav' ก็ใช้ตามเดิม

const Header = () => {
  // State Hooks
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showNavbar, setShowNavbar] = useState("translate-y-0");
  const [lastScrollY, setLastScrollY] = useState(0);

  // --- Start of Dark Mode Removal ---
  // Remove or comment out the isDarkMode state and its initialization
  // const [isDarkMode, setIsDarkMode] = useState(() => {
  //   if (typeof window !== 'undefined') {
  //     const savedMode = localStorage.getItem('theme');
  //     if (savedMode) {
  //       return savedMode === 'dark';
  //     }
  //     return window.matchMedia('(prefers-color-scheme: dark)').matches;
  //   }
  //   return false;
  // });

  // Remove or comment out the useEffect hook for setting dark mode class
  // useEffect(() => {
  //   if (isDarkMode) {
  //     document.documentElement.classList.add('dark');
  //     localStorage.setItem('theme', 'dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //     localStorage.setItem('theme', 'light');
  //   }
  // }, [isDarkMode]);

  // Remove or comment out the toggleDarkMode function
  // const toggleDarkMode = () => {
  //   setIsDarkMode(prevMode => !prevMode);
  // };

  // Forcing Light Mode:
  // We'll set a constant for `isDarkMode` to `false` since we're removing the toggle
  const isDarkMode = false; // This line ensures it always behaves as light mode for the logo and specific Header styles
  // --- End of Dark Mode Removal ---


  // Effect Hook for Navbar Scroll Behavior (remains unchanged)
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > 200) {
        if (window.scrollY > lastScrollY && !mobileMenu) {
          setShowNavbar("-translate-y-[80px]");
        } else {
          setShowNavbar("shadow-md");
        }
      } else {
        setShowNavbar("translate-y-0");
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", controlNavbar);

    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY, mobileMenu]);

  return (
    <header
      className={`
        w-full h-[60px] md:h-[80px]
        bg-white // Changed from bg-white dark:bg-black to just bg-white
        flex items-center
        z-20 fixed top-0 left-0 right-0
        transition-transform duration-300
        ${showNavbar}
      `}
    >
      <div className="container mx-auto flex items-center px-4 md:px-8 h-full">

        {/* Left Section: Menu Navigation */}
        <div className="flex-1 flex items-center justify-start">
          <MenuNavBar />
        </div>

        {/* Center Section: Logo */}
        <div className="flex items-center justify-center">
          <Link to="/">
            {/* Always use the light mode logo */}
            <img
              src={logoLightMode} // Changed from isDarkMode ? logoDarkMode : logoLightMode to just logoLightMode
              alt="BlackNeko Logo"
              className="cursor-pointer object-contain h-[60px] md:h-[80px] w-auto"
            />
          </Link>
        </div>

        {/* Right Section: UI Controls and Navigation */}
        <div className="flex-1 flex items-center justify-end space-x-2 md:space-x-4">
          {/* Remove or comment out the Dark Mode Toggle button */}
          {/* <button
            onClick={toggleDarkMode}
            className="text-yellow-500 dark:text-white text-xl p-2 rounded-full transition-transform duration-500 hover:rotate-180"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button> */}
          <ContactNav />
          <LoginNav />
        </div>
      </div>
    </header>
  );
};

export default Header;