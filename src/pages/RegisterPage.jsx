import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { supabase } from './supabaseClient'; // ตรวจสอบว่า path ถูกต้อง
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // ไอคอนสำหรับแสดง/ซ่อนรหัสผ่าน

const RegisterPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    // 1. ตรวจสอบความยาวรหัสผ่าน
    if (password.length < 6) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      setLoading(false);
      return;
    }

    // 2. ตรวจสอบว่ามีตัวอักษรตัวใหญ่อย่างน้อย 1 ตัว (เพิ่มใหม่)
    if (!/[A-Z]/.test(password)) {
      setError('รหัสผ่านต้องมีตัวอักษรภาษาอังกฤษตัวใหญ่อย่างน้อย 1 ตัว');
      setLoading(false);
      return;
    }

    // 3. ตรวจสอบรหัสผ่านให้ตรงกัน
    if (password !== confirmPassword) {
      setError('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (signUpError) {
      console.error('Registration error:', signUpError.message);
      if (signUpError.message.includes("User already registered")) {
        setError('อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น');
      } else if (signUpError.message.includes("Password should be at least 6 characters")) {
        setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      } else if (signUpError.message.includes("Password must contain at least one uppercase letter")) { // อาจจะมี error นี้จาก Supabase โดยตรง
        setError('รหัสผ่านต้องมีตัวอักษรภาษาอังกฤษตัวใหญ่อย่างน้อย 1 ตัว');
      }
      else {
        setError('เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง (ดู Console สำหรับรายละเอียด)');
      }
    } else {
      // ปรับปรุงข้อความให้ชัดเจนยิ่งขึ้นเรื่องการยืนยันอีเมล
      const userEmailForMessage = data?.user?.email || email; // ใช้ email จาก response ถ้ามี, หรือจาก state
      setMessage(
        `การลงทะเบียนเกือบเสร็จสมบูรณ์! โปรดตรวจสอบกล่องจดหมายของ ${userEmailForMessage} และคลิกลิงก์ยืนยันที่เราส่งไปให้เพื่อเปิดใช้งานบัญชีของคุณ`
      );
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      // navigate('/login'); // ยังคง comment ไว้เพื่อให้ผู้ใช้ไปยืนยันอีเมลก่อน
    }
  };

  return (
    // โค้ดส่วน JSX เหมือนเดิมกับที่คุณให้มาล่าสุด (รวมถึง bg-white และ py-20)
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-slate-900 p-4 font-sans transition-colors duration-300 py-20">
      <div
        className="w-full max-w-md bg-white/80 dark:bg-slate-800/70 backdrop-blur-lg shadow-2xl rounded-2xl p-8 sm:p-10 transform transition-all hover:scale-[1.01]"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white">
            สร้างบัญชีใหม่
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            เริ่มต้นการเดินทางของคุณกับเรา
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {error && (
            <div className="w-full p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900/50 dark:text-red-400 rounded-lg text-center animate-shake" role="alert">
              {error}
            </div>
          )}
          {message && (
            <div className="w-full p-3 text-sm text-green-700 bg-green-100 dark:bg-green-900/50 dark:text-green-400 rounded-lg text-center" role="alert">
              {message}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              อีเมล
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 dark:bg-slate-700/60 dark:text-white transition-shadow duration-300 focus:shadow-lg"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              รหัสผ่าน
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 dark:bg-slate-700/60 dark:text-white transition-shadow duration-300 focus:shadow-lg pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400"
                aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              >
                {showPassword ? <FaEyeSlash size={18}/> : <FaEye size={18}/>}
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">ความยาวอย่างน้อย 6 ตัวอักษร และมีตัวใหญ่ 1 ตัว</p> {/* ปรับปรุงคำแนะนำ */}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              ยืนยันรหัสผ่าน
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 dark:bg-slate-700/60 dark:text-white transition-shadow duration-300 focus:shadow-lg pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400"
                aria-label={showConfirmPassword ? "ซ่อนรหัสผ่านยืนยัน" : "แสดงรหัสผ่านยืนยัน"}
              >
                {showConfirmPassword ? <FaEyeSlash size={18}/> : <FaEye size={18}/>}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 font-semibold text-lg text-white rounded-xl shadow-lg transition-all duration-300 ease-in-out
                        ${loading
                          ? 'bg-slate-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transform hover:scale-105 active:scale-95'
                        }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                กำลังดำเนินการ...
              </div>
            ) : (
              'สมัครสมาชิก'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          มีบัญชีอยู่แล้ว?{' '}
          <RouterLink
            to="/LoginPage"
            className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 hover:underline"
          >
            เข้าสู่ระบบที่นี่
          </RouterLink>
        </p>
      </div>
       <footer className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
        &copy; {new Date().getFullYear()} BlackNeko. All rights reserved.
      </footer>
    </div>
  );
};

export default RegisterPage;