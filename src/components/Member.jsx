import React, { useState, useEffect } from 'react';
import image from "../assets/imgs/memberlist.png";

const Member = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`transition-all duration-700 ease-in-out transform ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      } max-w-[1200px] mx-auto p-10 rounded-2xl shadow-xl 
      bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100`}
    >
      <h2 className="text-3xl font-bold mb-8 text-center">
        ตารางสิทธิประโยชน์ สมาชิก Black Neko
      </h2>

      <ul className="list-none space-y-4 text-lg mb-10 text-left md:text-center">
        <li>💎 ทุก 500 บาท ได้ 1 คะแนน</li>
        <li>📆 คะแนนมีอายุ 6 เดือนนับจากวันที่รับคะแนนครั้งล่าสุด</li>
        <li>
          📲 รับคะแนน และคูปองต่างๆผ่าน Line{' '}
          <a
            href="https://line.me/R/ti/p/%40blackneko"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            @blackneko
          </a>
        </li>
      </ul>

      <div className="flex justify-center">
        <img
          src={image}
          alt="ภาพสมาชิก Black Neko"
          className="rounded-xl border border-gray-300 dark:border-gray-700 max-w-full h-auto"
        />
      </div>
    </div>
  );
};

export default Member;
