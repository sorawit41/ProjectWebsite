import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player/lazy';

const youtubes = [
  {
    id: 1,
    url: 'https://www.youtube.com/watch?v=9f1TJG4cRTI&pp=ygUJYmxhY2tuZWtv', // เปลี่ยน url เป็น url ที่ใช้งานได้
  },
  {
    id: 2,
    url: 'https://www.youtube.com/watch?v=9f1TJG4cRTI&pp=ygUJYmxhY2tuZWtv', // เปลี่ยน url เป็น url ที่ใช้งานได้
  },
  {
    id: 3,
    url: 'https://www.youtube.com/watch?v=9f1TJG4cRTI&pp=ygUJYmxhY2tuZWtv', // เปลี่ยน url เป็น url ที่ใช้งานได้
  },
  {
    id: 4,
    url: 'https://www.youtube.com/watch?v=9f1TJG4cRTI&pp=ygUJYmxhY2tuZWtv', // เปลี่ยน url เป็น url ที่ใช้งานได้
  },

];

const Media = () => {
  // State for managing fade-in animation
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Set a timeout to trigger fade-in animation after the component is mounted
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 500); // 500ms delay before the fade-in starts

    // Clean up the timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-semibold text-center mb-8">วิดีโอเกี่ยวกับร้าน</h2>

      {/* Apply animation on the grid */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${
          fadeIn ? 'opacity-100 transition-opacity duration-1000' : 'opacity-0'
        }`}
      >
        {youtubes.map((yu, ) => {
          return (
            <div
              key={yu.id}
              className="rounded-lg shadow-md overflow-hidden transition-transform duration-500 ease-in-out"
              style={{
                opacity: fadeIn ? 1 : 0, // Set initial opacity to 0 and transition to 1
                transform: fadeIn ? 'translateY(0)' : 'translateY(30px)', // Add a subtle slide-in effect
              }}
            >
              <div className="w-full aspect-video">
                <ReactPlayer
                  controls={true}
                  url={yu?.url}
                  width="100%"
                  height="100%"
                  onError={() => (
                    <div className="flex items-center justify-center bg-gray-100 h-full">
                      <p className="text-red-500">Video not available.</p>
                    </div>
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Media;