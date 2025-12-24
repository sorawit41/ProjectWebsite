import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaFacebook, FaInstagram, FaTiktok, 
  FaShareAlt, FaCheckCircle, FaTwitter, 
  FaBirthdayCake, FaCat, FaHeart, FaGhost, FaGamepad, FaStar
} from 'react-icons/fa';

// Import รูปภาพ (ใช้ Path เดิมของคุณ)
import imgGroup from '../assets/bio/550663429_122095568031044109_8129429943246798574_n.jpg';
import imgMoolek from '../assets/bio/IMG_4905.jpg';
import imgAyumi from '../assets/bio/IMG_4907.jpg';
import imgPoka from '../assets/bio/IMG_4906.jpg';
import imgMarin from '../assets/bio/IMG_4909.jpg';
import imgRosalyn from '../assets/bio/IMG_4910.jpg';
import imgRei from '../assets/bio/IMG_4904.jpg'; 
import imgYuki from '../assets/bio/IMG_4908.jpg';

const PLACEHOLDER_IMG = "../assets/bio/550663429_122095568031044109_8129429943246798574_n.jpg";

const Bio = () => {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);

  // --- ข้อมูลร้านค้าหลัก ---
  const shopProfile = {
    id: 'idol', 
    name: "NekoWink",
    handle: "@nekowink.idol",
    bio: `สวัสดีค่า พวกเรา “NekoWink” ✨\nวงไอดอลน้องใหม่จาก Blackneko Idol and Bar MBK ชั้น 7 🎶\n\nฝากติดตามผลงานและความน่ารักของพวกเราทั้ง 7 คนด้วยนะคะ 💖\n#NekoWink #Blackneko #IdolThai`,
    image: imgGroup, 
    verified: true,
    color: "bg-gray-100 text-gray-800",
    themeColor: "gray", 
    links: [
      { id: 1, title: "Facebook", url: "https://www.facebook.com/share/1ALLeVbz8P/?mibextid=wwXIfr", icon: <FaFacebook />, type: "fb" },
      { id: 2, title: "Instagram", url: "https://www.instagram.com/nekowink.idol?igsh=MTNrYWwwMmFyeno4bw==", icon: <FaInstagram />, type: "ig" },
      { id: 3, title: "TikTok", url: "https://www.tiktok.com/@nekowinkidol?_r=1&_t=ZS-92RwpF0K6NT", icon: <FaTiktok />, type: "tt" },
    ]
  };

  // --- ข้อมูลสมาชิก ---
  const membersData = [
    {
      slug: 'rosalyn',
      name: "Rosalyn", 
      fullName: "Rosalyn / โรสลิน",
      handle: "Main Vocal",
      bio: "ดีใจที่ได้เจอน้าา ไว้มาเจอกันอีกนะคะ ^^",
      details: {
        "วันเกิด": "14/02 (ราศีกุมภ์)",
        "กรุ๊ปเลือด": "B",
        "คาแรคเตอร์แมว": "Ragdoll",
        "สีประจำตัว": "สีแดง ❤️",
        "สิ่งที่ชอบ": "สัตว์น่ารักๆ, เกม, เพลง",
        "สิ่งที่กลัว": "แมลงต่างๆ, ความสูง",
        "จุดเด่น": "ร้องเพลงญี่ปุ่นได้, เล่นเกม MOBA เก่งมาก",
        "งานอดิเรก": "อ่านหนังสือ, ร้องเพลง, เล่นเกม"
      },
      image: imgRosalyn, 
      verified: false,
      color: "bg-red-50 text-red-600",
      borderColor: "border-red-400",
      links: [
        { title: "Facebook", url: "https://www.facebook.com/share/1DdtXgK6jV/?mibextid=wwXIfr", icon: <FaFacebook />, type: "fb" },
        { title: "Instagram", url: "https://www.instagram.com/rosalyn.blacknekoidol?igsh=a2FjbWJrbHA1d", icon: <FaInstagram />, type: "ig" },
        { title: "TikTok", url: "https://www.tiktok.com/@rosalyn.blacknekoidol?_r=1&_t=ZS-91wS8ku0VaU", icon: <FaTiktok />, type: "tt" },
        { title: "Twitter (X)", url: "https://x.com/rblacknekoidol?s=21&t=YNun4j-Cuq_gS2iGZgFGfg", icon: <FaTwitter />, type: "tw" }
      ]
    },
    {
      slug: 'ayumi',
      name: "Ayumi",
      fullName: "Ayumi / อายูมิ",
      handle: "Main Dance / Rapper",
      bio: "สาหวัดดีค่ะ! ในใจมีหนูอ้ะยังง👀",
      details: {
        "วันเกิด": "13/07 (ราศีมิถุน)",
        "กรุ๊ปเลือด": "B",
        "คาแรคเตอร์แมว": "Minuet",
        "สีประจำตัว": "ม่วง 💜",
        "สิ่งที่ชอบ": "อยม💜, ช็อกโกแลต",
        "สิ่งที่กลัว": "จิ้งจก, ตุ๊กแก",
        "จุดเด่น": "เต้น, ทำตัวปกติให้แปลกได้",
        "งานอดิเรก": "เต้น, พูดกับตัวเอง"
      },
      image: imgAyumi, 
      verified: false,
      color: "bg-purple-50 text-purple-600",
      borderColor: "border-purple-400",
      links: [
        { title: "Facebook", url: "https://www.facebook.com/share/1EvBRFzy6J/?mibextid=wwXIfr", icon: <FaFacebook />, type: "fb" },
        { title: "Instagram", url: "https://www.instagram.com/ayumi.blacknekoidol?igsh=bzBpa2dta2pia281", icon: <FaInstagram />, type: "ig" },
        { title: "TikTok", url: "https://www.tiktok.com/@ayumi.blacknekoidol?_r=1&_t=ZS-91xywktsQwJ", icon: <FaTiktok />, type: "tt" }
      ]
    },
    {
      slug: 'marin',
      name: "Marin",
      fullName: "Marin / มาริน",
      handle: "Dance Position",
      bio: "คุณเก่งมาก สู้ๆนะคับ~",
      details: {
        "วันเกิด": "17/07 (ราศีกรกฏ)",
        "กรุ๊ปเลือด": "O",
        "คาแรคเตอร์แมว": "วิเชียรมาศ",
        "สีประจำตัว": "สีขาว 🤍",
        "สิ่งที่ชอบ": "ของหวาน, สัตว์ขนปุย",
        "สิ่งที่กลัว": "เขียด",
        "จุดเด่น": "วาดรูปได้, พร้อมฮีลใจ 🫵🏻",
        "งานอดิเรก": "วาดรูป, เล่นเกม"
      },
      image: imgMarin, 
      verified: false,
      color: "bg-slate-100 text-slate-600",
      borderColor: "border-gray-400",
      links: [
        { title: "Facebook", url: "https://www.facebook.com/share/1Dkb9EPBqA/?mibextid=wwXIfr", icon: <FaFacebook />, type: "fb" },
        { title: "Instagram", url: "https://www.instagram.com/marin.blacknekoidol?igsh=MTlpcWxzazBvOTdrYg==", icon: <FaInstagram />, type: "ig" },
        { title: "TikTok", url: "https://www.tiktok.com/@marin.blacknekoido?_r=1&_t=ZS-91wPHLnbYEJ", icon: <FaTiktok />, type: "tt" },
        { title: "Twitter (X)", url: "https://x.com/blacknekoi8642?s=21&t=YNun4j-Cuq_gS2iGZgFGfg", icon: <FaTwitter />, type: "tw" }
      ]
    },
    {
      slug: 'moolek',
      name: "Moolek",
      fullName: "Moolek / หมูเล็ก",
      handle: "Leader",
      bio: "ไม่ล้มเหลวถ้าไม่ล้มเลิก ไปกันต่อ!! 🥰",
      details: {
        "วันเกิด": "17/06 (ราศีมิถุน)",
        "กรุ๊ปเลือด": "A",
        "คาแรคเตอร์แมว": "Bombay cat",
        "สีประจำตัว": "สีเหลือง 💛",
        "สิ่งที่ชอบ": "คุณ🫵🥰, Sanrio",
        "สิ่งที่กลัว": "การอยู่คนเดียว, แมลงสาบ",
        "จุดเด่น": "สดใสเหมือนทานตะวัน",
        "งานอดิเรก": "เต้น, ร้องเพลง"
      },
      image: imgMoolek, 
      verified: false,
      color: "bg-yellow-50 text-yellow-600",
      borderColor: "border-yellow-400",
      links: [
        { title: "Facebook", url: "https://www.facebook.com/share/1DmAcXdDbA/?mibextid=wwXIfr", icon: <FaFacebook />, type: "fb" },
        { title: "Instagram", url: "https://www.instagram.com/moolek.blacknekoidol?igsh=OTJ3dm5mejg5eHd4&utm_source=qr", icon: <FaInstagram />, type: "ig" },
        { title: "TikTok", url: "https://www.tiktok.com/@moolek.blacknekoidol?_r=1&_t=ZS-92Rx1PhkeN0", icon: <FaTiktok />, type: "tt" },
        { title: "Twitter (X)", url: "https://x.com/blacknekoi78266?s=21&t=YNun4j-Cuq_gS2iGZgFGfg", icon: <FaTwitter />, type: "tw" }
      ]
    },
    {
      slug: 'poka',
      name: "Poka",
      fullName: "poka / โพก่ะ",
      handle: "All-rounder",
      bio: "รับรอยยิ้มนี้ไปแล้ว ฝากหัวใจไว้ด้วยนะคะ 💙",
      details: {
        "วันเกิด": "04/05 (ราศีเมษ)",
        "กรุ๊ปเลือด": "B",
        "คาแรคเตอร์แมว": "Russian Blue",
        "สีประจำตัว": "สีฟ้า 💙",
        "สิ่งที่ชอบ": "เที่ยวธรรมชาติ, ฟังเพลง",
        "สิ่งที่กลัว": "งู 🐍, แมงมุม 🕷️",
        "จุดเด่น": "ขี้เล่น เฮฮา",
        "งานอดิเรก": "อ่านหนังสือ, เล่นดนตรี"
      },
      image: imgPoka, 
      verified: false,
      color: "bg-cyan-50 text-cyan-600",
      borderColor: "border-cyan-400",
      links: [
        { title: "Facebook", url: "https://www.facebook.com/share/1AEGJ74tPU/?mibextid=wwXIfr", icon: <FaFacebook />, type: "fb" },
        { title: "Instagram", url: "https://www.instagram.com/poka.blacknekoidol?igsh=MXEzZGFoZXN2MmRnZw==", icon: <FaInstagram />, type: "ig" },
        { title: "TikTok", url: "https://www.tiktok.com/@pokablacknekoidol?_r=1&_t=ZS-91wSJUQnckp", icon: <FaTiktok />, type: "tt" },
        { title: "Twitter (X)", url: "https://x.com/pokapyn01?s=21&t=s20P7ngSmzj1LDOJWJFQzQ", icon: <FaTwitter />, type: "tw" }
      ]
    },
    {
      slug: 'rei',
      name: "Rei",
      fullName: "Rei / เรอิ",
      handle: "Main Vocal",
      bio: "วันนี้เติมเรอิรึยางงงง",
      details: {
        "วันเกิด": "27/07 (ราศีกรกฎ)",
        "กรุ๊ปเลือด": "B",
        "คาแรคเตอร์แมว": "Scottish Fold",
        "สีประจำตัว": "สีชมพู 🩷",
        "สิ่งที่ชอบ": "โอชิทุกคน, ซีรีย์วาย",
        "สิ่งที่กลัว": "ผี, งู, แมงมุม",
        "จุดเด่น": "ตลกธรรมชาติ",
        "งานอดิเรก": "เล่นเกม, หาของกิน"
      },
      image: imgRei, 
      verified: false,
      color: "bg-pink-50 text-pink-500",
      borderColor: "border-pink-400",
      links: [
        { title: "Facebook", url: "https://www.facebook.com/share/17Z2VozjRm/?mibextid=wwXIfr", icon: <FaFacebook />, type: "fb" },
        { title: "Instagram", url: "https://www.instagram.com/rei.blacknekoidol?igsh=YXNwM3dpdWw2cX", icon: <FaInstagram />, type: "ig" },
        { title: "TikTok", url: "https://www.tiktok.com/@rei.blacknekoidol?_r=1&_t=ZS-91wRLryweQC", icon: <FaTiktok />, type: "tt" },
        { title: "Twitter (X)", url: "https://x.com/reinekoidol?s=21&t=YNun4j-Cuq_gS2iGZgFGfg", icon: <FaTwitter />, type: "tw" }
      ]
    },
    {
      slug: 'yuki',
      name: "Yuki",
      fullName: "Yuki / ยูกิ",
      handle: "Visual",
      bio: "หวังว่าพวกเราจะมอบความสุขให้กับคุณนะคะ ✨",
      details: {
        "วันเกิด": "20/03 (ราศีมีน)",
        "กรุ๊ปเลือด": "O (INFP)",
        "คาแรคเตอร์แมว": "Chinchilla",
        "สีประจำตัว": "ดำ 🖤",
        "สิ่งที่ชอบ": "แมว, อนิเมะ, ศิลปะ",
        "สิ่งที่กลัว": "แมลงสาบ, ที่แออัด",
        "จุดเด่น": "ไฝและดวงตา",
        "งานอดิเรก": "เล่นเกม, อ่านหนังสือ"
      },
      image: imgYuki, 
      verified: false,
      color: "bg-gray-100 text-gray-800",
      borderColor: "border-gray-600",
      links: [
        { title: "Facebook", url: "https://www.facebook.com/share/17UcCCjEA3/?mibextid=wwXIfr", icon: <FaFacebook />, type: "fb" },
        { title: "Instagram", url: "https://www.instagram.com/yuki.blacknekoidol?igsh=czlyM2ZtcWdleGI=", icon: <FaInstagram />, type: "ig" },
        { title: "TikTok", url: "https://www.tiktok.com/@yuki.blacknekoidol?_r=1&_t=ZS-91wM8hamtmh", icon: <FaTiktok />, type: "tt" },
        { title: "Twitter (X)", url: "https://x.com/yukibalckneko?s=21&t=1KhZnpTqH9BAG5zoOKAHgw", icon: <FaTwitter />, type: "tw" }
      ]
    },
  ];

  // Logic เลือกโปรไฟล์
  let currentProfile = shopProfile;
  if (id) {
    const foundMember = membersData.find(m => m.slug.toLowerCase() === id.toLowerCase());
    if (foundMember) {
        currentProfile = foundMember;
    }
  }

  const getSocialStyle = (type) => {
    const baseStyle = "w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm border border-gray-100 transition-all hover:scale-110 hover:-translate-y-1 text-white ";
    switch(type) {
      case 'fb': return baseStyle + "bg-[#1877F2] border-[#1877F2]";
      case 'ig': return baseStyle + "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] border-transparent";
      case 'tt': return baseStyle + "bg-black border-black";
      case 'tw': return baseStyle + "bg-black border-black"; 
      default: return baseStyle + "bg-gray-700 border-gray-700";
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentProfile.name,
          text: `Check out ${currentProfile.name} on NekoWink!`,
          url: window.location.href,
        });
        return; 
      } catch (err) {
        console.log('User cancelled share');
      }
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("ไม่สามารถคัดลอกลิงก์ได้");
    }
  };

  return (
    <div className={`min-h-screen font-sans flex justify-center bg-white`}>
      <div className="w-full max-w-md pb-20 relative">
        
        {/* --- Header Area --- */}
        <div className="relative h-40 w-full bg-white"> 
           <button 
            onClick={handleShare}
            className="absolute top-6 right-6 z-20 bg-white p-2.5 rounded-full shadow-sm border border-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
          >
            {copied ? <FaCheckCircle className="text-green-500" /> : <FaShareAlt />}
          </button>
        </div>

        {/* --- Profile Card Content --- */}
        <div className="px-6 -mt-24 relative z-10 animate-fade-in-up">
            
            {/* Profile Image */}
            <div className="flex justify-center mb-4">
               <div className="p-1 bg-white rounded-full shadow-md">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white relative">
                     <img 
                        src={currentProfile.image || PLACEHOLDER_IMG} 
                        alt={currentProfile.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                     />
                  </div>
               </div>
            </div>

            {/* Name & Bio */}
            <div className="text-center mb-6">
               <h1 className="text-2xl font-black text-gray-900 mb-1 flex items-center justify-center gap-2">
                  {currentProfile.fullName || currentProfile.name}
                  {currentProfile.verified && <FaCheckCircle className="text-blue-500 text-sm" />}
               </h1>
               <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 ${currentProfile.color}`}>
                  {currentProfile.handle}
               </span>
               <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto italic">
                  "{currentProfile.bio}"
               </p>
            </div>

            {/* --- Social Icons Row --- */}
            <div className="flex justify-center gap-4 mb-8">
               {currentProfile.links.map((link, i) => (
                  <a 
                     key={i} 
                     href={link.url} 
                     target="_blank" 
                     rel="noreferrer"
                     className={getSocialStyle(link.type)}
                  >
                     {link.icon}
                  </a>
               ))}
            </div>

            {/* --- Details Card --- */}
            {currentProfile.details && (
               <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-100/50 border border-gray-100 mb-8 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-1 ${currentProfile.color.split(' ')[0]}`}></div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <FaStar className="text-yellow-400" /> About Me
                  </h3>
                  <div className="space-y-4">
                     {Object.entries(currentProfile.details).map(([key, value]) => (
                        <div key={key} className="flex gap-4 items-start">
                           <div className="min-w-[24px] pt-1 text-gray-400 text-lg">
                              {key === "วันเกิด" && <FaBirthdayCake className="text-pink-400" />}
                              {key === "คาแรคเตอร์แมว" && <FaCat className="text-indigo-400" />}
                              {key === "สิ่งที่ชอบ" && <FaHeart className="text-red-400" />}
                              {key === "สิ่งที่กลัว" && <FaGhost className="text-purple-400" />}
                              {key === "งานอดิเรก" && <FaGamepad className="text-green-400" />}
                              {key === "จุดเด่น" && <FaStar className="text-yellow-400" />}
                              {!["วันเกิด", "คาแรคเตอร์แมว", "สิ่งที่ชอบ", "สิ่งที่กลัว", "งานอดิเรก", "จุดเด่น"].includes(key) && <FaStar className="text-gray-300" />}
                           </div>
                           <div>
                              <p className="text-xs font-bold text-gray-400 uppercase mb-0.5">{key}</p>
                              <p className="text-sm text-gray-700 font-medium leading-relaxed">{value}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* --- Members Grid (ถ้าอยู่หน้าหลัก) --- */}
            {!id && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4 px-2">
                   <h3 className="text-sm font-bold text-gray-800">Members</h3>
                   <span className="text-xs text-gray-400">7 active</span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {membersData.map((member) => (
                    <Link 
                      key={member.slug} 
                      to={`/Bio/${member.slug}`} 
                      className="flex flex-col items-center group"
                    >
                      <div className="w-14 h-14 rounded-full p-0.5 border-2 border-gray-100 group-hover:border-blue-400 transition-all shadow-sm overflow-hidden bg-white">
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-gray-500 mt-2 text-center truncate w-full group-hover:text-blue-600">
                        {member.name.split(' ')[0]} 
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* --- OTHER MEMBERS (Horizontal Scroll) --- */}
            {id && (
              <div className="mt-8 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                 <h3 className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Other Members
                 </h3>
                 <div className="flex overflow-x-auto gap-4 pb-4 px-2 no-scrollbar snap-x">
                    
                    {/* NekoWink Button (Back to Main) - Changed from "Team" */}
                    <Link to="/Bio" className="flex-shrink-0 flex flex-col items-center snap-center group">
                        <div className="w-16 h-16 rounded-full p-1 border-2 border-gray-200 bg-white transition-transform group-hover:scale-105">
                             <img 
                                src={imgGroup} // Using the group image
                                alt="NekoWink" 
                                className="w-full h-full object-cover rounded-full"
                                onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                            />
                        </div>
                        <span className="text-[10px] font-bold text-gray-700 mt-2 group-hover:text-blue-600">
                            NekoWink
                        </span>
                    </Link>

                    {/* Member List (Excluding current) */}
                    {membersData.filter(m => m.slug !== id).map((member) => (
                        <Link 
                            key={member.slug} 
                            to={`/Bio/${member.slug}`}
                            className="flex-shrink-0 flex flex-col items-center snap-center group"
                        >
                            <div className={`w-16 h-16 rounded-full p-1 border-2 bg-white ${member.borderColor || 'border-gray-200'} transition-transform group-hover:scale-105`}>
                                <img 
                                    src={member.image} 
                                    alt={member.name} 
                                    className="w-full h-full object-cover rounded-full" 
                                    onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                                />
                            </div>
                            <span className="text-[10px] font-bold text-gray-700 mt-2 group-hover:text-blue-600">
                                {member.name}
                            </span>
                        </Link>
                    ))}
                 </div>
              </div>
            )}

            {/* Back Button (Text version) */}
            {id && (
              <div className="text-center mt-2 pb-6">
                <Link to="/Bio" className="text-xs font-bold text-gray-300 hover:text-gray-500 transition-colors">
                  View All Members
                </Link>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 text-center border-t border-gray-100 pt-6">
                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">
                    Black Neko Team © 2024
                </p>
            </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default Bio;