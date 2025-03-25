import React, { useState, useEffect } from 'react';
import { FaRegEdit, FaRegClock, FaPaw, FaRegCheckCircle, FaRegEnvelope } from 'react-icons/fa'; // Adding the envelope icon for email

const Receive = () => {
  // Adding email to the form state
  const [formData, setFormData] = useState({
    realName: '',
    displayName: '',
    specialSkills: '',
    availableTime: '',
    email: '' // New email field
  });

  // State for handling animation
  const [fadeIn, setFadeIn] = useState(false);

  // Handling form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handling form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('ข้อมูลถูกส่งเรียบร้อยแล้ว!');
    // Here you can send data to your server if needed
  };

  // UseEffect to trigger the fade-in animation
  useEffect(() => {
    setTimeout(() => {
      setFadeIn(true);
    }, 500); // Delay of 500ms before starting the fade-in animation
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-6">รับสมัครน้องแมวใหม่</h1>

      {/* ฟอร์มการสมัคร */}
      <form 
        onSubmit={handleSubmit} 
        className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg space-y-6"
        style={{
          opacity: fadeIn ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
        }}
      >
        {/* ชื่อจริง */}
        <div className="flex items-center space-x-3">
          <FaRegEdit className="text-blue-500" />
          <label htmlFor="realName" className="text-xl font-semibold">ชื่อจริงของคุณ:</label>
        </div>
        <input
          type="text"
          id="realName"
          name="realName"
          value={formData.realName}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="กรอกชื่อจริงของคุณ"
          required
        />

        {/* ชื่อที่อยากใช้ในร้าน */}
        <div className="flex items-center space-x-3">
          <FaRegEdit className="text-green-500" />
          <label htmlFor="displayName" className="text-xl font-semibold">ชื่อที่อยากใช้ในร้าน:</label>
        </div>
        <input
          type="text"
          id="displayName"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="กรอกชื่อที่อยากใช้ในร้าน"
          required
        />

        {/* ความสามารถพิเศษ */}
        <div className="flex items-center space-x-3">
          <FaPaw className="text-purple-500" />
          <label htmlFor="specialSkills" className="text-xl font-semibold">ความสามารถพิเศษ:</label>
        </div>
        <textarea
          id="specialSkills"
          name="specialSkills"
          value={formData.specialSkills}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="กรอกความสามารถพิเศษของคุณ"
          required
        />

        {/* เวลาที่สามารถทำงานได้ */}
        <div className="flex items-center space-x-3">
          <FaRegClock className="text-yellow-500" />
          <label htmlFor="availableTime" className="text-xl font-semibold">เวลาที่สามารถทำงานได้:</label>
        </div>
        <input
          type="text"
          id="availableTime"
          name="availableTime"
          value={formData.availableTime}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="กรอกเวลาที่สามารถทำงานได้ เช่น 10:00 - 18:00"
          required
        />

        {/* อีเมล */}
        <div className="flex items-center space-x-3">
          <FaRegEnvelope className="text-red-500" />
          <label htmlFor="email" className="text-xl font-semibold">อีเมลของคุณ:</label>
        </div>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="กรอกอีเมลของคุณ"
          required
        />

        {/* ปุ่มส่งข้อมูล */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            <FaRegCheckCircle className="inline-block mr-2" />
            ส่งข้อมูล
          </button>
        </div>
      </form>
    </div>
  );
};

export default Receive;
