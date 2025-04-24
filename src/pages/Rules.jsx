import React, { useState, useEffect } from 'react';
import { FaExclamationCircle, FaInfoCircle, FaPaw } from 'react-icons/fa';

const Rules = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div
      className={`container mx-auto px-4 py-8 pt-20 transition-opacity duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
        กฎระเบียบการใช้บริการ BlackNeko
      </h1>

      <div className="space-y-6 text-gray-800 dark:text-gray-200">
        <h2 className="text-2xl font-semibold">กฎการใช้บริการ</h2>
        <ol className="list-decimal pl-6 space-y-4">
          <li>
            <div className="flex items-center">
              <FaInfoCircle className="text-blue-500 dark:text-blue-400 mr-2" />
              <span>ใช้บริการขั้นต่ำ 150 บาท/ท่าน/1 ชม.</span>
            </div>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>กรณีสั่งของ/ดื่ม เกินราคาสามารถรวมได้</li>
              <li>
                กรณีสั่งของ/ดื่ม เกินราคา 150 บาท ไม่นับยอดเป็นชม. เช่น สั่ง MOCKTAIL ราคา 380 บาท สามารถใช้บริการได้ 1 ชม.
              </li>
            </ul>
          </li>

          <li>
            <div className="flex items-center">
              <FaExclamationCircle className="text-red-500 mr-2" />
              <span>ห้ามสัมผัสตัว หรือพูดจาไม่สุภาพกับแคสทุกกรณี</span>
            </div>
          </li>

          <li>
            <div className="flex items-center">
              <FaInfoCircle className="text-blue-500 dark:text-blue-400 mr-2" />
              <span>
                กรณีสั่งสินค้า หรือบริการใดๆ ที่แสดงว่า COMMISSION กรุณาแจ้งชื่อแอดที่ท่านต้องการให้ได้รับค่าคอมมิชชั่น
              </span>
            </div>
          </li>

          <li>
            <div className="flex items-center">
              <FaInfoCircle className="text-blue-500 dark:text-blue-400 mr-2" />
              <span>
                โปรโมชั่นพิเศษ ระยะเวลา และเงื่อนไขการบริการของทางร้านสามารถปรับเปลี่ยนได้ตามที่บริษัทกำหนด
              </span>
            </div>
          </li>
        </ol>

        <h2 className="text-2xl font-semibold mt-6">รายละเอียดการใช้บริการกับน้องแมว</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><FaPaw className="inline-block text-gray-600 dark:text-gray-300 mr-2" /> ลูกค้าใช้บริการขั้นต่ำ 150 บาท/ท่าน/ชม.</li>
          <li><FaPaw className="inline-block text-gray-600 dark:text-gray-300 mr-2" /> แสดงสามารถพูดคุยทักทายได้ไม่เกิน 5 นาที (แสดงน้ำนม)</li>
          <li><FaPaw className="inline-block text-gray-600 dark:text-gray-300 mr-2" /> พิเศษ! เฉพาะสินค้า และบริการที่แสดงว่า COMMISSION เท่านั้น</li>
          <li><FaPaw className="inline-block text-gray-600 dark:text-gray-300 mr-2" /> ลูกค้าใช้บริการ 180-299 บาท/ชิ้น/แสดง/เครื่องดื่ม: พูดคุยได้ 10 นาที</li>
          <li><FaPaw className="inline-block text-gray-600 dark:text-gray-300 mr-2" /> ลูกค้าใช้บริการ 300-999 บาท/ชิ้น/แสดง/เครื่องดื่ม/เชกิ/ไลฟ์: พูดคุยได้ 15 นาที</li>
          <li><FaPaw className="inline-block text-gray-600 dark:text-gray-300 mr-2" /> ลูกค้าใช้บริการ 1,000 บาท/ชิ้น/แสดง: นั่งได้ 20 นาที</li>
          <li><FaPaw className="inline-block text-gray-600 dark:text-gray-300 mr-2" /> กรณีลูกค้ามากกว่า 2 คน: พูดคุยได้ 15 นาที (นับจาก COMMISSION)</li>
        </ul>
      </div>

      <div className="mt-6">
        <button
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          onClick={() => setShowInfo(!showInfo)}
        >
          {showInfo ? 'ซ่อนข้อมูลเพิ่มเติม' : 'แสดงข้อมูลเพิ่มเติม'}
        </button>

        {showInfo && (
          <div className="mt-4 text-gray-700 dark:text-gray-300 space-y-2">
            <p>
              BlackNeko เป็นพื้นที่ปลอดภัยสำหรับน้องแมวทุกตัว เราให้ความสำคัญกับความเป็นส่วนตัวและความเป็นอยู่ที่ดีของน้องแมวเป็นอันดับแรก
            </p>
            <p>
              การถ่ายภาพน้องแมวอาจทำให้น้องแมวรู้สึกไม่สบายตัวและเป็นการรบกวนความเป็นส่วนตัวของน้องแมว
            </p>
            <p>
              ขอความร่วมมือทุกท่านงดการถ่ายภาพน้องแมวภายในร้าน เพื่อสร้างสภาพแวดล้อมที่ผ่อนคลายและปลอดภัยสำหรับน้องแมว
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rules;
