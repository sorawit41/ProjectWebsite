import React from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // เพิ่ม import Link

const ContactNav = () => {
  return (
    <div>
      <Link to="/Contact"> {/* ใช้ Link เพื่อเชื่อมไปยัง Contact.jsx */}
        <FaEnvelope size="1.5em" />
      </Link>
    </div>
  )
}

export default ContactNav;