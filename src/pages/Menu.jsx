import React, { useState, useEffect } from 'react';
import Menu1 from "../assets/menu/blackneko-icon.png";
import Menu2 from "../assets/menu/blackneko-icon.png";
import Menu3 from "../assets/menu/blackneko-icon.png";
import Menu4 from "../assets/menu/blackneko-icon.png";
import Menu5 from "../assets/menu/blackneko-icon.png";

const myMenus =[
  {
    id:1,
    image:Menu1,
    name :"A 1",
    type:"Appetizer"
  },
  {
    id:2,
    image:Menu2,
    name :"A 2",
    type:"Dessert"
  },
  {
    id:3,
    image:Menu3,
    name :"A 3",
    type:"Food"
  },
  {
    id:4,
    image:Menu4,
    name :"A 4",
    type:"Drink"
  },
  {
    id:5,
    image:Menu5,
    name :"A 5",
    type:"Promotion"
  },
];

const Menu = () => {
const [menuType, setMenuType] = useState('All')
const [filteredMenus,setFilteredMenus] = useState([])

  // All Appetizer Dessert Food  Promotion

useEffect(()=>{
  // return roomType === 'all' ? rooms : roomType === room.attributes.type;
  const filtered =  myMenus.filter((menu)=>{
        return menuType === 'All' ? myMenus : menuType === menu.type;
  })
  setFilteredMenus(filtered)
},[menuType])

  return (
    <div>

      {/* tabs  */}
      <div className='w-[240px] lg:w-[540px] lg:h-auto mb-8 mx-auto'>
        <div className='w-full h-full lg:h-[46px] flex flex-col lg:flex-row'>
          <div className='w-full h-full cursor-pointer' onClick={()=>setMenuType('All')}>All</div>
          <div className='w-full h-full cursor-pointer' onClick={()=>setMenuType('Appetizer')}>Appetizer</div>
          <div className='w-full h-full cursor-pointer' onClick={()=>setMenuType('Dessert')}>Dessert</div>
          <div className='w-full h-full cursor-pointer' onClick={()=>setMenuType('Food')}>Food</div>
          <div className='w-full h-full cursor-pointer' onClick={()=>setMenuType('Drink')}>Drink</div>
          <div className='w-full h-full cursor-pointer' onClick={()=>setMenuType('Promotion')}>Promotion</div>
        </div>
      </div>
       {/* Menu  */}
       <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {filteredMenus.map((mnu,idx)=>{
          return <div key={idx}>
            <div className='relative w-full h-[300px] overflow-hidden mb-6'>
              <img src={mnu?.image} alt={mnu?.name} className='object-cover'/>
            </div>
            <h3>{mnu?.name}</h3>
          </div>;
        })}
       </div>
    </div>
  )
}

export default Menu