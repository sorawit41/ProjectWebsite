// AdminOrderManagementPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient'; // ตรวจสอบว่า path ถูกต้อง

const ADMIN_USER_ID = '96c80823-7af5-4a2b-a0de-ac35231db4a9';
const EVENT_IMAGES_BUCKET_NAME = 'event-images'; // <<-- ชื่อ Bucket ใน Supabase Storage

// Constants for Order Management
const ALL_CASTS = [
    { id: 'momo', name: 'Momo' }, { id: 'mei', name: 'Mei' }, { id: 'cin', name: 'Cin' },
    { id: 'azuki', name: 'Azuki' }, { id: 'fukada', name: 'Fukada' }, { id: 'narin', name: 'Narin' },
    { id: 'tsuki', name: 'Tsuki' }, { id: 'cream', name: 'Cream' }, { id: 'cornine', name: 'Cornine' },
    { id: 'fuwarun', name: 'Fuwarun' }, { id: 'hamo', name: 'Hamo' }, { id: 'icezu', name: 'Icezu' },
    { id: 'ivy', name: 'Ivy' }, { id: 'kokoa', name: 'Kokoa' }, { id: 'miyuki', name: 'Miyuki' },
    { id: 'mio', name: 'Mio' }, { id: 'momoka', name: 'Momoka' }, { id: 'moolek', name: 'Moolek' },
    { id: 'risa', name: 'Risa' }, { id: 'yuna', name: 'Yuna' }, { id: 'hitomi', name: 'Hitomi' },
    { id: 'maywa', name: 'Maywa' }, { id: 'kurimi', name: 'Kurimi' }, { id: 'itsumi', name: 'Itsumi' },
    { id: 'ayse', name: 'Ayse' }, { id: 'reka', name: 'Reka' }, { id: 'yumeko', name: 'Yumeko' },
    { id: 'shiori', name: 'Shiori' }, { id: 'tsubaki', name: 'Tsubaki' }, { id: 'sora', name: 'Sora' },
    { id: 'erika', name: 'Erika' }, { id: 'layra', name: 'Layra' }, { id: 'nene', name: 'Nene' },
    { id: 'saya', name: 'Saya' }, { id: 'sylvie', name: 'Sylvie' },
];
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

