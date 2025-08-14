import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock
} from 'react-icons/fa';
import iconnobg from "../assets/imgs/iconnobg.png"; // ตรวจสอบว่า path ถูกต้อง

// --- 1. Configuration & Data ---
// รวบรวมข้อมูลทั้งหมดไว้ที่นี่เพื่อการจัดการที่ง่าย

const CONTACT_PHONE = "089-553-5468";
const CONTACT_EMAIL = "mek.it@blackneko.in.th";
const BUSINESS_ADDRESS = "ศูนย์การค้า MBK Center, แขวงวังใหม่ เขตปทุมวัน กรุงเทพมหานคร 10330";

const footerLinkGroups = [
  {
    title: "เมนูหลัก",
    links: [
      { name: "เกี่ยวกับเรา", href: "/About" },
      { name: "กฎระเบียบของร้าน", href: "/Rules" },
      { name: "ตารางงานและอีเว้นท์", href: "/Schedule" },
      { name: "อัพเดทข่าวสาร", href: "/NewsAndEvent" },
      { name: "เมนูอาหาร", href: "/MainMenu" },
      { name: "เมนูเครื่องดื่ม", href: "/DrinkMenu" },
      { name: "ระบบสมาชิก", href: "/Member" },
      { name: "วิธีการเดินทาง", href: "/Access" },
    ]
  },
  {
    title: "ช่วยเหลือ",
    links: [
      { name: "ติดต่อเรา", href: "/Contact" },
      { name: "สื่อประชาสัมพันธ์", href: "/Media" },
      { name: "ร่วมงานกับเรา", href: "/Receive" }, // เปลี่ยนจาก "รับสมัครงาน"
    ]
  }
];

const contactInfoData = [
  { icon: FaMapMarkerAlt, text: BUSINESS_ADDRESS },
  { icon: FaPhone, text: CONTACT_PHONE, href: `tel:${CONTACT_PHONE}` },
  { icon: FaEnvelope, text: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
];

const openingHoursData = [
  { icon: FaClock, days: "ทุกวัน", hours: "16:00 น. - 00:00 น." },
];

const socialLinksData = [
  { name: "Facebook", icon: FaFacebookF, href: "https://www.facebook.com/BLACKNEKOMBK" },
  { name: "Instagram", icon: FaInstagram, href: "https://www.instagram.com/blackneko.mbk/" },
  { name: "TikTok", icon: FaTiktok, href: "https://www.tiktok.com/@blackneko.mbk" },
];


// --- 2. Reusable Sub-components ---
// แยกส่วนต่างๆ เพื่อให้โค้ดหลักสะอาดและอ่านง่าย

/** Component สำหรับแสดงโลโก้, ชื่อ และเวลาทำการ */
const BusinessInfo = () => (
  <div className="md:col-span-2 lg:col-span-1">
    <Link to="/" className="flex items-center mb-4 group">
      <img src={iconnobg} alt="Black Neko Logo" className="h-14 mr-3 transition-transform duration-300 group-hover:scale-105" />
      <div>
        <h2 className="text-2xl font-bold text-white">Black</h2>
        <p className="text-xl text-white -mt-1">Neko</p>
      </div>
    </Link>
    <p className="text-sm text-gray-400 mb-6">MBK Center</p>
    <div>
      <h4 className="text-md font-semibold text-white mb-3">เวลาทำการ</h4>
      {openingHoursData.map((item, index) => (
        <div key={index} className="flex items-start text-sm text-gray-400">
          <item.icon className="mr-2.5 mt-1 flex-shrink-0" />
          <span><strong>{item.days}:</strong> {item.hours}</span>
        </div>
      ))}
    </div>
  </div>
);

/** Component สำหรับแสดงกลุ่มลิงก์ 1 คอลัมน์ */
const FooterLinkGroup = ({ title, links }) => (
  <div>
    <h3 className="text-lg font-semibold text-white mb-5">{title}</h3>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.name}>
          <Link to={link.href} className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

/** Component สำหรับแสดงข้อมูลการติดต่อ */
const ContactInfo = () => (
  <div>
    <h3 className="text-lg font-semibold text-white mb-5">ติดต่อเรา</h3>
    <ul className="space-y-4">
      {contactInfoData.map((item) => (
        <li key={item.text} className="flex items-start text-sm">
          <item.icon className="mr-3 mt-1 flex-shrink-0 text-gray-400" />
          {item.href ? (
             <a href={item.href} className="text-gray-400 hover:text-white transition-colors duration-200">
              {item.text}
            </a>
          ) : (
            <span className="text-gray-400">{item.text}</span>
          )}
        </li>
      ))}
    </ul>
  </div>
);

/** Component สำหรับแสดงแถบ Footer ด้านล่างสุด */
const FooterBottomBar = ({ year }) => (
  <div className="border-t border-gray-800 pt-8 mt-12 flex flex-col-reverse gap-6 md:flex-row justify-between items-center text-sm">
    <p className="text-gray-500 text-center md:text-left">
      &copy; {year} Black Neko. สงวนลิขสิทธิ์.
    </p>
    <div className="flex space-x-5">
      {socialLinksData.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`เยี่ยมชม ${social.name} ของเรา`}
          className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
        >
          <social.icon className="w-5 h-5" />
        </a>
      ))}
    </div>
  </div>
);


// --- 3. Main Footer Component ---
// นำ Sub-components มาประกอบร่างกัน

const UnifiedFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-gray-300">
      <div className="container mx-auto px-6 lg:px-8 py-16">
        {/* Top Section: ประกอบด้วยข้อมูลหลักทั้งหมด */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <BusinessInfo />
          {footerLinkGroups.map((group) => (
            <FooterLinkGroup key={group.title} title={group.title} links={group.links} />
          ))}
          <ContactInfo />
        </div>

        {/* Bottom Section: แสดงลิขสิทธิ์และโซเชียล */}
        <FooterBottomBar year={currentYear} />
      </div>
    </footer>
  );
};

export default UnifiedFooter;