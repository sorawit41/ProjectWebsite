import React, { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import qr1 from "../assets/register/qrfacebook.png";
import qr2 from "../assets/register/qr instagram.png";

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-pink-50 to-blue-100 dark:from-black dark:to-black transition-opacity duration-700 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="w-full max-w-4xl p-8 bg-white dark:bg-black rounded-3xl shadow-2xl dark:shadow-black/40 flex flex-col items-center transition-transform transform duration-700 ease-in-out"
        style={{ transform: isVisible ? 'scale(1)' : 'scale(0.95)' }}
      >
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6 animate-bounce">
          ติดต่อเรา
        </h1>
        <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-8 animate-fade-in">
          หากมีคำถามหรืออยากพูดคุยกับเรา ติดต่อผ่านช่องทางด้านล่างได้เลย!
        </p>

        <div className="flex flex-col lg:flex-row gap-6 w-full items-center justify-center">
          {/* Facebook Button */}
          <a
            href="https://www.facebook.com/messages/t/165982909924535"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-blue-500 text-white py-4 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 w-full lg:w-1/2 justify-center"
          >
            <FaFacebook size={28} />
            <span className="text-xl font-semibold">ติดต่อผ่าน Facebook</span>
          </a>

          {/* Instagram Button */}
          <a
            href="https://www.instagram.com/direct/t/17845031952083277"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-pink-500 text-white py-4 px-6 rounded-lg shadow-md hover:bg-pink-600 transition duration-300 w-full lg:w-1/2 justify-center"
          >
            <FaInstagram size={28} />
            <span className="text-xl font-semibold">ติดต่อผ่าน Instagram</span>
          </a>
        </div>

        {/* QR Codes */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <img src={qr1} alt="Facebook QR" className="w-36 h-36 rounded-lg shadow dark:shadow-black/30" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">QR Facebook</p>
          </div>
          <div className="flex flex-col items-center">
            <img src={qr2} alt="Instagram QR" className="w-36 h-36 rounded-lg shadow dark:shadow-black/30" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">QR Instagram</p>
          </div>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out forwards;
        }
        .animate-bounce {
          animation: bounce 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default Contact;
