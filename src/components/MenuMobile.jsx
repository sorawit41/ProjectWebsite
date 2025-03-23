import React from 'react';
import { Link } from 'react-router-dom';

const Menus = [
  { id: 1, name: "News / Events", url: "/NewsAndEvent" },
  { id: 2, name: "Menu", url: "/Menu" },
  { id: 3, name: "Cast", url:"/Cast" },
  { id: 4, name: "Vip", url: "/Vip" },
  { id: 5, name: "Media", url: "/media" },
  { id: 6, name: "Access", url: "/About" },
  { id: 7, name: "About BlackNeko", url :"/About" },
  { id: 8, name: "Contact", url: "/Contact" },
];

const MenuMobile = ({setMobileMenu}) => {
  return (
    <ul className="flex flex-col md:hidden font-bold absolute top-[50px] left-0 w-full h-[calc(100vh-50px)] bg-white text-black">
      {Menus.map((menu,idx)=>{
        return (<Link to={menu?.url} key={idx} onClick={()=>setMobileMenu(false)}>
        <li>{menu?.name}</li>
        </Link>)
      })}
    </ul>
  )
}

export default MenuMobile;