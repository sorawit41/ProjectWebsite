import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header, Footer, BackToTopBtn, Message, Navbar2 } from '../components';
import { FaCookieBite } from 'react-icons/fa';

const DefaultLayout = ({ children }) => {
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const location = useLocation();

  // ตรวจสอบว่าเป็นหน้า '/Idol_Blackneko' หรือไม่
  const isOnIdolPage = location.pathname === '/Idol_Blackneko';

  useEffect(() => {
    const consentGiven = localStorage.getItem('cookieConsent');
    if (!consentGiven) {
      setShowCookieConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowCookieConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    setShowCookieConsent(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-200">

      {/* แสดง Header เฉพาะเมื่อไม่ได้อยู่ที่หน้า Idol_Blackneko */}
      {<Header />}

      <main className="container mx-auto flex-grow px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      <BackToTopBtn />

      {/* --- COOKIE CONSENT REFINED --- */}
      {showCookieConsent && (
        <div
          className="fixed inset-x-0 bottom-0 z-50 p-4 sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-2xl"
          role="dialog"
          aria-labelledby="cookie-consent-title"
        >
            <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200/80 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-800/80 md:flex-row md:gap-6">
                <div className="shrink-0">
                    <FaCookieBite className="text-5xl text-sky-500 dark:text-sky-400" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h3 id="cookie-consent-title" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        เราใส่ใจความเป็นส่วนตัวของคุณ
                    </h3>
                    <p id="cookie-consent-description" className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        เว็บไซต์ของเราใช้คุกกี้เพื่อปรับปรุงประสบการณ์การใช้งานและวิเคราะห์การเข้าชม การคลิก "ยอมรับ" หมายถึงคุณยินยอมให้เราใช้คุกกี้
                    </p>
                </div>
                <div className="mt-3 flex w-full shrink-0 gap-3 md:mt-0 md:w-auto">
                    <button
                        onClick={handleAccept}
                        className="w-full rounded-lg bg-sky-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-800"
                    >
                        ยอมรับ
                    </button>
                    <button
                        onClick={handleDecline}
                        className="w-full rounded-lg bg-slate-200 px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:focus:ring-slate-600"
                    >
                        ปฏิเสธ
                    </button>
                </div>
            </div>
        </div>
      )}

      <Message />

      {/* ซ่อน Footer หากเปิดใช้งาน ในหน้า Idol_Blackneko ด้วย */}
      {/* {!isOnIdolPage && <Footer />} */}

      {/* แสดง Navbar2 เฉพาะเมื่อไม่ได้อยู่ที่หน้า Idol_Blackneko */}
      {<Navbar2 />}
    </div>
  );
};

export default DefaultLayout;