import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    try {
      // สร้างแผนที่ Leaflet และกำหนดจุดศูนย์กลางและระดับการซูม
      const map = L.map(mapRef.current).setView([13.7448, 100.5293], 17);

      // เพิ่ม tile layer ของ OpenStreetMap พร้อมตัวเลือกการตกแต่ง
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        tileSize: 512,
        zoomOffset: -1,
      }).addTo(map);

      // เพิ่ม marker ที่ตำแหน่งของ MBK Center พร้อม popup ที่กำหนดเอง
      const mbkIcon = L.icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [35, 55], // ปรับขนาด marker
        iconAnchor: [17, 55], // ปรับตำแหน่ง anchor
        popupAnchor: [1, -45], // ปรับตำแหน่ง popup
        shadowSize: [55, 55], // ปรับขนาดเงา
      });

      L.marker([13.7448, 100.5293], { icon: mbkIcon })
        .addTo(map)
        .bindPopup(
          `
            <div style="text-align: center; font-size: 1.2em; border-radius: 10px; padding: 15px; background-color: white; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
              <b>MBK Center ชั้น 7</b><br>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNZd9q4a66wWGgSBnPX1JFuGbxxduk_mWwOA&s" alt="MBK Center Logo" style="width: 80px; margin-bottom: 10px;">
              <p>ศูนย์รวมสินค้าไอทีและอื่นๆ อีกมากมาย</p>
            </div>
          `
        )
        .openPopup();

      // ทำความสะอาดแผนที่เมื่อ component ถูก unmount
      return () => {
        map.remove();
      };
    } catch (error) {
      console.error('Error loading map:', error);
    }
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="container mx-auto px-1 py-2 ">
        <nav className="flex items-center justify-center">
          <div className="text-2xl font-semibold text-center ">แผนที่ทางไปร้าน</div>
        </nav>
      </div>

      {/* Map Container */}
      <div className="container mx-auto p-4">
        <div style={{ marginTop: '20px' }}>
          <div
            ref={mapRef}
            style={{
              height: '600px',
              width: '100%',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          ></div>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p className="text-lg font-semibold text-gray-800 mb-2">
              <b>ตั้งอยู่ใน:</b> เอ็มบีเค เซ็นเตอร์
            </p>
            <p className="text-base text-gray-700 mb-2">
              <b>ที่อยู่:</b> ชั้น 7 เอ็ม บี เค เซ็นเตอร์ แขวงวังใหม่ เขตปทุมวัน กรุงเทพมหานคร 10330
            </p>
            <p className="text-base text-gray-700">
              <b>เวลาทำการ:</b> เปิด ⋅ ปิด 16:00 (00:00) ยกเว้นเสาร์ อาทิตย์ เปิด 11:00 (00:00)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;