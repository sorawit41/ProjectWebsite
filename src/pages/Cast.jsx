import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// Icons for Modal and UI
import {
    FaCat, FaTimes, FaMapMarkerAlt, FaDumbbell, FaUtensils,
    FaHeart, FaPalette, FaSmile, FaFacebook, FaTiktok,
    FaInstagram, FaSearch, FaFilter, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';

// --- NEW: Image Carousel Component ---
const ImageCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const hasMultipleImages = images && images.length > 1;

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    };

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-full bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                    <FaCat className="relative text-purple-400 animate-bounce" size={60} />
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-full h-full relative group overflow-hidden">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-blue-500/20"></div>
            
            {/* Image Display */}
            <div
                style={{ backgroundImage: `url(${images[currentIndex]})` }}
                className="w-full h-full bg-center bg-cover duration-700 transition-all ease-in-out transform group-hover:scale-105"
            ></div>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

            {/* Left Arrow */}
            {hasMultipleImages && (
                <div onClick={goToPrevious} className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-4 text-2xl rounded-full p-3 bg-white/20 backdrop-blur-md text-white cursor-pointer transition-all duration-300 hover:bg-white/30 hover:scale-110 border border-white/20">
                    <FaChevronLeft size={18} />
                </div>
            )}
            
            {/* Right Arrow */}
            {hasMultipleImages && (
                <div onClick={goToNext} className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-4 text-2xl rounded-full p-3 bg-white/20 backdrop-blur-md text-white cursor-pointer transition-all duration-300 hover:bg-white/30 hover:scale-110 border border-white/20">
                    <FaChevronRight size={18} />
                </div>
            )}

            {/* Dots Indicator */}
            {hasMultipleImages && (
                 <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex justify-center gap-2 bg-black/20 backdrop-blur-md rounded-full px-4 py-2">
                    {images.map((_, slideIndex) => (
                        <div
                            key={slideIndex}
                            onClick={() => goToSlide(slideIndex)}
                            className={`cursor-pointer h-2.5 rounded-full transition-all duration-300 hover:scale-125 ${currentIndex === slideIndex ? 'bg-white w-8 shadow-lg' : 'bg-white/60 w-2.5 hover:bg-white/80'}`}
                        ></div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Define the desired order of ranks for sorting
const RANK_ORDER = ["Angel", "Litter Angel", "Fairy", "Trainee", "Legend", "Mythic", "รอ Audition"];

const Cast = () => {
    const [allCastsData, setAllCastsData] = useState([]);
    const [filteredCast, setFilteredCast] = useState([]);
    const [sortBy, setSortBy] = useState('id-asc');
    const [searchTerm, setSearchTerm] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isGridVisible, setIsGridVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Fetch cast data from Supabase
    useEffect(() => {
        const fetchCasts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const { data, error: fetchError } = await supabase
                    .from('casts')
                    .select('*')
                    .order('id', { ascending: true });

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

    // Effect for filtering and sorting
    useEffect(() => {
        let newFilteredData = [...allCastsData];

        if (searchTerm) {
            newFilteredData = newFilteredData.filter(cast =>
                cast.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cast.rank.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (cast.type && cast.type.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        switch (sortBy) {
            case 'name-asc':
                newFilteredData.sort((a, b) => a.name.localeCompare(b.name, 'th'));
                break;
            case 'name-desc':
                newFilteredData.sort((a, b) => b.name.localeCompare(a.name, 'th'));
                break;
            case 'rank-asc':
                newFilteredData.sort((a, b) => {
                    const rankAIndex = RANK_ORDER.indexOf(a.rank);
                    const rankBIndex = RANK_ORDER.indexOf(b.rank);
                    if (rankAIndex === -1 && rankBIndex === -1) return a.rank.localeCompare(b.rank, 'th');
                    if (rankAIndex === -1) return 1;
                    if (rankBIndex === -1) return -1;
                    return rankAIndex - rankBIndex;
                });
                break;
            case 'id-asc':
                newFilteredData.sort((a, b) => a.id - b.id);
                break;
            case 'id-desc':
                newFilteredData.sort((a, b) => b.id - b.id);
                break;
            default:
                newFilteredData.sort((a, b) => a.id - b.id);
                break;
        }
        setFilteredCast(newFilteredData);
        
        // Trigger grid fade-in animation
        if (newFilteredData.length > 0) {
            const timer = setTimeout(() => setIsGridVisible(true), 100);
            return () => clearTimeout(timer);
        } else {
            setIsGridVisible(false);
        }

    }, [allCastsData, sortBy, searchTerm]);

    const openUserModal = (user) => setSelectedUser(user);
    const closeUserModal = () => setSelectedUser(null);

    // Enhanced gradient function for ranks
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
    
    // Enhanced Detail Item for Modal
    const DetailItem = ({ icon: Icon, label, value, iconColorClass = "text-slate-500", isLink = false }) => {
        if (!value) return null;
        return (
            <div className="group flex items-start p-5 bg-gradient-to-r from-white to-slate-50/50 rounded-xl border border-slate-200/50 hover:border-purple-300/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-sm border border-slate-200/50 group-hover:scale-110 transition-transform duration-300">
                    <Icon className={iconColorClass} size={20} />
                </div>
                <div className="ml-4 flex-1">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
                    {isLink ? (
                        <a
                            href={value.startsWith('http') ? value : `https://${value}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-700 font-bold break-all transition-colors duration-200 hover:underline"
                        >
                            {value}
                        </a>
                    ) : (
                        <p className="text-base font-bold text-slate-800 break-words mt-1">{value}</p>
                    )}
                </div>
            </div>
        );
    };

    // --- RENDER STATES ---

    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                    <FaCat size={80} className="relative text-purple-500 animate-bounce"/>
                </div>
                <h2 className="mt-8 text-2xl font-bold text-slate-700 animate-pulse">กำลังโหลดข้อมูลน้องแมว...</h2>
                <p className="mt-2 text-slate-500 animate-pulse">กรุณารอสักครู่</p>
                <div className="mt-6 flex space-x-2">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 p-4">
                <div className="w-full max-w-md text-center bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-red-200/50">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                        <FaCat size={60} className="relative mx-auto text-red-500"/>
                    </div>
                    <h2 className="mt-8 text-2xl font-bold text-red-800">เกิดข้อผิดพลาด!</h2>
                    <p className="mt-3 text-red-600 leading-relaxed">{error}</p>
                </div>
            </div>
        );
    }

    // --- MAIN COMPONENT ---

    return (
        <div className="min-h-screen bg-white text-slate-800 py-16 sm:py-24 relative overflow-hidden">
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                
                {/* Enhanced Header */}
                <div className="text-center mb-16">
                    <div className="relative inline-block">
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-800 tracking-tight hover:text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 hover:bg-clip-text transition-all duration-500">
                            ทำเนียบน้องแมว
                        </h1>
                    </div>
                    <p className="mt-6 max-w-3xl mx-auto text-xl text-slate-600 leading-relaxed font-medium">
                        พบกับความน่ารักสดใสของเหล่าสมาชิกเหมียวทุกคน ✨
                    </p>
                    <div className="mt-4 flex justify-center space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>

                {/* Enhanced Controls */}
                <div className="mb-16 p-6 bg-white border border-slate-200 rounded-3xl shadow-lg">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="relative w-full sm:max-w-xs lg:max-w-sm group">
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                                <input
                                    type="text"
                                    placeholder="ค้นหาด้วยชื่อ, rank..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300 text-slate-700 font-medium placeholder-slate-400"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3 text-sm font-bold text-slate-700 bg-white rounded-full px-4 py-2 border border-slate-200">
                                <FaCat className="text-purple-500" />
                                <span>พบ {filteredCast.length} ชีวิต</span>
                            </div>
                            <div className="relative group">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-slate-700"
                                >
                                    <option value="id-asc">ID (น้อยไปมาก)</option>
                                    <option value="id-desc">ID (มากไปน้อย)</option>
                                    <option value="name-asc">ชื่อ (ก → ฮ)</option>
                                    <option value="name-desc">ชื่อ (ฮ → ก)</option>
                                    <option value="rank-asc">จัดอันดับ Rank</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Cast Grid */}
                {filteredCast.length > 0 ? (
                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 transition-all duration-1000 ${isGridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        {filteredCast.map((user, index) => (
                            <div
                                key={user.id}
                                onClick={() => openUserModal(user)}
                                className="group cursor-pointer bg-white rounded-3xl border border-slate-200 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-purple-400 hover:-translate-y-2 hover:scale-105 relative"
                                style={{
                                    transitionDelay: `${(index % 16) * 0.05}s`
                                }}
                            >
                                {/* Remove glow effect */}
                                
                                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-t-3xl">
                                    <img
                                        src={user.image_url || "https://placekitten.com/400/500"}
                                        alt={user.name}
                                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent group-hover:from-black/5 transition-all duration-500"></div>
                                    <div className={`absolute top-4 right-4 text-xs font-black px-4 py-2 rounded-full shadow-lg text-white bg-gradient-to-r ${getRankGradient(user.rank)} border border-white/20`}>
                                        {user.rank}
                                    </div>
                                </div>
                                <div className="relative p-6 text-center bg-white">
                                    <h3 className="text-xl font-black text-slate-800 truncate group-hover:text-purple-600 transition-colors duration-300">
                                        {user.name}
                                    </h3>
                                    {user.type && (
                                        <p className="text-sm text-slate-500 truncate mt-1 font-semibold">
                                            {user.type}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 sm:py-32">
                        <div className="bg-white border border-slate-200 rounded-3xl p-12 max-w-lg mx-auto shadow-lg">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                                <FaCat size={80} className="relative mx-auto text-slate-400"/>
                            </div>
                            <h3 className="mt-8 text-2xl font-black text-slate-700">
                                ไม่พบน้องแมวที่ค้นหา
                            </h3>
                            <p className="mt-3 text-slate-500 leading-relaxed font-medium">
                                {searchTerm ? `ไม่พบผลลัพธ์สำหรับ "${searchTerm}"` : 'อาจจะยังไม่มีน้องแมวในระบบ'}
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="mt-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-1"
                                >
                                    ล้างการค้นหา
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Enhanced Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                        onClick={closeUserModal}
                    ></div>
                    
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
                        <button
                            onClick={closeUserModal}
                            className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/80 backdrop-blur-sm text-slate-600 hover:text-slate-900 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 border border-slate-200/50 shadow-lg"
                        >
                            <FaTimes size={18} />
                        </button>
                        
                        {/* Enhanced Image Section */}
                        <div className="w-full md:w-2/5 flex-shrink-0 relative bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 md:rounded-l-3xl rounded-t-3xl md:rounded-tr-none">
                           <ImageCarousel 
                                images={
                                    (selectedUser.image_urls && Array.isArray(selectedUser.image_urls) && selectedUser.image_urls.length > 0)
                                    ? selectedUser.image_urls 
                                    : [selectedUser.image_url]
                                } 
                            />
                            <div className={`absolute top-6 left-6 text-sm font-black px-5 py-2.5 rounded-full shadow-2xl text-white bg-gradient-to-r ${getRankGradient(selectedUser.rank)} border border-white/30 backdrop-blur-sm`}>
                                {selectedUser.rank}
                            </div>
                        </div>

                        {/* Enhanced Modal Info Section */}
                        <div className="p-8 md:p-10 flex-1 bg-white">
                            <div className="mb-8">
                                <h2 className="text-4xl sm:text-5xl font-black text-slate-800 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text transition-all duration-500 leading-tight">
                                    {selectedUser.name}
                                </h2>
                                {selectedUser.type && (
                                    <p className="mt-2 text-xl text-slate-500 font-bold">
                                        {selectedUser.type}
                                    </p>
                                )}
                            </div>

                            {selectedUser.message_to_humans && (
                                <blockquote className="p-6 mb-8 bg-slate-50 border-l-4 border-purple-400 rounded-r-2xl shadow-lg">
                                    <p className="text-lg italic text-purple-800 font-semibold leading-relaxed">
                                        "{selectedUser.message_to_humans}"
                                    </p>
                                </blockquote>
                            )}

                            <div className="space-y-6">
                               <div className="border-b-2 border-gradient-to-r from-purple-200 to-pink-200 pb-3">
                                   <h3 className="text-xl font-black text-slate-700">ข้อมูลส่วนตัว</h3>
                               </div>
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                  <DetailItem icon={FaMapMarkerAlt} label="สถานที่เกิด" value={selectedUser.birth_place} iconColorClass="text-red-500" />
                                  <DetailItem icon={FaDumbbell} label="ความสามารถ" value={selectedUser.strength} iconColorClass="text-blue-500" />
                                  <DetailItem icon={FaUtensils} label="อาหารโปรด" value={selectedUser.favorite_food} iconColorClass="text-orange-500" />
                                  <DetailItem icon={FaHeart} label="สิ่งที่รัก" value={selectedUser.love_thing} iconColorClass="text-rose-500" />
                                  <DetailItem icon={FaSmile} label="งานอดิเรก" value={selectedUser.hobby} iconColorClass="text-yellow-500" />
                                  <DetailItem icon={FaPalette} label="สีโปรด" value={selectedUser.favorite_color} iconColorClass="text-purple-500" />
                               </div>
                            </div>

                            {(selectedUser.facebook_url || selectedUser.tiktok_url || selectedUser.instagram_url) && (
                                <div className="mt-10">
                                    <div className="border-b-2 border-gradient-to-r from-purple-200 to-pink-200 pb-3 mb-6">
                                        <h3 className="text-xl font-black text-slate-700">ช่องทางติดตาม</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <DetailItem icon={FaFacebook} label="Facebook" value={selectedUser.facebook_url} iconColorClass="text-blue-600" isLink={true} />
                                        <DetailItem icon={FaTiktok} label="TikTok" value={selectedUser.tiktok_url} iconColorClass="text-black" isLink={true} />
                                        <DetailItem icon={FaInstagram} label="Instagram" value={selectedUser.instagram_url} iconColorClass="text-pink-600" isLink={true} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cast;