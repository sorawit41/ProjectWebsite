import React, { useState, useEffect } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa'; // Import icons

import Promotion from '../components/promotion';  // Capitalize the component name to follow convention
import Menu1 from '../assets/menu/blackneko-icon.png';
import Menu2 from '../assets/menu/blackneko-icon.png';
import Menu3 from '../assets/menu/blackneko-icon.png';
import Menu4 from '../assets/menu/blackneko-icon.png';
import Menu5 from '../assets/menu/blackneko-icon.png';

const myMenus = [
  { id: 1, image: Menu1, name: 'Spicy Chicken Wings', type: 'Appetizer' },
  { id: 2, image: Menu2, name: 'Chocolate Lava Cake', type: 'Dessert' },
  { id: 3, image: Menu3, name: 'Beef Burger', type: 'Food' },
  { id: 4, image: Menu4, name: 'Iced Coffee', type: 'Drink' },
  { id: 5, image: Menu5, name: 'Summer Combo Deal', type: 'Promotion' },
  { id: 6, image: Menu1, name: 'Margarita', type: 'Cocktail' },
  { id: 7, image: Menu2, name: 'Strawberry Smoothie', type: 'SoftDrink' },
  { id: 8, image: Menu3, name: 'Vegetarian Pizza', type: 'Food' },
  { id: 9, image: Menu4, name: 'Green Tea', type: 'Drink' },
  { id: 10, image: Menu5, name: 'Weekend Brunch', type: 'Promotion' },
];

const Menu = () => {
  const [menuType, setMenuType] = useState('All');
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [fadeIn, setFadeIn] = useState(false); // Added fade-in effect for the grid

  const availableTypes = [
    'All', 'Appetizer', 'Main', 'Dessert', 'Food', 'Drink', 'SoftDrink', 'Coffee', 'Ice cream',
    'Cocktail', 'Mocktail', 'Beer', 'Champagne', 'Soju', 'Promotion', 'Like show', 'Chame'
  ];

  // Effect to filter menus based on type and search term
  useEffect(() => {
    let filtered = myMenus.filter(menu => {
      const matchesType = menuType === 'All' || menu.type === menuType;
      const matchesSearch = menu.name.toLowerCase().includes(searchTerm.toLowerCase()) || menu.type.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesType && matchesSearch;
    });

    setFilteredMenus(filtered);
  }, [menuType, searchTerm]);

  // Effect to trigger fade-in animation after component is mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true); // Start fade-in effect after a short delay
    }, 500); // 500ms delay before fade-in starts

    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, []);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const clearFilter = () => {
    setMenuType('All');
    setIsFilterOpen(false);  // Close filter dropdown when clearing filter
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
              {menuType !== 'All' && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    Filtered by: <span className="font-semibold text-primary-500">{menuType}</span>
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
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${fadeIn ? 'opacity-100 transition-opacity duration-1000' : 'opacity-0'}`}
          >
            {filteredMenus.map((menu, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg"
                style={{
                  opacity: fadeIn ? 1 : 0, // Fade-in effect for each menu item
                  transform: fadeIn ? 'translateY(0)' : 'translateY(30px)', // Subtle slide-up effect
                  transition: 'all 0.5s ease', // Smooth transition for both opacity and transform
                }}
              >
                <div className="relative w-full h-[200px] overflow-hidden mb-4">
                  <img src={menu.image} alt={menu.name} className="object-cover w-full h-full transition-transform duration-500 hover:scale-110" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{menu.name}</h3>
                  <p className="text-gray-600 text-sm">Type: {menu.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
