// CheckoutPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';

const CheckoutPage = () => {
    const location = useLocation();
    const cartItems = location.state?.cartItems || [];
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [shippingAddress, setShippingAddress] = useState('');
    const [contactInfo, setContactInfo] = useState({ name: '', phone: '', email: '' });
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [fetchingProfile, setFetchingProfile] = useState(false);

    // ... (calculations for subtotal, serviceCharge, vatAmount, finalTotal remain the same)
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const serviceChargeRate = 0.10;
    const vatRate = 0.07;
    const serviceCharge = subtotal * serviceChargeRate;
    const totalBeforeVat = subtotal + serviceCharge;
    const vatAmount = totalBeforeVat * vatRate;
    const finalTotal = totalBeforeVat + vatAmount;


    useEffect(() => {
        const fetchUserAndProfile = async () => {
            setFetchingProfile(true);
            const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

            if (authError) {
                console.error("Error fetching auth user:", authError);
                navigate('/LoginPage', { replace: true });
                setFetchingProfile(false);
                return;
            }

            if (authUser) {
                setUser(authUser);
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('full_name, phone, address')
                    .eq('id', authUser.id)
                    .single();

                if (profileError && profileError.code !== 'PGRST116') {
                    console.warn('Error fetching user profile:', profileError.message);
                } else if (profileData) {
                    setUserProfile(profileData);
                }
                if (!contactInfo.email && authUser.email) {
                    setContactInfo(prev => ({ ...prev, email: authUser.email }));
                }
            } else {
                navigate('/LoginPage', { replace: true });
            }
            setFetchingProfile(false);
        };
        fetchUserAndProfile();
    }, [navigate]);

    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
        setError(null);
    };

    const handleContactInfoChange = (e) => {
        setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
    };

    const handleUseProfileData = () => {
        if (userProfile) {
            setShippingAddress(userProfile.address || '');
            setContactInfo(prev => ({
                ...prev,
                name: userProfile.full_name || '',
                phone: userProfile.phone || '',
                email: prev.email || user?.email || ''
            }));
            setError(null);
        } else {
             setError('ไม่พบข้อมูลโปรไฟล์ที่บันทึกไว้ หรือยังไม่ได้โหลดข้อมูล');
        }
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        // ... (handleSubmitOrder logic remains the same)
        if (!user) {
            setError('User not authenticated. Please log in.');
            return;
        }
        if (cartItems.length === 0) {
            setError('ไม่พบสินค้าในตะกร้า');
            return;
        }
        if (!selectedFile) {
            setError('กรุณาอัปโหลดสลิปการชำระเงิน');
            return;
        }
        if (!shippingAddress.trim() || !contactInfo.name.trim() || !contactInfo.phone.trim()) {
            setError('กรุณากรอกข้อมูลที่อยู่และข้อมูลติดต่อ (ชื่อ, เบอร์โทร) ให้ครบถ้วน');
            return;
        }

        setUploading(true);
        setError(null);
        setSuccess(false);

        const orderId = uuidv4();
        const fileExtension = selectedFile.name.split('.').pop();
        const filePath = `${user.id}/${orderId}/${Date.now()}.${fileExtension}`;

        try {
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('paymentslips')
                .upload(filePath, selectedFile);

            if (uploadError) {
                throw new Error(`Failed to upload slip: ${uploadError.message || uploadError.error_description}`);
            }

            const { data: { publicUrl } } = supabase.storage
                .from('paymentslips')
                .getPublicUrl(filePath);

            if (!publicUrl) {
                throw new Error('Could not get public URL for the slip.');
            }

            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([
                    {
                        id: orderId,
                        user_id: user.id,
                        total_amount: parseFloat(finalTotal.toFixed(2)),
                        status: 'payment_uploaded',
                        shipping_address: shippingAddress.trim(),
                        contact_info: {
                            name: contactInfo.name.trim(),
                            phone: contactInfo.phone.trim(),
                            email: contactInfo.email?.trim() || null
                        },
                        slip_url: publicUrl,
                        orderItemsToInsert: JSON.stringify(cartItems),
                    },
                ])
                .select()
                .single();

            if (orderError) {
                const { error: removeError } = await supabase.storage.from('paymentslips').remove([filePath]);
                if (removeError) console.error('Failed to remove uploaded slip after order insert error:', removeError);
                throw new Error(`Failed to save order: ${orderError.message || orderError.error_description}`);
            }

            setSuccess(true);
            console.log('Order submitted successfully!', { order: orderData });

            const fileInput = document.getElementById('slip-upload');
            if (fileInput) fileInput.value = '';
            setSelectedFile(null);

        } catch (err) {
            console.error('Order submission failed:', err);
            setError(`การดำเนินการล้มเหลว: ${err.message || 'Unknown error'}`);
        } finally {
            setUploading(false);
        }
    };


    return (
        // Add dark:bg-gray-900 or your preferred dark background to the main container if the whole page should be dark
        <div className="max-w-3xl mx-auto px-4 pt-20 pb-10" style={{ paddingTop: '120px' }}>
            {/* Apply dark mode text colors to titles and general text as needed */}
            <h1 className="text-2xl font-bold mb-6 dark:text-gray-100">หน้าชำระเงิน</h1>

            {fetchingProfile && <div className="mb-4 text-gray-500 dark:text-gray-400 animate-pulse">กำลังโหลดข้อมูลผู้ใช้...</div>}
            {!fetchingProfile && user ? (
                 <div className="mb-6 text-gray-700 dark:text-gray-300">เข้าสู่ระบบในฐานะ: <span className="font-semibold dark:text-gray-100">{user.email}</span></div>
            ) : !fetchingProfile && (
                 <div className="mb-6 text-gray-500 dark:text-gray-400">กำลังตรวจสอบการเข้าสู่ระบบ...</div>
            )}

            {cartItems.length === 0 ? (
                <p className="text-red-600 font-semibold">ตะกร้าของคุณว่างเปล่า ไม่สามารถดำเนินการชำระเงินได้</p>
            ) : (
                <form onSubmit={handleSubmitOrder}>
                    {/* Cart Summary: Apply dark mode styles if needed */}
                    <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">สรุปรายการสินค้า ({cartItems.length} ชิ้น)</h2>
                    <ul className="border rounded-lg p-4 space-y-4 mb-6 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                        {cartItems.map((item, index) => (
                            <li key={index} className="flex justify-between items-start border-b pb-4 last:border-b-0 last:pb-0 dark:border-gray-700">
                                <div className="flex-grow pr-4">
                                    <div className="font-medium text-gray-900 dark:text-gray-100">{item.productName} - {item.optionName}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-0.5">
                                        <div>จำนวน: {item.quantity} x {item.price.toFixed(2)} ฿</div>
                                        {/* ... other item details, apply dark:text-gray-400 if needed ... */}
                                    </div>
                                </div>
                                <div className="font-bold text-gray-800 dark:text-gray-200 flex-shrink-0">{(item.quantity * item.price).toFixed(2)} ฿</div>
                            </li>
                        ))}
                    </ul>

                    {/* Total Breakdown: Apply dark mode styles if needed */}
                    <div className="mt-6 pt-4 border-t text-gray-900 dark:text-gray-200 dark:border-gray-700">
                        {/* ... total lines, apply dark:text-gray-300 or dark:text-gray-100 for emphasis ... */}
                         <div className="flex justify-between items-center text-lg mb-1">
                             <span>ยอดรวมสินค้า (Subtotal):</span>
                             <span>{subtotal.toFixed(2)} ฿</span>
                         </div>
                         <div className="flex justify-between items-center text-lg mb-1">
                             <span>Service Charge (10%):</span>
                             <span>{serviceCharge.toFixed(2)} ฿</span>
                         </div>
                          <div className="flex justify-between items-center text-lg font-semibold mb-1 dark:text-gray-100">
                             <span>ยอดรวมก่อน VAT:</span>
                             <span>{totalBeforeVat.toFixed(2)} ฿</span>
                         </div>
                         <div className="flex justify-between items-center text-lg mb-2">
                             <span>VAT (7%):</span>
                             <span>{vatAmount.toFixed(2)} ฿</span>
                         </div>
                         <div className="flex justify-between items-center font-bold text-xl text-orange-600 dark:text-orange-500 border-t pt-2 dark:border-gray-700">
                              <span>ยอดชำระทั้งหมด:</span>
                              <span>{finalTotal.toFixed(2)} ฿ THB</span>
                         </div>
                    </div>

                    {/* === BLOCK "ข้อมูลจากโปรไฟล์" WITH DARK MODE & MONOCHROME === */}
                    {user && !fetchingProfile && (
                        <div className="mt-8 p-4 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-800 dark:border-gray-600 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">ข้อมูลจากโปรไฟล์</h3>
                            {userProfile ? (
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                    พบข้อมูลที่อยู่และข้อมูลติดต่อในโปรไฟล์ของคุณ กดปุ่มเพื่อนำข้อมูลมาใช้
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                    ไม่พบข้อมูลที่อยู่ที่บันทึกไว้ในโปรไฟล์ หรือคุณยังไม่ได้กรอกข้อมูลในหน้าโปรไฟล์
                                </p>
                            )}
                            <button
                                type="button"
                                onClick={handleUseProfileData}
                                disabled={!userProfile}
                                className={`w-full sm:w-auto px-4 py-2 font-medium rounded-md transition-colors
                                    ${!userProfile
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400' // Disabled state
                                        : 'bg-black text-white hover:bg-gray-800 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300' // Enabled state
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 
                                    ${!userProfile ? 'focus:ring-gray-400' : 'focus:ring-black dark:focus:ring-gray-400'}`
                                }
                            >
                                {userProfile ? "ใช้ข้อมูลจากโปรไฟล์" : "ไม่พบข้อมูลโปรไฟล์"}
                            </button>
                        </div>
                    )}
                    {/* === END BLOCK === */}

                    {/* Shipping and Contact Info: Apply dark mode for inputs and labels */}
                    <div className="mt-6 p-4 border rounded-lg bg-white dark:bg-gray-800/50 dark:border-gray-700">
                         <h3 className="text-lg font-semibold mb-3 dark:text-gray-100">ข้อมูลจัดส่งและติดต่อ</h3>
                         {/* Name Input */}
                         <div className="mb-4">
                            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ชื่อ-นามสกุลผู้รับ*</label>
                            <input
                                type="text"
                                id="contactName"
                                name="name"
                                value={contactInfo.name}
                                onChange={handleContactInfoChange}
                                required
                                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                         </div>
                         {/* Phone Input */}
                          <div className="mb-4">
                            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">เบอร์โทรศัพท์*</label>
                            <input
                                type="tel"
                                id="contactPhone"
                                name="phone"
                                value={contactInfo.phone}
                                onChange={handleContactInfoChange}
                                required
                                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                         </div>
                         {/* Email Input */}
                          <div className="mb-4">
                            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">อีเมล (ถ้ามี)</label>
                            <input
                                type="email"
                                id="contactEmail"
                                name="email"
                                value={contactInfo.email}
                                onChange={handleContactInfoChange}
                                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                         </div>
                         {/* Address Input */}
                         <div className="mb-4">
                            <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ที่อยู่จัดส่ง*</label>
                            <textarea
                                id="shippingAddress"
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                required
                                rows="3"
                                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            ></textarea>
                         </div>
                    </div>

                    {/* Payment Method and Slip Upload: Apply dark mode styles */}
                    <div className="mt-8 p-4 border rounded-lg bg-white dark:bg-gray-800/50 dark:border-gray-700">
                         <h3 className="text-lg font-semibold mb-3 dark:text-gray-100">วิธีชำระเงิน (ตัวอย่าง: โอนเงินผ่านธนาคาร)</h3>
                         <p className="text-gray-700 dark:text-gray-300 mb-4">โปรดโอนเงินจำนวน <span className="font-bold text-orange-600 dark:text-orange-500">{finalTotal.toFixed(2)} ฿</span> ไปยังบัญชี ธนาคาร กสิกรไทย 172-1-25099-3 ชื่อบัญชี: บีแอลที.เวิลด์ จำกัด</p>
                         <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">** หลังจากโอนเงินแล้ว กรุณาอัปโหลดหลักฐานการโอน (สลิป) ด้านล่าง **</p>
                         <div className="mb-4">
                             <label htmlFor="slip-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">อัปโหลดสลิปการชำระเงิน*</label>
                             <input
                                 type="file"
                                 id="slip-upload"
                                 accept="image/*,application/pdf"
                                 onChange={handleFileSelect}
                                 required
                                 className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                             />
                             {selectedFile && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">ไฟล์ที่เลือก: {selectedFile.name}</p>}
                         </div>
                    </div>

                    {/* Submit Button: Consider dark mode for this button as well */}
                    <div className="mt-8">
                         {error && <p className="text-red-600 mb-4">{error}</p>}
                         {success && <p className="text-green-600 dark:text-green-400 font-semibold mb-4">ชำระเงินสำเร็จแล้ว! คำสั่งซื้อของคุณอยู่ในสถานะรอการตรวจสอบ</p>}
                         <button
                             type="submit"
                             className={`w-full px-4 py-3 text-lg font-semibold rounded transition-colors 
                                 ${uploading || cartItems.length === 0 || !user || success || !selectedFile || !shippingAddress.trim() || !contactInfo.name.trim() || !contactInfo.phone.trim() 
                                     ? 'bg-gray-400 text-white cursor-not-allowed dark:bg-gray-600 dark:text-gray-400' 
                                     : 'bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700'
                                 }`}
                             disabled={uploading || cartItems.length === 0 || !user || success || !selectedFile || !shippingAddress.trim() || !contactInfo.name.trim() || !contactInfo.phone.trim()}
                         >
                             {uploading ? 'กำลังดำเนินการ...' : (success ? 'ดำเนินการเรียบร้อย' : 'ยืนยันคำสั่งซื้อและอัปโหลดสลิป')}
                         </button>
                         {success && (
                              <div className="mt-4 text-center">
                                   <button onClick={() => navigate('/')} className="text-blue-600 hover:underline dark:text-blue-400 ml-4">กลับไปหน้าสินค้า</button>
                              </div>
                         )}
                    </div>
                </form>
            )}
        </div>
    );
};

export default CheckoutPage;