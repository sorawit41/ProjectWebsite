import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles

import Slide_1 from '../assets/idolPro/image.png';


const ProIdol = () => {
  return (
    <div className="relative text-white text-[20px] w-full max-w-[1360px] mx-auto">
      <Carousel
        autoPlay={false}
        infiniteLoop={true}
        showThumbs={false}
        showIndicators={true}
      >
        {/* img - 1 */}
        <div>
          <img
            src={Slide_1}
            alt="Slide 1"
            className="aspect-[16/10] md:aspect-auto object-cover"
          />
        </div>
        
      </Carousel>
      <div className='h-[100px]'></div>
    </div>
  );
};

export default ProIdol;