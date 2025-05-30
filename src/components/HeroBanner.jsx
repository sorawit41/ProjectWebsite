import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

// Import images
import Slide_1_Img from "../assets/imgs/image.png";
import Slide_2_Img from "../assets/imgs/image5.png";
import Slide_4_Img from "../assets/newsandevemts/May/You.png";
import Slide_5_Img from "../assets/newsandevemts/May/1year.png";
import Slide_6_Img from "../assets/newsandevemts/May/image.png"; // Assuming this is different from Slide_1_Img despite the same filename
import Slide_7_Img from "../assets/newsandevemts/May/birthdayidol.png";

const HeroBanner = () => {
  const slidesData = [
    {
      src: Slide_1_Img,
      alt: "Black Neko Slide 1",
      type: "cover", // For full bleed images
    },
    {
      src: Slide_2_Img,
      alt: "Black Neko Slide 2",
      type: "cover",
    },
    {
      src: Slide_4_Img,
      alt: "Black Neko Slide 4 - You",
      type: "contain", // For images that need to be fully visible with a background
    },
    {
      src: Slide_5_Img,
      alt: "Black Neko Slide 5 - 1 Year",
      type: "contain",
    },
    {
      src: Slide_6_Img,
      alt: "Black Neko Slide 6 - May Event",
      type: "contain",
    },
    {
      src: Slide_7_Img,
      alt: "Black Neko Slide 7 - Birthday Idol",
      type: "contain",
    },
  ];

  return (
    <div className="relative text-white text-[20px] w-full max-w-[1360px] mx-auto pt-20">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showIndicators={true}
        showStatus={false} // Commonly hidden for a cleaner look
        interval={5000}
        emulateTouch={true} // Modern touch for better mobile experience
      >
        {slidesData.map((slide) => (
          <div
            key={slide.src} // Using image src as key, ensure they are unique
            className={`w-full h-[400px] md:h-[600px] lg:h-[800px] overflow-hidden ${
              slide.type === "contain"
                ? "flex items-center justify-center bg-black"
                : ""
            }`}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className={`${
                slide.type === "cover"
                  ? "w-full h-full object-cover"
                  : "object-contain max-h-full max-w-full"
              }`}
              loading="lazy" // Lazy load images for better performance
            />
            {/* You could add overlay text here if needed, e.g.,
            <div className="absolute bottom-10 left-10 p-4 bg-black bg-opacity-50 rounded">
              <p>{slide.alt}</p>
            </div>
            */}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroBanner;