import React, { useState } from 'react';

// Sample news and events data with image URLs and dates
const newsAndEvents = [
  {
    id: 1,
    title: "Exciting New Product Launch",
    shortDescription: "We're launching an amazing new product this week. Stay tuned for more details.",
    fullDescription: "We are very excited to introduce our latest product launch. It’s a game-changing product that promises to revolutionize the way you experience technology. Our team has worked tirelessly to bring this to you, and we can’t wait for you to get your hands on it!",
    date: "2025-03-25",
    imageUrl: "https://via.placeholder.com/600x400?text=Product+Launch", // Replace with actual image URL
  },
  {
    id: 2,
    title: "Annual Charity Event",
    shortDescription: "Join us for our annual charity event to raise funds for local causes.",
    fullDescription: "Our charity event this year is focused on helping those who are less fortunate in our community. We are partnering with local organizations to provide food, clothing, and resources to people in need. Every contribution helps, and we’re excited to bring people together for a good cause.",
    date: "2025-04-01",
    imageUrl: "https://via.placeholder.com/600x400?text=Charity+Event", // Replace with actual image URL
  },
  {
    id: 3,
    title: "Summer Sale Starts Soon",
    shortDescription: "Get ready for our biggest summer sale with up to 50% off on selected items.",
    fullDescription: "It’s that time of the year again! Our Summer Sale is around the corner, and it’s bigger than ever. We’ll have great discounts on a variety of products, from clothing to home decor, electronics, and more. Be sure to mark your calendars, as the sale will only last for a limited time.",
    date: "2025-04-10",
    imageUrl: "https://via.placeholder.com/600x400?text=Summer+Sale", // Replace with actual image URL
  },
  {
    id: 4,
    title: "New Website Launch",
    shortDescription: "Our new website is live! Check out the improved design and features.",
    fullDescription: "We’re proud to announce the launch of our new website. It’s been redesigned from the ground up, offering a more modern, clean, and user-friendly experience. We’ve added new features such as a live chat function, more detailed product pages, and an enhanced mobile interface.",
    date: "2025-03-15",
    imageUrl: "https://via.placeholder.com/600x400?text=Website+Launch", // Replace with actual image URL
  },
  {
    id: 5,
    title: "December Gathering",
    shortDescription: "Join us for our end-of-year gathering in December.",
    fullDescription: "Let's celebrate the end of the year together! Join us for a special gathering with food, drinks, and good company. It's a great opportunity to network and reflect on the past year's achievements.",
    date: "2025-12-20",
    imageUrl: "https://via.placeholder.com/600x400?text=December+Gathering", // Replace with actual image URL
  },
  {
    id: 6,
    title: "January Workshop",
    shortDescription: "Kick off the new year with our insightful workshop.",
    fullDescription: "Start the year strong by joining our workshop focused on personal and professional development. Learn new skills and strategies to achieve your goals in the coming year.",
    date: "2026-01-15",
    imageUrl: "https://via.placeholder.com/600x400?text=January+Workshop", // Replace with actual image URL
  },
];

const NewsAndEvent = () => {
  const [expanded, setExpanded] = useState(null); // Track expanded news

  // Function to toggle description
  const toggleDescription = (id) => {
    if (expanded === id) {
      setExpanded(null);
    } else {
      setExpanded(id);
    }
  };

  // Group events by month
  const groupEventsByMonth = (events) => {
    const grouped = events.reduce((acc, event) => {
      const month = new Date(event.date).toLocaleString("default", { month: "long" });
      if (!acc[month]) acc[month] = [];
      acc[month].push(event);
      return acc;
    }, {});
    return grouped;
  };

  // Grouped events
  const groupedEvents = groupEventsByMonth(newsAndEvents);

  // All 12 months for display
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-6">News and Events</h1>

      {/* Scrollable Events Container for All Months */}
      <div className="space-y-8">
        {months.map((month) => {
          const eventsForMonth = groupedEvents[month] || [];

          return (
            <div key={month}>
              {/* Month Title */}
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{month}</h2>

              {/* Display Events for Each Month */}
              {eventsForMonth.length > 0 ? (
                eventsForMonth.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image Section */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-60 object-cover rounded-lg mb-4"
                    />

                    {/* Title and Date */}
                    <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{new Date(item.date).toLocaleDateString()}</p>

                    {/* Short Description */}
                    <p className="text-gray-700 mb-4">{item.shortDescription}</p>

                    {/* Full Description (Toggle on click) */}
                    {expanded === item.id && (
                      <p className="text-gray-700 mb-4">{item.fullDescription}</p>
                    )}

                    {/* Toggle Button */}
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => toggleDescription(item.id)}
                    >
                      {expanded === item.id ? 'Show Less' : 'Read More'}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No events for this month.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsAndEvent;