import React from 'react';

// Import your images
import image1 from '../assets/menu/Food/เมนู A4-01.png';
import image2 from '../assets/menu/Food/เมนู A4-02.png';
import image3 from '../assets/menu/Food/เมนู A4-03.png';
import image4 from '../assets/menu/Food/เมนู A4-04.png';
import image5 from '../assets/menu/Food/เมนู A4-05.png';
import image6 from '../assets/menu/Food/เมนู A4-06.png';
import image7 from '../assets/menu/Food/เมนู A4-07.png';
import image8 from '../assets/menu/Food/เมนู A4-08.png';
import image9 from '../assets/menu/Food/เมนู A4-09.png';
import image10 from '../assets/menu/Food/เมนู A4-10.png';

const MainMenu = () => {
  const imageStyle = {
    width: '70vw',
    height: 'auto',
    display: 'block',
    margin: '0 auto',
  };

  return (
    <div style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img src={image1} alt="Menu 1" style={imageStyle} />
      <img src={image2} alt="Menu 2" style={imageStyle} />
      <img src={image3} alt="Menu 3" style={imageStyle} />
      <img src={image4} alt="Menu 4" style={imageStyle} />
      <img src={image5} alt="Menu 5" style={imageStyle} />
      <img src={image6} alt="Menu 6" style={imageStyle} />
      <img src={image7} alt="Menu 7" style={imageStyle} />
      <img src={image8} alt="Menu 8" style={imageStyle} />
      <img src={image9} alt="Menu 9" style={imageStyle} />
      <img src={image10} alt="Menu 10" style={imageStyle} />
    </div>
  );
};

export default MainMenu;
