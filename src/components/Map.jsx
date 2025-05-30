import React, { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default Leaflet marker icon issue with Webpack/CRA
// (Optional, but often needed to display the default marker)
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
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Effect to detect dark mode changes from the <html> element
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Initial check
    setIsDarkMode(document.documentElement.classList.contains('dark'));

    return () => observer.disconnect();
  }, []);

  // Effect to initialize and clean up the Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let mapInstance = null;

    try {
      // Initialize the map with a view centered on MBK
      mapInstance = L.map(mapContainerRef.current).setView([13.7448, 100.5293], 17);

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstance);

      // Define a custom marker icon (using default for now, but easily replaceable)
      const mbkMarkerIcon = L.icon({
        iconUrl: markerIcon, // You can replace this with a custom SVG or PNG for MBK
        shadowUrl: markerShadow,
        iconSize: [38, 60], // Slightly larger icon
        iconAnchor: [19, 60],
        popupAnchor: [0, -55], // Adjust popup anchor
        shadowSize: [60, 60],
      });

      // Add the marker for MBK Center
      L.marker([13.7448, 100.5293], { icon: mbkMarkerIcon })
        .addTo(mapInstance)
        .bindPopup(
          `
          <div class="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300 transform hover:scale-105">
            <h3 class="text-lg font-bold mb-2 text-blue-600 dark:text-blue-400">MBK Center ชั้น 7</h3>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNZd9q4a66wWGgSBnPX1JFuGbxxduk_mWwOA&s" alt="MBK Center Logo" class="w-20 h-auto mx-auto my-3 rounded-full border-2 border-gray-200 dark:border-gray-700 shadow-sm">
            <p class="text-sm">ศูนย์รวมสินค้าไอทีและอื่นๆ อีกมากมาย</p>
            <a href="https://maps.app.goo.gl/YOUR_MBK_CENTER_Maps_LINK_HERE" target="_blank" rel="noopener noreferrer" class="mt-3 inline-block text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-500 font-medium">
              ดูเส้นทางบน Google Maps
            </a>
          </div>
          `
        )
        .openPopup();

    } catch (error) {
      console.error('Failed to load Leaflet map:', error);
      // Potentially display a fallback message to the user
    }

    // Cleanup function: remove the map when the component unmounts
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <section className="py-16 px-4 sm:px-8 lg:px-16 bg-gradient-to-br  dark:from-gray-900 dark:to-gray-950 transition-colors duration-500">
      {/* Title Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight animate-fade-in-down">
          📍 แผนที่ร้านของเรา
        </h2>
        <p className="mt-4 text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in-up">
          ค้นหาเส้นทางที่ง่ายที่สุดเพื่อมาเยี่ยมชมร้านเราที่เอ็มบีเค เซ็นเตอร์
        </p>
      </div>

      {/* Map Container */}
      <div className="w-full max-w-screen-xl mx-auto p-2 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl ring-4 ring-blue-500/50 dark:ring-blue-400/50 transform transition duration-500 hover:scale-[1.005] hover:shadow-3xl">
        <div
          ref={mapContainerRef}
          className="w-full h-[550px] sm:h-[700px] rounded-2xl overflow-hidden"
          aria-label="Interactive map showing the location of the store at MBK Center"
        ></div>
      </div>

      {/* Store Information */}
      <div className="text-center mt-12 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-xl mx-auto transform transition duration-500 hover:shadow-2xl">
        <p className="text-2xl font-bold text-gray-800 dark:text-white mb-3 flex items-center justify-center">
          <span className="text-red-600 dark:text-red-400 mr-2">🛍️</span>
          ตั้งอยู่ใน: <span className="text-red-600 font-extrabold ml-2">MBK Center</span>
        </p>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
          <b>ที่อยู่:</b> ชั้น 7 เอ็ม บี เค เซ็นเตอร์, แขวงวังใหม่, เขตปทุมวัน, กรุงเทพมหานคร 10330
        </p>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          <b>เวลาทำการ:</b>
          <span className="font-medium text-green-600 dark:text-green-400 block sm:inline-block mt-1 sm:mt-0">
            {' '}เปิดทุกวัน
          </span>
          <br className="sm:hidden" />
          <span className="block sm:inline-block">
            ⋅ <span className="font-semibold">จันทร์ - ศุกร์:</span> 10:00 - 22:00 น.
          </span>
          <br className="sm:hidden" />
          <span className="block sm:inline-block">
            ⋅ <span className="font-semibold">เสาร์ - อาทิตย์:</span> 11:00 - 22:00 น.
          </span>
        </p>
        <div className="mt-6">
          <a
            href="https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUqDggDEEUYJxg7GIAEGIoFMgYIABBFGDwyBggBEEUYPDIGCAIQRRg5Mg4IAxBFGCcYOxiABBiKBTIGCAQQIxgnMgoIBRAuGLEDGIAEMg0IBhAuGIMBGLEDGIAEMgYIBxBFGDzSAQg1NjA0ajBqNKgCALACAA&um=1&ie=UTF-8&fb=1&gl=th&sa=X&geocode=Kam3GEgAn-IwMdln3SBqwkmY&daddr=7th+floor,+MBK+Center,+Khwaeng+Wang+Mai,+Pathum+Wan,+Bangkok+10330" // **IMPORTANT: Replace with your actual Google Maps link**
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 102 0V8a1 1 0 00-1.445-.832l-3-2A1 1 0 005 6V4a1 1 0 00-1.555-.832l-3 2A1 1 0 000 6v4a1 1 0 002 0V8a1 1 0 00-1.445-.832l-3-2z" clipRule="evenodd" />
            </svg>
            เปิดใน Google Maps
          </a>
        </div>
      </div>
    </section>
  );
};

export default MapComponent;