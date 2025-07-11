import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../pages/supabaseClient'; // ปรับ path ตามโครงสร้างโปรเจคของคุณ

// Icons
import {
    FaTimes, FaCat, FaMapMarkerAlt, FaDumbbell, FaUtensils,
    FaHeart, FaPalette, FaSmile, FaSyncAlt,
    FaFacebook, FaTiktok, FaInstagram, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';

// --- Utility Functions ---

// ฟังก์ชันสุ่ม Array (จากโค้ดเดิม)
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// ฟังก์ชันสำหรับสร้าง Gradient ของ Rank (จากโค้ดตัวอย่าง)
const getRankGradient = (rank) => {
    const gradients = {
        'Angel': 'from-yellow-300 via-amber-400 to-orange-500',
        'Litter Angel': 'from-cyan-300 via-sky-400 to-blue-500',
        'Fairy': 'from-pink-300 via-rose-400 to-purple-500',
        'Trainee': 'from-emerald-300 via-teal-400 to-cyan-500',
        'Legend': 'from-violet-400 via-purple-500 to-indigo-600',
        'Mythic': 'from-slate-600 via-purple-700 to-black',
        'รอ Audition': 'from-gray-300 via-slate-400 to-gray-500'
    };
    return gradients[rank] || 'from-gray-400 to-gray-500';
};


// --- Sub-components ---

// Image Carousel for Modal (จากโค้ดตัวอย่าง)
const ImageCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // ตรวจสอบว่ามีรูปภาพหรือไม่ และเป็น Array ที่ถูกต้อง
    const validImages = Array.isArray(images) && images.length > 0 ? images : [];
    const hasMultipleImages = validImages.length > 1;

    const goToPrevious = (e) => {
        e.stopPropagation();
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? validImages.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = (e) => {
        e.stopPropagation();
        const isLastSlide = currentIndex === validImages.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    if (validImages.length === 0) {
        return (
            <div className="w-full h-full bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center">
                 <FaCat className="text-purple-300" size={60} />
            </div>
        );
    }
    
    return (
        <div className="w-full h-full relative group overflow-hidden">
            <div
                style={{ backgroundImage: `url(${validImages[currentIndex]})` }}
                className="w-full h-full bg-center bg-cover duration-700 transition-all ease-in-out transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            {hasMultipleImages && (
                <>
                    <button onClick={goToPrevious} className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-4 text-2xl rounded-full p-3 bg-white/20 backdrop-blur-md text-white cursor-pointer transition-all duration-300 hover:bg-white/30 hover:scale-110 border border-white/20">
                        <FaChevronLeft size={18} />
                    </button>
                    <button onClick={goToNext} className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-4 text-2xl rounded-full p-3 bg-white/20 backdrop-blur-md text-white cursor-pointer transition-all duration-300 hover:bg-white/30 hover:scale-110 border border-white/20">
                        <FaChevronRight size={18} />
                    </button>
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex justify-center gap-2">
                        {validImages.map((_, slideIndex) => (
                            <div
                                key={slideIndex}
                                onClick={(e) => { e.stopPropagation(); setCurrentIndex(slideIndex); }}
                                className={`cursor-pointer h-2.5 rounded-full transition-all duration-300 ${currentIndex === slideIndex ? 'bg-white w-6' : 'bg-white/60 w-2.5'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

// Enhanced Detail Item for Modal (จากโค้ดตัวอย่าง)
const DetailItem = ({ icon: Icon, label, value, iconColorClass = "text-slate-500", isLink = false }) => {
    if (!value && typeof value !== 'number') return null;
    return (
        <div className="group flex items-start p-4 bg-gradient-to-r from-white to-slate-50/50 rounded-xl border border-slate-200/50 hover:border-purple-300/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
            <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-gradient-to-br from-white to-slate-50 rounded-lg shadow-sm border border-slate-200/50 group-hover:scale-110 transition-transform duration-300">
                <Icon className={iconColorClass} size={18} />
            </div>
            <div className="ml-4 flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
                {isLink ? (
                    <a
                        href={String(value).startsWith('http') ? value : `https://${value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:text-purple-700 font-bold break-all transition-colors duration-200 hover:underline"
                    >
                        {value}
                    </a>
                ) : (
                    <p className="text-sm font-bold text-slate-800 break-words mt-1">{value}</p>
                )}
            </div>
        </div>
    );
};

// Enhanced Loading State (จากโค้ดตัวอย่าง)
const LoadingState = () => (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <FaCat size={80} className="relative text-purple-500 animate-bounce"/>
        </div>
        <h2 className="mt-8 text-2xl font-bold text-slate-700">กำลังโหลดข้อมูลน้องแมว...</h2>
        <p className="mt-2 text-slate-500">กรุณารอสักครู่</p>
    </div>
);

// Enhanced Error State (จากโค้ดตัวอย่าง)
const ErrorState = ({ error }) => (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 p-4">
        <div className="w-full max-w-md text-center bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-red-200/50">
            <FaCat size={60} className="mx-auto text-red-500"/>
            <h2 className="mt-8 text-2xl font-bold text-red-800">เกิดข้อผิดพลาด!</h2>
            <p className="mt-3 text-red-600 leading-relaxed">{error}</p>
        </div>
    </div>
);

// Enhanced Empty State
const EmptyState = () => (
    <div className="col-span-full text-center py-20 sm:py-32">
        <div className="bg-white border border-slate-200 rounded-3xl p-12 max-w-lg mx-auto shadow-lg">
            <FaCat size={80} className="mx-auto text-slate-400"/>
            <h3 className="mt-8 text-2xl font-black text-slate-700">ไม่มีข้อมูลน้องแมว</h3>
            <p className="mt-3 text-slate-500 leading-relaxed font-medium">
                กรุณาตรวจสอบการเชื่อมต่อ หรืออาจจะยังไม่มีน้องแมวในระบบ
            </p>
        </div>
    </div>
);


// Enhanced Cat Card (จากโค้ดตัวอย่าง)
const CatCard = ({ user, index, fadeInCards, onClick }) => (
    <div
        onClick={onClick}
        title={`ดูข้อมูล ${user.name}`}
        className="group cursor-pointer bg-white rounded-3xl border border-slate-200/80 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-purple-300 hover:-translate-y-2"
        style={{
            opacity: fadeInCards ? 1 : 0,
            transform: fadeInCards ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: `${fadeInCards ? index * 0.1 : 0}s`,
            transitionProperty: 'opacity, transform',
        }}
    >
        <div className="relative w-full aspect-[4/5] overflow-hidden">
            <img
                src={user.image_url || "https://via.placeholder.com/400x500.png?text=No+Image"}
                alt={user.name}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg text-white bg-gradient-to-r ${getRankGradient(user.rank)} border border-white/20`}>
                {user.rank}
            </div>
        </div>
        <div className="p-5 text-center bg-white">
            <h3 className="text-xl font-bold text-slate-800 truncate group-hover:text-purple-600 transition-colors duration-300">
                {user.name}
            </h3>
            {user.type && (
                <p className="text-sm text-slate-500 truncate mt-1">
                    {user.type}
                </p>
            )}
        </div>
    </div>
);

// Enhanced User Modal (จากโค้ดตัวอย่าง)
const UserModal = ({ user, onClose }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
        
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 flex flex-col md:flex-row animate-zoom-in">
            <button
                onClick={onClose}
                aria-label="Close modal"
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/80 backdrop-blur-sm text-slate-600 hover:text-slate-900 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 border border-slate-200/50 shadow-lg"
            >
                <FaTimes size={18} />
            </button>
            
            <div className="w-full md:w-2/5 flex-shrink-0 relative bg-slate-100 md:rounded-l-3xl rounded-t-3xl md:rounded-tr-none">
                <ImageCarousel 
                    images={
                        (user.image_urls && Array.isArray(user.image_urls) && user.image_urls.length > 0)
                        ? user.image_urls 
                        : (user.image_url ? [user.image_url] : [])
                    } 
                />
                <div className={`absolute top-5 left-5 text-sm font-bold px-4 py-2 rounded-full shadow-2xl text-white bg-gradient-to-r ${getRankGradient(user.rank)} border border-white/30 backdrop-blur-sm`}>
                    {user.rank}
                </div>
            </div>

            <div className="p-6 md:p-8 flex-1 bg-white md:rounded-r-3xl rounded-b-3xl">
                <div className="mb-6">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 leading-tight">
                        {user.name}
                    </h2>
                    {user.type && (
                        <p className="mt-1 text-lg text-slate-500 font-medium">
                            {user.type}
                        </p>
                    )}
                </div>

                {user.message_to_humans && (
                    <blockquote className="p-4 mb-6 bg-slate-50 border-l-4 border-purple-400 rounded-r-xl">
                        <p className="italic text-purple-800 font-medium">
                            "{user.message_to_humans}"
                        </p>
                    </blockquote>
                )}

                <div className="space-y-6">
                   <div className="border-b-2 border-slate-200 pb-2">
                       <h3 className="text-lg font-bold text-slate-700">ข้อมูลส่วนตัว</h3>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <DetailItem icon={FaMapMarkerAlt} label="สถานที่เกิด" value={user.birth_place} iconColorClass="text-red-500" />
                      <DetailItem icon={FaDumbbell} label="ความสามารถ" value={user.strength} iconColorClass="text-blue-500" />
                      <DetailItem icon={FaUtensils} label="อาหารโปรด" value={user.favorite_food} iconColorClass="text-orange-500" />
                      <DetailItem icon={FaHeart} label="สิ่งที่รัก" value={user.love_thing} iconColorClass="text-rose-500" />
                      <DetailItem icon={FaSmile} label="งานอดิเรก" value={user.hobby} iconColorClass="text-yellow-500" />
                      <DetailItem icon={FaPalette} label="สีโปรด" value={user.favorite_color} iconColorClass="text-purple-500" />
                   </div>
                </div>

                {(user.facebook_url || user.tiktok_url || user.instagram_url) && (
                    <div className="mt-8">
                        <div className="border-b-2 border-slate-200 pb-2 mb-4">
                            <h3 className="text-lg font-bold text-slate-700">ช่องทางติดตาม</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <DetailItem icon={FaFacebook} label="Facebook" value={user.facebook_url} iconColorClass="text-blue-600" isLink={true} />
                            <DetailItem icon={FaTiktok} label="TikTok" value={user.tiktok_url} iconColorClass="text-black" isLink={true} />
                            <DetailItem icon={FaInstagram} label="Instagram" value={user.instagram_url} iconColorClass="text-pink-600" isLink={true} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
);


// --- Main Cast Component ---
const Cast = () => {
    // State จากโค้ดเดิม
    const [allCastsData, setAllCastsData] = useState([]);
    const [displayedCast, setDisplayedCast] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [fadeInCards, setFadeInCards] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch casts (เหมือนเดิม)
    useEffect(() => {
        const fetchCasts = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const { data, error: fetchError } = await supabase
                    .from('casts')
                    .select('*');
                
                if (fetchError) throw fetchError;
                
                setAllCastsData(data || []);
            } catch (err) {
                console.error("Error fetching casts:", err.message);
                setError(`ไม่สามารถโหลดข้อมูลน้องแมวได้ (${err.message})`);
                setAllCastsData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCasts();
    }, []);

    // Shuffle and display initial cats (เหมือนเดิม)
    useEffect(() => {
        if (!isLoading && allCastsData.length > 0) {
            setIsShuffling(true);
            setFadeInCards(false);
            
            setTimeout(() => {
                const shuffled = shuffleArray(allCastsData);
                setDisplayedCast(shuffled.slice(0, Math.min(allCastsData.length, 3)));
                setFadeInCards(true);
                setIsShuffling(false);
            }, 300);
        } else if (!isLoading && allCastsData.length === 0) {
            setDisplayedCast([]);
            setFadeInCards(true);
        }
    }, [isLoading, allCastsData]);

    // Reshuffle cats (เหมือนเดิม)
    const reshuffleCats = useCallback(() => {
        if (allCastsData.length > 3) {
            setIsShuffling(true);
            setFadeInCards(false);
            
            setTimeout(() => {
                // เพื่อให้แน่ใจว่าจะไม่สุ่มได้เซ็ตเดิมเป๊ะๆ (อาจเกิดขึ้นได้แต่ยาก)
                // เราจะ shuffle จนกว่าจะได้เซ็ตที่ไม่เหมือนเดิม หรือพยายาม 5 ครั้ง
                let newShuffled;
                let attempts = 0;
                do {
                    newShuffled = shuffleArray(allCastsData).slice(0, 3);
                    attempts++;
                } while (
                    newShuffled.every(cat => displayedCast.some(d => d.id === cat.id)) &&
                    attempts < 5
                );

                setDisplayedCast(newShuffled);
                setFadeInCards(true);
                setIsShuffling(false);
            }, 300);
        }
    }, [allCastsData, displayedCast]);

    // Modal handlers (เหมือนเดิม)
    const openUserModal = (user) => setSelectedUser(user);
    const closeUserModal = () => setSelectedUser(null);

    // Render states
    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;

    return (
        <div className="min-h-screen bg-white text-slate-800 py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Enhanced Header (จากโค้ดตัวอย่าง) */}
                <div className="text-center mb-12 sm:mb-16">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-800 tracking-tight">
                        ลองทำความรู้จักน้องแมวของเรา
                    </h1>
                    <p className="mt-5 max-w-2xl mx-auto text-lg text-slate-600">
                        พบกับความน่ารักสดใสของเหล่าสมาชิกเหมียวแบบสุ่ม ✨
                    </p>
                </div>
                
                {/* Reshuffle Button with new style */}
                <div className="text-center mb-12 sm:mb-16">
                    {allCastsData.length > 3 && (
                        <button
                            onClick={reshuffleCats}
                            disabled={isShuffling}
                            className={`px-6 py-3 text-base font-bold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out flex items-center justify-center mx-auto ${
                                isShuffling 
                                    ? 'bg-slate-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl transform hover:-translate-y-1'
                            }`}
                        >
                            <FaSyncAlt className={`mr-2.5 ${isShuffling ? 'animate-spin' : ''}`} />
                            {isShuffling ? 'กำลังสุ่ม...' : 'สุ่มน้องแมวใหม่'}
                        </button>
                    )}
                </div>

                {/* Main content grid */}
                <div className="flex justify-center">
                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl transition-opacity duration-700 ease-out ${
                        fadeInCards ? 'opacity-100' : 'opacity-0'
                    }`}>
                        {displayedCast.length > 0 ? (
                            displayedCast.map((user, index) => (
                                <CatCard
                                    key={user.id}
                                    user={user}
                                    index={index}
                                    fadeInCards={fadeInCards}
                                    onClick={() => openUserModal(user)}
                                />
                            ))
                        ) : (
                            <EmptyState />
                        )}
                    </div>
                </div>

                {/* User Modal */}
                {selectedUser && (
                    <UserModal 
                        user={selectedUser} 
                        onClose={closeUserModal} 
                    />
                )}
            </div>
        </div>
    );
};

export default Cast;