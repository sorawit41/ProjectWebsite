import React, { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaEye, FaEyeSlash, FaMoon, FaSun } from 'react-icons/fa'; // FaMoon, FaSun imports kept if toggleDarkMode is used elsewhere
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Ensure this path is correct
import logo from '../assets/logo/logo.png'; // Ensure this path is correct

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            console.error('Login error:', signInError.message);
            setError(signInError.message);
        } else {
            console.log('Login success:', data);
            navigate('/ProfilePage');
        }
    } catch (catchError) {
        console.error('Unexpected login error:', catchError);
        setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleOAuthLogin = async (provider) => {
    setError('');
    try {
        const { error: oauthError } = await supabase.auth.signInWithOAuth({ provider });
        if (oauthError) {
            console.error(`${provider} login error:`, oauthError.message);
            setError(oauthError.message);
        }
    } catch (catchError) {
        console.error(`Unexpected ${provider} login error:`, catchError);
        setError(`An unexpected error with ${provider} login. Please try again.`);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    //  👇  ปรับปรุงคลาสพื้นหลังตรงนี้
    <div className="flex justify-center items-center min-h-screen p-5 font-sans bg-white dark:bg-black transition-colors duration-300">
      <form
        className="bg-white dark:bg-black px-6 sm:px-8 py-10 rounded-2xl shadow-xl max-w-md w-full flex flex-col items-center transition-colors duration-300"
        onSubmit={handleLogin}
      >
        <img
          src={logo}
          alt="Logo"
          className="h-28 sm:h-30 w-auto mb-5 dark:invert transition-all duration-300"
        />

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 dark:text-gray-100 transition-colors duration-300">
          เข้าสู่ระบบ
        </h1>

        {error && (
          <p className="text-red-500 dark:text-red-400 mb-4 text-sm text-center transition-colors duration-300">
            {error}
          </p>
        )}

        <div className="relative w-full mb-5">
            <input
              type="email"
              placeholder="อีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-colors duration-300 placeholder-gray-500 dark:placeholder-gray-400"
            />
        </div>

        <div className="relative w-full mb-5">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-colors duration-300 placeholder-gray-500 dark:placeholder-gray-400"
          />
          <span
            onClick={togglePasswordVisibility}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-150"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </span>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold cursor-pointer mb-5 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-opacity-50"
        >
          เข้าสู่ระบบ
        </button>

        <div className="w-full flex justify-between mb-5 text-sm">
          <RouterLink to="/ForgotPasswordPage" className="text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-300">
            ลืมรหัสผ่าน?
          </RouterLink>
          <RouterLink to="/RegisterPage" className="text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-300">
            ลงทะเบียน
          </RouterLink>
        </div>

        <div className="flex items-center w-full my-5">
          <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600 transition-colors duration-300" />
          <span className="mx-2.5 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">หรือ</span>
          <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600 transition-colors duration-300" />
        </div>

        <div className="w-full flex flex-col space-y-3">
          <button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            className="flex items-center justify-center w-full py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-base font-medium cursor-pointer bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-opacity-50"
          >
            <FcGoogle className="mr-2 sm:mr-3" size={22} />
            เข้าสู่ระบบด้วย Google
          </button>

          <button
            type="button"
            onClick={() => handleOAuthLogin('facebook')}
            className="flex items-center justify-center w-full py-2.5 px-4 border border-transparent rounded-lg text-base font-medium cursor-pointer bg-[#1877f2] text-white hover:bg-[#166fe5] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1877f2] dark:focus:ring-blue-400 focus:ring-opacity-50"
          >
            <FaFacebook className="mr-2 sm:mr-3 text-white" size={22} />
            เข้าสู่ระบบด้วย Facebook
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;