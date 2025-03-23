import React from 'react'
import { Link } from 'react-router-dom';

const rMenus = [
    { id: 1, name: "Media", url: "/media" },
    { id: 2, name: "Access", url: "/About" },
    { id: 3, name: "About BlackNeko", url :"/About" },
    { id: 4, name: "Contact", url: "/Contact" },
  ];
const RightMenu = () => {
  return (
       <ul className="hidden md:flex items-center gap-8 font-medium text-black">
           {rMenus.map((menu,idx)=>{
               return <li key={idx} className='cursor-pointer'>
                   <Link to={menu?.url}>{menu?.name}</Link>
               </li>
           })}
       </ul>
  )
}

export default RightMenu
