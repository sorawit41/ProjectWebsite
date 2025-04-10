import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { FaYoutube, FaFacebookSquare } from 'react-icons/fa'; // Import icons

const youtubeVideos = [
  {
    id: 1,
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Replace with a valid YouTube URL
  },
  {
    id: 2,
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Replace with a valid YouTube URL
  },
  {
    id: 3,
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Replace with a valid YouTube URL
  },
  {
    id: 4,
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Replace with a valid YouTube URL
  },
];

const facebookVideos = [
  {
    id: 4,
    url: 'https://www.facebook.com/watch/?v=23886538187602003&rdid=zZuZDA39kgR3Yokv', // Replace with a valid Facebook Watch URL
  },
  {
    id: 5,
    url: 'https://www.facebook.com/BLACKNEKOMBK/videos/1169781778090651', // Replace with a valid Facebook Watch URL
  },
  {
    id: 6,
    url: 'https://www.facebook.com/BLACKNEKOMBK/videos/1670989730505499', // Replace with a valid Facebook Watch URL
  },
  
  {
    id: 7,
    url: 'https://www.facebook.com/BLACKNEKOMBK/videos/2317442688620858', // Replace with a valid Facebook Watch URL
  },
];

const VideoGrid = ({ videos, title, facebook = false }) => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!videos || videos.length === 0) {
    return null; // Or display a message like "No videos available"
  }

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-semibold mb-4 flex items-center">
        {title === "วิดีโอ YouTube" && <FaYoutube className="mr-2 text-red-500" />}
        {title === "วิดีโอ Facebook" && <FaFacebookSquare className="mr-2 text-blue-600" />}
        {title}
      </h3>
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${
          fadeIn ? 'opacity-100 transition-opacity duration-1000' : 'opacity-0'
        }`}
      >
        {videos.map((video) => (
          <div
            key={video.id}
            className="rounded-lg shadow-md overflow-hidden transition-transform duration-500 ease-in-out"
            style={{
              opacity: fadeIn ? 1 : 0,
              transform: fadeIn ? 'translateY(0)' : 'translateY(30px)',
            }}
          >
            <div className="w-full aspect-video">
              <ReactPlayer
                controls={true}
                url={video.url}
                width="100%"
                height={facebook ? '56.25vw' : '100%'} // Adjust height for Facebook
                style={{ aspectRatio: facebook ? '9 / 16' : 'auto' }} // Set aspect ratio for Facebook videos
                onError={() => (
                  <div className="flex items-center justify-center bg-gray-100 h-full">
                    <p className="text-red-500">Video not available.</p>
                  </div>
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Media = () => {
  return (
    <div className="container mx-auto py-8 pt-40">
      <h2 className="text-3xl font-semibold text-center mb-8">วิดีโอเกี่ยวกับร้าน</h2>

      <VideoGrid videos={youtubeVideos} title="วิดีโอ YouTube" />
      <VideoGrid videos={facebookVideos} title="วิดีโอ Facebook" facebook /> {/* Pass the facebook prop */}
    </div>
  );
};

export default Media;