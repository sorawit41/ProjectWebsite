import React, { useState, useEffect } from 'react';
import iconnobg from "../assets/imgs/iconnobg.png"; // Import the image correctly

const Navbar2 = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle image click to expand/collapse the logo size
  const handleImageClick = () => {
    setIsExpanded(!isExpanded);
  };

  const expandedHeight = '120px'; // Adjusted expanded height for better balance
  const collapsedHeight = '60px'; // Adjusted collapsed height for better balance

  const imageStyle = {
    height: isExpanded ? expandedHeight : collapsedHeight,
    marginRight: '15px', // Reduced margin for better spacing on smaller screens
    cursor: 'pointer',
    transition: 'height 0.3s ease-in-out, margin-right 0.3s ease-in-out', // Smooth transition for height and margin
    borderRadius: '8px', // Rounded corners for the logo
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for the logo to make it pop
  };

  useEffect(() => {
    // Any side effects can be handled here if needed
  }, [isExpanded]);

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          background: 'black',
          padding: '15px', // More padding for better spacing
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // More responsive grid
          alignItems: 'center',
          color: 'white',
          gap: '15px', // Added gap for better spacing between columns
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)', // Subtle bottom border
        }}
      >
        {/* Left Section: Logo and Mall Name */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <img
            src={iconnobg}
            alt="MBK Center Logo"
            style={imageStyle}
            onClick={handleImageClick}
          />
          <div style={{ lineHeight: 1.2 }}>
            <h2 style={{ margin: 0, fontSize: '1.4em', fontWeight: 'bold' }}>Black</h2>
            <p style={{ margin: 0, fontSize: '1.2em', fontWeight: 'normal' }}>Neko</p>
          </div>
        </div>

        {/* Middle Section: Contact Information */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: '10px', fontSize: '1.2em', fontWeight: 'bold' }}>BlackNeko</h3>
          <p style={{ margin: '5px 0', fontSize: '1em' }}>📍 ศูนย์การค้า MBK Center</p>
          <p style={{ margin: '5px 0', fontSize: '1em' }}>MBK แขวงวังใหม่ เขตปทุมวัน กรุงเทพมหานคร 10330</p>
          <p style={{ margin: '5px 0', fontSize: '1em' }}>🕙 เปิด ทุกวัน 16.00 น. - 0.00 น.</p>
          <p style={{ margin: '5px 0', fontSize: '1em' }}>🕙 เว้นเสาร์ อาทิตย์ 11.00 น. - 0.00 น.</p>
        </div>

        {/* Right Section: Contact Details */}
        <div style={{ textAlign: 'right', justifyContent: 'flex-end' }}>
          <h3 style={{ marginBottom: '10px', fontSize: '1.2em', fontWeight: 'bold' }}>ติดต่อ เรา</h3>
          <p style={{ margin: '5px 0', fontSize: '1em' }}>📞 xxxxxxxxxxx</p>
          <p style={{ margin: '5px 0', fontSize: '1em' }}>📧 Blackneko.mbk@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar2;
