// OrderTrackingPage.js
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Import supabase client

// Helper function to get user-friendly text for verification status
function getVerificationStatusText(status, verificationResult) {
    // **Priority 1: Use the specific verificationResult if available (e.g., "Approved", "Rejected")**
    if (verificationResult) {
        // You might want to map specific values to more user-friendly text here too
        // For example, if verificationResult is "Approved", you might want to return "อนุมัติแล้ว"
        // For now, it will return the direct value like "Approved"
        if (verificationResult === 'Approved') {
            return 'อนุมัติแล้ว';
        }
        if (verificationResult === 'Rejected') {
            return 'ถูกปฏิเสธ';
        }
        if (verificationResult === 'Pending More Info') {
            return 'ต้องการข้อมูลเพิ่มเติม';
        }
        return verificationResult; // Returns the direct value like "Approved"
    }

    // Priority 2: Fallback to status-based messages if no specific verificationResult
    switch (status) {
        case 'payment_uploaded':
            return 'รอการตรวจสอบสลิป';
        case 'pending_confirmation':
            return 'รอการยืนยันคำสั่งซื้อ';
        case 'payment_verified':
            return 'การชำระเงินถูกต้อง';
        case 'payment_rejected':
            return 'การชำระเงินไม่ถูกต้อง (โปรดติดต่อ)';
        case 'processing':
            return 'กำลังเตรียมสินค้า'; // This might now be covered by an "Approved" verification_status
        case 'shipped':
            return 'จัดส่งแล้ว';
        case 'completed':
            return 'คำสั่งซื้อสำเร็จ';
        case 'cancelled':
            return 'คำสั่งซื้อถูกยกเลิก';
        default:
            return status || 'N/A';
    }
}


