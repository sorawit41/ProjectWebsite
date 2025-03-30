import React, { useState, useEffect } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa'; // Import icons

import Promotion from '../components/Promotion';  // Capitalize the component name to follow convention
import Menu1 from '../assets/menu/image.png';
import Menu2 from '../assets/menu/image3.png';
import unknow from '../assets/menu/blackneko-icon.png';
import Menu4 from '../assets/menu/blackneko-icon.png';
import Menu5 from '../assets/menu/blackneko-icon.png';

const myMenus = [
  { id: 1, image: Menu1, name: 'Hana meow(น้ำโปรโมชั่น)', type: 'Promotion', price: 150 },
  { id: 2, image: Menu2, name: 'Ice cream', type: 'Promotion', price: 80 },
  { id: 3, image: unknow, name: 'French Fries(S/L)เฟรนซ์ฟราย', type: 'Appetizer', price: '90/150' },
  { id: 4, image: unknow, name: 'Edamame ถั่วแระญี่ปุ่น', type: 'Appetizer', price: 90 },
  { id: 5, image: unknow, name: 'Nachos นาโช่', type: 'Appetizer', price: 180 },
  { id: 7, image: unknow, name: 'สาหร่ายกรอบ (Crispy seaweed)', type: 'Appetizer', price: 180 },
  { id: 8, image: unknow, name: 'เม็ดมะม่วงหิมพานต์ (Cashew nuts)', type: 'Appetizer', price: 180 },
  { id: 9, image: unknow, name: 'ซุปครีมเห็ด (Cream of Mushroom Soup)', type: 'Appetizer', price: 180 },
  { id: 10, image: unknow, name: 'เนื้อย่าง Black Neko (Grilled meat)', type: 'Appetizer', price: 180 },
  { id: 11, image: unknow, name: 'ปูอัดวาซาบิ (Wasabi crab sticks)', type: 'Appetizer', price: 180 },
  { id: 12, image: unknow, name: 'ทาโกะยากิ (Takoyaki)', type: 'Appetizer', price: 180 },
  { id: 13, image: unknow, name: 'เกี๊ยวซ่า (ไก่) (Gyoza (Chicken))', type: 'Appetizer', price: 180 },
  { id: 14, image: unknow, name: 'ไก่คาราเกะ (Karaage)', type: 'Appetizer', price: 180 },
  { id: 15, image: unknow, name: 'เอ็นแก้ว / Chicken tendons', type: 'Appetizer', price: 180 },
  { id: 16, image: unknow, name: 'ไก่ทอด Black Neko (Chicken Black Neko)', type: 'Appetizer', price: 180 },
  { id: 17, image: unknow, name: 'ทาโกะวาซาบิ (Takowasabi)', type: 'Appetizer', price: 180 },
  { id: 18, image: unknow, name: 'ลวกจิ้มลูกชิ้นห้าสหาย (Boiled and dipped meatballs)', type: 'Appetizer', price: 180 },
  { id: 19, image: unknow, name: 'ท้องปลาแซลมอนย่าง (Grilled salmon belly)', type: 'Appetizer', price: 220 },
  { id: 20, image: unknow, name: 'ยำเม็ดมะม่วง / หมูยอ (Cashew nuts salad / pork sausage)', type: 'Appetizer', price: 180 },
  { id: 21, image: unknow, name: 'ปีกไก่นิวออร์ลีนส์ (New Orleans Chicken Wings)', type: 'Appetizer', price: 180 },
  { id: 22, image: unknow, name: 'สปาเก็ตตี้คาโบนาร่า (Spaghetti Carbonara)', type: 'Main Dish', price: 280 },
  { id: 23, image: unknow, name: 'ไส้กรอกรวม (Mixed Sausage)', type: 'Main Dish', price: 380 },
  { id: 24, image: unknow, name: 'เบคอนทอดห่อสาหร่าย + ข้าว (Fried Bacon with Seaweed + Rice)', type: 'Main Dish', price: 380 },
  { id: 25, image: unknow, name: 'ข้าวแกงกะหรี่ไข่ข้น (Creamy Egg Curry Rice)', type: 'Main Dish', price: 280 },
  { id: 26, image: unknow, name: 'ปลาซาบะย่าง + ข้าวสวย (Grilled Saba + Rice)', type: 'Main Dish', price: 350 },
  { id: 27, image: unknow, name: 'ข้าวเปล่า (Rice)', type: 'Main Dish', price: 30 },
  { id: 28, image: unknow, name: 'ข้าวแกงกะหรี่ไข่ข้น (Curry rice)', type: 'Main Dish', price: 280 },
  { id: 29, image: unknow, name: 'ทงคัตสึ (Topping)', type: 'Main Dish', price: 100 },
  { id: 30, image: unknow, name: 'Strawberry Sundae Ice Cream', type: 'Ice cream', price: 80 },
  { id: 31, image: unknow, name: 'Vanilla Sundae Ice Cream', type: 'Ice cream', price: 80 },
  { id: 32, image: unknow, name: 'Chocolate Sundae Ice Cream', type: 'Ice cream', price: 80 },
  { id: 33, image: unknow, name: 'Strawberry Funfetti Ice Cream', type: 'Ice cream', price: 190 },
  { id: 34, image: unknow, name: 'Vanilla Funfetti Ice Cream', type: 'Ice cream', price: 190 },
  { id: 35, image: unknow, name: 'Chocolate Funfetti Ice Cream', type: 'Ice cream', price: 190 },
  { id: 36, image: unknow, name: 'Ice cream Italian soda Fancy', type: 'Ice cream', price: 270 },
  { id: 37, image: unknow, name: 'โซดา (Soda)', type: 'Drink', price: 40 },
  { id: 38, image: unknow, name: 'โค้ก (Cola)', type: 'Drink', price: 50 },
  { id: 39, image: unknow, name: 'โค้กซีโร่ (Cola Zero)', type: 'Drink', price: 50 },
  { id: 40, image: unknow, name: 'สไปรท์ (Sprite)', type: 'Drink', price: 50 },
  { id: 41, image: unknow, name: 'แฟนต้า (ส้ม, สตรอว์เบอร์รี)', type: 'Drink', price: 50 },
  { id: 42, image: unknow, name: 'น้ำผลไม้ (แอปเปิ้ล, ส้ม, สับปะรด)', type: 'Drink', price: 90 },
  { id: 43, image: unknow, name: 'นมเย็น (Ice Milk)', type: 'Drink', price: 90 },
  { id: 44, image: unknow, name: 'นมชมพูเย็น (Ice Pink Milk)', type: 'Drink', price: 180 },
  { id: 45, image: unknow, name: 'โกโก้เย็น (Ice Cocoa)', type: 'Drink', price: 180 },
  { id: 46, image: unknow, name: 'ยูสุ อิตาเลียนโซดา (Yuzu Italian Soda)', type: 'Drink', price: 180 },
  { id: 47, image: unknow, name: 'พีช อิตาเลียนโซดา (Peach Italian Soda)', type: 'Drink', price: 180 },
  { id: 48, image: unknow, name: 'สตรอว์เบอร์รี อิตาเลียนโซดา (Strawberry Italian Soda)', type: 'Drink', price: 180 },
  { id: 49, image: unknow, name: 'อิตาเลียนโซดาโฟลต (Italian Soda Float)', type: 'Drink', price: 220 },
  { id: 50, image: unknow, name: 'น้ำเปล่า (Still Water)', type: 'Drink', price: 40 },
  { id: 51, image: unknow, name: 'โฮลการ์เด้น S', type: 'Beer', price: 280 },
  { id: 52, image: unknow, name: 'โฮลการ์เด้น L', type: 'Beer', price: 480 },
  { id: 53, image: unknow, name: 'โฮลการ์เด้น (โรเซ่) S', type: 'Beer', price: 280 },
  { id: 54, image: unknow, name: 'โฮลการ์เด้น (โรเซ่) L', type: 'Beer', price: 480 },
  { id: 55, image: unknow, name: 'โฮลการ์เด้น (เกรป) S', type: 'Beer', price: 280 },
  { id: 56, image: unknow, name: 'โฮลการ์เด้น (เกรป) L', type: 'Beer', price: 480 },
  { id: 57, image: unknow, name: 'อาซาฮี S', type: 'Beer', price: 195 },
  { id: 58, image: unknow, name: 'ซากุระ S', type: 'Beer', price: 235 },
  { id: 59, image: unknow, name: 'เมลอน S', type: 'Beer', price: 235 },
  { id: 60, image: unknow, name: 'สตรอว์เบอร์รี S', type: 'Beer', price: 235 },
  { id: 61, image: unknow, name: 'พีช S', type: 'Beer', price: 235 },
  { id: 62, image: unknow, name: 'ยูสุ S', type: 'Beer', price: 235 },
  { id: 63, image: unknow, name: 'อาซาฮี L', type: 'Beer', price: 395 },
  { id: 64, image: unknow, name: 'ซากุระ L', type: 'Beer', price: 435 },
  { id: 65, image: unknow, name: 'เมลอน L', type: 'Beer', price: 435 },
  { id: 66, image: unknow, name: 'สตรอว์เบอร์รี L', type: 'Beer', price: 435 },
  { id: 67, image: unknow, name: 'พีช L', type: 'Beer', price: 435 },
  { id: 68, image: unknow, name: 'ยูสุ L', type: 'Beer', price: 435 },
  { id: 69, image: unknow, name: 'ไฮเนเก้น นอน แอลกอฮอล์', type: 'Beer', price: 195 },
  { id: 70, image: unknow, name: 'อัฟโฟกาโต้', type: 'Coffee', price: 200 },
  { id: 71, image: unknow, name: 'อเมริกาโน่ (ร้อน)', type: 'Coffee', price: 130 },
  { id: 72, image: unknow, name: 'อเมริกาโน่ (เย็น)', type: 'Coffee', price: 150 },
  { id: 73, image: unknow, name: 'เอสเปรสโซ่', type: 'Coffee', price: 130 },
  { id: 74, image: unknow, name: 'ลาเต้ (ร้อน)', type: 'Coffee', price: 150 },
  { id: 75, image: unknow, name: 'ลาเต้ (เย็น)', type: 'Coffee', price: 170 },
  { id: 76, image: unknow, name: 'คาราเมล มัคคิอาโต้ (ร้อน)', type: 'Coffee', price: 200 },
  { id: 77, image: unknow, name: 'คาราเมล มัคคิอาโต้ (เย็น)', type: 'Coffee', price: 230 },
  { id: 78, image: unknow, name: 'ชาร้อน (Omakase)', type: 'Tea', price: 180 },
  { id: 79, image: unknow, name: 'ชามะนาวเย็น', type: 'Tea', price: 130 },
  { id: 80, image: unknow, name: 'ชาพีชเย็น', type: 'Tea', price: 130 },
  { id: 81, image: unknow, name: 'มัทฉะลาเต้ (ร้อน)', type: 'Tea', price: 190 },
  { id: 82, image: unknow, name: 'มัทฉะลาเต้ (เย็น)', type: 'Tea', price: 230 },
  { id: 83, image: unknow, name: 'มัทฉะทำเอง', type: 'Tea', price: 320 },
  { id: 84, image: unknow, name: 'สาเก ฟูจิซัง', type: 'Spirit', price: 3500 },
  { id: 85, image: unknow, name: 'สาเก จุนไม โกลด์', type: 'Spirit', price: 700 },
  { id: 86, image: unknow, name: 'อาร์ต เดอ วีฟ', type: 'Spirit', price: 6000 },
  { id: 87, image: unknow, name: 'ยูเมะ ฮิบิกิ (ออริจินัล)', type: 'Spirit', price: 12000 },
  { id: 88, image: unknow, name: 'ยูเมะ ฮิบิกิ (โรเซ่)', type: 'Spirit', price: 12000 },
  { id: 89, image: unknow, name: 'อุเมะชู ช็อต', type: 'Spirit', price: 280 },
  { id: 90, image: unknow, name: 'อุเมะชู โซดา', type: 'Spirit', price: 280 },
  { id: 91, image: unknow, name: 'วิสกี้ ออน เดอะ ร็อค (Regency / Silver Knight)', type: 'Spirit', price: 280 },
  { id: 92, image: unknow, name: 'พรีเมียม: วิสกี้ ออน เดอะ ร็อค (Hennessy / Black Burn 40 ml.)', type: 'Spirit', price: 480 },
  { id: 93, image: unknow, name: 'แจ็ค แดเนียล กับ โค้ก', type: 'Spirit', price: 380 },
  { id: 94, image: unknow, name: 'ไฮ-บอล (Santory Kakubin / Jim Beam (Bourbon/Honey))', type: 'Spirit', price: 330 },
  { id: 95, image: unknow, name: 'Diva Pina Colada', type: 'Sparkling Wine', price: 1200 },
  { id: 96, image: unknow, name: 'Diva Melon', type: 'Sparkling Wine', price: 1200 },
  { id: 97, image: unknow, name: 'Diva Passion Fruit', type: 'Sparkling Wine', price: 1200 },
  { id: 98, image: unknow, name: 'Diva Pina Peach', type: 'Sparkling Wine', price: 1200 },
  { id: 99, image: unknow, name: 'Chamdeville Rose', type: 'Sparkling Wine', price: 3000 },
  { id: 100, image: unknow, name: 'Bottega Rose', type: 'Sparkling Wine', price: 5000 },
  { id: 101, image: unknow, name: 'Cupid', type: 'Sparkling Wine', price: 5000 },
  { id: 102, image: unknow, name: 'Aviva / Dream (Glitter)', type: 'Sparkling Wine', price: 5000 },
  { id: 103, image: unknow, name: 'Golden Rose', type: 'Sparkling Wine', price: 8000 },
  { id: 104, image: unknow, name: 'Princess Rose', type: 'Sparkling Wine', price: 8000 },
  { id: 105, image: unknow, name: 'Non-Alc. Premier Salute', type: 'Sparkling Wine', price: 1000 },
  { id: 106, image: unknow, name: 'Remove Alc. Wine', type: 'Sparkling Wine', price: 2000 },
  { id: 107, image: unknow, name: 'Angel Brut Millesnme 2007 Limited edition', type: 'Sparkling Wine', price: 2000 }

];

