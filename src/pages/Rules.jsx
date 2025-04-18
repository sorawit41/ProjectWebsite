import React, { useState, useEffect } from 'react';
import { FaExclamationCircle, FaInfoCircle, FaCameraRetro, FaPaw } from 'react-icons/fa';

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
    <div className="container mx-auto px-4 py-8 pt-20" style={{ opacity: opacity, transition: 'opacity 1s ease-in-out' }}>
      <h1 className="text-3xl font-semibold text-center mb-6">กฎระเบียบการใช้บริการ BlackNeko</h1>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">กฎการใช้บริการ</h2>
        <ol className="list-decimal pl-6">

            <div className="flex items-center">
              <FaInfoCircle className="text-blue-500 mr-2" />
              <span>ใช้บริการขั้นต่ำ 150 บาท/ท่าน/1 ชม.</span>
            </div>
            <ul className="list-disc pl-6 mt-1">
              <li>กรณีสั่งของ/ดื่ม เกินราคาสามารถรวมได้</li>
              <li>กรณีสั่งของ/ดื่ม เกินราคา 150 บาท ไม่นับยอดเป็นชม. เช่น สั่ง MOCKTAIL ราคา 380 บาท สามารถใช้บริการได้ 1 ชม.</li>
            </ul>

            <div className="flex items-center">
              <FaExclamationCircle className="text-red-500 mr-2" />
              <span>ห้ามสัมผัสตัว หรือพูดจาไม่สุภาพกับแคสทุกกรณี</span>
            </div>
            <div className="flex items-center">
              <FaInfoCircle className="text-blue-500 mr-2" />
              <span>กรณีสั่งสินค้า หรือบริการใดๆ ที่แสดงได้ขึ้นว่า COMMISSION กรุณาแจ้งชื่อแอดที่ท่านต้องการให้ได้รับค่าคอมมิชชั่นของสินค้าต่างๆ</span>
            </div>

            <div className="flex items-center">
              <FaInfoCircle className="text-blue-500 mr-2" />
              <span>โปรโมชั่นพิเศษ ระยะเป็น และเงื่อนไขการบริการของทางร้าน สามารถปรับเปลี่ยนได้ตามที่บริษัทกำหนด</span>
            </div>

        </ol>

        <h2 className="text-2xl font-semibold mt-6">รายละเอียดการใช้บริการกับน้องแมว</h2>
        <ul className="list-disc pl-6">
          <ul><FaPaw className="inline-block text-gray-700 mr-2" /> ลูกค้าใช้บริการขั้นต่ำ 150 บาท/ท่าน/ชม.</ul>
          <ul><FaPaw className="inline-block text-gray-700 mr-2" /> แสดงสามารถพูดคุยทักทายได้ไม่เกิน 5 นาที (แสดงน้ำนม)</ul>
          <ul><FaPaw className="inline-block text-gray-700 mr-2" /> พิเศษ! เฉพาะสินค้า และบริการที่แสดงได้ว่า COMMISSION เท่านั้น</ul>
          <ul><FaPaw className="inline-block text-gray-700 mr-2" /> ลูกค้าใช้บริการ 180-299 บาท/ชิ้น/แสดง/เครื่องดื่ม: สามารถนั่งพูดคุยกับลูกค้าได้ 10 นาที</ul>
          <ul><FaPaw className="inline-block text-gray-700 mr-2" /> ลูกค้าใช้บริการ 300-999 บาท/ชิ้น/แสดง/เครื่องดื่ม/เชกิ/ไลฟ์: แสดงสามารถนั่งพูดคุยกับลูกค้าได้ 15 นาที</ul>
          <ul><FaPaw className="inline-block text-gray-700 mr-2" /> ลูกค้าใช้บริการ 1,000 บาท/ชิ้น/แสดง: นั่งได้ 20 นาที</ul>
          <ul><FaPaw className="inline-block text-gray-700 mr-2" /> กรณีมีลูกค้ามามากกว่า 2 คน: โดยนับจาก COMMISSION และนั่งพูดคุย 15 นาที</ul>
        </ul>
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