import { useState, useEffect } from 'react';
import { Link } from 'react-scroll'; // ใช้ react-scroll สำหรับการเลื่อน
import { FaChevronUp } from 'react-icons/fa';

const ScrollToTopButton = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 400) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Link
      to="myHeader"
      smooth={true}
      duration={500}
      className={`${!isActive ? 'hidden' : ''}
        fixed bottom-11 left-1/2 z-10 w-12 h-12
        bg-black hover:bg-slate-100 cursor-pointer text-white
        rounded-full flex items-center justify-center shadow-lg
        transition-all duration-300 ease-in-out transform -translate-x-1/2
        ${isActive ? 'animate-bounceUp' : 'animate-bounceOut'}`}
    >
      <FaChevronUp className="text-xl" />
    </Link>
  );
};

export default ScrollToTopButton;