function OrderTrackingPage() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrderItems, setSelectedOrderItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchOrders() {
            try {
                setIsLoading(true);
                setError(null);

                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    setError('กรุณาเข้าสู่ระบบเพื่อดูคำสั่งซื้อ');
                    setIsLoading(false);
                    return;
                }

                const { data: ordersData, error: ordersError } = await supabase
                    .from('orders')
                    .select('*, orderItemsToInsert, verification_status') // Correctly fetching verification_status
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (ordersError) {
                    console.error("Supabase fetch orders error:", ordersError);
                    throw new Error(ordersError.message || ordersError.error_description);
                }

                setOrders(ordersData || []);

            } catch (err) {
                console.error("Failed to fetch orders:", err);
                setError("ไม่สามารถดึงข้อมูลคำสั่งซื้อได้: " + err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchOrders();
    }, []);

    const handleViewDetails = (orderId) => {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            setSelectedOrder(order);
            try {
                if (order.orderItemsToInsert) {
                    const items = JSON.parse(order.orderItemsToInsert);
                    setSelectedOrderItems(items);
                } else {
                    setSelectedOrderItems([]);
                }
            } catch (parseError) {
                console.error("Failed to parse order items JSON:", parseError);
                setSelectedOrderItems([]);
                setError("พบข้อผิดพลาดในการแสดงรายการสินค้าสำหรับคำสั่งซื้อนี้");
            }
        }
    };

    const handleBackToList = () => {
        setSelectedOrder(null);
        setSelectedOrderItems([]);
        setError(null);
    };

    if (isLoading) {
        return <div style={{ textAlign: 'center', padding: '20px', paddingTop: '120px' }}>กำลังโหลด...</div>;
    }

    if (error && !selectedOrder) {
         return <div style={{ color: 'red', textAlign: 'center', padding: '20px', paddingTop: '120px' }}>{error}</div>;
    }

    if (selectedOrder) {
        const contactInfo = selectedOrder.contact_info || {};
        // *** 🚩แก้ไขตรงนี้: ส่ง selectedOrder.verification_status เข้าไปในฟังก์ชันด้วย ***
        const verificationText = getVerificationStatusText(selectedOrder.status, selectedOrder.verification_status);


        return (
            <div
                className="container"
                style={{
                    maxWidth: '800px',
                    margin: '20px auto',
                    padding: '15px',
                    paddingTop: '120px',
                    border: '1px solid #ccc',
                    backgroundColor: '#f9f9f9'
                }}
            >
                <button onClick={handleBackToList} style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}>&lt; กลับไปที่รายการ</button>
                <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>รายละเอียดคำสั่งซื้อ #{selectedOrder.id.substring(0, 8)}</h2>

                <div style={{ marginBottom: '20px' }}>
                    <p><b>เลขที่คำสั่งซื้อเต็ม:</b> {selectedOrder.id}</p>
                    <p><b>วันที่สั่งซื้อ:</b> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                    <p><b>สถานะหลัก:</b> {selectedOrder.status}</p>
                    <p><b>ผลการตรวจสอบ:</b> {verificationText}</p> {/* <--- แสดงผลตรงนี้ */}
                    <p><b>ยอดรวม:</b> {selectedOrder.total_amount.toFixed(2)} บาท</p>
                    <p><b>ที่อยู่จัดส่ง:</b> {selectedOrder.shipping_address}</p>

                    <p style={{ marginTop: '15px' }}><b>ข้อมูลติดต่อ:</b></p>
                    <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                        {contactInfo.name && <li><b>ชื่อ:</b> {contactInfo.name}</li>}
                        {contactInfo.phone && <li><b>เบอร์โทร:</b> {contactInfo.phone}</li>}
                        {contactInfo.email && <li><b>อีเมล:</b> {contactInfo.email}</li>}
                    </ul>

                    {selectedOrder.slip_url && (
                        <div style={{ marginTop: '15px' }}>
                            <p><b>หลักฐานการชำระเงิน:</b></p>
                            <p><a href={selectedOrder.slip_url} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>ดูหลักฐาน</a></p>
                        </div>
                    )}
                </div>

                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>รายการสินค้า</h3>
                {error && selectedOrder && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

                {selectedOrderItems.length > 0 ? (
                    <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                        {selectedOrderItems.map((item, index) => (
                            <li key={index} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', backgroundColor: '#fff' }}>
                                <p style={{ margin: '0 0 5px 0' }}><b>{item.productName}</b> - {item.optionName}</p>
                                <p style={{ margin: '0 0 5px 0', fontSize: '0.9em', color: '#555' }}>จำนวน: {item.quantity} x {item.price.toFixed(2)} บาท</p>
                                <p style={{ margin: '0 0 5px 0', fontSize: '0.9em', color: '#555' }}>รวม: {(item.quantity * item.price).toFixed(2)} บาท</p>
                                {/* ... (โค้ดแสดง selectedOptionDetails) ... */}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>ไม่พบข้อมูลรายการสินค้าสำหรับคำสั่งซื้อนี้</p>
                )}
            </div>
        );
    }

    return (
        <div
            className="container"
            style={{
                maxWidth: '1000px',
                margin: '20px auto',
                paddingTop: '120px',
            }}
        >
            <h2>รายการคำสั่งซื้อของคุณ</h2>

            {orders.length === 0 && !isLoading ? (
                <p>คุณยังไม่มีคำสั่งซื้อ</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>เลขที่คำสั่งซื้อ</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>วันที่สั่งซื้อ</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>ยอดรวม</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>สถานะหลัก</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>ผลการตรวจสอบ</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>การจัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => {
                            // *** 🚩แก้ไขตรงนี้: ส่ง order.verification_status เข้าไปในฟังก์ชันด้วย ***
                            const verificationText = getVerificationStatusText(order.status, order.verification_status);

                            return (
                                <tr key={order.id} style={{ border: '1px solid #ddd' }}>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.id.substring(0, 8)}...</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.total_amount.toFixed(2)} บาท</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.status}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{verificationText}</td> {/* <--- แสดงผลตรงนี้ */}
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        <button onClick={() => handleViewDetails(order.id)} style={{ padding: '5px 10px', cursor: 'pointer' }}>
                                            ดูรายละเอียด
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default OrderTrackingPage;