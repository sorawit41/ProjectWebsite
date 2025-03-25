import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContainer}>
        <p style={styles.footerText}>&copy; {new Date().getFullYear()} Black Neko</p>
        <div style={styles.footerIcons}>
          <a href="#" style={styles.footerIcon} target="_blank" rel="noopener noreferrer">
            <FaFacebook style={styles.icon} />
          </a>
          <a href="#" style={styles.footerIcon} target="_blank" rel="noopener noreferrer">
            <FaXTwitter style={styles.icon} />
          </a>
          <a href="#" style={styles.footerIcon} target="_blank" rel="noopener noreferrer">
            <FaInstagram style={styles.icon} />
          </a>
          <a href="#" style={styles.footerIcon} target="_blank" rel="noopener noreferrer">
            <FaYoutube style={styles.icon} />
          </a>
          <a href="#" style={styles.footerIcon} target="_blank" rel="noopener noreferrer">
            <FaTiktok style={styles.icon} />
          </a>
        </div>
        <a href="#" style={styles.footerPrivacy}>Privacy Policy</a>
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
