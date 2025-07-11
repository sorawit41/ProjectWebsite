import { useState, useEffect } from 'react';
import { FaFacebookMessenger } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion และ AnimatePresence

const FloatingMessengerButton = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const tooltipText = "ติดต่อเราทาง Messenger";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Animation variants สำหรับปุ่ม
  const buttonVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.7 }, // y: 50 คือเริ่มจากข้างล่างเล็กน้อย
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring', // Animation แบบสปริง
        stiffness: 120,
        damping: 10,
        delay: 0.3, // หน่วงเวลาก่อน animation ของปุ่มเริ่ม
      },
    },
    hover: {
      scale: 1.15,
      rotate: [0, 10, -10, 10, 0], // หมุนซ้ายขวาเล็กน้อย
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)", // เพิ่มเงาเมื่อ hover
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 8,
        rotate: { duration: 0.5, ease: "easeInOut" }
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  // Animation variants สำหรับ tooltip
  const tooltipVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.9 }, // y:10 คือเริ่มจากสูงกว่าเล็กน้อย
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  };

  return (
    <div className="fixed bottom-10 right-10 z-50">
      {/* Tooltip */}
      <AnimatePresence> {/* ใช้ AnimatePresence ถ้าต้องการ animation ตอนหายไป */}
        {isHovering && isVisible && (
          <motion.div
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="hidden" // Animation ตอนหายไป
            className="absolute bottom-full right-1/2 transform translate-x-1/2 mb-3 px-3 py-1.5
                       bg-slate-800 text-white text-xs font-medium rounded-md shadow-lg
                       whitespace-nowrap pointer-events-none"
          >
            {tooltipText}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ปุ่ม Messenger */}
      <motion.a
        href="https://www.messenger.com/t/165982909924535"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={tooltipText}
        className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600
                   text-white rounded-full flex items-center justify-center
                   shadow-xl cursor-pointer
                   focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
        variants={buttonVariants}
        initial="hidden" // สถานะเริ่มต้น (ก่อน isVisible จะ true)
        animate={isVisible ? "visible" : "hidden"} // ควบคุมสถานะ animate ด้วย isVisible
        whileHover="hover" // Animation เมื่อ hover
        whileTap="tap"     // Animation เมื่อคลิก
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <FaFacebookMessenger className="text-3xl" />
      </motion.a>
    </div>
  );
};

export default FloatingMessengerButton;