import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const rMenus = [
    { id: 1, name: "Media", url: "/media" },
    { id: 2, name: "Menu / Item", url: "/Menu" },
    { id: 3, name: "Cast", url :"/Cast" },
    { id: 4, name: "CastIdol", url: "/idol" },
    { id: 5, name: "Contact", url: "/Contact" },

  ];
const RightMenu = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
       <ul className="hidden md:flex items-center gap-8 font-medium text-black">
           {rMenus.map((menu,idx)=>{
               const isHovered = hoveredIndex === idx;
               const linkStyle = {
                 transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                 color: isHovered ? '#007bff' : 'black',
                 transition: 'transform 0.2s ease-in-out, color 0.2s ease-in-out',
               };
               return (
                   <li
                     key={idx}
                     onMouseEnter={() => handleMouseEnter(idx)}
                     onMouseLeave={handleMouseLeave}
                     style={linkStyle}
                     className='cursor-pointer'
                   >
                       <Link to={menu?.url}>{menu?.name}</Link>
                   </li>
               );
           })}
       </ul>
  )
}

export default RightMenu;