import React, { useState, useEffect } from 'react';
import { 
    ArrowRightIcon, 
    CalendarDaysIcon, 
    NewspaperIcon, 
    PlayCircleIcon, 
    UsersIcon, 
    ChatBubbleLeftRightIcon, 
    StarIcon 
} from '@heroicons/react/24/solid';
// ✅ [NEW] Import react-icons for the new Members section
import {
    FaCat, FaTimes, FaMapMarkerAlt, FaDumbbell, FaUtensils,
    FaHeart, FaPalette, FaSmile, FaFacebook, FaTiktok,
    FaInstagram, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { supabase } from '../pages/supabaseClient';

// --- Placeholder/Skeleton Components ---

const BannerPlaceholder = () => (
  <div className="h-[60vh] w-full bg-slate-200 animate-pulse"></div>
);

const NewsCardPlaceholder = () => (
  <div className="overflow-hidden rounded-xl bg-white shadow-sm animate-pulse">
    <div className="h-40 bg-slate-200"></div>
    <div className="p-5 space-y-3">
      <div className="w-full h-5 rounded bg-slate-200"></div>
      <div className="w-3/4 h-5 rounded bg-slate-200"></div>
      <div className="w-1/3 h-3 mt-2 rounded bg-slate-200"></div>
    </div>
  </div>
);

const ScheduleItemPlaceholder = () => (
  <div className="flex items-center gap-4 p-3 animate-pulse">
    <div className="w-12 h-12 rounded-lg bg-slate-200"></div>
    <div className="flex-1 space-y-2">
        <div className="w-full h-4 rounded bg-slate-200"></div>
        <div className="w-1/2 h-3 rounded bg-slate-200"></div>
    </div>
  </div>
);

const FeaturedIdolPlaceholder = () => (
    <div className="flex flex-col gap-8 p-6 border rounded-xl md:flex-row bg-slate-50 animate-pulse">
        <div className="md:w-1/3 h-60 md:h-auto rounded-lg bg-slate-200"></div>
        <div className="flex-1 space-y-4">
            <div className="w-1/2 h-8 rounded bg-slate-200"></div>
            <div className="w-full h-5 rounded bg-slate-200"></div>
            <div className="w-full h-5 rounded bg-slate-200"></div>
            <div className="w-3/4 h-5 rounded bg-slate-200"></div>
            <div className="w-1/4 h-10 mt-4 rounded bg-slate-200"></div>
        </div>
    </div>
);

// This placeholder is now for the new Cast/Member card style
const MemberCardPlaceholder = () => (
    <div className="w-full aspect-[3/4] bg-slate-200 rounded-2xl animate-pulse"></div>
);


// --- Hero Banner Component ---
const HeroBanner = ({ data }) => {
  if (!data) {
    return <BannerPlaceholder />;
  }
  const {
    title = 'Welcome to Our Universe',
    subtitle = 'Discover the latest news, schedules, and stories from your favorite idols.',
    image_url = 'https://images.unsplash.com/photo-1578112812809-93e8093a105b?q=80&w=2070&auto=format&fit=crop',
  } = data;

  return (
    <div className="relative w-full h-[60vh] overflow-hidden group">
      <img
        src={image_url}
        alt={title}
        className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/1920x600/e2e8f0/475569?text=Image+Not+Found' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-8 text-white md:p-16">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl drop-shadow-lg">{title}</h1>
        <p className="max-w-2xl mt-4 text-lg text-slate-200 drop-shadow-md">{subtitle}</p>
      </div>
    </div>
  );
};


// --- Sub-components ---
const SectionHeader = ({ icon, title, subtitle, viewMoreLink = "#" }) => (
  <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
    <div className="flex items-center gap-4">
      {React.createElement(icon, { className: "w-8 h-8 text-violet-500" })}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-md text-slate-500">{subtitle}</p>}
      </div>
    </div>
    <a href={viewMoreLink} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors rounded-full text-violet-600 bg-violet-100 hover:bg-violet-200">
      View More <ArrowRightIcon className="w-4 h-4" />
    </a>
  </div>
);

const NewsCard = ({ title, date, image_url }) => (
  <div className="overflow-hidden transition-all duration-300 rounded-xl bg-white shadow-md hover:shadow-xl hover:-translate-y-1">
    <div className="w-full overflow-hidden aspect-video">
        <img 
            src={image_url} 
            alt={title} 
            className="object-cover w-full h-full"
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/e2e8f0/475569?text=News' }}
        />
    </div>
    <div className="p-5">
        <p className="mb-2 text-sm text-slate-500">{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h3 className="text-lg font-bold text-slate-800 line-clamp-2">{title}</h3>
    </div>
  </div>
);

const ScheduleItem = ({ monthDay, dayYear, title }) => (
    <div className="flex items-center gap-4 p-3 transition-colors rounded-lg hover:bg-slate-100">
        <div className="flex flex-col items-center justify-center w-16 h-16 text-white rounded-lg bg-violet-500">
            <p className="text-2xl font-bold">{monthDay.split(' ')[1]}</p>
            <p className="text-xs uppercase">{monthDay.split(' ')[0]}</p>
        </div>
        <div>
            <p className="font-semibold text-slate-800">{title}</p>
            <p className="text-sm text-slate-500">{dayYear}</p>
        </div>
    </div>
);

const SocialCard = ({ member, handle, platformIcon, avatarUrl, post, timestamp, imageUrl }) => (
    <div className="p-5 transition-all duration-300 bg-white border rounded-xl border-slate-200/80 hover:shadow-lg hover:border-slate-300">
        <div className="flex items-center gap-3">
            <img src={avatarUrl} alt={member} className="object-cover w-12 h-12 rounded-full" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/e2e8f0/475569?text=Avatar' }}/>
            <div>
                <p className="font-bold text-slate-800">{member}</p>
                <p className="text-sm text-slate-500">{handle} &middot; {timestamp}</p>
            </div>
        </div>
        <p className="my-4 text-slate-700">{post}</p>
        {imageUrl && (
            <div className="mt-4 overflow-hidden rounded-lg">
                <img src={imageUrl} alt="Post media" className="object-cover w-full" onError={(e) => { e.target.style.display='none' }}/>
            </div>
        )}
    </div>
);

const FeaturedIdolCard = ({ name, description, image_url }) => (
    <div className="flex flex-col gap-8 overflow-hidden md:flex-row md:items-center">
        <div className="md:w-2/5">
            <img 
                src={image_url} 
                alt={name} 
                className="object-cover w-full h-full transition-transform duration-300 rounded-xl shadow-2xl shadow-violet-500/20 hover:scale-105"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x400/e2e8f0/475569?text=Idol' }}
            />
        </div>
        <div className="flex-1 md:py-4">
            <p className="mb-2 font-semibold tracking-widest uppercase text-violet-500">Idol of The Month</p>
            <h3 className="text-4xl font-extrabold text-slate-800">{name}</h3>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">{description}</p>
            <button className="inline-flex items-center gap-2 px-6 py-3 mt-8 font-semibold text-white transition-colors rounded-full bg-violet-500 hover:bg-violet-600 shadow-lg shadow-violet-500/30">
                Learn More <ArrowRightIcon className="w-5 h-5"/>
            </button>
        </div>
    </div>
);

const NoDataPlaceholder = ({ message = "ไม่มีข้อมูล" }) => (
  <div className="flex items-center justify-center h-40 p-4 text-center rounded-xl bg-slate-100">
    <p className="text-slate-500">{message}</p>
  </div>
);

// --- ✅ [NEW] --- All components for the new Members/Cast section are placed here ---

// Image Carousel Component for Modal
const ImageCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const validImages = Array.isArray(images) ? images.filter(Boolean) : [];
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

    if (!validImages || validImages.length === 0) {
        return (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
                <FaCat className="text-purple-300" size={60} />
            </div>
        );
    }
    
    return (
        <div className="relative w-full h-full overflow-hidden group">
            <div
                style={{ backgroundImage: `url(${validImages[currentIndex]})` }}
                className="w-full h-full transition-all duration-700 ease-in-out transform bg-center bg-cover group-hover:scale-105"
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            {hasMultipleImages && (
                <>
                    <button onClick={goToPrevious} className="absolute p-3 text-2xl text-white transition-all duration-300 -translate-y-1/2 bg-white/20 backdrop-blur-md border border-white/20 rounded-full cursor-pointer top-1/2 left-4 hover:bg-white/30 hover:scale-110">
                        <FaChevronLeft size={18} />
                    </button>
                    <button onClick={goToNext} className="absolute p-3 text-2xl text-white transition-all duration-300 -translate-y-1/2 bg-white/20 backdrop-blur-md border border-white/20 rounded-full cursor-pointer top-1/2 right-4 hover:bg-white/30 hover:scale-110">
                        <FaChevronRight size={18} />
                    </button>
                </>
            )}
        </div>
    );
};

// Detail Item Component for Modal
const DetailItem = ({ icon: Icon, label, value, iconColorClass = "text-slate-500", isLink = false }) => {
    if (!value) return null;
    return (
        <div className="flex items-start p-5 transition-all duration-300 border rounded-xl group bg-gradient-to-r from-white to-slate-50/50 border-slate-200/50 hover:border-purple-300/50 hover:shadow-lg hover:-translate-y-0.5">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 transition-transform duration-300 border rounded-xl shadow-sm bg-gradient-to-br from-white to-slate-50 border-slate-200/50 group-hover:scale-110">
                <Icon className={iconColorClass} size={20} />
            </div>
            <div className="flex-1 ml-4">
                <p className="text-sm font-semibold tracking-wide text-slate-500">{label.toUpperCase()}</p>
                {isLink ? (
                    <a href={value} target="_blank" rel="noopener noreferrer" className="font-bold text-purple-600 break-all transition-colors duration-200 hover:text-purple-700 hover:underline">
                        {value}
                    </a>
                ) : (
                    <p className="mt-1 text-base font-bold text-slate-800 break-words">{value}</p>
                )}
            </div>
        </div>
    );
};

// The Main Members/Cast Section Component
const MembersSection = ({ membersData, loading }) => {
    const [selectedUser, setSelectedUser] = useState(null);

    const openUserModal = (user) => setSelectedUser(user);
    const closeUserModal = () => setSelectedUser(null);

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

    return (
        <>
            <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                <SectionHeader icon={UsersIcon} title="Meet The Members" subtitle="ทำเนียบน้องแมว" />
                {loading ? (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[...Array(8)].map((_, i) => <MemberCardPlaceholder key={i} />)}
                    </div>
                ) : membersData && membersData.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {membersData.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => openUserModal(user)}
                                className="overflow-hidden text-left transition-all duration-300 bg-white border rounded-2xl shadow-md cursor-pointer group border-slate-100 hover:shadow-xl hover:-translate-y-1"
                            >
                                <div
                                    style={{ backgroundImage: `url(${user.image_url || 'https://placehold.co/400x533/e2e8f0/475569?text=No+Image'})` }}
                                    className="flex flex-col justify-end w-full bg-center bg-cover aspect-[3/4] transition-transform duration-500 group-hover:scale-110"
                                >
                                    <div className="p-4 rounded-b-2xl bg-gradient-to-t from-black/80 to-transparent">
                                        <p className="font-bold text-white truncate text-lg" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>{user.name}</p>
                                        {user.rank && <p className="mt-1 text-sm text-gray-200" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>{user.rank}</p>}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <NoDataPlaceholder message="ไม่พบข้อมูลสมาชิก" />
                )}
            </div>

            {/* Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 duration-300 animate-in fade-in">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeUserModal}></div>
                    <div className="relative flex flex-col w-full max-w-5xl overflow-y-auto bg-white border rounded-3xl shadow-2xl md:flex-row max-h-[90vh] border-slate-200 duration-300 animate-in zoom-in-95">
                        <button onClick={closeUserModal} className="absolute z-20 flex items-center justify-center w-10 h-10 transition-all duration-300 bg-white/80 border rounded-full shadow-lg backdrop-blur-sm top-4 right-4 text-slate-600 border-slate-200/50 hover:text-slate-900 hover:scale-110 hover:rotate-90">
                            <FaTimes size={16} />
                        </button>
                        <div className="relative flex-shrink-0 w-full bg-slate-100 md:w-2/5 rounded-t-3xl md:rounded-tr-none md:rounded-l-3xl">
                            <ImageCarousel images={selectedUser.image_urls || [selectedUser.image_url]} />
                            <div className={`absolute top-6 left-6 px-5 py-2.5 text-sm font-black text-white rounded-full shadow-2xl bg-gradient-to-r ${getRankGradient(selectedUser.rank)} border border-white/30 backdrop-blur-sm`}>
                                {selectedUser.rank}
                            </div>
                        </div>
                        <div className="flex-1 p-8 md:p-10">
                            <h2 className="text-4xl font-black leading-tight text-slate-800 sm:text-5xl">{selectedUser.name}</h2>
                            {selectedUser.type && <p className="mt-2 text-xl font-bold text-slate-500">{selectedUser.type}</p>}

                            {selectedUser.message_to_humans && (
                                <blockquote className="p-6 mt-8 mb-8 shadow-inner bg-slate-50 border-l-4 border-purple-400 rounded-r-2xl">
                                    <p className="text-lg italic font-semibold leading-relaxed text-purple-800">"{selectedUser.message_to_humans}"</p>
                                </blockquote>
                            )}

                            <div className="space-y-6">
                               <h3 className="pb-2 text-xl font-black border-b text-slate-700">ข้อมูลส่วนตัว</h3>
                               <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                                    <h3 className="pb-2 mb-6 text-xl font-black border-b text-slate-700">ช่องทางติดตาม</h3>
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
        </>
    );
};


// --- Main Page Component ---
const IdolRedesigned = () => {
  const [newsData, setNewsData] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [socialData, setSocialData] = useState([]);
  const [bannerData, setBannerData] = useState(null);
  const [featuredIdolData, setFeaturedIdolData] = useState(null);
  const [membersData, setMembersData] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [
            newsResponse, scheduleResponse, socialResponse, 
            bannerResponse, featuredResponse, membersResponse
        ] = await Promise.all([
          supabase.from('news').select('*').order('created_at', { ascending: false }).limit(3),
          supabase.from('schedule_idol').select('*').order('created_at', { ascending: false }).limit(4),
          supabase.from('social_posts_idol').select('*').order('created_at', { ascending: false }).limit(2),
          supabase.from('banners_idol').select('*').order('created_at', { ascending: false }).limit(1),
          supabase.from('featured_idol').select('*').order('created_at', { ascending: false }).limit(1),
          
          // ✅ [FINAL VERSION] Filters for idols only from the 'casts' table.
          supabase
            .from('casts')
            .select('*')
            .eq('rank', 'idol') // <-- แก้ไขจาก 'Idol' เป็น 'idol' (ตัวพิมพ์เล็ก)
            .order('name', { ascending: true })
        ]);

        if (newsResponse.error) throw newsResponse.error;
        if (scheduleResponse.error) throw scheduleResponse.error;
        if (socialResponse.error) throw socialResponse.error;
        if (bannerResponse.error) throw bannerResponse.error;
        if (featuredResponse.error) throw featuredResponse.error;
        if (membersResponse.error) throw membersResponse.error;

        setNewsData(newsResponse.data);
        setScheduleData(scheduleResponse.data);
        setSocialData(socialResponse.data);
        setBannerData(bannerResponse.data ? bannerResponse.data[0] : null);
        setFeaturedIdolData(featuredResponse.data ? featuredResponse.data[0] : null);
        setMembersData(membersResponse.data);

      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {loading ? <BannerPlaceholder /> : <HeroBanner data={bannerData} />}

      <main>
        {/* --- Featured Idol Section (Promoted) --- */}
        <section className="py-20 bg-white md:py-28">
          <div className="container px-4 mx-auto sm:px-6 lg:px-8">
            {loading ? (
              <FeaturedIdolPlaceholder />
            ) : featuredIdolData ? (
              <FeaturedIdolCard {...featuredIdolData} />
            ) : (
              <NoDataPlaceholder message="ไม่พบข้อมูล Featured Idol" />
            )}
          </div>
        </section>
        
        {/* --- News & Schedule Section --- */}
        <section className="py-20 md:py-28">
            <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <SectionHeader icon={NewspaperIcon} title="Latest News" subtitle="อัปเดตข่าวสารล่าสุด" />
                        {loading ? (
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                {[...Array(2)].map((_, i) => <NewsCardPlaceholder key={i} />)}
                            </div>
                        ) : newsData && newsData.length > 0 ? (
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                {newsData.map((item) => <NewsCard key={item.id} {...item} />)}
                            </div>
                        ) : (
                            <NoDataPlaceholder message="ยังไม่มีข่าวสารอัปเดต" />
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <SectionHeader icon={CalendarDaysIcon} title="Upcoming Schedule" />
                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(4)].map((_, i) => <ScheduleItemPlaceholder key={i} />)}
                            </div>
                        ) : scheduleData && scheduleData.length > 0 ? (
                            <div className="space-y-4">
                                {scheduleData.map((item) => <ScheduleItem key={item.id} {...item} />)}
                            </div>
                        ) : (
                            <NoDataPlaceholder message="ยังไม่มีตารางงาน" />
                        )}
                    </div>
                </div>
            </div>
        </section>

        {/* --- ✅ [MODIFIED] Members Section is now replaced with the new design --- */}
        <section className="py-20 bg-white md:py-28">
            <MembersSection membersData={membersData} loading={loading} />
        </section>

        {/* --- Social & Media Section --- */}
        <section className="py-20 md:py-28">
            <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
                    <div>
                        <SectionHeader icon={ChatBubbleLeftRightIcon} title="Social Timeline" />
                        {loading ? (
                            <div className="space-y-6">
                                <NoDataPlaceholder message="กำลังโหลด..." />
                            </div>
                        ) : socialData && socialData.length > 0 ? (
                            <div className="space-y-6">
                                {socialData.map((item) => (
                                    <SocialCard key={item.id} {...item} />
                                ))}
                            </div>
                        ) : (
                            <NoDataPlaceholder message="ยังไม่มีโพสต์บนโซเชียลไทม์ไลน์" />
                        )}
                    </div>
                    <div>
                        <SectionHeader icon={PlayCircleIcon} title="Official MV" />
                        <div className="overflow-hidden shadow-xl rounded-xl aspect-video shadow-slate-900/10">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/saM-pVoGq_s"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen>
                            </iframe>
                        </div>
                    </div>
                </div>
            </div>
        </section>

      </main>
    </div>
  )
}

export default IdolRedesigned;