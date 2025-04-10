import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom


const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContainer}>
        <p style={styles.footerText}>© {new Date().getFullYear()} Black Neko</p>
        <div style={styles.footerIcons}>
          <a
            href="https://www.facebook.com/BLACKNEKOMBK"
            style={styles.footerIcon}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebook style={styles.icon} />
          </a>
          <a
            href="https://www.instagram.com/blackneko.mbk/"
            style={styles.footerIcon}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram style={styles.icon} />
          </a>
          <a
            href="https://www.tiktok.com/@blackneko.mbk" // Replace with your TikTok handle
            style={styles.footerIcon}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
          >
            <FaTiktok style={styles.icon} />
          </a>
        </div>
        <Link to ="./Privacy" style={styles.footerPrivacy}>Privacy Policy</Link>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: 'black',
    color: 'white',
    padding: '20px 0',
  },
  footerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  footerText: {
    fontSize: '14px',
  },
  footerIcons: {
    display: 'flex',
  },
  footerIcon: {
    margin: '0 10px',
    textDecoration: 'none',
    color: 'white',
  },
  icon: {
    width: '24px',
    height: '24px',
  },
  footerPrivacy: {
    fontSize: '14px',
    textDecoration: 'none',
    color: 'white',
  },
};

export default Footer;