import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// Import Icons
import { FaMapMarkerAlt, FaClock, FaDirections, FaPhoneAlt, FaStore } from 'react-icons/fa';

// Fix for default Leaflet marker icon
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let mapInstance = null;

    try {
      // Initialize map
      mapInstance = L.map(mapContainerRef.current).setView([13.7448, 100.5293], 17);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapInstance);

      // Custom Popup Design
      const popupContent = `
        <div class="text-center min-w-[200px] font-sans">
           <div class="bg-blue-600 text-white p-2 rounded-t-md -mt-4 -mx-5 mb-3">
             <h3 class="font-bold text-sm">BLACK NEKO</h3>
           </div>
           <p class="text-xs text-gray-700 font-bold">MBK Center ชั้น 7</p>
           <p class="text-xs text-gray-500 mt-1">โซน IT และ Gadget</p>
        </div>
      `;

      L.marker([13.7448, 100.5293])
        .addTo(mapInstance)
        .bindPopup(popupContent)
        .openPopup();

    } catch (error) {
      console.error('Map Error:', error);
    }

    return () => {
      if (mapInstance) mapInstance.remove();
    };
  }, []);

  return (
    // กำหนด bg-white และเอา overflow-hidden ออกถ้าไม่จำเป็น
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white text-gray-900 font-sans">
      
      {/* เอา Background Decor (วงกลมสี) ออกทั้งหมด เพื่อให้ขาวล้วน */}
      
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Information */}
          <div className="space-y-10 animate-fade-in-up">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6 border border-gray-200">
                <FaStore />
                <span>Visit Our Store</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight">
                พบกับเราได้ที่ <br />
                <span className="text-blue-600">
                  MBK Center
                </span>
              </h2>
              <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-lg">
                เราตั้งอยู่ที่ใจกลางกรุงเทพฯ เดินทางสะดวกด้วยรถไฟฟ้า BTS สถานีสนามกีฬาแห่งชาติ พร้อมให้บริการสินค้าไอทีครบวงจร
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-5">
              {/* Address */}
              <div className="flex items-start p-6 bg-white rounded-3xl shadow-sm border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all duration-300 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform duration-300">
                  <FaMapMarkerAlt size={22} />
                </div>
                <div className="ml-5">
                  <h4 className="text-xl font-bold text-gray-900">ที่อยู่ร้าน</h4>
                  <p className="text-gray-500 mt-2 leading-relaxed">
                    ชั้น 7 (โซน C) MBK Center, 444 ถ.พญาไท <br />
                    แขวงวังใหม่ เขตปทุมวัน กทม. 10330
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start p-6 bg-white rounded-3xl shadow-sm border border-gray-200 hover:border-green-200 hover:shadow-md transition-all duration-300 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform duration-300">
                  <FaClock size={22} />
                </div>
                <div className="ml-5">
                  <h4 className="text-xl font-bold text-gray-900">เวลาทำการ</h4>
                  <p className="text-gray-500 mt-2">
                    เปิดบริการทุกวัน: <span className="font-semibold text-green-600">10:00 - 22:00 น.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="https://goo.gl/maps/YOUR_REAL_LINK_HERE" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex justify-center items-center px-8 py-4 text-base font-bold text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300"
              >
                <FaDirections className="mr-2.5" />
                นำทาง Google Maps
              </a>
              <a
                href="tel:021234567" 
                className="flex-1 sm:flex-none inline-flex justify-center items-center px-8 py-4 text-base font-bold text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
              >
                <FaPhoneAlt className="mr-2.5 text-gray-400" />
                โทรสอบถาม
              </a>
            </div>
          </div>

          {/* Right Column: Map */}
          <div className="relative h-[550px] w-full">
            {/* กรอบแผนที่สีขาว */}
            <div className="absolute inset-0 bg-white rounded-[3rem] shadow-xl p-3 border border-gray-100">
               <div 
                 ref={mapContainerRef} 
                 className="w-full h-full rounded-[2.5rem] overflow-hidden z-10 relative"
               ></div>
            </div>
            
            {/* Badge ตกแต่ง (Open Now) */}
            <div className="absolute -bottom-8 -left-4 bg-white px-6 py-4 rounded-3xl shadow-lg border border-gray-100 hidden md:block animate-bounce-slow">
               <div className="flex items-center gap-3">
                 <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                 </span>
                 <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status</p>
                    <p className="text-sm font-black text-gray-900">Open Now</p>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MapComponent;