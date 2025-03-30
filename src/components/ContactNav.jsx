import React from 'react';
import { CiMail } from "react-icons/ci"; // เปลี่ยน import เป็น CiMail
import { Link } from 'react-router-dom';

const ContactNav = () => {
  return (
    <div>
      <Link to="/Contact">
        <CiMail size="1.5em" /> {/* เปลี่ยน Component เป็น CiMail */}
      </Link>
    </div>
  )
}

export default ContactNav;