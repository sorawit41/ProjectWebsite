import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { FaYoutube, FaFacebookSquare, FaTiktok, FaPlayCircle } from 'react-icons/fa';

const youtubeVideos = [
    { id: 1, url: 'https://www.youtube.com/watch?v=F3k_vHi9KL0' },
    { id: 2, url: 'https://www.youtube.com/watch?v=IQzn9L_71Ng' },
    { id: 3, url: 'https://www.youtube.com/watch?v=qMCZWHZrZBo' },
    { id: 4, url: 'https://www.youtube.com/watch?v=9f1TJG4cRTI' },
];

const facebookVideos = [
    { id: 1, url: 'https://www.facebook.com/BLACKNEKOMBK/videos/23886538187602003' },
    { id: 2, url: 'https://www.facebook.com/BLACKNEKOMBK/videos/1169781778090651' },
    { id: 3, url: 'https://www.facebook.com/BLACKNEKOMBK/videos/1182475980166817' },
    { id: 4, url: 'https://www.facebook.com/BLACKNEKOMBK/videos/2317442688620858' },
];

const tiktokVideos = [
    { id: 1, url: 'https://www.tiktok.com/embed/v2/7473432173857623304' },
    { id: 2, url: 'https://www.tiktok.com/embed/v2/7468997294587710738' },
    { id: 3, url: 'https://www.tiktok.com/embed/v2/7463498001739156744' },

];

const VideoGrid = ({ videos, title, facebook = false, tiktok = false }) => {
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setFadeIn(true), 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6 flex items-center text-gray-800 dark:text-white">
                {facebook ? <FaFacebookSquare className="mr-2 text-blue-600" /> :
                    tiktok ? <FaTiktok className="mr-2 text-black dark:text-white" /> :
                        <FaYoutube className="mr-2 text-red-500" />}
                {title}
            </h3>

            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8`}>
                {videos.map((video, index) => (
                    <div
                        key={video.id}
                        className={`transform transition-all duration-700 ease-out  
                        ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} 
                        hover:scale-[1.03]`}
                        style={{ transitionDelay: `${index * 150}ms` }}
                    >
                        <div className={`relative overflow-hidden bg-white dark:bg-black rounded-md shadow-md 
    ${facebook || tiktok ? 'aspect-[9/16]' : 'aspect-video'}`}>

                            {facebook ? (
                                <div className="w-full aspect-[9/16] relative">
                                    <iframe
                                        src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(video.url)}&show_text=0&width=360`}
                                        className="absolute top-0 left-0 w-full h-full rounded-md"
                                        style={{ border: 'none', overflow: 'hidden', objectFit: 'cover' }}
                                        scrolling="no"
                                        frameBorder="0"
                                        allowFullScreen
                                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                    ></iframe>
                                </div>
                            ) : tiktok ? (
                                <iframe
                                    src={video.url}
                                    className="absolute top-0 left-0 w-full h-full"
                                    style={{ objectFit: 'cover' }}
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                    title={`TikTok Video ${video.id}`}
                                />
                            ) : (
                                <ReactPlayer
                                    controls
                                    url={video.url}
                                    width="100%"
                                    height="100%"
                                    style={{ objectFit: 'cover' }}
                                    className="rounded-md"
                                />
                            )}
                            {!facebook && !tiktok && <FaPlayCircle className="absolute top-2 right-2 text-white text-xl drop-shadow" />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Media = () => {
    const [source, setSource] = useState('youtube'); // youtube, facebook, tiktok

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-800 dark:text-white py-8 pt-40 px-4 sm:px-6 lg:px-16 transition-colors duration-300">
            <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-900 dark:text-white">วิดีโอเกี่ยวกับร้าน</h2>

            <div className="flex justify-center mb-10 gap-1">
                <button
                    className={`px-6 py-2 text-lg font-semibold rounded-l-full border-r border-gray-300 dark:border-gray-700 ${
                        source === 'youtube' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white'
                    }`}
                    onClick={() => setSource('youtube')}
                >
                    <FaYoutube className="inline mr-2" />
                    YouTube
                </button>
                <button
                    className={`px-6 py-2 text-lg font-semibold border-x border-gray-300 dark:border-gray-700 ${
                        source === 'facebook' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white'
                    }`}
                    onClick={() => setSource('facebook')}
                >
                    <FaFacebookSquare className="inline mr-2" />
                    Facebook
                </button>
                <button
                    className={`px-6 py-2 text-lg font-semibold rounded-r-full border-l border-gray-300 dark:border-gray-700 ${
                        source === 'tiktok' ? 'bg-black text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white'
                    }`}
                    onClick={() => setSource('tiktok')}
                >
                    <FaTiktok className="inline mr-2" />
                    TikTok
                </button>
            </div>
            {source === 'youtube' && <VideoGrid videos={youtubeVideos} title="วิดีโอ YouTube" />}
            {source === 'facebook' && <VideoGrid videos={facebookVideos} title="วิดีโอ Facebook" facebook />}
            {source === 'tiktok' && (
                <div className="mb-16">
                    <h3 className="text-2xl font-bold mb-6 flex items-center text-black dark:text-white">
                        <FaTiktok className="mr-2" />
                        วิดีโอ TikTok
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tiktokVideos.map((video, index) => (
                            <div
                                key={video.id}
                                className={`transform transition-all duration-700 ease-out  
                                hover:scale-[1.03]`}

                            >
                                <div className="relative aspect-[9/16] overflow-hidden bg-white dark:bg-black rounded-md shadow-md">
                                    <iframe
                                        src={video.url}
                                        className="absolute top-0 left-0 w-full h-full"
                                        style={{ objectFit: 'cover' }}
                                        frameBorder="0"
                                        allow="autoplay; encrypted-media"
                                        allowFullScreen
                                        title={`TikTok Video ${video.id}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Media;
