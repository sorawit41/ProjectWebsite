import React, { useState, useEffect } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa'; // Import icons

import narin from "../assets/cast/image.png";
import icezu from "../assets/cast/image copy.png"


// Data with ranks updated to Trainee, Regular, Master, Manager, Leader, Angel
const cast = [
  { id: 1, image: narin, name: "Narin Blackneko", rank: "kitten" },
  { id: 2, image: icezu, name: "Icezu Blackneko", rank: "kitten" },
];

// Rank filter options
const availableRanks = ['All', 'Trainee', 'kitten','Fairy','Angel'];

const Cast = () => {
  const [rank, setRank] = useState('All');
  const [filteredCast, setFilteredCast] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // For search functionality
  const [fadeIn, setFadeIn] = useState(false); // Added fade-in effect for the grid

  // Effect to filter users based on rank and search term
  useEffect(() => {
    let filtered = cast.filter(user => {
      const matchesRank = rank === 'All' || user.rank.toLowerCase() === rank.toLowerCase();
      const matchesSearchName = user.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSearchRank = user.rank.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesRank && (matchesSearchName || matchesSearchRank);
    });

    setFilteredCast(filtered);
  }, [rank, searchTerm]);

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
    setRank('All');
  };

  return (
    <div className="py-10 pt-20">
      <div className="container mx-auto">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or rank..."
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
              Filter by Rank
              {isFilterOpen ? ' ▲' : ' ▼'}
            </button>
            {rank !== 'All' && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  Filtered by: <span className="font-semibold text-primary-500">{rank}</span>
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
                {availableRanks.map(rankOption => (
                  <button
                    key={rankOption}
                    onClick={() => {
                      setRank(rankOption);
                      toggleFilter(); // Close dropdown after selection
                    }}
                    className={`block py-2 px-4 text-sm text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-300 ${rank === rankOption ? 'bg-primary-100 font-semibold text-primary-700' : ''}`}
                  >
                    {rankOption}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cast Grid with Fade-In Animation */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${fadeIn ? 'opacity-100 transition-opacity duration-1000' : 'opacity-0'}`}
        >
          {filteredCast.map((user, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg"
              style={{
                opacity: fadeIn ? 1 : 0, // Fade-in effect for each cast member
                transform: fadeIn ? 'translateY(0)' : 'translateY(30px)', // Subtle slide-up effect
                transition: 'all 0.5s ease', // Smooth transition for both opacity and transform
              }}
            >
              <div className="relative w-full h-[275px] overflow-hidden mb-4">
              <img src={user.image} alt={user.name} className="object-cover w-full h-full transition-transform duration-500 hover:scale-110 object-mid" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{user.name}</h3>
                <p className="text-gray-600 text-sm">Rank: {user.rank}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cast;