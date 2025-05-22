// สมมติว่านี่คือ Component Form สำหรับเพิ่มสินค้าใหม่ (เช่น src/components/AddProductForm.jsx)
import React, { useState, useEffect } from 'react';
import { addProduct } from './supabaseUtils'; // Import ฟังก์ชันจากไฟล์ utils
import { supabase } from './supabaseClient'; // Import supabase client

// กำหนดรายชื่อ Cast ที่สามารถเลือกได้
const availableCasts = [
  'Momo', 'Mei', 'Cin', 'Azuki', 'Fukada', 'Narin', 'Tsuki', 'Cream',
  'Cornine', 'Fuwarun', 'Hamo', 'Icezu', 'Ivy', 'Kokoa', 'Miyuki', 'Mio',
  'Momoka', 'Moolek', 'Risa', 'Yuna', 'Hitomi', 'Maywa', 'Kurimi', 'Itsumi',
  'Ayse', 'Reka', 'Yumeko', 'Shiori', 'Tsubaki', 'Sora', 'Erika', 'Layra',
  'Nene', 'Saya', 'Sylvie'
];


function AddProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    type: '',
    product_cast: '', // เปลี่ยนค่าเริ่มต้นเป็น string ว่าง
    image_url: '',
  });
  const [status, setStatus] = useState(null);

  // State สำหรับตรวจสอบสิทธิ์ผู้ใช้
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // กำหนด UUID ของ Admin ที่ต้องการให้เข้าถึงได้
  const adminUserId = '96c80823-7af5-4a2b-a0de-ac35231db4a9'; // <-- ใส่ UUID Admin ของคุณตรงนี้

  // Effect สำหรับตรวจสอบสิทธิ์ผู้ใช้เมื่อ Component โหลด
  useEffect(() => {
    async function checkUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error.message);
        setUser(null);
      } else {
        setUser(user);
      }
      setLoadingAuth(false);
    }

    checkUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Adding product...');

    const productDataToSend = {
        ...formData,
        price: parseFloat(formData.price)
    };

    if (!user || user.id !== adminUserId) {
        setStatus('Access Denied: You are not authorized to add products.');
        return;
    }

    // *** ส่วนของการอัปโหลดรูปภาพจะเพิ่มตรงนี้ทีหลัง ***
    // ตอนนี้ยังคงใช้ image_url ที่กรอกใน input

    const result = await addProduct(productDataToSend);

    if (result.success) {
      setStatus('Product added successfully!');
      setFormData({ name: '', description: '', price: '', type: '', product_cast: '', image_url: '' });
    } else {
      setStatus(`Failed to add product: ${result.error}`);
    }
  };

  // แสดงผลเมื่อกำลังโหลดสิทธิ์ผู้ใช้
  if (loadingAuth) {
    return <div className="text-center mt-20 text-black dark:text-white">Checking access...</div>;
  }

  // ตรวจสอบว่าผู้ใช้ล็อกอินอยู่และเป็น Admin หรือไม่
  if (!user || user.id !== adminUserId) {
    return <div className="text-center mt-20 text-red-500">Access Denied: You do not have permission to view this page.</div>;
  }

  // ถ้าเป็น Admin ให้แสดงฟอร์ม
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-md shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">Add New Product</h2>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-black dark:text-white">Name:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-white text-black" />
      </div>
       <div>
        <label htmlFor="description" className="block text-sm font-medium text-black dark:text-white">Description:</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-white text-black"></textarea>
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-black dark:text-white">Price:</label>
        <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required step="0.01" className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-white text-black" />
      </div>
       <div>
        <label htmlFor="type" className="block text-sm font-medium text-black dark:text-white">Type:</label>
        <input type="text" id="type" name="type" value={formData.type} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-white text-black" />
      </div>

       {/* ส่วนเลือก Cast (Select Dropdown) */}
       <div>
         <label htmlFor="product_cast" className="block text-sm font-medium text-black dark:text-white">Cast:</label>
         <select
           id="product_cast"
           name="product_cast" // ชื่อต้องตรงกับใน formData
           value={formData.product_cast}
           onChange={handleChange} // ใช้ handleChange เดิมได้เลย
           className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-white text-black"
         >
           <option value="">-- Select Cast --</option> {/* ตัวเลือกว่างๆ เริ่มต้น */}
           {availableCasts.map(cast => (
             <option key={cast} value={cast}>{cast}</option> // วนลูปสร้าง options จาก array
           ))}
         </select>
       </div>


       {/* ส่วนกรอก Image URL (จะเปลี่ยนเป็น File Input ในขั้นตอนต่อไป) */}
       <div>
         <label htmlFor="image_url" className="block text-sm font-medium text-black dark:text-white">Image URL:</label>
         <input type="text" id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-white text-black" />
       </div>


      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
        Add Product
      </button>

      {status && <p className={`mt-4 text-sm ${status.startsWith('Failed') ? 'text-red-500' : 'text-green-500'}`}>{status}</p>}
    </form>
  );
}

export default AddProductForm;