import React, { useState, useEffect, useCallback } from 'react';
// Import ไอคอนจาก react-icons/fi (Feather Icons)
import { FiCalendar, FiAlertTriangle, FiSunrise, FiSun, FiMoon, FiX } from 'react-icons/fi';
// Import ไอคอนชุดใหม่จาก react-icons/fa (Font Awesome)
import { 
    FaMapMarkerAlt, FaDumbbell, FaUtensils, FaHeart, FaSmile, 
    FaPalette, FaFacebook, FaTiktok, FaInstagram, FaCat, 
    FaTimes, FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';


// Import Supabase client ของคุณ
import { supabase } from './supabaseClient'; // ตรวจสอบว่า Path ถูกต้อง

// =================================================================
// 🎨 SECTION 1: HELPER & REUSABLE COMPONENTS (ปรับปรุงใหม่)
// =================================================================

// --- NEW: Image Carousel Component for Modal ---
const ImageCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const validImages = (images || []).filter(img => img); // Filter out null/undefined images
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
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                    <FaCat className="relative text-purple-400 animate-bounce" size={60} />
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-full h-full relative group overflow-hidden">
            <div
                style={{ backgroundImage: `url(${validImages[currentIndex]})` }}
                className="w-full h-full bg-center bg-cover duration-700 transition-all ease-in-out transform group-hover:scale-105"
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            {hasMultipleImages && (
                <div onClick={goToPrevious} className="hidden group-hover:flex absolute top-1/2 -translate-y-1/2 left-4 text-2xl rounded-full p-3 items-center justify-center bg-white/20 backdrop-blur-md text-white cursor-pointer transition-all duration-300 hover:bg-white/30 hover:scale-110 border border-white/20">
                    <FaChevronLeft size={18} />
                </div>
            )}
            {hasMultipleImages && (
                <div onClick={goToNext} className="hidden group-hover:flex absolute top-1/2 -translate-y-1/2 right-4 text-2xl rounded-full p-3 items-center justify-center bg-white/20 backdrop-blur-md text-white cursor-pointer transition-all duration-300 hover:bg-white/30 hover:scale-110 border border-white/20">
                    <FaChevronRight size={18} />
                </div>
            )}
        </div>
    );
};

