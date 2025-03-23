import React from 'react'
import { Link } from 'react-router-dom';

const lMenus = [
    { id: 1, name: "News / Events", url: "/NewsAndEvent" },
    { id: 2, name: "Menu", url: "/Menu" },
    { id: 3, name: "Cast", url:"/Cast" },
    { id: 4, name: "VIP", url: "/Vip" },
  ];

const LeftMenu = () => {
  return (
    <ul className="hidden md:flex items-center gap-8 font-medium text-black">
        {lMenus.map((menu,idx)=>{
            return <li key={idx} className='cursor-pointer'>
                <Link to={menu?.url}>{menu?.name}</Link>
            </li>
        })}
    </ul>
  )
}

export default LeftMenu