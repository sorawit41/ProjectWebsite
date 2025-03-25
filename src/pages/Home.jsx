import React, { useState, useEffect } from 'react';
import { HeroBanner } from '../components';

const Home = () => {
  const [fadeIn, setFadeIn] = useState(false);

  // This useEffect will trigger the fade-in animation when the component is mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 500); // Delay to start animation after 500ms
    return () => clearTimeout(timer); // Cleanup on component unmount
  }, []);

  return (
    <div style={{ opacity: fadeIn ? 1 : 0, transition: 'opacity 1s ease-in-out' }}>
      <HeroBanner />
      {/* Add the Featured component here with animation */}
      <div style={{ opacity: fadeIn ? 1 : 0, transition: 'opacity 1s ease-in-out', marginTop: '20px' }}>
      </div>
    </div>
  );
};

export default Home;
