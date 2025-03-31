import React, { useState, useEffect } from 'react';
import scheduleImage from '../assets/Schedule/image.png'; // Import image directly

const Schedule = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
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
