// AdminOrderManagementPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient'; // ตรวจสอบว่า path ถูกต้อง

const ADMIN_USER_ID = '96c80823-7af5-4a2b-a0de-ac35231db4a9';

const VERIFICATION_OPTIONS = [
    { value: '', label: '-- เลือกผลการตรวจสอบ --' },
    { value: 'อนุมัติ', label: 'อนุมัติ (Approved)' },
    { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ (Rejected)' },
    { value: 'ตรวจสอบเพิ่มเติม', label: 'ตรวจสอบเพิ่มเติม (Needs Further Review)' },
];

const LIST_FILTER_OPTIONS = [
    { value: 'pending', label: 'คำสั่งซื้อที่ต้องตรวจสอบ' },
    { value: 'approved', label: 'คำสั่งซื้อที่อนุมัติแล้ว' },
    { value: 'rejected', label: 'คำสั่งซื้อที่ไม่อนุมัติ' },
];

function AdminOrderManagementPage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [pendingOrders, setPendingOrders] = useState([]);
    const [approvedOrders, setApprovedOrders] = useState([]);
    const [rejectedOrders, setRejectedOrders] = useState([]);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrderItems, setSelectedOrderItems] = useState([]);
    const [error, setError] = useState(null);
    const [actionMessage, setActionMessage] = useState('');
    const [verificationStatusInput, setVerificationStatusInput] = useState('');
    const [listFilter, setListFilter] = useState('pending');

    const fetchOrdersForReview = useCallback(async () => {
        try {
            console.log("Fetching orders requiring admin review...");
            const { data, error: fetchError } = await supabase
                .from('orders')
                .select('*, orderItemsToInsert, verification_status')
                .or('verification_status.is.null,verification_status.eq.ตรวจสอบเพิ่มเติม')
                .order('created_at', { ascending: true });

            if (fetchError) throw fetchError;
            setPendingOrders(data || []);
            console.log(`Workspaceed ${data ? data.length : 0} orders requiring review.`);
        } catch (err) {
            console.error("Error fetching orders for review:", err);
            setError(prev => (prev ? prev + "\n" : "") + "ไม่สามารถดึงข้อมูลคำสั่งซื้อสำหรับตรวจสอบได้: " + err.message);
        }
    }, []);

    const fetchApprovedOrders = useCallback(async () => {
        try {
            console.log("Fetching approved orders...");
            const { data, error: fetchError } = await supabase
                .from('orders')
                .select('*, orderItemsToInsert, verification_status')
                .eq('verification_status', 'อนุมัติ')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setApprovedOrders(data || []);
            console.log(`Workspaceed ${data ? data.length : 0} approved orders.`);
        } catch (err) {
            console.error("Error fetching approved orders:", err);
            setError(prev => (prev ? prev + "\n" : "") + "ไม่สามารถดึงข้อมูลคำสั่งซื้อที่อนุมัติแล้วได้: " + err.message);
        }
    }, []);

    const fetchRejectedOrders = useCallback(async () => {
        try {
            console.log("Fetching rejected orders...");
            const { data, error: fetchError } = await supabase
                .from('orders')
                .select('*, orderItemsToInsert, verification_status')
                .eq('verification_status', 'ไม่อนุมัติ')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setRejectedOrders(data || []);
            console.log(`Workspaceed ${data ? data.length : 0} rejected orders.`);
        } catch (err) {
            console.error("Error fetching rejected orders:", err);
            setError(prev => (prev ? prev + "\n" : "") + "ไม่สามารถดึงข้อมูลคำสั่งซื้อที่ไม่อนุมัติ: " + err.message);
        }
    }, []);

    useEffect(() => {
        async function checkAuthAndFetchData() {
            setIsLoading(true);
            setError(null);
            setActionMessage('');
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            if (user && user.id === ADMIN_USER_ID) {
                setIsAuthorized(true);
                await Promise.all([
                    fetchOrdersForReview(),
                    fetchApprovedOrders(),
                    fetchRejectedOrders()
                ]);
            } else {
                setIsAuthorized(false);
                setError(user ? "คุณไม่ได้รับสิทธิ์ให้เข้าถึงหน้านี้" : "กรุณาเข้าสู่ระบบ");
            }
            setIsLoading(false);
        }
        checkAuthAndFetchData();
    }, [fetchOrdersForReview, fetchApprovedOrders, fetchRejectedOrders]);

    const handleSelectOrder = (order) => {
        setSelectedOrder(order);
        const currentStatus = order.verification_status || '';
        // Ensure that if currentStatus from DB is null, it maps to '' for the dropdown's "no selection" or default state
        // if VERIFICATION_OPTIONS includes an option for value: null. Otherwise, an empty string is a good default.
        const dropdownValue = VERIFICATION_OPTIONS.some(opt => opt.value === currentStatus) ? currentStatus : '';
        setVerificationStatusInput(dropdownValue);

        setActionMessage('');
        try {
            if (order.orderItemsToInsert) {
                const items = JSON.parse(order.orderItemsToInsert);
                setSelectedOrderItems(items);
            } else {
                setSelectedOrderItems([]);
            }
        } catch (parseError) {
            console.error("Failed to parse order items for admin:", parseError);
            setSelectedOrderItems([]);
            setError(prev => (prev ? prev + "\n" : "") + "เกิดข้อผิดพลาดในการแสดงรายการสินค้าของคำสั่งซื้อนี้");
        }
    };

    const handleSubmitVerificationStatus = async () => {
        if (!selectedOrder) {
            setError("กรุณาเลือกคำสั่งซื้อก่อนทำการบันทึก");
            return;
        }
        // Allow saving even if verificationStatusInput is empty if you want to reset to "not verified"
        // However, the VERIFICATION_OPTIONS starts with "" as "--เลือกผลการตรวจสอบ--" so this check is likely still desired
        if (verificationStatusInput.trim() === "" && !VERIFICATION_OPTIONS.find(opt => opt.value === verificationStatusInput)?.allowEmptySave) { // Example if some options could be empty string intentionally
             setError("กรุณาเลือกผลการตรวจสอบจากDropdown");
             return;
        }


        setIsSubmitting(true);
        setActionMessage('');
        console.log(`Attempting to update order ID: ${selectedOrder.id} with verification_status: "${verificationStatusInput}"`);

        try {
            const { data, error: updateError } = await supabase
                .from('orders')
                .update({ verification_status: verificationStatusInput === '' ? null : verificationStatusInput }) // Save null if dropdown is reset to "--เลือก--"
                .eq('id', selectedOrder.id)
                .select();

            if (updateError) throw updateError;

            if (data && data.length > 0) {
                const updatedOrderFromServer = data[0];
                setActionMessage(`ผลการตรวจสอบสำหรับคำสั่งซื้อ #${selectedOrder.id.substring(0,8)} ถูกบันทึกเป็น: "${updatedOrderFromServer.verification_status || 'ยังไม่ได้ตรวจสอบ'}" เรียบร้อยแล้ว`);

                await Promise.all([
                    fetchOrdersForReview(),
                    fetchApprovedOrders(),
                    fetchRejectedOrders()
                ]);
                
                // If the item is now in a "final" state (approved/rejected) AND the current list filter
                // is NOT for that state, it implies the item has "moved" from the user's perspective.
                // Or, if its state changed such that it wouldn't appear in the current list anymore.
                // For simplicity, if it becomes approved/rejected, we clear. If it becomes pending, we update.

                if (updatedOrderFromServer.verification_status === 'อนุมัติ' || updatedOrderFromServer.verification_status === 'ไม่อนุมัติ') {
                     // Check if the current filter matches the new status. If not, clear.
                     // If it matches, update the selectedOrder to show its (potentially unchanged) details.
                    if ( (updatedOrderFromServer.verification_status === 'อนุมัติ' && listFilter !== 'approved') ||
                         (updatedOrderFromServer.verification_status === 'ไม่อนุมัติ' && listFilter !== 'rejected') ) {
                        setSelectedOrder(null);
                        setSelectedOrderItems([]);
                        setVerificationStatusInput('');
                    } else {
                        // It was already in an approved/rejected list and stayed there, or moved to the currently viewed approved/rejected list
                        setSelectedOrder(updatedOrderFromServer);
                        setVerificationStatusInput(updatedOrderFromServer.verification_status || '');
                    }
                } else { // Status is null (pending) or 'ตรวจสอบเพิ่มเติม'
                    // If we moved to a pending state, and we are not viewing the pending list, clear selection.
                    if (listFilter !== 'pending') {
                        setSelectedOrder(null);
                        setSelectedOrderItems([]);
                        setVerificationStatusInput('');
                    } else {
                        setSelectedOrder(updatedOrderFromServer);
                        setVerificationStatusInput(updatedOrderFromServer.verification_status || '');
                    }
                }
            } else {
                console.warn("Update call to Supabase did not return updated data or array was empty.");
                setActionMessage(`ส่งคำขออัปเดตผลการตรวจสอบสำหรับ #${selectedOrder.id.substring(0,8)} แล้ว โปรดตรวจสอบรายการ`);
                await Promise.all([ fetchOrdersForReview(), fetchApprovedOrders(), fetchRejectedOrders() ]);
            }
        } catch (err) {
            console.error("Error in handleSubmitVerificationStatus catch block:", err);
            let userErrorMessage = "เกิดข้อผิดพลาดในการบันทึกผลการตรวจสอบ: " + err.message;
            if (err.message && (err.message.toLowerCase().includes("rls") || err.message.toLowerCase().includes("policy"))) {
                userErrorMessage = "การอัปเดตถูกปฏิเสธ อาจเกิดจากปัญหาเรื่องสิทธิ์การเข้าถึงข้อมูล (RLS)";
            }
            setError(userErrorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div style={{ textAlign: 'center', padding: '20px', paddingTop: '80px' }}>กำลังโหลดข้อมูลผู้ดูแลระบบ...</div>;
    }

    if (!isAuthorized) {
        return (
            <div style={{ color: 'red', textAlign: 'center', padding: '20px', paddingTop: '80px' }}>
                <h2>Access Denied</h2>
                <p>{error || "คุณไม่ได้รับสิทธิ์ให้เข้าถึงหน้านี้"}</p>
            </div>
        );
    }

    const renderOrderList = (title, ordersToRender, listTypeMessage) => (
        <>
            <h2>{title} ({ordersToRender.length})</h2>
            {ordersToRender.length === 0 && <p>ไม่มีคำสั่งซื้อ{listTypeMessage}</p>}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {ordersToRender.map(order => (
                    <li key={order.id} style={{ padding: '12px', borderBottom: '1px solid #eee', cursor: 'pointer', backgroundColor: selectedOrder?.id === order.id ? '#e9f5ff' : 'transparent', borderRadius: '3px' }} onClick={() => handleSelectOrder(order)}>
                        <div><strong>ID:</strong> {order.id.substring(0, 8)}...</div>
                        <div><strong>User ID:</strong> {order.user_id.substring(0,8)}...</div>
                        <div><strong>ลูกค้า (ที่กรอก):</strong> {order.contact_info?.name || 'N/A'}</div>
                        <div><strong>วันที่:</strong> {new Date(order.created_at).toLocaleDateString()}</div>
                        <div><strong>ยอดรวม:</strong> {order.total_amount.toFixed(2)} บาท</div>
                        <div><strong>สถานะหลัก:</strong> <span style={{fontWeight: 'bold', color: order.status === 'payment_uploaded' ? 'orange' : 'inherit'}}>{order.status}</span></div>
                        <div><strong>ผลตรวจสอบ (ล่าสุด):</strong> {order.verification_status || 'ยังไม่ได้ตรวจสอบ'}</div>
                        {order.slip_url && <a href={order.slip_url} target="_blank" rel="noopener noreferrer" style={{color: '#007bff', textDecoration: 'underline'}}>ดูสลิป 📄</a>}
                    </li>
                ))}
            </ul>
        </>
    );

    return (
        <div style={{ padding: '20px', paddingTop: '80px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>หน้าจัดการคำสั่งซื้อ (Admin)</h1>
            {actionMessage && <p style={{ color: 'green', border: '1px solid green', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>✅ {actionMessage}</p>}
            {error && <p style={{ color: 'red', border: '1px solid red', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>❌ {error}</p>}

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '350px', maxHeight: '80vh', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
                    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                        <label htmlFor="orderListFilter" style={{ marginRight: '10px', fontWeight: 'bold', fontSize: '1.1em' }}>แสดง:</label>
                        <select
                            id="orderListFilter"
                            value={listFilter}
                            onChange={(e) => {
                                setListFilter(e.target.value);
                                setSelectedOrder(null); 
                                setSelectedOrderItems([]);
                                setVerificationStatusInput('');
                            }}
                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1em', flexGrow: 1 }}
                        >
                            {LIST_FILTER_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {listFilter === 'pending' && renderOrderList("คำสั่งซื้อที่ต้องตรวจสอบ", pendingOrders, "ที่ต้องตรวจสอบ")}
                    {listFilter === 'approved' && renderOrderList("คำสั่งซื้อที่อนุมัติแล้ว", approvedOrders, "ที่อนุมัติแล้ว")}
                    {listFilter === 'rejected' && renderOrderList("คำสั่งซื้อที่ไม่อนุมัติ", rejectedOrders, "ที่ไม่อนุมัติแล้ว")}
                </div>

                <div style={{ flex: 2, minWidth: '400px', border: '1px solid #ccc', padding: '15px', borderRadius: '4px' }}>
                    <h2>รายละเอียดคำสั่งซื้อที่เลือก</h2>
                    {selectedOrder ? (
                        <div>
                            <p><strong>ID:</strong> {selectedOrder.id}</p>
                            <p><strong>UserID:</strong> {selectedOrder.user_id}</p>
                            <p><strong>วันที่สั่งซื้อ:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                            <hr style={{margin: '15px 0'}}/>
                            <h4>ข้อมูลติดต่อและที่อยู่ (ที่ลูกค้ากรอก)</h4>
                            <p><strong>ชื่อผู้รับ:</strong> {selectedOrder.contact_info?.name || 'N/A'}</p>
                            <p><strong>เบอร์โทรศัพท์:</strong> {selectedOrder.contact_info?.phone || 'N/A'}</p>
                            <p><strong>อีเมล:</strong> {selectedOrder.contact_info?.email || 'N/A'}</p>
                            <p><strong>ที่อยู่จัดส่ง:</strong> {selectedOrder.shipping_address || 'N/A'}</p>
                            <hr style={{margin: '15px 0'}}/>
                            <p><strong>ยอดรวม:</strong> {selectedOrder.total_amount.toFixed(2)} บาท</p>
                            <p><strong>สถานะปัจจุบัน (หลัก):</strong> {selectedOrder.status}</p>
                            {selectedOrder.slip_url ? (
                                <p><strong>สลิปการชำระเงิน:</strong> <a href={selectedOrder.slip_url} target="_blank" rel="noopener noreferrer" style={{color: '#007bff', fontWeight: 'bold', fontSize: '1.1em', textDecoration: 'underline'}}>เปิดดูสลิป 🔗</a></p>
                            ) : <p><strong>ไม่มีสลิปการชำระเงิน</strong></p>}
                            <p><strong>ผลการตรวจสอบ (ปัจจุบัน):</strong> {selectedOrder.verification_status || 'ยังไม่ได้ตรวจสอบ'}</p>

                            <h4 style={{marginTop: '20px'}}>รายการสินค้า:</h4>
                            {selectedOrderItems.length > 0 ? (
                                <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                                    {selectedOrderItems.map((item, index) => (
                                        <li key={index} style={{ border: '1px solid #ddd', padding: '8px', marginBottom: '8px', backgroundColor: '#f9f9f9', borderRadius: '3px' }}>
                                            <p style={{ margin: '0 0 5px 0' }}><strong>{item.productName}</strong> - {item.optionName}</p>
                                            <p style={{ margin: '0 0 5px 0', fontSize: '0.9em' }}>จำนวน: {item.quantity} x {item.price.toFixed(2)} = {(item.quantity * item.price).toFixed(2)} บาท</p>
                                        </li>
                                    ))}
                                </ul>
                             ) : <p>{error && typeof error === 'string' && error.toLowerCase().includes("รายการสินค้า") ? "" : "ไม่พบรายการสินค้า หรือกำลังโหลด..."}</p>}

                            <hr style={{margin: '20px 0'}}/>
                            {/* MODIFIED: Show verification form when an order is selected */}
                            {selectedOrder && (
                                <>
                                    <h4>บันทึก/อัปเดตผลการตรวจสอบ:</h4>
                                    <div style={{ marginBottom: '15px' }}>
                                        <label htmlFor="verification_status_dropdown" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ผลการตรวจสอบ:</label>
                                        <select
                                            id="verification_status_dropdown"
                                            value={verificationStatusInput}
                                            onChange={(e) => setVerificationStatusInput(e.target.value)}
                                            style={{padding: '10px', width: '100%', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1em'}}
                                        >
                                            {VERIFICATION_OPTIONS.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        <button
                                            onClick={handleSubmitVerificationStatus}
                                            disabled={isSubmitting || !selectedOrder || (verificationStatusInput === '' && selectedOrder.verification_status !== null && selectedOrder.verification_status !== '')} // Allow saving if current status is null/empty and user hasn't selected anything new. Button is primarily disabled if trying to save "" when it means "no selection"
                                            style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em', opacity: (isSubmitting || !selectedOrder || (verificationStatusInput === '' && selectedOrder.verification_status !== null && selectedOrder.verification_status !== '')) ? 0.6 : 1 }}
                                        >
                                            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกผลการตรวจสอบ'}
                                        </button>
                                    </div>
                                    {isSubmitting && <p style={{marginTop: '10px', color: '#007bff'}}>กำลังบันทึกผลการตรวจสอบ...</p>}
                                </>
                            )}
                        </div>
                    ) : (
                        <p>เลือกคำสั่งซื้อจากรายการด้านซ้ายเพื่อดูรายละเอียดและดำเนินการ</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminOrderManagementPage;