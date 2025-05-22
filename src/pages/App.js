// ในไฟล์ตั้งค่า Router หลักของคุณ เช่น src/App.js

import React from 'react';
// ต้อง Import พวกนี้มาจาก react-router-dom
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// นำเข้า Component ที่จำเป็น
import ProductList from './ProductList'; // **ปรับ path ให้ถูกต้อง**
// เลือกใช้ Component ที่เหมาะสมสำหรับ Product Detail:
// ถ้าใช้เวอร์ชันที่ ProductDetail ดึงข้อมูลเอง ให้ใช้ Wrapper:
import ProductDetailWrapper from './ProductDetailWrapper'; // **ปรับ path ให้ถูกต้อง**
// ถ้าใช้เวอร์ชันที่ ProductDetail รับ product object มาตรงๆ ให้ใช้ Fetcher:
// import ProductDetailFetcher from './components/ProductDetailFetcher'; // **ปรับ path ให้ถูกต้อง**
// ถ้าใช้เวอร์ชัน ProductDetail ที่ดึงสินค้าแรกเองเมื่อไม่มี ID และรับ ID เป็น prop ด้วย:
// import ProductDetailSimplified from './pages/ProductDetailSimplified'; // **ปรับ path ให้ถูกต้อง**


function App() {
  return (
    <BrowserRouter> {/* ต้องมี BrowserRouter ครอบ Application ส่วนที่มี Route */}
      {/* ส่วนอื่นๆ ที่อยากให้แสดงทุกหน้า เช่น Header, Footer */}

      <Routes> {/* Container สำหรับ Route ทั้งหมด */}

        {/* Route สำหรับหน้าแสดงรายการสินค้า */}
        <Route path="/" element={<ProductList />} />
        {/* หรือ <Route path="/products" element={<ProductList />} /> */}

        {/* *** Route สำหรับหน้าแสดงรายละเอียดสินค้า - ส่วนนี้สำคัญมากและน่าจะเป็นต้นเหตุ 404 *** */}
        {/* path="/products/:productId" คือรูปแบบ URL ที่คาดหวัง */}
        {/* element คือ Component ที่จะแสดงเมื่อ URL ตรงกับ path */}
        {/* เลือกใช้ Component ที่เหมาะสมกับ Product Detail Component ของคุณ */}
        <Route path="/products/:productId" element={<ProductDetailWrapper />} />
        {/* หรือ <Route path="/products/:productId" element={<ProductDetailFetcher />} /> */}
        {/* หรือ <Route path="/products/:productId" element={<ProductDetailSimplified />} /> */}


        {/* Route สำหรับหน้าอื่นๆ ของคุณ */}
        {/* <Route path="/about" element={<About />} /> */}

        {/* Route สำหรับกรณีไม่พบหน้าอื่นๆ (เป็นตัวเลือก เสริม) */}
        {/* <Route path="*" element={<div>404 - Page Not Found</div>} /> */}

      </Routes>

      {/* ส่วนอื่นๆ ที่อยากให้แสดงทุกหน้า */}
    </BrowserRouter>
  );
}

// ถ้าคุณใช้ ProductDetail เวอร์ชั่นที่ดึงข้อมูลเอง (ต้องรับ productId ผ่าน prop)
// คุณจำเป็นต้องมี Wrapper Component นี้ เพื่อดึงค่า productId จาก URL parameter แล้วส่งให้ ProductDetail
// *** ตำแหน่งไฟล์ของ Wrapper component นี้ควรจะอยู่ตรงที่ import ข้างบนชี้ไป ***
/*
import { useParams } from 'react-router-dom';
// นำเข้า ProductDetail เวอร์ชั่นที่ดึงข้อมูลเอง
import ProductDetail from './pages/ProductDetail'; // **ปรับ path ให้ถูกต้อง**

function ProductDetailWrapper() {
  const { productId } = useParams(); // ดึงค่า productId จาก URL Parameter เช่น จาก "/products/bd4dcd9a..."

  // ส่งค่า productId ที่ดึงมา ให้กับ Component ProductDetail
  return <ProductDetail productId={productId} />;
}
*/

// ถ้าคุณใช้ ProductDetail เวอร์ชั่นที่รับ product object มาตรงๆ (ไม่ต้องดึงเอง)
// คุณจำเป็นต้องมี Fetcher component เพื่อดึงข้อมูลสินค้าด้วย ID แล้วส่งให้ ProductDetail
// *** ตำแหน่งไฟล์ของ Fetcher component นี้ควรจะอยู่ตรงที่ import ข้างบนชี้ไป ***
/*
import { useParams } from 'react-router-dom';
import { supabase } from './supabaseClient'; // ต้องใช้ supabase เพื่อ Fetch
import ProductDetail from './pages/ProductDetail'; // **ปรับ path ให้ถูกต้อง**

function ProductDetailFetcher() {
  const { productId } = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      // ... (โค้ด fetch จาก Supabase เหมือนใน useEffect ของ ProductDetail เดิม) ...
      setLoading(true);
      setError(null);
       const { data, error } = await supabase
         .from('products')
         .select('*')
         .eq('id', productId)
         .single();

       if (error) {
         console.error(`Error fetching product ${productId}:`, error);
         setError(error);
         setProductData(null);
       } else {
         setProductData(data);
       }
       setLoading(false);
    }

    if (productId) {
      fetchProduct();
    } else {
      setError({ message: "Product ID missing in URL." });
      setLoading(false);
    }

  }, [productId]); // Re-fetch when ID from URL changes

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">Error: {error.message}</div>;
  if (!productData) return <div className="text-center mt-20">Product not found.</div>;

  // ส่งข้อมูลที่ Fetch มาได้ ให้กับ ProductDetail ที่รับ product object
  return <ProductDetail product={productData} />;
}
*/


export default App; // หรือ export ตัว Component หลักของไฟล์นี้