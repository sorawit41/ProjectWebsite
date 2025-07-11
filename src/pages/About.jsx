import React from 'react';
import story1 from "../assets/about/1.png"; // น่าจะเป็นส่วนบน
import story2 from "../assets/about/2.png"; // น่าจะเป็นส่วนล่าง

const Receive = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      {/* ใช้ pt-20 กับ div หลัก หรือ padding-top ใน CSS เพื่อให้มีพื้นที่ด้านบน */}
      <div className="w-full relative pt-20"> {/* เพิ่ม pt-20 เพื่อให้มีช่องว่างด้านบนของหน้าจอ */}
        {/* รูปแรก */}
        <img
          src={story1}
          alt="Receive Story Part 1"
          className="object-cover w-full h-auto block" // h-auto เพื่อรักษาสัดส่วน, block เพื่อป้องกันช่องว่างเล็กๆ ใต้รูป
        />
        {/* รูปที่สอง ต่อท้ายทันที */}
        <img
          src={story2}
          alt="Receive Story Part 2"
          className="object-cover w-full h-auto block" // h-auto เพื่อรักษาสัดส่วน, block เพื่อป้องกันช่องว่างเล็กๆ ใต้รูป
        />
      </div>
    </div>
  );
};

export default Receive;