const Menu = () => {
  const [menuType, setMenuType] = useState('All');
  const [filteredMenus, setFilteredMenus] = useState(myMenus); // Initialize with all menus
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [fadeIn, setFadeIn] = useState(false); // Added fade-in effect for the grid

  const availableTypes = [
    'All', 'Appetizer', 'Food', 'Dessert', 'Drink', 'SoftDrink', 'Coffee', 'Ice cream',
    'Cocktail', 'Mocktail', 'Beer', 'Champagne', 'Soju', 'Spirit','Sparkling Wine','Promotion', 'Live show', 'Chame'
  ];

  // Effect to filter menus based on type and search term
  useEffect(() => {
    let filtered = myMenus.filter(menu => {
      const matchesType = menuType === 'All' || menu.type === menuType;
      const matchesSearch = searchTerm.toLowerCase() === '' || menu.name.toLowerCase().includes(searchTerm.toLowerCase()) || menu.type.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
    setFilteredMenus(filtered);
  }, [menuType, searchTerm]);

  // Effect to trigger fade-in animation after component is mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true); // Start fade-in effect after a short delay
    }, 100); // Reduced delay for faster feedback

    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, []);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const clearFilter = () => {
    setMenuType('All');
    setIsFilterOpen(false);  // Close filter dropdown when clearing filter
    setSearchTerm(''); // Clear the search term as well
  };

  return (
    <div>
      <Promotion />  {/* Render the Promotion component */}

      <div className="py-10">
        <div className="container mx-auto">
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search menu name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-3 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Filter Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 md:mb-2">
              <button
                onClick={toggleFilter}
                className="bg-primary-100 text-primary-500 py-2 px-4 rounded-md hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-300 flex items-center shadow-sm"
              >
                <FaFilter className="mr-2" />
                Filter by Type
                {isFilterOpen ? ' ▲' : ' ▼'}
              </button>
              {(menuType !== 'All' || searchTerm !== '') && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    {menuType !== 'All' && `Filtered by: `}
                    {menuType !== 'All' && <span className="font-semibold text-primary-500">{menuType}</span>}
                    {menuType !== 'All' && searchTerm !== '' && ' and '}
                    {searchTerm !== '' && `Searching for: `}
                    {searchTerm !== '' && <span className="font-semibold text-primary-500">{searchTerm}</span>}
                  </span>
                  <button
                    onClick={clearFilter}
                    className="text-sm text-red-500 hover:text-red-700 focus:outline-none flex items-center"
                  >
                    <FaTimes className="mr-1" /> Clear
                  </button>
                </div>
              )}
            </div>
            {isFilterOpen && (
              <div className="bg-white rounded-md shadow-md p-4 mt-2 border border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => {
                        setMenuType(type);
                        toggleFilter(); // Close dropdown after selection
                      }}
                      className={`block py-2 px-4 text-sm text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-300 ${menuType === type ? 'bg-primary-100 font-semibold text-primary-700' : ''}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Menu Grid with Fade-In Animation */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${fadeIn ? 'opacity-100 transition-opacity duration-500' : 'opacity-0'}`}
          >
            {filteredMenus.map((menu, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg"
                style={{
                  opacity: fadeIn ? 1 : 0, // Fade-in effect for each menu item
                  transform: fadeIn ? 'translateY(0)' : 'translateY(20px)', // Subtle slide-up effect
                  transition: 'all 0.3s ease-in-out', // Smoother transition
                  transitionDelay: `${idx * 50}ms`, // Stagger the animation
                }}
              >
                <div className="relative w-full h-[200px] overflow-hidden mb-4">
                  <img src={menu.image} alt={menu.name} className="object-cover w-full h-full transition-transform duration-500 hover:scale-110" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{menu.name}</h3>
                  <p className="text-gray-600 text-sm">Type: {menu.type}</p>
                  {menu.price && <p className="text-gray-700 font-medium">Price: {menu.price} THB</p>} {/* Display price if available */}
                </div>
              </div>
            ))}
            {filteredMenus.length === 0 && (
              <div className="col-span-full text-center py-6">
                <p className="text-gray-500">No menu items found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;