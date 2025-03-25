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
    padding: '20px', // เพิ่ม padding เพื่อให้มีช่องว่าง
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '30px', // เพิ่มระยะห่างจากด้านล่าง
    fontSize: '2.5rem', // ขยายขนาดตัวอักษร
    fontWeight: 'bold',
    color: '#333',
  };

  const iconStyle = {
    marginRight: '15px', // เพิ่มช่องว่างระหว่างไอคอลและข้อความ
    color: '#4CAF50',
  };

  const textStyle = {
    fontSize: '1.2rem',
    color: '#555',
    maxWidth: '700px', // เพิ่มขนาดสูงสุดของข้อความ
    textAlign: 'left', // จัดข้อความให้ชิดซ้าย
    marginTop: '20px',
    lineHeight: '1.6', // เพิ่มระยะห่างระหว่างบรรทัด
  };

  const paragraphStyle = {
    marginBottom: '20px', // เพิ่มระยะห่างระหว่างย่อหน้า
    display: 'flex',
    alignItems: 'center', // จัดไอคอลและข้อความให้อยู่แนวเดียวกัน
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <FaCoffee size={50} style={iconStyle} />
        <h1>Welcome to BlackNeko</h1>
      </div>
      <div style={textStyle}>
        <p style={paragraphStyle}>
          <FaUtensils style={iconStyle} /> Enjoy a variety of delicious drinks, light meals, and
          sweets served with a touch of kawaii.
        </p>
        <p style={paragraphStyle}>
          <FaHeart style={iconStyle} /> We are dedicated to providing a fun and heartwarming
          experience for all our guests.
        </p>
        <p style={paragraphStyle}>
          <FaInfoCircle style={iconStyle} /> Visit us to relax, unwind, and enjoy the company of
          our lovely maids. Check out our menu and special events!
        </p>
      </div>
    </div>
  );
};

export default About;
