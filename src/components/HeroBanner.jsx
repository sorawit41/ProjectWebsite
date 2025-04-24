import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

import Slide_1 from "../assets/imgs/image.png";
import Slide_2 from "../assets/imgs/image5.png";
import Slide_3 from "../assets/imgs/nd.png";

const HeroBanner = () => {
  return (
    <div className="relative text-white text-[20px] w-full max-w-[1360px] mx-auto pt-20">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showIndicators={true}
        interval={5000}
      >
        {/* Slide 1 */}
        <div className="w-full h-[400px] md:h-[600px] lg:h-[800px] overflow-hidden">
          <img
            src={Slide_1}
            alt="Black Neko Slide 1"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Slide 2 */}
        <div className="w-full h-[400px] md:h-[600px] lg:h-[800px] overflow-hidden">
          <img
            src={Slide_2}
            alt="Black Neko Slide 2"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Slide 3 */}
        <div className="w-full h-[400px] md:h-[600px] lg:h-[800px] overflow-hidden flex items-center justify-center bg-black">
          <img
            src={Slide_3}
            alt="Black Neko Slide 3"
            className="object-contain max-h-full max-w-full"
          />
        </div>
      </Carousel>
    </div>
  );
};

export default HeroBanner;
