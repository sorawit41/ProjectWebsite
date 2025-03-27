import React, { useState, useEffect } from 'react';

const Schedule = () => {
  const [imageSrc, setImageSrc] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);  // To track image loading

  // This effect runs once when the component mounts, setting the image source
  useEffect(() => {
    const image = '/src/assets/Schedule/Schedule.png';
    setImageSrc(image);
  }, []); // Empty dependency array to run only once after mount

  // This will be called once the image is loaded
  const handleImageLoad = () => {
    setIsLoaded(true);  // Image has loaded, so we trigger the animation
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Schedule"
          className={`max-w-full max-h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}  // Trigger handleImageLoad when image is loaded
        />
      )}
    </div>
  );
}

export default Schedule;
