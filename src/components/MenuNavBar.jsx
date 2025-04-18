import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { FaTimes } from 'react-icons/fa'; // Import the close icon

// Import your logo image
import logo from '../assets/imgs/blackneko-icon.png'; // Replace './your-logo.png' with the actual path to your logo

const Menus = [
  { id: 1, name: "News & Events", url: "/NewsAndEvent" },
  { id: 2, name: "ตารางกะน้องแมว", url: "/schedule" },
  { id: 3, name: "เมนู & ไอเทม", url: "/Menu" },
  { id: 4, name: "รายชื่อน้องแมว", url: "/cast" },  
  { id: 5, name: "วิดีโอเกี่ยวกับร้าน", url: "/media" },
  { id: 6, name: "กฎระเบียบการใช้บริการ", url: "/rules" },
  { id: 7, name: "ร้านค้า", url: "/Idol" },
  { id: 8, name: "คอนเซปร้าน", url: "/about" },
  { id: 9, name: "รับสมัครน้องแมว", url: "/receive" },
  { id: 10, name: "ติดต่อ", url: "/contact" },
];

const MenuNavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [iconColor, setIconColor] = useState('#374151'); // State to manage the color of the hamburger icon
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setIconColor(menuOpen ? '#374151' : '#ffffff'); // Change icon color when menu opens or closes
  };

  // Close the menu when clicking outside (for overlay behavior)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
        setIconColor('#374151'); // Reset icon color when menu is closed
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen, menuRef]);

  return (
    <div className="relative ">
      {/* Hamburger menu button */}
      <button
        className="hamburger p-2 focus:outline-none"
        onClick={toggleMenu}
        aria-label="Toggle Navigation"
        style={{
          padding: '0.5rem',
          cursor: 'pointer',
          border: 'none',
          background: 'none',
          outline: 'none',
        }}
      >
        <HiOutlineMenuAlt2 className="text-2xl" style={{ fontSize: '1.5rem', color: iconColor }} />
      </button>

      {/* Side Navbar */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-md transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '16rem', // Adjust width as needed
          backgroundColor: '#fff',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
          zIndex: 50, // Ensure it's above other content
        }}
      >     
        {/* Logo container */}
        <div className="flex items-center justify-center py-4" style={{ padding: '1rem' }}>
          <Link to="/">
            <img src={logo} alt="Logo" className="h-12 cursor-pointer" style={{ height: '5rem' }} /> {/* Increased height here */}
          </Link> 
        </div>

        {/* Close button for the side navbar */}
        <button
          className="absolute top-4 right-4 p-2 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Close Navigation"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            padding: '0.5rem',
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            outline: 'none',
          }}
        >
          <FaTimes className="text-2xl text-gray-800" style={{ fontSize: '1.5rem', color: '#374151' }} />
        </button>

        <ul className="space-y-2 py-4 px-4 mt-2" style={{ marginTop: '0.5rem', padding: '1rem', listStyleType: 'none', margin: 0, paddingLeft: '1rem' }}>
          {Menus.map((menu) => (
            <li key={menu.id} style={{ marginBottom: '0.75rem' }}>
              <Link
                to={menu.url}
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition duration-200"
                style={{
                  display: 'block',
                  padding: '0.5rem 0.75rem',
                  color: '#4b5563',
                  borderRadius: '0.375rem',
                  transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
                  textDecoration: 'none',
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.color = '#1f2937';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '';
                  e.target.style.color = '#4b5563';
                }}
              >
                {menu.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MenuNavBar;
