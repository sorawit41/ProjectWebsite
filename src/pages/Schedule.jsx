import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Make sure this path is correct

const Schedule = () => {
  const [dynamicScheduleImageUrl, setDynamicScheduleImageUrl] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScheduleImage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('site_configurations')
          .select('config_value')
          .eq('config_key', 'current_schedule_image_url')
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: 'Single row not found'
          throw fetchError;
        }

        if (data && data.config_value) {
          setDynamicScheduleImageUrl(data.config_value);
        } else {
          setDynamicScheduleImageUrl(''); // Set to empty if no URL is found
          // You could set an error here if a schedule image is always expected
          // setError("ไม่พบรูปภาพตารางงานในระบบ");
        }
      } catch (err) {
        console.error("Error fetching schedule image URL:", err);
        setError("เกิดข้อผิดพลาดในการโหลดรูปภาพตารางงาน");
        setDynamicScheduleImageUrl('');
      } finally {
        setIsLoading(false);
      }
    };

    fetchScheduleImage();
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-20 text-gray-700 dark:text-gray-300">
        <p>Loading Schedule...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-20 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen pt-20 bg-white dark:bg-neutral-900">
      {dynamicScheduleImageUrl ? (
        <div className="p-4 md:p-8">
          <img
            src={dynamicScheduleImageUrl}
            alt="ตารางงาน" // Changed alt text to Thai
            className={`max-w-full max-h-[calc(100vh-10rem)] object-contain transition-opacity duration-1000 ease-in-out shadow-xl rounded-lg ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={handleImageLoad}
            onError={() => { // Handle broken image links
              setError("ไม่สามารถโหลดรูปภาพตารางงานได้จาก URL ที่ระบุ");
              setIsLoaded(true); // Stop spinner if image fails
              setDynamicScheduleImageUrl(''); // Clear broken URL
            }}
          />
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-2xl">📅</p>
          <p>ยังไม่มีตารางงานแสดงในขณะนี้</p>
        </div>
      )}
    </div>
  );
}

export default Schedule;