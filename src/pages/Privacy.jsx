import React, { useState, useEffect } from 'react';
import { BsShieldLockFill } from 'react-icons/bs';

const PrivacyPolicy = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300); // Slightly faster fade-in

    return () => clearTimeout(timer);
  }, []);

  const containerStyle = {
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.7s ease-in-out',
    padding: '50px 40px', // Increased padding
    maxWidth: '960px', // Slightly wider
    margin: '50px auto', // Increased top/bottom margin
    lineHeight: '1.8', // Increased line height
    fontSize: '1rem',   // Standard base font size
    color: '#555', // Softer text color
    backgroundColor: '#ffffff', // Clean white background
    borderRadius: '12px', // Softer border radius
    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.07)', // Softer, more modern shadow
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", // Common modern font stack
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '35px',
    borderBottom: '1px solid #e0e0e0', // Lighter separator
    paddingBottom: '25px',
  };

  const iconStyle = {
    fontSize: '2.8rem', // Slightly larger icon
    marginRight: '20px',
    color: '#007AFF', // Apple's system blue - professional
  };

  const headingStyle = { // Base for all headings
    color: '#333',
    fontWeight: 'bold',
    fontFamily: "'Georgia', serif", // A nice serif for headings
  };

  const heading1Style = {
    ...headingStyle,
    fontSize: '2.4rem',
    marginBottom: '0', // Handled by headerStyle padding
  };

  const heading2Style = {
    ...headingStyle,
    fontSize: '1.75rem',
    marginTop: '45px',
    marginBottom: '20px',
    borderBottom: '1px solid #f0f0f0',
    paddingBottom: '10px',
  };

  const ulStyle = {
    listStyleType: 'disc',
    paddingLeft: '25px', // Use padding for better control
    marginBottom: '20px',
    listStylePosition: 'outside',
  };

  const liStyle = {
    marginBottom: '12px',
    color: '#555',
  };

  const paragraphStyle = {
    marginBottom: '20px',
    color: '#555', // Consistent paragraph color
  };

  const lastUpdatedStyle = {
    fontStyle: 'italic',
    color: '#888',
    marginBottom: '30px',
    textAlign: 'right',
    fontSize: '0.9rem',
  };

  const strongStyle = {
    color: '#333', // Darker color for emphasis
    fontWeight: '600',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <BsShieldLockFill style={iconStyle} />
        <h1 style={heading1Style}>นโยบายความเป็นส่วนตัว</h1>
      </div>
      <p style={lastUpdatedStyle}>
        ปรับปรุงล่าสุด: 23 พฤษภาคม 2568
      </p>

      <p style={paragraphStyle}>
        เว็บไซต์ <strong style={strongStyle}>Blackneko-TH.com</strong> ("เว็บไซต์", "เรา", "พวกเรา", หรือ "ของเรา") ให้ความสำคัญและเคารพในสิทธิความเป็นส่วนตัวของผู้เข้าใช้งานทุกท่าน นโยบายความเป็นส่วนตัวนี้ ("นโยบาย") อธิบายวิธีการที่เราเก็บรวบรวม ใช้
      </p>

      <h2 style={heading2Style}>1. ข้อมูลที่เราเก็บรวบรวมผ่านคุกกี้</h2>
      <p style={paragraphStyle}>เว็บไซต์ของเราอาจใช้คุกกี้ (Cookies) เพื่อเก็บรวบรวมข้อมูลเกี่ยวกับการเข้าชมเว็บไซต์ของท่าน ซึ่งอาจรวมถึง:</p>
      <ul style={ulStyle}>
        <li style={liStyle}><strong style={strongStyle}>ข้อมูลการใช้งาน (Usage Data):</strong> รายละเอียดเกี่ยวกับการโต้ตอบของท่านกับเว็บไซต์ เช่น หน้าเว็บที่ท่านเข้าชม เวลาที่ใช้ในแต่ละหน้า ลำดับการเข้าชม ลิงก์ที่คลิก และกิจกรรมอื่นๆ บนเว็บไซต์</li>
        <li style={liStyle}><strong style={strongStyle}>ข้อมูลอุปกรณ์ (Device Data):</strong> ข้อมูลทางเทคนิคเกี่ยวกับอุปกรณ์ที่ท่านใช้เข้าถึงเว็บไซต์ เช่น ประเภทของอุปกรณ์ (คอมพิวเตอร์, โทรศัพท์มือถือ), ระบบปฏิบัติการ, ที่อยู่ IP (Internet Protocol), ประเภทและเวอร์ชันของเบราว์เซอร์ และข้อมูลเครือข่ายอื่นๆ ที่เกี่ยวข้อง</li>
      </ul>
      <p style={paragraphStyle}>
        คุกกี้เหล่านี้ช่วยให้เราสามารถทำความเข้าใจพฤติกรรมการใช้งานของผู้เข้าชม และนำข้อมูลไปปรับปรุงประสบการณ์การใช้งานเว็บไซต์ให้ดียิ่งขึ้น
      </p>

      <h2 style={heading2Style}>2. วัตถุประสงค์ในการใช้ข้อมูลที่เก็บรวบรวมผ่านคุกกี้</h2>
      <p style={paragraphStyle}>เราอาจใช้ข้อมูลที่เก็บรวบรวมผ่านคุกกี้เพื่อวัตถุประสงค์ดังต่อไปนี้:</p>
      <ul style={ulStyle}>
        <li style={liStyle}>เพื่อวิเคราะห์และทำความเข้าใจลักษณะการใช้งานเว็บไซต์ของท่าน เพื่อนำไปปรับปรุงเนื้อหา การออกแบบ และประสบการณ์ผู้ใช้ให้ดียิ่งขึ้น</li>
        <li style={liStyle}>เพื่อติดตามและวิเคราะห์จำนวนผู้เข้าชมเว็บไซต์ รวมถึงศึกษาแนวโน้มการเข้าชมโดยรวม</li>
        <li style={liStyle}>เพื่อปรับปรุงความปลอดภัยและป้องกันการฉ้อโกงบนเว็บไซต์</li>
      </ul>
      <p style={paragraphStyle}>
        ข้อมูลที่เก็บรวบรวมผ่านคุกกี้โดยทั่วไปจะไม่ใช่ข้อมูลที่สามารถระบุตัวตนของท่านได้โดยตรง เว้นแต่ท่านจะได้ให้ข้อมูลดังกล่าวแก่เราด้วยวิธีการอื่น
      </p>

      <h2 style={heading2Style}>3. การจัดการคุกกี้ของท่าน</h2>
      <p style={paragraphStyle}>
        ท่านสามารถควบคุมและจัดการการใช้งานคุกกี้ได้ผ่านการตั้งค่าบนเบราว์เซอร์ของท่าน ท่านสามารถเลือกที่จะยอมรับ ปฏิเสธ หรือลบคุกกี้ได้ โปรดทราบว่าการปิดใช้งานหรือลบคุกกี้บางประเภทอาจส่งผลกระทบต่อประสบการณ์การใช้งานเว็บไซต์ของท่าน และบางฟังก์ชันอาจทำงานได้ไม่สมบูรณ์
      </p>

     

      <h2 style={heading2Style}>4. ช่องทางการติดต่อ</h2>
      <p style={paragraphStyle}>
        หากท่านมีคำถาม ข้อสงสัย หรือข้อเสนอแนะเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ โปรดติดต่อเราได้ผ่านช่องทางต่อไปนี้:
      </p>
      <p style={paragraphStyle}>
        <strong style={strongStyle}>อีเมล:</strong> Blackneko.mbk@gmail.com
      </p>
    </div>
  );
};

export default PrivacyPolicy;