// --- NEW: Enhanced Detail Item for Modal ---
const DetailItem = ({ icon: Icon, label, value, iconColorClass = "text-slate-500", isLink = false }) => {
    if (!value) return null;
    return (
        <div className="group flex items-start p-4 bg-gradient-to-r from-white to-slate-50/50 rounded-xl border border-slate-200/50 hover:border-purple-300/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-sm border border-slate-200/50 group-hover:scale-110 transition-transform duration-300">
                <Icon className={iconColorClass} size={20} />
            </div>
            <div className="ml-4 flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
                {isLink ? (
                    <a
                        href={value.startsWith('http') ? value : `https://${value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700 font-bold break-all transition-colors duration-200 hover:underline"
                    >
                        {value.replace(/^(https?:\/\/)?(www\.)?/, '')}
                    </a>
                ) : (
                    <p className="text-base font-bold text-slate-800 break-words mt-1">{value}</p>
                )}
            </div>
        </div>
    );
};

const CastCard = ({ item, onPress }) => (
  <button
    onClick={() => onPress(item)}
    className="group cursor-pointer rounded-2xl bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left border border-slate-100 overflow-hidden"
  >
    <div
      style={{ backgroundImage: `url(${item.image_url || 'https://placehold.co/400x533/e2e8f0/475569?text=No+Image'})` }}
      className="w-full aspect-[3/4] bg-cover bg-center transition-transform duration-500 group-hover:scale-110 flex justify-end flex-col"
    >
      <div className="p-4 rounded-b-2xl bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-lg font-bold text-white truncate" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>{item.name}</p>
        {item.rank && <p className="mt-1 text-sm text-gray-200" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>{item.rank}</p>}
      </div>
    </div>
  </button>
);

// --- NEW: Helper function for rank gradients ---
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


// =================================================================
// 🚀 SECTION 2: FUNCTIONAL COMPONENTS (ดึงข้อมูล)
// =================================================================

const ScheduleImage = () => {
    const [imageUrl, setImageUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchScheduleImage = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const { data, error: fetchError } = await supabase
                    .from('site_configurations')
                    .select('config_value')
                    .eq('config_key', 'current_schedule_image_url')
                    .single();

                if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
                
                setImageUrl(data?.config_value || null);
            } catch (err) {
                console.error("Error fetching schedule image URL:", err);
                setError("เกิดข้อผิดพลาดในการโหลดรูปภาพตารางงาน");
            } finally {
                setIsLoading(false);
            }
        };
        fetchScheduleImage();
    }, []);

    const SectionHeader = ({ title, icon: IconComponent }) => (
        <div className="flex flex-row items-center mb-4">
            <IconComponent className="text-2xl text-slate-500" />
            <h2 className="ml-3 text-2xl font-bold text-slate-800">{title}</h2>
        </div>
    );

    if (isLoading) {
        return (
            <div className="h-48 flex justify-center items-center bg-slate-50 rounded-2xl my-6">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-500"></div>
                 <p className="ml-3 text-slate-500">กำลังโหลดรูปภาพตารางงาน...</p>
            </div>
        );
    }
    
    if (!imageUrl && !error) {
        return null; 
    }

    return (
        <section className="mb-12">
            <SectionHeader title="ตารางงานรวม" icon={FiCalendar} />
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                {error ? (
                    <div className="h-40 flex flex-col justify-center items-center text-red-600">
                        <FiAlertTriangle className="text-3xl" />
                        <p className="mt-2 text-center">{error}</p>
                    </div>
                ) : imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="ตารางงานรวม"
                        className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                    />
                ) : null}
            </div>
        </section>
    );
};

const CastShifts = ({ onCastSelect }) => {
    const [morning, setMorning] = useState([]);
    const [evening, setEvening] = useState([]);
    const [night, setNight] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSchedules = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const today = new Date().toISOString().split('T')[0];
            const { data, error: fetchError } = await supabase
                .from('schedules')
                .select('work_date, shift_type, casts(*)')
                .eq('work_date', today);
            if (fetchError) throw fetchError;
            
            const shifts = { morning: [], evening: [], night: [] };
            data.forEach(s => {
                if (s.casts) {
                    const key = s.shift_type.toLowerCase();
                    if (shifts[key]) shifts[key].push(s.casts);
                }
            });
            setMorning(shifts.morning);
            setEvening(shifts.evening);
            setNight(shifts.night);
        } catch (err)
        {
            console.error("Error fetching schedules:", err);
            setError("ไม่สามารถโหลดข้อมูลตารางกะได้");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);
    
    const renderSection = (title, data, icon) => (
        <section className="mb-10">
            <div className="flex flex-row items-center mb-4">
                {React.cloneElement(icon, { className: "text-2xl text-slate-500" })}
                <h2 className="ml-3 text-2xl font-bold text-slate-800">{title}</h2>
            </div>
            {data.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6">
                    {data.map(item => (
                        <CastCard key={item.id} item={item} onPress={onCastSelect} />
                    ))}
                </div>
            ) : (
                <div className="h-36 flex flex-col justify-center items-center bg-slate-50 rounded-2xl border border-slate-200">
                    <FiMoon className="text-4xl text-slate-400" />
                    <p className="mt-3 text-base text-slate-500">ยังไม่มีน้องแมวเข้ากะในช่วงนี้</p>
                </div>
            )}
        </section>
    );

    if (isLoading) {
        return (
            <div className="h-64 flex justify-center items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-500"></div>
                <p className="ml-4 text-lg text-slate-600">กำลังโหลดรายชื่อแมว...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center text-red-600 bg-red-50 rounded-2xl">
                <FiAlertTriangle className="text-4xl" />
                <p className="mt-4 text-base font-medium">{error}</p>
                <button onClick={fetchSchedules} className="mt-5 flex items-center rounded-full bg-slate-700 text-white py-2 px-6 hover:bg-slate-600 transition">
                    ลองอีกครั้ง
                </button>
            </div>
        );
    }

    return (
        <>
            {renderSection("กะเช้า (Morning)", morning, <FiSunrise />)}
            {renderSection("กะเย็น (Afternoon)", evening, <FiSun />)}
            {renderSection("กะดึก (Night)", night, <FiMoon />)}
        </>
    );
};


// =================================================================
// 👑 SECTION 3: MAIN SCREEN COMPONENT (ปรับปรุงส่วน Modal)
// =================================================================
const Schedule = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedCast, setSelectedCast] = useState(null);

    const handleCardPress = (cast) => {
        setSelectedCast(cast);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedCast(null);
    };
    
    return (
        <div className="min-h-screen bg-white text-slate-800 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <main>
                    <ScheduleImage />
                    <CastShifts onCastSelect={handleCardPress} />
                </main>
            </div>

            {/* --- NEW: Enhanced Modal --- */}
            {selectedCast && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in-25 duration-300">
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                        onClick={handleCloseModal}
                    ></div>
                    
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-slate-200 flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-12 h-12 bg-white/80 backdrop-blur-sm text-slate-600 hover:text-slate-900 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 border border-slate-200/50 shadow-lg"
                        >
                            <FaTimes size={18} />
                        </button>
                        
                        {/* Image Section */}
                        <div className="w-full md:w-2/5 h-64 md:h-auto flex-shrink-0 relative bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 md:rounded-l-3xl rounded-t-3xl md:rounded-tr-none">
                           <ImageCarousel 
                                images={
                                    (selectedCast.image_urls && Array.isArray(selectedCast.image_urls) && selectedCast.image_urls.length > 0)
                                    ? selectedCast.image_urls 
                                    : [selectedCast.image_url]
                                } 
                            />
                            <div className={`absolute top-4 left-4 md:top-6 md:left-6 text-sm font-black px-5 py-2.5 rounded-full shadow-2xl text-white bg-gradient-to-r ${getRankGradient(selectedCast.rank)} border border-white/30 backdrop-blur-sm`}>
                                {selectedCast.rank}
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="p-6 md:p-10 flex-1 bg-white overflow-y-auto">
                            <div className="mb-8">
                                <h2 className="text-4xl sm:text-5xl font-black text-slate-800 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text transition-all duration-500 leading-tight">
                                    {selectedCast.name}
                                </h2>
                                {selectedCast.type && (
                                    <p className="mt-2 text-xl text-slate-500 font-bold">
                                        {selectedCast.type}
                                    </p>
                                )}
                            </div>

                            {selectedCast.message_to_humans && (
                                <blockquote className="p-6 mb-8 bg-slate-50 border-l-4 border-purple-400 rounded-r-2xl shadow-inner">
                                    <p className="text-lg italic text-purple-800 font-semibold leading-relaxed">
                                        "{selectedCast.message_to_humans}"
                                    </p>
                                </blockquote>
                            )}

                            <div className="space-y-8">
                               <div>
                                   <h3 className="text-xl font-black text-slate-700 pb-3 mb-5 border-b-2 border-slate-200">ข้อมูลส่วนตัว</h3>
                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                      <DetailItem icon={FaMapMarkerAlt} label="สถานที่เกิด" value={selectedCast.birth_place} iconColorClass="text-red-500" />
                                      <DetailItem icon={FaDumbbell} label="ความสามารถ" value={selectedCast.strength} iconColorClass="text-blue-500" />
                                      <DetailItem icon={FaUtensils} label="อาหารโปรด" value={selectedCast.favorite_food} iconColorClass="text-orange-500" />
                                      <DetailItem icon={FaHeart} label="สิ่งที่รัก" value={selectedCast.love_thing} iconColorClass="text-rose-500" />
                                      <DetailItem icon={FaSmile} label="งานอดิเรก" value={selectedCast.hobby} iconColorClass="text-yellow-500" />
                                      <DetailItem icon={FaPalette} label="สีโปรด" value={selectedCast.favorite_color} iconColorClass="text-purple-500" />
                                   </div>
                               </div>

                                {(selectedCast.facebook_url || selectedCast.tiktok_url || selectedCast.instagram_url) && (
                                    <div>
                                        <h3 className="text-xl font-black text-slate-700 pb-3 mb-5 border-b-2 border-slate-200">ช่องทางติดตาม</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <DetailItem icon={FaFacebook} label="Facebook" value={selectedCast.facebook_url} iconColorClass="text-blue-600" isLink={true} />
                                            <DetailItem icon={FaTiktok} label="TikTok" value={selectedCast.tiktok_url} iconColorClass="text-black" isLink={true} />
                                            <DetailItem icon={FaInstagram} label="Instagram" value={selectedCast.instagram_url} iconColorClass="text-pink-600" isLink={true} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schedule;
