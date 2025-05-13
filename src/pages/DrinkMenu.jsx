import React from 'react';

// Import your images - Food Menu
import image11 from '../assets/menu/Food/เมนู A4-11.png';
import image12 from '../assets/menu/Food/เมนู A4-12.png';
import image13 from '../assets/menu/Food/เมนู A4-13.png';
import image14 from '../assets/menu/Food/เมนู A4-14.png';
import image15 from '../assets/menu/Food/เมนู A4-15.png';
import image16 from '../assets/menu/Food/เมนู A4-16.png';
import image17 from '../assets/menu/Food/เมนู A4-17.png';
import image18 from '../assets/menu/Food/เมนู A4-18.png';
import image19 from '../assets/menu/Food/เมนู A4-19.png';
import image20 from '../assets/menu/Food/เมนู A4-20.png';
import image21 from '../assets/menu/Food/เมนู A4-21.png';

const DrinkMenu = () => {
  const imageStyle = {
    width: '70vw',
    height: 'auto',
    display: 'block',
    margin: '0 auto', // Add this line to center the images horizontally
  };

  return (
    <div style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Added a container div with flexbox properties to center content */}
      <img src={image11} alt="Food Menu 11" style={imageStyle} />
      <img src={image12} alt="Food Menu 12" style={imageStyle} />
      <img src={image13} alt="Food Menu 13" style={imageStyle} />
      <img src={image14} alt="Food Menu 14" style={imageStyle} />
      <img src={image15} alt="Food Menu 15" style={imageStyle} />
      <img src={image16} alt="Food Menu 16" style={imageStyle} />
      <img src={image17} alt="Food Menu 17" style={imageStyle} />
      <img src={image18} alt="Food Menu 18" style={imageStyle} />
      <img src={image19} alt="Food Menu 19" style={imageStyle} />
      <img src={image20} alt="Food Menu 20" style={imageStyle} />
      <img src={image21} alt="Food Menu 21" style={imageStyle} />
    </div>
  );
};

export default DrinkMenu;
