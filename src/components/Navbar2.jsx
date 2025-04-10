import React, { useState } from 'react';
import iconnobg from "../assets/imgs/iconnobg.png"; // Import the image correctly

const Navbar2 = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleImageClick = () => {
    setIsExpanded(!isExpanded);
  };

  const expandedHeight = '120px'; // Adjusted expanded height for better balance
  const collapsedHeight = '60px'; // Adjusted collapsed height for better balance

  const imageStyle = {
    height: isExpanded ? expandedHeight : collapsedHeight,
    marginRight: '10px', // Reduced margin for better spacing on smaller screens
    cursor: 'pointer',
    transition: 'height 0.3s ease-in-out',
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        background: 'black',
        padding: '10px', // Reduced padding for better responsiveness
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // More responsive grid
        alignItems: 'center',
        color: 'white',
        gap: '10px', // Added gap for better spacing between columns
      }}>
        {/* Left Section: Logo and Mall Name */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <img
            src={iconnobg} // Use the imported image variable
            alt="MBK Center Logo"
            style={imageStyle}
            onClick={handleImageClick}
          />
          <div style={{ lineHeight: 1.2 }}>
            <h2 style={{ margin: 0, fontSize: '1.2em' }}>Black</h2>
            <p style={{ margin: 0, fontSize: '1.2em' }}>Neko</p>
          </div>
        </div>

        {/* Middle Section: Contact Information */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: '5px', fontSize: '1em' }}>BlackNeko</h3>
          <p style={{ margin: '2px 0', fontSize: '0.8em' }}>📍 ศูนย์การค้า MBK Center</p>
          <p style={{ margin: '2px 0', fontSize: '0.8em' }}>7 MBK แขวงวังใหม่ เขตปทุมวัน กรุงเทพมหานคร 10330</p>
          <p style={{ margin: '2px 0', fontSize: '0.8em' }}>🕙 เปิด ทุกวัน 16.00 น. - 0.00 น. </p>
          <p style={{ margin: '2px 0', fontSize: '0.8em' }}>🕙 เว้นเสาร์ อาทิตย์ 11.00 น. - 0.00 น. </p>
        </div>

        {/* Right Section: Contact Details */}
        <div style={{ textAlign: 'right', justifyContent: 'flex-end' }}>
          <h3 style={{ marginBottom: '5px', fontSize: '1em' }}>ติดต่อ เรา</h3>
          <p style={{ margin: '2px 0', fontSize: '0.8em' }}>📞 xxxxxxxxxxx</p>
          <p style={{ margin: '2px 0', fontSize: '0.8em' }}>📧 Blackneko.mbk@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar2;