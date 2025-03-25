import React, { useState, useEffect } from 'react';
import { FaStore, FaHeart, FaInfoCircle } from 'react-icons/fa'; // ใช้ไอคอนจาก react-icons

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500); // ใช้ time delay สำหรับการแสดงเนื้อหาหลังจากโหลดเสร็จ

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
        <FaStore size={50} style={iconStyle} />
        <h1>Welcome to Our Med Store</h1>
      </div>
      <div style={textStyle}>
        <p>
          We provide a wide range of medical products designed to meet the needs
          of our customers. Whether you're looking for over-the-counter medicine,
          prescription drugs, or health supplements, we've got you covered!
        </p>
        <p>
          <FaHeart /> Your health is our priority, and we're committed to providing
          the best products with fast and reliable service.
        </p>
        <p>
          <FaInfoCircle /> Visit our store for more information or check out our
          latest offers.
        </p>
      </div>
    </div>
  );
};

export default About;
