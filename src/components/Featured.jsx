import React, { useState } from 'react';
import { FiCalendar } from 'react-icons/fi';

const Events = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2));
  const [events] = useState({
    '2025-01': [
      { date: 15, title: 'New Year Party', location: 'MBK BlackNeko', color: 'bg-red-200' },
      { date: 20, title: 'Winter Market', location: 'MBK BlackNeko', color: 'bg-blue-200' },
    ],
    '2025-02': [{ date: 20, title: 'Valentine Concert', location: 'MBK BlackNeko', color: 'bg-pink-200' }],
    '2025-03': [
      { date: 29, title: 'KAWAIIKU GOMEN', location: 'MBK BlackNeko', color: 'bg-purple-200' },
      { date: 31, title: 'Mai ruu2', location: 'MBK BlackNeko', color: 'bg-indigo-200' },
    ],
    '2025-04': [{ date: 10, title: 'Songkran Festival', location: 'MBK BlackNeko', color: 'bg-blue-300' }],
    '2025-05': [{ date: 5, title: 'Labor Day Fair', location: 'MBK BlackNeko', color: 'bg-yellow-200' }],
    '2025-06': [{ date: 18, title: 'Summer Workshop', location: 'MBK BlackNeko', color: 'bg-green-200' }],
    '2025-07': [{ date: 22, title: 'Beach Party', location: 'MBK BlackNeko', color: 'bg-orange-200' }],
    '2025-08': [{ date: 8, title: 'Mountain Hike', location: 'MBK BlackNeko', color: 'bg-green-300' }],
    '2025-09': [{ date: 30, title: 'Autumn Festival', location: 'MBK BlackNeko', color: 'bg-red-300' }],
    '2025-10': [{ date: 25, title: 'Halloween Night', location: 'MBK BlackNeko', color: 'bg-purple-300' }],
    '2025-11': [{ date: 12, title: 'Thanksgiving Dinner', location: 'MBK BlackNeko', color: 'bg-yellow-300' }],
    '2025-12': [{ date: 25, title: 'Christmas Celebration', location: 'MBK BlackNeko', color: 'bg-pink-300' }],
  });

  const monthNames = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
  ];

  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + 1);
      return newDate;
    });
  };

  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  const monthKey = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const monthEvents = events[monthKey] || [];

  const [selectedEvent, setSelectedEvent] = useState(null);

  const toggleDropdown = (event) => {
    setSelectedEvent(selectedEvent === event ? null : event);
  };

  return (
    <section id="events" className="py-16">
      <div className="container mx-auto px-4 mt-16 text-center">
        <h2 className="text-3xl font-bold text-center mb-8">Information</h2>
        <p className="text-gray-700">
          Here you can add any new information or announcements related to the events.
          For example, you can add details about schedule changes, venue updates, or
          any other relevant information.
        </p>
      </div>

      <div className="container mx-auto px-4 mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">Events</h2>

        <div className="flex justify-center items-center mb-6">
          <span className="text-lg font-semibold mr-2">{month}, {year}</span>
          <button className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mx-1" onClick={handlePrevMonth}>
            &#8592;
          </button>
          <button className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mx-1" onClick={handleNextMonth}>
            &#8594;
          </button>
        </div>

        {monthEvents.map((event, index) => (
          <div key={index} className={`${event.color} p-6 rounded-md mb-4 cursor-pointer`} onClick={() => toggleDropdown(event)}>
            <div className="flex items-center">
              <FiCalendar className="text-4xl mr-4" />
              <div>
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="text-gray-600">{event.location}</p>
              </div>
            </div>
            {selectedEvent === event && (
              <div className="mt-4 p-4 bg-white rounded-md shadow-md">
                <p>Date: {event.date}</p>
                <p>Title: {event.title}</p>
                <p>Location: {event.location}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Events;
