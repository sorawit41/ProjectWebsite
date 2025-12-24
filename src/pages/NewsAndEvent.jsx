import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { FaCalendarAlt, FaArrowRight, FaTimes } from 'react-icons/fa';
import { supabase } from './supabaseClient'; 

const ALL_MONTHS_ORDER = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

// --- 1. MODERN CARD COMPONENT (แนวยาว / Horizontal) ---
const ModernEventCard = ({ event, onCardClick, index }) => (
  <div
    className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col md:flex-row border border-gray-100 dark:border-zinc-800"
    onClick={() => onCardClick(event)}
    style={{ animationDelay: `${index * 50}ms` }} 
  >
    {/* Image Section - ปรับเป็นด้านซ้าย Fix ความกว้าง */}
    <div className="relative w-full md:w-72 lg:w-96 h-60 md:h-auto flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-zinc-800">
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Date Badge */}
      <div className="absolute top-4 left-4 bg-white/95 dark:bg-black/80 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg flex flex-col items-center min-w-[60px] border border-gray-100 dark:border-gray-700">
        <span className="text-xs font-bold text-red-500 uppercase">
            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="text-xl font-bold text-gray-900 dark:text-white leading-none mt-1">
            {new Date(event.date).getDate()}
        </span>
      </div>
    </div>

    {/* Content Section - ปรับให้อยู่ด้านขวาและยืดเต็มพื้นที่ */}
    <div className="p-6 md:p-8 flex flex-col flex-grow relative justify-between">
        {/* Decorative Line */}
        <div className="absolute top-0 left-0 w-full h-1 md:w-1 md:h-full bg-gradient-to-r md:bg-gradient-to-b from-red-500 via-orange-400 to-yellow-500 transform scale-x-0 md:scale-x-100 md:scale-y-0 group-hover:scale-x-100 md:group-hover:scale-y-100 transition-transform duration-500 origin-left md:origin-top" />

      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
            {event.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base line-clamp-3 mb-4 leading-relaxed">
            {event.shortDescription}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 md:pt-0 mt-4 border-t border-gray-100 dark:border-zinc-800 md:border-0">
        <span className="text-xs text-gray-500 font-medium bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
             Event Update
        </span>
        <button className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white group-hover:translate-x-1 transition-transform duration-300">
          อ่านรายละเอียด <FaArrowRight className="text-xs" />
        </button>
      </div>
    </div>
  </div>
);

