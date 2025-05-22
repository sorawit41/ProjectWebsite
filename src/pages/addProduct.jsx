// สมมติว่านี่คือไฟล์ที่คุณสร้างขึ้นมา เช่น src/utils/supabaseUtils.js
import { supabase } from './supabaseClient'; // ตรวจสอบ path ของคุณ

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
    console.error('Unexpected error:', err);
    return { success: false, error: err.message };
  }
}