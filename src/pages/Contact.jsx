import React, { useState, useEffect } from 'react';
import { FaUser, FaPhoneAlt, FaEnvelope, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [animate, setAnimate] = useState(false);

  // ฟังก์ชันสำหรับอัพเดตข้อมูลฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // ฟังก์ชันสำหรับส่งฟอร์ม
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('ข้อมูลที่ส่ง:', formData);
    setSubmitted(true);
  };

  // ใช้ useEffect สำหรับเพิ่ม animation หลังจากส่งฟอร์ม
  useEffect(() => {
    if (submitted) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 3000); // animation หายไปหลังจาก 3 วินาที
      setFormData({ name: '', phone: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 3500);
    }
  }, [submitted]);

  return (
    <div
      style={{
        padding: '40px',
        maxWidth: '700px',
        margin: '40px auto',
        textAlign: 'center',
        backgroundColor: '#fff',
        borderRadius: '15px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
        border: '1px solid #e0e0e0',
        transition: 'transform 0.3s ease',
      }}
    >
      <h2
        style={{
          fontSize: '2.5em',
          marginBottom: '30px',
          color: '#333',
          transition: 'color 0.3s ease-in-out',
        }}
      >
        Contact Us
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '25px',
          padding: '0 20px',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        {/* Form Fields */}
        {['name', 'phone', 'email', 'message'].map((field, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <label
              style={{
                fontSize: '1.1em',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#333',
              }}
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <div
              style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {field === 'name' && <FaUser style={{ fontSize: '1em', color: '#555', marginRight: '10px' }} />}
              {field === 'phone' && <FaPhoneAlt style={{ fontSize: '1em', color: '#555', marginRight: '10px' }} />}
              {field === 'email' && <FaEnvelope style={{ fontSize: '1em', color: '#555', marginRight: '10px' }} />}
              {field === 'message' && <textarea
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder="Your Message"
                style={{
                  width: '100%',
                  height: '180px',
                  padding: '12px 15px',
                  marginTop: '5px',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.3s ease',
                }}
                required
              />}
              {field !== 'message' && (
                <input
                  type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={`Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    marginTop: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    fontSize: '16px',
                    transition: 'border-color 0.3s ease',
                  }}
                  required
                />
              )}
            </div>
          </div>
        ))}
        
        <button
          type="submit"
          style={{
            padding: '12px 25px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1.1em',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'background-color 0.3s ease, transform 0.3s ease',
          }}
        >
          <FaPaperPlane style={{ fontSize: '1.2em', marginRight: '10px' }} />
          Submit
        </button>
      </form>

      {submitted && (
        <div
          style={{
            marginTop: '30px',
            padding: '20px',
            fontSize: '1.1em',
            color: '#28a745',
            fontWeight: 'bold',
            backgroundColor: '#d4edda',
            borderRadius: '8px',
            border: '1px solid #c3e6cb',
            textAlign: 'center',
            opacity: animate ? 1 : 0,
            transform: animate ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'opacity 0.5s ease-out, transform 0.5s ease-out', // animation
          }}
        >
          <p style={{ marginBottom: '5px' }}>Thank you for contacting us!</p>
          <p>We will get back to you as soon as possible.</p>
        </div>
      )}
    </div>
  );
};

export default Contact;
