import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

const BUCKET_NAME = 'avatars';

// --- ไอคอน SVG แบบง่ายๆ ---
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);


const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Optional: Add a toggle function if you have a dark mode switch in the UI
  // const toggleDarkMode = () => setIsDarkMode(!isDarkMode);


  useEffect(() => {
    if (!selectedFile) {
      if (profile?.avatar_url) setAvatarPreview(profile.avatar_url);
      else setAvatarPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setAvatarPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile, profile?.avatar_url]);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) {
        navigate('/LoginPage');
      } else {
        setUser(authUser);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
        } else {
          setProfile(profileData || {});
          if (profileData?.avatar_url && !selectedFile) {
            setAvatarPreview(profileData.avatar_url);
          }
        }
      }
    };
    fetchUserAndProfile();
  }, [navigate, selectedFile]); // `selectedFile` dependency here might be redundant if avatar_url is only from profile

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    if (!user) return;

    const { full_name, phone, username, bio, address } = event.target.elements;
    const updates = {
      id: user.id,
      full_name: full_name.value,
      phone: phone.value,
      username: username.value,
      bio: bio.value,
      address: address.value,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profiles').upsert(updates, { onConflict: 'id' });

    if (error) {
      console.error("Error updating profile:", error);
      alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูลโปรไฟล์: ' + error.message);
    } else {
      alert('อัปเดตข้อมูลโปรไฟล์สำเร็จ!');
      setProfile(prevProfile => ({ ...prevProfile, ...updates }));
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert("ขนาดไฟล์เกิน 2MB กรุณาเลือกไฟล์ใหม่");
        event.target.value = null; setSelectedFile(null); return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        alert("รองรับเฉพาะไฟล์ JPG, PNG, และ GIF เท่านั้น");
        event.target.value = null; setSelectedFile(null); return;
      }
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      if (profile?.avatar_url) setAvatarPreview(profile.avatar_url); else setAvatarPreview(null);
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile || !user) {
      alert("กรุณาเลือกไฟล์รูปภาพก่อน"); return;
    }
    setIsUploadingAvatar(true);
    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `avatar_${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filePath, selectedFile, { cacheControl: '3600', upsert: true });
      if (uploadError) throw uploadError;
      const { data: publicURLData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
      const timestampedAvatarUrl = `${publicURLData.publicUrl}?t=${new Date().getTime()}`;
      const { error: updateProfileError } = await supabase.from('profiles').update({ avatar_url: timestampedAvatarUrl, updated_at: new Date().toISOString() }).eq('id', user.id);
      if (updateProfileError) throw updateProfileError;
      setProfile(prev => ({ ...prev, avatar_url: timestampedAvatarUrl, updated_at: new Date().toISOString() }));
      setSelectedFile(null);
      setAvatarPreview(timestampedAvatarUrl); // Ensure preview updates to the new Supabase URL
      alert("อัปโหลดรูปโปรไฟล์สำเร็จ!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert(`เกิดข้อผิดพลาดในการอัปโหลดรูป: ${error.message || String(error)}`);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert('เกิดข้อผิดพลาดในการออกจากระบบ: ' + error.message);
    else navigate('/LoginPage');
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'ยังไม่ระบุ';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return 'รูปแบบวันที่ไม่ถูกต้อง';
      return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
    } catch (e) { return 'รูปแบบวันที่ไม่ถูกต้อง'; }
  };

  const getInitials = (name) => {
    if (!name && user?.email) return user.email.charAt(0).toUpperCase();
    if (!name) return '?';
    const names = name.trim().split(/\s+/).filter(Boolean);
    if (names.length > 1) return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    return names[0] ? names[0].charAt(0).toUpperCase() : '?';
  };

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-900 p-5 font-inter transition-colors duration-300">
        <svg className="animate-spin h-12 w-12 text-sky-600 dark:text-sky-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl text-slate-700 dark:text-slate-300">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  const ProfileInput = ({ id, label, type = 'text', placeholder, defaultValue, ...props }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 outline-none transition-all duration-150 ease-in-out shadow-sm"
        {...props}
      />
    </div>
  );

  const ProfileTextarea = ({ id, label, placeholder, defaultValue, rows = 4 }) => (
     <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {label}
        </label>
        <textarea
            id={id}
            name={id}
            defaultValue={defaultValue}
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 outline-none transition-all duration-150 ease-in-out shadow-sm min-h-[100px] resize-y"
            placeholder={placeholder}
            rows={rows}
        />
     </div>
  );


  return (
<div className="min-h-screen bg-white dark:bg-slate-900 py-20 px-4 sm:px-6 lg:px-8 font-inter transition-colors duration-300">
    <div className="container mx-auto max-w-screen-xl">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">
            ตั้งค่าโปรไฟล์
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            จัดการข้อมูลส่วนตัวและข้อมูลบัญชีของคุณ
          </p>
        </header>

        <div className="lg:flex lg:gap-8">
          {/* --- Left Column (Sidebar) --- */}
          <aside className="lg:w-1/3 xl:w-1/4 mb-8 lg:mb-0">
            <div className="sticky top-8 bg-white dark:bg-slate-800/70 backdrop-blur-md p-6 rounded-xl shadow-xl flex flex-col items-center text-center">
              <div className="relative group mb-4">
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-sky-100 dark:bg-sky-700 text-sky-600 dark:text-sky-300 flex justify-center items-center text-5xl font-bold uppercase overflow-hidden ring-4 ring-white dark:ring-slate-700 shadow-md">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(profile?.full_name)
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute inset-0 w-full h-full bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  title="เปลี่ยนรูปโปรไฟล์"
                >
                  <UploadIcon /> เปลี่ยนรูป
                </button>
              </div>
              <input
                type="file" accept="image/jpeg, image/png, image/gif"
                ref={fileInputRef} onChange={handleFileChange}
                className="hidden" disabled={isUploadingAvatar}
              />
              
              {selectedFile && !isUploadingAvatar && (
                <button
                  onClick={handleAvatarUpload}
                  className="w-full mt-3 mb-2 py-2 px-4 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-medium transition-colors duration-300 shadow flex items-center justify-center"
                >
                  <SaveIcon /> บันทึกรูปนี้
                </button>
              )}
              {isUploadingAvatar && (
                <p className="text-sm text-sky-600 dark:text-sky-400 mt-2 animate-pulse">กำลังอัปโหลด...</p>
              )}

              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mt-2 truncate w-full" title={profile?.full_name || user.email}>
                {profile?.full_name || user.email?.split('@')[0] || 'ผู้ใช้งาน'}
              </h2>
              {profile?.username && (
                <p className="text-sm text-sky-600 dark:text-sky-400 font-medium">@{profile.username}</p>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate w-full" title={user.email}>{user.email}</p>
              
              {profile?.bio && (
                 <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 w-full max-h-20 overflow-y-auto text-left">
                    {profile.bio}
                 </p>
              )}

              <button
                onClick={handleLogout}
                className="w-full mt-6 py-2.5 px-4 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors duration-300 shadow flex items-center justify-center"
              >
                <LogoutIcon /> ออกจากระบบ
              </button>
            </div>
          </aside>

          {/* --- Right Column (Main Content) --- */}
          <main className="lg:w-2/3 xl:w-3/4">
            <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-slate-800/70 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-xl space-y-8">
              {/* Personal Information Section */}
              <section>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-1">ข้อมูลส่วนตัว</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">อัปเดตข้อมูลส่วนตัวของคุณที่นี่</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileInput id="full_name" label="ชื่อ-นามสกุล:" placeholder="เช่น สมชาย ใจดี" defaultValue={profile?.full_name || ''} />
                  <ProfileInput id="username" label="ชื่อผู้ใช้ (Username):" placeholder="เช่น somchai_jaidee" defaultValue={profile?.username || ''} />
                  <ProfileInput id="phone" label="เบอร์โทร:" type="tel" placeholder="081xxxxxxx" defaultValue={profile?.phone || ''} />
                  <ProfileInput id="address" label="ที่อยู่:" placeholder="บ้านเลขที่, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์" defaultValue={profile?.address || ''} />
                </div>
              </section>

              {/* Bio Section */}
              <section>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-1">เกี่ยวกับฉัน (Bio)</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">เล่าเรื่องราวเกี่ยวกับตัวคุณให้คนอื่นได้รู้จัก</p>
                <ProfileTextarea id="bio" label="" placeholder="เขียนเกี่ยวกับตัวคุณ..." defaultValue={profile?.bio || ''} />
              </section>
              
              <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                <button
                  type="submit"
                  disabled={isUploadingAvatar}
                  className="py-2.5 px-6 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-base font-medium transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  <SaveIcon /> บันทึกการเปลี่ยนแปลง
                </button>
              </div>
            </form>

            {/* Account Information Section */}
            <section className="mt-8 bg-white dark:bg-slate-800/70 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-xl">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-1">ข้อมูลบัญชี</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">ข้อมูลเหล่านี้ไม่สามารถแก้ไขได้</p>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-600 dark:text-slate-400">User ID (UID):</span>
                  <span className="text-slate-700 dark:text-slate-300 break-all text-right">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-600 dark:text-slate-400">ลงทะเบียนเมื่อ:</span>
                  <span className="text-slate-700 dark:text-slate-300">{formatDate(user.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-600 dark:text-slate-400">อัปเดตโปรไฟล์ล่าสุด:</span>
                  <span className="text-slate-700 dark:text-slate-300">{formatDate(profile?.updated_at)}</span>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;