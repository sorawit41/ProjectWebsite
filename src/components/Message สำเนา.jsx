import { useState, useEffect } from 'react';
import { FaFacebookMessenger } from 'react-icons/fa'; // Import Messenger icon

const ScrollToTopButton = () => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="relative">
      {isHovering && (
        <div
          className="absolute bottom-16 right-0 bg-gray-100 p-2 rounded-md shadow-md text-sm transition-opacity duration-300"
          style={{ opacity: isHovering ? 1 : 0 }}
        >
       
        </div>
      )}
      <a
        href="https://www.messenger.com/t/165982909924535"
        target="_blank"
        rel="noopener noreferrer"
        className={`
          fixed bottom-11 right-11 z-10 w-12 h-12
          bg-black hover:bg-blue-500 cursor-pointer text-white
          rounded-full flex items-center justify-center shadow-lg
          transition-all duration-300 ease-in-out transform
          animate-bounceUp
        `}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <FaFacebookMessenger className="text-2xl" />
      </a>
    </div>
  );
};

export default ScrollToTopButton;