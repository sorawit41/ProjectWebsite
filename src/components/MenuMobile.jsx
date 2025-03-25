import React from 'react';
import { Link } from 'react-router-dom';

const Menus = [
  { id: 1, name: "News / Events", url: "/NewsAndEvent" },
  { id: 2, name: "About", url: "/About" },
  { id: 3, name: "Rules", url:"/Rules" },
  { id: 4, name: "Schedule", url: "/Schedule" },
  { id: 5, name: "Receive", url: "/Receive" },
  { id: 6, name: "Media", url: "/media" },
  { id: 7, name: "Menu&Item", url: "/Menu" },
  { id: 8, name: "Cast", url :"/Cast" },
  { id: 9, name: "CastIdol", url: "/idol" },
  { id: 10, name: "Contact", url: "/Contact" },
];

const MenuMobile = ({ setMobileMenu }) => {
  return (
    <ul className="flex flex-col md:hidden absolute top-[50px] left-0 w-full h-[calc(100vh-50px)] bg-white text-black font-sans shadow-lg overflow-auto">
      {Menus.map((menu, idx) => {
        return (
          <Link 
            to={menu?.url} 
            key={idx} 
            onClick={() => setMobileMenu(false)} 
            className="hover:bg-gray-200 transition duration-200 ease-in-out"
          >
            <li className="px-6 py-4 text-xl font-semibold hover:text-blue-600">
              {menu?.name}
            </li>
          </Link>
        );
      })}
    </ul>
  );
};

export default MenuMobile;
