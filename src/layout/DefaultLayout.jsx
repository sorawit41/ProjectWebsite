import React, { useState, useEffect } from 'react';
import { Header, Footer, BackToTopBtn, Message, Navbar2 } from '../components';
import { FaCookieBite } from 'react-icons/fa';
import Map from '../components/Map'; // สมมติว่า Map component อยู่ในโฟลเดอร์ components

const DefaultLayout = ({ children }) => {
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    // แสดง banner ถ้ายังไม่เคยให้ความยินยอม หรือเคยปฏิเสธไปแล้ว (อาจจะอยากให้แสดงอีกครั้งหลังเวลาผ่านไป)
    // ในที่นี้จะแสดงถ้ายังไม่มีการตั้งค่าใดๆ
    if (!consent) {
      setShowCookieConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowCookieConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowCookieConsent(false);
    // คุณอาจต้องการเพิ่ม logic อื่นๆ ที่นี่ หากผู้ใช้ปฏิเสธ เช่น ปิดการใช้งานฟีเจอร์บางอย่าง
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-white text-gray-800 dark:bg-neutral-900 dark:text-neutral-100 transition-colors duration-300"
      id="myHeader" // คง id ไว้หากมีการใช้งานจากส่วนอื่น เช่น BackToTopBtn
    >
      <Header />

      {/* เพิ่ม <main> tag เพื่อความหมายทาง HTML ที่ดีขึ้น และจัด layout content ตรงกลาง */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <BackToTopBtn /> {/* ตรวจสอบให้แน่ใจว่าปุ่มนี้มีสไตล์ที่มองเห็นได้ชัดเจนทั้งใน light และ dark mode */}

      {showCookieConsent && (
        <div
          // ปรับปรุงสไตล์ cookie consent banner ให้ดูทันสมัยขึ้น
          className="fixed bottom-0 left-0 right-0 sm:bottom-6 sm:left-1/2 sm:transform sm:-translate-x-1/2 
                     w-full sm:max-w-2xl z-50
                     bg-white dark:bg-slate-800 
                     text-slate-700 dark:text-slate-200
                     p-6 shadow-2xl 
                     sm:rounded-xl border-t sm:border border-slate-200 dark:border-slate-700
                     transition-transform duration-500 ease-in-out"
          role="dialog" // ARIA role for accessibility
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-description"
        >
          <div className="flex flex-col md:flex-row items-center gap-5">
            <div className="shrink-0">
              <FaCookieBite className="text-sky-500 dark:text-sky-400 text-5xl md:text-6xl animate-pulse" /> {/* ลอง animate-pulse ดูนุ่มนวลกว่า */}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 id="cookie-consent-title" className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
                เราใส่ใจความเป็นส่วนตัวของคุณ
              </h3>
              <p id="cookie-consent-description" className="text-sm leading-relaxed">
                เว็บไซต์ของเราใช้คุกกี้เพื่อปรับปรุงประสบการณ์การใช้งานของคุณ วิเคราะห์การเข้าชมเว็บไซต์ และนำเสนอเนื้อหาที่เหมาะกับคุณ การคลิก "ยอมรับ" หมายถึงคุณยินยอมให้เราใช้คุกกี้ตามนโยบายของเรา
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-5 md:mt-0 shrink-0 w-full sm:w-auto">
              <button
                onClick={handleAccept}
                className="w-full sm:w-auto bg-sky-600 text-white py-2.5 px-6 rounded-lg font-medium
                           hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-800
                           transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                ยอมรับ
              </button>
              <button
                onClick={handleDecline}
                className="w-full sm:w-auto bg-slate-200 text-slate-700 py-2.5 px-6 rounded-lg font-medium
                           hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500
                           focus:outline-none focus:ring-4 focus:ring-slate-300 dark:focus:ring-slate-700
                           transition-all duration-300 ease-in-out"
              >
                ปฏิเสธ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* หาก Map เป็นส่วนเนื้อหาหลัก ควรอยู่ใน <main> หรือถ้าเป็นส่วนเสริม อาจวางไว้ตำแหน่งนี้ */}
      {/* <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"> */}
      {/* <Map /> */}
      {/* </div> */}
      
      <Message /> {/* ตรวจสอบให้แน่ใจว่า Message component มีสไตล์ที่ทันสมัยและรองรับ dark mode */}
      
      <Navbar2 /> {/* พิจารณาตำแหน่งของ Navbar2 หากเป็น navigation หลัก มักจะอยู่รวมกับ Header */}
                  {/* หากเป็น bottom bar หรือ utility bar ตำแหน่งปัจจุบันก็เหมาะสมแล้ว และควรปรับสไตล์ให้เข้ากัน */}
      <Footer />
    </div>
  );
};

export default DefaultLayout;