import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const lMenus = [
    { id: 1, name: "News / Events", url: "/NewsAndEvent" },
    { id: 2, name: "About", url: "/About" },
    { id: 3, name: "Rules", url:"/Rules" },
    { id: 4, name: "Schedule", url: "/Schedule" },
    { id: 5, name: "Receive", url: "/Receive" }
];

const LeftMenu = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <ul className="hidden md:flex items-center gap-8 font-medium text-black">
        {lMenus.map((menu, idx)=>{
            const isHovered = hoveredIndex === idx;
            const linkStyle = {
              transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
              color: isHovered ? '#007bff' : 'black',
              transition: 'transform 0.2s ease-in-out, color 0.2s ease-in-out', // Optional: for smoother transition
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

export default LeftMenu;