import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaChevronDown, FaTimes } from 'react-icons/fa';

// May
import image19 from "../assets/newsandevemts/May/birthdayidol.png";
import image18 from "../assets/newsandevemts/May/1year.png";
import image17 from "../assets/newsandevemts/May/You.png";
// April
import image1 from "../assets/newsandevemts/April/2nd Dimension.png";
import image2 from "../assets/newsandevemts/April/azuki.png";
import image3 from "../assets/newsandevemts/April/songkarn.png";
import image4 from "../assets/newsandevemts/April/tsuki.png";
import image16 from "../assets/newsandevemts/April/ST3LLVR.png";
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

const allNewsAndEvents = [
  {
    id: 19,
    month: "พฤษภาคม",
    title: "ปุกาศๆ เราจะมีแฟนมีต มินิคอนเสิร์ต ร่วมกับ Black Neko รายละเอียดการซื้อบัตรเราจะมาแจ้งอีกทีงับ 🫡 ล็อกวันให้หน่อยได้ม้ายย",
    shortDescription: "ปุกาศๆ เราจะมีแฟนมีต มินิคอนเสิร์ต ร่วมกับ Black Neko รายละเอียดการซื้อบัตรเราจะมาแจ้งอีกทีงับ 🫡 ล็อกวันให้หน่อยได้ม้ายย",
    fullDescription: "ปุกาศๆ เราจะมีแฟนมีต มินิคอนเสิร์ต ร่วมกับ Black Neko รายละเอียดการซื้อบัตรเราจะมาแจ้งอีกทีงับ 🫡 ล็อกวันให้หน่อยได้ม้ายย",
    date: "2025-05-26",
    image: image17
  },
  {
    id: 17,
    month: "พฤษภาคม",
    title: "อีเวนท์ฉลองวันเกิดของน้องแมวปริศนา 🎂🎉",
    shortDescription: "อีเวนท์ฉลองวันเกิดของน้องแมวปริศนา 🎂🎉",
    fullDescription: "ปีนี้น้องทั้งสองจะเตรียมของขวัญพิเศษอะไรมาให้กันนะ\n\n📆 วันที่ 17 พฤษภาคมนี้ มาเจอกันนะคะ😉\n\n✨มาหาน้องแมวของเราได้ที่ร้าน Black Neko มีกิจกรรมพิเศษและโปรโมชั่นมากมายรอคุณอยู่ !\n\n__________\n\n📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈\n\n#Blacknekombk #Blackneko #maidecafe #BlackNeko #MBK #blacknekomaidcafe #blacknekomaidcafeandbar #mbkcenter #mbkcenterbangkok #เทรนด์วันนี้",
    date: "2025-05-17",
    image: image19
  },

  {
    id: 18,
    month: "พฤษภาคม",
    title: "🐈‍⬛ เตรียมตัวพบกับงานครบรอบ 1 ปี 🫧",
    shortDescription: "🐈‍⬛ เตรียมตัวพบกับงานครบรอบ 1 ปี 🫧",
    fullDescription: "ณ อณาจักรสวรรค์ของเหล่าแมวดำพร้อมด้วยกิจกรรมและโปรโมชั่นมากมาย 💖\n\nรายละเอียด กิจกรรม และ โปรโมชั่น\n- ผู้เจ้าร่วมทุกท่าน Free Welcome Drink ( Champagne None-L)\n- เชกิทุกใบจากอีเว้นท์จะได้รับข้อความจากน้องแมวหลังภาพ\n- ใบเสร็จที่มียอดชำระทุกๆ 500 บาท ได้รับช็อคโกแลตจากน้องแมว 1 ชิ้น\n- พบกับ Live Show สุดพิเศษจากน้องแมวตลอด 3 วันเต็ม\n- Drink ราคา 1,000 บาทขึ้นไป Free ชาเมะ / Video 20 sec ของน้องแมวที่เปิด Drink\n- เครื่องดื่ม Size L 2 Free ชาเมะ / Omakase 2 Free 1\n- ทุก 500 บาท จะได้รับตั๋ว Lucky draw ที่สามารถลุ้นรับตุ๊กตาแมว Size XXL โดยจะมีการจับฉลากในวันที่ 4/5/25\n\n🍀 Lucky draw เริ่มแจกตั้งแต่วันที่ 2/5/25 ✨\n\nแวะมาดื่มเครื่องดื่มเย็นๆทานอาหารแสนอร่อยกันนะ เมี้ยว✨ ٩(๑❛ᴗ❛๑)۶\n\n__________________\n📌ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈\n\n#blacknekombk #blackneko #maidcafe #idolcafe #BlackNeko #MBK #blacknekomaidcafe #blacknekomaidcafeandbar #mbkcenter #mbkcenterbangkok ดูน้อยลง",
    date: "2025-05-02",
    image: image18
  },
  {
    id: 16,
    month: "เมษายน",
    title: "🔔 ST3LLVR BIRTHDAY PARTY AND FRIENDS X BLACK NEKO",
    shortDescription: "ST3LLVR BIRTHDAY PARTY AND FRIENDS X BLACK NEKO",
    fullDescription: "ST3LLVR BIRTHDAY PARTY AND FRIENDS X BLACK NEKO\nพร้อมวงไอดอลอีก 2 วง มาร่วมงานฉลองงานวันเกิดกันนะเมี้ยว\nDate & Time: 27.04.2025 (19:30 – 21:30)\nVenue: BLACK NEKO, MBK Center (7th Floor)\n__________________\n📌ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈\n#blacknekombk #blackneko #maidcafe #idolcafe #BlackNeko #MBK #blacknekomaidcafe #blacknekomaidcafeandbar #mbkcenter #mbkcenterbangkok #ST3LLVR #ST3LLVR_HEARTSTEALER\n#ST3LLVR_BirthdayParty\n#ST3LLVR_DebutShowcase",
    date: "2025-04-26",
    image: image16
  },
  {
    id: 1,
    month: "เมษายน",
    title: "2nd Dimension - 2nd OFF-KAI X Black Neko\n𝑸𝒖𝒆𝒆𝒏 & 𝑷𝒓𝒊𝒏𝒄𝒆𝒔𝒔 👑 ꜱᴘᴀʀᴋʟᴇ ʜᴏᴜʀꜱ\n26 APR 2025 | At Black Neko (MBK CENTER)~ 🍇🍒🍎",
    shortDescription: "2nd Dimension - 2nd OFF-KAI X Black Neko\n𝑸𝒖𝒆𝒆𝒏 & 𝑷𝒓𝒊𝒏𝒄𝒆ꜱꜱ 👑 ꜱᴘᴀʀᴋʟᴇ ʜᴏᴜʀꜱ\n26 APR 2025 | At Black Neko (MBK CENTER)",
    fullDescription: "อีกไม่กี่วันก็จะถึงวันงาน OFF-KAI ของพวกเราแล้วนะคะ\nใครยังไม่มีบัตร สามารถซื้อบัตรได้ทาง LINE MY SHOP เลยค่ะ\n\nรอบนี้มาพบกับสาวๆ 2ND DIMENSION ในลุค ควีน&ปรินเซส ที่จะมาทำให้พวกคุณใจละลาย\nเตรียมพบกับโชว์สุดพิเศษจากสมาชิกทุกคน, ร่วมรับประทานอาหาร, พูดคุย และสร้างความทรงจำดีๆไปด้วยกันนะ\n\n__________________\n📌ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈\n\n#blacknekombk #blackneko #maidcafe #idolcafe #BlackNeko #MBK #blacknekomaidcafe #blacknekomaidcafeandbar #mbkcenter #mbkcenterbangkok\n#2ndDimension #2DMob #2ndDimensionOFFKAI #2D_2ndOffkai",
    date: "2025-04-26",
    image: image1
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
    date: "2025-04-04",
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
    fullDescription: "✨ถ้ายังไม่มีมาหาน้องแมวของเราได้ที่ร้าน Black Neko มีกิจกรรมพิเศษและโปรโมชั่นมากมายรอคุณอยู่ !\n\n📆 วันที่ 7-9 มีนาคมนี้ มาเจอกันนะคะ😉\n\n__________\n\n📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBKชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈\n\n#Blacknekombk #Blackneko #maidecafe #BlackNeko #MBK #blacknekomaidcafe #blacknekomaidcafeandbar #mbkcenter #mbkcenterbangkok #เทรนด์วันนี้ ",
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
    fullDescription: "👧🏻ก๊อกๆ วันเด็กปีนี้มีแมวเด็กอะยางงงงง 👀\n\n🔺เด็กๆพร้อมบุกที่ร้าน Black Neko แล้ว! พร้อมทั้งโปรโมชั่นสุดพิเศษอีกมากมาย! แล้วเจอกันนะเมี้ยวว ٩( ’ω’ )و\n\n__________\n\n📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈\n\n#Blacknekombk #Blackneko #maidecafe #BlackNeko #MBK #blacknekomaidcafe #blacknekomaidcafeandbar #mbkcenter #mbkcenterbangkok #เทรนด์วันนี้",
    date: "2025-01-10",
    image: image14
  },
  {
    id: 15,
    month: "มกราคม",
    title: "🔔 Miko Event ! 3-5 มกราคม 2025 🎌",
    shortDescription: "🔔 Miko Event ! 3-5 มกราคม 2025 🎌",
    fullDescription: "☀️ต้อนรับปีใหม่ด้วยหญิงสาวบริสุทธิ์ผู้มากความสามารถในชุดสีขาวแดง ♪\n\n🔺ร้าน Black Neko จะเต็มไปด้วยสาวๆมิโกะที่เก่งกาจ! พร้อมทั้งโปรโมชั่นสุดพิเศษอีกมากมาย! แล้วเจอกันนะเมี้ยวว ٩( ’ω’ )و\n\n__________\n\n📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈\n\n#Blacknekombk #Blackneko #maidecafe #BlackNeko #MBK #blacknekomaidcafe #blacknekomaidcafeandbar #mbkcenter #mbkcenterbangkok ",
    date: "2025-01-02",
    image: image15
  }
];

