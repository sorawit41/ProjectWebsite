import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

import Slide_1 from "../assets/imgs/image.png";
import Slide_2 from "../assets/imgs/image5.png";
import { BiArrowBack } from "react-icons/bi";

const HeroBanner = () => {
  return (
    <div className="relative text-white text-[20px] w-full max-w-[1360px] mx-auto">
      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        showIndicators={true}
      >
        {/* img - 1 */}
        <div>
          <img
            src={Slide_1}
            alt=""
            className="aspect-[16/9] md:aspect-auto w-full h-auto object-cover"
          />
        </div>
        {/* img - 2 */}
        <div>
            <img src = {Slide_2} alt="" className="aspect-[16/10] md:aspect-auto object-cover" />
          </div>
        {/* img - 3 */}

        {/* img - 4 */}
      </Carousel>
    </div>
  );
}

export default HeroBanner;