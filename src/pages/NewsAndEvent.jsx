import React, { useState, useEffect } from 'react';

const newsAndEvents = [
  {
    id: 1,
    month: "March",
    title: "Exciting New Product Launch",
    shortDescription: "We're launching an amazing new product this week. Stay tuned for more details.",
    fullDescription: "We are very excited to introduce our latest product launch. It’s a game-changing product that promises to revolutionize the way you experience technology. Our team has worked tirelessly to bring this to you, and we can’t wait for you to get your hands on it!",
    date: "2025-03-25",
    imageUrl: "src/assets/imgs/image2.png",
  },
  {
    id: 2,
    month: "May",
    title: "Annual Charity Event",
    shortDescription: "Join us for our annual charity event to raise funds for local causes.",
    fullDescription: "Our charity event this year is focused on helping those who are less fortunate in our community. We are partnering with local organizations to provide food, clothing, and resources to people in need. Every contribution helps, and we’re excited to bring people together for a good cause.",
    date: "2025-04-01",
    imageUrl: "src/assets/imgs/image2.png",
  },
  {
    id: 3,
    month: "April",
    title: "Summer Sale Starts Soon",
    shortDescription: "Get ready for our biggest summer sale with up to 50% off on selected items.",
    fullDescription: "It’s that time of the year again! Our Summer Sale is around the corner, and it’s bigger than ever. We’ll have great discounts on a variety of products, from clothing to home decor, electronics, and more. Be sure to mark your calendars, as the sale will only last for a limited time.",
    date: "2025-04-10",
    imageUrl: "src/assets/imgs/image2.png",
  },
  {
    id: 4,
    month: "March",
    title: "New Website Launch",
    shortDescription: "Our new website is live! Check out the improved design and features.",
    fullDescription: "We’re proud to announce the launch of our new website. It’s been redesigned from the ground up, offering a more modern, clean, and user-friendly experience. We’ve added new features such as a live chat function, more detailed product pages, and an enhanced mobile interface.",
    date: "2025-03-15",
    imageUrl: "src/assets/imgs/image2.png",
  },
];

const NewsAndEvent = () => {
  const [activeMonth, setActiveMonth] = useState("March"); // Active month
  const [opacity, setOpacity] = useState(0); // For animation
  const [expandedEvents, setExpandedEvents] = useState({}); // To track which events are expanded

  // Group events by month
  const groupEventsByMonth = (events) => {
    const grouped = events.reduce((acc, event) => {
      if (!acc[event.month]) acc[event.month] = [];
      acc[event.month].push(event);
      return acc;
    }, {});
    return grouped;
  };

  // Grouped events
  const groupedEvents = groupEventsByMonth(newsAndEvents);

  // List of all months in a year
  const allMonths = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];

  // Get the events for the active month
  const eventsForMonth = groupedEvents[activeMonth] || [];

  // Scroll to the top when the month changes (removed scroll position tracking)
  const handleMonthChange = (month) => {
    setActiveMonth(month);
    // Removed setScrollPosition(0);
  };

  // Toggle the expanded state of an event
  const toggleExpand = (eventId) => {
    setExpandedEvents(prevState => ({
      ...prevState,
      [eventId]: !prevState[eventId]
    }));
  };

  // UseEffect to trigger opacity change when the component mounts or the activeMonth changes
  useEffect(() => {
    setOpacity(0); // Reset opacity to 0 first
    setTimeout(() => {
      setOpacity(1); // Fade in the content after a short delay
    }, 100); // Delay of 100ms
  }, [activeMonth]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-6">News and Events</h1>

      {/* Month Navigation */}
      <div className="flex justify-center gap-4 mb-6">
        {allMonths.map((month) => (
          <button
            key={month}
            className={`text-lg font-medium ${activeMonth === month ? 'text-blue-500' : 'text-gray-600'} hover:text-blue-500`}
            onClick={() => handleMonthChange(month)}
          >
            {month}
          </button>
        ))}
      </div>

      {/* Events Container for Active Month (removed scrollable container) */}
      <div className="space-y-8">
        {eventsForMonth.length > 0 ? (
          eventsForMonth.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-all duration-300"
              style={{ opacity: opacity, transition: 'opacity 1s ease-in-out' }} // Adding opacity transition
            >
              {/* Image Section */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-auto object-cover rounded-lg mb-4" // Modified className
              />

              {/* Title and Date */}
              <h2 className="text-2xl font-bold text-gray-800">{item.title}</h2>
              <p className="text-sm text-gray-500 mb-4">{new Date(item.date).toLocaleDateString()}</p>

              {/* Short Description */}
              <p className="text-gray-700 mb-4">{item.shortDescription}</p>

              {/* Full Description with Read More */}
              {expandedEvents[item.id] ? (
                <p className="text-gray-700">{item.fullDescription}</p>
              ) : (
                <p className="text-gray-700">{item.fullDescription.substring(0, 100)}... </p> // Show first 100 chars
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
          ))
        ) : (
          <p className="text-gray-500">No events for this month.</p>
        )}
      </div>
    </div>
  );
};

export default NewsAndEvent;