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


export default App; // หรือ export ตัว Component หลักของไฟล์นี้