import React, { useState, useEffect } from 'react';
import { FaUser, FaPhoneAlt, FaEnvelope, FaPaperPlane, FaRegCheckCircle } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('ข้อมูลที่ส่ง:', formData);
    setSubmitted(true);
  };

  useEffect(() => {
    if (submitted) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 3000);
      setFormData({ name: '', phone: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 3500);
    }
  }, [submitted]);

  useEffect(() => {
    setTimeout(() => {
      setFadeIn(true);
    }, 500);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-center mb-6">Contact Us</h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg space-y-6"
        style={{
          opacity: fadeIn ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
        }}
      >
        {['name', 'phone', 'email', 'message'].map((field, index) => (
          <div key={index} className="space-y-2">
            <label htmlFor={field} className="text-xl font-semibold capitalize">
              {field}:
            </label>
            <div className="relative">
              {field === 'name' && <FaUser className="absolute left-3 top-3" color="#007bff" />}
              {field === 'phone' && <FaPhoneAlt className="absolute left-3 top-3" color="#007bff" />}
              {field === 'email' && <FaEnvelope className="absolute left-3 top-3" color="#007bff" />}
              {field === 'message' ? (
                <textarea
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10"
                  placeholder={`Your ${field}`}
                  rows="4"
                  required
                />
              ) : (
                <input
                  type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10"
                  placeholder={`Your ${field}`}
                  required
                />
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300 flex items-center"
          >
            <FaPaperPlane className="mr-2" color="#fff" />
            Submit
          </button>
        </div>
      </form>

      {submitted && (
        <div
          className={`mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md text-center ${
            animate ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
          } transition-opacity duration-500 transition-transform duration-500`}
        >
          <p className="font-semibold">Thank you for contacting us!</p>
          <p>We will get back to you as soon as possible.</p>
        </div>
      )}
    </div>
  );
};

export default Contact;