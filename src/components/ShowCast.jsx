import React, { useState, useEffect } from 'react';
import { FaCat } from 'react-icons/fa';
import narin from "../assets/cast/image.png";
import icezu from "../assets/cast/image copy.png"

// Data with ranks updated to Trainee, Regular, Master, Manager, Leader, Angel
const cast = [
  { id: 1, image: narin, name: "Narin Blackneko", rank: "kitten" },
  { id: 2, image: icezu, name: "Icezu Blackneko", rank: "kitten" },
];

const Cast = () => {
  const [filteredCast, setFilteredCast] = useState(cast); // Initially show all cast members
  const [fadeIn, setFadeIn] = useState(false); // Added fade-in effect for the grid

  // Effect to trigger fade-in animation after component is mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true); // Start fade-in effect after a short delay
    }, 500); // 500ms delay before fade-in starts

    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, []);

  return (
    <div className="py-10 px-4 pt-20">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8 flex items-center justify-center">
          <FaCat className="mr-2 text-black dark:text-white" /> {/* Icon with margin */}
          เหล่าๆน้องแมว
        </h2>
        {/* Cast Grid with Fade-In Animation */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${fadeIn ? 'opacity-100 transition-opacity duration-1000' : 'opacity-0'}`}
        >
          {filteredCast.map((user, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-black rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg"
              style={{
                opacity: fadeIn ? 1 : 0, // Fade-in effect for each cast member
                transform: fadeIn ? 'translateY(0)' : 'translateY(30px)', // Subtle slide-up effect
                transition: 'all 0.5s ease', // Smooth transition for both opacity and transform
              }}
            >
              <div className="relative w-full h-[275px] overflow-hidden mb-4">
                <img
                  src={user.image}
                  alt={user.name}
                  className="object-cover w-full h-full transition-transform duration-500 hover:scale-110 object-mid"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{user.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Rank: {user.rank}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cast;
