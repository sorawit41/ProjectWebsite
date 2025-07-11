// src/api/productService.js
import { supabase } from '../pages/supabaseClient'; // อ้างอิง supabaseClient.js

const PRODUCT_TABLE = 'products'; // ชื่อตารางสินค้าของคุณใน Supabase
const CASTS_TABLE = 'casts';     // ชื่อตารางน้องแมวของคุณใน Supabase

/**
 * ดึงข้อมูลสินค้าทั้งหมดจาก Supabase
 * @returns {Array} รายการสินค้า
 * @throws Error ถ้าเกิดข้อผิดพลาดในการดึงข้อมูล
 */
export async function fetchProducts() {
  try {
    // เลือกทุกคอลัมน์ (หรือระบุเฉพาะคอลัมน์ที่ต้องการ)
    const { data: products, error } = await supabase
      .from(PRODUCT_TABLE)
      .select('*')
      .order('id', { ascending: true }); // หรือเรียงตามลำดับที่คุณต้องการ

    if (error) {
      console.error("Error fetching products from Supabase:", error);
      throw new Error(`ไม่สามารถดึงข้อมูลสินค้าได้: ${error.message}`);
    }
    return products || [];
  } catch (error) {
    console.error("Caught error in fetchProducts:", error);
    throw error;
  }
}

/**
 * ดึงข้อมูล Cast Members ทั้งหมดจาก Supabase
 * @returns {Array} รายการ Cast Members (id, name, etc.)
 * @throws Error ถ้าเกิดข้อผิดพลาดในการดึงข้อมูล
 */
export async function fetchAllCasts() {
  try {
    const { data: casts, error } = await supabase
      .from(CASTS_TABLE)
      .select('id, name, rank, image_url'); // เลือกเฉพาะข้อมูลที่ ProductPage ต้องการ
      // อาจจะใช้ .select('*') ถ้าต้องการข้อมูลทั้งหมด
      // แต่ควรเลือกเท่าที่จำเป็นเพื่อประสิทธิภาพที่ดีขึ้น

    if (error) {
      console.error("Error fetching casts from Supabase:", error);
      throw new Error(`ไม่สามารถดึงข้อมูล Cast Members ได้: ${error.message}`);
    }
    return casts || [];
  } catch (error) {
    console.error("Caught error in fetchAllCasts:", error);
    throw error;
  }
}

/**
 * เพิ่มสินค้าใหม่ลงใน Supabase
 * @param {Object} productData ข้อมูลสินค้าที่จะเพิ่ม
 * @returns {Object} ข้อมูลสินค้าที่เพิ่มสำเร็จ
 * @throws Error ถ้าเพิ่มไม่สำเร็จ
 */
export async function addProduct(productData) {
  try {
    const { data, error } = await supabase
      .from(PRODUCT_TABLE)
      .insert([productData])
      .select(); // คืนค่าข้อมูลที่เพิ่มไป

    if (error) {
      console.error("Error adding product to Supabase:", error);
      throw new Error(`ไม่สามารถเพิ่มสินค้าได้: ${error.message}`);
    }
    return data[0]; // คืนค่าสินค้าที่เพิ่มไป
  } catch (error) {
    console.error("Caught error in addProduct:", error);
    throw error;
  }
}

/**
 * อัปเดตข้อมูลสินค้าใน Supabase
 * @param {string} productId ID ของสินค้าที่จะอัปเดต
 * @param {Object} updates ข้อมูลที่ต้องการอัปเดต
 * @returns {Object} ข้อมูลสินค้าที่อัปเดตสำเร็จ
 * @throws Error ถ้าอัปเดตไม่สำเร็จ
 */
export async function updateProduct(productId, updates) {
  try {
    const { data, error } = await supabase
      .from(PRODUCT_TABLE)
      .update(updates)
      .eq('id', productId)
      .select();

    if (error) {
      console.error("Error updating product in Supabase:", error);
      throw new Error(`ไม่สามารถอัปเดตสินค้าได้: ${error.message}`);
    }
    return data[0];
  } catch (error) {
    console.error("Caught error in updateProduct:", error);
    throw error;
  }
}

/**
 * ลบสินค้าจาก Supabase
 * @param {string} productId ID ของสินค้าที่จะลบ
 * @throws Error ถ้าลบไม่สำเร็จ
 */
export async function deleteProduct(productId) {
  try {
    const { error } = await supabase
      .from(PRODUCT_TABLE)
      .delete()
      .eq('id', productId);

    if (error) {
      console.error("Error deleting product from Supabase:", error);
      throw new Error(`ไม่สามารถลบสินค้าได้: ${error.message}`);
    }
    return true; // ลบสำเร็จ
  } catch (error) {
    console.error("Caught error in deleteProduct:", error);
    throw error;
  }
}