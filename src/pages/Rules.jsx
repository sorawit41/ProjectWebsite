import React, { useState, useEffect } from 'react';
import { FaExclamationCircle, FaInfoCircle, FaCameraRetro, FaPaw } from 'react-icons/fa'; // เพิ่มไอคอนใหม่

const Rules = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(0);
    setTimeout(() => {
      setOpacity(1);
    }, 300);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8" style={{ opacity: opacity, transition: 'opacity 1s ease-in-out' }}>
      <h1 className="text-3xl font-semibold text-center mb-6">กฎข้อห้ามของ BlackNeko</h1>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">กฎข้อห้าม</h2>
        <ul className="list-disc pl-6">
          <li><FaExclamationCircle className="inline-block text-red-500 mr-2" /> ห้ามกระทำการใดๆ ที่เป็นการรบกวน มนุษย์และน้องแมวท่านอื่น</li>
          <li><FaExclamationCircle className="inline-block text-red-500 mr-2" /> ห้ามมนุษย์สัมผัสตัวน้องแมวโดยไม่ได้รับการอนุญาต</li>
          <li><FaExclamationCircle className="inline-block text-red-500 mr-2" /> ห้ามถามข้อมูลส่วนตัวของน้องแมวโดยเด็ดขาด เช่น ประวัติ หรือช่องทางการติดต่อส่วนตัว</li>
          <li><FaExclamationCircle className="inline-block text-red-500 mr-2" /> ห้ามชักชวนไปทำงานหรือกิจกรรมอื่นๆ และคบเป็นแฟนกับน้องแมว</li>
          <li><FaExclamationCircle className="inline-block text-red-500 mr-2" /> ห้ามดักรอที่ทางเข้า-ออก หรือการกระทำที่เข้าข่าย Stalker</li>
          <li><FaExclamationCircle className="inline-block text-red-500 mr-2" /> ห้ามส่งเสียงดังเกินความจำเป็น หรือเปิดเพลงโดยไม่ได้รับอนุญาต</li>
          <li><FaExclamationCircle className="inline-block text-red-500 mr-2" /> ห้ามนำอาหารหรือเครื่องดื่มจากภายนอกเข้ามารับประทานในร้าน ต้องจ่ายค่าเช็ดโต๊ะ 150 บาท</li>
          <li><FaExclamationCircle className="inline-block text-red-500 mr-2" /> ห้ามถ่ายภาพน้องแมว</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">ข้อควรระวัง</h2>
        <div className="flex items-center">
          <FaPaw className="text-gray-700 mr-2" />
          <p>เราจึงขอความร่วมมือให้น้องแมวและมนุษย์ทุกท่านสร้างบรรยากาศดีๆ ร่วมกัน หากเกิดความเสียหายต่อทรัพย์สินภายในร้าน จะเรียกเก็บค่าเสียหายจริง</p>
        </div>
        <div className="flex items-center mt-2">
          <FaPaw className="text-gray-700 mr-2" />
          <p>หากมีเหตุการณ์อาเจียนภายในร้าน ต้องจ่ายค่าทำความสะอาด 1,000 บาท</p>
        </div>
        <div className="flex items-center mt-2">
          <FaPaw className="text-gray-700 mr-2" />
          <p>โปรดให้ความเคารพความเป็นส่วนตัวของน้องแมว และอย่าบังคับให้น้องแมวทำในสิ่งที่ไม่ต้องการ</p>
        </div>
      </div>

      <div className="mt-6">
        <button
          className="text-blue-500 hover:underline"
          onClick={() => setShowInfo(!showInfo)}
        >
          {showInfo ? 'ซ่อนข้อมูลเพิ่มเติม' : 'แสดงข้อมูลเพิ่มเติม'}
        </button>
        {showInfo && (
          <div className="mt-4">
            <p>BlackNeko เป็นพื้นที่ปลอดภัยสำหรับน้องแมวทุกตัว เราให้ความสำคัญกับความเป็นส่วนตัวและความเป็นอยู่ที่ดีของน้องแมวเป็นอันดับแรก</p>
            <p>การถ่ายภาพน้องแมวอาจทำให้น้องแมวรู้สึกไม่สบายตัวและเป็นการรบกวนความเป็นส่วนตัวของน้องแมว</p>
            <p>ขอความร่วมมือทุกท่านงดการถ่ายภาพน้องแมวภายในร้าน เพื่อสร้างสภาพแวดล้อมที่ผ่อนคลายและปลอดภัยสำหรับน้องแมว</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rules;