const formatDateTimeForInput = (isoDateString) => {
    if (!isoDateString) return '';
    try {
        const date = new Date(isoDateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `<span class="math-inline">\{year\}\-</span>{month}-<span class="math-inline">\{day\}T</span>{hours}:${minutes}`;
    } catch (e) { console.error("Error formatting date for input:", e); return ''; }
};

function AdminOrderManagementPage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    const [isOrderSubmitting, setIsOrderSubmitting] = useState(false);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [approvedOrders, setApprovedOrders] = useState([]);
    const [rejectedOrders, setRejectedOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrderItems, setSelectedOrderItems] = useState([]);
    const [orderError, setOrderError] = useState('');
    const [orderActionMessage, setOrderActionMessage] = useState('');
    const [verificationStatusInput, setVerificationStatusInput] = useState('');
    const [listFilter, setListFilter] = useState('pending');
    const [castOrderSummary, setCastOrderSummary] = useState({});
    const [summarySource, setSummarySource] = useState('approved');

    const [activeAdminSection, setActiveAdminSection] = useState('orders'); 

    const [adminEvents, setAdminEvents] = useState([]);
    const [selectedEventForEditing, setSelectedEventForEditing] = useState(null);
    const [eventForm, setEventForm] = useState({
        id: null, title: '', description: '', short_description: '',
        event_date: '', image_file: null, current_image_url: '',
    });
    const [imagePreview, setImagePreview] = useState('');
    const [isEventSubmitting, setIsEventSubmitting] = useState(false);
    const [eventError, setEventError] = useState('');
    const [eventActionMessage, setEventActionMessage] = useState('');

    const fetchOrdersForReview = useCallback(async () => {
        setOrderError('');
        try {
            const { data, error: fetchError } = await supabase
                .from('orders')
                .select('*, orderItemsToInsert, verification_status, contact_info, shipping_address, total_amount, slip_url, status, created_at, user_id')
                .or('verification_status.is.null,verification_status.eq.ตรวจสอบเพิ่มเติม')
                .order('created_at', { ascending: true });
            if (fetchError) throw fetchError;
            setPendingOrders(data || []);
            // console.log(`Fetched ${data ? data.length : 0} orders requiring review.`);
        } catch (err) { 
            console.error("Error fetching orders for review:", err); 
            setOrderError("ไม่สามารถดึงข้อมูลคำสั่งซื้อสำหรับตรวจสอบได้: " + err.message); 
        }
    }, []);

    const fetchApprovedOrders = useCallback(async () => {
        setOrderError('');
        try {
            const { data, error: fetchError } = await supabase
                .from('orders')
                .select('*, orderItemsToInsert, verification_status, contact_info, shipping_address, total_amount, slip_url, status, created_at, user_id')
                .eq('verification_status', 'อนุมัติ')
                .order('created_at', { ascending: false });
            if (fetchError) throw fetchError;
            setApprovedOrders(data || []);
            // console.log(`Fetched ${data ? data.length : 0} approved orders.`);
        } catch (err) { 
            console.error("Error fetching approved orders:", err); 
            setOrderError("ไม่สามารถดึงข้อมูลคำสั่งซื้อที่อนุมัติแล้วได้: " + err.message); 
        }
    }, []);

    const fetchRejectedOrders = useCallback(async () => {
        setOrderError('');
        try {
            const { data, error: fetchError } = await supabase
                .from('orders')
                .select('*, orderItemsToInsert, verification_status, contact_info, shipping_address, total_amount, slip_url, status, created_at, user_id')
                .eq('verification_status', 'ไม่อนุมัติ')
                .order('created_at', { ascending: false });
            if (fetchError) throw fetchError;
            setRejectedOrders(data || []);
            // console.log(`Fetched ${data ? data.length : 0} rejected orders.`);
        } catch (err) { 
            console.error("Error fetching rejected orders:", err); 
            setOrderError("ไม่สามารถดึงข้อมูลคำสั่งซื้อที่ไม่อนุมัติ: " + err.message); 
        }
    }, []);

    const fetchAdminEvents = useCallback(async () => {
        setEventError('');
        try {
            const { data, error: fetchError } = await supabase.from('events').select('*').order('event_date', { ascending: false });
            if (fetchError) throw fetchError;
            setAdminEvents(data || []);
            // console.log(`Fetched ${data ? data.length : 0} events.`);
        } catch (err) { 
            console.error("Error fetching admin events:", err); 
            setEventError("ไม่สามารถดึงข้อมูลอีเว้นท์ได้: " + err.message); 
        }
    }, []);

    useEffect(() => {
        async function checkAuthAndFetchData() {
            setIsLoading(true);
            setOrderError(''); 
            setOrderActionMessage('');
            setEventError('');
            setEventActionMessage('');
            
            try {
                const { data: { user }, error: getUserError } = await supabase.auth.getUser();
                
                if (getUserError) {
                    console.error("Error fetching user:", getUserError);
                    throw new Error("ไม่สามารถตรวจสอบข้อมูลผู้ใช้ได้: " + getUserError.message);
                }
                setCurrentUser(user);

                if (user && user.id === ADMIN_USER_ID) {
                    setIsAuthorized(true);
                    // Use Promise.allSettled to ensure all fetches complete, even if some fail
                    // Individual fetch functions already handle their specific error states
                    const results = await Promise.allSettled([
                        fetchOrdersForReview(),
                        fetchApprovedOrders(),
                        fetchRejectedOrders(),
                        fetchAdminEvents() // <<--- เพิ่ม fetchAdminEvents ที่นี่
                    ]);

                    results.forEach(result => {
                        if (result.status === 'rejected') {
                            // Log individual fetch errors but don't throw, as setIsLoading(false) must be reached
                            console.warn("A data fetching operation failed during initial load:", result.reason);
                        }
                    });

                } else {
                    setIsAuthorized(false);
                    const authErrorMsg = user ? "คุณไม่ได้รับสิทธิ์ให้เข้าถึงหน้านี้" : "กรุณาเข้าสู่ระบบ";
                    setOrderError(authErrorMsg); 
                    setEventError(authErrorMsg);
                }
            } catch (err) {
                // This catch block handles errors from supabase.auth.getUser() or other critical issues
                console.error("Critical error in checkAuthAndFetchData:", err);
                const generalErrorMessage = "เกิดข้อผิดพลาดร้ายแรงในการโหลดข้อมูลหน้า Admin: " + err.message;
                setOrderError(generalErrorMessage);
                setEventError(generalErrorMessage);
                setIsAuthorized(false); 
            } finally {
                setIsLoading(false); // *** CRITICAL: Always set isLoading to false ***
            }
        }
        checkAuthAndFetchData();
    }, [fetchOrdersForReview, fetchApprovedOrders, fetchRejectedOrders, fetchAdminEvents]); // <<--- เพิ่ม fetchAdminEvents ใน dependencies


    const generateCastSummary = useCallback((ordersToSummarize, allCastsList) => {
        const summary = {};
        allCastsList.forEach(cast => { summary[cast.id] = { name: cast.name, items: [], totalQuantityByProduct: {} }; });
        ordersToSummarize.forEach(order => {
            if (!order.orderItemsToInsert) return;
            let parsedItems;
            try {
                const itemsString = typeof order.orderItemsToInsert === 'string' ? order.orderItemsToInsert : JSON.stringify(order.orderItemsToInsert);
                parsedItems = JSON.parse(itemsString);
            } catch (e) { console.error("Failed to parse orderItemsToInsert for cast summary in order:", order.id, e); return; }
            parsedItems.forEach(item => {
                if (item.selectedOptionDetails?.selectedCasts?.length > 0) {
                    item.selectedOptionDetails.selectedCasts.forEach(castMember => {
                        if (summary[castMember.id]) {
                            summary[castMember.id].items.push({
                                orderId: order.id.substring(0,8) + '...', customerName: order.contact_info?.name || 'N/A',
                                productName: item.productName, optionName: item.optionName, quantity: item.quantity,
                                price: item.price, itemSelections: item.selectedOptionDetails.itemSelections || {},
                                extraFeatures: item.selectedOptionDetails.extraFeatures || {},
                                orderDate: new Date(order.created_at).toLocaleDateString(),
                            });
                            const productOptionKey = `${item.productName} - ${item.optionName}`;
                            summary[castMember.id].totalQuantityByProduct[productOptionKey] = (summary[castMember.id].totalQuantityByProduct[productOptionKey] || 0) + item.quantity;
                        } else { console.warn(`Cast ID ${castMember.id} not found in summary keys.`); }
                    });
                }
            });
        });
        return summary;
    }, []);

    useEffect(() => {
        let ordersToProcess = [];
        if (summarySource === 'approved') ordersToProcess = approvedOrders;
        else if (summarySource === 'pending') ordersToProcess = pendingOrders;
        else if (summarySource === 'approvedAndPending') ordersToProcess = [...approvedOrders, ...pendingOrders];
        else if (summarySource === 'all') ordersToProcess = [...pendingOrders, ...approvedOrders, ...rejectedOrders];
        
        if (ordersToProcess.length > 0 || (summarySource && (Object.keys(castOrderSummary).length === 0 || approvedOrders.length + pendingOrders.length + rejectedOrders.length === 0 )) ) {
            // console.log(`Generating cast summary from <span class="math-inline">\{summarySource\} orders \(</span>{ordersToProcess.length} orders)`);
            const summary = generateCastSummary(ordersToProcess, ALL_CASTS);
            setCastOrderSummary(summary);
        }
    }, [approvedOrders, pendingOrders, rejectedOrders, summarySource, generateCastSummary, castOrderSummary ]); 
    
    const handleSelectOrder = (order) => {
        setSelectedOrder(order);
        const currentStatus = order.verification_status || '';
        setVerificationStatusInput(VERIFICATION_OPTIONS.some(opt => opt.value === currentStatus) ? currentStatus : '');
        setOrderActionMessage(''); 
        setOrderError(''); 
        try {
            if (order.orderItemsToInsert) {
                const itemsString = typeof order.orderItemsToInsert === 'string' ? order.orderItemsToInsert : JSON.stringify(order.orderItemsToInsert);
                setSelectedOrderItems(JSON.parse(itemsString));
            } else { setSelectedOrderItems([]); }
        } catch (parseError) {
            console.error("Failed to parse order items for admin:", parseError); setSelectedOrderItems([]);
            setOrderError("เกิดข้อผิดพลาดในการแสดงรายการสินค้าของคำสั่งซื้อนี้: " + parseError.message);
        }
    };

    const handleSubmitVerificationStatus = async () => {
        if (!selectedOrder) { setOrderError("กรุณาเลือกคำสั่งซื้อก่อนทำการบันทึก"); return; }
        if (verificationStatusInput === "" && !VERIFICATION_OPTIONS.find(opt => opt.value === "")?.allowEmptySave) { setOrderError("กรุณาเลือกผลการตรวจสอบจาก Dropdown"); return; }
        setIsOrderSubmitting(true); setOrderActionMessage(''); setOrderError('');
        try {
            const { data, error: updateError } = await supabase.from('orders')
                .update({ verification_status: verificationStatusInput === '' ? null : verificationStatusInput })
                .eq('id', selectedOrder.id).select('*, orderItemsToInsert, verification_status, contact_info, shipping_address, total_amount, slip_url, status, created_at, user_id').single();
            if (updateError) throw updateError;
            if (data) {
                setOrderActionMessage(`ผลการตรวจสอบสำหรับคำสั่งซื้อ #<span class="math-inline">\{selectedOrder\.id\.substring\(0,8\)\} ถูกบันทึกเป็น\: "</span>{data.verification_status || 'ยังไม่ได้ตรวจสอบ'}" เรียบร้อยแล้ว`);
                await Promise.all([ fetchOrdersForReview(), fetchApprovedOrders(), fetchRejectedOrders() ]);
                if ( (listFilter === 'pending' && (data.verification_status === null || data.verification_status === 'ตรวจสอบเพิ่มเติม')) || (listFilter === 'approved' && data.verification_status === 'อนุมัติ') || (listFilter === 'rejected' && data.verification_status === 'ไม่อนุมัติ') ) {
                    handleSelectOrder(data); // Reselect to update view with new data
                } else { setSelectedOrder(null); setSelectedOrderItems([]); setVerificationStatusInput(''); }
            } else { 
                setOrderActionMessage(`ส่งคำขออัปเดตผลการตรวจสอบสำหรับ #${selectedOrder.id.substring(0,8)} แล้ว โปรดตรวจสอบรายการ`); 
                await Promise.all([ fetchOrdersForReview(), fetchApprovedOrders(), fetchRejectedOrders() ]); 
            }
        } catch (err) {
            console.error("Error in handleSubmitVerificationStatus catch block:", err);
            let userErrorMessage = "เกิดข้อผิดพลาดในการบันทึกผลการตรวจสอบ: " + err.message;
            if (err.message && (err.message.toLowerCase().includes("rls") || err.message.toLowerCase().includes("policy"))) { userErrorMessage = "การอัปเดตถูกปฏิเสธ อาจเกิดจากปัญหาเรื่องสิทธิ์การเข้าถึงข้อมูล (RLS)"; }
            setOrderError(userErrorMessage);
        } finally { setIsOrderSubmitting(false); }
    };
    
    const resetEventForm = useCallback(() => {
        setEventForm({ id: null, title: '', description: '', short_description: '', event_date: '', image_file: null, current_image_url: '' });
        setImagePreview(''); setSelectedEventForEditing(null); setEventError(''); setEventActionMessage('');
    }, []);

    const handleEventFormChange = (e) => {
        const { name, value } = e.target;
        setEventForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEventImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEventForm(prev => ({ ...prev, image_file: file }));
            setImagePreview(URL.createObjectURL(file));
        } else {
            setEventForm(prev => ({ ...prev, image_file: null }));
            setImagePreview(eventForm.current_image_url || '');
        }
    };
    
    const handleEditEvent = useCallback((event) => {
        setSelectedEventForEditing(event);
        setEventForm({
            id: event.id, title: event.title || '', description: event.description || '',
            short_description: event.short_description || '', event_date: formatDateTimeForInput(event.event_date),
            image_file: null, current_image_url: event.image_url || '',
        });
        setImagePreview(event.image_url || ''); setEventActionMessage(''); setEventError('');
        const formElement = document.getElementById('event-form-section');
        if (formElement) formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    const handleEventSubmit = async (e) => {
        e.preventDefault();
        if (!eventForm.title || !eventForm.event_date) {
            setEventError("กรุณากรอกชื่ออีเว้นท์และวันที่อีเว้นท์"); return;
        }
        setIsEventSubmitting(true); setEventError(''); setEventActionMessage('');
        let imageUrlToSave = eventForm.current_image_url;
        if (eventForm.image_file) {
            const file = eventForm.image_file;
            let extension = '';
            const lastDot = file.name.lastIndexOf('.');
            if (lastDot > -1 && lastDot < file.name.length - 1) { extension = file.name.substring(lastDot); }
            const newFileName = `${Date.now()}${extension}`;
            const filePath = newFileName;
            // console.log(`Attempting to upload to bucket: '<span class="math-inline">\{EVENT\_IMAGES\_BUCKET\_NAME\}', with filePath\: '</span>{filePath}'`);
            const { error: uploadError } = await supabase.storage.from(EVENT_IMAGES_BUCKET_NAME).upload(filePath, file, { cacheControl: '3600', upsert: false });
            if (uploadError) { setEventError(`อัปโหลดรูปภาพไม่สำเร็จ: ${uploadError.message} (Path: ${filePath})`); setIsEventSubmitting(false); return; }
            const { data: publicUrlData } = supabase.storage.from(EVENT_IMAGES_BUCKET_NAME).getPublicUrl(filePath);
            imageUrlToSave = publicUrlData.publicUrl;
            if (selectedEventForEditing && selectedEventForEditing.image_url && selectedEventForEditing.image_url !== imageUrlToSave) {
                try {
                    const oldStoragePath = selectedEventForEditing.image_url.substring(selectedEventForEditing.image_url.indexOf(`/${EVENT_IMAGES_BUCKET_NAME}/`) + `/${EVENT_IMAGES_BUCKET_NAME}/`.length );
                    if (oldStoragePath && oldStoragePath !== filePath) { await supabase.storage.from(EVENT_IMAGES_BUCKET_NAME).remove([oldStoragePath]); }
                } catch (delError) { console.warn("Could not delete old image:", delError.message); }
            }
        }
        const eventDataToSave = {
            title: eventForm.title, description: eventForm.description, short_description: eventForm.short_description,
            event_date: new Date(eventForm.event_date).toISOString(), image_url: imageUrlToSave,
        };
        try {
            let resultMessage = '';
            if (selectedEventForEditing?.id) {
                const { data, error } = await supabase.from('events').update(eventDataToSave).eq('id', selectedEventForEditing.id).select().single();
                if (error) throw error;
                resultMessage = `อีเว้นท์ "${data.title}" อัปเดตสำเร็จ!`;
            } else {
                const { data, error } = await supabase.from('events').insert(eventDataToSave).select().single();
                if (error) throw error;
                resultMessage = `อีเว้นท์ "${data.title}" สร้างสำเร็จ!`;
            }
            setEventActionMessage(resultMessage); resetEventForm(); await fetchAdminEvents();
        } catch (err) {  console.error("Error saving event data to database:", err); setEventError("บันทึกข้อมูลอีเว้นท์ไม่สำเร็จ: " + err.message);
        } finally { setIsEventSubmitting(false); }
    };

    const handleDeleteEvent = async (eventId, eventImageUrl) => {
        if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบอีเว้นท์ ID: ${eventId}? การกระทำนี้ไม่สามารถย้อนกลับได้`)) return;
        setIsEventSubmitting(true); setEventError(''); setEventActionMessage('');
        try {
            const { error: dbError } = await supabase.from('events').delete().eq('id', eventId);
            if (dbError) throw dbError;
            if (eventImageUrl) {
                try {
                    const pathStartIndex = eventImageUrl.indexOf(`/${EVENT_IMAGES_BUCKET_NAME}/`) + `/${EVENT_IMAGES_BUCKET_NAME}/`.length;
                    const filePathInBucket = eventImageUrl.substring(pathStartIndex);
                    if (filePathInBucket) { await supabase.storage.from(EVENT_IMAGES_BUCKET_NAME).remove([filePathInBucket]); }
                } catch (storageError) { console.warn("ลบรูปภาพจาก Storage ไม่สำเร็จ:", storageError.message); }
            }
            setEventActionMessage(`อีเว้นท์ ID: ${eventId} ถูกลบสำเร็จ!`); await fetchAdminEvents(); resetEventForm();
        } catch (err) { console.error("Error deleting event:", err); setEventError("ลบอีเว้นท์ไม่สำเร็จ: " + err.message);
        } finally { setIsEventSubmitting(false); }
    };

    if (isLoading) return <div style={{ textAlign: 'center', padding: '20px', paddingTop: '80px', fontSize: '1.2em' }}>⏳ กำลังโหลดข้อมูล...</div>;
    if (!isAuthorized) return <div style={{ color: 'red', textAlign: 'center', padding: '20px', paddingTop: '80px' }}><h2>Access Denied</h2><p>{orderError || eventError || "คุณไม่ได้รับสิทธิ์ให้เข้าถึงหน้านี้"}</p></div>;

    const adminTabStyle = { padding: '10px 20px', cursor: 'pointer', border: '1px solid #ccc', borderBottom: 'none', marginRight: '5px', backgroundColor: '#f0f0f0', borderRadius: '5px 5px 0 0', fontSize: '1em', fontWeight: '500' };
    const adminTabActiveStyle = { ...adminTabStyle, backgroundColor: 'white', borderBottom: '1px solid white', color: '#007bff', fontWeight: 'bold' };
    
    const renderOrderList = (title, ordersToRender, listTypeMessage) => (
        <>
            <h3 style={{marginTop: '0px', marginBottom: '10px'}}>{title} ({ordersToRender.length})</h3>
            {ordersToRender.length === 0 && <p style={{textAlign: 'center', color: '#777', marginTop: '20px'}}>ไม่มีคำสั่งซื้อ{listTypeMessage}</p>}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {ordersToRender.map(order => (
                    <li key={order.id} style={{ padding: '12px', borderBottom: '1px solid #eee', cursor: 'pointer', backgroundColor: selectedOrder?.id === order.id ? '#e9f5ff' : 'transparent', borderRadius: '3px', marginBottom: '5px' }} onClick={() => handleSelectOrder(order)}>
                        <div><strong>ID:</strong> {order.id.substring(0, 8)}... | <strong>ลูกค้า:</strong> {order.contact_info?.name || 'N/A'}</div>
                        <div><strong>วันที่:</strong> {new Date(order.created_at).toLocaleDateString('th-TH')} | <strong>ยอด:</strong> {order.total_amount?.toFixed(2) || 'N/A'} บ.</div>
                        <div><strong>สถานะ:</strong> <span style={{fontWeight: 'bold'}}>{order.status || 'N/A'}</span> | <strong>ตรวจสอบ:</strong> <span style={{fontWeight: 'bold'}}>{order.verification_status || 'รอตรวจสอบ'}</span></div>
                        {order.slip_url && <a href={order.slip_url} target="_blank" rel="noopener noreferrer" style={{color: '#007bff', fontSize: '0.9em', textDecoration: 'underline'}}>ดูสลิป</a>}
                    </li>
                ))}
            </ul>
        </>
    );

    return (
        <div style={{ padding: '20px', paddingTop: '80px', maxWidth: '1600px', margin: '0 auto', fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>
            <h1 style={{fontSize: '1.8em', marginBottom: '20px', color: '#333'}}>หน้าจัดการข้อมูล (Admin)</h1>
            <div style={{ marginBottom: '0px', borderBottom: '1px solid #ccc', display: 'flex' }}>
                <button onClick={() => setActiveAdminSection('orders')} style={activeAdminSection === 'orders' ? adminTabActiveStyle : adminTabStyle}>จัดการคำสั่งซื้อ</button>
                <button onClick={() => setActiveAdminSection('events')} style={activeAdminSection === 'events' ? adminTabActiveStyle : adminTabStyle}>จัดการอีเว้นท์</button>
            </div>

            <div style={{border: '1px solid #ccc', borderTop: 'none', padding: '20px', borderRadius: '0 0 8px 8px', backgroundColor: '#fdfdff' }}>
                {activeAdminSection === 'orders' && (
                    <>
                        {orderActionMessage && <p style={{ color: 'green', border: '1px solid #4CAF50', padding: '12px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#e8f5e9' }}>✅ {orderActionMessage}</p>}
                        {orderError && <p style={{ color: 'red', border: '1px solid #f44336', padding: '12px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#ffebee' }}>❌ {orderError}</p>}
                        
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
                            <div style={{ flex: 1, minWidth: '380px', maxHeight: 'calc(100vh - 320px)', overflowY: 'auto', border: '1px solid #e0e0e0', padding: '15px', borderRadius: '6px', backgroundColor: '#f9f9f9' }}>
                                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                                    <label htmlFor="orderListFilter" style={{ marginRight: '10px', fontWeight: 'bold', fontSize: '1.05em' }}>แสดงรายการสั่งซื้อ:</label>
                                    <select id="orderListFilter" value={listFilter} onChange={(e) => { setListFilter(e.target.value); setSelectedOrder(null); setSelectedOrderItems([]); setVerificationStatusInput(''); setOrderError('');}} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1em', flexGrow: 1, backgroundColor: 'white' }}>
                                        {LIST_FILTER_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                                    </select>
                                </div>
                                {listFilter === 'pending' && renderOrderList("คำสั่งซื้อที่ต้องตรวจสอบ", pendingOrders, "ที่ต้องตรวจสอบ")}
                                {listFilter === 'approved' && renderOrderList("คำสั่งซื้อที่อนุมัติแล้ว", approvedOrders, "ที่อนุมัติแล้ว")}
                                {listFilter === 'rejected' && renderOrderList("คำสั่งซื้อที่ไม่อนุมัติ", rejectedOrders, "ที่ไม่อนุมัติแล้ว")}
                            </div>
                            <div style={{ flex: 1.5, minWidth: '450px', maxHeight: 'calc(100vh - 320px)', overflowY: 'auto', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '6px', backgroundColor: 'white' }}>
                               <h2 style={{marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#333'}}>รายละเอียดคำสั่งซื้อที่เลือก</h2>
                                {selectedOrder ? (
                                    <div>
                                        <p><strong>ID:</strong> {selectedOrder.id}</p>
                                        <p><strong>UserID:</strong> {selectedOrder.user_id || 'N/A'}</p>
                                        <p><strong>วันที่สั่งซื้อ:</strong> {new Date(selectedOrder.created_at).toLocaleString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                                        <hr style={{margin: '15px 0', borderColor: '#f0f0f0'}}/>
                                        <h4 style={{color: '#333'}}>ข้อมูลติดต่อและที่อยู่:</h4>
                                        <p><strong>ชื่อผู้รับ:</strong> {selectedOrder.contact_info?.name || 'N/A'}</p>
                                        <p><strong>เบอร์โทร:</strong> {selectedOrder.contact_info?.phone || 'N/A'}</p>
                                        <p><strong>อีเมล:</strong> {selectedOrder.contact_info?.email || 'N/A'}</p>
                                        <p><strong>ที่อยู่จัดส่ง:</strong> <span style={{whiteSpace: 'pre-wrap'}}>{selectedOrder.shipping_address || 'N/A'}</span></p>
                                        <hr style={{margin: '15px 0', borderColor: '#f0f0f0'}}/>
                                        <p><strong>ยอดรวม:</strong> {selectedOrder.total_amount?.toFixed(2) || 'N/A'} บาท</p>
                                        <p><strong>สถานะหลัก:</strong> <span style={{fontWeight: 'bold', padding: '3px 6px', borderRadius: '4px', backgroundColor: selectedOrder.status === 'payment_uploaded' ? '#fff3cd' : '#e2e3e5', color: selectedOrder.status === 'payment_uploaded' ? '#856404' : '#383d41' }}>{selectedOrder.status || 'N/A'}</span></p>
                                        {selectedOrder.slip_url ? ( <p><strong>สลิป:</strong> <a href={selectedOrder.slip_url} target="_blank" rel="noopener noreferrer" style={{color: '#007bff', fontWeight: 'bold', textDecoration: 'underline'}}>เปิดดูสลิป 🔗</a></p> ) : <p><strong>ไม่มีสลิป</strong></p>}
                                        <p><strong>ผลตรวจสอบ:</strong> <span style={{fontWeight: 'bold'}}>{selectedOrder.verification_status || 'ยังไม่ได้ตรวจสอบ'}</span></p>
                                        <h4 style={{marginTop: '20px', marginBottom: '10px', color: '#333'}}>รายการสินค้า:</h4>
                                        {selectedOrderItems.length > 0 ? ( <ul style={{ listStyle: 'none', paddingLeft: '0' }}> {selectedOrderItems.map((item, index) => ( <li key={index} style={{ border: '1px solid #e0e0e0', padding: '12px', marginBottom: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}> <p style={{ margin: '0 0 8px 0', fontSize: '1.05em', fontWeight: '500' }}>{item.productName} - {item.optionName}</p> <div style={{ fontSize: '0.9em', color: '#333' }}> {item.selectedOptionDetails?.itemSelections && Object.entries(item.selectedOptionDetails.itemSelections).length > 0 && ( <div style={{ marginBottom: '5px', paddingLeft: '10px' }}> {Object.entries(item.selectedOptionDetails.itemSelections).map(([itemType, selections]) => ( selections.length > 0 && ( <div key={itemType} style={{ marginBottom: '3px' }}> <strong style={{ color: '#555' }}>{itemType.charAt(0).toUpperCase() + itemType.slice(1)}:</strong>{' '} {selections.map(sel => sel.name).join(', ')} </div> )))} </div> )} {item.selectedOptionDetails?.selectedCasts && item.selectedOptionDetails.selectedCasts.length > 0 && ( <div style={{ marginBottom: '5px', paddingLeft: '10px' }}> <strong style={{ color: '#555' }}>Cast ที่เลือก:</strong>{' '} {item.selectedOptionDetails.selectedCasts.map(cast => cast.name).join(', ')} </div> )} {item.selectedOptionDetails?.extraFeatures && Object.entries(item.selectedOptionDetails.extraFeatures).length > 0 && ( <div style={{ marginBottom: '5px', paddingLeft: '10px' }}> {Object.entries(item.selectedOptionDetails.extraFeatures).map(([featureId, featureDetails]) => ( featureDetails.selected && ( <div key={featureId}> + {featureDetails.name} <span style={{ fontWeight: '500' }}>(+{featureDetails.price?.toFixed(2)} ฿)</span> </div> )))} </div> )} <p style={{ margin: '8px 0 0 0', paddingTop: '5px', borderTop: '1px dashed #ccc' }}> จำนวน: {item.quantity} x {(item.price)?.toFixed(2)} = {(item.quantity * (item.price || 0))?.toFixed(2)} บาท </p> </div> </li> ))} </ul> ) : <p style={{color: '#777'}}>{orderError && typeof orderError === 'string' && orderError.toLowerCase().includes("รายการสินค้า") ? "" : "ไม่พบรายละเอียดรายการสินค้า..."}</p>}
                                        <hr style={{margin: '20px 0', borderColor: '#f0f0f0'}}/>
                                        {selectedOrder && ( <div style={{ backgroundColor: '#e9f5ff', padding: '20px', borderRadius: '6px' }}> <h4 style={{marginTop: '0', marginBottom: '10px', color: '#0056b3'}}>บันทึก/อัปเดตผลการตรวจสอบ:</h4> <div style={{ marginBottom: '15px' }}> <label htmlFor="verification_status_dropdown" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ผลการตรวจสอบ:</label> <select id="verification_status_dropdown" value={verificationStatusInput} onChange={(e) => setVerificationStatusInput(e.target.value)} style={{padding: '10px', width: '100%', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1em', backgroundColor: 'white'}}> {VERIFICATION_OPTIONS.map(option => ( <option key={option.value} value={option.value}> {option.label} </option> ))} </select> </div> <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}> <button onClick={handleSubmitVerificationStatus} disabled={isOrderSubmitting || !selectedOrder || (verificationStatusInput === '' && selectedOrder.verification_status !== null && selectedOrder.verification_status !== '')} style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em', opacity: (isOrderSubmitting || !selectedOrder || (verificationStatusInput === '' && selectedOrder.verification_status !== null && selectedOrder.verification_status !== '')) ? 0.6 : 1 }}> {isOrderSubmitting ? 'กำลังบันทึก...' : 'บันทึกผลการตรวจสอบ'} </button> </div> {isOrderSubmitting && <p style={{marginTop: '10px', color: '#007bff'}}>กำลังบันทึกผล...</p>} </div> )}
                                    </div>
                                ) : ( <p style={{ color: '#555', textAlign: 'center', marginTop: '30px' }}>เลือกคำสั่งซื้อจากรายการด้านซ้ายเพื่อดูรายละเอียดและดำเนินการ</p> )}
                            </div>
                        </div>
                        <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #007bff', borderRadius: '8px', backgroundColor: '#f0f8ff' }}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px'}}> <h2 style={{ color: '#0056b3', margin: 0, fontSize: '1.4em' }}>สรุปรายการสั่งซื้อตาม Cast Member</h2> <div> <label htmlFor="summarySourceFilter" style={{ marginRight: '10px', fontWeight: 'bold' }}>ข้อมูลจาก:</label> <select id="summarySourceFilter" value={summarySource} onChange={(e) => setSummarySource(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #007bff', fontSize: '0.9em', backgroundColor: 'white' }}> <option value="approved">คำสั่งซื้อที่อนุมัติแล้ว</option> <option value="pending">คำสั่งซื้อที่ต้องตรวจสอบ</option> <option value="approvedAndPending">อนุมัติแล้ว & อยู่ระหว่างตรวจสอบ</option> <option value="all">คำสั่งซื้อทั้งหมด</option> </select> </div> </div> {Object.keys(castOrderSummary).length === 0 && <p style={{color: '#555', textAlign: 'center'}}>ไม่มีข้อมูลสรุปสำหรับ Cast หรือยังไม่ได้เลือกแหล่งข้อมูล</p>}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}> {ALL_CASTS.map(cast => { const summaryData = castOrderSummary[cast.id]; if (!summaryData) { return ( <div key={cast.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '4px', backgroundColor: '#fff' }}> <h3 style={{ marginTop: 0, color: '#007bff', fontSize: '1.1em' }}>{cast.name}</h3> <p style={{color: '#777', fontSize: '0.9em'}}>กำลังโหลด...</p> </div> ); } if (summaryData.items.length === 0) { return ( <div key={cast.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '4px', backgroundColor: '#fff' }}> <h3 style={{ marginTop: 0, color: '#007bff', fontSize: '1.1em' }}>{summaryData.name}</h3> <p style={{color: '#777', fontSize: '0.9em'}}>ไม่มีรายการ</p> </div> ); } return ( <div key={cast.id} style={{ border: '1px solid #add8e6', padding: '15px', borderRadius: '4px', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}> <h3 style={{ marginTop: 0, color: '#007bff', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px', fontSize: '1.1em' }}> {summaryData.name} ({summaryData.items.reduce((acc, item) => acc + item.quantity, 0)} ชิ้น) </h3> <details style={{marginBottom: '15px', backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px', border: '1px solid #e0e0e0'}}> <summary style={{fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95em'}}>สรุปจำนวนตามสินค้า</summary> <ul style={{listStyleType: 'disc', paddingLeft: '20px', fontSize: '0.8em', marginTop: '5px'}}> {Object.entries(summaryData.totalQuantityByProduct).map(([key, qty]) => ( <li key={key}>{key}: <strong>{qty} ชิ้น</strong></li> ))} </ul> </details> <ul style={{ listStyle: 'none', padding: 0, maxHeight: '300px', overflowY: 'auto' }}> {summaryData.items.map((item, idx) => ( <li key={idx} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '8px', marginBottom: '8px', fontSize: '0.85em' }}> <p style={{margin: '0 0 3px 0', fontWeight: '500'}}>{item.productName} - {item.optionName} (x{item.quantity})</p> <p style={{margin: '0 0 3px 0', fontSize: '0.8em', color: '#555'}}>ลูกค้า: {item.customerName} (Order: {item.orderId}, Date: {item.orderDate})</p> {item.itemSelections && Object.entries(item.itemSelections).length > 0 && ( <div style={{ fontSize: '0.75em', color: '#444', paddingLeft: '10px' }}> {Object.entries(item.itemSelections).map(([type, selections]) => selections.length > 0 && ( <div key={type}> <em>{type.charAt(0).toUpperCase() + type.slice(1)}:</em> {selections.map(s => s.name).join(', ')} </div> ))} </div> )} {item.extraFeatures && Object.entries(item.extraFeatures).length > 0 && ( <div style={{ fontSize: '0.75em', color: '#444', paddingLeft: '10px' }}> {Object.entries(item.extraFeatures).map(([id, details]) => details.selected && ( <div key={id}><em>พิเศษ:</em> {details.name} (+{details.price?.toFixed(2)} ฿)</div> ))} </div> )} </li> ))} </ul> </div> ); })} </div>
                        </div>
                    </>
                )}

                {activeAdminSection === 'events' && (
                    <div className="event-management-section" style={{marginTop: '20px'}}>
                        {eventActionMessage && <p style={{ color: 'green', border: '1px solid #4CAF50', padding: '12px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#e8f5e9' }}>✅ {eventActionMessage}</p>}
                        {eventError && <p style={{ color: 'red', border: '1px solid #f44336', padding: '12px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#ffebee' }}>❌ {eventError}</p>}

                        <form onSubmit={handleEventSubmit} id="event-form-section" style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: selectedEventForEditing ? '#fff9e6' : '#e6f7ff' }}>
                            <h3 style={{marginTop: 0, borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '20px', fontSize: '1.3em', color: '#333'}}>
                                {selectedEventForEditing ? `แก้ไขอีเว้นท์: ${selectedEventForEditing.title}` : 'สร้างอีเว้นท์ใหม่'}
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px'}}>
                                <div>
                                    <label htmlFor="eventTitle" style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>ชื่ออีเว้นท์ (*):</label>
                                    <input type="text" id="eventTitle" name="title" value={eventForm.title} onChange={handleEventFormChange} required style={{width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc'}}/>
                                </div>
                                <div>
                                    <label htmlFor="eventDate" style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>วันที่และเวลาอีเว้นท์ (*):</label>
                                    <input type="datetime-local" id="eventDate" name="event_date" value={eventForm.event_date} onChange={handleEventFormChange} required style={{width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc'}} />
                                </div>
                                <div>
                                    <label htmlFor="eventShortDescription" style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>คำอธิบายสั้นๆ (สำหรับ Card):</label>
                                    <textarea id="eventShortDescription" name="short_description" value={eventForm.short_description} onChange={handleEventFormChange} rows="3" style={{width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc'}}></textarea>
                                </div>
                                <div>
                                    <label htmlFor="eventDescription" style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>รายละเอียดเต็ม:</label>
                                    <textarea id="eventDescription" name="description" value={eventForm.description} onChange={handleEventFormChange} rows="6" style={{width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc'}}></textarea>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <label htmlFor="eventImage" style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>รูปภาพอีเว้นท์ (ถ้าไม่เปลี่ยน ไม่ต้องเลือกใหม่):</label>
                                    <input type="file" id="eventImage" name="image_file" onChange={handleEventImageChange} accept="image/*" style={{width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: 'white'}} />
                                    {(imagePreview || eventForm.current_image_url) && (
                                        <div style={{marginTop: '12px', border: '1px dashed #ccc', padding: '10px', borderRadius: '4px', display: 'inline-block'}}>
                                            <p style={{marginTop: 0, marginBottom: '8px', fontSize: '0.9em', color: '#555'}}>รูปภาพปัจจุบัน/ตัวอย่าง:</p>
                                            <img src={imagePreview || eventForm.current_image_url} alt="Preview" style={{maxWidth: '250px', maxHeight: '250px', objectFit: 'contain', borderRadius: '4px'}} />
                                        </div>
                                    )}
                                </div>
                                <div style={{display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginTop: '10px'}}>
                                    <button type="submit" disabled={isEventSubmitting} style={{backgroundColor: isEventSubmitting? '#ccc' : '#28a745', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: isEventSubmitting? 'not-allowed' : 'pointer', fontSize: '1em'}}>
                                        {isEventSubmitting ? 'กำลังบันทึก...' : (selectedEventForEditing ? 'อัปเดตอีเว้นท์' : 'สร้างอีเว้นท์')}
                                    </button>
                                    {selectedEventForEditing && (
                                        <button type="button" onClick={resetEventForm} disabled={isEventSubmitting} style={{backgroundColor: '#6c757d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em'}}>
                                            ยกเลิก (เริ่มสร้างใหม่)
                                        </button>
                                    )}
                                     {isEventSubmitting && <p style={{color: '#007bff', marginLeft:'10px'}}>กำลังดำเนินการ...</p>}
                                </div>
                            </div>
                        </form>

                        <h3 style={{borderTop: '1px solid #ccc', paddingTop: '20px', marginTop: '30px', fontSize: '1.3em', color: '#333'}}>รายการอีเว้นท์ทั้งหมด ({adminEvents.length})</h3>
                        <div style={{maxHeight: '600px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px', marginTop: '10px'}}>
                            <table style={{width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '0.9em'}}>
                                <thead style={{position: 'sticky', top: 0, zIndex: 1}}>
                                    <tr style={{backgroundColor: '#f8f9fa'}}>
                                        <th style={{padding: '12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', borderRight: '1px solid #dee2e6'}}>รูป</th>
                                        <th style={{padding: '12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', borderRight: '1px solid #dee2e6'}}>ชื่ออีเว้นท์</th>
                                        <th style={{padding: '12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', borderRight: '1px solid #dee2e6'}}>วันที่อีเว้นท์</th>
                                        <th style={{padding: '12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', borderRight: '1px solid #dee2e6'}}>อัปเดตล่าสุด</th>
                                        <th style={{padding: '12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', minWidth: '150px'}}>จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminEvents.length > 0 ? adminEvents.map(event => (
                                        <tr key={event.id} style={{borderBottom: '1px solid #eee', backgroundColor: selectedEventForEditing?.id === event.id ? '#fff9e6' : 'white', transition: 'background-color 0.2s'}} className="admin-table-row">
                                            <td style={{padding: '10px', borderRight: '1px solid #eee', textAlign: 'center', verticalAlign: 'middle'}}>
                                                {event.image_url && <img src={event.image_url} alt={event.title.substring(0,10)} style={{width: '70px', height: '70px', objectFit: 'cover', borderRadius: '4px', display: 'inline-block'}} />}
                                            </td>
                                            <td style={{padding: '10px', borderRight: '1px solid #eee', fontWeight: '500', verticalAlign: 'middle'}}>{event.title}</td>
                                            <td style={{padding: '10px', borderRight: '1px solid #eee', verticalAlign: 'middle'}}>{new Date(event.event_date).toLocaleDateString('th-TH', {day:'2-digit',month:'long',year:'numeric', hour:'2-digit', minute:'2-digit'})} น.</td>
                                            <td style={{padding: '10px', borderRight: '1px solid #eee', fontSize: '0.85em', color: '#555', verticalAlign: 'middle'}}>{new Date(event.updated_at).toLocaleString('th-TH')}</td>
                                            <td style={{padding: '10px', whiteSpace: 'nowrap', verticalAlign: 'middle'}}>
                                                <button onClick={() => handleEditEvent(event)} style={{marginRight: '8px', marginBottom: '5px', padding: '6px 12px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '3px', cursor: 'pointer'}}>แก้ไข</button>
                                                <button onClick={() => handleDeleteEvent(event.id, event.image_url)} style={{padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer'}}>ลบ</button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px', color: '#777'}}>ไม่พบข้อมูลอีเว้นท์</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminOrderManagementPage;