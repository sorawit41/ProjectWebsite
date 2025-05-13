import React, { useState, useEffect } from 'react';
import { FaStar, FaGift, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import image1 from "../assets/Member/image.png"
const Member = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
<div className="flex justify-center items-center px-4 pt-10 pb-20 font-sans bg-white dark:bg-black">

      <div
        className={`transition-all duration-700 ease-in-out transform ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } bg-white dark:bg-black rounded-3xl p-10 max-w-3xl w-full shadow-2xl`}
      >
        <h2 className="text-3xl font-extrabold text-black dark:text-white mb-6 flex items-center gap-3">
          <FaHeart className="text-pink-500" />
          สิทธิ์ประโยชน์ Member Black Neko 2025
        </h2>

        <p className="text-base text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          เมื่อซื้อสินค้า/ใช้บริการภายใต้แบรนด์ <span className="font-semibold text-black dark:text-white">Black Neko</span> เช่น ร้าน Black Neko Idol Cafe & Bar หรือวงไอดอลในเครือ Black Neko (เปิดตัวเร็วๆนี้)
        </p>

        <ul className="space-y-4 text-gray-800 dark:text-gray-200 mb-8">
          <li className="flex items-start gap-3">
            <FaStar className="text-yellow-400 mt-1" />
            ✨ ทุก 500 บาทได้รับ 1 คะแนน ซึ่งคะแนนไม่มีวันหมดอายุ
          </li>
          <li className="flex items-start gap-3">
            <FaGift className="text-pink-400 mt-1" />
            🎁 รับสิทธิ์ประโยชน์ตามเลเวลสมาชิกตลอดปี 2025
          </li>
        </ul>

        <div className="h-px bg-black dark:bg-white my-6"></div>

        <p className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FaMapMarkerAlt className="text-red-500" />
          📌 มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK (ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ) 🚈
        </p>

        <img
          src={image1}
          alt="Black Neko"
          className="w-full rounded-2xl mt-6 shadow-md"
        />

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed text-center">
          #Blacknekombk #Blackneko #maidecafe #MBK <br />
          #blacknekomaidcafeandbar #mbkcenterbangkok #แมวเมี้ยวใจดี
        </p>
      </div>
    </div>
  );
};

export default Member;