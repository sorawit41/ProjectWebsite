import React, { useState, useEffect } from 'react';
import { HeroBanner, Map, Navbar2 } from '../components';
import { Media, NewsAndEvent } from "../pages"

const Home = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ marginTop: '20px' }}> {/* เพิ่ม margin-top ที่นี่ */}
      <div style={{ opacity: fadeIn ? 1 : 0, transition: 'opacity 1s ease-in-out' }}>
        <HeroBanner />

        {/* Add the Featured component here with animation */}
        <div style={{ opacity: fadeIn ? 1 : 0, transition: 'opacity 1s ease-in-out', marginTop: '20px' }}>
        </div>
        <NewsAndEvent />
        <Map />

      </div>

    </div>
  );
};

export default Home;