import React, { useState, useEffect } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { supabase } from '../pages/supabaseClient'; // << ตรวจสอบว่า path ถูกต้อง

// Skeleton Loader Component สำหรับแสดงผลระหว่างรอโหลดข้อมูล
const SkeletonLoader = () => (
  <div className="w-full h-[400px] md:h-[600px] lg:h-[800px] bg-gray-200 dark:bg-gray-800 animate-pulse" />
);

const HeroBanner = () => {
  // State สำหรับเก็บข้อมูลสไลด์, สถานะการโหลด, และข้อผิดพลาด
  const [slidesData, setSlidesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ฟังก์ชันสำหรับดึงข้อมูล banner จากตาราง hero_banners
    const fetchBannerImages = async () => {
      setLoading(true);
      setError(null);

      try {
        // เปลี่ยนมาดึงข้อมูลจากตาราง 'hero_banners'
        // และเรียงลำดับตาม 'sort_order' (ถ้ามี) หรือ 'created_at'
        const { data, error: fetchError } = await supabase
          .from('hero_banners')
          .select('id, image_url, alt_text, link_url')
          .order('sort_order', { ascending: true }) // แนะนำให้เรียงตาม sort_order
          .order('created_at', { ascending: true }); // หรือเรียงตามวันที่สร้าง

        if (fetchError) {
          throw fetchError;
        }

        // จัดรูปแบบข้อมูลให้ตรงกับที่ Carousel ต้องการ
        const formattedSlides = data.map(banner => ({
          id: banner.id,
          src: banner.image_url,
          alt: banner.alt_text,
          link: banner.link_url, // เพิ่ม property สำหรับ link
        }));

        setSlidesData(formattedSlides);

      } catch (err) {
        console.error("Error fetching banner images:", err);
        setError("ไม่สามารถโหลดข้อมูล Banner ได้");
      } finally {
        setLoading(false);
      }
    };

    fetchBannerImages();
  }, []); // [] หมายถึงให้ useEffect ทำงานแค่ครั้งเดียว

  // --- การแสดงผลตามสถานะ ---

  // 1. กรณีกำลังโหลด
  if (loading) {
    return (
      <div className="relative w-full max-w-[1360px] mx-auto pt-20">
        <SkeletonLoader />
      </div>
    );
  }

  // 2. กรณีเกิดข้อผิดพลาด
  if (error) {
    return (
      <div className="relative w-full max-w-[1360px] mx-auto pt-20">
        <div className="w-full h-[400px] md:h-[600px] lg:h-[800px] bg-red-900 flex flex-col items-center justify-center text-center p-4 text-white">
            <p className="text-xl font-semibold">เกิดข้อผิดพลาด</p>
            <p>{error}</p>
        </div>
      </div>
    );
  }
  
  // 3. กรณีไม่มีข้อมูลที่จะแสดง
  if (!slidesData || slidesData.length === 0) {
     return (
       <div className="relative w-full max-w-[1360px] mx-auto pt-20">
        <div className="w-full h-[400px] md:h-[600px] lg:h-[800px] bg-gray-800 flex items-center justify-center text-center p-4 text-white">
            <p className="text-xl">ไม่มีรูปภาพสำหรับ Banner ในขณะนี้</p>
        </div>
      </div>
     )
  }

  // 4. แสดงผล Carousel เมื่อมีข้อมูลพร้อมแล้ว
  return (
    <div className="relative w-full max-w-[1360px] mx-auto pt-20">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showIndicators={true}
        showStatus={false}
        interval={5000}
        emulateTouch={true}
      >
        {slidesData.map((slide, index) => (
          <div key={slide.id} className="w-full h-[400px] md:h-[600px] lg:h-[800px] overflow-hidden bg-black">
            {/* ตรวจสอบว่ามี Link หรือไม่ ถ้ามี ให้สร้าง Tag <a> ครอบรูปภาพ */}
            {slide.link ? (
              <a href={slide.link} target="_blank" rel="noopener noreferrer">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'} // รูปแรกโหลดเลย รูปอื่นรอ
                />
              </a>
            ) : (
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroBanner;