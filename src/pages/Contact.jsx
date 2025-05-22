import React, { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import qr1 from "../assets/register/qrfacebook.png";
import qr2 from "../assets/register/qr instagram.png";

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    // 1. ลบคลาสพื้นหลังทั้งหมดออกจาก div หลัก
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-opacity duration-1000 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* 2. พิจารณาว่าต้องการให้กล่องเนื้อหาหลักโปร่งใสทั้งหมดหรือไม่
          - ถ้าต้องการโปร่งใสทั้งหมด: เปลี่ยนเป็น className="..." (ลบ bg-white/80 dark:bg-gray-800/70 backdrop-blur-lg)
          - ถ้าต้องการให้ยังมีพื้นหลังโปร่งแสง/blur อยู่: เก็บ className นี้ไว้
      */}
      <div
        className={`w-full max-w-2xl bg-white/80 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-10 transition-all duration-700 ease-out ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            ติดต่อเรา
          </h1>
          <p className="text-md sm:text-lg text-gray-600 dark:text-gray-300 mb-8">
            เรายินดีรับฟัง! หากมีคำถาม ข้อเสนอแนะ หรือต้องการพูดคุย <br />
            ติดต่อผ่านช่องทางด้านล่างได้เลย
          </p>
        </div>

        <div className="space-y-6 mb-10">
          <ContactButton
            href="https://www.facebook.com/messages/t/165982909924535"
            icon={<FaFacebook size={24} />}
            text="ติดต่อผ่าน Facebook"
            bgColor="bg-blue-600 hover:bg-blue-700"
          />
          <ContactButton
            href="https://www.instagram.com/direct/t/17845031952083277"
            icon={<FaInstagram size={24} />}
            text="ติดต่อผ่าน Instagram"
            bgColor="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500"
          />
        </div>

        <div className="text-center text-gray-700 dark:text-gray-300 mb-8">
          <p className="font-semibold text-lg">หรือสแกน QR Code</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* 3. พิจารณาว่าต้องการให้กล่อง QR Code โปร่งใสทั้งหมดหรือไม่
              - ถ้าต้องการโปร่งใสทั้งหมด: ส่ง defaultBg="bg-transparent"
              - ถ้าต้องการให้มีพื้นหลังโปร่งแสง/blur อยู่: ไม่ต้องส่ง defaultBg หรือส่งค่าเริ่มต้น
          */}
          <QRCodeDisplay
            qrImage={qr1}
            altText="Facebook QR Code"
            caption="สแกนเพื่อติดต่อทาง Facebook"
            // defaultBg="bg-transparent" // Uncomment this line if you want the QR boxes to be fully transparent
          />
          <QRCodeDisplay
            qrImage={qr2}
            altText="Instagram QR Code"
            caption="สแกนเพื่อติดต่อทาง Instagram"
            // defaultBg="bg-transparent" // Uncomment this line if you want the QR boxes to be fully transparent
          />
        </div>
      </div>

      {/* Optional: Subtle animated background elements.
          ถ้าต้องการให้พื้นหลังโปร่งใส 100% ควรลบส่วนนี้ออก
          เพราะ elements เหล่านี้จะสร้างสี/เงาของตัวเอง
      */}
      {/* <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/10 dark:bg-white/5 rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 150 + 50}px`,
              height: `${Math.random() * 150 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div> */}
    </div>
  );
};

const ContactButton = ({ href, icon, text, bgColor }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`flex items-center justify-center gap-3 w-full py-3 px-5 rounded-xl text-white font-semibold shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl ${bgColor}`}
  >
    {icon}
    <span className="text-base sm:text-lg">{text}</span>
  </a>
);

const QRCodeDisplay = ({ qrImage, altText, caption, defaultBg = "bg-white/50 dark:bg-gray-700/50" }) => (
  <div className={`flex flex-col items-center p-4 backdrop-blur-sm rounded-xl shadow-md transition-all duration-300 hover:shadow-lg ${defaultBg}`}>
    <img
      src={qrImage}
      alt={altText}
      className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg object-cover mb-3"
    />
    <p className="text-xs sm:text-sm text-center text-gray-600 dark:text-gray-300">
      {caption}
    </p>
  </div>
);

export default Contact;