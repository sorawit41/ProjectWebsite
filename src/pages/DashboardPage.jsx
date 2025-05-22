import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; // ตรวจสอบว่า path ถูกต้อง

const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: '20px',
    fontFamily: `'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
  },
  container: {
    maxWidth: '600px',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
    textAlign: 'center',
  },
  header: {
    marginBottom: '30px',
  },
  heading: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '10px',
  },
  subHeading: {
    fontSize: '16px',
    color: '#777',
    marginBottom: '30px',
  },
  userInfoSection: {
    textAlign: 'left',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    border: '1px solid #eee',
  },
  userInfoItem: {
    fontSize: '16px',
    marginBottom: '15px',
    color: '#555',
    display: 'flex',
    alignItems: 'center', // เพิ่มเพื่อให้ label และ input/text อยู่ในแนวเดียวกัน
  },
  userInfoLabel: {
    fontWeight: '600',
    minWidth: '140px', // กำหนดความกว้างขั้นต่ำของ label
    marginRight: '10px', // เพิ่มระยะห่างระหว่าง label และ input/text
  },
  inputField: { // สไตล์สำหรับ input fields
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px', // เพิ่มขนาด font ให้สอดคล้อง
  },
  button: {
    // marginTop: '20px', // ลบออกเพื่อให้ปุ่มอัปเดตอยู่ติดกับฟอร์ม
    padding: '12px 25px',
    backgroundColor: '#007bff', // เปลี่ยนสีปุ่มอัปเดตเป็นสีน้ำเงิน (ตัวอย่าง)
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    display: 'block', // ทำให้ปุ่มอัปเดตเป็น block element
    width: '100%', // ทำให้ปุ่มอัปเดตเต็มความกว้าง
    marginBottom: '15px', // เพิ่มระยะห่างด้านล่างของปุ่มอัปเดต
  },
  logoutButton: { // สไตล์แยกสำหรับปุ่ม Logout
    padding: '12px 25px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    display: 'block', // ทำให้ปุ่ม Logout เป็น block element
    width: '100%', // ทำให้ปุ่ม Logout เต็มความกว้าง
  },
  buttonHover: { // สไตล์ Hover สามารถใช้ร่วมกันได้ หรือแยกตามต้องการ
    // backgroundColor: '#0056b3', // ตัวอย่างสี Hover สำหรับปุ่มหลัก
    transform: 'scale(1.02)',
  },
  loadingText: {
    fontSize: '18px',
    color: '#555',
    marginTop: '30px',
  },
};

// เปลี่ยนชื่อ Component จาก DashboardPage เป็น ProfilePage
const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [isUpdateHovered, setIsUpdateHovered] = useState(false); // แยก state hover สำหรับแต่ละปุ่ม
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) {
        console.log('Error fetching user or no user logged in:', authError);
        navigate('/login'); // หรือหน้า Login ที่คุณกำหนด
      } else {
        setUser(authUser);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileError) {
          console.log('Error fetching profile:', profileError);
          // อาจจะตั้งค่า default profile หรือแสดงข้อความบางอย่าง
          // setProfile({}); // หรือปล่อยให้เป็น {} ตามเดิม
        } else {
          setProfile(profileData || {}); // ป้องกันกรณี profileData เป็น null
        }
      }
    };
    fetchUserAndProfile();
  }, [navigate]);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    if (!user) return; // ตรวจสอบว่ามี user object ก่อน

    const { full_name, phone } = event.target.elements;

    const updates = {
      id: user.id, // id ของ user คือ primary key และ foreign key ใน profiles
      full_name: full_name.value,
      phone: phone.value,
      updated_at: new Date(), // เพิ่ม timestamp การอัปเดต (ถ้ามี column นี้ใน table profiles)
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(updates, {
        // returning: "minimal", // Supabase V2 default
      });

    if (error) {
      alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูล: ' + error.message);
    } else {
      alert('อัปเดตข้อมูลสำเร็จ');
      // อัปเดต state ของ profile ทันทีเพื่อให้ UI แสดงผลข้อมูลใหม่
      setProfile(prevProfile => ({
        ...prevProfile,
        full_name: full_name.value,
        phone: phone.value,
      }));
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
      alert('เกิดข้อผิดพลาดในการออกจากระบบ');
    } else {
      navigate('/LoginPage'); // หรือ path ที่ถูกต้องไปยังหน้า Login
    }
  };

  const formatDate = (iso) => {
    if (!iso) return 'N/A';
    const date = new Date(iso);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.header}>
          {/* เปลี่ยนหัวข้อ */}
          <h1 style={styles.heading}>โปรไฟล์ผู้ใช้</h1>
          <p style={styles.subHeading}>จัดการข้อมูลส่วนตัวของคุณ</p>
        </div>

        {user ? (
          <>
            <form onSubmit={handleUpdateProfile}>
              <div style={styles.userInfoSection}>
                <div style={styles.userInfoItem}>
                  <span style={styles.userInfoLabel}>อีเมล:</span>
                  <span>{user.email}</span>
                </div>
                <div style={styles.userInfoItem}>
                  <span style={styles.userInfoLabel}>UID:</span>
                  <span>{user.id}</span>
                </div>
                <div style={styles.userInfoItem}>
                  <span style={styles.userInfoLabel}>ชื่อ-นามสกุล:</span>
                  <input
                    type="text"
                    name="full_name"
                    defaultValue={profile?.full_name || ''} // ใช้ optional chaining และ fallback
                    style={styles.inputField}
                    placeholder="กรอกชื่อ-นามสกุล"
                  />
                </div>
                <div style={styles.userInfoItem}>
                  <span style={styles.userInfoLabel}>เบอร์โทร:</span>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={profile?.phone || ''} // ใช้ optional chaining และ fallback
                    style={styles.inputField}
                    placeholder="กรอกเบอร์โทรศัพท์"
                  />
                </div>
                <div style={styles.userInfoItem}>
                  <span style={styles.userInfoLabel}>ลงทะเบียนเมื่อ:</span>
                  <span>{formatDate(user.created_at)}</span>
                </div>
                {/* สามารถเพิ่ม field อื่นๆ ของ profile ได้ตามต้องการ */}
                {/* เช่น profile?.username, profile?.bio เป็นต้น */}
              </div>

              <button
                type="submit"
                onMouseEnter={() => setIsUpdateHovered(true)}
                onMouseLeave={() => setIsUpdateHovered(false)}
                style={{
                  ...styles.button, // สไตล์ปุ่มหลัก
                  backgroundColor: '#007bff', // สีปุ่มอัปเดต
                  ...(isUpdateHovered ? { ...styles.buttonHover, backgroundColor: '#0056b3' } : {}),
                }}
              >
                อัปเดตข้อมูล
              </button>
            </form>

            <button
              onClick={handleLogout}
              onMouseEnter={() => setIsLogoutHovered(true)}
              onMouseLeave={() => setIsLogoutHovered(false)}
              style={{
                ...styles.logoutButton, // สไตล์ปุ่ม Logout
                ...(isLogoutHovered ? { ...styles.buttonHover, backgroundColor: '#c0392b' } : {}),
              }}
            >
              ออกจากระบบ
            </button>
          </>
        ) : (
          <div style={styles.loadingText}>กำลังโหลดข้อมูลผู้ใช้...</div>
        )}
      </div>
    </div>
  );
};

// export default DashboardPage; // เปลี่ยนเป็น ProfilePage
export default ProfilePage;