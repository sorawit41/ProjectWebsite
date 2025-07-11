// --- File: src/components/game/Card.js ---

import React from 'react';

function Card({ id, image, isFlipped, isMatched, onClick }) {
  return (
    <div
      // เปลี่ยนจาก w-32 h-44 เป็น w-full และ aspect-[3/4] เพื่อให้ขนาดของการ์ด
      // ถูกควบคุมโดย Grid Container ใน GameBoard และรักษาสัดส่วนไว้
      className={`w-full aspect-[3/4] rounded-lg shadow-lg cursor-pointer transform transition-transform duration-500
                  group perspective
                  ${isFlipped || isMatched ? 'bg-white [transform:rotateY(180deg)]' : 'bg-gray-700 hover:bg-gray-600'}
                  ${isMatched ? 'opacity-50 cursor-default ring-2 ring-offset-2 ring-green-500' : ''}
                  `}
      onClick={() => !isFlipped && !isMatched && onClick(id)}
    >
      {/* Back of the card */}
      <div
        className={`absolute inset-0 w-full h-full flex items-center justify-center
                    bg-gray-700 rounded-lg backface-hidden group-hover:bg-gray-600
                    transition-colors duration-300
                    ${isFlipped || isMatched ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* ปรับขนาดตัวอักษรให้เล็กลงบนจอมือถือ และใหญ่ขึ้นบนจอที่ใหญ่กว่า */}
        <span className="text-4xl sm:text-5xl text-white">?</span>
      </div>

      {/* Front of the card */}
      <div
        className={`absolute inset-0 w-full h-full flex items-center justify-center
                    bg-white rounded-lg [transform:rotateY(180deg)] backface-hidden
                    transition-opacity duration-300
                    ${isFlipped || isMatched ? 'opacity-100' : 'opacity-0'}`}
      >
        {(isFlipped || isMatched) && (
          // ลด padding บนจอมือถือ
          <img src={image} alt="card-content" className="max-w-full max-h-full p-2 sm:p-3 object-contain" />
        )}
      </div>
    </div>
  );
}

// หาก Tailwind JIT ไม่สร้าง perspective และ backface-hidden ให้อัตโนมัติ
// คุณอาจจะต้องเพิ่มใน tailwind.config.js หรือ global CSS:
// plugins: [
//   function ({ addUtilities }) {
//     addUtilities({
//       '.perspective': { perspective: '1000px' },
//       '.backface-hidden': { 'backface-visibility': 'hidden', '-webkit-backface-visibility': 'hidden' },
//     })
//   }
// ],

export default Card;