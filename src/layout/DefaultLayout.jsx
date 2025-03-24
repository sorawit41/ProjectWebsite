import React, { useState } from 'react';
import { Header, Footer, BackToTopBtn } from '../components';
import CookieConsent from 'react-cookie-consent';

const DefaultLayout = ({ children }) => {
  const [showCookieConsent, setShowCookieConsent] = useState(true);  // ใช้สถานะในการแสดงปุ่ม

  const handleAccept = () => {
    setShowCookieConsent(false);  // เมื่อคลิก Accept, ซ่อนปุ่ม
    
  };

  const handleDecline = () => {
    setShowCookieConsent(false);  // เมื่อคลิก Decline, ซ่อนปุ่ม
    
  };

  return (
    <div id="myHeader">
      <Header />
      <div>
        {children}
      </div>       
      <Footer />
      <BackToTopBtn />

      {showCookieConsent && (
        <div 
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-6 rounded-lg shadow-xl w-[90%] md:w-[400px] z-50 flex items-center justify-between"
        >
          <div className="flex flex-col">
            <p className="text-sm mb-4 text-center">
            ฟังก์ชันนี้ใช้เก็บข้อมูลการยอมรับหรือปฏิเสธคุกกี้ของผู้ใช้ใน Cookie เพื่อไม่ให้แสดงป๊อปอัพซ้ำเมื่อผู้ใช้เคยยอมรับแล้ว ช่วยให้เว็บไซต์ติดตามสถานะของผู้ใช้ได้.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleAccept}
                className="bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
              >
                Accept All
              </button>
              <button
                onClick={handleDecline}
                className="bg-red-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-red-700 transition duration-300"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DefaultLayout;
