import React, { useEffect, useState, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../pages/supabaseClient'; // ตรวจสอบ path ให้ถูกต้อง

const LoginNav = () => {
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null); // State สำหรับเก็บ URL รูปโปรไฟล์
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // เปลี่ยนชื่อ ref ให้สื่อความหมายมากขึ้น

  // Effect สำหรับจัดการการยืนยันตัวตน (Authentication State)
  useEffect(() => {
    // ดึง session ปัจจุบันเพื่อตั้งค่า user เริ่มต้น (ถ้ามี)
    const fetchInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    fetchInitialSession();

    // Listener สำหรับการเปลี่ยนแปลงสถานะการล็อกอิน
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Effect สำหรับดึง avatar_url เมื่อ user state เปลี่ยนแปลง
  useEffect(() => {
    let mounted = true; // ป้องกันการอัปเดต state บน component ที่ unmount แล้ว

    const fetchAvatar = async () => {
      if (user?.id && mounted) {
        try {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('avatar_url')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') { // PGRST116 หมายถึงไม่พบแถว (เป็นปกติถ้า user ยังไม่มี profile)
            console.error('LoginNav: Error fetching avatar:', error.message);
          }
          if (mounted) {
            setAvatarUrl(profileData?.avatar_url || null);
          }
        } catch (e) {
          if (mounted) {
            console.error('LoginNav: Exception fetching avatar:', e.message);
            setAvatarUrl(null); // กรณีเกิด exception อื่นๆ
          }
        }
      } else if (mounted) {
        setAvatarUrl(null); // ไม่มี user หรือ user.id ให้เคลียร์ avatarUrl
      }
    };

    fetchAvatar();

    return () => {
      mounted = false;
    };
  }, [user]); // ให้ useEffect นี้ทำงานใหม่ทุกครั้งที่ object `user` เปลี่ยนแปลง

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAvatarUrl(null); // เคลียร์ avatarUrl เมื่อ logout
    setDropdownOpen(false); // ปิด dropdown ด้วย
    navigate('/');
  };

  // ปิด dropdown เมื่อคลิกนอก dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div
        onClick={() => setDropdownOpen(prev => !prev)}
        className="cursor-pointer flex items-center justify-center rounded-full" // เพิ่ม rounded-full
        style={{ width: '28px', height: '28px' }} // กำหนดขนาดที่แน่นอนให้ container (ปรับขนาดได้ตามต้องการ)
      >
        {user && avatarUrl ? (
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="w-full h-full rounded-full object-cover" // ให้รูปภาพเต็ม, กลม, และ crop ถ้าสัดส่วนไม่พอดี
            onError={() => {
              // กรณี URL รูปภาพผิดพลาดหรือไม่สามารถโหลดได้ ให้กลับไปแสดงไอคอนเริ่มต้น
              console.warn("LoginNav: Failed to load avatar image.");
              setAvatarUrl(null);
            }}
          />
        ) : (
          <FaUserCircle size="100%" className="text-black dark:text-white" /> // ปรับขนาดให้เต็ม container
        )}
      </div>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 z-50 ring-1 ring-black ring-opacity-5">
          {!user ? (
            <Link
              to="/LoginPage"
              onClick={() => setDropdownOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              เข้าสู่ระบบ
            </Link>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.email}
                </p>
              </div>
              <Link
                to="/ProfilePage" // เปลี่ยนจาก DashboardPage เป็น ProfilePage
                onClick={() => setDropdownOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                โปรไฟล์
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-700 dark:hover:text-red-300"
              >
                ออกจากระบบ
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginNav;