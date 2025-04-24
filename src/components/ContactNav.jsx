import React from 'react';
import { CiMail } from "react-icons/ci"; // เปลี่ยน import เป็น CiMail
import { Link } from 'react-router-dom';

const ContactNav = () => {
  return (
    <div>
      <Link to="/Contact">
      <CiMail size="1.5em" className="text-black dark:text-white" />

      </Link>
    </div>
  )
}

export default ContactNav;