// --- 2. MODERN POPUP (คงเดิม) ---
const ModernDetailPopup = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] animate-scale-in">
        
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 md:hidden bg-black/50 text-white p-2 rounded-full backdrop-blur-md"
        >
            <FaTimes />
        </button>

        <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-gray-100">
            <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover"
            />
        </div>

        <div className="w-full md:w-3/5 p-8 overflow-y-auto custom-scrollbar bg-white dark:bg-zinc-900">
            <div className="flex justify-between items-start mb-6">
                 <div>
                    <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-full mb-3">
                        UPCOMING EVENT
                    </span>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                        {event.title}
                    </h2>
                 </div>
                 <button 
                    onClick={onClose}
                    className="hidden md:block text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2"
                >
                    <FaTimes size={24} />
                </button>
            </div>

            <div className="flex items-center gap-4 mb-8 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-800 pb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-lg">
                        <FaCalendarAlt className="text-red-500" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-200">วันที่</p>
                        <p>{new Date(event.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                <p className="whitespace-pre-wrap leading-relaxed">{event.fullDescription}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- 3. MAIN COMPONENT ---
const NewsAndEventNavBar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMonth, setActiveMonth] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const tabsContainerRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('events')
          .select('id, title, description, short_description, image_url, event_date')
          .order('event_date', { ascending: false });

        if (fetchError) throw fetchError;

        const processedEvents = data.map(event => {
          const dateObj = new Date(event.event_date);
          const month = dateObj.toLocaleDateString('th-TH', { month: 'long' }); 
          const shortDesc = event.short_description || (event.description ? event.description.substring(0, 120) + (event.description.length > 120 ? '...' : '') : '');

          return {
            id: event.id,
            title: event.title,
            date: event.event_date,
            month: month,
            image: event.image_url,
            fullDescription: event.description,
            shortDescription: shortDesc,
          };
        });
        setEvents(processedEvents);

        if (processedEvents.length > 0 && !activeMonth) {
            setActiveMonth(processedEvents[0].month); 
        } else if (processedEvents.length === 0 && !activeMonth) {
            const currentMonthName = new Date().toLocaleDateString('th-TH', { month: 'long' });
            setActiveMonth(ALL_MONTHS_ORDER.includes(currentMonthName) ? currentMonthName : ALL_MONTHS_ORDER[0]);
        }
      } catch (err) {
        console.error("Error:", err);
        setError(err.message || 'ไม่สามารถโหลดข้อมูล Event ได้');
      }
      setLoading(false);
    };

    fetchEvents();
  }, [activeMonth]);

  const groupedEvents = useMemo(() => {
    if (!events.length) return {};
    return events.reduce((acc, event) => {
      if (!acc[event.month]) acc[event.month] = [];
      acc[event.month].push(event);
      return acc;
    }, {});
  }, [events]);

  const eventsForActiveMonth = useMemo(() => groupedEvents[activeMonth] || [], [activeMonth, groupedEvents]);
  
  const availableMonths = useMemo(() => {
    const monthSet = new Set(events.map(e => e.month));
    return ALL_MONTHS_ORDER.filter(m => monthSet.has(m));
  }, [events]);

  const handleMonthChange = (month) => setActiveMonth(month);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div></div>;

  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white py-24 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-5xl"> {/* เปลี่ยน max-w-7xl เป็น 5xl เพื่อไม่ให้ยาวเกินไป */}
        
        {/* HEADER */}
        <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                News & Events
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                อัปเดตข่าวสารและกิจกรรมล่าสุด อย่าพลาดทุกความเคลื่อนไหวสำคัญ
            </p>
        </div>

        {/* MONTH TABS */}
        <div className="mb-12">
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg rounded-full shadow-lg p-2 max-w-4xl mx-auto border border-gray-200 dark:border-zinc-800">
                <div 
                    ref={tabsContainerRef}
                    className="flex overflow-x-auto custom-scrollbar-hide gap-2 px-2 snap-x"
                >
                    {(availableMonths.length > 0 ? availableMonths : ALL_MONTHS_ORDER).map((month) => {
                        const isActive = activeMonth === month;
                        return (
                            <button
                                key={month}
                                onClick={() => handleMonthChange(month)}
                                className={`
                                    whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 snap-center
                                    ${isActive 
                                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-md transform scale-105' 
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                                    }
                                `}
                            >
                                {month}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* CONTENT LIST (เปลี่ยนจาก Grid เป็น Stack) */}
        <div className="min-h-[400px]">
             {eventsForActiveMonth.length > 0 ? (
                // เปลี่ยน layout ตรงนี้จาก grid เป็น flex-col
                <div className="flex flex-col gap-6">
                    {eventsForActiveMonth.map((event, idx) => (
                        <ModernEventCard 
                            key={event.id} 
                            event={event} 
                            onCardClick={setSelectedEvent}
                            index={idx}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-in">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                        <FaCalendarAlt className="text-2xl text-gray-400" />
                    </div>
                    <p className="text-xl font-medium text-gray-500 dark:text-gray-400">ไม่มีกิจกรรมในเดือน{activeMonth}</p>
                </div>
            )}
        </div>

        {/* POPUP MODAL */}
        {selectedEvent && (
            <ModernDetailPopup 
                event={selectedEvent} 
                onClose={() => setSelectedEvent(null)} 
            />
        )}

      </div>
      <style>{`
        .custom-scrollbar-hide::-webkit-scrollbar { display: none; }
        .custom-scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in { animation: scaleIn 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default NewsAndEventNavBar;