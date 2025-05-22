import React, { useState, useEffect } from 'react';

import story1 from "../assets/about/1.png";
import story2 from "../assets/about/2.png";

const About = () => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="transition-opacity duration-1000 ease-in-out bg-white dark:bg-black"
      style={{ opacity }}
    >
      {/* เพิ่ม padding-top ที่นี่ เพื่อขยับเนื้อหาทั้งหมด (รูปภาพ) ลงมา */}
      <div className="pt-20 "> {/* <--- เพิ่ม pt-20 ตรงนี้ */}
        {/* Full-screen Image 1 */}
        <div className="w-screen h-screen flex items-center justify-center overflow-hidden">
          <img
            src={story1}
            alt="Our Story 1"
            className="w-full h-full object-cover" // Ensure image covers the full div
          />
        </div>

        {/* Full-screen Image 2 */}
        <div className="w-screen h-screen flex items-center justify-center overflow-hidden">
          <img
            src={story2}
            alt="Our Story 2"
            className="w-full h-full object-cover" // Ensure image covers the full div
          />
        </div>
      </div>
    </div>
  );
};

export default About;