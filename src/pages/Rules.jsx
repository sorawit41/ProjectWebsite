import React, { useState, useEffect } from 'react';
import { FaExclamationCircle, FaInfoCircle } from 'react-icons/fa'; // ใช้ไอคอนจาก react-icons

const Rules = () => {
  const [showInfo, setShowInfo] = useState(false); // สถานะเพื่อควบคุมการแสดงข้อมูลเพิ่มเติม
  const [opacity, setOpacity] = useState(0); // ใช้สำหรับอนิเมชั่นความโปร่งใส

  // ใช้ useEffect เพื่อเปลี่ยน opacity เมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    setOpacity(0); // เริ่มต้น opacity = 0
    setTimeout(() => {
      setOpacity(1); // หลังจาก 300ms opacity จะเป็น 1 (ทำให้ค่อยๆปรากฏ)
    }, 300);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8" style={{ opacity: opacity, transition: 'opacity 1s ease-in-out' }}>
      <h1 className="text-3xl font-semibold text-center mb-6">กฎข้อห้ามของBlackNeko</h1>
      
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">กฎข้อห้าม</h2>
        <ul className="list-disc pl-6">
          <li><FaExclamationCircle className="inline-block text-red-500 mr-2" />ห้ามกระทำการใดๆที่เป็นการรบกวน มนุษย์และน้องแมวท่านอื่น</li>
          <li><FaExclamationCircle className="inline-block text-red-500 mr-2" />ห้ามมนุษย์และน้องแมวสัมผัสตัวน้องแมว</li>
          <li><FaExclamationCircle className="inline-block text-red-500 mr-2" />ห้ามถามข้อมูลส่วนตัวของน้องแมวโดยเด็ดขาด เช่น ประวัติ หรือช่องทางการติดต่อส่วนตัว</li>
          <li><FaExclamationCircle className="inline-block text-red-500 mr-2" />ห้ามชักชวนไปทำงานหรือกิจกรรมอื่นๆ และคบเป็นแฟนกับน้องแมวในโลกแห่งความจริง</li>
          <li><FaExclamationCircle className="inline-block text-red-500 mr-2" />ห้ามดักรอที่ทางเข้า-ออก</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">ข้อควรระวัง</h2>
        <div className="flex items-center">
          <FaInfoCircle className="text-blue-500 mr-2" />
          <p>เราจึงขอความร่วมมือให้น้องแมวและมนุษย์ทุกท่านสร้างบรรยากาศดีๆร่วมกัน หากเกิดความเสียหายต่อทรัพย์สินภายในร้านจะเรียกเก็บค่าเสียหายจริง</p>
        </div>
        <div className="flex items-center mt-2">
          <FaInfoCircle className="text-blue-500 mr-2" />
          <p>หากมีเหตุการณ์อาเจียนภายในร้าน ต้องจ่ายค่าทำความสะอาด 1,000 บาท</p>
        </div>
      </div>

      {/* ปุ่มเพื่อแสดงข้อมูลเพิ่มเติม */}
      <div className="mt-6">
        <button
          className="text-blue-500 hover:underline"
          onClick={() => setShowInfo(!showInfo)}
        >
          {showInfo ? 'ซ่อนข้อมูลเพิ่มเติม' : 'แสดงข้อมูลเพิ่มเติม'}
        </button>
        {showInfo && (
          <div className="mt-4 bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold">ข้อมูลเพิ่มเติม</h3>
            <ul className="list-disc pl-6 mt-2">
              <li>ห้ามมนุษย์และน้องแมวที่ยังไม่บรรลุนิติภาวะดื่มแอลกอฮอล์</li>
              <li>สามารถถ่ายภาพได้เฉพาะอาหาร และถ้าต้องการถ่ายภาพกรุณาเรียกน้องแมวที่ใกล้ๆ เพื่อถ่ายให้</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rules;
