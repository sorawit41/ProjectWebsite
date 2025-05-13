import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // เช็คการตั้งค่า dark mode ตาม class ของ <html>
    if (document.documentElement.classList.contains('dark')) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    try {
      const map = L.map(mapRef.current).setView([13.7448, 100.5293], 17);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        tileSize: 512,
        zoomOffset: -1,
      }).addTo(map);

      const mbkIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [35, 55],
        iconAnchor: [17, 55],
        popupAnchor: [1, -45],
        shadowSize: [55, 55],
      });

      L.marker([13.7448, 100.5293], { icon: mbkIcon })
        .addTo(map)
        .bindPopup(
          ` 
            <div style="text-align: center; font-size: 1.2em; border-radius: 10px; padding: 15px; background-color: white; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
              <b>MBK Center ชั้น 7</b><br>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNZd9q4a66wWGgSBnPX1JFuGbxxduk_mWwOA&s" alt="MBK Center Logo" style="width: 80px; margin: 10px 0;">
              <p>ศูนย์รวมสินค้าไอทีและอื่นๆ อีกมากมาย</p>
            </div>
          `
        )
        .openPopup();

      return () => {
        map.remove();
      };
    } catch (error) {
      console.error('Error loading map:', error);
    }
  }, []);

  return (
    <div className="py-16 px-4 sm:px-8 lg:px-16 bg-white dark:bg-black">
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          🗺️ แผนที่ทางไปร้าน
        </h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          ตำแหน่งของร้านใน MBK Center แบบชัดๆ เต็มหน้าจอ
        </p>
      </div>

      {/* Map */}
      <div className="w-full max-w-screen-2xl mx-auto">
        <div
          ref={mapRef}
          className="w-full h-[600px] rounded-xl shadow-xl"
        ></div>
      </div>

      {/* Store Info */}
      <div className="text-center mt-10">
        <p className="text-xl font-bold text-gray-800 dark:text-white mb-1">
          ตั้งอยู่ใน: <span className="text-red-600 font-semibold">เอ็มบีเค เซ็นเตอร์</span>
        </p>
        <p className="text-base text-gray-700 dark:text-gray-300">
          <b>ที่อยู่:</b> ชั้น 7 เอ็ม บี เค เซ็นเตอร์ แขวงวังใหม่ เขตปทุมวัน กรุงเทพฯ 10330
        </p>
        <p className="text-base text-gray-700 dark:text-gray-300">
          <b>เวลาทำการ:</b> เปิดทุกวัน ⋅ ปิด 16:00 (00:00)<br className="sm:hidden" />
          เสาร์-อาทิตย์ เปิด 11:00 (00:00)
        </p>
      </div>
    </div>
  );
};

export default Map;
