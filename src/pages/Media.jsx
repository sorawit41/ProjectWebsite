import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { FaYoutube, FaFacebookSquare } from 'react-icons/fa';

const youtubeVideos = [
  { id: 1, url: 'https://www.youtube.com/watch?v=F3k_vHi9KL0' },
  { id: 2, url: 'https://www.youtube.com/watch?v=IQzn9L_71Ng' },
  { id: 3, url: 'https://www.youtube.com/watch?v=qMCZWHZrZBo' },
  { id: 4, url: 'https://www.youtube.com/watch?v=9f1TJG4cRTI' },
];

const facebookVideos = [
  { id: 4, url: 'https://www.facebook.com/watch/?v=23886538187602003' },
  { id: 5, url: 'https://www.facebook.com/BLACKNEKOMBK/videos/1169781778090651' },
  { id: 6, url: 'https://www.facebook.com/BLACKNEKOMBK/videos/1670989730505499' },
  { id: 7, url: 'https://www.facebook.com/BLACKNEKOMBK/videos/2317442688620858' },
];

const VideoGrid = ({ videos, title, facebook = false }) => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!videos || videos.length === 0) return null;

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
        {title === "วิดีโอ YouTube" && <FaYoutube className="mr-2 text-red-500" />}
        {title === "วิดีโอ Facebook" && <FaFacebookSquare className="mr-2 text-blue-600" />}
        {title}
      </h3>

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        {videos.map(video => (
          <div
            key={video.id}
            className="rounded-lg shadow-md overflow-hidden transform transition-all duration-500"
            style={{
              opacity: fadeIn ? 1 : 0,
              transform: fadeIn ? 'translateY(0)' : 'translateY(30px)',
            }}
          >
            <div className="w-full aspect-video">
              <ReactPlayer
                controls
                url={video.url}
                width="100%"
                height={facebook ? '56.25vw' : '100%'}
                style={{ aspectRatio: facebook ? '9 / 16' : 'auto' }}
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
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-800 dark:text-white py-8 pt-40 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-10">วิดีโอเกี่ยวกับร้าน</h2>
      <VideoGrid videos={youtubeVideos} title="วิดีโอ YouTube" />
      <VideoGrid videos={facebookVideos} title="วิดีโอ Facebook" facebook />
    </div>
  );
};

export default Media;
