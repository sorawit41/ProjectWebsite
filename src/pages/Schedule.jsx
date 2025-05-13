import React, { useState, useEffect } from 'react';
import scheduleImage from '../assets/Schedule/may.png'; // Import image directly

const Schedule = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="flex justify-center items-center min-h-screen pt-20">
      {scheduleImage && (
        <img
          src={scheduleImage}  // Use imported image
          alt="Schedule"
          className={`max-w-full max-h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}
        />
      )}
    </div>
  );
}

export default Schedule;
