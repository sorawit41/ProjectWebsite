import React, { useState, useEffect } from 'react';
import { FaCat, FaHeart, FaExclamationTriangle } from 'react-icons/fa';

const About = () => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="min-h-screen py-20 px-4 transition-opacity duration-1000 ease-in-out bg-white dark:bg-black"
      style={{ opacity }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Title Section */}
        <div className="text-center animate-fade-in-up">
          <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            ต้อนรับความสุขจาก Black Neko! <FaCat className="inline-block ml-2 text-gray-600 dark:text-gray-300" />
          </h3>
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
            ณ อาณาจักรแมวอันแสนสุขสันต์... <FaHeart className="inline-block ml-2 text-red-500" />
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            ณ ดินแดนที่เต็มไปด้วยเสียง "เหมียว" และความอบอุ่น พระราชาแมวดำผู้ใจดีทรงปกครองอาณาจักรแห่งแมวด้วยความรักและเมตตา...
          </p>
        </div>

        {/* Grid Content */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="animate-slide-in-left">
            <h3 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
              เหล่าแมวน้อยผู้กล้าหาญ
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              เหล่าแมวน้อยผู้กล้าหาญจึงออกเดินทาง และได้ร่วมกันสร้างสรรค์ "อาณาจักร Black Neko"...
            </p>
          </div>
          <div className="animate-slide-in-right">
            <h3 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
              คำสาปอันน่ากลัว <FaExclamationTriangle className="inline-block ml-2 text-yellow-500" />
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              แต่ภารกิจนี้ไม่ได้ง่ายดาย... แมวน้อยตัวใดที่ทำภารกิจไม่สำเร็จ จะต้องเผชิญกับคำสาป...
            </p>
          </div>
        </div>

        {/* Final Message */}
        <div className="mt-20 text-center animate-fade-in-up delay-500">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ดังนั้น... จงเตรียมตัวให้พร้อม เพื่อต้อนรับความน่ารักจากเหล่าแมวน้อย! <FaCat className="inline-block ml-2 text-gray-600 dark:text-gray-300" />
          </p>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slideInLeft 1s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 1s ease-out forwards;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
};

export default About;
