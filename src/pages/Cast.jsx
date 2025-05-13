import React, { useState, useEffect } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';

import { FaMapMarkerAlt, FaDumbbell, FaUtensils, FaHeart, FaPalette, FaSmile } from 'react-icons/fa';

import narin from "../assets/cast/image.png";
import icezu from "../assets/cast/image copy.png";
import unknow from "../assets/cast/unknow.png";
const cast = [


// Rank: Angel
  { id: 4, image: unknow, name: "Momo", rank: "Angel", type: "แมวอวกาศ",birthPlace: "หลุมดำ!! Ton18", strength: "แมวว๊ากแฝดน้อง", favoriteFood: "ช็อกโกแลต มาชเมลโล เนื้อ ", loveThing: "รักของกิน รักMoney รักนุดนะ", hobby: "กินๆนอนๆเล่นเกม ดูหนัง ดูเมะ อ่านการตูน", favoriteColor: "ชมพู", messageToHumans: "ไปเที่ยวหลุมดำด้วยกันมั๊ยยย" },
  { id: 6, image: unknow, name: "Mei", rank: "Angel", type: "สามสี", birthPlace: "เกิดที่ไหนไม่รู้ แต่เกิดในรัชกาลที่๙", strength: "ใบไม้บนหัว", favoriteFood: "ข้าวคลุกปลาทู", loveThing: "ตบTekken8", hobby: "หายใจ/Breathe", favoriteColor: "Blue/ฟ้า", messageToHumans: "I luv u ,but i hate u ,But i luv cat more than u." },
  { id: 7, image: unknow, name: "Cin", rank: "Angel", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" },
  { id: 8, image: unknow, name: "Azuki", rank: "Angel", birthPlace: "ถ้าอยากรู้โอนมา!!!",type:"ความลับ!", strength: "ชอบทำหน้าซึม แจ่ชีวิตปกติดี ทำหน้าง่วงแต่นอนมา10ชม แล้ว", favoriteFood: "แซลม่อนสด ปลาโอสด ส้มตำ อาหารทะเล เมณูจำนวกเส้นเพราะเราเป็นเด็กเส้น", loveThing: "งานแต่ไม่ต้องทำงานแต่ได้เงินมหาศาล เวลาว่าง วันหยุด", hobby: "กินของอร่อยๆ หลับแบบแซ่บๆนอนดูNetflix เล่นSocial ใส่ใจเรื่องชาวบ้าน", favoriteColor: "สีแดง", messageToHumans: "เงินซื้อฉันไม่ได้ แต่ของกินไม่แน่" },
  { id: 9, image: unknow, name: "Fukada", rank: "Angel", birthPlace: "ดวงจันทร์",type:"ครึ่งแมวครึ่งผี", strength: "หน้าเปลี่ยนืุก3เดือน", favoriteFood: "ส้มตำ", loveThing: "you", hobby: "miss you", favoriteColor: "ม่วง,ดำ", messageToHumans: "อย่าเหยียบหางข้อย เป็นแมวขี้ตกใจ" },
  { id: 10, image: narin, name: "Narin", rank: "Angel",type: "Persian", birthPlace: "สวนเชอร์รี่ในดินแดนSweetie", strength: "ง่วง", favoriteFood: "ของอร่อย", loveThing: "สีชมพู ชินนาท่อน ฮวาเฉิง Liz lisa", hobby: "บ่น สาววายสมองไหล", favoriteColor: "ชมพู ม่วง", messageToHumans: "รักนะ เลี้ยงไอติมหน่อยจิ ISFP" },
// Rank: Litter Angel
  { id: 11, image: unknow, name: "Tsuki", rank: "Litter Angel", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" },
  { id: 12, image: unknow, name: "Cream", rank: "Litter Angel", birthPlace: "ฟาร์ม.. คาปิร่า",type:"ไทย", strength: "คาปิปาร่า", favoriteFood: "เหล้า เบียร์", loveThing: "คาปิปาร่า โดเรม่อน", hobby: "ดูบอล", favoriteColor: "แดง ฟ้า", messageToHumans: " .... " },
  { id: 13, image: unknow, name: "Cornine", rank: "Litter Angel", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" },
  { id: 14, image: unknow, name: "Fuwarun", rank: "Litter Angel", birthPlace: "มาดากัสก้า โตมาด้วย ความเลี้ยงดูของฝูงลีเมอร์",type:"แมวเมอร์", strength: "เข็มกลัดน้องเชษฐ์ที่โบว์กลางอก!!", favoriteFood: "ท้องปลาแซลม่อน ย่างแซ่บๆ แอลกฮอลล์ทุกชนิด", loveThing: "น้องเชษฐ์", hobby: "นอน", favoriteColor: "สีม่วง", messageToHumans: "ผุรักทุกคนมากนะ!แต่รักน้องเชษฐ์มากกว่า" },
  { id: 15, image: unknow, name: "Hamo", rank: "Litter Angel", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" },
  { id: 16, image: icezu, name: "Icezu", rank: "Litter Angel", birthPlace: "ไอซืถูกอันเชิญมาจากดินแดนอันแสนไกลเป็นเผ่าเอลผ์ที่สามารถใช้เวทย์มนตร์แปลงร่างได้เป็นราชาแมวได้มอบหมายภารกิตให้มาเป็นตัวแทนในการคลุกคลีกับประชาแมว จึงได้แปลงร่างและเข้ามาเป็นspyในอาณาจักรBlackNeko",type:"วืเชียรมาศ", strength: "เป็นเอลฟ์แฝงตัวในมวลประชาแมว", favoriteFood: "เกี๊ยวน้ำ เกี๊ยวซ่า ซุปเห็ด Omakase-Drinks Ice Cream", loveThing: "เงิน!!! กลิ่นเงินมันช่างหอมหวาน", hobby: "ร้องเพลง อนิซอง แปลไทย ดูอนิเมะ", favoriteColor: "แดง ม่วง พาสเทล โฮโลแกรม", messageToHumans: "Come! and Give me the money! Love You" },
  { id: 17, image: unknow, name: "Ivy", rank: "Litter Angel", birthPlace: "เกิดจากความผันที่แสนสุขของนุ้ด เพราะเทื่อไหร่ที่คุณยิ้มมีความสุขในวันนั้น หนูจะปรกกฎกายขึ้นมาเพื่อให้รอยยิ้มคุณของคุณอยู่ตลอดไป",type:"Persian NekoMata", strength: "แมวขี้เล่นพูดเยอะ ติดคนมาก", favoriteFood: "ของหวาน ขนมทุกอย่าง อะไรก็ได้ที่กินกับนุ้ดได้", loveThing: "Hamster น้อนนนนน การมีเวลาเล่นเกม", hobby: "เล่นเกม!! กิน Vtuber", favoriteColor: "ชมพู ดำ ม่วง", messageToHumans: "ว๊ะฮะฮ่า!!!โดนหลอกแล้วจริงๆไอวี่เป็นแมวเบียวจะมากัดกินความผันของพวกคุณตั้งหากล่ะ! เจอแน่ เด็กแสบดื้อซนคนนี้ เอ้ย!ตัวนี้มาแล้ว เจอแน่ หึๆๆๆ เราเองความสุ่นวายในชีวิตคุณ" },
  { id: 18, image: unknow, name: "Kokoa", rank: "Litter Angel", birthPlace: "บ้านขนมแสนหวาน ที่มีคุณยายใจดีเก็บมาเลี้ยง สวนกุหลาบหลังบ้านเป็นสวนสนุป ทุกอย่าง!",type:"Japanese bobtail", strength: "ความแบ๊ว", favoriteFood: "ของเผ็ดๆ เพราะว่าเป็นคนแซ่บๆ อาหารญี่ปุ่น อาหารไทย อาหารอร่อย ขนมหวาน", loveThing: "เงิน<3 ความวิบวับ สีชมพูทุกสิ่งบนโลก", hobby: "วิ่งเล่น นอน ดูเมะ ฟังเพลง", favoriteColor: "สีชมพู", messageToHumans: "เอ็นดูเลาหน่อย อยากกินเชกิ 10ล้านใบ" },
  { id: 19, image: unknow, name: "Miyuki", rank: "Litter Angel", birthPlace: "เกิดจากดอกกุหลาบาีฟ้าในดินแดน",type:"Ragdoll", strength: "คุยไม่เก่งแต่ถ้าคุณเรื่องเกมที่ชอบจะพูดมากทันที", favoriteFood: "กุ้งเทมปุระ ช็อคโกแลต", loveThing: "มนุษย์", hobby: "เล่นเกม นอน", favoriteColor: "สีม่วง", messageToHumans: "Meoww" },
  { id: 20, image: unknow, name: "Mio", rank: "Litter Angel", type: "เมนคูน",birthPlace: "กำเนิดจากป่ามนป่าต้องห้ามที่ว่ากันว่าใครที่เข้าไปแล้วจะไม่ได้กลับออกมา .. ", strength: "หัวทอง ตัวเล็ก หาวเก่ง", favoriteFood: "ชานม!ชานม!", loveThing: "ชานม!หมูกะทะ!", hobby: "นอน/เล่นเกม!ทำงาน", favoriteColor: "แดง,ชมพู", messageToHumans: "สวัสดี/เจ้ามนุษย์ ขี้เกียจเปลี่ยนสีปากกาแล้ว เอาเปลี่ยนสีปากกาแล้ว เอาเป็นว่ามารู้จักกันดีกว่า แมวตัวนี้เลี้ยงง่ายแต่ดื้อมาก มาดุน้องแมวหน่อยมา! มามะ!,มาลูกหัวแมวหน่อยแต่กัดนะ!แฮ่ๆ" },
  { id: 21, image: unknow, name: "Momoka", rank: "Litter Angel", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" },
  { id: 22, image: unknow, name: "Moolek", rank: "Litter Angel",type: "แมวเล้า", birthPlace: "ไม่รู้เกืดที่ไหน แม่บอกเจอที่ ถังเบียร์", strength: "แมวสีเหลืองใส่แว่น", favoriteFood: "Alcohal ทุกชิดให้สมกับการเป็นแมวเล้า & ของกินที่ไม่อ้วนเพราะเก็บแคลไปกินแอล 555+", loveThing: "รักทุกคนที่รักหมูเล็ก,ใจดีกับหมูเล็ก รักที่าุดเลยนะคะคนดีของฉัน", hobby: "ชอบเต้น ร้องเพลง ตลอดเวลา มาสั่งLive ให้หมูเล็กที่ดื้อ", favoriteColor: "อย่างสีเหลือง", messageToHumans: "สวัสดีจ้าหมูเล็ก(Moolek) นะคะเป็นแมวExtrovert พูดมากชอบเลอคน หมูเล็กพร้อมคุยกับทุกคนเลยนะคะ ขี้เหล้า ไม่มีคนกินALเบิมเพี้นเรียกได้เลยพร้อมตั้งวง555+ ถ้าคุณรักหมูเล็กนี้หมูเล็กจะรักคุณกับ100เท่า รักนะ" },
  { id: 23, image: unknow, name: "Risa", rank: "Litter Angel", birthPlace: "ที่ไหนไม่รู้ แต่อยู่ในลังส้มข้าวบ้านนุ้ด ริบหนูไปเลี้ยงหน่อยน้าา",type:"วิเชียรมาศ", strength: "แมวตาลำไย", favoriteFood: "ชาไทย ยูสุโซดา", loveThing: "ที่นอนกับผ้าห่มนุ่มๆของหวาน นุ้ดยังไงละ", hobby: "กินของอร่อย นอน ", favoriteColor: "สีแดง สีของพระเอกยังไงละ", messageToHumans: "นุ้ดจะกลับบ้านแล้วเบ๋อ อย่าเพิ่งกลับจิ แวะข้างบ้านก่อนจิ" },
  { id: 24, image: unknow, name: "Yuna", rank: "Litter Angel",type: "แมวขี้โม้", birthPlace: "เกิดจากนรก แมวเฝ้านรก 3 หัว", strength: "ชอบขำสุขๆ", favoriteFood: "ทาโกะวาซาบิ ถั่วแระ", loveThing: "เตียง! ปอมปอมปุริน", hobby: "ร้องเพลง,นอน,นอน", favoriteColor: "สีดำ", messageToHumans: "ผมยูนะ,มะตะแล้วแต่เรียกไม่เรียกก็แล้วแต่" },
// Rank: Fairy
  { id: 25, image: unknow, name: "Hitomi", rank: "Fairy", birthPlace: "แมวต่างโลก อิเซไก BlackNeko แบบไม่รู็ตัว!?",type:"! ! !", strength: "แมวฟันห่าง", favoriteFood: "นทสตอเบอรี่ พุตดิ้ง", loveThing: "Idol", hobby: "โอตาดตะ", favoriteColor: "", messageToHumans: "หิวเหล้า หิว หิว " },
  { id: 26, image: unknow, name: "Maywa", rank: "Fairy", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" },
  { id: 27, image: unknow, name: "Kurimi", rank: "Fairy", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" },
  { id: 28, image: unknow, name: "Itsumi", rank: "Fairy", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" },
  { id: 29, image: unknow, name: "Ayse", rank: "Fairy", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" },
  { id: 30, image: unknow, name: "Reka", rank: "Fairy", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" },
// Rank: Trainee
{ id: 31, image: unknow, name: "Yumeko", rank: "Trainee", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" },
{ id: 32, image: unknow, name: "Shiori", rank: "Trainee", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" },
{ id: 33, image: unknow, name: "Tsubaki", rank: "Trainee", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" },
{ id: 34, image: unknow, name: "Sora", rank: "Trainee", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" },
{ id: 35, image: unknow, name: "Erika", rank: "Trainee", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" },
{ id: 36, image: unknow, name: "Layra", rank: "Trainee", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" },
{ id: 37, image: unknow, name: "Nene", rank: "Trainee", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" },
{ id: 38, image: unknow, name: "Saya", rank: "Trainee", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" },
{ id: 39, image: unknow, name: "Sylvie", rank: "Trainee", birthPlace: "", strength: "", favoriteFood: "", loveThing: "", hobby: "", favoriteColor: "", messageToHumans: "" },

];

// Rank filter options
const availableRanks = ['All', 'Trainee', 'kitten', 'Fairy', 'Angel', 'Litter Angel'];

const Cast = () => {
  const [rank, setRank] = useState('All');
  const [filteredCast, setFilteredCast] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // ✅ เพิ่มตรงนี้

  useEffect(() => {
    let filtered = cast.filter(user => {
      const matchesRank = rank === 'All' || user.rank.toLowerCase() === rank.toLowerCase();
      const matchesSearchName = user.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSearchRank = user.rank.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesRank && (matchesSearchName || matchesSearchRank);
    });

    setFilteredCast(filtered);
  }, [rank, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const clearFilter = () => setRank('All');
  const openUserModal = (user) => setSelectedUser(user);
  const closeUserModal = () => setSelectedUser(null);

  return (
    <div className="py-10 pt-20 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or rank..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:border-blue-500 dark:bg-black dark:text-white"
          />
        </div>

        {/* Filter */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 md:mb-2">
            <button
              onClick={toggleFilter}
              className="bg-white text-black py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center shadow-sm dark:bg-black dark:text-white dark:hover:bg-gray-800 dark:focus:ring-gray-500 transition duration-300"
            >
              <FaFilter className="mr-2" />
              Filter by Rank {isFilterOpen ? '▲' : '▼'}
            </button>
            {rank !== 'All' && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filtered by: <span className="font-semibold text-black dark:text-white">{rank}</span>
                </span>
                <button
                  onClick={clearFilter}
                  className="text-sm text-red-500 hover:text-red-700 focus:outline-none flex items-center dark:text-red-400 dark:hover:text-red-500"
                >
                  <FaTimes className="mr-1" /> Clear
                </button>
              </div>
            )}
          </div>
          {isFilterOpen && (
            <div className="bg-white rounded-md shadow-md p-4 mt-2 border border-gray-200 dark:bg-black dark:border-gray-600">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableRanks.map(rankOption => (
                  <button
                    key={rankOption}
                    onClick={() => {
                      setRank(rankOption);
                      toggleFilter();
                    }}
                    className={`block py-2 px-4 text-sm text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:text-white dark:hover:bg-gray-800 dark:focus:ring-gray-500 transition duration-300 ${rank === rankOption ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                  >
                    {rankOption}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cast Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${fadeIn ? 'opacity-100 transition-opacity duration-1000' : 'opacity-0'}`}>
          {filteredCast.map((user, idx) => (
            <div
              key={idx}
              onClick={() => openUserModal(user)} // ✅ ใส่คลิกเปิด modal
              className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg dark:bg-black dark:text-white"
              style={{
                opacity: fadeIn ? 1 : 0,
                transform: fadeIn ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.5s ease',
              }}
            >
              <div className="relative w-full h-[275px] overflow-hidden mb-4">
                <img
                  src={user.image}
                  alt={user.name}
                  className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-black mb-2 dark:text-white">{user.name}</h3>
                <p className="text-gray-700 text-sm dark:text-gray-400">Rank: {user.rank}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg max-w-md w-full mx-4 p-6 relative">
              <button
                onClick={closeUserModal}
                className="absolute top-3 right-3 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
              >
                <FaTimes size={20} />
              </button>
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={selectedUser.image}
                  alt={selectedUser.name}
                  className="w-40 h-40 object-cover rounded-full shadow-md"
                />
                <h2 className="text-xl font-semibold dark:text-white">{selectedUser.name}</h2>
<p className="text-sm text-gray-600 dark:text-gray-300">Rank: {selectedUser.rank}</p>
<div className="w-full mt-4 text-sm text-gray-700 dark:text-gray-300 space-y-2">
  <p><FaMapMarkerAlt className="inline mr-2 text-pink-500" /> เกิดที่ไหน: {selectedUser.birthPlace}</p>
  <p><FaDumbbell className="inline mr-2 text-blue-500" /> จุดเด่น: {selectedUser.strength}</p>
  <p><FaUtensils className="inline mr-2 text-red-400" /> ของกินที่ชอบ: {selectedUser.favoriteFood}</p>
  <p><FaHeart className="inline mr-2 text-pink-600" /> สิ่งที่รัก: {selectedUser.loveThing}</p>
  <p><FaSmile className="inline mr-2 text-yellow-500" /> งานอดิเรก: {selectedUser.hobby}</p>
  <p><FaPalette className="inline mr-2 text-purple-500" /> สีที่ชอบ: {selectedUser.favoriteColor}</p>
  <p className="italic mt-4 text-center">💬 "{selectedUser.messageToHumans}"</p>
</div>


              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Cast;