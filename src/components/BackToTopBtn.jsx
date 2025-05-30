import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { ArrowUpIcon } from '@heroicons/react/24/solid'; // หรือ FaChevronUp จาก react-icons/fa

const ScrollToTopButton = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsActive(window.scrollY >= 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <ScrollLink
      to="myHeader" // ID ของ element ที่ต้องการเลื่อนไป (เช่น Header ของคุณ)
      smooth={true}
      duration={700}
      offset={-70} // Optional: ปรับตามความสูงของ fixed header ของคุณ
      className={`
        fixed bottom-6 left-1/2 z-30 
        w-11 h-11 md:w-12 md:h-12 
        flex items-center justify-center
        rounded-full 
        cursor-pointer
        transform -translate-x-1/2  /* สำหรับจัดกึ่งกลางแนวนอน */
        
        bg-neutral-800/70 text-neutral-100 /* สีพื้นหลังดำโปร่งแสง, สีไอคอน */
        dark:bg-neutral-900/80 dark:text-neutral-200 /* สีสำหรับ Dark Mode */
        
        backdrop-blur-sm /* เพิ่มเอฟเฟกต์เบลอพื้นหลัง */
        border border-neutral-700/50 dark:border-neutral-600/50 /* เส้นขอบบางๆ */
        
        shadow-xl hover:shadow-neutral-900/40 dark:hover:shadow-black/50 /* เงา */
        
        hover:bg-neutral-700 dark:hover:bg-neutral-800 /* สีพื้นหลังเมื่อ hover */
        hover:scale-105 /* ขยายเล็กน้อยเมื่อ hover */
        
        focus:outline-none focus:ring-2 focus:ring-neutral-500 
        dark:focus:ring-neutral-400 focus:ring-offset-2 
        focus:ring-offset-white dark:focus:ring-offset-neutral-900 /* Focus state */
        
        transition-all duration-300 ease-in-out /* Transition หลัก */
        
        ${isActive 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-10 pointer-events-none' /* Animation ปรากฏ/หาย */
        }
      `}
      aria-label="Scroll to top"
    >
      <ArrowUpIcon className="h-5 w-5 md:h-6 md:h-6" />
    </ScrollLink>
  );
};

export default ScrollToTopButton;