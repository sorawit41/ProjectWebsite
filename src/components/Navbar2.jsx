import React from 'react';
// Import Link จาก react-router-dom
import { Link } from 'react-router-dom';
// Import ไอคอนที่จำเป็น
import {
  FaFacebookF, // หรือ FaFacebook ถ้าต้องการสไตล์นั้น
  FaInstagram,
  FaTiktok,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock
} from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6"; // ไอคอน Twitter/X ใหม่
import iconnobg from "../assets/imgs/iconnobg.png"; // ตรวจสอบ path ให้ถูกต้อง

const UnifiedFooter = () => {
  const currentYear = new Date().getFullYear();

  // ปรับปรุงข้อมูล footerLinkGroups (อาจลบ 'ทางกฎหมาย' ถ้าไม่ต้องการซ้ำซ้อนกับ bottom bar)
  const footerLinkGroups = [
    {
      title: "เมนูหลัก",
      links: [
   { name: "ติดต่อเรา", href: "/Contact" },
        { name: "วิธีการเดินทาง", href: "/Access" },
        { name: "กฎระเบียบของร้าน", href: "/Rules" },
        { name: "ตารางงานและอีเว้นท์", href: "/Schedule" }, // << ลิงก์ที่เพิ่มเข้ามา
        { name: "ระบบสมาชิก", href: "/Member" }, // << ลิงก์ที่เพิ่มเข้ามา
        { name: "เมนูอาหาร", href: "/MainMenu" }, // << ลิงก์ที่เพิ่มเข้ามา
        { name: "เมนูเครื่องดื่ม", href: "/DrinkMenu" }, // << ลิงก์ที่เพิ่มเข้ามา
        { name: "อัพเดทข่าวสาร", href: "/NewsAndEvent" }, // << ลิงก์ที่เพิ่มเข้ามา
        { name: "เกี่ยวกับเรา", href: "/About" }, // << ลิงก์ที่เพิ่มเข้ามา
        { name: "สื่อประชาสัมพันธ์", href: "/Media" }, // << ลิงก์ที่เพิ่มเข้ามา
        { name: "รับสมัครงาน", href: "/Receive" }, // << ลิงก์ที่เพิ่มเข้ามา

      ]
    },
    {
      title: "ช่วยเหลือ",
      links: [
        { name: "ติดต่อเรา", href: "/contact" },
      ]
    }
    // ส่วน "ทางกฎหมาย" จะไปอยู่ที่ bottom bar โดยใช้ <Link>
  ];

  const contactInfo = [
    { icon: <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0" />, text: "ศูนย์การค้า MBK Center, แขวงวังใหม่ เขตปทุมวัน กรุงเทพมหานคร 10330" },
    { icon: <FaPhone className="mr-2 mt-1 flex-shrink-0" />, text: "0895535468" }, //  ใส่เบอร์โทรจริง
    { icon: <FaEnvelope className="mr-2 mt-1 flex-shrink-0" />, text: "mek.it@blackneko.in.th" },
  ];

  const openingHours = [
    { icon: <FaClock className="mr-2 flex-shrink-0 text-gray-400" />, days: "ทุกวัน", hours: "16.00 น. - 00.00 น." },
  ];

  // อัปเดต socialLinks ด้วย URL และ ไอคอนที่ถูกต้อง
  const socialLinks = [
    { name: "Facebook", icon: <FaFacebookF />, href: "https://www.facebook.com/BLACKNEKOMBK", ariaLabel: "Facebook" },
    { name: "Instagram", icon: <FaInstagram />, href: "https://www.instagram.com/blackneko.mbk/", ariaLabel: "Instagram" },
    { name: "TikTok", icon: <FaTiktok />, href: "https://www.tiktok.com/@blackneko.mbk", ariaLabel: "TikTok" },

  ];

  return (
    <footer className="bg-black text-gray-300 pt-16 pb-8"> {/* ใช้ bg-black โดยตรง ไม่ต้องมี dark: ถ้า footer จะดำเสมอ */}
      <div className="container mx-auto px-6 lg:px-8">
        {/* Top Section: Logo, Links, Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Logo and Business Name */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center mb-4 group"> {/* ทำให้โลโก้เป็น Link ไปหน้าแรก */}
              <img src={iconnobg} alt="Black Neko Logo" className="h-14 mr-3 transition-opacity duration-300 group-hover:opacity-80" />
              <div>
                <h2 className="text-2xl font-bold text-white">Black</h2>
                <p className="text-xl text-white -mt-1">Neko</p>
              </div>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              MBK Center
            </p>
            <div className="mt-4">
              <h4 className="text-md font-semibold text-white mb-2">เวลาทำการ:</h4>
              {openingHours.map((item, index) => (
                <div key={index} className="flex items-start text-sm text-gray-400 mb-1">
                  {item.icon}
                  <span><strong>{item.days}:</strong> {item.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link Groups Columns */}
          {footerLinkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-lg font-semibold text-white mb-5">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((linkItem) => (
                  <li key={linkItem.name}>
                    {/* ใช้ Link ถ้าเป็น internal route, หรือ a ถ้าเป็น external */}
                    {linkItem.href.startsWith('/') ? (
                      <Link
                        to={linkItem.href}
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {linkItem.name}
                      </Link>
                    ) : (
                      <a
                        href={linkItem.href}
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                        target="_blank" // สำหรับ external links
                        rel="noopener noreferrer" // สำหรับ external links
                      >
                        {linkItem.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Column for Contact Information */}
          <div>
             <h3 className="text-lg font-semibold text-white mb-5">ติดต่อเรา</h3>
             <ul className="space-y-3">
                {contactInfo.map((item, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-400">
                        {item.icon}
                        <span>{item.text}</span>
                    </li>
                ))}
             </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright, Legal Links (using react-router Link), and Social Media */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          
          
          

          <div className="flex space-x-5 order-3"> {/* Social Media Links */}
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.ariaLabel} // ใช้ ariaLabel ที่กำหนดไว้
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                {React.cloneElement(social.icon, { className: "w-5 h-5" })} {/* ปรับขนาดไอคอนให้สม่ำเสมอ */}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UnifiedFooter;