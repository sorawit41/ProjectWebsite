import React, { useState, useEffect } from 'react';
import { FaCat, FaHeart, FaExclamationTriangle } from 'react-icons/fa';

const About = () => {
  const [title, setTitle] = useState('');
  const [description1, setDescription1] = useState('');
  const [braveCatsTitle, setBraveCatsTitle] = useState('');
  const [braveCatsDescription, setBraveCatsDescription] = useState('');
  const [curseTitle, setCurseTitle] = useState('');
  const [curseDescription, setCurseDescription] = useState('');
  const [finalMessage, setFinalMessage] = useState('');
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Simulate fetching data or any initial setup
    setTitle('ต้อนรับความสุขจาก Black Neko! ');
    setDescription1('ณ ดินแดนที่เต็มไปด้วยเสียง "เหมียว" และความอบอุ่น พระราชาแมวดำผู้ใจดีทรงปกครองอาณาจักรแห่งแมวด้วยความรักและเมตตา พระองค์ทรงปรารถนาให้เหล่ามนุษย์มีความสุข จึงมอบหมายภารกิจสุดพิเศษให้เหล่าแมวน้อยหลากหลายสายพันธุ์เดินทางสู่โลกมนุษย์ เพื่อมอบความสุขและเยียวยาจิตใจ');
    setBraveCatsTitle('เหล่าแมวน้อยผู้กล้าหาญ');
    setBraveCatsDescription('เหล่าแมวน้อยผู้กล้าหาญจึงออกเดินทาง และได้ร่วมกันสร้างสรรค์ "อาณาจักร Black Neko" สถานที่แห่งความสุขที่เต็มไปด้วยเสียงหัวเราะและการเล่นสนุก พวกเขาคอยเสกเรื่องทุกข์ใจให้หายไป มอบความสุขให้แก่เหล่ามนุษย์และทาสแมวทุกคน');
    setCurseTitle('คำสาปอันน่ากลัว ');
    setCurseDescription('แต่ภารกิจนี้ไม่ได้ง่ายดาย... แมวน้อยตัวใดที่ทำภารกิจไม่สำเร็จ จะต้องเผชิญกับคำสาปอันน่ากลัว กลายเป็นทรายแมวที่เหม็นฉึ่งไปตลอดกาล!');
    setFinalMessage('ดังนั้น... จงเตรียมตัวให้พร้อม เพื่อต้อนรับความน่ารักและความสุขจากเหล่าแมวน้อยแห่งอาณาจักร Black Neko! เมี้ยว! ');

    // Fade in effect on component mount
    setTimeout(() => {
      setOpacity(1);
    }, 100);
  }, []);

  return (
    <div className="bg-white py-16" style={{ opacity: opacity, transition: 'opacity 1s ease-in-out' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            {title} <FaCat className="inline-block ml-2 text-gray-600" />
          </h3>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
            ณ อาณาจักรแมวอันแสนสุขสันต์... <FaHeart className="inline-block ml-2 text-red-500" />
          </h2>
          <p className="mt-4 text-lg text-gray-700 leading-relaxed">
            {description1}
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-3xl font-semibold text-gray-800 mb-4">
              {braveCatsTitle}
            </h3>
            <p className="mt-3 text-gray-700 leading-relaxed">
              {braveCatsDescription}
            </p>
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-gray-800 mb-4">
              {curseTitle} <FaExclamationTriangle className="inline-block ml-2 text-yellow-500" />
            </h3>
            <p className="mt-3 text-gray-700 leading-relaxed">
              {curseDescription}
            </p>
          </div>
        </div>
        <div className="mt-16">
          <div className="text-center mt-8">
            <p className="text-2xl font-bold text-gray-900">
              {finalMessage} <FaCat className="inline-block ml-2 text-gray-600" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;