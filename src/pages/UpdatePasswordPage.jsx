import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

const UpdatePasswordPage = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  // ตรวจจับ access_token จาก URL (recovery)
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        setReady(true);
      } else {
        setMessage('ลิงก์หมดอายุหรือไม่ถูกต้อง');
      }
    };
    checkSession();
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage('เปลี่ยนรหัสผ่านไม่สำเร็จ: ' + error.message);
    } else {
      setMessage('เปลี่ยนรหัสผ่านสำเร็จ');
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>เปลี่ยนรหัสผ่าน</h2>
      {ready ? (
        <form onSubmit={handleUpdatePassword}>
          <input
            type="password"
            placeholder="รหัสผ่านใหม่"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', marginBottom: '10px' }}
          />
          <button type="submit" style={{ padding: '12px', width: '100%' }}>
            เปลี่ยนรหัสผ่าน
          </button>
        </form>
      ) : (
        <p style={{ color: 'red' }}>{message || 'กำลังโหลด...'}</p>
      )}
    </div>
  );
};

export default UpdatePasswordPage;
