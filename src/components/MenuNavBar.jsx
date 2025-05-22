import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { FaTimes } from 'react-icons/fa';
import { BsChevronDown } from 'react-icons/bs';
import { supabase } from '../pages/supabaseClient'; // Make sure this path is correct

// Import your logo image
import logo from '../assets/logo/logo.png'; // Make sure this path is correct

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

const loggedInUserMenus = [
  { id: 100, name: "สั่งซื้อสินค้า", url: "./ProductListPage" },
  { id: 101, name: "ติดตามสินค้า", url: "/OrderTrackingPage" },
];

const MenuNavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuItemOpen, setMenuItemOpen] = useState(null);
  const menuRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    fetchUserSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) { // If opening the menu, don't do anything to submenus
        // If closing the menu, reset open submenu
        setMenuItemOpen(null);
    }
  };

  const toggleMenuItem = (menuId) => {
    setMenuItemOpen(menuItemOpen === menuId ? null : menuId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
        setMenuItemOpen(null); // Also close submenu when clicking outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleLinkClick = () => {
    setMenuOpen(false);
    // No need to setMenuItemOpen(null) here as toggleMenu or handleClickOutside will handle it if menu closes
  };

  const handleSubMenuLinkClick = () => {
    setMenuOpen(false);
    setMenuItemOpen(null); // Explicitly close submenu as well
  }

  const menuItemClasses = "block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors duration-200 ease-in-out";
  const menuParentItemClasses = `flex items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-md cursor-pointer transition-colors duration-200 ease-in-out`;

  return (
    <div className="relative z-50">
      <button
        className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        onClick={toggleMenu}
        aria-label="Toggle Navigation"
      >
        <HiOutlineMenuAlt2 className="text-xl" />
      </button>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm md:hidden"
          onClick={toggleMenu} // Allow closing by clicking backdrop
          aria-hidden="true"
        />
      )}

      {/* Sidebar Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-screen w-72 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out z-[60] flex flex-col
                    ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`} // Increased z-index for sidebar
      >
        {/* Header: Logo and Close button */}
        <div className="relative flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <Link to="/" onClick={handleLinkClick} className="inline-block">
            <img src={logo} alt="Logo" className="h-16" />
          </Link>
          <button
            className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none"
            onClick={toggleMenu}
            aria-label="Close Navigation"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Scrollable Menu Content Area */}
        <div className="flex-grow overflow-y-auto">
          <ul className="py-4 px-3 space-y-1.5">
            {Menus.map((menu) => {
              if (menu.children) {
                const isOpen = menuItemOpen === menu.id;
                return (
                  <li key={menu.id}>
                    <div
                      className={`${menuParentItemClasses} ${isOpen ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                      onClick={() => toggleMenuItem(menu.id)}
                    >
                      {menu.name}
                      <BsChevronDown
                        className={`text-sm transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                      />
                    </div>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                      // style={{ maxHeight: isOpen ? '500px' : '0' }} // Alternative if max-h-96 is not enough, or use JS to calculate height
                    >
                      {/* Conditionally render UL only when open to ensure clean collapse */}
                      {isOpen && (
                         <ul className="pl-4 mt-1 space-y-1.5 pt-1 pb-2"> {/* Added some padding for submenu list */}
                          {menu.children.map((child) => (
                            <li key={child.id}>
                              <Link
                                to={child.url}
                                onClick={handleSubMenuLinkClick} // Use specific handler for submenu links
                                className={menuItemClasses}
                              >
                                {child.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                );
              }

              return (
                <li key={menu.id}>
                  <Link
                    to={menu.url}
                    onClick={handleLinkClick}
                    className={menuItemClasses}
                  >
                    {menu.name}
                  </Link>
                </li>
              );
            })}

            {/* Logged In User Menus */}
            {user && (
              <>
                <li className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="block px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    สมาชิก
                  </span>
                </li>
                {loggedInUserMenus.map((loggedInMenu) => (
                  <li key={loggedInMenu.id}>
                    <Link
                      to={loggedInMenu.url}
                      onClick={handleLinkClick}
                      className={menuItemClasses}
                    >
                      {loggedInMenu.name}
                    </Link>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>

        {/* Footer: User Info and Logout */}
        {user && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate" title={user.email}>{user.email}</p>
                <button
                    onClick={async () => {
                        await supabase.auth.signOut();
                        setUser(null);
                        setMenuOpen(false); // Close menu on logout
                        setMenuItemOpen(null); // Reset submenu
                    }}
                    className="w-full mt-2 text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-700/30 rounded-md transition-colors"
                >
                    ออกจากระบบ
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default MenuNavBar;