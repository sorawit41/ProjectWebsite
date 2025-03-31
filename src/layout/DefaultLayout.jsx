import React, { useState, useEffect } from 'react';
import { Header, Footer, BackToTopBtn, Message } from '../components';
import { FaCookieBite } from 'react-icons/fa';

const DefaultLayout = ({ children }) => {
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
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
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      id="myHeader"
      
    >
      <Header />
      <div className="flex-grow">{children}</div>
      <BackToTopBtn />

      {showCookieConsent && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white p-6 rounded-lg shadow-xl w-[90%] md:w-[400px] z-50 flex items-center gap-4 border border-gray-700 transition-all duration-500 ease-in-out">
          <FaCookieBite className="text-yellow-400 text-3xl animate-bounce" />
          <div className="flex flex-col flex-1">
            <p className="text-sm text-center">
              We use cookies to enhance your experience on our website. Please accept to continue using our site seamlessly.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleAccept}
                className="bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
              >
                Accept
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
      <Message />
      <Footer />
    </div>
  );
};

export default DefaultLayout;