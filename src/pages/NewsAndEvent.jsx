import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa'; // Import the down arrow icon

const newsAndEvents = [
  {
    id: 1,
    month: "March",
    title: "มาแจ้งโปรผลไม้แล้วจ้า~! 🍎🍇🍒🥝🍑🍅🍉🍊",
    shortDescription: "มาแจ้งโปรผลไม้แล้วจ้า~! ",
    fullDescription: "✨มาหาน้องแมวของเราได้ที่ร้าน Black Neko มีกิจกรรมพิเศษและโปรโมชั่นมากมายรอคุณอยู่ !📆 วันที่ 21-23 มีนาคมนี้ มาเจอกันนะคะ",
    date: "2025-03-21",
    imageUrl: "https://scontent.fbkk2-8.fna.fbcdn.net/v/t39.30808-6/485060479_122217296930082876_413256103615770232_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_ohc=jRXJOPYMWcUQ7kNvgHytwjU&_nc_oc=AdlfQ2iv0E4ICQctYQr9n72K66CFO4fqjizbCGK4DgP4kUfWmnqOVWa9nA67GMU9yq3GKxKPXAOcTpdWfZNuPpWg&_nc_zt=23&_nc_ht=scontent.fbkk2-8.fna&_nc_gid=CDncAKpgEryNd_1j079I0w&oh=00_AYFKP9OneyDsBwj-lmc_A1hCW5PsLozla399lF1H6iUk2Q&oe=67EB2B0B",
  },
  {
    id: 2,
    month: "March",
    title: "อีเวนท์ฉลองวันเกิดของน้องแมว Risa & Kokoa 🎂🎉",
    shortDescription: "อีเวนท์ฉลองวันเกิดของน้องแมว Risa & Kokoa 🎂🎉",
    fullDescription: "ปีนี้น้องทั้งสองจะเตรียมของขวัญพิเศษอะไรมาให้กันนะ✨มาหาน้องแมวของเราได้ที่ร้าน Black Neko มีกิจกรรมพิเศษและโปรโมชั่นมากมายรอคุณอยู่ !📆 วันที่ 29 มีนาคมนี้ มาเจอกันนะคะ😉📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈",
    date: "2025-03-29",
    imageUrl: "https://scontent.fbkk2-8.fna.fbcdn.net/v/t39.30808-6/486850058_122218924106082876_1009733351090968552_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_ohc=hYIG_yFVsMIQ7kNvgGgWEZd&_nc_oc=Adn7g-fVXsbnkeUqsyag9sHSS2oxNv1_5GI9eu2Ta4ovn9YzSB30T3MAJf3N73jsogQyqFPevKiuvmsj92VJ2-Uu&_nc_zt=23&_nc_ht=scontent.fbkk2-8.fna&_nc_gid=cX9tLt4oXYH8D1hdui2IiA&oh=00_AYHNBRfT0RowEqL9CJj1n6G4aca0FQGOlEgge7JamjpHeg&oe=67EB46EC",
  },
];

const NewsAndEventNavBar = () => {
  const [activeMonth, setActiveMonth] = useState("March");
  const [opacity, setOpacity] = useState(0);
  const [expandedEvents, setExpandedEvents] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const groupEventsByMonth = (events) => {
    const grouped = events.reduce((acc, event) => {
      if (!acc[event.month]) acc[event.month] = [];
      acc[event.month].push(event);
      return acc;
    }, {});
    return grouped;
  };

  const groupedEvents = groupEventsByMonth(newsAndEvents);
  const allMonths = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];
  const eventsForMonth = groupedEvents[activeMonth] || [];

  const handleMonthChange = (month) => {
    setActiveMonth(month);
    setIsDropdownOpen(false); // Close dropdown after selecting a month
  };

  const toggleExpand = (eventId) => {
    setExpandedEvents(prevState => ({
      ...prevState,
      [eventId]: !prevState[eventId]
    }));
  };

  useEffect(() => {
    setOpacity(0);
    setTimeout(() => {
      setOpacity(1);
    }, 100);
  }, [activeMonth]);

  return (
    <div className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-xl font-semibold">News & Events</div>
          <div className="relative">
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Month: <span className="font-bold">{activeMonth}</span> <FaChevronDown />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-md shadow-md z-10">
                {allMonths.map((month) => (
                  <button
                    key={month}
                    className={`block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left ${activeMonth === month ? 'bg-gray-100' : ''}`}
                    onClick={() => handleMonthChange(month)}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Events Container */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {eventsForMonth.length > 0 ? (
            eventsForMonth.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6"
                style={{ opacity: opacity, transition: 'opacity 1s ease-in-out' }}
              >
                <div className="md:w-1/3">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-auto object-cover rounded-lg mb-4 md:mb-0"
                  />
                </div>
                <div className="md:w-2/3">
                  <h2 className="text-2xl font-bold text-gray-800">{item.title}</h2>
                  <p className="text-sm text-gray-500 mb-4">{new Date(item.date).toLocaleDateString()}</p>
                  <p className="text-gray-700 mb-4">{item.shortDescription}</p>
                  {expandedEvents[item.id] ? (
                    <p className="text-gray-700">{item.fullDescription}</p>
                  ) : (
                    <p className="text-gray-700">{item.fullDescription.substring(0, 100)}... </p>
                  )}
                  {item.fullDescription.length > 100 && (
                    <button
                      className="text-blue-500 hover:underline focus:outline-none"
                      onClick={() => toggleExpand(item.id)}
                    >
                      {expandedEvents[item.id] ? "Read Less" : "Read More"}
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No events for this month.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsAndEventNavBar;