import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa'; // Import the down arrow icon

const newsAndEvents = [
  {
    id: 1,
    month: "มีนาคม",
    title: "มาแจ้งโปรผลไม้แล้วจ้า~! 🍎🍇🍒🥝🍑🍅🍉🍊",
    shortDescription: "มาแจ้งโปรผลไม้แล้วจ้า~! ",
    fullDescription: "✨มาหาน้องแมวของเราได้ที่ร้าน Black Neko มีกิจกรรมพิเศษและโปรโมชั่นมากมายรอคุณอยู่ !📆 วันที่ 21-23 มีนาคมนี้ มาเจอกันนะคะ",
    date: "2025-03-21",
    imageUrl: "https://scontent.fbkk12-3.fna.fbcdn.net/v/t39.30808-6/485274473_122216696156082876_3086506945107064631_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=17f1mnr8-eIQ7kNvwHax2xf&_nc_oc=Admg5E5erEH7LnmETTEtL7RpLJr0EcQcbrSFGd6LRLn90-CX2lsMRXil4UQYSSW3at0rzy1bVQVPp_RtAwwV9xud&_nc_zt=23&_nc_ht=scontent.fbkk12-3.fna&_nc_gid=mgrLLC7EmHsruxAksWr_oA&oh=00_AfFJKKrn_L2flwemqBuc6C4jxAQVtWBDSdzWXXOOSdjQog&oe=67FABE70"
  },
  {
    id: 2,
    month: "มีนาคม",
    title: "อีเวนท์ฉลองวันเกิดของน้องแมว Risa & Kokoa 🎂🎉",
    shortDescription: "อีเวนท์ฉลองวันเกิดของน้องแมว Risa & Kokoa 🎂🎉",
    fullDescription: "ปีนี้น้องทั้งสองจะเตรียมของขวัญพิเศษอะไรมาให้กันนะ✨มาหาน้องแมวของเราได้ที่ร้าน Black Neko มีกิจกรรมพิเศษและโปรโมชั่นมากมายรอคุณอยู่ !📆 วันที่ 29 มีนาคมนี้ มาเจอกันนะคะ😉📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈",
    date: "2025-03-29",
    imageUrl: "https://scontent.fbkk12-5.fna.fbcdn.net/v/t39.30808-6/486850058_122218924106082876_1009733351090968552_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_ohc=GJp2ee6mXU0Q7kNvwGvf-BE&_nc_oc=Adm0w7BrBYQ5VEpkcdQjROp8xbR4ilix-JG8R_ua2IV7-6i_l4QIF4omG3AySASb7UdptG1nK8Y3F6pd9wAFPPB8&_nc_zt=23&_nc_ht=scontent.fbkk12-5.fna&_nc_gid=PuTJ_0xlLdphYQiinflD-Q&oh=00_AfHyZR4oDwSCAEqnGKarQWGbdaKWacdaaDFqcmrZGCgbww&oe=67FAE0AC",
  },
  {
    id:3,
    month: "มีนาคม",
    title: "Parallella Idol X Black neko",
    shortDescription: "Parallella Idol X Black neko",
    fullDescription: "ปีวันศุกร์ที่ 4/4/205  เวลา 19.00-23.00ในคืนจันทร์เสี้ยว  ณ ปราสาทโลกคู่ขนานแห่งนึง แวมไพร์ทั้ง 5 ได้มีการจัดงานฉลองวันเกิดให้กับแวมไพร์ที่มีนามว่า สีกิจึงขอเชิญเหล่าแวมไพร์และมนุษย์ทุกท่าน มาร่วมสังสรรค์และแสดงความยินดีไปกับพวกเราที่ปราสาท Black neko (MBK 7 Floor)ในงานท่านจะได้พบกับโชว์สุดพิเศษจากเหล่าแวมไพร์ทั้ง 5 และร่วมทำกิจกรรมสนุกๆสุดไร้สาระมากมาย ท่านสามารถท้าประลองกับแวมไพร์ทั้ง 5 ได้ที่ลานประลองหน้าปราสาท (Tekken8) (ท้าต่อยตาละ 20 บาท)DATE 4 April 2025 (Friday)TIME 19:00 - 23:00📌ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈   (GooGle Map https://g.co/kgs/4Rkbf68) ",
    date: "2025-03-29",
    imageUrl: "https://scontent.fbkk22-1.fna.fbcdn.net/v/t39.30808-6/487495355_122220308288082876_7930177006952319467_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_ohc=OaW0sC0erDgQ7kNvwF5R0cZ&_nc_oc=AdlpUO6VQH0CwpFxqoZTxlFcIMy6c05KdGA7L0mVNCxJR-XOhZYSJ80zHzEa71OFjoabypQxLcANtPlNGhJAvqEk&_nc_zt=23&_nc_ht=scontent.fbkk22-1.fna&_nc_gid=dgY8Lpospf2W9RslepcKrw&oh=00_AfGKCUsXivv5w872-evt67xMSc7qdwrB6YhR706A2xY3LA&oe=67FB473C"
  },
  {
    id:4,
    month: "เมษายน",
    title: "🫧 เตรียมพบกับอีเวนท์ฉลองวันปีใหม่ไทย 🔫",
    shortDescription: "🫧 เตรียมพบกับอีเวนท์ฉลองวันปีใหม่ไทย 🔫",
    fullDescription: "ปี✨มาหาน้องแมวของเราได้ที่ร้าน Black Neko มีกิจกรรมพิเศษและโปรโมชั่นมากมายรอคุณอยู่ ! 📆 วันที่ 11-13 เมษายนนี้ มาเจอกันนะคะ😉📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ",
    date: "2025-04-09",
    imageUrl: "https://scontent.fbkk22-3.fna.fbcdn.net/v/t39.30808-6/488919319_122221822424082876_7549740405894785259_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=ICSg4x9pK_gQ7kNvwHmwWBk&_nc_oc=AdlXEmQip_wTA5yRUdebJy7hM1XL6tqDtCXO_TFgJE5Z-9sqaAirkF08S9-FoTpx69QYcgDpLJklE6B9ItENtg1J&_nc_zt=23&_nc_ht=scontent.fbkk22-3.fna&_nc_gid=9wvh9lWrwnnBnKYZ6LOLVA&oh=00_AfF0PWXvDBm0y8aF6FUqFI-PLk46bqkQjv0Vy5JLrYcozg&oe=67FB4514"
  },
  {
    id:5,
    month: "มีนาคม",
    title: "เตรียมตัวพับกบ เอ้ย! พบกับอีเว้นท์สาวหูสัตว์ 🐰🐼",
    shortDescription: "🫧 เตรียมพบกับอีเวนท์ฉลองวันปีใหม่ไทย 🔫",
    fullDescription: "ปี✨มาหาน้องแมวของเราได้ที่ร้าน Black Neko มีกิจกรรมพิเศษและโปรโมชั่นมากมายรอคุณอยู่ ! 📆 วันที่ 11-13 เมษายนนี้ มาเจอกันนะคะ😉📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ",
    date: "2025-03-13",
    imageUrl: "https://scontent.fbkk22-6.fna.fbcdn.net/v/t39.30808-6/483527177_122215247318082876_6125949112376381311_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=HRVNkyhZNf4Q7kNvwHSOlJq&_nc_oc=AdlP9qiW3xc8lV1E9pWoJk-8sAorK-7-HhgXcaad7uaV066c__qCOAGqmYpgFLnh-1Hw3USmJ2LwMtg_sXsvzn3H&_nc_zt=23&_nc_ht=scontent.fbkk22-6.fna&_nc_gid=F_gojd0stADc4KjsNDbA-g&oh=00_AfEmHrgJ6qlaIpyY42SJJmFgEAJ9s_fRU0DN0ESQWrtmhQ&oe=67FB5EBF"

  },
  {
    id:6,
    month: "มีนาคม",
    title: "คิดแคปชั้นไม่ออกแต่รู้ว่างานนี้มีแซ่บแน่นอน ❤️‍🔥",
    shortDescription: "คิดแคปชั้นไม่ออกแต่รู้ว่างานนี้มีแซ่บแน่นอน ❤️‍🔥",
    fullDescription: "✨ถ้ายังไม่มีมาหาน้องแมวของเราได้ที่ร้าน Black Neko มีกิจกรรมพิเศษและโปรโมชั่นมากมายรอคุณอยู่ !📆 วันที่ 7-9 มีนาคมนี้ มาเจอกันนะคะ",
    date: "2025-03-04",
    imageUrl: "https://scontent.fbkk22-6.fna.fbcdn.net/v/t39.30808-6/481467651_122213267258082876_2231962411064002403_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_ohc=j6ED7RAY9DAQ7kNvwE2UgNG&_nc_oc=AdmzznBDy5Ketox_2FC6rGBbwFNSazpSoRJBGLkt060uNmOSOIqDc-LvWmSR25TtJCNRz4GjmZZHfcejD-BLPhJw&_nc_zt=23&_nc_ht=scontent.fbkk22-6.fna&_nc_gid=UdgwSiZ1SX1j_5GumReyEA&oh=00_AfF-1Gp56XnDCTvC3xvEnnHwkRttBR_8cJ6_06FkMn6KAw&oe=67FB39E4"
  },
  {
    id:7,
    month: "กุมภาพันธ์",
    title: "มีสาวออฟฟิศเป็นของตัวเองหรือยังคะ บอส💕",
    shortDescription: "มีสาวออฟฟิศเป็นของตัวเองหรือยังคะ บอส💕",
    fullDescription: "✨ถ้ายังไม่มีมาหาน้องแมวของเราได้ที่ร้าน Black Neko มีกิจกรรมพิเศษและโปรโมชั่นมากมายรอคุณอยู่ 📆 วันที่ 28-02 กุมภาพันธ์-มีนาคมนี้ มาเจอกันนะคะ😉__________📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈",
    date: "2025-02-28",
    imageUrl: "https://scontent.fbkk22-4.fna.fbcdn.net/v/t39.30808-6/480427178_122212152128082876_1253163742514356237_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_ohc=sUj-jSccJ_MQ7kNvwHWzCOU&_nc_oc=Admyzh7jskUu6PNjMKfvOb-977_hwxMhAPuWuHnavtjUmpjkPxlngZOdEoLr7wqy4qjHgRKe0Wf6LxU4SOx5bApf&_nc_zt=23&_nc_ht=scontent.fbkk22-4.fna&_nc_gid=8Ghbc3zwZ30T5tjFZG2XVQ&oh=00_AfG3dIHhQx6RNCjy8a_8hLlkWRvN9g7sdbxnGu5DFvbrmw&oe=67FB566C"
  },{
    id:8,
    month: "กุมภาพันธ์",
    title: "จะเรียกแมวให้เรียก ม้ะแอ้ะ แต่ถ้าเป็นเราให้เรียกที่ร้ากกกกก 💕",
    shortDescription: "มีสาวออฟฟิศเป็นของตัวเองหรือยังคะ บอส💕",
    fullDescription: "ประกาศกิจกรรมพร้อมโปรโมชั่นมากมายแล้วมาพบกันในวันแมวแห่งชาติปีนี้นะเมี๊ยววว 💘✨วาเลนไทน์ปีนี้ มาหาน้องแมวของเราได้ที่ร้าน Black Neko มีกิจกรรมพิเศษและโปรโมชั่นมากมายรอคุณอยู่ !📆 วันที่ 21-23 กุมภาพันธ์นี้ มาเจอกันนะคะ😉__________📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈",
    date: "2025-02-20",
    imageUrl: "https://scontent.fbkk22-1.fna.fbcdn.net/v/t39.30808-6/480280176_122211049568082876_6355771541738333526_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_ohc=RRAHJrYjpuYQ7kNvwFYBaRO&_nc_oc=AdmfsCgxJCELvZt69jsniud1lZpYQJTWg414E1pf-7gZ4MV810XFaRdIAznTFsVDXkEJE7j97arfoXom5d8O2pMd&_nc_zt=23&_nc_ht=scontent.fbkk22-1.fna&_nc_gid=mGw-ZhzNpwboM4OdAAYdYA&oh=00_AfHxZLLcq0w6pp7H5RgOhmx-c-4F4U3vicmiWNCLfy0REA&oe=67FB46A6"
  },{
    id:9,
    month: "กุมภาพันธ์",
    title: "🌹โดนเท มันทำให้ใจพัง เธอน่ารักจัง ทำให้ใจเซ~",
    shortDescription: "🌹โดนเท มันทำให้ใจพัง เธอน่ารักจัง ทำให้ใจเซ~",
    fullDescription: "✨วาเลนไทน์ปีนี้ มาหาน้องแมวของเราได้ที่ร้าน Black Neko มีกิจกรรมพิเศษและโปรโมชั่นมากมายรอคุณอยู่ !กระซิบว่ามีเมนูพิเศษด้วยล่ะ เมี๊ยวว~ 😼🫶🏻💕📆 วันที่ 14-16 กุมภาพันธ์นี้ มาเจอกันนะคะ😉__________📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈",
    date: "2025-02-13",
    imageUrl: "https://scontent.fbkk22-3.fna.fbcdn.net/v/t39.30808-6/476816821_122209565864082876_8254849815603945219_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_ohc=CubMecoSBZYQ7kNvwEKEY__&_nc_oc=AdninKhJUe9rkT8Jhtl6nRRliBZYvVi_nhEOSW-GTuzG0X4YmO2iznjxZtCRM763DplJdTtbejtYGH8YESdMbprs&_nc_zt=23&_nc_ht=scontent.fbkk22-3.fna&_nc_gid=vXZHCUc6QmmWzbxmgyYvAw&oh=00_AfF1oDLmEdPKDvn-pvMrV_BuhiSz3moKGhApFHfglrn1CA&oe=67FB5947"
  },{
    id:10,
    month: "กุมภาพันธ์",
    title: "👓 Glasses girl Event Promotion ✨",
    shortDescription: "👓 Glasses girl Event Promotion ✨",
    fullDescription: "✨โปรโมชั่นสุดพิเศษสำหรับวันที่ 7-9 กุมภาพันธ์นี้!• เครื่องดื่ม Omakase 2 แก้ว ฟรี! 1 แก้ว• Cheki 2 ใบ ฟรี! Chame 1 รูป (ถ่ายผ่านสมาร์ทโฟน)__________",
    date: "2025-02-09",
    imageUrl: "https://scontent.fbkk22-1.fna.fbcdn.net/v/t39.30808-6/476503929_122208685622082876_6594465195587605659_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_ohc=DOH5kKjcm-gQ7kNvwFUu4hy&_nc_oc=Adkmh3AgBNVynoZilvty_5p6twt5vzrzC4kQfFceC6Y-Hl4M0kFUjsmsJNPO0hf0lVN79aGXetL41kgY6uWcpuWM&_nc_zt=23&_nc_ht=scontent.fbkk22-1.fna&_nc_gid=ywN-1WNFXLdmexET7V0nJg&oh=00_AfEl_DkfySTBqkDx_r7eZQQzUJR0ooiaGyNE3gwPB-93GQ&oe=67FB4E44"

  },{
    id:11,
    month: "มกราคม",
    title: "อั่งเปาตั๋วไก้ ! 🧧",
    shortDescription: "อั่งเปาตั๋วไก้ ! 🧧",
    fullDescription: "🪭ตรุษจีนนี้ร้าน Black Neko มีกิจกรรมดีๆและโปรโมชั่นสุดพิเศษเพื่อคุณลูกค้าทุกท่านด้วยล่ะ รอติดตามกันเลย !📆 วันที่ 25ม.ค. - 2 ก.พ. มาเจอกันนะคะ😉__________📌มาร่วมสนุกได้ที่ร้าน Black Neko ชั้น 7 MBK อยู่ติดลิฟท์แก้วฝั่ง BTS สนามกีฬาแห่งชาติ🚈",
    date: "2025-01-28",
    imageUrl: "https://scontent.fbkk22-6.fna.fbcdn.net/v/t39.30808-6/474604804_122206903550082876_1328392196277115524_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=KT5KW8GCSKAQ7kNvwHp8ltR&_nc_oc=AdlaYBoV91DhpWd_ZlTwlD_GXVCpoiN_aOGOizGWPJqeS4NNxGf2-0HeZwoW80pdp8kpuoysRmj5q9oM-64sXMiK&_nc_zt=23&_nc_ht=scontent.fbkk22-6.fna&_nc_gid=OPwB-G0HUJFidn-k3jN3LA&oh=00_AfHiEDmDBdswR4REWSU1M152rovRGnzEMtQXFocEKx2OQQ&oe=67FB4CA2"
  },{
    id:12,
    month: "มกราคม",
    title: "🔔 Children’s day Event ! 10-12 มกราคม 2025 👶🏻",
    shortDescription: "🔔 Children’s day Event ! 10-12 มกราคม 2025 👶🏻",
    fullDescription: "👧🏻ก๊อกๆ วันเด็กปีนี้มีแมวเด็กอะยางงงงง 👀🔺เด็กๆพร้อมบุกที่ร้าน Black Neko แล้ว! พร้อมทั้งโปรโมชั่นสุดพิเศษอีกมากมาย! แล้วเจอกันนะเมี้ยวว ٩( ’ω‘ )و",
    date: "2025-01-12",
    imageUrl: "https://scontent.fbkk22-2.fna.fbcdn.net/v/t39.30808-6/476349256_122208961700082876_1914768088841280280_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_ohc=Y0eGkigDmTkQ7kNvwGEVjgp&_nc_oc=Adm28t1Hs1_DukZAdOjHaHaa4zFCinIrtXCwdCYPJ99qMsanbPFeT1PsZhPJoZzmhQj2FbInWE5CmnY0v1TeGlNz&_nc_zt=23&_nc_ht=scontent.fbkk22-2.fna&_nc_gid=Bl5jE-5WXvqhmuWoiwwpzg&oh=00_AfGpujUdfdWbmVT56GvTOkufgYbp0tRu4Qz3LRx2mg1aKA&oe=67FB339D"

  },{
    id:13,
    month: "มกราคม",
    title: "🔔 Miko Event ! 3-5 มกราคม 2025 🎌",
    shortDescription: "🔔 Miko Event ! 3-5 มกราคม 2025 🎌",
    fullDescription: "☀️ต้อนรับปีใหม่ด้วยหญิงสาวบริสุทธิ์ผู้มากความสามารถในชุดสีขาวแดง ♪🔺ร้าน Black Neko จะเต็มไปด้วยสาวๆมิโกะที่เก่งกาจ! พร้อมทั้งโปรโมชั่นสุดพิเศษอีกมากมาย! แล้วเจอกันนะเมี้ยวว ٩( ‘ω’ )و",
    date: "2025-01-02",
    imageUrl: "https://scontent.fbkk22-8.fna.fbcdn.net/v/t39.30808-6/475664602_122208115664082876_6250754780930417313_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=dM-lne4hOXgQ7kNvwFWK8wU&_nc_oc=Adl12zTld6sNTLUhbKRayUVK99IqfoSmqlyV6PiuOaaIthKuJV_MI66faT9ISqY9TxLUOr_uczST16TuodXwxMOp&_nc_zt=23&_nc_ht=scontent.fbkk22-8.fna&_nc_gid=o7MuSKFZdrtwOMMowOft_w&oh=00_AfE9KOaJEczH8G-6bHyhs2y23LPlQfcgIRrKxwSSzMcqIw&oe=67FB59BC"
    
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
    setIsDropdownOpen(false); // Close dropdown after selecting a month
  };

  const toggleExpand = (eventId) => {
    setExpandedEvents(prevState => ({
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

    <div style={{ marginTop: '100px' }}className="bg-white shadow-md">

      <div className="container mx-auto px-4 py-6">
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
                    className={`block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left ${activeMonth === month ? 'bg-gray-100' : ''}`}
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
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6"
                style={{ opacity: opacity, transition: 'opacity 1s ease-in-out' }}
              >
                <div className="md:w-1/3">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-80 object-cover rounded-lg mb-4 md:mb-0"
                  />
                </div>
                <div className="md:w-2/3">
                  <h2 className="text-2xl font-bold text-gray-800">{item.title}</h2>
                  <p className="text-sm text-gray-500 mb-4">{new Date(item.date).toLocaleDateString()}</p>
                  <p className="text-gray-700 mb-4">{item.shortDescription}</p>
                  {expandedEvents[item.id] ? (
                    <p className="text-gray-700">{item.fullDescription}</p>
                  ) : (
                    <p className="text-gray-700">{item.fullDescription.substring(0, 100)}... </p>
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