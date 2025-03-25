import React, { useState, useEffect } from 'react';
import { FaCoffee, FaHeart, FaInfoCircle, FaUtensils } from 'react-icons/fa';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f9',
    transition: 'opacity 1s ease-in-out',
    opacity: isVisible ? 1 : 0,
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
  };

  const iconStyle = {
    marginRight: '10px',
    color: '#4CAF50',
  };

  const textStyle = {
    fontSize: '1.2rem',
    color: '#555',
    maxWidth: '600px',
    textAlign: 'center',
    marginTop: '20px',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <FaCoffee size={50} style={iconStyle} />
        <h1>Welcome to BlackNeko</h1>
      </div>
      <div style={textStyle}>
        <p>
          Step into a world of delightful service and charming atmosphere at
          [ชื่อ Maid Cafe]! We offer a unique experience where our friendly
          maids are here to make your visit special.
        </p>
        <p>
          <FaUtensils /> Enjoy a variety of delicious drinks, light meals, and
          sweets served with a touch of kawaii.
        </p>
        <p>
          <FaHeart /> We are dedicated to providing a fun and heartwarming
          experience for all our guests.
        </p>
        <p>
          <FaInfoCircle /> Visit us to relax, unwind, and enjoy the company of
          our lovely maids. Check out our menu and special events!
        </p>
      </div>
    </div>
  );
};

export default About;