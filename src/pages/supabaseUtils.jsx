// src/utils/supabaseUtils.js (หรือ path ของคุณ)

import { supabase } from './supabaseClient'; // ตรวจสอบ path ของคุณให้ถูกต้อง!

// ฟังก์ชันสำหรับเพิ่มสินค้าใหม่ลงในตาราง products
export async function addProduct(productData) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData]) // ส่ง Object ข้อมูลสินค้าเข้าไป
      .select();

    if (error) {
      console.error('Error adding product:', error.message);
      return { success: false, error: error.message };
    } else {
      console.log('Product added successfully:', data);
      return { success: true, data: data[0] }; // คืนข้อมูลสินค้าที่เพิ่มเข้าไป (แถวแรก)
    }
  } catch (err) {
    console.error('Unexpected error in addProduct:', err);
    return { success: false, error: err.message };
  }
}


// *** เพิ่มฟังก์ชันนี้เข้าไปในไฟล์ supabaseUtils.js ***
// ฟังก์ชันสำหรับอัปโหลดรูปภาพไปยัง Supabase Storage
export async function uploadProductImage(file) {
  if (!file) return { success: false, error: 'No file selected.' };

  const fileExt = file.name.split('.').pop(); // ดึงนามสกุลไฟล์
  const fileName = `${Date.now()}.${fileExt}`; // ตั้งชื่อไฟล์ให้ไม่ซ้ำกัน (ใช้ timestamp)
  const filePath = `product-images/${fileName}`; // กำหนด path ที่จะเก็บใน Storage Bucket

  try {
    // อัปโหลดไฟล์
    const { data, error } = await supabase.storage
      .from('product-images') // <-- เปลี่ยน 'product-images' เป็นชื่อ Bucket ของคุณใน Supabase Storage
      .upload(filePath, file, {
        cacheControl: '3600', // ตั้งค่า cache
        upsert: false // ไม่อนุญาตให้อัปโหลดทับไฟล์เดิม
      });

    if (error) {
      console.error('Error uploading image:', error.message);
      return { success: false, error: error.message };
    }

    // ถ้าอัปโหลดสำเร็จ ดึง Public URL ของไฟล์นั้น
    const { data: publicUrlData } = supabase.storage
      .from('product-images') // <-- ใช้ชื่อ Bucket เดิม
      .getPublicUrl(filePath); // ใช้ filePath ที่อัปโหลดไป

    if (!publicUrlData || !publicUrlData.publicUrl) {
       console.error('Error getting public URL.');
       // อาจจะต้องลบไฟล์ที่อัปโหลดไปเมื่อกี้นี้ออกถ้าดึง URL ไม่ได้
       return { success: false, error: 'Could not get public URL after upload.' };
    }

    console.log('Image uploaded successfully. Public URL:', publicUrlData.publicUrl);
    return { success: true, publicUrl: publicUrlData.publicUrl }; // คืน Public URL

  } catch (err) {
    console.error('Unexpected error in uploadProductImage:', err);
    return { success: false, error: err.message };
  }
}