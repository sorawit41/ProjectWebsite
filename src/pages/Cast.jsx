import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// Icons for Modal and UI
import {
    FaCat, FaTimes, FaMapMarkerAlt, FaDumbbell, FaUtensils,
    FaHeart, FaPalette, FaSmile, FaFacebook, FaTiktok,
    FaInstagram, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';

// --- Image Carousel Component (Unchanged) ---
const ImageCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const hasMultipleImages = images && images.length > 1;

    const goToPrevious = (e) => {
        e.stopPropagation(); // Prevents modal from closing
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = (e) => {
        e.stopPropagation(); // Prevents modal from closing
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    };

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                <FaCat className="text-slate-500" size={60} />
            </div>
        );
    }
    
    return (
        <div className="w-full h-full relative group overflow-hidden">
            <div
                style={{ backgroundImage: `url(${images[currentIndex]})` }}
                className="w-full h-full bg-center bg-cover duration-500 ease-in-out"
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            {hasMultipleImages && (
                <div onClick={goToPrevious} className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-4 text-2xl rounded-full p-2 bg-black/30 backdrop-blur-sm text-white cursor-pointer transition-all duration-300 hover:bg-black/50 hover:scale-110">
                    <FaChevronLeft size={20} />
                </div>
            )}
            {hasMultipleImages && (
                <div onClick={goToNext} className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-4 text-2xl rounded-full p-2 bg-black/30 backdrop-blur-sm text-white cursor-pointer transition-all duration-300 hover:bg-black/50 hover:scale-110">
                    <FaChevronRight size={20} />
                </div>
            )}
            {hasMultipleImages && (
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-2">
                    {images.map((_, slideIndex) => (
                        <div
                            key={slideIndex}
                            onClick={() => goToSlide(slideIndex)}
                            className={`cursor-pointer h-2 rounded-full transition-all duration-500 ${currentIndex === slideIndex ? 'bg-white w-6' : 'bg-white/50 w-2 hover:bg-white/80'}`}
                        ></div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Helper Functions (Unchanged) ---
const getRankGradient = (rank) => {
    const gradients = {
        'Angel': 'from-yellow-400 to-orange-500',
        'Litter Angel': 'from-sky-400 to-blue-500',
        'Fairy': 'from-pink-400 to-rose-500',
        'Trainee': 'from-emerald-400 to-teal-500',
        'Legend': 'from-purple-500 to-indigo-600',
        'Mythic': 'from-slate-700 to-black',
        'รอ Audition': 'from-slate-400 to-gray-500'
    };
    return gradients[rank] || 'from-gray-400 to-gray-500';
};

const DetailItem = ({ icon: Icon, label, value, iconColorClass = "text-slate-500", isLink = false }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-4">
            {/* Changed background for better contrast on white page */}
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                <Icon className={iconColorClass} size={18} />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                {isLink ? (
                    <a
                        href={value.startsWith('http') ? value : `https://${value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-semibold text-indigo-600 hover:text-indigo-700 break-all hover:underline"
                    >
                        {value}
                    </a>
                ) : (
                    <p className="text-base font-semibold text-slate-800 break-words">{value}</p>
                )}
            </div>
        </div>
    );
};

// --- SIMPLIFIED COMPONENT ---
const Cast = () => {
    const [allCastsData, setAllCastsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    // --- Simplified Data Fetching Logic ---
    useEffect(() => {
        const fetchCasts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Data is fetched and sorted by ID ascending by default
                const { data, error: fetchError } = await supabase.from('casts').select('*').order('id', { ascending: true });
                if (fetchError) throw fetchError;
                setAllCastsData(data || []);
            } catch (err) {
                console.error("Error fetching casts:", err);
                setError("ไม่สามารถโหลดข้อมูลน้องแมวได้ กรุณาลองใหม่อีกครั้ง");
                setAllCastsData([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCasts();
    }, []);

    const openUserModal = (user) => setSelectedUser(user);
    const closeUserModal = () => setSelectedUser(null);

    // --- RENDER STATES (Slightly restyled for new design) ---
    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white p-4">
                <FaCat size={60} className="text-slate-500 animate-bounce"/>
                <h2 className="mt-6 text-xl font-bold text-slate-700">กำลังโหลดข้อมูล...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-red-50 p-4">
                <div className="w-full max-w-md text-center bg-white p-8 rounded-2xl shadow-lg border border-red-200">
                    <FaCat size={50} className="mx-auto text-red-500"/>
                    <h2 className="mt-6 text-xl font-bold text-red-800">เกิดข้อผิดพลาด!</h2>
                    <p className="mt-2 text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    // --- NEW MAIN COMPONENT RENDER ---
    return (
        <div className="min-h-screen bg-white text-slate-800 font-sans">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                
                {/* Header */}
                <header className="text-center mb-12 md:mb-16">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
                        ทำเนียบน้องแมว
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
                        พบกับความน่ารักสดใสและข้อมูลของเหล่าสมาชิกเหมียวทุกคน
                    </p>
                </header>
                
                {/* Controls section has been removed */}

                {/* Cast Grid */}
                {allCastsData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
                        {allCastsData.map((user) => (
                             <button
                                key={user.id}
                                onClick={() => openUserModal(user)}
                                className="group cursor-pointer rounded-2xl bg-white shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left border border-slate-200/50 overflow-hidden"
                            >
                                <div
                                  style={{ backgroundImage: `url(${user.image_url || 'https://placehold.co/400x533/e2e8f0/475569?text=No+Image'})` }}
                                  className="w-full aspect-[3/4] bg-cover bg-center transition-transform duration-500 group-hover:scale-105 flex justify-end flex-col"
                                >
                                  <div className="p-5 rounded-b-2xl bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-xl font-bold text-white truncate" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>{user.name}</p>
                                    {user.rank && <p className="mt-0.5 text-sm font-medium text-gray-200" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>{user.rank}</p>}
                                  </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-block bg-white border border-slate-200 rounded-2xl p-10">
                            <FaCat size={50} className="mx-auto text-slate-400"/>
                            <h3 className="mt-6 text-xl font-bold text-slate-700">ไม่พบข้อมูลน้องแมว</h3>
                            <p className="mt-2 text-slate-500">อาจจะยังไม่มีน้องแมวในระบบ</p>
                        </div>
                    </div>
                )}
            </div>

            {/* REDESIGNED MODAL (Unchanged from previous version) */}
            {selectedUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeUserModal}></div>
                    
                    {/* Modal Panel */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-300">
                        
                        {/* Image Panel */}
                        <div className="w-full md:w-2/5 flex-shrink-0 bg-slate-200 h-64 md:h-auto">
                           <ImageCarousel 
                                images={
                                    (selectedUser.image_urls && Array.isArray(selectedUser.image_urls) && selectedUser.image_urls.length > 0)
                                    ? selectedUser.image_urls 
                                    : [selectedUser.image_url]
                                } 
                            />
                        </div>

                        {/* Content Panel with Scrolling */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-6 sm:p-8 md:p-10">
                                <div className="absolute top-4 right-4 z-20">
                                    <button
                                        onClick={closeUserModal}
                                        className="w-10 h-10 bg-white/80 backdrop-blur-sm text-slate-600 hover:text-slate-900 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 border border-slate-200/50 shadow-sm"
                                    >
                                        <FaTimes size={16} />
                                    </button>
                                </div>

                                <div className="mb-6">
                                    {selectedUser.rank && (
                                        <div className={`inline-block text-sm font-bold px-4 py-1.5 rounded-full mb-3 text-white bg-gradient-to-r ${getRankGradient(selectedUser.rank)}`}>
                                            {selectedUser.rank}
                                        </div>
                                    )}
                                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                                        {selectedUser.name}
                                    </h2>
                                    {selectedUser.type && (
                                        <p className="mt-1 text-lg text-slate-500 font-semibold">{selectedUser.type}</p>
                                    )}
                                </div>

                                {selectedUser.message_to_humans && (
                                    <blockquote className="p-4 mb-8 bg-slate-50 border-l-4 border-indigo-400 rounded-r-lg">
                                        <p className="text-base italic text-slate-700 font-medium">
                                            "{selectedUser.message_to_humans}"
                                        </p>
                                    </blockquote>
                                )}

                                <div className="space-y-8">
                                    <div>
                                       <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">ข้อมูลส่วนตัว</h3>
                                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                                          <DetailItem icon={FaMapMarkerAlt} label="สถานที่เกิด" value={selectedUser.birth_place} iconColorClass="text-red-500" />
                                          <DetailItem icon={FaDumbbell} label="ความสามารถ" value={selectedUser.strength} iconColorClass="text-blue-500" />
                                          <DetailItem icon={FaUtensils} label="อาหารโปรด" value={selectedUser.favorite_food} iconColorClass="text-orange-500" />
                                          <DetailItem icon={FaHeart} label="สิ่งที่รัก" value={selectedUser.love_thing} iconColorClass="text-rose-500" />
                                          <DetailItem icon={FaSmile} label="งานอดิเรก" value={selectedUser.hobby} iconColorClass="text-yellow-500" />
                                          <DetailItem icon={FaPalette} label="สีโปรด" value={selectedUser.favorite_color} iconColorClass="text-purple-500" />
                                       </div>
                                    </div>

                                    {(selectedUser.facebook_url || selectedUser.tiktok_url || selectedUser.instagram_url) && (
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">ช่องทางติดตาม</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                                                <DetailItem icon={FaFacebook} label="Facebook" value={selectedUser.facebook_url} iconColorClass="text-blue-600" isLink={true} />
                                                <DetailItem icon={FaTiktok} label="TikTok" value={selectedUser.tiktok_url} iconColorClass="text-black" isLink={true} />
                                                <DetailItem icon={FaInstagram} label="Instagram" value={selectedUser.instagram_url} iconColorClass="text-pink-600" isLink={true} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cast;