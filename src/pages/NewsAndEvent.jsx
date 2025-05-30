import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaChevronDown, FaTimes, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import { supabase } from './supabaseClient'; // << ปรับ path ไปยัง supabaseClient ให้ถูกต้อง

// ลบการ import รูปภาพ Event ที่เป็น local ทั้งหมดออกไป
// เช่น:
// import image19 from "../assets/newsandevemts/May/birthdayidol.png";
// ... (ลบให้หมด) ...


// ALL_MONTHS_ORDER สามารถคงไว้ หรือจะสร้างแบบ dynamic จากข้อมูลที่ได้มาก็ได้
const ALL_MONTHS_ORDER = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

const EventCard = ({ event, onCardClick, opacity }) => (
  <div
    className="bg-white dark:bg-black rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] border border-gray-200 dark:border-gray-700 cursor-pointer group overflow-hidden"
    style={{ opacity: opacity, transitionProperty: 'opacity, transform, box-shadow' }}
    onClick={() => onCardClick(event)}
  >
    <div className="relative overflow-hidden">
      <img
        src={event.image} // จะเป็น image_url จาก Supabase
        alt={event.title}
        className="w-full h-64 object-cover object-center transition-transform duration-500 group-hover:scale-110"
      />
      <span className="absolute top-4 right-4 bg-black/80 text-white text-xs font-medium rounded-full px-3 py-1.5 backdrop-blur-sm shadow-md flex items-center gap-1.5">
        <FaCalendarAlt />
        {new Date(event.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
      </span>
    </div>
    <div className="p-5">
      <h3 className="text-lg font-semibold text-black dark:text-white line-clamp-2 mb-2 h-14">
        {event.title}
      </h3>
      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed mb-4 h-[4.5rem]">
        {event.shortDescription}
      </p>
      <button
        type="button" // เพิ่ม type="button"
        className="inline-flex items-center gap-2 text-sm font-medium text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 group/button"
      >
        อ่านเพิ่มเติม
        <FaArrowRight className="transform transition-transform duration-200 group-hover/button:translate-x-1" />
      </button>
    </div>
  </div>
);

const EventDetailPopup = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
      <div className="bg-white dark:bg-black rounded-xl shadow-2xl max-w-2xl w-full mx-auto my-8 relative max-h-[90vh] flex flex-col transform scale-95 animate-scale-in border border-gray-300 dark:border-gray-700">
        <div className="relative">
          <img
            src={event.image} // จะเป็น image_url จาก Supabase
            alt={event.title}
            className="w-full h-72 object-cover object-center rounded-t-xl"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-700 bg-white/70 hover:bg-white dark:text-gray-300 dark:bg-black/70 dark:hover:bg-black transition duration-200 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-black"
            aria-label="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-grow">
          <h3 className="text-2xl font-bold text-black dark:text-white mb-2">{event.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex items-center gap-2">
            <FaCalendarAlt />
            วันที่: {new Date(event.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200 dark:prose-invert leading-relaxed whitespace-pre-wrap">
            {event.fullDescription}
          </div>
        </div>
      </div>
    </div>
  );
};


const NewsAndEventNavBar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeMonth, setActiveMonth] = useState(""); // เริ่มต้นเป็นค่าว่าง หรือเดือนปัจจุบัน
  const [contentOpacity, setContentOpacity] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        // *** ตรวจสอบว่าชื่อตารางและคอลัมน์ตรงกับใน Supabase ของคุณ ***
        const { data, error: fetchError } = await supabase
          .from('events') // ชื่อตาราง events
          .select('id, title, description, short_description, image_url, event_date') // เพิ่ม short_description ถ้ามี
          .order('event_date', { ascending: false }); // เรียงจาก event ใหม่สุดไปเก่าสุด

        if (fetchError) {
          throw fetchError;
        }

        const processedEvents = data.map(event => {
          const dateObj = new Date(event.event_date);
          // สร้างชื่อเดือนภาษาไทย
          const month = dateObj.toLocaleDateString('th-TH', { month: 'long' }); 
          
          // จัดการ shortDescription
          // ถ้ามีคอลัมน์ short_description ใน database:
          const shortDesc = event.short_description || (event.description ? event.description.substring(0, 120) + (event.description.length > 120 ? '...' : '') : '');
          // หรือถ้าไม่มี ก็สร้างจาก description:
          // const shortDesc = event.description ? event.description.substring(0, 120) + (event.description.length > 120 ? '...' : '') : '';

          return {
            id: event.id,
            title: event.title,
            date: event.event_date, // เก็บวันที่ original ไว้ใช้ sort
            month: month,          // เดือนภาษาไทย
            image: event.image_url,  // URL รูปจาก Supabase Storage
            fullDescription: event.description,
            shortDescription: shortDesc,
          };
        });
        setEvents(processedEvents);
        if (processedEvents.length > 0 && !activeMonth) {
          setActiveMonth(processedEvents[0].month); // ตั้งเดือนแรกเป็นเดือนของ Event ล่าสุด
        } else if (processedEvents.length === 0 && !activeMonth) {
            // หากไม่มี events เลย อาจตั้งเป็นเดือนปัจจุบัน หรือเดือนแรกใน ALL_MONTHS_ORDER
            const currentMonthName = new Date().toLocaleDateString('th-TH', { month: 'long' });
            setActiveMonth(ALL_MONTHS_ORDER.includes(currentMonthName) ? currentMonthName : ALL_MONTHS_ORDER[0]);
        }

      } catch (err) {
        console.error("Error fetching events from Supabase:", err);
        setError(err.message || 'ไม่สามารถโหลดข้อมูล Event ได้');
      }
      setLoading(false);
    };

    fetchEvents();
  }, [activeMonth]); // เอา activeMonth ออกจาก dependency array ถ้าไม่ต้องการให้ fetch ใหม่ทุกครั้งที่ activeMonth เปลี่ยนจากค่าเริ่มต้น

  const groupedEvents = useMemo(() => {
    if (!events.length) return {};
    const eventsMap = events.reduce((acc, event) => {
      if (!acc[event.month]) acc[event.month] = [];
      acc[event.month].push(event);
      return acc;
    }, {});
    // การเรียงข้อมูลในแต่ละเดือนทำแล้วตอน query จาก Supabase (.order('event_date', ...))
    // แต่ถ้าต้องการเรียงอีกครั้งเพื่อให้แน่ใจ ก็ทำได้:
    // for (const month in eventsMap) {
    //   eventsMap[month].sort((a, b) => new Date(b.date) - new Date(a.date));
    // }
    return eventsMap;
  }, [events]);

  const eventsForActiveMonth = useMemo(() => {
    return groupedEvents[activeMonth] || [];
  }, [activeMonth, groupedEvents]);
  
  // สร้างรายการเดือนที่มี Events จริงๆ สำหรับ Dropdown (ทางเลือก)
  const availableMonths = useMemo(() => {
    const monthSet = new Set(events.map(e => e.month));
    return ALL_MONTHS_ORDER.filter(m => monthSet.has(m));
  }, [events]);


  const handleMonthChange = useCallback((month) => {
    setContentOpacity(0); 
    setTimeout(() => { 
      setActiveMonth(month);
    }, 150); 
    setIsDropdownOpen(false);
  }, []);

  const openEventPopup = useCallback((event) => {
    setSelectedEvent(event);
    setShowPopup(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeEventPopup = useCallback(() => {
    setShowPopup(false);
    setSelectedEvent(null);
    document.body.style.overflow = 'auto'; 
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setContentOpacity(1);
    }, 50); 
    return () => clearTimeout(timer);
  }, [activeMonth, eventsForActiveMonth]); 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.month-selector-wrapper')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);
  
  if (loading) {
    return (
      <div className="bg-white dark:bg-black min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-700 dark:text-gray-300">กำลังโหลดข้อมูลกิจกรรม...</p>
        {/* คุณสามารถเพิ่ม Spinner component ที่นี่ได้ */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-black min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-xl text-red-500 dark:text-red-400 mb-4">เกิดข้อผิดพลาด</p>
        <p className="text-md text-gray-700 dark:text-gray-300 text-center">{error}</p>
        <button 
          onClick={() => window.location.reload()} // ง่ายสุดคือ reload page
          className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          ลองใหม่
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black min-h-screen py-12 sm:py-20 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 sm:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black dark:text-white mb-6 sm:mb-0">
            Events & Updates
          </h2>
          <div className="relative month-selector-wrapper">
            <button
              type="button"
              className="inline-flex items-center gap-2.5 bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-black transition-all duration-200"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Month: <span className="font-semibold">{activeMonth || "เลือกเดือน"}</span>
              <FaChevronDown className={`text-xs ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-black rounded-lg shadow-xl z-20 border border-gray-200 dark:border-gray-700 max-h-72 overflow-y-auto custom-scrollbar animate-fade-in-short">
                {(availableMonths.length > 0 ? availableMonths : ALL_MONTHS_ORDER).map((month) => ( // ใช้ availableMonths ถ้ามีข้อมูล หรือ ALL_MONTHS_ORDER ถ้ายังไม่มี
                  <button
                    type="button"
                    key={month}
                    className={`block px-4 py-2.5 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm w-full text-left transition-colors duration-150 ${activeMonth === month ? 'bg-gray-200 dark:bg-gray-700 font-semibold text-black dark:text-white' : ''}`}
                    onClick={() => handleMonthChange(month)}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {eventsForActiveMonth.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {eventsForActiveMonth.map((item) => (
              <EventCard
                key={item.id} 
                event={item}
                onCardClick={openEventPopup}
                opacity={contentOpacity} 
              />
            ))}
          </div>
        ) : (
          <div
            className="col-span-full text-center py-20 text-gray-600 dark:text-gray-400 transition-opacity duration-500 ease-in-out"
            style={{ opacity: contentOpacity }} 
          >
            <FaCalendarAlt className="mx-auto text-5xl text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-xl font-medium mb-2">ไม่มีกิจกรรมสำหรับเดือน {activeMonth || "นี้"}</p>
            <p className="text-sm">กรุณาเลือกเดือนอื่น หรือกลับมาตรวจสอบใหม่ภายหลัง</p>
          </div>
        )}

        {showPopup && selectedEvent && ( 
            <EventDetailPopup
            event={selectedEvent}
            onClose={closeEventPopup}
            />
        )}
      </div>
    </div>
  );
};

export default NewsAndEventNavBar;

// --- ส่วน Animation Keyframes และ Plugins (เหมือนเดิม) ---
// อย่าลืมเพิ่ม keyframes และ plugins ในไฟล์ CSS หลัก หรือ tailwind.config.js ของคุณ
// ตัวอย่าง (ใน tailwind.config.js):
/*
theme: {
  extend: {
    keyframes: {
      fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      fadeInShort: { '0%': { opacity: '0', transform: 'translateY(-10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
    },
    animation: {
      'fade-in': 'fadeIn 0.3s ease-out forwards',
      'fade-in-short': 'fadeInShort 0.2s ease-out forwards',
      'scale-in': 'scaleIn 0.3s ease-out forwards',
    },
  },
},
plugins: [
  require('@tailwindcss/line-clamp'),
  require('@tailwindcss/typography'),
],
*/