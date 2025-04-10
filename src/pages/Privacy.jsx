import React, { useState, useEffect } from 'react';
import { BsShieldLockFill } from 'react-icons/bs';

const Privacy = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const containerStyle = {
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.5s ease-in-out',
    padding: '40px', // เพิ่ม padding ให้ดูโปร่งขึ้น
    maxWidth: '900px', // ขยายความกว้างเล็กน้อย
    margin: '40px auto', // เพิ่ม margin บนล่าง และจัดให้อยู่ตรงกลาง
    lineHeight: '1.7', // เพิ่มความสูงของบรรทัดให้อ่านง่ายขึ้น
    fontSize: '1.05rem', // เพิ่มขนาดตัวอักษรเล็กน้อย
    color: '#444', // เปลี่ยนสีตัวอักษรให้เข้มขึ้นเล็กน้อย
    backgroundColor: '#f9f9f9', // เพิ่มสีพื้นหลังอ่อนๆ
    borderRadius: '8px', // เพิ่มขอบมน
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // เพิ่มเงาเล็กน้อย
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px', // เพิ่ม margin ด้านล่าง
    borderBottom: '1px solid #eee', // เพิ่มเส้นแบ่งด้านล่าง
    paddingBottom: '20px', // เพิ่ม padding ด้านล่าง
  };

  const iconStyle = {
    fontSize: '2.5rem', // เพิ่มขนาดไอคอน
    marginRight: '15px', // เพิ่ม margin ด้านขวา
    color: '#007bff',
  };

  const headingStyle = {
    color: '#333',
    marginBottom: '15px', // เพิ่ม margin ด้านล่าง
  };

  const heading1Style = {
    fontSize: '2.6rem', // เพิ่มขนาด heading
    fontWeight: 'bold', // ทำให้ตัวหนา
  };

  const heading2Style = {
    fontSize: '2rem', // เพิ่มขนาด heading
    fontWeight: 'bold', // ทำให้ตัวหนา
    marginTop: '30px', // เพิ่ม margin ด้านบน
  };

  const heading3Style = {
    fontSize: '1.6rem', // เพิ่มขนาด heading
    marginTop: '20px', // เพิ่ม margin ด้านบน
    fontWeight: 'semibold', // ทำให้ตัวหนาเล็กน้อย
  };

  const ulStyle = {
    listStyleType: 'disc',
    marginLeft: '30px', // เพิ่ม margin ด้านซ้าย
    marginBottom: '15px', // เพิ่ม margin ด้านล่าง
  };

  const liStyle = {
    marginBottom: '8px', // เพิ่ม margin ด้านล่าง
  };

  const paragraphStyle = {
    marginBottom: '20px', // เพิ่ม margin ด้านล่าง
  };

  const lastUpdatedStyle = {
    fontStyle: 'italic',
    color: '#777',
    marginBottom: '30px', // เพิ่ม margin ด้านล่าง
    textAlign: 'right', // จัดข้อความไปทางขวา
  };

  const noteStyle = {
    fontSize: '0.95rem', // เพิ่มขนาดตัวอักษรเล็กน้อย
    color: '#666',
    marginTop: '25px', // เพิ่ม margin ด้านบน
    borderTop: '1px solid #eee', // เพิ่มเส้นแบ่งด้านบน
    paddingTop: '20px', // เพิ่ม padding ด้านบน
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <BsShieldLockFill style={iconStyle} />
        <h1 style={{ ...headingStyle, ...heading1Style }}>นโยบายความเป็นส่วนตัว</h1>
      </div>
      <p style={lastUpdatedStyle}>
        วันที่ปรับปรุงล่าสุด: 27 มีนาคม 2568
      </p>

      <p style={paragraphStyle}>
        Blackneko-TH.com ("เว็บไซต์", "เรา", "พวกเรา", "ของเรา") เคารพสิทธิความเป็นส่วนตัวของผู้เข้าชมเว็บไซต์ของเรา
        นโยบายความเป็นส่วนตัวนี้อธิบายถึงวิธีการที่เราอาจเก็บรวบรวมข้อมูลบางอย่างเกี่ยวกับการเข้าชมเว็บไซต์ของคุณ โดยเฉพาะอย่างยิ่งผ่านการใช้คุกกี้
        โปรดอ่านนโยบายความเป็นส่วนตัวนี้อย่างละเอียด
      </p>

      <h2 style={{ ...headingStyle, ...heading2Style }}>1. ข้อมูลที่เราเก็บรวบรวม (คุกกี้)</h2>
      <p style={paragraphStyle}>เว็บไซต์ของเราอาจใช้คุกกี้เพื่อเก็บรวบรวมข้อมูลเกี่ยวกับการเข้าชมของคุณ ซึ่งรวมถึง:</p>
      <ul style={ulStyle}>
        <li style={liStyle}><strong>ข้อมูลการใช้งาน:</strong> ข้อมูลเกี่ยวกับวิธีที่คุณใช้งานเว็บไซต์ รวมถึงหน้าเว็บที่คุณเข้าชม เวลาที่เข้าชม ระยะเวลาที่อยู่ในหน้าเว็บ และการคลิก</li>
        <li style={liStyle}><strong>ข้อมูลอุปกรณ์:</strong> ข้อมูลเกี่ยวกับอุปกรณ์ที่คุณใช้เข้าถึงเว็บไซต์ รวมถึงประเภทอุปกรณ์ ระบบปฏิบัติการ ที่อยู่ IP ประเภทเบราว์เซอร์ และข้อมูลเครือข่าย</li>
      </ul>
      <p style={paragraphStyle}>
        คุกกี้เหล่านี้ช่วยให้เราเข้าใจพฤติกรรมการใช้งานของผู้เข้าชม และปรับปรุงประสบการณ์การใช้งานเว็บไซต์ให้ดียิ่งขึ้น
      </p>

      <h2 style={{ ...headingStyle, ...heading2Style }}>2. วิธีการที่เราใช้ข้อมูล (คุกกี้)</h2>
      <p style={paragraphStyle}>เราอาจใช้ข้อมูลที่เก็บรวบรวมผ่านคุกกี้เพื่อวัตถุประสงค์ดังต่อไปนี้:</p>
      <ul style={ulStyle}>
        <li style={liStyle}>เพื่อวิเคราะห์การใช้งานเว็บไซต์และปรับปรุงเนื้อหา การออกแบบ และประสบการณ์ผู้ใช้</li>
        <li style={liStyle}>เพื่อทำความเข้าใจจำนวนผู้เข้าชมเว็บไซต์และแนวโน้มการเข้าชม</li>
      </ul>
      <p style={paragraphStyle}>
        เราไม่ได้เก็บรวบรวมข้อมูลส่วนบุคคลที่สามารถระบุตัวตนของคุณได้โดยตรงผ่านคุกกี้เหล่านี้
      </p>

      <h2 style={{ ...headingStyle, ...heading2Style }}>3. การจัดการคุกกี้</h2>
      <p style={paragraphStyle}>
        คุณสามารถจัดการการตั้งค่าคุกกี้ได้ในการตั้งค่าเบราว์เซอร์ของคุณ โดยทั่วไปคุณสามารถเลือกที่จะยอมรับหรือปฏิเสธคุกกี้บางประเภทได้
        โปรดทราบว่าการปิดใช้งานคุกกี้บางประเภทอาจส่งผลต่อการทำงานของเว็บไซต์บางส่วน
      </p>

      <h2 style={{ ...headingStyle, ...heading2Style }}>4. การเปิดเผยข้อมูล</h2>
      <p style={paragraphStyle}>
        เนื่องจากเราไม่ได้เก็บรวบรวมข้อมูลส่วนบุคคลที่สามารถระบุตัวตนได้โดยตรง ข้อมูลที่ได้จากคุกกี้จึงอาจถูกใช้ร่วมกับผู้ให้บริการวิเคราะห์เว็บไซต์เพื่อวัตถุประสงค์ในการวิเคราะห์และปรับปรุงเว็บไซต์
      </p>

      <h2 style={{ ...headingStyle, ...heading2Style }}>5. การเปลี่ยนแปลงนโยบายความเป็นส่วนตัว</h2>
      <p style={paragraphStyle}>
        เราอาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว การเปลี่ยนแปลงใดๆ จะมีผลบังคับใช้เมื่อเราเผยแพร่นโยบายความเป็นส่วนตัวฉบับปรับปรุงบนเว็บไซต์
        เราขอแนะนำให้คุณตรวจสอบนโยบายความเป็นส่วนตัวนี้เป็นประจำเพื่อรับทราบข้อมูลล่าสุด
      </p>

      <h2 style={{ ...headingStyle, ...heading2Style }}>6. ติดต่อเรา</h2>
      <p style={paragraphStyle}>
        หากคุณมีคำถาม ข้อสงสัย เกี่ยวกับนโยบายความเป็นส่วนตัวของเรา โปรดติดต่อเราได้ที่:Blackneko.mbk@gmail.com
      </p>
      <p style={paragraphStyle}><strong>อีเมล:BlackNeko.gmail.com</strong> [ใส่อีเมลติดต่อสำหรับเรื่องความเป็นส่วนตัว]</p>
      <p style={noteStyle}>
        หมายเหตุ: โปรดปรับปรุงข้อมูลในวงเล็บ [ ] ให้เป็นข้อมูลที่ถูกต้องของเว็บไซต์ Blackneko.in.th และตรวจสอบให้แน่ใจว่านโยบายนี้สอดคล้องกับกฎหมายคุ้มครองข้อมูลส่วนบุคคลที่บังคับใช้
      </p>
    </div>
  );
};

export default Privacy;