// Define all months in order for the dropdown
const ALL_MONTHS_ORDER = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

/**
 * Event Card Component
 * Displays a single event in a card format.
 */
const EventCard = ({ event, onCardClick, opacity }) => (
  <div
    className="bg-white dark:bg-black rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 cursor-pointer"
    style={{ opacity: opacity, transition: 'opacity 0.5s ease-in-out' }}
    onClick={() => onCardClick(event)}
  >
    <div className="relative">
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-72 object-cover object-center"
      />
      <span className="absolute top-3 right-3 bg-black/60 text-white text-xs font-semibold rounded-full px-2.5 py-1 backdrop-blur-sm shadow-md">
        {new Date(event.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
      </span>
    </div>
    <div className="p-5">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">{event.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">{event.shortDescription}</p>
      <button
        className="mt-4 text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-300 focus:outline-none text-sm font-medium transition-colors duration-200"
      >
        อ่านเพิ่มเติม
      </button>
    </div>
  </div>
);

/**
 * Event Detail Popup Component
 * Displays full details of a selected event in a modal.
 */
const EventDetailPopup = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-black rounded-2xl shadow-2xl max-w-3xl w-full mx-auto my-8 relative max-h-[90vh] overflow-y-auto transform scale-95 animate-scale-in border border-gray-200 dark:border-gray-700/80">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-white transition duration-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
          aria-label="Close"
        >
          <FaTimes size={22} />
        </button>
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-80 object-cover object-center rounded-t-2xl"
        />
        <div className="p-6 md:p-8">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{event.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            วันที่: {new Date(event.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
            {event.fullDescription}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * NewsAndEventNavBar Component
 * Main component for displaying news and events.
 */
const NewsAndEventNavBar = () => {
  const [activeMonth, setActiveMonth] = useState("พฤษภาคม"); // Default to May
  const [contentOpacity, setContentOpacity] = useState(0); // State for fade transition
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Group events by month and sort them by date (latest first)
  const groupedEvents = useMemo(() => {
    const eventsMap = allNewsAndEvents.reduce((acc, event) => {
      if (!acc[event.month]) acc[event.month] = [];
      acc[event.month].push(event);
      return acc;
    }, {});

    // Sort events within each month by date in descending order
    for (const month in eventsMap) {
      eventsMap[month].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return eventsMap;
  }, []);

  // Get events for the currently active month
  const eventsForActiveMonth = useMemo(() => {
    return groupedEvents[activeMonth] || [];
  }, [activeMonth, groupedEvents]);

  // Handle month selection from the dropdown
  const handleMonthChange = useCallback((month) => {
    setActiveMonth(month);
    setIsDropdownOpen(false); // Close dropdown after selection
  }, []);

  // Function to open the popup with selected event data
  const openEventPopup = useCallback((event) => {
    setSelectedEvent(event);
    setShowPopup(true);
  }, []);

  // Function to close the popup
  const closeEventPopup = useCallback(() => {
    setShowPopup(false);
    setSelectedEvent(null);
  }, []);

  // Effect for smooth opacity transition when activeMonth changes
  useEffect(() => {
    setContentOpacity(0); // Fade out current content
    const timer = setTimeout(() => {
      setContentOpacity(1); // Fade in new content
    }, 100); // Short delay for fade-out effect before new content appears

    return () => clearTimeout(timer); // Cleanup timeout
  }, [activeMonth]);

  return (
    <div className="bg-white dark:bg-black min-h-screen py-10 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 sm:mb-0">
            Events & Updates
          </h2>
          <div className="relative">
            <button
              className="inline-flex items-center gap-2 bg-white dark:bg-black text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-base font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Month: <span className="font-semibold">{activeMonth}</span> <FaChevronDown className="text-sm ml-1" />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-black rounded-lg shadow-xl z-20 border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto custom-scrollbar">
                {ALL_MONTHS_ORDER.map((month) => (
                  <button
                    key={month}
                    className={`block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm w-full text-left transition-colors duration-150 ${activeMonth === month ? 'bg-gray-200 dark:bg-gray-700 font-semibold' : ''}`}
                    onClick={() => handleMonthChange(month)}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventsForActiveMonth.length > 0 ? (
            eventsForActiveMonth.map((item) => (
              <EventCard
                key={item.id}
                event={item}
                onCardClick={openEventPopup}
                opacity={contentOpacity}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-gray-600 dark:text-gray-400">
              <p className="text-xl font-medium mb-2">No events found for {activeMonth}.</p>
              <p>Please select another month or check back later!</p>
            </div>
          )}
        </div>

        {/* Popup for full event details */}
        <EventDetailPopup
          event={selectedEvent}
          onClose={closeEventPopup}
        />
      </div>
    </div>
  );
};

export default NewsAndEventNavBar;