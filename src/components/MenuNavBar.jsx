import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { FaTimes } from 'react-icons/fa';
import { BsChevronDown } from 'react-icons/bs';

// Import your logo image
import logo from '../assets/imgs/blackneko-icon.png';

const Menus = [
  { id: 9, name: "คอนเซปร้าน", url: "/about" },
    { id: 1, name: "อีเว้นท์ต่างๆ", url: "/NewsAndEvent" },
    { id: 2, name: "ตารางกะน้องแมว", url: "/schedule" },
    { id: 7, name: "กฎระเบียบการใช้บริการ", url: "/rules" },
    {
        id: 3, name: "เมนู & ไอเทม", url: "#", children: [
            { id: 12, name: "เมนูเครื่องดื่ม", url: "/DrinkMenu" },
            { id: 13, name: "เมนูอาหาร", url: "/MainMenu" },
        ]
    },
    { id: 4, name: "รายชื่อน้องแมว", url: "/cast" },
    { id: 10, name: "รับสมัครน้องแมว", url: "/receive" },
    { id: 11, name: "ติดต่อ", url: "/contact" },
];

const MenuNavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuItemOpen, setMenuItemOpen] = useState(null);
    const menuRef = useRef(null);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleMenuItem = (menuId) => {
        setMenuItemOpen(menuItemOpen === menuId ? null : menuId);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen, menuRef]);

    return (
        <div className="relative z-5">
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
                {/* Hamburger icon */}
                <HiOutlineMenuAlt2 className="text-2xl dark:text-white" style={{ fontSize: '1.5rem' }} />
            </button>

            {/* Side Navbar */}
            <div
                ref={menuRef}
                className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-md transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'} dark:bg-gray-800 z-50`}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    width: '16rem',
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.3s ease-in-out',
                    zIndex: 50,
                }}
            >
                {/* Logo container */}
                <div className="flex items-center justify-center py-4" style={{ padding: '1rem' }}>
                    <Link to="/">
                        <img src={logo} alt="Logo" className="h-12 cursor-pointer" style={{ height: '5rem' }} />
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
                    {/* Close icon */}
                    <FaTimes className="text-2xl dark:text-black" style={{ fontSize: '1.5rem' }} />
                </button>

                <ul className="space-y-2 py-4 px-4 mt-2" style={{ marginTop: '0.5rem', padding: '1rem', listStyleType: 'none', margin: 0, paddingLeft: '1rem' }}>
                    {Menus.map((menu) => {
                        if (menu.children) {
                            return (
                                <li key={menu.id} style={{ marginBottom: '0.75rem' }}>
                                    <div
                                        className="flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md cursor-pointer transition duration-200 dark:text-white dark:hover:bg-gray-700 dark:hover:text-gray-300"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '0.5rem 0.75rem',
                                            color: '#4b5563',
                                            borderRadius: '0.375rem',
                                            transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
                                            textDecoration: 'none',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => toggleMenuItem(menu.id)}
                                         onMouseOver={(e) => {
                                            if (menuItemOpen !== menu.id) {
                                              e.target.style.backgroundColor = '#f3f4f6';
                                              e.target.style.color = '#1f2937';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (menuItemOpen !== menu.id) {
                                              e.target.style.backgroundColor = '';
                                              e.target.style.color = '#4b5563';
                                            }
                                        }}
                                    >
                                        {menu.name}
                                        <BsChevronDown
                                            className={`transition-transform duration-300 ${menuItemOpen === menu.id ? 'rotate-180' : 'rotate-0'}`}
                                            style={{ fontSize: '1rem' }}
                                        />
                                    </div>
                                    {menuItemOpen === menu.id && (
                                        <ul className="ml-4 space-y-2" style={{ marginLeft: '1rem', marginTop: '0.5rem', listStyleType: 'none' }}>
                                            {menu.children.map((child) => (
                                                <li key={child.id} style={{ marginBottom: '0.75rem' }}>
                                                    <Link
                                                        to={child.url}
                                                        className="block px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition duration-200 dark:text-white dark:hover:bg-gray-700 dark:hover:text-gray-300"
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
                                                        {child.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        }
                        
                        return (
                            <li key={menu.id} style={{ marginBottom: '0.75rem' }}>
                                <Link
                                    to={menu.url}
                                    className="block px-3 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition duration-200 dark:text-white dark:hover:bg-gray-700 dark:hover:text-gray-300"
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
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default MenuNavBar;

