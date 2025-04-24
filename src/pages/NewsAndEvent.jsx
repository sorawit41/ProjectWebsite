import React, { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa'; // Icon for dropdown
import { Link } from 'react-router-dom';

// April
import image1 from "../assets/newsandevemts/April/2nd Dimension.png";
import image2 from "../assets/newsandevemts/April/azuki.png";
import image3 from "../assets/newsandevemts/April/songkarn.png";
import image4 from "../assets/newsandevemts/April/tsuki.png";
//March
import image5 from "../assets/newsandevemts/March/risa.png";
import image6 from "../assets/newsandevemts/March/fruit.png";
import image7 from "../assets/newsandevemts/March/animal.png";
import image8 from "../assets/newsandevemts/March/galgril.png";
//Feb
import image9 from "../assets/newsandevemts/Feb/office.png";
import image10 from "../assets/newsandevemts/Feb/cat.png";
import image11 from "../assets/newsandevemts/Feb/val.png";
import image12 from "../assets/newsandevemts/Feb/glasses.png";
//jan
import image13 from "../assets/newsandevemts/jan/chinese.png";
import image14 from "../assets/newsandevemts/jan/children.png";
import image15 from "../assets/newsandevemts/jan/miko.png";
// ข้อมูลข่าวและกิจกรรม
const newsAndEvents = [
  {
    id: 1,
    month: "เมษายน",
    title: "2nd Dimension - 2nd OFF-KAI X Black Neko\n𝑸𝒖𝒆𝒆𝒏 & 𝑷𝒓𝒊𝒏𝒄𝒆𝒔𝒔 👑 ꜱᴘᴀʀᴋʟᴇ ʜᴏᴜʀꜱ\n26 APR 2025 | At Black Neko (MBK CENTER)~ 🍇🍒🍎",
    shortDescription: "2nd Dimension - 2nd OFF-KAI X Black Neko\n𝑸𝒖𝒆𝒆𝒏 & 𝑷𝒓𝒊𝒏𝒄𝒆𝒔𝒔 👑 ꜱᴘᴀʀᴋʟᴇ ʜᴏᴜʀꜱ\n26 APR 2025 | At Black Neko (MBK CENTER)",
    fullDescription: "อีกไม่กี่วันก็จะถึงวันงาน OFF-KAI ของพวกเราแล้วนะคะ\nใครยังไม่มีบัตร สามารถซื้อบัตรได้ทาง LINE MY SHOP เลยค่ะ\n\nรอบนี้มาพบกับสาวๆ 2ND DIMENSION ในลุค ควีน&ปรินเซส ที่จะมาทำให้พวกคุณใจละลาย\nเตรียมพบกับโชว์สุดพิเศษจากสมาชิกทุกคน, ร่วมรับประทานอาหาร, พูดคุย และสร้างความทรงจำดีๆไปด้วยกันนะ\n\n__________________\n📌ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈\n\n#blacknekombk #blackneko #maidcafe #idolcafe #BlackNeko #MBK #blacknekomaidcafe #blacknekomaidcafeandbar #mbkcenter #mbkcenterbangkok\n#2ndDimension #2DMob #2ndDimensionOFFKAI #2D_2ndOffkai",
    date: "2025-04-26",
    image: image1,
  },
  {
    id: 2,
    month: "เมษายน",
    title: "อีเวนท์ฉลองวันเกิดของน้องแมว Azuki & Fuwarun 🎂🎉 ",
    shortDescription: "อีเวนท์ฉลองวันเกิดของน้องแมว Azuki & Fuwarun 🎂🎉",
    fullDescription: "ปีนี้น้องทั้งสองจะเตรียมของขวัญพิเศษอะไรมาให้กันนะ\n\n✨มาหาน้องแมวของเราได้ที่ร้าน Black Neko มีกิจกรรมพิเศษและโปรโมชั่นมากมายรอคุณอยู่ !\n\n📆 วันที่ 19 เมษายนนี้ มาเจอกันนะคะ😉\n\nโพสต์ประกาศงาน และโพสต์สินค้า\nรายละเอียด :\nGift S : 500 บาท\nGift M : 800 บาท\nGift L : 1200 บาท\nCake : 1500 บาท\n\nPhoto set คู่ 580 บาท\n\nPromotion\n1. Angel&Devil Drink 440 บาท\nGet Free random photo card ชุดอีเวนท์ BD\n2. Live Show 1 Free 1 เฉพาะ Azuki & Fuwarun\n3. ยอดบิลทุกๆ 500 บาท ได้รับสิทธิ์สุ่ม Lucky Draw 1 สิทธิ์ (สุ่มในวันพุธถัดจากวันงาน)\n__________\n\n📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈\n\n#Blacknekombk #Blackneko #maidecafe #BlackNeko #MBK #blacknekomaidcafe #blacknekomaidcafeandbar #mbkcenter #mbkcenterbangkok #เทรนด์วันนี้ ดูน้อยลง\nความคิดเห็น\n\n\n",
    date: "2025-04-19",
    image: image2
},
{
  id: 3,
  month: "เมษายน",
  title: "🫧 เตรียมพบกับอีเวนท์ฉลองวันปีใหม่ไทย 🔫💦 🐾",
  shortDescription: "🫧 เตรียมพบกับอีเวนท์ฉลองวันปีใหม่ไทย 🔫💦 🐾",
  fullDescription: "✨มาหาน้องแมวของเราได้ที่ร้าน Black Neko มีกิจกรรมพิเศษและโปรโมชั่นมากมายรอคุณอยู่ !\n\n📆 วันที่ 11-13 เมษายนนี้ มาเจอกันนะคะ😉\n\n__________\n\n📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈\n\n#Blacknekombk #Blackneko #maidecafe #BlackNeko #MBK #blacknekomaidcafe #blacknekomaidcafeandbar #mbkcenter #mbkcenterbangkok #เทรนด์วันนี้ ดูน้อยลง",
  date: "2025-04-11",
  image: image3
},
{
  id: 4,
  month: "เมษายน",
  title: "Parallella Idol X Black neko",
  shortDescription: "Parallella Idol X Black neko",
  fullDescription: "วันศุกร์ที่ 4/4/2025  เวลา 19.00-23.00\nในคืนจันทร์เสี้ยว  ณ ปราสาทโลกคู่ขนานแห่งนึง แวมไพร์ทั้ง 5 ได้มีการจัดงานฉลองวันเกิดให้กับแวมไพร์ที่มีนามว่า สีกิ\nจึงขอเชิญเหล่าแวมไพร์และมนุษย์ทุกท่าน มาร่วมสังสรรค์และแสดงความยินดีไปกับพวกเราที่ปราสาท Black neko (MBK 7 Floor)\nในงานท่านจะได้พบกับโชว์สุดพิเศษจากเหล่าแวมไพร์ทั้ง 5 และร่วมทำกิจกรรมสนุกๆสุดไร้สาระมากมาย ท่านสามารถท้าประลองกับแวมไพร์ทั้ง 5 ได้ที่ลานประลองหน้า\nปราสาท (Tekken8) (ท้าต่อยตาละ 20 บาท)\nDATE 4 April 2025 (Friday)\nTIME 19:00 - 23:00\n",
  date: "2025-03-04",
  image: image4
},
{
  id: 5,
  month: "มีนาคม",
  title: "อีเวนท์ฉลองวันเกิดของน้องแมว Risa & Kokoa 🎂🎉",
  shortDescription: "อีเวนท์ฉลองวันเกิดของน้องแมว Risa & Kokoa 🎂🎉",
  fullDescription: "ปีนี้น้องทั้งสองจะเตรียมของขวัญพิเศษอะไรมาให้กันนะ\n\n✨มาหาน้องแมวของเราได้ที่ร้าน Black Neko มีกิจกรรมพิเศษและโปรโมชั่นมากมายรอคุณอยู่ !\n\n📆 วันที่ 29 มีนาคมนี้ มาเจอกันนะคะ😉\n\n__________\n\n📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈\n\n#Blacknekombk #Blackneko #maidecafe #BlackNeko #MBK #blacknekomaidcafe #blacknekomaidcafeandbar #mbkcenter #mbkcenterbangkok #เทรนด์วันนี้ ดู",
  date: "2025-03-29",
  image: image5
},
{
  id: 6,
  month: "มีนาคม",
  title: "แปลงร่างเป็นผลไม้~! 🍎🍇🍒🥝🍑🍅🍉🍊",
  shortDescription: "แปลงร่างเป็นผลไม้~! 🍎🍇🍒🥝🍑🍅🍉🍊",
  fullDescription: "✨มาหาน้องแมวของเราได้ที่ร้าน Black Neko มีกิจกรรมพิเศษและโปรโมชั่นมากมายรอคุณอยู่ ! \n📆 วันที่ 21-23 มีนาคมนี้ มาเจอกันนะคะ😉\n__________\n📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈\n#Blacknekombk #Blackneko #maidecafe #BlackNeko #MBK #blacknekomaidcafe #blacknekomaidcafeandbar #mbkcenter #mbkcenterbangkok #เทรนด์วันนี้",
  date: "2025-03-29",
  image: image6
},
{
  id: 7,
  month: "มีนาคม",
  title: "เตรียมตัวพับกบ เอ้ย! พบกับอีเว้นท์สาวหูสัตว์ 🐰🐼\nว่าแต่น้องแมวของเราจะแปลงร่างเป็นตัวอะไรสุดสัปดาห์นี้กันนะ 🤭💕",
  shortDescription: "เตรียมตัวพับกบ เอ้ย! พบกับอีเว้นท์สาวหูสัตว์ 🐰🐼\nว่าแต่น้องแมวของเราจะแปลงร่างเป็นตัวอะไรสุดสัปดาห์นี้กันนะ 🤭💕",
  fullDescription: "✨มาหาน้องแมวของเราได้ที่ร้าน Black Neko มีกิจกรรมพิเศษและโปรโมชั่นมากมายรอคุณอยู่ !\n\n📆 วันที่ 14-16 มีนาคมนี้ มาเจอกันนะคะ😉\n\n__________\n\n📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈\n\n#Blacknekombk #Blackneko #maidecafe #BlackNeko #MBK #blacknekomaidcafe #blacknekomaidcafeandbar #mbkcenter #mbkcenterbangkok #เทรนด์วันนี้ ดูน้อยลง",
  date: "2025-03-14",
  image: image7
},
{
  id: 8,
  month: "มีนาคม",
  title: "คิดแคปชั่นไม่ออกแต่รู้ว่างานนี้มีแซ่บแน่นอน ❤️‍🔥",
  shortDescription: "คิดแคปชั่นไม่ออกแต่รู้ว่างานนี้มีแซ่บแน่นอน ❤️‍🔥",
  fullDescription: "✨ถ้ายังไม่มีมาหาน้องแมวของเราได้ที่ร้าน Black Neko มีกิจกรรมพิเศษและโปรโมชั่นมากมายรอคุณอยู่ !\n\n📆 วันที่ 7-9 มีนาคมนี้ มาเจอกันนะคะ😉\n\n__________\n\n📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈\n\n#Blacknekombk #Blackneko #maidecafe #BlackNeko #MBK #blacknekomaidcafe #blacknekomaidcafeandbar #mbkcenter #mbkcenterbangkok #เทรนด์วันนี้ ",
  date: "2025-03-07",
  image: image8
},
{
  id: 9,
  month: "กุมภาพันธ์",
  title: "มีสาวออฟฟิศเป็นของตัวเองหรือยังคะ บอส💕",
  shortDescription: "มีสาวออฟฟิศเป็นของตัวเองหรือยังคะ บอส💕",
  fullDescription: "✨ถ้ายังไม่มีมาหาน้องแมวของเราได้ที่ร้าน Black Neko มีกิจกรรมพิเศษและโปรโมชั่นมากมายรอคุณอยู่ !\n\n📆 วันที่ 28-02 กุมภาพันธ์-มีนาคมนี้ มาเจอกันนะคะ😉\n\n__________\n\n📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈\n\n#Blacknekombk #Blackneko #maidecafe #BlackNeko #MBK #blacknekomaidcafe #blacknekomaidcafeandbar #mbkcenter #mbkcenterbangkok #เทรนด์วันนี้ ดูน้อยลง ",
  date: "2025-02-26",
  image: image9
},
{
  id: 10,
  month: "กุมภาพันธ์",
  title: "มีสาวออฟฟิศเป็นของตัวเองหรือยังคะ บอส💕",
  shortDescription: "มีสาวออฟฟิศเป็นของตัวเองหรือยังคะ บอส💕",
  fullDescription: "✨ถ้ายังไม่มีมาหาน้องแมวของเราได้ที่ร้าน Black Neko มีกิจกรรมพิเศษและโปรโมชั่นมากมายรอคุณอยู่ !\n\n📆 วันที่ 28-02 กุมภาพันธ์-มีนาคมนี้ มาเจอกันนะคะ😉\n\n__________\n\n📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈\n\n#Blacknekombk #Blackneko #maidecafe #BlackNeko #MBK #blacknekomaidcafe #blacknekomaidcafeandbar #mbkcenter #mbkcenterbangkok #เทรนด์วันนี้ ดูน้อยลง ",
  date: "2025-02-26",
  image: image10
},
{
  id: 11,
  month: "กุมภาพันธ์",
  title: "🌹โดนเท มันทำให้ใจพัง เธอน่ารักจัง ทำให้ใจเซ~",
  shortDescription: "🌹โดนเท มันทำให้ใจพัง เธอน่ารักจัง ทำให้ใจเซ~",
  fullDescription: "✨วาเลนไทน์ปีนี้ มาหาน้องแมวของเราได้ที่ร้าน Black Neko มีกิจกรรมพิเศษและโปรโมชั่นมากมายรอคุณอยู่ !\n\nกระซิบว่ามีเมนูพิเศษด้วยล่ะ เมี๊ยวว~ 😼🫶🏻💕\n\n📆 วันที่ 14-16 กุมภาพันธ์นี้ มาเจอกันนะคะ😉\n\n__________\n\n📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈\n\n#Blacknekombk #Blackneko #maidecafe #BlackNeko #MBK #blacknekomaidcafe #blacknekomaidcafeandbar #mbkcenter #mbkcenterbangkok #เทรนด์วันนี้",
  date: "2025-02-14",
  image: image11
},
{
  id: "12",
  month: "กุมภาพันธ์",
  title: "👓 Glasses girl Event! 7-9 กุมภาพันธ์ 2025 💕",
  shortDescription: "👓 Glasses girl Event! 7-9 กุมภาพันธ์ 2025 💕",
  fullDescription: "ยินต้อนรับเข้าสู่ร้านที่มีสาวแว่นสุดน่ารักเต็มไปหมด\nเตรียมตัวพบน้องแมวในลุคสาวแว่นสุดสวย รวยความสามารถ ครบเครื่องเรื่องความแซ่บบ💖\n\n🔺ร้าน Black Neko ของเรายังมีโปรโมชั่นสุดพิเศษอีกมากมาย! แล้วเจอกันนะเมี้ยวว ٩( ‘ω’ )و\n\n__________\n\n📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈\n\n#Blacknekombk #Blackneko #maidecafe #BlackNeko #MBK #blacknekomaidcafe #blacknekomaidcafeandbar #mbkcenter #mbkcenterbangkok ",
  date: "2025-02-07",
  image: image12
},
{
  id: 13,
  month: "มกราคม",
  title: "🏮ซินเจียยู่อี่ ซินนี้ฮวดไช้ ~",
  shortDescription: "🏮ซินเจียยู่อี่ ซินนี้ฮวดไช้ ~",
  fullDescription: "🪭ตรุษจีนนี้แวะมาปาร์ตี้ที่ร้าน Black Neko มีกิจกรรมพิเศษและโปรโมชั่นมากมายรอคุณอยู่ !\n\n📆 วันที่ 25-31 มกราคมนี้ มาเจอกันนะคะ😉\n\n__________\n\n📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈\n\n#Blacknekombk #Blackneko #maidecafe #BlackNeko #MBK #blacknekomaidcafe #blacknekomaidcafeandbar #mbkcenter #mbkcenterbangkok #เทรนด์วันนี้ ดูน้อยลง",
  date: "2025-01-25",
  image: image13
},
{
  id: 14,
  month: "มกราคม",
  title: "🔔 Children’s day Event ! 10-12 มกราคม 2025 👶🏻",
  shortDescription: "🔔 Children’s day Event ! 10-12 มกราคม 2025 👶🏻",
  fullDescription: "👧🏻ก๊อกๆ วันเด็กปีนี้มีแมวเด็กอะยางงงงง 👀\n\n🔺เด็กๆพร้อมบุกที่ร้าน Black Neko แล้ว! พร้อมทั้งโปรโมชั่นสุดพิเศษอีกมากมาย! แล้วเจอกันนะเมี้ยวว ٩( ’ω‘ )و\n\n__________\n\n📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈\n\n#Blacknekombk #Blackneko #maidecafe #BlackNeko #MBK #blacknekomaidcafe #blacknekomaidcafeandbar #mbkcenter #mbkcenterbangkok #เทรนด์วันนี้",
  date: "2025-01-10",
  image: image14
},
{
  id: 15,
  month: "มกราคม",
  title: "🔔 Miko Event ! 3-5 มกราคม 2025 🎌",
  shortDescription: "🔔 Miko Event ! 3-5 มกราคม 2025 🎌",
  fullDescription: "☀️ต้อนรับปีใหม่ด้วยหญิงสาวบริสุทธิ์ผู้มากความสามารถในชุดสีขาวแดง ♪\n\n🔺ร้าน Black Neko จะเต็มไปด้วยสาวๆมิโกะที่เก่งกาจ! พร้อมทั้งโปรโมชั่นสุดพิเศษอีกมากมาย! แล้วเจอกันนะเมี้ยวว ٩( ‘ω’ )و\n\n__________\n\n📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈\n\n#Blacknekombk #Blackneko #maidecafe #BlackNeko #MBK #blacknekomaidcafe #blacknekomaidcafeandbar #mbkcenter #mbkcenterbangkok ดูน้อยลง",
  date: "2025-01-02",
  image: image15
}
];

const NewsAndEventNavBar = () => {
  const [activeMonth, setActiveMonth] = useState("เมษายน");
  const [opacity, setOpacity] = useState(0);
  const [expandedEvents, setExpandedEvents] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const groupEventsByMonth = (events) => {
    const grouped = events.reduce((acc, event) => {
      if (!acc[event.month]) acc[event.month] = [];
      acc[event.month].push(event);
      return acc;
    }, {});
    return grouped;
  };

  const groupedEvents = groupEventsByMonth(newsAndEvents);
  const allMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  const eventsForMonth = groupedEvents[activeMonth] || [];

  const handleMonthChange = (month) => {
    setActiveMonth(month);
    setIsDropdownOpen(false);
  };

  const toggleExpand = (eventId) => {
    setExpandedEvents((prevState) => ({
      ...prevState,
      [eventId]: !prevState[eventId]
    }));
  };

  useEffect(() => {
    setOpacity(0);
    setTimeout(() => {
      setOpacity(1);
    }, 100);
  }, [activeMonth]);

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white shadow-md">
      <div className="container mx-auto px-4 py-6 pt-20">
        <nav className="flex items-center justify-between">
          <div className="text-xl font-semibold">งานอีเว้นท์หรือกิจกรรมต่างๆของร้าน</div>
          <div className="relative">
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              เดือนที่: <span className="font-bold">{activeMonth}</span> <FaChevronDown />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-md shadow-md z-10">
                {allMonths.map((month) => (
                  <button
                    key={month}
                    className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left ${activeMonth === month ? 'bg-gray-200' : ''}`}
                    onClick={() => handleMonthChange(month)}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Events Container */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {eventsForMonth.length > 0 ? (
            eventsForMonth.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-black text-black dark:text-white shadow-md rounded-lg p-6 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6"
                style={{ opacity: opacity, transition: 'opacity 1s ease-in-out' }}
              >
                <div className="md:w-1/3">
                <img
  src={item.image} // ใช้ไฟล์ภาพที่นำเข้ามา
  alt={item.title}
  className="w-full h-100 object-cover rounded-lg mb-4 md:mb-0" // ที่นี่สามารถเปลี่ยนแปลงขนาดของรูปได้
/>

                </div>
                <div className="md:w-2/3">
                  <h2 className="text-2xl font-bold text-black dark:text-white">{item.title}</h2>
                  <p className="text-sm text-black dark:text-white mb-4">{new Date(item.date).toLocaleDateString()}</p>
                  <p className="text-black dark:text-white mb-4">{item.shortDescription}</p>
                  {expandedEvents[item.id] ? (
                    <p className="text-black dark:text-white ">{item.fullDescription}</p>
                  ) : (
                    <p className="text-black dark:text-white">{item.fullDescription.substring(0, 100)}... </p>
                  )}
                  {item.fullDescription.length > 100 && (
                    <button
                      className="text-blue-500 hover:underline focus:outline-none"
                      onClick={() => toggleExpand(item.id)}
                    >
                      {expandedEvents[item.id] ? "Read Less" : "Read More"}
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">ยังไม่มีกิจกรรมน้านุ้ด.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsAndEventNavBar;
