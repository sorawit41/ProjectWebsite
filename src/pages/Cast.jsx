import React, { useState, useEffect } from 'react';
// นำเข้า FaCat สำหรับกรณีไม่มีผลลัพธ์
import { FaCat, FaTimes } from 'react-icons/fa';
// ไอคอนสำหรับ Modal ยังคงอยู่
import { FaMapMarkerAlt, FaDumbbell, FaUtensils, FaHeart, FaPalette, FaSmile } from 'react-icons/fa';

import narin from "../assets/cast/image.png";
import icezu from "../assets/cast/image copy.png";
import unknow from "../assets/cast/logo.png";

const initialCast = [
    // ... (Your full cast data here) ...
    // Rank: Angel
    { id: 4, image: unknow, name: "Momo", rank: "Angel", type: "แมวอวกาศ", birthPlace: "หลุมดำ!! Ton18", strength: "แมวว๊ากแฝดน้อง", favoriteFood: "ช็อกโกแลต มาชเมลโล เนื้อ ", loveThing: "รักของกิน รักMoney รักนุดนะ", hobby: "กินๆนอนๆเล่นเกม ดูหนัง ดูเมะ อ่านการตูน", favoriteColor: "ชมพู", messageToHumans: "ไปเที่ยวหลุมดำด้วยกันมั๊ยยย" },
    { id: 6, image: unknow, name: "Mei", rank: "Angel", type: "สามสี", birthPlace: "เกิดที่ไหนไม่รู้ แต่เกิดในรัชกาลที่๙", strength: "ใบไม้บนหัว", favoriteFood: "ข้าวคลุกปลาทู", loveThing: "ตบTekken8", hobby: "หายใจ/Breathe", favoriteColor: "Blue/ฟ้า", messageToHumans: "I luv u ,but i hate u ,But i luv cat more than u." },
    { id: 7, image: unknow, name: "Cin", rank: "Angel", type: "British Shorthair", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" }, // Added type for example
    { id: 8, image: unknow, name: "Azuki", rank: "Angel", birthPlace: "ถ้าอยากรู้โอนมา!!!", type: "ความลับ!", strength: "ชอบทำหน้าซึม แจ่ชีวิตปกติดี ทำหน้าง่วงแต่นอนมา10ชม แล้ว", favoriteFood: "แซลม่อนสด ปลาโอสด ส้มตำ อาหารทะเล เมณูจำนวกเส้นเพราะเราเป็นเด็กเส้น", loveThing: "งานแต่ไม่ต้องทำงานแต่ได้เงินมหาศาล เวลาว่าง วันหยุด", hobby: "กินของอร่อยๆ หลับแบบแซ่บๆนอนดูNetflix เล่นSocial ใส่ใจเรื่องชาวบ้าน", favoriteColor: "สีแดง", messageToHumans: "เงินซื้อฉันไม่ได้ แต่ของกินไม่แน่" },
    { id: 9, image: unknow, name: "Fukada", rank: "Angel", birthPlace: "ดวงจันทร์", type: "ครึ่งแมวครึ่งผี", strength: "หน้าเปลี่ยนืุก3เดือน", favoriteFood: "ส้มตำ", loveThing: "you", hobby: "miss you", favoriteColor: "ม่วง,ดำ", messageToHumans: "อย่าเหยียบหางข้อย เป็นแมวขี้ตกใจ" },
    { id: 10, image: narin, name: "Narin", rank: "Angel", type: "Persian", birthPlace: "สวนเชอร์รี่ในดินแดนSweetie", strength: "ง่วง", favoriteFood: "ของอร่อย", loveThing: "สีชมพู ชินนาท่อน ฮวาเฉิง Liz lisa", hobby: "บ่น สาววายสมองไหล", favoriteColor: "ชมพู ม่วง", messageToHumans: "รักนะ เลี้ยงไอติมหน่อยจิ ISFP" },
    // Rank: Litter Angel
    { id: 11, image: unknow, name: "Tsuki", rank: "Litter Angel", type: "Ragdoll", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" }, // Added type
    { id: 12, image: unknow, name: "Cream", rank: "Litter Angel", birthPlace: "ฟาร์ม.. คาปิร่า", type: "ไทย", strength: "คาปิปาร่า", favoriteFood: "เหล้า เบียร์", loveThing: "คาปิปาร่า โดเรม่อน", hobby: "ดูบอล", favoriteColor: "แดง ฟ้า", messageToHumans: " ...." },
    { id: 13, image: unknow, name: "Cornine", rank: "Litter Angel", type: "Scottish Fold", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" }, // Added type
    { id: 14, image: unknow, name: "Fuwarun", rank: "Litter Angel", birthPlace: "มาดากัสก้า โตมาด้วย ความเลี้ยงดูของฝูงลีเมอร์", type: "แมวเมอร์", strength: "เข็มกลัดน้องเชษฐ์ที่โบว์กลางอก!!", favoriteFood: "ท้องปลาแซลม่อน ย่างแซ่บๆ แอลกฮอลล์ทุกชนิด", loveThing: "น้องเชษฐ์", hobby: "นอน", favoriteColor: "สีม่วง", messageToHumans: "ผุรักทุกคนมากนะ!แต่รักน้องเชษฐ์มากกว่า" },
    { id: 15, image: unknow, name: "Hamo", rank: "Litter Angel", type: "Sphynx", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" }, // Added type
    { id: 17, image: unknow, name: "Ivy", rank: "Litter Angel", birthPlace: "เกิดจากความผันที่แสนสุขของนุ้ด เพราะเทื่อไหร่ที่คุณยิ้มมีความสุขในวันนั้น หนูจะปรกกฎกายขึ้นมาเพื่อให้รอยยิ้มคุณของคุณอยู่ตลอดไป", type: "Persian NekoMata", strength: "แมวขี้เล่นพูดเยอะ ติดคนมาก", favoriteFood: "ของหวาน ขนมทุกอย่าง อะไรก็ได้ที่กินกับนุ้ดได้", loveThing: "Hamster น้อนนนนน การมีเวลาเล่นเกม", hobby: "เล่นเกม!! กิน Vtuber", favoriteColor: "ชมพู ดำ ม่วง", messageToHumans: "ว๊ะฮะฮ่า!!!โดนหลอกแล้วจริงๆไอวี่เป็นแมวเบียวจะมากัดกินความผันของพวกคุณตั้งหากล่ะ! เจอแน่ เด็กแสบดื้อซนคนนี้ เอ้ย!ตัวนี้มาแล้ว เจอแน่ หึๆๆๆ เราเองความสุ่นวายในชีวิตคุณ" },
    { id: 18, image: unknow, name: "Kokoa", rank: "Litter Angel", birthPlace: "บ้านขนมแสนหวาน ที่มีคุณยายใจดีเก็บมาเลี้ยง สวนกุหลาบหลังบ้านเป็นสวนสนุป ทุกอย่าง!", type: "Japanese bobtail", strength: "ความแบ๊ว", favoriteFood: "ของเผ็ดๆ เพราะว่าเป็นคนแซ่บๆ อาหารญี่ปุ่น อาหารไทย อาหารอร่อย ขนมหวาน", loveThing: "เงิน<3 ความวิบวับ สีชมพูทุกสิ่งบนโลก", hobby: "วิ่งเล่น นอน ดูเมะ ฟังเพลง", favoriteColor: "สีชมพู", messageToHumans: "เอ็นดูเลาหน่อย อยากกินเชกิ 10ล้านใบ" },
    { id: 19, image: unknow, name: "Miyuki", rank: "Litter Angel", birthPlace: "เกิดจากดอกกุหลาบาีฟ้าในดินแดน", type: "Ragdoll", strength: "คุยไม่เก่งแต่ถ้าคุณเรื่องเกมที่ชอบจะพูดมากทันที", favoriteFood: "กุ้งเทมปุระ ช็อคโกแลต", loveThing: "มนุษย์", hobby: "เล่นเกม นอน", favoriteColor: "สีม่วง", messageToHumans: "Meoww" },
    { id: 20, image: unknow, name: "Mio", rank: "Litter Angel", type: "เมนคูน", birthPlace: "กำเนิดจากป่ามนป่าต้องห้ามที่ว่ากันกันว่าใครที่เข้าไปแล้วจะไม่ได้กลับออกมา .. ", strength: "หัวทอง ตัวเล็ก หาวเก่ง", favoriteFood: "ชานม!ชานม!", loveThing: "ชานม!หมูกะทะ!", hobby: "นอน/เล่นเกม!ทำงาน", favoriteColor: "แดง,ชมพู", messageToHumans: "สวัสดี/เจ้ามนุษย์ ขี้เกียจเปลี่ยนสีปากกาแล้ว เอาเปลี่ยนสีปากกาแล้ว เอาเป็นว่ามารู้จักกันดีกว่า แมวตัวนี้เลี้ยงง่ายแต่ดื้อมาก มาดุน้องแมวหน่อยมา! มามะ!,มาลูกหัวแมวหน่อยแต่กัดนะ!แฮ่ๆ" },
    { id: 21, image: unknow, name: "Momoka", rank: "Litter Angel", type: "American Shorthair", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" }, // Added type
    { id: 22, image: unknow, name: "Moolek", rank: "Litter Angel", type: "แมวเล้า", birthPlace: "ไม่รู้เกืดที่ไหน แม่บอกเจอที่ ถังเบียร์", strength: "แมวสีเหลืองใส่แว่น", favoriteFood: "Alcohal ทุกชิดให้สมกับการเป็นแมวเล้า & ของกินที่ไม่อ้วนเพราะเก็บแคลไปกินแอล 555+", loveThing: "รักทุกคนที่รักหมูเล็ก,ใจดีกับหมูเล็ก รักที่าุดเลยนะคะคนดีของฉัน", hobby: "ชอบเต้น ร้องเพลง ตลอดเวลา มาสั่งLive ให้หมูเล็กที่ดื้อ", favoriteColor: "อย่างสีเหลือง", messageToHumans: "สวัสดีจ้าหมูเล็ก(Moolek) นะคะเป็นแมวExtrovert พูดมากชอบเลอคน หมูเล็กพร้อมคุยกับทุกคนเลยนะคะ ขี้เหล้า ไม่มีคนกินALเบิมเพี้นเรียกได้เลยพร้อมตั้งวง555+ ถ้าคุณรักหมูเล็กนี้หมูเล็กจะรักคุณกับ100เท่า รักนะ" },
    { id: 23, image: unknow, name: "Risa", rank: "Litter Angel", birthPlace: "ที่ไหนไม่รู้ แต่อยู่ในลังส้มข้าวบ้านนุ้ด ริบหนูไปเลี้ยงหน่อยน้าา", type: "วิเชียรมาศ", strength: "แมวตาลำไย", favoriteFood: "ชาไทย ยูสุโซดา", loveThing: "ที่นอนกับผ้าห่มนุ่มๆของหวาน นุ้ดยังไงละ", hobby: "กินของอร่อย นอน ", favoriteColor: "สีแดง สีของพระเอกยังไงละ", messageToHumans: "นุ้ดจะกลับบ้านแล้วเบ๋อ อย่าเพิ่งกลับจิ แวะข้างบ้านก่อนจิ" },
    { id: 24, image: unknow, name: "Yuna", rank: "Litter Angel", type: "แมวขี้โม้", birthPlace: "เกิดจากนรก แมวเฝ้านรก 3 หัว", strength: "ชอบขำสุขๆ", favoriteFood: "ทาโกะวาซาบิ ถั่วแระ", loveThing: "เตียง! ปอมปอมปุริน", hobby: "ร้องเพลง,นอน,นอน", favoriteColor: "สีดำ", messageToHumans: "ผมยูนะ,มะตะแล้วแต่เรียกไม่เรียกก็แล้วแต่" },
    // Rank: Fairy
    { id: 25, image: unknow, name: "Hitomi", rank: "Fairy", birthPlace: "แมวต่างโลก อิเซไก BlackNeko แบบไม่รู็ตัว!?", type: "! ! !", strength: "แมวฟันห่าง", favoriteFood: "นทสตอเบอรี่ พุตดิ้ง", loveThing: "Idol", hobby: "โอตาดตะ", favoriteColor: "", messageToHumans: "หิวเหล้า หิว หิว " },
    { id: 26, image: unknow, name: "Maywa", rank: "Fairy", type: "Bengal", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" }, // Added type
    { id: 27, image: unknow, name: "Kurimi", rank: "Fairy", type: "Maine Coon", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" }, // Added type
    { id: 28, image: unknow, name: "Itsumi", rank: "Fairy", type: "Siamese", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" }, // Added type
    { id: 29, image: unknow, name: "Ayse", rank: "Fairy", type: "Birman", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" }, // Added type
    { id: 30, image: unknow, name: "Reka", rank: "Fairy", type: "Abyssinian", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" }, // Added type
    // Rank: Trainee
    { id: 31, image: unknow, name: "Yumeko", rank: "Trainee", type: "Oriental Shorthair", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" }, // Added type
    { id: 32, image: unknow, name: "Shiori", rank: "Trainee", type: "Manx", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" }, // Added type
    { id: 33, image: unknow, name: "Tsubaki", rank: "Trainee", type: "Devon Rex", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" }, // Added type
    { id: 34, image: unknow, name: "Sora", rank: "Trainee", type: "Russian Blue", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" }, // Added type
    { id: 35, image: unknow, name: "Erika", rank: "Trainee", type: "Siberian", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" }, // Added type
    { id: 36, image: unknow, name: "Layra", rank: "Trainee", type: "Tonkinese", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" }, // Added type
    { id: 37, image: unknow, name: "Nene", rank: "Trainee", type: "Burmese", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" }, // Added type
    { id: 38, image: unknow, name: "Saya", rank: "Trainee", type: "Chartreux", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" }, // Added type
    { id: 39, image: unknow, name: "Sylvie", rank: "Trainee", type: "Exotic Shorthair", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" }, // Added type
];

const Cast = () => {
    const [filteredCast, setFilteredCast] = useState([]);
    const [sortBy, setSortBy] = useState('id-asc');

    const [fadeIn, setFadeIn] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        let newFilteredData = [...initialCast];

        switch (sortBy) {
            case 'name-asc':
                newFilteredData.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                newFilteredData.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'rank-asc':
                // คำเตือนนี้ยังคงอยู่หากคุณไม่ได้แก้ไขการเรียงตาม Rank ให้สมบูรณ์
                console.warn("Sorting by rank is not fully supported without allRanks definition in a filter-less component.");
                break;
            case 'id-asc':
            default:
                newFilteredData.sort((a, b) => a.id - b.id);
                break;
        }
        setFilteredCast(newFilteredData);
    }, [sortBy]);

    useEffect(() => {
        setFadeIn(false);
        const timer = setTimeout(() => {
            setFadeIn(true);
        }, 100);
        return () => clearTimeout(timer);
    }, [filteredCast]);

    const openUserModal = (user) => setSelectedUser(user);
    const closeUserModal = () => setSelectedUser(null);

    const DetailItem = ({ icon: Icon, label, value, iconColorClass = "text-pink-500" }) => {
        if (!value) return null;
        return (
            // ขอบด้านล่างของ DetailItem ยังคงอยู่ เพื่อแยกแต่ละบรรทัดข้อมูล
            <div className="flex items-start py-2.5 border-b border-gray-200 dark:border-zinc-700/50 last:border-b-0">
                <span className={`w-7 pt-1 ${iconColorClass} dark:opacity-80`}><Icon size={18}/></span>
                <span className="text-gray-500 dark:text-gray-400 w-32 shrink-0 font-medium">{label}:</span>
                <span className="text-gray-700 dark:text-gray-200 flex-1">{value}</span>
            </div>
        );
    };

    return (
        // เปลี่ยน bg-white และ min-h-screen เป็น bg-transparent เพื่อให้โปร่งใส
        <div className="py-16 pt-20 md:pt-24 bg-transparent min-h-screen text-gray-900 transition-colors duration-500">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 pb-2">
                        เหล่าน้องแมว
                    </h1>
                
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* --- Main Content Area (Cast Grid) --- */}
                    <main className="w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Showing {filteredCast.length} of {initialCast.length} cast members
                            </p>
                            <div className="flex items-center space-x-2">
                                <label htmlFor="sort-by" className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
                                <select
                                    id="sort-by"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="form-select block w-auto pl-3 pr-8 py-2 text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-200 dark:focus:ring-offset-zinc-900 shadow-sm"
                                >
                                    <option value="id-asc">Default</option>
                                    <option value="name-asc">Name: A-Z</option>
                                    <option value="name-desc">Name: Z-A</option>
                                    {/* ตัวเลือก "Rank Order" อาจไม่ทำงานสมบูรณ์หากไม่มีการนำเข้า allRanks */}
                                    {/* <option value="rank-asc">Rank Order</option> */}
                                </select>
                            </div>
                        </div>

                        {/* เปลี่ยนตรงนี้: เพิ่ม md:grid-cols-3 และ lg:grid-cols-4 */}
                        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 transition-opacity duration-700 ease-out ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
                            {filteredCast.length > 0 ? (
                                filteredCast.map((user, index) => (
                                    <div
                                        key={user.id}
                                        onClick={() => openUserModal(user)}
                                        title={`View details for ${user.name}`}
                                        // ลบคลาส 'border' ออกจากตรงนี้
                                        className="group cursor-pointer bg-white dark:bg-zinc-800/80 rounded-2xl shadow-lg hover:shadow-xl dark:hover:shadow-[0_10px_15px_-3px_rgba(255,255,255,0.02),0_4px_6px_-4px_rgba(255,255,255,0.02)] overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                                        style={{
                                            opacity: fadeIn ? 1 : 0,
                                            transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
                                            transitionDelay: `${fadeIn ? (index % 15) * 0.04 : 0}s`,
                                            transitionProperty: 'opacity, transform',
                                            transitionDuration: '0.5s, 0.3s',
                                        }}
                                    >
                                        <div className="relative w-full h-72 overflow-hidden">
                                            <img
                                                src={user.image}
                                                alt={user.name}
                                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-400 ease-in-out"
                                            />
                                            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm shadow">
                                                {user.rank}
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1 truncate group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                                                {user.name}
                                            </h3>
                                            {user.type && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.type}</p>}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-16 text-xl flex flex-col items-center justify-center">
                                    <FaCat size={60} className="mb-4 text-gray-400 dark:text-zinc-600"/>
                                    <p className="font-semibold text-2xl mb-2 text-gray-600 dark:text-gray-300">No cast members found</p>
                                    <p>Please check the cast data.</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>

                {/* Modal */}
                {selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
                        <div
                            // ลบคลาส 'border' ออกจาก Modal ด้วย
                            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-2xl w-full mx-auto p-6 md:p-8 relative max-h-[90vh] overflow-y-auto transform scale-95 animate-scale-in"
                        >
                            <button
                                onClick={closeUserModal}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-white transition duration-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
                            >
                                <FaTimes size={22} />
                            </button>
                            <div className="flex flex-col items-center space-y-5">
                                <img
                                    src={selectedUser.image}
                                    alt={selectedUser.name}
                                    // ลบคลาส 'border' ที่รูปโปรไฟล์ใน Modal ด้วย
                                    className="w-36 h-36 md:w-40 md:h-40 object-cover rounded-full shadow-xl"
                                />
                                <div className="text-center">
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{selectedUser.name}</h2>
                                    <p className="text-lg text-pink-500 dark:text-pink-400 font-semibold mt-1">Rank: {selectedUser.rank}</p>
                                    {selectedUser.type && <p className="text-md text-gray-500 dark:text-gray-400 mt-0.5">Type: {selectedUser.type}</p>}
                                </div>

                                <div className="w-full mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700/50 text-base text-gray-700 dark:text-gray-300 space-y-1.5">
                                    <DetailItem icon={FaMapMarkerAlt} label="Birth Place" value={selectedUser.birthPlace} iconColorClass="text-red-500" />
                                    <DetailItem icon={FaDumbbell} label="Strength" value={selectedUser.strength} iconColorClass="text-blue-500" />
                                    <DetailItem icon={FaUtensils} label="Favorite Food" value={selectedUser.favoriteFood} iconColorClass="text-orange-500" />
                                    <DetailItem icon={FaHeart} label="Loves" value={selectedUser.loveThing} iconColorClass="text-rose-500" />
                                    <DetailItem icon={FaSmile} label="Hobby" value={selectedUser.hobby} iconColorClass="text-yellow-500" />
                                    <DetailItem icon={FaPalette} label="Favorite Color" value={selectedUser.favoriteColor} iconColorClass="text-purple-500" />
                                </div>

                                {selectedUser.messageToHumans && (
                                    // ลบคลาส 'border' ที่ข้อความด้วย
                                    <p className="w-full italic mt-5 text-center bg-gradient-to-r from-pink-500/10 to-purple-500/10 dark:from-pink-500/5 dark:to-purple-500/5 p-4 rounded-lg text-gray-800 dark:text-gray-200 shadow-inner">
                                        <span className="text-2xl leading-none mr-1 text-pink-500/70 dark:text-pink-400/70">“</span>
                                        {selectedUser.messageToHumans}
                                        <span className="text-2xl leading-none ml-1 text-pink-500/70 dark:text-pink-400/70">”</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cast;