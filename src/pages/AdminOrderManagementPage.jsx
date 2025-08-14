// AdminOrderManagementPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { Html5QrcodeScanner } from 'html5-qrcode';

// Icons for different sections
import {
    FaClipboardList, FaCalendarAlt, FaUsersCog, FaRegCalendarCheck, FaImages, FaBriefcase,
    FaCat, FaPlus, FaEdit, FaTrash, FaImage, FaFacebook, FaTiktok, FaInstagram, FaLink, FaDownload,
    FaIdCard, FaQrcode, FaCoins, FaTimesCircle, FaBoxes , FaBullhorn
} from 'react-icons/fa';

// Import product service functions
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../api/productService'; // Removed fetchAllCasts as it's not directly used here now

const ADMIN_USER_ID = '96c80823-7af5-4a2b-a0de-ac35231db4a9';
const EVENT_IMAGES_BUCKET_NAME = 'event-images';
const CAST_IMAGES_BUCKET_NAME = 'cast-images';
const SCHEDULE_ASSETS_BUCKET_NAME = 'site-assets';
const BANNER_IMAGES_BUCKET_NAME = 'banner-images';
const JOB_APP_RESUMES_BUCKET_NAME = 'job-app-resumes';
const PRODUCT_IMAGES_BUCKET_NAME = 'product-images';

const ALL_CASTRANKS_OPTIONS = ["Angel", "Litter Angel", "Fairy", "Trainee", "Legend", "Mythic", "รอ Audition"];

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
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (e) { console.error("Error formatting date for input:", e); return ''; }
};

const initialCastMemberFormState = {
    id: null, name: '', rank: '', type: '', birth_place: '', strength: '',
    favorite_food: '', love_thing: '', hobby: '', favorite_color: '',
    message_to_humans: '', facebook_url: '', tiktok_url: '', instagram_url: '',
    image_files: [],
    current_image_urls: [],
    images_to_delete: [],
};

// MODIFIED: Initial state for Product Form to hold structured data
const initialProductFormState = {
    id: '',
    name: '',
    description: '',
    main_image_file: null,
    current_main_image_url: '',
    other_image_files: [],
    current_other_image_urls: [],
    other_images_to_delete: [],
    // New structured fields
    selected_available_item_choices: {
        '4x6': false,
        '8x12': false,
        'tapestry': false,
        custom: [], // For manually added item choices
    },
    options: [], // This will be an array of option objects
};

const initialAnnouncementFormState = {
    id: null,
    message: '',
    link_url: '',
    is_active: true,
    sort_order: 0,
};

function AdminOrderManagementPage() {
    // Common States
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeAdminSection, setActiveAdminSection] = useState('orders');

    // Order Management States
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
    const [castsForOrderSummary, setCastsForOrderSummary] = useState([]);

    // Event Management States
    const [adminEvents, setAdminEvents] = useState([]);
    const [selectedEventForEditing, setSelectedEventForEditing] = useState(null);
    const [eventForm, setEventForm] = useState({
        id: null, title: '', description: '', short_description: '',
        event_date: '', image_file: null, current_image_url: '',
    });
    const [eventImagePreview, setEventImagePreview] = useState('');
    const [isEventSubmitting, setIsEventSubmitting] = useState(false);
    const [eventError, setEventError] = useState('');
    const [eventActionMessage, setEventActionMessage] = useState('');

    // Cast Management States
    const [managedCasts, setManagedCasts] = useState([]);
    const [selectedCastForEditingForm, setSelectedCastForEditingForm] = useState(null);
    const [castMemberForm, setCastMemberForm] = useState(initialCastMemberFormState);
    const [castImagePreview, setCastImagePreview] = useState([]);
    const [isCastSubmitting, setIsCastSubmitting] = useState(false);
    const [castError, setCastError] = useState('');
    const [castActionMessage, setCastActionMessage] = useState('');

    // Schedule Management States
    const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedCastsForSchedule, setSelectedCastsForSchedule] = useState([]);
    const [selectedShiftType, setSelectedShiftType] = useState('morning');
    const [schedulesByDate, setSchedulesByDate] = useState({ morning: [], evening: [], night: [] });
    const [isSchedulingSubmitting, setIsSchedulingSubmitting] = useState(false);
    const [scheduleEntryError, setScheduleEntryError] = useState('');
    const [scheduleEntryMessage, setScheduleEntryMessage] = useState('');
    const [availableCastsForSchedule, setAvailableCastsForSchedule] = useState([]);

    // Old Schedule Image Management States
    const [currentScheduleImageUrl, setCurrentScheduleImageUrl] = useState('');
    const [scheduleImageFile, setScheduleImageFile] = useState(null);
    const [scheduleImagePreview, setScheduleImagePreview] = useState('');
    const [isScheduleSubmitting, setIsScheduleSubmitting] = useState(false);
    const [scheduleError, setScheduleError] = useState('');
    const [scheduleActionMessage, setScheduleActionMessage] = useState('');

    // Banner Management States
    const [bannerImages, setBannerImages] = useState([]);
    const [bannerImageFile, setBannerImageFile] = useState(null);
    const [bannerImagePreview, setBannerImagePreview] = useState('');
    const [bannerAltText, setBannerAltText] = useState('');
    const [bannerLinkUrl, setBannerLinkUrl] = useState('');
    const [isBannerSubmitting, setIsBannerSubmitting] = useState(false);
    const [bannerError, setBannerError] = useState('');
    const [bannerActionMessage, setBannerActionMessage] = useState('');

    // Job Application States
    const [jobApplications, setJobApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [jobAppsError, setJobAppsError] = useState('');
    const [jobAppsActionMessage, setJobAppsActionMessage] = useState('');
    const [isDeletingJobApp, setIsDeletingJobApp] = useState(false);

    // Membership Points Management States
    const [showScanner, setShowScanner] = useState(false);
    const [scannedUserId, setScannedUserId] = useState(null);
    const [pointsToAdd, setPointsToAdd] = useState(10);
    const [isAddingPoints, setIsAddingPoints] = useState(false);
    const [membershipMessage, setMembershipMessage] = useState('');
    const [membershipError, setMembershipError] = useState('');

    // NEW: Product Management States
    const [managedProducts, setManagedProducts] = useState([]);
    const [selectedProductForEditing, setSelectedProductForEditing] = useState(null);
    const [productForm, setProductForm] = useState(initialProductFormState);
    const [productMainImagePreview, setProductMainImagePreview] = useState('');
    const [productOtherImagePreviews, setProductOtherImagePreviews] = useState([]);
    const [isProductSubmitting, setIsProductSubmitting] = useState(false);
    const [productError, setProductError] = useState('');
    const [productActionMessage, setProductActionMessage] = useState('');
    // ✅ [เพิ่มใหม่] States สำหรับจัดการประกาศ
    const [announcements, setAnnouncements] = useState([]);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [announcementForm, setAnnouncementForm] = useState(initialAnnouncementFormState);
    const [isAnnouncementSubmitting, setIsAnnouncementSubmitting] = useState(false);
    const [announcementError, setAnnouncementError] = useState('');
    const [announcementActionMessage, setAnnouncementActionMessage] = useState('');

    // State for custom available item choice input
    const [newCustomItemChoice, setNewCustomItemChoice] = useState('');

    // --- Data Fetching Callbacks ---
    const fetchCastsForOrderSummary = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('casts')
                .select('id, name');
            if (error) throw error;
            setCastsForOrderSummary(data || []);
        } catch (err) {
            console.error("Error fetching casts for order summary:", err);
            setOrderError("ไม่สามารถดึงข้อมูลน้องแมวสำหรับสรุปคำสั่งซื้อได้: " + err.message);
        }
    }, []);

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
        } catch (err) {
            console.error("Error fetching admin events:", err);
            setEventError("ไม่สามารถดึงข้อมูลอีเว้นท์ได้: " + err.message);
        }
    }, []);

    const fetchAllManagedCasts = useCallback(async () => {
        setCastError('');
        try {
            const { data, error } = await supabase
                .from('casts')
                .select('*')
                .order('rank', { ascending: true })
                .order('name', { ascending: true });
            if (error) throw error;
            setManagedCasts(data || []);
            setAvailableCastsForSchedule(data || []);
        } catch (err) {
            console.error("Error fetching managed casts:", err);
            setCastError("ไม่สามารถดึงข้อมูลน้องแมวได้: " + err.message);
        }
    }, []);

    const fetchSchedulesByDate = useCallback(async (date) => {
        setIsSchedulingSubmitting(true);
        setScheduleEntryError('');
        setScheduleEntryMessage('');
        try {
            const { data, error } = await supabase
                .from('schedules')
                .select('id, cast_id, work_date, shift_type, casts(id, name, rank, image_url)')
                .eq('work_date', date);

            if (error) throw error;

            const groupedSchedules = { morning: [], evening: [], night: [] };
            data.forEach(schedule => {
                const shiftKey = schedule.shift_type.toLowerCase();
                if (groupedSchedules[shiftKey]) {
                    groupedSchedules[shiftKey].push(schedule);
                }
            });
            setSchedulesByDate(groupedSchedules);
        } catch (err) {
            console.error("Error fetching schedules by date:", err);
            setScheduleEntryError("ไม่สามารถโหลดตารางกะสำหรับวันที่เลือกได้: " + err.message);
        } finally {
            setIsSchedulingSubmitting(false);
        }
    }, []);

    const fetchCurrentScheduleImageUrl = useCallback(async () => {
        setScheduleError('');
        try {
            const { data, error } = await supabase
                .from('site_configurations')
                .select('config_value')
                .eq('config_key', 'current_schedule_image_url')
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    console.warn("Schedule config key not found, attempting to generate it.");
                    const { error: insertError } = await supabase
                        .from('site_configurations')
                        .insert({
                            config_key: 'current_schedule_image_url',
                            description: 'URL รูปภาพตารางงาน'
                        });

                    if (insertError) {
                        console.error("Failed to generate schedule config key:", insertError);
                        setScheduleError("เกิดข้อผิดพลาดในการสร้างข้อมูลตารางงานอัตโนมัติ: " + insertError.message);
                    } else {
                        console.log("Successfully generated schedule config key.");
                        setCurrentScheduleImageUrl('');
                        setScheduleImagePreview('');
                    }
                } else {
                    throw error;
                }
            } else {
                if (data) {
                    setCurrentScheduleImageUrl(data.config_value || '');
                    setScheduleImagePreview(data.config_value || '');
                }
            }
        } catch (err) {
            console.error("Error fetching current schedule image URL:", err);
            setScheduleError("ไม่สามารถโหลด URL รูปตารางงานปัจจุบันได้: " + err.message);
        }
    }, []);

    const fetchBannerImages = useCallback(async () => {
        setBannerError('');
        try {
            const { data, error } = await supabase
                .from('hero_banners')
                .select('*')
                .order('created_at', { ascending: true });
            if (error) throw error;
            setBannerImages(data || []);
        } catch (err) {
            console.error("Error fetching banner images:", err);
            setBannerError("ไม่สามารถโหลดข้อมูลรูปภาพ Banner ได้: " + err.message);
        }
    }, []);

    const fetchJobApplications = useCallback(async () => {
        setJobAppsError('');
        try {
            const { data, error } = await supabase
                .from('job_applications')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setJobApplications(data || []);
        } catch (err) {
            console.error("Error fetching job applications:", err);
            setJobAppsError("ไม่สามารถโหลดข้อมูลใบสมัครงานได้: " + err.message);
        }
    }, []);

    // NEW: Fetch Products for Admin Management
    const fetchManagedProducts = useCallback(async () => {
        setProductError('');
        try {
            const products = await fetchProducts(); // Use the service function
            // When fetching, reconstruct selected_available_item_choices and options
            const formattedProducts = products.map(p => ({
                ...p,
                selected_available_item_choices: {
                    '4x6': p.available_item_choices?.['4x6']?.length > 0,
                    '8x12': p.available_item_choices?.['8x12']?.length > 0,
                    'tapestry': p.available_item_choices?.['tapestry']?.length > 0,
                    custom: (p.available_item_choices ?
                        Object.keys(p.available_item_choices).filter(key => !['4x6', '8x12', 'tapestry'].includes(key) && p.available_item_choices[key].length > 0)
                        : []
                    ),
                },
                options: p.options || [], // Ensure options is an array
            }));
            setManagedProducts(formattedProducts || []);
        } catch (err) {
            console.error("Error fetching managed products:", err);
            setProductError("ไม่สามารถดึงข้อมูลสินค้าได้: " + err.message);
        }
    }, []);
    // ✅ [เพิ่มใหม่] ฟังก์ชันดึงข้อมูลประกาศ
    const fetchAnnouncements = useCallback(async () => {
        setAnnouncementError('');
        try {
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .order('sort_order', { ascending: true })
                .order('created_at', { ascending: false });
            if (error) throw error;
            setAnnouncements(data || []);
        } catch (err) {
            console.error("Error fetching announcements:", err);
            setAnnouncementError("ไม่สามารถโหลดข้อมูลประกาศได้: " + err.message);
        }
    }, []);
    // --- Main Data Fetching and Auth Effect ---
    useEffect(() => {
        async function checkAuthAndFetchData() {
            setIsLoading(true);
            setOrderError(''); setOrderActionMessage('');
            setEventError(''); setEventActionMessage('');
            setCastError(''); setCastActionMessage('');
            setScheduleError(''); setScheduleActionMessage('');
            setBannerError(''); setBannerActionMessage('');
            setJobAppsError(''); setJobAppsActionMessage('');
            setScheduleEntryError(''); setScheduleEntryMessage('');
            setProductError(''); setProductActionMessage('');
            // ✅ [อัปเดต] เพิ่มการรีเซ็ต state ของประกาศ
            setAnnouncementError(''); setAnnouncementActionMessage('');
            try {
                const { data: { user }, error: getUserError } = await supabase.auth.getUser();
                if (getUserError) { throw new Error("ไม่สามารถตรวจสอบข้อมูลผู้ใช้ได้: " + getUserError.message); }
                setCurrentUser(user);

                if (user && user.id === ADMIN_USER_ID) {
                    setIsAuthorized(true);
                    await Promise.allSettled([
                        fetchOrdersForReview(),
                        fetchApprovedOrders(),
                        fetchRejectedOrders(),
                        fetchAdminEvents(),
                        fetchAllManagedCasts(),
                        fetchCurrentScheduleImageUrl(),
                        fetchBannerImages(),
                        fetchJobApplications(),
                        fetchCastsForOrderSummary(),
                        fetchManagedProducts(),
                        fetchAnnouncements()
                    ]);
                    fetchSchedulesByDate(new Date().toISOString().split('T')[0]);
                } else {
                    setIsAuthorized(false);
                    const authErrorMsg = user ? "คุณไม่ได้รับสิทธิ์ให้เข้าถึงหน้านี้" : "กรุณาเข้าสู่ระบบ";
                    [setOrderError, setEventError, setCastError, setScheduleError, setBannerError, setJobAppsError, setScheduleEntryError, setProductError, setAnnouncementError].forEach(setError => setError(authErrorMsg));
                }
            } catch (err) {
                console.error("Critical error in checkAuthAndFetchData:", err);
                const generalErrorMessage = "เกิดข้อผิดพลาดร้ายแรง: " + err.message;
                [setOrderError, setEventError, setCastError, setScheduleError, setBannerError, setJobAppsError, setScheduleEntryError, setProductError, setAnnouncementError].forEach(setError => setError(generalErrorMessage));
                setIsAuthorized(false);
            } finally {
                setIsLoading(false);
            }
        }
          checkAuthAndFetchData();
    }, [fetchOrdersForReview, fetchApprovedOrders, fetchRejectedOrders, fetchAdminEvents, fetchAllManagedCasts, fetchCurrentScheduleImageUrl, fetchBannerImages, fetchJobApplications, fetchSchedulesByDate, fetchCastsForOrderSummary, fetchManagedProducts, fetchAnnouncements]);

    // Effect to refetch schedules when scheduleDate changes
    useEffect(() => {
        if (activeAdminSection === 'schedule' && scheduleDate) {
            fetchSchedulesByDate(scheduleDate);
        }
    }, [scheduleDate, activeAdminSection, fetchSchedulesByDate]);

    // --- Order Management Logic ---
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
                                orderId: order.id.substring(0, 8) + '...', customerName: order.contact_info?.name || 'N/A',
                                productName: item.productName, optionName: item.optionName, quantity: item.quantity,
                                price: item.price, itemSelections: item.selectedOptionDetails.itemSelections || {},
                                extraFeatures: item.selectedOptionDetails.extraFeatures || {},
                                orderDate: new Date(order.created_at).toLocaleDateString(),
                            });
                            const productOptionKey = `${item.productName} - ${item.optionName}`;
                            summary[castMember.id].totalQuantityByProduct[productOptionKey] = (summary[castMember.id].totalQuantityByProduct[productOptionKey] || 0) + item.quantity;
                        } else { console.warn(`Cast ID ${castMember.id} from order item not found in current cast list for summary. Item: ${item.productName}`); }
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

        if (castsForOrderSummary.length > 0 && (ordersToProcess.length > 0 || (summarySource && (Object.keys(castOrderSummary).length === 0 || approvedOrders.length + pendingOrders.length + rejectedOrders.length === 0)))) {
            const summary = generateCastSummary(ordersToProcess, castsForOrderSummary);
            setCastOrderSummary(summary);
        } else if (castsForOrderSummary.length === 0) {
            setCastOrderSummary({});
        }
    }, [approvedOrders, pendingOrders, rejectedOrders, summarySource, generateCastSummary, castsForOrderSummary]);

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
        setIsOrderSubmitting(true); setOrderActionMessage(''); setOrderError('');
        try {
            const { data, error: updateError } = await supabase.from('orders')
                .update({ verification_status: verificationStatusInput === '' ? null : verificationStatusInput })
                .eq('id', selectedOrder.id).select('*, orderItemsToInsert, verification_status, contact_info, shipping_address, total_amount, slip_url, status, created_at, user_id').single();
            if (updateError) throw updateError;
            if (data) {
                setOrderActionMessage(`ผลการตรวจสอบสำหรับคำสั่งซื้อ #${selectedOrder.id.substring(0, 8)} ถูกบันทึกเป็น: "${data.verification_status || 'ยังไม่ได้ตรวจสอบ'}" เรียบร้อยแล้ว`);
                await Promise.all([fetchOrdersForReview(), fetchApprovedOrders(), fetchRejectedOrders()]);
                if ((listFilter === 'pending' && (data.verification_status === null || data.verification_status === 'ตรวจสอบเพิ่มเติม')) || (listFilter === 'approved' && data.verification_status === 'อนุมัติ') || (listFilter === 'rejected' && data.verification_status === 'ไม่อนุมัติ')) {
                    handleSelectOrder(data);
                } else { setSelectedOrder(null); setSelectedOrderItems([]); setVerificationStatusInput(''); }
            } else {
                setOrderActionMessage(`ส่งคำขออัปเดตผลการตรวจสอบสำหรับ #${selectedOrder.id.substring(0, 8)} แล้ว โปรดตรวจสอบรายการ`);
                await Promise.all([fetchOrdersForReview(), fetchApprovedOrders(), fetchRejectedOrders()]);
            }
        } catch (err) {
            console.error("Error in handleSubmitVerificationStatus catch block:", err);
            let userErrorMessage = "เกิดข้อผิดพลาดในการบันทึกผลการตรวจสอบ: " + err.message;
            if (err.message && (err.message.toLowerCase().includes("rls") || err.message.toLowerCase().includes("policy"))) { userErrorMessage = "การอัปเดตถูกปฏิเสธ อาจเกิดจากปัญหาเรื่องสิทธิ์การเข้าถึงข้อมูล (RLS)"; }
            setOrderError(userErrorMessage);
        } finally { setIsOrderSubmitting(false); }
    };

    // --- Event Management Logic ---
    const resetEventForm = useCallback(() => {
        setEventForm({ id: null, title: '', description: '', short_description: '', event_date: '', image_file: null, current_image_url: '' });
        setEventImagePreview('');
        setSelectedEventForEditing(null); setEventError(''); setEventActionMessage('');
    }, []);

    const handleEventFormChange = (e) => {
        const { name, value } = e.target;
        setEventForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEventImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEventForm(prev => ({ ...prev, image_file: file }));
            setEventImagePreview(URL.createObjectURL(file));
        } else {
            setEventForm(prev => ({ ...prev, image_file: null }));
            setEventImagePreview(eventForm.current_image_url || '');
        }
    };

    const handleEditEvent = useCallback((event) => {
        setSelectedEventForEditing(event);
        setEventForm({
            id: event.id, title: event.title || '', description: event.description || '',
            short_description: event.short_description || '', event_date: formatDateTimeForInput(event.event_date),
            image_file: null, current_image_url: event.image_url || '',
        });
        setEventImagePreview(event.image_url || '');
        setEventActionMessage(''); setEventError('');
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
            const fileExtension = file.name.split('.').pop();
            const newFileName = `event-${Date.now()}.${fileExtension}`;
            const filePath = newFileName;
            const { error: uploadError } = await supabase.storage.from(EVENT_IMAGES_BUCKET_NAME).upload(filePath, file, { cacheControl: '3600', upsert: true });
            if (uploadError) { setEventError(`อัปโหลดรูปภาพอีเว้นท์ไม่สำเร็จ: ${uploadError.message}`); setIsEventSubmitting(false); return; }
            const { data: publicUrlData } = supabase.storage.from(EVENT_IMAGES_BUCKET_NAME).getPublicUrl(filePath);
            imageUrlToSave = publicUrlData.publicUrl;
            if (selectedEventForEditing && selectedEventForEditing.image_url && selectedEventForEditing.image_url !== imageUrlToSave) {
                try {
                    const oldStoragePath = selectedEventForEditing.image_url.substring(selectedEventForEditing.image_url.indexOf(`/${EVENT_IMAGES_BUCKET_NAME}/`) + `/${EVENT_IMAGES_BUCKET_NAME}/`.length);
                    if (oldStoragePath && oldStoragePath !== filePath) { await supabase.storage.from(EVENT_IMAGES_BUCKET_NAME).remove([oldStoragePath]); }
                } catch (delError) { console.warn("Could not delete old event image:", delError.message); }
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
        } catch (err) { console.error("Error saving event data to database:", err); setEventError("บันทึกข้อมูลอีเว้นท์ไม่สำเร็จ: " + err.message);
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
                } catch (storageError) { console.warn("Could not delete old event image:", storageError.message); }
            }
            setEventActionMessage(`อีเว้นท์ ID: ${eventId} ถูกลบสำเร็จ!`); await fetchAdminEvents(); resetEventForm();
        } catch (err) { console.error("Error deleting event:", err); setEventError("ลบอีเว้นท์ไม่สำเร็จ: " + err.message);
        } finally { setIsEventSubmitting(false); }
    };

    // --- Cast Management Logic ---
    const resetCastMemberForm = useCallback(() => {
        setCastMemberForm(initialCastMemberFormState);
        setCastImagePreview([]);
        setSelectedCastForEditingForm(null);
        setCastError('');
        setCastActionMessage('');
        const formElement = document.getElementById('cast-member-form-section');
        if (formElement) formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    const handleCastMemberFormChange = (e) => {
        const { name, value } = e.target;
        setCastMemberForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCastImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setCastMemberForm(prev => ({ ...prev, image_files: [...prev.image_files, ...files] }));

            const newPreviews = files.map(file => ({
                url: URL.createObjectURL(file),
                isNew: true,
                file: file
            }));
            setCastImagePreview(prev => [...prev, ...newPreviews]);
        }
    };

    const handleRemoveImage = (urlToRemove, isNew) => {
        if (isNew) {
            const previewToRemove = castImagePreview.find(p => p.url === urlToRemove);
            if (previewToRemove) {
                setCastMemberForm(prev => ({
                    ...prev,
                    image_files: prev.image_files.filter(file => file !== previewToRemove.file)
                }));
            }
        } else {
            setCastMemberForm(prev => ({
                ...prev,
                images_to_delete: [...prev.images_to_delete, urlToRemove],
                current_image_urls: prev.current_image_urls.filter(url => url !== urlToRemove)
            }));
        }
        setCastImagePreview(prev => prev.filter(p => p.url !== urlToRemove));
    };

    const handleSelectCastForEditing = useCallback((castMember) => {
        const formElement = document.getElementById('cast-member-form-section');
        if (formElement) formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

        setSelectedCastForEditingForm(castMember);

        const imageUrls = (castMember.image_urls && Array.isArray(castMember.image_urls))
            ? castMember.image_urls
            : (castMember.image_url ? [castMember.image_url] : []);

        setCastMemberForm({
            id: castMember.id,
            name: castMember.name || '', rank: castMember.rank || '', type: castMember.type || '',
            birth_place: castMember.birth_place || '', strength: castMember.strength || '',
            favorite_food: castMember.favorite_food || '', love_thing: castMember.love_thing || '',
            hobby: castMember.hobby || '', favorite_color: castMember.favorite_color || '',
            message_to_humans: castMember.message_to_humans || '',
            facebook_url: castMember.facebook_url || '', tiktok_url: castMember.tiktok_url || '',
            instagram_url: castMember.instagram_url || '',
            image_files: [],
            current_image_urls: imageUrls,
            images_to_delete: [],
        });

        setCastImagePreview(imageUrls.map(url => ({ url, isNew: false })));

        setCastActionMessage('');
        setCastError('');
    }, []);

    const handleCastSubmit = async (e) => {
        e.preventDefault();
        if (!castMemberForm.name || !castMemberForm.rank) {
            setCastError("กรุณากรอกชื่อและ Rank ของน้องแมว");
            return;
        }
        setIsCastSubmitting(true);
        setCastError('');
        setCastActionMessage('');

        try {
            let finalImageUrls = [...castMemberForm.current_image_urls];

            if (castMemberForm.images_to_delete.length > 0) {
                const pathsToDelete = castMemberForm.images_to_delete.map(url => {
                    return url.substring(url.indexOf(`/${CAST_IMAGES_BUCKET_NAME}/`) + `/${CAST_IMAGES_BUCKET_NAME}/`.length);
                });

                const { error: deleteError } = await supabase.storage
                    .from(CAST_IMAGES_BUCKET_NAME)
                    .remove(pathsToDelete);

                if (deleteError) {
                    console.warn("Could not delete some old cast images:", deleteError.message);
                }
            }

            if (castMemberForm.image_files.length > 0) {
                const uploadPromises = castMemberForm.image_files.map(async (file) => {
                    const fileExtension = file.name.split('.').pop();
                    const sanitizedName = castMemberForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 50);
                    const newFileName = `cast-${sanitizedName}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExtension}`;

                    const { error: uploadError } = await supabase.storage
                        .from(CAST_IMAGES_BUCKET_NAME)
                        .upload(newFileName, file, { cacheControl: '3600', upsert: false });

                    if (uploadError) {
                        throw new Error(`อัปโหลดไฟล์ ${file.name} ไม่สำเร็จ: ${uploadError.message}`);
                    }

                    const { data: publicUrlData } = supabase.storage.from(CAST_IMAGES_BUCKET_NAME).getPublicUrl(newFileName);
                    return publicUrlData.publicUrl;
                });

                const newImageUrls = await Promise.all(uploadPromises);
                finalImageUrls.push(...newImageUrls);
            }

            const castDataToSave = {
                name: castMemberForm.name, rank: castMemberForm.rank, type: castMemberForm.type,
                birth_place: castMemberForm.birth_place, strength: castMemberForm.strength,
                favorite_food: castMemberForm.favorite_food, love_thing: castMemberForm.love_thing,
                hobby: castMemberForm.hobby, favorite_color: castMemberForm.favorite_color,
                message_to_humans: castMemberForm.message_to_humans,
                facebook_url: castMemberForm.facebook_url, tiktok_url: castMemberForm.tiktok_url,
                instagram_url: castMemberForm.instagram_url,
                image_urls: finalImageUrls,
                image_url: finalImageUrls[0] || null,
            };

            let resultMessage = '';
            if (selectedCastForEditingForm?.id) {
                const { data, error } = await supabase.from('casts').update(castDataToSave).eq('id', selectedCastForEditingForm.id).select().single();
                if (error) throw error;
                resultMessage = `ข้อมูลน้องแมว "${data.name}" อัปเดตสำเร็จ!`;
            } else {
                const { data, error } = await supabase.from('casts').insert(castDataToSave).select().single();
                if (error) throw error;
                resultMessage = `เพิ่มน้องแมว "${data.name}" สำเร็จ!`;
            }

            setCastActionMessage(resultMessage);
            resetCastMemberForm();
            await fetchAllManagedCasts();
            await fetchCastsForOrderSummary();

        } catch (err) {
            console.error("Error saving cast data:", err);
            setCastError("บันทึกข้อมูลน้องแมวไม่สำเร็จ: " + err.message);
        } finally {
            setIsCastSubmitting(false);
        }
    };

    const handleDeleteCastMember = async (castId, castName, castImageUrl, castImageUrls) => {
        if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ "${castName}" (ID: ${castId})? การกระทำนี้ไม่สามารถย้อนกลับได้`)) return;
        setIsCastSubmitting(true);
        setCastError('');
        setCastActionMessage('');

        try {
            const { error: dbError } = await supabase.from('casts').delete().eq('id', castId);
            if (dbError) throw dbError;

            const urlsToDelete = (Array.isArray(castImageUrls) && castImageUrls.length > 0)
                ? castImageUrls
                : (castImageUrl ? [castImageUrl] : []);

            if (urlsToDelete.length > 0) {
                const pathsToDelete = urlsToDelete.map(url => {
                    if (!url) return null;
                    const pathStartIndex = url.indexOf(`/${CAST_IMAGES_BUCKET_NAME}/`) + `/${CAST_IMAGES_BUCKET_NAME}/`.length;
                    return url.substring(pathStartIndex);
                }).filter(Boolean);

                if (pathsToDelete.length > 0) {
                    const { error: storageError } = await supabase.storage.from(CAST_IMAGES_BUCKET_NAME).remove(pathsToDelete);
                    if (storageError) {
                        console.warn("ลบรูปภาพน้องแมวบางส่วนจาก Storage ไม่สำเร็จ:", storageError.message);
                    }
                }
            }

            setCastActionMessage(`น้องแมว "${castName}" (ID: ${castId}) ถูกลบสำเร็จ!`);
            await fetchAllManagedCasts();
            await fetchCastsForOrderSummary();
            if (selectedCastForEditingForm?.id === castId) resetCastMemberForm();

        } catch (err) {
            console.error("Error deleting cast member:", err);
            setCastError("ลบน้องแมวไม่สำเร็จ: " + err.message);
        } finally {
            setIsCastSubmitting(false);
        }
    };

    // --- Schedule Management Logic ---
    const handleAddScheduleEntry = async (e) => {
        e.preventDefault();
        if (!scheduleDate || selectedCastsForSchedule.length === 0 || !selectedShiftType) {
            setScheduleEntryError("กรุณาเลือกวันที่, น้องแมว, และกะที่ต้องการเพิ่ม");
            return;
        }

        setIsSchedulingSubmitting(true);
        setScheduleEntryError('');
        setScheduleEntryMessage('');

        try {
            const entriesToInsert = selectedCastsForSchedule.map(castId => ({
                cast_id: castId,
                work_date: scheduleDate,
                shift_type: selectedShiftType,
            }));

            const { data, error } = await supabase
                .from('schedules')
                .upsert(entriesToInsert, { onConflict: 'cast_id, work_date, shift_type', ignoreDuplicates: false });

            if (error) {
                if (error.code === '23505' && error.message.includes('unique_cast_work_date_shift')) {
                    setScheduleEntryError("มีน้องแมวบางตัวที่คุณเลือกมีตารางกะในวันที่และกะนี้อยู่แล้ว (ไม่สามารถเพิ่มซ้ำได้)");
                } else {
                    throw error;
                }
            } else {
                setScheduleEntryMessage(`เพิ่มตารางกะสำหรับ ${selectedCastsForSchedule.length} คนในวันที่ ${scheduleDate} กะ ${selectedShiftType} สำเร็จ!`);
                setSelectedCastsForSchedule([]);
                await fetchSchedulesByDate(scheduleDate);
            }
        } catch (err) {
            console.error("Error adding schedule entry:", err);
            setScheduleEntryError("เพิ่มตารางกะไม่สำเร็จ: " + err.message);
        } finally {
            setIsSchedulingSubmitting(false);
        }
    };

    const handleDeleteScheduleEntry = async (scheduleId, castName, shiftType) => {
        if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ ${castName} ออกจากตารางกะ ${shiftType} ในวันนี้?`)) return;

        setIsSchedulingSubmitting(true);
        setScheduleEntryError('');
        setScheduleEntryMessage('');

        try {
            const { error } = await supabase
                .from('schedules')
                .delete()
                .eq('id', scheduleId);

            if (error) throw error;

            setScheduleEntryMessage(`ลบ ${castName} ออกจากตารางกะ ${shiftType} สำเร็จ!`);
            await fetchSchedulesByDate(scheduleDate);
        } catch (err) {
            console.error("Error deleting schedule entry:", err);
            setScheduleEntryError("ลบตารางกะไม่สำเร็จ: " + err.message);
        } finally {
            setIsSchedulingSubmitting(false);
        }
    };

    // Old Schedule Image Management Logic
    const handleScheduleImageFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setScheduleImageFile(file);
            setScheduleImagePreview(URL.createObjectURL(file));
            setScheduleActionMessage(''); setScheduleError('');
        } else {
            setScheduleImageFile(null);
            setScheduleImagePreview(currentScheduleImageUrl);
        }
    };

    const handleScheduleUpload = async () => {
        if (!scheduleImageFile) {
            setScheduleError("กรุณาเลือกไฟล์รูปภาพตารางงานใหม่ก่อน"); return;
        }
        setIsScheduleSubmitting(true); setScheduleError(''); setScheduleActionMessage('');
        try {
            const fileExtension = scheduleImageFile.name.split('.').pop();
            const newFileName = `schedule-${Date.now()}.${fileExtension}`;
            const filePath = `public/${newFileName}`;

            const { error: uploadError } = await supabase.storage
                .from(SCHEDULE_ASSETS_BUCKET_NAME)
                .upload(filePath, scheduleImageFile, { cacheControl: '3600', upsert: false });
            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage.from(SCHEDULE_ASSETS_BUCKET_NAME).getPublicUrl(filePath);
            const newImageUrl = publicUrlData.publicUrl;

            if (currentScheduleImageUrl) {
                try {
                    const oldImageKey = currentScheduleImageUrl.substring(currentScheduleImageUrl.indexOf(`/${SCHEDULE_ASSETS_BUCKET_NAME}/`) + `/${SCHEDULE_ASSETS_BUCKET_NAME}/`.length);
                    if (oldImageKey && oldImageKey !== filePath) { await supabase.storage.from(SCHEDULE_ASSETS_BUCKET_NAME).remove([oldImageKey]); }
                } catch (deleteOldError) { console.warn("Could not delete old schedule image:", deleteOldError.message); }
            }

            const { error: dbUpdateError } = await supabase
                .from('site_configurations')
                .upsert({ config_key: 'current_schedule_image_url', config_value: newImageUrl, description: 'URL รูปภาพตารางงาน' }, { onConflict: 'config_key' });
            if (dbUpdateError) throw dbUpdateError;

            setCurrentScheduleImageUrl(newImageUrl);
            setScheduleImagePreview(newImageUrl);
            setScheduleImageFile(null);
            setScheduleActionMessage("อัปโหลด/เปลี่ยนรูปตารางงานสำเร็จ!");
        } catch (err) {
            console.error("Error uploading schedule image:", err);
            setScheduleError("เกิดข้อผิดพลาดในการอัปโหลดรูปตารางงาน: " + err.message);
        } finally { setIsScheduleSubmitting(false); }
    };

    const handleScheduleDelete = async () => {
        if (!currentScheduleImageUrl) {
            setScheduleError("ไม่มีรูปตารางงานปัจจุบันให้ลบ"); return;
        }
        if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรูปตารางงานปัจจุบัน?")) return;
        setIsScheduleSubmitting(true); setScheduleError(''); setScheduleActionMessage('');
        try {
            const imageKey = currentScheduleImageUrl.substring(currentScheduleImageUrl.indexOf(`/${SCHEDULE_ASSETS_BUCKET_NAME}/`) + `/${SCHEDULE_ASSETS_BUCKET_NAME}/`.length);
            if (imageKey) {
                const { error: storageDeleteError } = await supabase.storage.from(SCHEDULE_ASSETS_BUCKET_NAME).remove([imageKey]);
                if (storageDeleteError) throw storageDeleteError;
            }
            const { error: dbUpdateError } = await supabase
                .from('site_configurations')
                .upsert({ config_key: 'current_schedule_image_url', config_value: null, description: 'URL รูปภาพตารางงาน' }, { onConflict: 'config_key' });
            if (dbUpdateError) throw dbUpdateError;
            setCurrentScheduleImageUrl(''); setScheduleImagePreview(''); setScheduleImageFile(null);
            setScheduleActionMessage("ลบรูปตารางงานสำเร็จ!");
        } catch (err) {
            console.error("Error deleting schedule image:", err);
            setScheduleError("เกิดข้อผิดพลาดในการลบรูปตารางงาน: " + err.message);
        } finally { setIsScheduleSubmitting(false); }
    };

    // Banner Management Logic
    const handleBannerImageFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerImageFile(file);
            setBannerImagePreview(URL.createObjectURL(file));
        }
    };

    const handleBannerUpload = async (e) => {
        e.preventDefault();
        if (!bannerImageFile) {
            setBannerError("กรุณาเลือกไฟล์รูปภาพสำหรับ Banner ก่อน");
            return;
        }
        setIsBannerSubmitting(true);
        setBannerError('');
        setBannerActionMessage('');
        try {
            const fileExtension = bannerImageFile.name.split('.').pop();
            const newFileName = `banner-${Date.now()}.${fileExtension}`;

            const { error: uploadError } = await supabase.storage
                .from(BANNER_IMAGES_BUCKET_NAME)
                .upload(newFileName, bannerImageFile, { cacheControl: '3600', upsert: false });

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage.from(BANNER_IMAGES_BUCKET_NAME).getPublicUrl(newFileName);
            const imageUrl = publicUrlData.publicUrl;

            const newBannerData = {
                image_url: imageUrl,
                alt_text: bannerAltText || 'Hero Banner Image',
                link_url: bannerLinkUrl || null,
            };

            const { error: dbError } = await supabase.from('hero_banners').insert(newBannerData);
            if (dbError) throw dbError;

            setBannerActionMessage("อัปโหลดรูปภาพ Banner ใหม่สำเร็จ!");
            await fetchBannerImages();
            setBannerImageFile(null);
            setBannerImagePreview('');
            setBannerAltText('');
            setBannerLinkUrl('');
            e.target.reset();

        } catch (err) {
            console.error("Error uploading banner image:", err);
            setBannerError("เกิดข้อผิดพลาดในการอัปโหลด Banner: " + err.message);
        } finally {
            setIsBannerSubmitting(false);
        }
    };

    const handleDeleteBannerImage = async (bannerId, bannerImageUrl) => {
        if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบรูปภาพ Banner นี้?`)) return;

        setIsBannerSubmitting(true);
        setBannerError('');
        setBannerActionMessage('');

        try {
            const { error: dbError } = await supabase.from('hero_banners').delete().eq('id', bannerId);
            if (dbError) throw dbError;

            if (bannerImageUrl) {
                try {
                    const pathStartIndex = bannerImageUrl.indexOf(`/${BANNER_IMAGES_BUCKET_NAME}/`) + `/${BANNER_IMAGES_BUCKET_NAME}/`.length;
                    const filePathInBucket = bannerImageUrl.substring(pathStartIndex);
                    if (filePathInBucket) {
                        await supabase.storage.from(BANNER_IMAGES_BUCKET_NAME).remove([filePathInBucket]);
                    }
                } catch (storageError) {
                    console.warn("ลบรูปภาพ Banner จาก Storage ไม่สำเร็จ (แต่อาจถูกลบจากฐานข้อมูลแล้ว):", storageError.message);
                }
            }
            setBannerActionMessage(`รูปภาพ Banner (ID: ${bannerId}) ถูกลบสำเร็จ!`);
            await fetchBannerImages();

        } catch (err) {
            console.error("Error deleting banner image:", err);
            setBannerError("ลบรูปภาพ Banner ไม่สำเร็จ: " + err.message);
        } finally {
            setIsBannerSubmitting(false);
        }
    };

    // --- Job Application Logic ---
    const handleDeleteApplication = async (applicationId, resumeUrl) => {
        if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบใบสมัครนี้? การกระทำนี้ไม่สามารถย้อนกลับได้`)) return;
        setIsDeletingJobApp(true);
        setJobAppsError('');
        setJobAppsActionMessage('');
        try {
            const { error: dbError } = await supabase.from('job_applications').delete().eq('id', applicationId);
            if (dbError) throw dbError;

            if (resumeUrl) {
                try {
                    const pathStartIndex = resumeUrl.indexOf(`/${JOB_APP_RESUMES_BUCKET_NAME}/`) + `/${JOB_APP_RESUMES_BUCKET_NAME}/`.length;
                    const filePathInBucket = resumeUrl.substring(pathStartIndex);
                    if (filePathInBucket) {
                        await supabase.storage.from(JOB_APP_RESUMES_BUCKET_NAME).remove([filePathInBucket]);
                    }
                } catch (storageError) {
                    console.warn(`ลบไฟล์ Resume จาก Storage ไม่สำเร็จ (แต่ใบสมัครถูกลบจาก DB แล้ว):`, storageError.message);
                }
            }
            setJobAppsActionMessage(`ใบสมัคร (ID: ${applicationId}) ถูกลบสำเร็จ!`);
            await fetchJobApplications();
            setSelectedApplication(null);

        } catch (err) {
            console.error("Error deleting job application:", err);
            setJobAppsError("เกิดข้อผิดพลาดในการลบใบสมัคร: " + err.message);
        } finally {
            setIsDeletingJobApp(false);
        }
    };

    // Membership Points Management Logic
    const resetMembershipState = () => {
        setShowScanner(false);
        setScannedUserId(null);
        setPointsToAdd(10);
        setMembershipMessage('');
        setMembershipError('');
    };

    const handleScanSuccess = useCallback((decodedText, decodedResult) => {
        console.log(`Scan result: ${decodedText}`);
        setMembershipMessage('');
        setMembershipError('');
        setScannedUserId(decodedText);
        setShowScanner(false);
    }, []);

    const handleAddPoints = async () => {
        if (!scannedUserId) {
            setMembershipError("ไม่พบ User ID ที่สแกน");
            return;
        }
        if (!pointsToAdd || pointsToAdd <= 0) {
            setMembershipError("กรุณาใส่จำนวนคะแนนที่มากกว่า 0");
            return;
        }

        setIsAddingPoints(true);
        setMembershipError('');
        setMembershipMessage('');

        try {
            const { error: rpcError } = await supabase.rpc('increment_points', {
                user_id_input: scannedUserId,
                points_to_add: parseInt(pointsToAdd, 10)
            });

            if (rpcError) throw rpcError;

            setMembershipMessage(`เพิ่ม ${pointsToAdd} คะแนนให้ User ID: ${scannedUserId.substring(0, 8)}... สำเร็จ!`);
            setScannedUserId(null);
            setPointsToAdd(10);

        } catch (err) {
            console.error("Error adding points:", err);
            setMembershipError(`เกิดข้อผิดพลาดในการเพิ่มคะแนน: ${err.message}`);
        } finally {
            setIsAddingPoints(false);
        }
    };

    useEffect(() => {
        if (activeAdminSection !== 'membership' || !showScanner) {
            return;
        }

        let scanner;
        try {
            scanner = new Html5QrcodeScanner(
                'qr-scanner-container',
                { fps: 10, qrbox: { width: 250, height: 250 } },
                true
            );

            scanner.render(handleScanSuccess, (error) => { /* console.warn(error) */ });
        } catch (error) {
            console.error("Error initializing Html5QrcodeScanner:", error);
            setMembershipError("ไม่สามารถเปิดกล้องสแกน QR Code ได้ โปรดตรวจสอบการอนุญาตใช้งานกล้อง");
            setShowScanner(false);
        }

        return () => {
            if (scanner && scanner.getState() !== 1) {
                scanner.clear().catch(error => {
                    console.error("Failed to clear QR scanner on cleanup.", error);
                });
            }
        };
    }, [showScanner, activeAdminSection, handleScanSuccess]);


    // NEW: Product Management Logic
    const resetProductForm = useCallback(() => {
        setProductForm(initialProductFormState);
        setProductMainImagePreview('');
        setProductOtherImagePreviews([]);
        setSelectedProductForEditing(null);
        setProductError('');
        setProductActionMessage('');
        setNewCustomItemChoice(''); // Reset custom input too
        const formElement = document.getElementById('product-form-section');
        if (formElement) formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    const handleProductFormChange = (e) => {
        const { name, value } = e.target;
        setProductForm(prev => ({ ...prev, [name]: value }));
    };

    const handleProductMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProductForm(prev => ({ ...prev, main_image_file: file }));
            setProductMainImagePreview(URL.createObjectURL(file));
        } else {
            setProductForm(prev => ({ ...prev, main_image_file: null }));
            setProductMainImagePreview(productForm.current_main_image_url || '');
        }
    };

    const handleProductOtherImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setProductForm(prev => ({ ...prev, other_image_files: [...prev.other_image_files, ...files] }));
            const newPreviews = files.map(file => ({
                url: URL.createObjectURL(file),
                isNew: true,
                file: file
            }));
            setProductOtherImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const handleRemoveProductOtherImage = (urlToRemove, isNew) => {
        if (isNew) {
            const previewToRemove = productOtherImagePreviews.find(p => p.url === urlToRemove);
            if (previewToRemove) {
                setProductForm(prev => ({
                    ...prev,
                    other_image_files: prev.other_image_files.filter(file => file !== previewToRemove.file)
                }));
            }
        } else {
            setProductForm(prev => ({
                ...prev,
                other_images_to_delete: [...prev.other_images_to_delete, urlToRemove],
                current_other_image_urls: prev.current_other_image_urls.filter(url => url !== urlToRemove)
            }));
        }
        setProductOtherImagePreviews(prev => prev.filter(p => p.url !== urlToRemove));
    };

    // NEW: Handle available item choices change (checkboxes and custom input)
    const handleAvailableItemChoiceChange = (choice) => {
        setProductForm(prev => ({
            ...prev,
            selected_available_item_choices: {
                ...prev.selected_available_item_choices,
                [choice]: !prev.selected_available_item_choices[choice],
            }
        }));
    };

    const handleAddCustomItemChoice = () => {
        if (newCustomItemChoice && !productForm.selected_available_item_choices.custom.includes(newCustomItemChoice) && !Object.keys(productForm.selected_available_item_choices).includes(newCustomItemChoice)) {
            setProductForm(prev => ({
                ...prev,
                selected_available_item_choices: {
                    ...prev.selected_available_item_choices,
                    custom: [...prev.selected_available_item_choices.custom, newCustomItemChoice],
                }
            }));
            setNewCustomItemChoice('');
        }
    };

    const handleRemoveCustomItemChoice = (choiceToRemove) => {
        setProductForm(prev => ({
            ...prev,
            selected_available_item_choices: {
                ...prev.selected_available_item_choices,
                custom: prev.selected_available_item_choices.custom.filter(c => c !== choiceToRemove),
            }
        }));
    };

    // NEW: Handle dynamic product options
    const handleAddOption = () => {
        setProductForm(prev => ({
            ...prev,
            options: [...prev.options, {
                id: `option-${Date.now()}-${prev.options.length}`, // Simple unique ID
                name: '',
                price: 0,
                type: 'single-item', // Default type
                bundleIncludes: [],
                itemType: '',
                selectionType: 'select-single',
                count: 1,
                extraFeatures: [],
                castSelection: { enabled: false, selectionType: 'select-single', count: 1, description: 'เลือก Cast 1 คน' }
            }]
        }));
    };

    const handleRemoveOption = (indexToRemove) => {
        setProductForm(prev => ({
            ...prev,
            options: prev.options.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleOptionFieldChange = (index, field, value) => {
        setProductForm(prev => {
            const newOptions = [...prev.options];
            newOptions[index] = { ...newOptions[index], [field]: value };
            // Reset dependent fields if type changes
            if (field === 'type') {
                if (value === 'bundle') {
                    newOptions[index] = { ...newOptions[index], itemType: '', count: 1 }; // Clear single-item fields
                } else if (value === 'single-item') {
                    newOptions[index] = { ...newOptions[index], bundleIncludes: [] }; // Clear bundle-includes
                }
            }
            return { ...prev, options: newOptions };
        });
    };

    // For bundleIncludes array within an option
    const handleAddBundleItem = (optionIndex) => {
        setProductForm(prev => {
            const newOptions = [...prev.options];
            const newBundleIncludes = [...(newOptions[optionIndex].bundleIncludes || []), {
                id: `bundle-${Date.now()}-${newOptions[optionIndex].bundleIncludes.length}`, // Simple ID
                itemType: '', selectionType: 'select-single', count: 1, description: ''
            }];
            newOptions[optionIndex] = { ...newOptions[optionIndex], bundleIncludes: newBundleIncludes };
            return { ...prev, options: newOptions };
        });
    };
    // ✅ [เพิ่มใหม่] Logic สำหรับจัดการประกาศ
    const resetAnnouncementForm = useCallback(() => {
        setAnnouncementForm(initialAnnouncementFormState);
        setSelectedAnnouncement(null);
        setAnnouncementError('');
        setAnnouncementActionMessage('');
        const formElement = document.getElementById('announcement-form-section');
        if (formElement) formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    const handleAnnouncementFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAnnouncementForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSelectAnnouncementForEditing = useCallback((announcement) => {
        setSelectedAnnouncement(announcement);
        setAnnouncementForm({
            id: announcement.id,
            message: announcement.message || '',
            link_url: announcement.link_url || '',
            is_active: announcement.is_active,
            sort_order: announcement.sort_order || 0,
        });
        setAnnouncementActionMessage('');
        setAnnouncementError('');
        const formElement = document.getElementById('announcement-form-section');
        if (formElement) formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    const handleAnnouncementSubmit = async (e) => {
        e.preventDefault();
        if (!announcementForm.message) {
            setAnnouncementError("กรุณากรอกข้อความประกาศ");
            return;
        }
        setIsAnnouncementSubmitting(true);
        setAnnouncementError('');
        setAnnouncementActionMessage('');

        const dataToSave = {
            message: announcementForm.message,
            link_url: announcementForm.link_url || null,
            is_active: announcementForm.is_active,
            sort_order: Number(announcementForm.sort_order),
        };

        try {
            let resultMessage = '';
            if (selectedAnnouncement?.id) {
                // Update existing announcement
                const { data, error } = await supabase
                    .from('announcements')
                    .update(dataToSave)
                    .eq('id', selectedAnnouncement.id)
                    .select()
                    .single();
                if (error) throw error;
                resultMessage = `ประกาศ "${data.message.substring(0, 20)}..." อัปเดตสำเร็จ!`;
            } else {
                // Insert new announcement
                const { data, error } = await supabase
                    .from('announcements')
                    .insert(dataToSave)
                    .select()
                    .single();
                if (error) throw error;
                resultMessage = `ประกาศใหม่ "${data.message.substring(0, 20)}..." สร้างสำเร็จ!`;
            }
            setAnnouncementActionMessage(resultMessage);
            resetAnnouncementForm();
            await fetchAnnouncements();
        } catch (err) {
            console.error("Error saving announcement:", err);
            setAnnouncementError("บันทึกข้อมูลประกาศไม่สำเร็จ: " + err.message);
        } finally {
            setIsAnnouncementSubmitting(false);
        }
    };

    const handleDeleteAnnouncement = async (announcementId, announcementMessage) => {
        if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบประกาศ: "${announcementMessage.substring(0, 50)}..."?`)) return;

        setIsAnnouncementSubmitting(true);
        setAnnouncementError('');
        setAnnouncementActionMessage('');

        try {
            const { error } = await supabase.from('announcements').delete().eq('id', announcementId);
            if (error) throw error;

            setAnnouncementActionMessage(`ประกาศ ID: ${announcementId} ถูกลบสำเร็จ!`);
            await fetchAnnouncements();
            if (selectedAnnouncement?.id === announcementId) {
                resetAnnouncementForm();
            }
        } catch (err) {
            console.error("Error deleting announcement:", err);
            setAnnouncementError("ลบประกาศไม่สำเร็จ: " + err.message);
        } finally {
            setIsAnnouncementSubmitting(false);
        }
    };
    const handleRemoveBundleItem = (optionIndex, bundleItemIndex) => {
        setProductForm(prev => {
            const newOptions = [...prev.options];
            newOptions[optionIndex].bundleIncludes = newOptions[optionIndex].bundleIncludes.filter((_, i) => i !== bundleItemIndex);
            return { ...prev, options: newOptions };
        });
    };

    const handleBundleItemFieldChange = (optionIndex, bundleItemIndex, field, value) => {
        setProductForm(prev => {
            const newOptions = [...prev.options];
            newOptions[optionIndex].bundleIncludes[bundleItemIndex] = { ...newOptions[optionIndex].bundleIncludes[bundleItemIndex], [field]: value };
            return { ...prev, options: newOptions };
        });
    };

    // For extraFeatures array within an option
    const handleAddExtraFeature = (optionIndex) => {
        setProductForm(prev => {
            const newOptions = [...prev.options];
            const newExtraFeatures = [...(newOptions[optionIndex].extraFeatures || []), {
                id: `feature-${Date.now()}-${newOptions[optionIndex].extraFeatures.length}`, // Simple ID
                name: '', price: 0, type: 'checkbox'
            }];
            newOptions[optionIndex] = { ...newOptions[optionIndex], extraFeatures: newExtraFeatures };
            return { ...prev, options: newOptions };
        });
    };

    const handleRemoveExtraFeature = (optionIndex, featureIndex) => {
        setProductForm(prev => {
            const newOptions = [...prev.options];
            newOptions[optionIndex].extraFeatures = newOptions[optionIndex].extraFeatures.filter((_, i) => i !== featureIndex);
            return { ...prev, options: newOptions };
        });
    };

    const handleExtraFeatureFieldChange = (optionIndex, featureIndex, field, value) => {
        setProductForm(prev => {
            const newOptions = [...prev.options];
            newOptions[optionIndex].extraFeatures[featureIndex] = { ...newOptions[optionIndex].extraFeatures[featureIndex], [field]: value };
            return { ...prev, options: newOptions };
        });
    };

    // For castSelection within an option
    const handleCastSelectionFieldChange = (optionIndex, field, value) => {
        setProductForm(prev => {
            const newOptions = [...prev.options];
            newOptions[optionIndex] = {
                ...newOptions[optionIndex],
                castSelection: {
                    ...(newOptions[optionIndex].castSelection || { enabled: false, selectionType: 'select-single', count: 1, description: 'เลือก Cast 1 คน' }),
                    [field]: value
                }
            };
            return { ...prev, options: newOptions };
        });
    };

    const handleSelectProductForEditing = useCallback((product) => {
        const formElement = document.getElementById('product-form-section');
        if (formElement) formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

        setSelectedProductForEditing(product);

        const otherImageUrls = (product.images_urls && Array.isArray(product.images_urls))
            ? product.images_urls
            : (product.images ? [product.images] : []);

        // Reconstruct selected_available_item_choices for editing
        const loadedAvailableItemChoices = {
            '4x6': (product.available_item_choices?.['4x6']?.length > 0) || false,
            '8x12': (product.available_item_choices?.['8x12']?.length > 0) || false,
            'tapestry': (product.available_item_choices?.['tapestry']?.length > 0) || false,
            custom: (product.available_item_choices ?
                Object.keys(product.available_item_choices).filter(key => !['4x6', '8x12', 'tapestry'].includes(key) && product.available_item_choices[key].length > 0)
                : []
            ),
        };

        setProductForm({
            id: product.id || '',
            name: product.name || '',
            description: product.description || '',
            main_image_file: null,
            current_main_image_url: product.main_image_url || '',
            other_image_files: [],
            current_other_image_urls: otherImageUrls,
            other_images_to_delete: [],
            selected_available_item_choices: loadedAvailableItemChoices,
            options: product.options || [], // Assume options are already an array
        });

        setProductMainImagePreview(product.main_image_url || '');
        setProductOtherImagePreviews(otherImageUrls.map(url => ({ url, isNew: false })));
        setProductActionMessage('');
        setProductError('');
    }, []);

    // AdminOrderManagementPage.js

// ✅ แก้ไขฟังก์ชันนี้ให้ถูกต้องตามความต้องการล่าสุด (ไม่เก็บ URL รูป)
const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name) {
        setProductError("กรุณากรอกชื่อสินค้า");
        return;
    }

    setIsProductSubmitting(true);
    setProductError('');
    setProductActionMessage('');

    try {
        let finalMainImageUrl = productForm.current_main_image_url;
        let finalOtherImageUrls = [...productForm.current_other_image_urls];

        // ... (ส่วนการจัดการรูปภาพหลักและรูปภาพอื่นๆ ยังคงเหมือนเดิม) ...

        // Upload Main Image
        if (productForm.main_image_file) {
            const file = productForm.main_image_file;
            const fileExtension = file.name.split('.').pop();
            const newFileName = `main-${productForm.id || Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExtension}`;
            const filePath = newFileName;
            const { error: uploadError } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET_NAME).upload(filePath, file, { cacheControl: '3600', upsert: true });
            if (uploadError) throw new Error(`อัปโหลดรูปภาพหลักไม่สำเร็จ: ${uploadError.message}`);
            const { data: publicUrlData } = supabase.storage.from(PRODUCT_IMAGES_BUCKET_NAME).getPublicUrl(filePath);
            finalMainImageUrl = publicUrlData.publicUrl;

            if (selectedProductForEditing && selectedProductForEditing.main_image_url && selectedProductForEditing.main_image_url !== finalMainImageUrl) {
                try {
                    const oldStoragePath = selectedProductForEditing.main_image_url.substring(selectedProductForEditing.main_image_url.indexOf(`/${PRODUCT_IMAGES_BUCKET_NAME}/`) + `/${PRODUCT_IMAGES_BUCKET_NAME}/`.length);
                    if (oldStoragePath && oldStoragePath !== filePath) { await supabase.storage.from(PRODUCT_IMAGES_BUCKET_NAME).remove([oldStoragePath]); }
                } catch (delError) { console.warn("Could not delete old main product image:", delError.message); }
            }
        }

        // Handle Other Image Deletions
        if (productForm.other_images_to_delete.length > 0) {
            const pathsToDelete = productForm.other_images_to_delete.map(url => {
                return url.substring(url.indexOf(`/${PRODUCT_IMAGES_BUCKET_NAME}/`) + `/${PRODUCT_IMAGES_BUCKET_NAME}/`.length);
            });
            const { error: deleteError } = await supabase.storage
                .from(PRODUCT_IMAGES_BUCKET_NAME)
                .remove(pathsToDelete);
            if (deleteError) { console.warn("Could not delete some old product other images:", deleteError.message); }
        }

        // Upload New Other Images
        if (productForm.other_image_files.length > 0) {
            const uploadPromises = productForm.other_image_files.map(async (file) => {
                const fileExtension = file.name.split('.').pop();
                const newFileName = `other-${productForm.id || Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExtension}`;
                const { error: uploadError } = await supabase.storage
                    .from(PRODUCT_IMAGES_BUCKET_NAME)
                    .upload(newFileName, file, { cacheControl: '3600', upsert: false });
                if (uploadError) { throw new Error(`อัปโหลดไฟล์ ${file.name} ไม่สำเร็จ: ${uploadError.message}`); }
                const { data: publicUrlData } = supabase.storage.from(PRODUCT_IMAGES_BUCKET_NAME).getPublicUrl(newFileName);
                return publicUrlData.publicUrl;
            });
            const newImageUrls = await Promise.all(uploadPromises);
            finalOtherImageUrls.push(...newImageUrls);
        }

        // ✅ FIXED LOGIC: สร้าง available_item_choices โดย "ไม่มี" img property
        const availableItemChoicesToSave = {};
        if (productForm.selected_available_item_choices['4x6']) {
            availableItemChoicesToSave['4x6'] = [
                { id: '4x6-a', name: 'รูป 4x6 แบบ A' }, // REMOVED: img property
                { id: '4x6-b', name: 'รูป 4x6 แบบ B' },
                { id: '4x6-c', name: 'รูป 4x6 แบบ C' },
                { id: '4x6-d', name: 'รูป 4x6 แบบ D' },
            ];
        }
        if (productForm.selected_available_item_choices['8x12']) {
            availableItemChoicesToSave['8x12'] = [
                { id: '8x12-a', name: 'รูป 8x12 แบบ A' }, // REMOVED: img property
                { id: '8x12-b', name: 'รูป 8x12 แบบ B' },
                { id: '8x12-c', name: 'รูป 8x12 แบบ C' },
                { id: '8x12-d', name: 'รูป 8x12 แบบ D' },
            ];
        }
        if (productForm.selected_available_item_choices['tapestry']) {
            availableItemChoicesToSave['tapestry'] = [
                { id: 'tape-a', name: 'Tapestry ลาย A' }, // REMOVED: img property
                { id: 'tape-b', name: 'Tapestry ลาย B' },
                { id: 'tape-c', name: 'Tapestry ลาย C' },
                { id: 'tape-d', name: 'Tapestry ลาย D' },
            ];
        }
        productForm.selected_available_item_choices.custom.forEach(customChoice => {
            availableItemChoicesToSave[customChoice] = [{ id: customChoice, name: customChoice }]; // REMOVED: img property
        });

        const productDataToSave = {
            id: productForm.id,
            name: productForm.name,
            description: productForm.description,
            main_image_url: finalMainImageUrl,
            images_urls: finalOtherImageUrls,
            available_item_choices: availableItemChoicesToSave, // จะบันทึกข้อมูลโดยไม่มี img property แล้ว
            options: productForm.options,
        };

        let result;
        if (selectedProductForEditing?.id) {
            result = await updateProduct(selectedProductForEditing.id, productDataToSave);
            setProductActionMessage(`สินค้า "${result.name}" อัปเดตสำเร็จ!`);
        } else {
            if (!productDataToSave.id) {
                productDataToSave.id = `product-${Date.now()}`;
            }
            result = await addProduct(productDataToSave);
            setProductActionMessage(`เพิ่มสินค้า "${result.name}" สำเร็จ!`);
        }

        resetProductForm();
        await fetchManagedProducts();
    } catch (err) {
        console.error("Error saving product data:", err);
        setProductError("บันทึกข้อมูลสินค้าไม่สำเร็จ: " + err.message);
    } finally {
        setIsProductSubmitting(false);
    }
};

    const handleDeleteProduct = async (productId, productName, mainImageUrl, otherImageUrls) => {
        if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบสินค้า "${productName}" (ID: ${productId})? การกระทำนี้ไม่สามารถย้อนกลับได้`)) return;

        setIsProductSubmitting(true);
        setProductError('');
        setProductActionMessage('');

        try {
            await deleteProduct(productId); // Use service function

            // Delete associated images from storage
            const urlsToDelete = [mainImageUrl, ...(Array.isArray(otherImageUrls) ? otherImageUrls : [])].filter(Boolean); // Filter out null/undefined

            if (urlsToDelete.length > 0) {
                const pathsToDelete = urlsToDelete.map(url => {
                    return url.substring(url.indexOf(`/${PRODUCT_IMAGES_BUCKET_NAME}/`) + `/${PRODUCT_IMAGES_BUCKET_NAME}/`.length);
                });
                const { error: storageError } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET_NAME).remove(pathsToDelete);
                if (storageError) {
                    console.warn("Could not delete some product images from Storage:", storageError.message);
                }
            }

            setProductActionMessage(`สินค้า "${productName}" (ID: ${productId}) ถูกลบสำเร็จ!`);
            await fetchManagedProducts();
            if (selectedProductForEditing?.id === productId) resetProductForm();

        } catch (err) {
            console.error("Error deleting product:", err);
            setProductError("ลบสินค้าไม่สำเร็จ: " + err.message);
        } finally {
            setIsProductSubmitting(false);
        }
    };


    // --- Render Logic ---
    if (isLoading) return <div style={{ textAlign: 'center', padding: '20px', paddingTop: '80px', fontSize: '1.2em' }}>⏳ กำลังโหลดข้อมูล...</div>;
    // ✅ [อัปเดต] เพิ่ม announcementError ในเงื่อนไข
    if (!isAuthorized) return <div style={{ color: 'red', textAlign: 'center', padding: '20px', paddingTop: '80px' }}><h2>⛔ Access Denied</h2><p>{orderError || eventError || castError || scheduleError || bannerError || jobAppsError || scheduleEntryError || productError || announcementError || "คุณไม่ได้รับสิทธิ์ให้เข้าถึงหน้านี้"}</p></div>;

    const tabButtonStyle = (isActive) => ({
        padding: '10px 20px', cursor: 'pointer',
        border: '1px solid #ccc', borderBottom: isActive ? '1px solid white' : '1px solid #ccc',
        marginRight: '5px', backgroundColor: isActive ? 'white' : '#f0f0f0',
        borderRadius: '5px 5px 0 0', fontSize: '1em', fontWeight: isActive ? 'bold' : '500',
        color: isActive ? '#007bff' : '#333',
        display: 'flex', alignItems: 'center', gap: '8px',
        marginTop: '5px'
    });

    const renderOrderList = (title, ordersToRender, listTypeMessage) => (
        <>
            <h3 style={{ marginTop: '0px', marginBottom: '10px' }}>{title} ({ordersToRender.length})</h3>
            {ordersToRender.length === 0 && <p style={{ textAlign: 'center', color: '#777', marginTop: '20px' }}>ไม่มีคำสั่งซื้อ{listTypeMessage}</p>}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {ordersToRender.map(order => (
                    <li key={order.id} style={{ padding: '12px', borderBottom: '1px solid #eee', cursor: 'pointer', backgroundColor: selectedOrder?.id === order.id ? '#e9f5ff' : 'transparent', borderRadius: '3px', marginBottom: '5px' }} onClick={() => handleSelectOrder(order)}>
                        <div><strong>ID:</strong> {order.id.substring(0, 8)}... | <strong>ลูกค้า:</strong> {order.contact_info?.name || 'N/A'}</div>
                        <div><strong>วันที่:</strong> {new Date(order.created_at).toLocaleDateString('th-TH')} | <strong>ยอด:</strong> {order.total_amount?.toFixed(2) || 'N/A'} บ.</div>
                        <div><strong>สถานะ:</strong> <span style={{ fontWeight: 'bold' }}>{order.status || 'N/A'}</span> | <strong>ตรวจสอบ:</strong> <span style={{ fontWeight: 'bold' }}>{order.verification_status || 'รอตรวจสอบ'}</span></div>
                        {order.slip_url && <a href={order.slip_url} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', fontSize: '0.9em', textDecoration: 'underline' }}>ดูสลิป</a>}
                    </li>
                ))}
            </ul>
        </>
    );

    const formSectionStyle = { marginBottom: '30px', padding: '25px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' };
    const formInputStyle = { width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' };
    const formLabelStyle = { display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' };
    const formButtonStyle = (bgColor = '#007bff', disabled = false) => ({
        backgroundColor: disabled ? '#ccc' : bgColor, color: 'white', padding: '10px 20px',
        border: 'none', borderRadius: '4px', cursor: disabled ? 'not-allowed' : 'pointer', fontSize: '1em',
        opacity: disabled ? 0.6 : 1, transition: 'background-color 0.2s ease, opacity 0.2s ease',
        display: 'inline-flex', alignItems: 'center', gap: '5px', marginRight: '10px'
    });


    // ===== NEW: CSS Keyframes for Banner Carousel =====
    const scrollAnimationKeyframes = `
        @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-350px * ${bannerImages.length})); }
        }
    `;

    return (
        <div style={{ padding: '20px', paddingTop: '70px', maxWidth: '1600px', margin: '0 auto', fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>

            {/* ===== NEW: Style tag for Carousel Animation ===== */}
            <style>{scrollAnimationKeyframes}</style>

            <h1 style={{ fontSize: '1.8em', marginBottom: '20px', color: '#333', textAlign: 'center' }}>หน้าจัดการข้อมูล (Admin)</h1>
            <div style={{ marginBottom: '0px', borderBottom: '1px solid #ccc', display: 'flex', flexWrap: 'wrap' }}>
                <button onClick={() => setActiveAdminSection('orders')} style={tabButtonStyle(activeAdminSection === 'orders')}>
                    <FaClipboardList /> จัดการคำสั่งซื้อ
                </button>
                <button onClick={() => setActiveAdminSection('events')} style={tabButtonStyle(activeAdminSection === 'events')}>
                    <FaCalendarAlt /> จัดการอีเว้นท์
                </button>
                <button onClick={() => setActiveAdminSection('casts')} style={tabButtonStyle(activeAdminSection === 'casts')}>
                    <FaUsersCog /> จัดการข้อมูลน้องแมว
                </button>
                <button onClick={() => setActiveAdminSection('schedule')} style={tabButtonStyle(activeAdminSection === 'schedule')}>
                    <FaRegCalendarCheck /> จัดการตารางงาน
                </button>
                <button onClick={() => setActiveAdminSection('products')} style={tabButtonStyle(activeAdminSection === 'products')}>
                    <FaBoxes /> จัดการสินค้า
                </button>
                <button onClick={() => setActiveAdminSection('banner')} style={tabButtonStyle(activeAdminSection === 'banner')}>
                    <FaImages /> จัดการ Banner
                </button>
                <button onClick={() => setActiveAdminSection('jobApplications')} style={tabButtonStyle(activeAdminSection === 'jobApplications')}>
                    <FaBriefcase /> จัดการใบสมัครงาน
                </button>
                <button onClick={() => setActiveAdminSection('membership')} style={tabButtonStyle(activeAdminSection === 'membership')}>
                    <FaIdCard /> จัดการสมาชิก/แต้ม
                </button>
                <button onClick={() => setActiveAdminSection('announcements')} style={tabButtonStyle(activeAdminSection === 'announcements')}>
                    <FaBullhorn /> จัดการประกาศ
                </button>
            </div>

            <div style={{ border: '1px solid #ccc', borderTop: 'none', padding: '20px', borderRadius: '0 0 8px 8px', backgroundColor: '#fdfdff', minHeight: '70vh' }}>
                {activeAdminSection === 'orders' && (
                    <>
                        {orderActionMessage && <p style={{ color: 'green', border: '1px solid #4CAF50', padding: '12px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#e8f5e9' }}>✅ {orderActionMessage}</p>}
                        {orderError && <p style={{ color: 'red', border: '1px solid #f44336', padding: '12px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#ffebee' }}>❌ {orderError}</p>}

                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
                            <div style={{ flex: 1, minWidth: '380px', maxHeight: 'calc(100vh - 320px)', overflowY: 'auto', border: '1px solid #e0e0e0', padding: '15px', borderRadius: '6px', backgroundColor: '#f9f9f9' }}>
                                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                                    <label htmlFor="orderListFilter" style={{ marginRight: '10px', fontWeight: 'bold', fontSize: '1.05em' }}>แสดงรายการสั่งซื้อ:</label>
                                    <select id="orderListFilter" value={listFilter} onChange={(e) => { setListFilter(e.target.value); setSelectedOrder(null); setSelectedOrderItems([]); setVerificationStatusInput(''); setOrderError(''); }} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1em', flexGrow: 1, backgroundColor: 'white' }}>
                                        {LIST_FILTER_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                                    </select>
                                </div>
                                {listFilter === 'pending' && renderOrderList("คำสั่งซื้อที่ต้องตรวจสอบ", pendingOrders, "ที่ต้องตรวจสอบ")}
                                {listFilter === 'approved' && renderOrderList("คำสั่งซื้อที่อนุมัติแล้ว", approvedOrders, "ที่อนุมัติแล้ว")}
                                {listFilter === 'rejected' && renderOrderList("คำสั่งซื้อที่ไม่อนุมัติ", rejectedOrders, "ที่ไม่อนุมัติแล้ว")}
                            </div>
                            <div style={{ flex: 1.5, minWidth: '450px', maxHeight: 'calc(100vh - 320px)', overflowY: 'auto', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '6px', backgroundColor: 'white' }}>
                                <h2 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#333' }}>รายละเอียดคำสั่งซื้อที่เลือก</h2>
                                {selectedOrder ? (
                                    <div>
                                        <p><strong>ID:</strong> {selectedOrder.id}</p>
                                        <p><strong>UserID:</strong> {selectedOrder.user_id || 'N/A'}</p>
                                        <p><strong>วันที่สั่งซื้อ:</strong> {new Date(selectedOrder.created_at).toLocaleString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                                        <hr style={{ margin: '15px 0', borderColor: '#f0f0f0' }} />
                                        <h4 style={{ color: '#333' }}>ข้อมูลติดต่อและที่อยู่:</h4>
                                        <p><strong>ชื่อผู้รับ:</strong> {selectedOrder.contact_info?.name || 'N/A'}</p>
                                        <p><strong>เบอร์โทร:</strong> {selectedOrder.contact_info?.phone || 'N/A'}</p>
                                        <p><strong>อีเมล:</strong> {selectedOrder.contact_info?.email || 'N/A'}</p>
                                        <p><strong>ที่อยู่จัดส่ง:</strong> <span style={{ whiteSpace: 'pre-wrap' }}>{selectedOrder.shipping_address || 'N/A'}</span></p>
                                        <hr style={{ margin: '15px 0', borderColor: '#f0f0f0' }} />
                                        <p><strong>ยอดรวม:</strong> {selectedOrder.total_amount?.toFixed(2) || 'N/A'} บาท</p>
                                        <p><strong>สถานะหลัก:</strong> <span style={{ fontWeight: 'bold', padding: '3px 6px', borderRadius: '4px', backgroundColor: selectedOrder.status === 'payment_uploaded' ? '#fff3cd' : '#e2e3e5', color: selectedOrder.status === 'payment_uploaded' ? '#856404' : '#383d41' }}>{selectedOrder.status || 'N/A'}</span></p>
                                        {selectedOrder.slip_url ? (<p><strong>สลิป:</strong> <a href={selectedOrder.slip_url} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'underline' }}>เปิดดูสลิป 🔗</a></p>) : <p><strong>ไม่มีสลิป</strong></p>}
                                        <p><strong>ผลตรวจสอบ:</strong> <span style={{ fontWeight: 'bold' }}>{selectedOrder.verification_status || 'ยังไม่ได้ตรวจสอบ'}</span></p>
                                        <h4 style={{ marginTop: '20px', marginBottom: '10px', color: '#333' }}>รายการสินค้า:</h4>
                                        {selectedOrderItems.length > 0 ? (<ul style={{ listStyle: 'none', paddingLeft: '0' }}> {selectedOrderItems.map((item, index) => (<li key={index} style={{ border: '1px solid #e0e0e0', padding: '12px', marginBottom: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}> <p style={{ margin: '0 0 8px 0', fontSize: '1.05em', fontWeight: '500' }}>{item.productName} - {item.optionName}</p> <div style={{ fontSize: '0.9em', color: '#333' }}> {item.selectedOptionDetails?.itemSelections && Object.entries(item.selectedOptionDetails.itemSelections).length > 0 && (<div style={{ marginBottom: '5px', paddingLeft: '10px' }}> {Object.entries(item.selectedOptionDetails.itemSelections).map(([itemType, selections]) => (selections.length > 0 && (<div key={itemType}> <strong style={{ color: '#555' }}>{itemType.charAt(0).toUpperCase() + itemType.slice(1)}:</strong>{' '} {selections.map(sel => sel.name).join(', ')} </div>)))} </div>)} {item.selectedOptionDetails?.selectedCasts && item.selectedOptionDetails.selectedCasts.length > 0 && (<div style={{ marginBottom: '5px', paddingLeft: '10px' }}> <strong style={{ color: '#555' }}>Cast ที่เลือก:</strong>{' '} {item.selectedOptionDetails.selectedCasts.map(cast => cast.name).join(', ')} </div>)} {item.selectedOptionDetails?.extraFeatures && Object.entries(item.selectedOptionDetails.extraFeatures).length > 0 && (<div style={{ marginBottom: '5px', paddingLeft: '10px' }}> {Object.entries(item.selectedOptionDetails.extraFeatures).map(([featureId, featureDetails]) => (featureDetails.selected && (<div key={featureId}> + {featureDetails.name} <span style={{ fontWeight: '500' }}>(+{featureDetails.price?.toFixed(2)} ฿)</span> </div>)))} </div>)} <p style={{ margin: '8px 0 0 0', paddingTop: '5px', borderTop: '1px dashed #ccc' }}> จำนวน: {item.quantity} x {(item.price)?.toFixed(2)} = {(item.quantity * (item.price || 0))?.toFixed(2)} บาท </p> </div> </li>))} </ul>) : <p style={{ color: '#777' }}>{orderError && typeof orderError === 'string' && orderError.toLowerCase().includes("รายการสินค้า") ? "" : "ไม่พบรายละเอียดรายการสินค้า..."}</p>}
                                        {selectedOrder && (<div style={{ backgroundColor: '#e9f5ff', padding: '20px', borderRadius: '6px' }}> <h4 style={{ marginTop: '0', marginBottom: '10px', color: '#0056b3' }}>บันทึก/อัปเดตผลการตรวจสอบ:</h4> <div style={{ marginBottom: '15px' }}> <label htmlFor="verification_status_dropdown" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ผลการตรวจสอบ:</label> <select id="verification_status_dropdown" value={verificationStatusInput} onChange={(e) => setVerificationStatusInput(e.target.value)} style={{ padding: '10px', width: '100%', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1em', backgroundColor: 'white' }}> {VERIFICATION_OPTIONS.map(option => (<option key={option.value} value={option.value}> {option.label} </option>))} </select> </div> <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}> <button onClick={handleSubmitVerificationStatus} disabled={isOrderSubmitting || !selectedOrder || (verificationStatusInput === selectedOrder.verification_status)} style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em', opacity: (isOrderSubmitting || !selectedOrder || (verificationStatusInput === (selectedOrder.verification_status || ''))) ? 0.6 : 1 }}> {isOrderSubmitting ? 'กำลังบันทึก...' : 'บันทึกผลการตรวจสอบ'} </button> </div> {isOrderSubmitting && <p style={{ marginTop: '10px', color: '#007bff' }}>กำลังบันทึกผล...</p>} </div>)}
                                    </div>
                                ) : (<p style={{ color: '#555', textAlign: 'center', marginTop: '30px' }}>เลือกคำสั่งซื้อจากรายการด้านซ้ายเพื่อดูรายละเอียดและดำเนินการ</p>)}
                            </div>
                        </div>
                        <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #007bff', borderRadius: '8px', backgroundColor: '#f0f8ff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}> <h2 style={{ color: '#0056b3', margin: 0, fontSize: '1.4em' }}>สรุปรายการสั่งซื้อตาม Cast Member</h2> <div> <label htmlFor="summarySourceFilter" style={{ marginRight: '10px', fontWeight: 'bold' }}>ข้อมูลจาก:</label> <select id="summarySourceFilter" value={summarySource} onChange={(e) => setSummarySource(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #007bff', fontSize: '0.9em', backgroundColor: 'white' }}> <option value="approved">คำสั่งซื้อที่อนุมัติแล้ว</option> <option value="pending">คำสั่งซื้อที่ต้องตรวจสอบ</option> <option value="approvedAndPending">อนุมัติแล้ว & อยู่ระหว่างตรวจสอบ</option> <option value="all">คำสั่งซื้อทั้งหมด</option> </select> </div> </div> {Object.keys(castOrderSummary).length === 0 && <p style={{ color: '#555', textAlign: 'center' }}>ไม่มีข้อมูลสรุปสำหรับ Cast หรือยังไม่ได้เลือกแหล่งข้อมูล</p>}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}> {castsForOrderSummary.length > 0 ? (castsForOrderSummary.map(cast => { const summaryData = castOrderSummary[cast.id]; if (!summaryData || summaryData.items.length === 0) { return (<div key={cast.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '4px', backgroundColor: '#fff', opacity: 0.7 }}> <h3 style={{ marginTop: 0, color: '#007bff', fontSize: '1.1em' }}>{cast.name}</h3> <p style={{ color: '#777', fontSize: '0.9em' }}>ไม่มีรายการคำสั่งซื้อสำหรับน้องแมวนี้</p> </div>); } return (<div key={cast.id} style={{ border: '1px solid #add8e6', padding: '15px', borderRadius: '4px', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}> <h3 style={{ marginTop: 0, color: '#007bff', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px', fontSize: '1.1em' }}> {summaryData.name} ({summaryData.items.reduce((acc, item) => acc + item.quantity, 0)} ชิ้น) </h3> <details style={{ marginBottom: '15px', backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px', border: '1px solid #e0e0e0' }}> <summary style={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95em' }}>สรุปจำนวนตามสินค้า</summary> <ul style={{ listStyleType: 'disc', paddingLeft: '20px', fontSize: '0.8em', marginTop: '5px' }}> {Object.entries(summaryData.totalQuantityByProduct).map(([key, qty]) => (<li key={key}>{key}: <strong>{qty} ชิ้น</strong></li>))} </ul> </details> <ul style={{ listStyle: 'none', padding: 0, maxHeight: '300px', overflowY: 'auto' }}> {summaryData.items.map((item, idx) => (
                                                    <li key={idx} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '8px', marginBottom: '8px', fontSize: '0.85em' }}>
                                                        <>
                                                            <p style={{ margin: '0 0 3px 0', fontWeight: '500' }}>{item.productName} - {item.optionName} (x{item.quantity})</p>
                                                            <p style={{ margin: '0 0 3px 0', fontSize: '0.8em', color: '#555' }}>ลูกค้า: {item.customerName} (Order: {item.orderId}, Date: {item.orderDate})</p>
                                                            {item.selectedOptionDetails?.itemSelections && Object.entries(item.selectedOptionDetails.itemSelections).length > 0 && (
                                                                <div style={{ fontSize: '0.75em', color: '#444', paddingLeft: '10px' }}>
                                                                    {Object.entries(item.selectedOptionDetails.itemSelections).map(([itemType, selections]) => selections.length > 0 && (
                                                                        <div key={itemType}>
                                                                            <em>{itemType.charAt(0).toUpperCase() + itemType.slice(1)}:</em> {selections.map(s => s.name).join(', ')}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {item.selectedOptionDetails?.extraFeatures && Object.entries(item.selectedOptionDetails.extraFeatures).length > 0 && (
                                                                <div style={{ fontSize: '0.75em', color: '#444', paddingLeft: '10px' }}>
                                                                    {Object.entries(item.selectedOptionDetails.extraFeatures).map(([id, details]) => details.selected && (
                                                                        <div key={id}>
                                                                            <em>พิเศษ:</em> {details.name} (+{details.price?.toFixed(2)} ฿)
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            <p style={{ margin: '8px 0 0 0', paddingTop: '5px', borderTop: '1px dashed #ccc' }}>
                                                                จำนวน: {item.quantity} x {(item.price)?.toFixed(2)} = {(item.quantity * (item.price || 0))?.toFixed(2)} บาท
                                                            </p>
                                                        </>
                                                    </li>
                                                ))} </ul> </div>); })) : (<p style={{ color: '#555', textAlign: 'center', gridColumn: '1 / -1' }}>กำลังโหลดข้อมูลน้องแมวเพื่อสรุป...</p>)} </div>
                        </div>
                    </>
                )}

                {activeAdminSection === 'events' && (
                    <div className="event-management-section" style={{ marginTop: '20px' }}>
                        {eventActionMessage && <p style={{ color: 'green', border: '1px solid #4CAF50', padding: '12px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#e8f5e9' }}>✅ {eventActionMessage}</p>}
                        {eventError && <p style={{ color: 'red', border: '1px solid #f44336', padding: '12px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#ffebee' }}>❌ {eventError}</p>}

                        <form onSubmit={handleEventSubmit} id="event-form-section" style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: selectedEventForEditing ? '#fff9e6' : '#e6f7ff' }}>
                            <h3 style={{ marginTop: 0, borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '20px', fontSize: '1.3em', color: '#333' }}>
                                {selectedEventForEditing ? `แก้ไขอีเว้นท์: ${selectedEventForEditing.title}` : 'สร้างอีเว้นท์ใหม่'}
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                                <div>
                                    <label htmlFor="eventTitle" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ชื่ออีเว้นท์ (*):</label>
                                    <input type="text" id="eventTitle" name="title" value={eventForm.title} onChange={handleEventFormChange} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} />
                                </div>
                                <div>
                                    <label htmlFor="eventDate" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>วันที่และเวลาอีเว้นท์ (*):</label>
                                    <input type="datetime-local" id="eventDate" name="event_date" value={eventForm.event_date} onChange={handleEventFormChange} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} />
                                </div>
                                <div>
                                    <label htmlFor="eventShortDescription" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>คำอธิบายสั้นๆ (สำหรับ Card):</label>
                                    <textarea id="eventShortDescription" name="short_description" value={eventForm.short_description} onChange={handleEventFormChange} rows="3" style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}></textarea>
                                </div>
                                <div>
                                    <label htmlFor="eventDescription" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รายละเอียดเต็ม:</label>
                                    <textarea id="eventDescription" name="description" value={eventForm.description} onChange={handleEventFormChange} rows="6" style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}></textarea>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <label htmlFor="eventImage" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รูปภาพอีเว้นท์ (ถ้าไม่เปลี่ยน ไม่ต้องเลือกใหม่):</label>
                                    <input type="file" id="eventImage" name="image_file" onChange={handleEventImageChange} accept="image/*" style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: 'white' }} />
                                    {(eventImagePreview || eventForm.current_image_url) && (
                                        <div style={{ marginTop: '12px', border: '1px dashed #ccc', padding: '10px', borderRadius: '4px', display: 'inline-block' }}>
                                            <p style={{ marginTop: 0, marginBottom: '8px', fontSize: '0.9em', color: '#555' }}>รูปภาพปัจจุบัน/ตัวอย่าง:</p>
                                            <img src={eventImagePreview || eventForm.current_image_url} alt="Preview" style={{ maxWidth: '250px', maxHeight: '250px', objectFit: 'contain', borderRadius: '4px' }} />
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginTop: '10px' }}>
                                    <button type="submit" disabled={isEventSubmitting} style={{ backgroundColor: isEventSubmitting ? '#ccc' : '#28a745', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: isEventSubmitting ? 'not-allowed' : 'pointer', fontSize: '1em' }}>
                                        {isEventSubmitting ? 'กำลังบันทึก...' : (selectedEventForEditing ? 'อัปเดตอีเว้นท์' : 'สร้างอีเว้นท์')}
                                    </button>
                                    {selectedEventForEditing && (
                                        <button type="button" onClick={resetEventForm} disabled={isEventSubmitting} style={{ backgroundColor: '#6c757d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em' }}>
                                            ยกเลิก (เริ่มสร้างใหม่)
                                        </button>
                                    )}
                                    {isEventSubmitting && <p style={{ color: '#007bff', marginLeft: '10px' }}>กำลังดำเนินการ...</p>}
                                </div>
                            </div>
                        </form>

                        <h3 style={{ borderTop: '1px solid #ccc', paddingTop: '20px', marginTop: '30px', fontSize: '1.3em', color: '#333' }}>รายการอีเว้นท์ทั้งหมด ({adminEvents.length})</h3>
                        <div style={{ maxHeight: '600px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px', marginTop: '10px' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '0.9em' }}>
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>
                                    <tr>
                                        <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', borderRight: '1px solid #dee2e6' }}>รูป</th>
                                        <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', borderRight: '1px solid #dee2e6' }}>ชื่ออีเว้นท์</th>
                                        <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', borderRight: '1px solid #dee2e6' }}>วันที่อีเว้นท์</th>
                                        <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', borderRight: '1px solid #dee2e6' }}>อัปเดตล่าสุด</th>
                                        <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', minWidth: '150px' }}>จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminEvents.length > 0 ? adminEvents.map(event => (
                                        <tr key={event.id} style={{ borderBottom: '1px solid #eee', backgroundColor: selectedEventForEditing?.id === event.id ? '#fff9e6' : 'white', transition: 'background-color 0.2s' }} className="admin-table-row">
                                            <td style={{ padding: '10px', borderRight: '1px solid #eee', textAlign: 'center', verticalAlign: 'middle' }}>
                                                {event.image_url && <img src={event.image_url} alt={event.title.substring(0, 10)} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '4px', display: 'inline-block' }} />}
                                            </td>
                                            <td style={{ padding: '10px', borderRight: '1px solid #eee', fontWeight: '500', verticalAlign: 'middle' }}>{event.title}</td>
                                            <td style={{ padding: '10px', borderRight: '1px solid #eee', verticalAlign: 'middle' }}>{new Date(event.event_date).toLocaleDateString('th-TH', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} น.</td>
                                            <td style={{ padding: '10px', borderRight: '1px solid #eee', fontSize: '0.85em', color: '#555', verticalAlign: 'middle' }}>{new Date(event.updated_at).toLocaleString('th-TH')}</td>
                                            <td style={{ padding: '10px', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                                                <button onClick={() => handleEditEvent(event)} style={{ marginRight: '8px', marginBottom: '5px', padding: '6px 12px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>แก้ไข</button>
                                                <button onClick={() => handleDeleteEvent(event.id, event.image_url)} style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>ลบ</button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#777' }}>ไม่พบข้อมูลอีเว้นท์</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeAdminSection === 'casts' && (
                    <div className="cast-management-section" style={{ marginTop: '20px' }}>
                        {castActionMessage && <p style={{ color: 'green', border: '1px solid #4CAF50', padding: '12px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#e8f5e9' }}>✅ {castActionMessage}</p>}
                        {castError && <p style={{ color: 'red', border: '1px solid #f44336', padding: '12px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#ffebee' }}>❌ {castError}</p>}

                        <form onSubmit={handleCastSubmit} id="cast-member-form-section" style={{ marginBottom: '30px', padding: '25px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: selectedCastForEditingForm ? '#fff9e6' : '#e6f7ff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ marginTop: 0, borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '20px', fontSize: '1.5em', color: '#0056b3', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FaEdit /> {selectedCastForEditingForm ? `แก้ไขข้อมูล: ${selectedCastForEditingForm.name}` : 'เพิ่มน้องแมวใหม่'}
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px 20px' }}>
                                <div><label htmlFor="castName" style={formLabelStyle}>ชื่อ (*):</label><input type="text" id="castName" name="name" value={castMemberForm.name} onChange={handleCastMemberFormChange} required style={formInputStyle} /></div>
                                <div><label htmlFor="castRank" style={formLabelStyle}>Rank (*):</label>
                                    <select id="castRank" name="rank" value={castMemberForm.rank} onChange={handleCastMemberFormChange} required style={formInputStyle}>
                                        <option value="">-- เลือก Rank --</option>
                                        {ALL_CASTRANKS_OPTIONS.map(rank => <option key={rank} value={rank}>{rank}</option>)}
                                    </select>
                                </div>
                                <div><label htmlFor="castType" style={formLabelStyle}>สายพันธุ์ (Type):</label><input type="text" id="castType" name="type" value={castMemberForm.type} onChange={handleCastMemberFormChange} style={formInputStyle} /></div>
                                <div><label htmlFor="birthPlace" style={formLabelStyle}>สถานที่เกิด:</label><input type="text" id="birthPlace" name="birth_place" value={castMemberForm.birth_place} onChange={handleCastMemberFormChange} style={formInputStyle} /></div>
                                <div><label htmlFor="strength" style={formLabelStyle}>ความสามารถ/จุดเด่น:</label><input type="text" id="strength" name="strength" value={castMemberForm.strength} onChange={handleCastMemberFormChange} style={formInputStyle} /></div>
                                <div><label htmlFor="favoriteFood" style={formLabelStyle}>อาหารโปรด:</label><input type="text" id="favoriteFood" name="favorite_food" value={castMemberForm.favorite_food} onChange={handleCastMemberFormChange} style={formInputStyle} /></div>
                                <div><label htmlFor="loveThing" style={formLabelStyle}>สิ่งที่รัก:</label><input type="text" id="loveThing" name="love_thing" value={castMemberForm.love_thing} onChange={handleCastMemberFormChange} style={formInputStyle} /></div>
                                <div><label htmlFor="hobby" style={formLabelStyle}>งานอดิเรก:</label><input type="text" id="hobby" name="hobby" value={castMemberForm.hobby} onChange={handleCastMemberFormChange} style={formInputStyle} /></div>
                                <div><label htmlFor="favoriteColor" style={formLabelStyle}>สีโปรด:</label><input type="text" id="favoriteColor" name="favorite_color" value={castMemberForm.favorite_color} onChange={handleCastMemberFormChange} style={formInputStyle} /></div>

                                <div><label htmlFor="facebookUrl" style={formLabelStyle}><FaFacebook style={{ marginRight: '5px', color: '#1877F2' }} />Facebook URL:</label>
                                    <input type="text" id="facebookUrl" name="facebook_url" placeholder="https://facebook.com/username หรือปล่อยว่าง" value={castMemberForm.facebook_url} onChange={handleCastMemberFormChange} style={formInputStyle} />
                                </div>
                                <div><label htmlFor="tiktokUrl" style={formLabelStyle}><FaTiktok style={{ marginRight: '5px' }} />TikTok URL:</label>
                                    <input type="text" id="tiktokUrl" name="tiktok_url" placeholder="https://tiktok.com/@username หรือปล่อยว่าง" value={castMemberForm.tiktok_url} onChange={handleCastMemberFormChange} style={formInputStyle} />
                                </div>
                                <div><label htmlFor="instagramUrl" style={formLabelStyle}><FaInstagram style={{ marginRight: '5px', color: '#E1306C' }} />Instagram URL:</label>
                                    <input type="text" id="instagramUrl" name="instagram_url" placeholder="https://instagram.com/username หรือปล่อยว่าง" value={castMemberForm.instagram_url} onChange={handleCastMemberFormChange} style={formInputStyle} />
                                </div>

                                <div style={{ gridColumn: '1 / -1' }}><label htmlFor="messageToHumans" style={formLabelStyle}>ข้อความถึงมนุษย์:</label><textarea id="messageToHumans" name="message_to_humans" value={castMemberForm.message_to_humans} onChange={handleCastMemberFormChange} rows="3" style={{ ...formInputStyle, minHeight: '80px' }}></textarea></div>

                                {/* MODIFIED: Multi-image upload and preview section */}
                                <div style={{ gridColumn: '1 / -1', borderTop: '1px dashed #ccc', paddingTop: '20px', marginTop: '10px' }}>
                                    <label htmlFor="castMemberImage" style={formLabelStyle}><FaImage style={{ marginRight: '8px' }} />รูปภาพโปรไฟล์ (เลือกได้หลายรูป):</label>
                                    <input
                                        type="file"
                                        id="castMemberImage"
                                        name="image_files"
                                        multiple
                                        onChange={handleCastImageChange}
                                        accept="image/*"
                                        style={{ ...formInputStyle, padding: '10px', backgroundColor: 'white', border: '1px dashed #007bff' }}
                                    />

                                    {/* Combined preview for existing and new images */}
                                    <div style={{ marginTop: '15px', display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                        {castImagePreview.map((preview, index) => (
                                            <div key={preview.url} style={{ position: 'relative', border: `1px solid ${preview.isNew ? '#007bff' : '#ccc'}`, padding: '5px', borderRadius: '4px', backgroundColor: preview.isNew ? '#e6f7ff' : 'white' }}>
                                                <img src={preview.url} alt={`Preview ${index + 1}`} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '4px' }} />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(preview.url, preview.isNew)}
                                                    title={preview.isNew ? "ยกเลิกการเพิ่มรูปนี้" : "ลบรูปนี้ (จะลบจริงเมื่อกดบันทึก)"}
                                                    style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', lineHeight: 1 }}
                                                >
                                                    <FaTimesCircle />
                                                </button>
                                                <div style={{ textAlign: 'center', fontSize: '0.7em', color: preview.isNew ? '#0056b3' : '#555', marginTop: '3px' }}>{preview.isNew ? 'รูปใหม่' : 'รูปปัจจุบัน'}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                                <button type="submit" disabled={isCastSubmitting} style={formButtonStyle(selectedCastForEditingForm ? '#ffc107' : '#28a745', isCastSubmitting)}>
                                    {selectedCastForEditingForm ? <FaEdit /> : <FaPlus />} {isCastSubmitting ? 'กำลังบันทึก...' : (selectedCastForEditingForm ? 'อัปเดตข้อมูลน้องแมว' : 'เพิ่มน้องแมวใหม่')}
                                </button>
                                {selectedCastForEditingForm && (
                                    <button type="button" onClick={resetCastMemberForm} disabled={isCastSubmitting} style={formButtonStyle('#6c757d', isCastSubmitting)}>
                                        ยกเลิกการแก้ไข
                                    </button>
                                )}
                                {isCastSubmitting && <p style={{ color: '#007bff', marginLeft: '10px' }}>กำลังดำเนินการ...</p>}
                            </div>
                        </form>

                        <h3 style={{ fontSize: '1.5em', color: '#333', marginTop: '40px', borderBottom: '1px solid #ccc', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaCat /> รายการน้องแมวทั้งหมด ({managedCasts.length})
                        </h3>
                        <div style={{ maxHeight: '800px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '8px', marginTop: '10px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '0.9em' }}>
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1, background: '#f8f9fa' }}>
                                    <tr>
                                        <th style={{ padding: '10px 12px', borderBottom: '2px solid #dee2e6', textAlign: 'center', borderRight: '1px solid #eee', width: '80px' }}>รูป</th>
                                        <th style={{ padding: '10px 12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', borderRight: '1px solid #eee' }}>ชื่อ</th>
                                        <th style={{ padding: '10px 12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', borderRight: '1px solid #eee' }}>Rank</th>
                                        <th style={{ padding: '10px 12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', borderRight: '1px solid #eee' }}>สายพันธุ์</th>
                                        <th style={{ padding: '10px 12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', borderRight: '1px solid #eee', width: '120px' }}>Socials</th>
                                        <th style={{ padding: '10px 12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', width: '190px' }}>จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {managedCasts.length > 0 ? managedCasts.map(cast => (
                                        <tr key={cast.id} style={{ backgroundColor: selectedCastForEditingForm?.id === cast.id ? '#fff9e6' : 'transparent', transition: 'background-color 0.2s' }} className="hover:bg-gray-50">
                                            <td style={{ padding: '10px', borderRight: '1px solid #eee', textAlign: 'center', verticalAlign: 'middle' }}>
                                                {cast.image_url ? <img src={cast.image_url} alt={cast.name.substring(0, 10)} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 5px rgba(0,0,0,0.1)' }} /> : <FaCat color="#ccc" size={30} />}
                                            </td>
                                            <td style={{ padding: '10px', borderRight: '1px solid #eee', fontWeight: '500', verticalAlign: 'middle' }}>{cast.name}</td>
                                            <td style={{ padding: '10px', borderRight: '1px solid #eee', verticalAlign: 'middle' }}>{cast.rank}</td>
                                            <td style={{ padding: '10px', borderRight: '1px solid #eee', verticalAlign: 'middle' }}>{cast.type || '-'}</td>
                                            <td style={{ padding: '10px', borderRight: '1px solid #eee', verticalAlign: 'middle' }}>
                                                {cast.facebook_url && <a href={cast.facebook_url} target="_blank" rel="noopener noreferrer" title="Facebook" style={{ marginRight: '8px', color: '#1877F2' }}><FaFacebook size={18} /></a>}
                                                {cast.tiktok_url && <a href={cast.tiktok_url} target="_blank" rel="noopener noreferrer" title="TikTok" style={{ marginRight: '8px', color: '#111' }}><FaTiktok size={16} /></a>}
                                                {cast.instagram_url && <a href={cast.instagram_url} target="_blank" rel="noopener noreferrer" title="Instagram" style={{ color: '#E1306C' }}><FaInstagram size={18} /></a>}
                                            </td>
                                            <td style={{ padding: '10px', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                                                <button onClick={() => handleSelectCastForEditing(cast)} style={{ marginRight: '8px', marginBottom: '5px', padding: '6px 12px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '3px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                    <FaEdit /> แก้ไข
                                                </button>
                                                <button onClick={() => handleDeleteCastMember(cast.id, cast.name, cast.image_url, cast.image_urls)} style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                    <FaTrash /> ลบ
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#777', fontSize: '1.1em' }}><FaCat style={{ marginRight: '10px', fontSize: '1.5em' }} /> ไม่พบข้อมูลน้องแมว</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeAdminSection === 'schedule' && (
                    <div className="schedule-management-section" style={{ marginTop: '20px' }}>
                        <h2 style={{ fontSize: '1.6em', color: '#0056b3', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaRegCalendarCheck /> จัดการตารางกะน้องแมว
                        </h2>

                        {scheduleEntryMessage && <p style={{ color: 'green', border: '1px solid #4CAF50', padding: '12px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#e8f5e9' }}>✅ {scheduleEntryMessage}</p>}
                        {scheduleEntryError && <p style={{ color: 'red', border: '1px solid #f44336', padding: '12px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#ffebee' }}>❌ {scheduleEntryError}</p>}

                        <div style={formSectionStyle}>
                            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.3em' }}>เพิ่มน้องแมวเข้าตารางกะ</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                                <div>
                                    <label htmlFor="scheduleDate" style={formLabelStyle}>เลือกวันที่:</label>
                                    <input
                                        type="date"
                                        id="scheduleDate"
                                        value={scheduleDate}
                                        onChange={(e) => setScheduleDate(e.target.value)}
                                        style={formInputStyle}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="selectCasts" style={formLabelStyle}>เลือกน้องแมว (เลือกได้หลายตัว):</label>
                                    <select
                                        id="selectCasts"
                                        multiple
                                        value={selectedCastsForSchedule}
                                        onChange={(e) => {
                                            const options = Array.from(e.target.selectedOptions);
                                            setSelectedCastsForSchedule(options.map(option => parseInt(option.value)));
                                        }}
                                        style={{ ...formInputStyle, height: '150px' }}
                                    >
                                        {availableCastsForSchedule.length > 0 ? (
                                            availableCastsForSchedule.map(cast => (
                                                <option key={cast.id} value={cast.id}>{cast.name} ({cast.rank})</option>
                                            ))
                                        ) : (
                                            <option disabled>ไม่มีข้อมูลน้องแมว</option>
                                        )}
                                    </select>
                                </div>
                                {/* NEW: Shift Type Selection */}
                                <div>
                                    <label htmlFor="shiftType" style={formLabelStyle}>เลือกกะ:</label>
                                    <select
                                        id="shiftType"
                                        value={selectedShiftType}
                                        onChange={(e) => setSelectedShiftType(e.target.value)}
                                        style={formInputStyle}
                                    >
                                        <option value="morning">เช้า</option>
                                        <option value="evening">เย็น</option>
                                        <option value="night">ดึก</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                                    <button
                                        onClick={handleAddScheduleEntry}
                                        disabled={isSchedulingSubmitting || selectedCastsForSchedule.length === 0 || !scheduleDate || !selectedShiftType}
                                        style={formButtonStyle(isSchedulingSubmitting ? '#ccc' : '#28a745', isSchedulingSubmitting || selectedCastsForSchedule.length === 0 || !scheduleDate || !selectedShiftType)}
                                    >
                                        <FaPlus /> {isSchedulingSubmitting ? 'กำลังเพิ่ม...' : 'เพิ่มเข้าตารางกะ'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1.3em', color: '#333', marginTop: '40px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                            ตารางกะของวันที่ {new Date(scheduleDate).toLocaleDateString('th-TH', { day: '2-digit', month: 'long', year: 'numeric' })}
                            {isSchedulingSubmitting && <span style={{ marginLeft: '10px', color: '#007bff' }}> (กำลังโหลด...)</span>}
                        </h3>
                        {/* NEW: Display schedules grouped by shift type */}
                        {['morning', 'evening', 'night'].map(shift => (
                            <div key={shift} style={{ marginBottom: '30px' }}>
                                <h4 style={{ fontSize: '1.1em', color: '#555', marginTop: '20px', marginBottom: '10px', textTransform: 'capitalize' }}>
                                    กะ{shift === 'morning' ? 'เช้า' : shift === 'evening' ? 'เย็น' : 'ดึก'} ({schedulesByDate[shift].length} คน)
                                </h4>
                                <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '8px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '0.9em' }}>
                                        <thead style={{ position: 'sticky', top: 0, zIndex: 1, background: '#f8f9fa' }}>
                                            <tr>
                                                <th style={{ padding: '10px 12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', borderRight: '1px solid #eee' }}>รูป</th>
                                                <th style={{ padding: '10px 12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', borderRight: '1px solid #eee' }}>ชื่อน้องแมว</th>
                                                <th style={{ padding: '10px 12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', borderRight: '1px solid #eee' }}>Rank</th>
                                                <th style={{ padding: '10px 12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', width: '100px' }}>จัดการ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schedulesByDate[shift].length > 0 ? (
                                                schedulesByDate[shift].map(schedule => (
                                                    <tr key={schedule.id} style={{ borderBottom: '1px solid #eee', backgroundColor: 'white', transition: 'background-color 0.2s' }}>
                                                        <td style={{ padding: '10px', borderRight: '1px solid #eee', textAlign: 'center', verticalAlign: 'middle' }}>
                                                            {schedule.casts?.image_url ? <img src={schedule.casts.image_url} alt={schedule.casts.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }} /> : <FaCat color="#ccc" size={24} />}
                                                        </td>
                                                        <td style={{ padding: '10px', borderRight: '1px solid #eee', fontWeight: '500', verticalAlign: 'middle' }}>{schedule.casts?.name || 'N/A'}</td>
                                                        <td style={{ padding: '10px', borderRight: '1px solid #eee', verticalAlign: 'middle' }}>{schedule.casts?.rank || 'N/A'}</td>
                                                        <td style={{ padding: '10px', verticalAlign: 'middle' }}>
                                                            <button
                                                                onClick={() => handleDeleteScheduleEntry(schedule.id, schedule.casts?.name || 'น้องแมว', schedule.shift_type)}
                                                                disabled={isSchedulingSubmitting}
                                                                style={formButtonStyle('#dc3545', isSchedulingSubmitting)}
                                                            >
                                                                <FaTrash /> ลบ
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#777', fontSize: '1em' }}>
                                                        ไม่มีน้องแมวเข้ากะ{shift === 'morning' ? 'เช้า' : shift === 'evening' ? 'เย็น' : 'ดึก'}ในวันนี้
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}

                        {/* Old Schedule Image Management (Optional: Keep if you still need a single image upload) */}
                        <div style={{ marginTop: '50px', padding: '20px', border: '1px dashed #ccc', borderRadius: '8px', backgroundColor: '#fdfdff' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.3em', color: '#6c757d' }}>จัดการรูปภาพตารางงานแบบเก่า (ไม่ใช้แล้วสำหรับตารางกะ)</h3>
                            <p style={{ fontSize: '0.9em', color: '#777' }}>ส่วนนี้มีไว้สำหรับรูปภาพตารางงานแบบเดี่ยว เช่น รูป JPEG หรือ PNG ที่เป็นตารางแบบคงที่ อาจไม่เกี่ยวข้องแล้วหากคุณใช้ตารางกะแบบใหม่</p>

                            {currentScheduleImageUrl ? (
                                <img src={currentScheduleImageUrl} alt="Current Schedule (Legacy)" style={{ maxWidth: '100%', maxHeight: '400px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '4px', padding: '5px' }} />
                            ) : (
                                <p style={{ color: '#777', fontStyle: 'italic' }}>ยังไม่มีรูปตารางงานแบบเก่า</p>
                            )}
                            <div style={{ marginBottom: '20px' }}>
                                <label htmlFor="scheduleImageFile" style={formLabelStyle}>
                                    <FaImage style={{ marginRight: '8px' }} />เลือกรูปตารางงานใหม่ (Legacy):
                                </label>
                                <input
                                    type="file"
                                    id="scheduleImageFile"
                                    onChange={handleScheduleImageFileChange}
                                    accept="image/png, image/jpeg, image/jpg, image/webp"
                                    style={{ ...formInputStyle, padding: '10px', backgroundColor: 'white', border: '1px dashed #007bff' }}
                                />
                            </div>
                            {scheduleImagePreview && scheduleImageFile && (
                                <div style={{ marginBottom: '20px' }}>
                                    <p style={{ ...formLabelStyle, marginBottom: '5px' }}>ตัวอย่างรูปใหม่ (Legacy):</p>
                                    <img src={scheduleImagePreview} alt="New Schedule Preview" style={{ maxWidth: '300px', maxHeight: '300px', border: '1px solid #ccc', borderRadius: '4px', padding: '5px' }} />
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
                                <button
                                    onClick={handleScheduleUpload}
                                    disabled={!scheduleImageFile || isScheduleSubmitting}
                                    style={formButtonStyle(isScheduleSubmitting ? '#ccc' : '#28a745', !scheduleImageFile || isScheduleSubmitting)}
                                >
                                    <FaPlus /> {isScheduleSubmitting ? 'กำลังอัปโหลด...' : 'อัปโหลด/เปลี่ยนรูป (Legacy)'}
                                </button>
                                <button
                                    onClick={handleScheduleDelete}
                                    disabled={!currentScheduleImageUrl || isScheduleSubmitting}
                                    style={formButtonStyle(isScheduleSubmitting ? '#ccc' : '#dc3545', !currentScheduleImageUrl || isScheduleSubmitting)}
                                >
                                    <FaTrash /> {isScheduleSubmitting ? 'กำลังลบ...' : 'ลบรูปปัจจุบัน (Legacy)'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeAdminSection === 'banner' && (
                    <div className="banner-management-section" style={{ marginTop: '20px' }}>
                        <h2 style={{ fontSize: '1.6em', color: '#0056b3', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaImages /> จัดการรูปภาพ Hero Banner
                        </h2>

                        {bannerActionMessage && <p style={{ color: 'green', border: '1px solid #4CAF50', padding: '12px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#e8f5e9' }}>✅ {bannerActionMessage}</p>}
                        {bannerError && <p style={{ color: 'red', border: '1px solid #f44336', padding: '12px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#ffebee' }}>❌ {bannerError}</p>}

                        <form onSubmit={handleBannerUpload} style={formSectionStyle}>
                            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.3em' }}>อัปโหลดรูป Banner ใหม่</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                                <div>
                                    <label htmlFor="bannerImageFile" style={formLabelStyle}><FaImage style={{ marginRight: '8px' }} />เลือกไฟล์รูปภาพ (*):</label>
                                    <input type="file" id="bannerImageFile" onChange={handleBannerImageFileChange} required accept="image/*" style={{ ...formInputStyle, padding: '10px', backgroundColor: 'white' }} />
                                </div>
                                {bannerImagePreview && (
                                    <div style={{ marginTop: '5px' }}>
                                        <p style={{ marginTop: 0, marginBottom: '8px', fontSize: '0.9em', color: '#555' }}>ตัวอย่าง:</p>
                                        <img src={bannerImagePreview} alt="Banner Preview" style={{ maxWidth: '300px', maxHeight: '150px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    </div>
                                )}
                                <div>
                                    <label htmlFor="bannerAltText" style={formLabelStyle}>ข้อความอธิบายรูป (Alt Text):</label>
                                    <input type="text" id="bannerAltText" value={bannerAltText} onChange={(e) => setBannerAltText(e.target.value)} placeholder="เช่น โปรโมชั่นเดือนมิถุนายน" style={formInputStyle} />
                                </div>
                                <div>
                                    <label htmlFor="bannerLinkUrl" style={formLabelStyle}><FaLink style={{ marginRight: '8px' }} />ลิงก์ (เมื่อคลิกที่รูป):</label>
                                    <input type="text" id="bannerLinkUrl" value={bannerLinkUrl} onChange={(e) => setBannerLinkUrl(e.target.value)} placeholder="เช่น https://example.com/promotion (ไม่บังคับ)" style={formInputStyle} />
                                </div>
                                <div>
                                    <button type="submit" disabled={isBannerSubmitting || !bannerImageFile} style={formButtonStyle('#28a745', isBannerSubmitting || !bannerImageFile)}>
                                        <FaPlus /> {isBannerSubmitting ? 'กำลังอัปโหลด...' : 'อัปโหลด Banner'}
                                    </button>
                                </div>
                            </div>
                        </form>

                        <h3 style={{ fontSize: '1.3em', color: '#333', marginTop: '40px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
                            รายการ Banner ปัจจุบัน ({bannerImages.length})
                        </h3>

                        {/* MODIFIED: Banner Display Changed from Grid to SCROLLING CAROUSEL */}
                        {bannerImages.length > 0 ? (
                            <div className="slider" style={{
                                background: 'white',
                                boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.125)',
                                height: '280px',
                                margin: 'auto',
                                overflow: 'hidden',
                                position: 'relative',
                                width: '100%',
                                marginTop: '10px',
                                border: '1px solid #eee',
                                borderRadius: '8px'
                            }}>
                                <div className="slide-track" style={{
                                    animation: `scroll ${bannerImages.length * 5}s linear infinite`,
                                    display: 'flex',
                                    width: `calc(350px * ${bannerImages.length * 2})`,

                                }} onMouseOver={(e) => e.currentTarget.style.animationPlayState = 'paused'} onMouseOut={(e) => e.currentTarget.style.animationPlayState = 'running'}>

                                    {/* Render slides twice for seamless loop */}
                                    {[...bannerImages, ...bannerImages].map((banner, index) => (
                                        <div className="slide" key={`${banner.id}-${index}`} style={{
                                            height: '250px',
                                            width: '350px',
                                            padding: '15px',
                                            boxSizing: 'border-box'
                                        }}>
                                            {/* This is the original card code, preserved as requested */}
                                            <div style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                <img src={banner.image_url} alt={banner.alt_text} style={{ width: '100%', height: '130px', objectFit: 'cover', borderBottom: '1px solid #eee' }} />
                                                <div style={{ padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                    <div>
                                                        <p style={{ margin: '0 0 5px 0', fontSize: '0.9em' }}><strong>Alt Text:</strong> {banner.alt_text || 'N/A'}</p>
                                                        <p style={{ margin: '0 0 15px 0', fontSize: '0.9em', wordBreak: 'break-all' }}>
                                                            <strong>Link:</strong> {banner.link_url ? <a href={banner.link_url} target="_blank" rel="noopener noreferrer">{banner.link_url}</a> : 'N/A'}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteBannerImage(banner.id, banner.image_url)}
                                                        disabled={isBannerSubmitting}
                                                        style={formButtonStyle('#dc3545', isBannerSubmitting)}
                                                    >
                                                        <FaTrash /> ลบ
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p style={{ color: '#777', textAlign: 'center', marginTop: '20px' }}>ยังไม่มีรูปภาพใน Banner</p>
                        )}

                    </div>
                )}

                {activeAdminSection === 'jobApplications' && (
                    <div className="job-applications-section" style={{ marginTop: '20px' }}>
                        <h2 style={{ fontSize: '1.6em', color: '#0056b3', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaBriefcase /> รายการใบสมัครงาน ({jobApplications.length})
                        </h2>

                        {jobAppsActionMessage && <p style={{ color: 'green', border: '1px solid #4CAF50', padding: '12px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#e8f5e9' }}>✅ {jobAppsActionMessage}</p>}
                        {jobAppsError && <p style={{ color: 'red', border: '1px solid #f44336', padding: '12px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#ffebee' }}>❌ {jobAppsError}</p>}

                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            {/* Left Column: List of Applications */}
                            <div style={{ flex: 1, minWidth: '350px', maxHeight: 'calc(100vh - 300px)', overflowY: 'auto', border: '1px solid #e0e0e0', padding: '15px', borderRadius: '6px', backgroundColor: '#f9f9f9' }}>
                                {jobApplications.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: '#777' }}>ยังไม่มีใบสมัครงาน</p>
                                ) : (
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {jobApplications.map(app => (
                                            <li key={app.id}
                                                style={{ padding: '12px', borderBottom: '1px solid #eee', cursor: 'pointer', backgroundColor: selectedApplication?.id === app.id ? '#e9f5ff' : 'transparent', borderRadius: '3px' }}
                                                onClick={() => setSelectedApplication(app)}>
                                                <div><strong>ผู้สมัคร:</strong> {app.full_name}</div>
                                                <div style={{ fontSize: '0.9em', color: '#555' }}><strong>ตำแหน่ง:</strong> {app.position_applied}</div>
                                                <div style={{ fontSize: '0.8em', color: '#777' }}>วันที่สมัคร: {new Date(app.created_at).toLocaleDateString('th-TH')}</div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Right Column: Application Details */}
                            <div style={{ flex: 1.5, minWidth: '450px', maxHeight: 'calc(100vh - 300px)', overflowY: 'auto', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '6px', backgroundColor: 'white' }}>
                                <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#333' }}>รายละเอียดผู้สมัคร</h3>
                                {selectedApplication ? (
                                    <div>
                                        <p><strong>ชื่อ-นามสกุล:</strong> {selectedApplication.full_name}</p>
                                        <p><strong>อีเมล:</strong> <a href={`mailto:${selectedApplication.email}`} style={{ color: '#007bff' }}>{selectedApplication.email}</a></p>
                                        <p><strong>เบอร์โทรศัพท์:</strong> {selectedApplication.phone_number || '-'}</p>
                                        <p><strong>อายุ:</strong> {selectedApplication.age || '-'}</p>
                                        <hr style={{ margin: '15px 0', borderColor: '#f0f0f0' }} />
                                        <p><strong>ตำแหน่งที่สมัคร:</strong> {selectedApplication.position_applied}</p>
                                        <p><strong>ประสบการณ์:</strong></p>
                                        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 'inherit', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px', border: '1px solid #eee' }}>{selectedApplication.experience || '-'}</pre>
                                        <hr style={{ margin: '15px 0', borderColor: '#f0f0f0' }} />
                                        <p><strong>Social Media:</strong></p>
                                        <ul style={{ listStyle: 'none', paddingLeft: '15px' }}>
                                            <li><FaFacebook style={{ marginRight: '8px', color: '#1877F2', verticalAlign: 'middle' }} /> {selectedApplication.facebook_url ? <a href={selectedApplication.facebook_url} target="_blank" rel="noopener noreferrer">{selectedApplication.facebook_url}</a> : '-'}</li>
                                            <li><FaInstagram style={{ marginRight: '8px', color: '#E1306C', verticalAlign: 'middle' }} /> {selectedApplication.instagram_url ? <a href={selectedApplication.instagram_url} target="_blank" rel="noopener noreferrer">{selectedApplication.instagram_url}</a> : '-'}</li>
                                            <li><FaTiktok style={{ marginRight: '8px', verticalAlign: 'middle' }} /> {selectedApplication.tiktok_url ? <a href={selectedApplication.tiktok_url} target="_blank" rel="noopener noreferrer">{selectedApplication.tiktok_url}</a> : '-'}</li>
                                        </ul>
                                        <hr style={{ margin: '15px 0', borderColor: '#f0f0f0' }} />
                                        <p><strong>ไฟล์แนบ (Resume/รูป):</strong></p>
                                        {selectedApplication.resume_url ? (
                                            <a href={selectedApplication.resume_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                                                <FaDownload /> ดาวน์โหลดไฟล์
                                            </a>
                                        ) : <p>-</p>}
                                        <hr style={{ margin: '15px 0', borderColor: '#f0f0f0' }} />
                                        <p><strong>เห็นใบสมัครจาก:</strong></p>
                                        <p>{(Array.isArray(selectedApplication.heard_from_sources) ? selectedApplication.heard_from_sources.join(', ') : selectedApplication.heard_from_sources) || '-'}</p>

                                        <div style={{ marginTop: '30px', borderTop: '2px solid #dc3545', paddingTop: '15px' }}>
                                            <button
                                                onClick={() => handleDeleteApplication(selectedApplication.id, selectedApplication.resume_url)}
                                                disabled={isDeletingJobApp}
                                                style={formButtonStyle('#dc3545', isDeletingJobApp)}
                                            >
                                                <FaTrash /> {isDeletingJobApp ? 'กำลังลบ...' : 'ลบใบสมัครนี้'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p style={{ color: '#777', textAlign: 'center', marginTop: '30px' }}>
                                        เลือกใบสมัครจากรายการด้านซ้ายเพื่อดูรายละเอียด
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* NEW: Membership Section */}
                {activeAdminSection === 'membership' && (
                    <div className="membership-management-section" style={{ marginTop: '20px' }}>
                        <h2 style={{ fontSize: '1.6em', color: '#0056b3', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaCoins /> เพิ่มคะแนนสะสมให้สมาชิก
                        </h2>

                        {membershipMessage && <p style={{ color: 'green', border: '1px solid #4CAF50', padding: '12px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#e8f5e9' }}>✅ {membershipMessage}</p>}
                        {membershipError && <p style={{ color: 'red', border: '1px solid #f44336', padding: '12px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#ffebee' }}>❌ {membershipError}</p>}

                        {/* --- State 1: Ready to Scan --- */}
                        {!scannedUserId && (
                            <div style={{ textAlign: 'center', padding: '40px 20px', border: '2px dashed #ccc', borderRadius: '8px' }}>
                                <button onClick={() => setShowScanner(true)} disabled={showScanner} style={formButtonStyle('#007bff')}>
                                    <FaQrcode /> {showScanner ? 'กำลังเปิดกล้อง...' : 'เปิดกล้องเพื่อสแกน QR Code'}
                                </button>
                                <div id="qr-scanner-container" style={{ width: '100%', maxWidth: '500px', margin: showScanner ? '20px auto 0' : '0 auto' }}></div>
                            </div>
                        )}

                        {/* --- State 2: Scanned, Ready to Add Points --- */}
                        {scannedUserId && (
                            <div style={formSectionStyle}>
                                <h3 style={{ marginTop: 0 }}>ยืนยันการเพิ่มคะแนน</h3>
                                <p>
                                    <strong>User ID ที่สแกนได้:</strong>
                                    <span style={{ fontFamily: 'monospace', marginLeft: '10px', backgroundColor: '#e9ecef', padding: '2px 6px', borderRadius: '4px' }}>{scannedUserId}</span>
                                </p>
                                <div style={{ margin: '20px 0' }}>
                                    <label htmlFor="points-to-add" style={formLabelStyle}>จำนวนคะแนนที่จะเพิ่ม:</label>
                                    <input
                                        id="points-to-add"
                                        type="number"
                                        value={pointsToAdd}
                                        onChange={(e) => setPointsToAdd(Number(e.target.value))}
                                        style={formInputStyle}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <button onClick={handleAddPoints} disabled={isAddingPoints} style={formButtonStyle('#28a745', isAddingPoints)}>
                                        {isAddingPoints ? 'กำลังเพิ่มคะแนน...' : 'ยืนยันการเพิ่มคะแนน'}
                                    </button>
                                    <button onClick={resetMembershipState} style={formButtonStyle('#6c757d', isAddingPoints)}>
                                        สแกนใหม่
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* NEW: Product Management Section */}
                {activeAdminSection === 'products' && (
                    <div className="product-management-section" style={{ marginTop: '20px' }}>
                        <h2 style={{ fontSize: '1.6em', color: '#0056b3', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaBoxes /> จัดการข้อมูลสินค้า
                        </h2>

                        {productActionMessage && <p style={{ color: 'green', border: '1px solid #4CAF50', padding: '12px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#e8f5e9' }}>✅ {productActionMessage}</p>}
                        {productError && <p style={{ color: 'red', border: '1px solid #f44336', padding: '12px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#ffebee' }}>❌ {productError}</p>}

                        <form onSubmit={handleProductSubmit} id="product-form-section" style={{ marginBottom: '30px', padding: '25px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: selectedProductForEditing ? '#fff9e6' : '#e6f7ff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ marginTop: 0, borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '20px', fontSize: '1.5em', color: '#0056b3', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FaEdit /> {selectedProductForEditing ? `แก้ไขสินค้า: ${selectedProductForEditing.name}` : 'เพิ่มสินค้าใหม่'}
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px 20px' }}>
                                <div>
                                    <label htmlFor="productId" style={formLabelStyle}>ID สินค้า (ถ้าแก้ไขจะอ่านเอง):</label>
                                    <input type="text" id="productId" name="id" value={productForm.id} onChange={handleProductFormChange} style={formInputStyle} disabled={!!selectedProductForEditing?.id} />
                                </div>
                                <div>
                                    <label htmlFor="productName" style={formLabelStyle}>ชื่อสินค้า (*):</label>
                                    <input type="text" id="productName" name="name" value={productForm.name} onChange={handleProductFormChange} required style={formInputStyle} />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label htmlFor="productDescription" style={formLabelStyle}>คำอธิบายสินค้า:</label>
                                    <textarea id="productDescription" name="description" value={productForm.description} onChange={handleProductFormChange} rows="4" style={{ ...formInputStyle, minHeight: '80px' }}></textarea>
                                </div>

                                {/* Main Image Upload */}
                                <div style={{ gridColumn: '1 / -1', borderTop: '1px dashed #ccc', paddingTop: '20px', marginTop: '10px' }}>
                                    <label htmlFor="productMainImage" style={formLabelStyle}><FaImage style={{ marginRight: '8px' }} />รูปภาพหลักสินค้า:</label>
                                    <input type="file" id="productMainImage" name="main_image_file" onChange={handleProductMainImageChange} accept="image/*" style={{ ...formInputStyle, padding: '10px', backgroundColor: 'white', border: '1px dashed #007bff' }} />
                                    {(productMainImagePreview || productForm.current_main_image_url) && (
                                        <div style={{ marginTop: '12px', border: '1px dashed #ccc', padding: '10px', borderRadius: '4px', display: 'inline-block' }}>
                                            <p style={{ marginTop: 0, marginBottom: '8px', fontSize: '0.9em', color: '#555' }}>รูปภาพหลักปัจจุบัน/ตัวอย่าง:</p>
                                            <img src={productMainImagePreview || productForm.current_main_image_url} alt="Main Preview" style={{ maxWidth: '250px', maxHeight: '250px', objectFit: 'contain', borderRadius: '4px' }} />
                                        </div>
                                    )}
                                </div>

                                {/* Other Images Upload */}
                                <div style={{ gridColumn: '1 / -1', borderTop: '1px dashed #ccc', paddingTop: '20px', marginTop: '10px' }}>
                                    <label htmlFor="productOtherImages" style={formLabelStyle}><FaImages style={{ marginRight: '8px' }} />รูปภาพอื่นๆ (เลือกได้หลายรูป):</label>
                                    <input type="file" id="productOtherImages" name="other_image_files" multiple onChange={handleProductOtherImageChange} accept="image/*" style={{ ...formInputStyle, padding: '10px', backgroundColor: 'white', border: '1px dashed #007bff' }} />
                                    <div style={{ marginTop: '15px', display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                        {productOtherImagePreviews.map((preview, index) => (
                                            <div key={preview.url} style={{ position: 'relative', border: `1px solid ${preview.isNew ? '#007bff' : '#ccc'}`, padding: '5px', borderRadius: '4px', backgroundColor: preview.isNew ? '#e6f7ff' : 'white' }}>
                                                <img src={preview.url} alt={`Other Preview ${index + 1}`} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '4px' }} />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveProductOtherImage(preview.url, preview.isNew)}
                                                    title={preview.isNew ? "ยกเลิกการเพิ่มรูปนี้" : "ลบรูปนี้ (จะลบจริงเมื่อกดบันทึก)"}
                                                    style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', lineHeight: 1 }}
                                                >
                                                    <FaTimesCircle />
                                                </button>
                                                <div style={{ textAlign: 'center', fontSize: '0.7em', color: preview.isNew ? '#0056b3' : '#555', marginTop: '3px' }}>{preview.isNew ? 'รูปใหม่' : 'รูปปัจจุบัน'}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* NEW UI for Available Item Choices */}
                                <div style={{ gridColumn: '1 / -1', borderTop: '1px dashed #ccc', paddingTop: '20px', marginTop: '10px' }}>
                                    <label style={formLabelStyle}>ตัวเลือกสินค้าที่มี (Available Item Choices):</label>
                                    <p style={{ fontSize: '0.8em', color: '#777', marginBottom: '10px' }}>เลือกขนาดรูปภาพหรือประเภทสินค้าที่ลูกค้าจะสามารถเลือกได้</p>
                                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
                                        {['4x6', '8x12', 'tapestry'].map(choice => (
                                            <label key={choice} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={productForm.selected_available_item_choices[choice]}
                                                    onChange={() => handleAvailableItemChoiceChange(choice)}
                                                />
                                                <span>{choice}</span>
                                            </label>
                                        ))}
                                        {productForm.selected_available_item_choices.custom.map(customChoice => (
                                            <div key={customChoice} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e0ffe0', padding: '5px 10px', borderRadius: '4px', border: '1px solid #4CAF50' }}>
                                                <span>{customChoice}</span>
                                                <button type="button" onClick={() => handleRemoveCustomItemChoice(customChoice)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', padding: '0', fontSize: '0.9em' }}>
                                                    <FaTimesCircle />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input
                                            type="text"
                                            value={newCustomItemChoice}
                                            onChange={(e) => setNewCustomItemChoice(e.target.value)}
                                            placeholder="เพิ่มตัวเลือกอื่นๆ (เช่น 'ขนาดโปสเตอร์')"
                                            style={{ ...formInputStyle, flexGrow: 1 }}
                                        />
                                        <button type="button" onClick={handleAddCustomItemChoice} style={formButtonStyle('#007bff')}>
                                            เพิ่ม
                                        </button>
                                    </div>
                                </div>


                                {/* NEW UI for Options */}
                                <div style={{ gridColumn: '1 / -1', borderTop: '1px dashed #ccc', paddingTop: '20px', marginTop: '10px' }}>
                                    <label style={formLabelStyle}>ตัวเลือกการซื้อสินค้า (Options):</label>
                                    <p style={{ fontSize: '0.8em', color: '#777', marginBottom: '15px' }}>กำหนดชุดตัวเลือกและราคาสำหรับสินค้า</p>

                                    {productForm.options.length === 0 && (
                                        <p style={{ color: '#555', textAlign: 'center', marginBottom: '15px' }}>ยังไม่มีตัวเลือกสินค้า กด "เพิ่มตัวเลือกใหม่" เพื่อเริ่มต้น</p>
                                    )}

                                    {productForm.options.map((option, optionIndex) => (
                                        <div key={option.id || optionIndex} style={{ border: '1px solid #b3e0ff', padding: '15px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f5faff', position: 'relative' }}>
                                            <h4 style={{ marginTop: 0, marginBottom: '15px', fontSize: '1.2em', color: '#0056b3' }}>
                                                ตัวเลือก #{optionIndex + 1}
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveOption(optionIndex)}
                                                style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '1.5em' }}
                                                title="ลบตัวเลือกนี้"
                                            >
                                                <FaTimesCircle />
                                            </button>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 15px', marginBottom: '15px' }}>
                                                <div>
                                                    <label style={formLabelStyle}>ชื่อตัวเลือก:</label>
                                                    <input type="text" value={option.name} onChange={(e) => handleOptionFieldChange(optionIndex, 'name', e.target.value)} style={formInputStyle} />
                                                </div>
                                                <div>
                                                    <label style={formLabelStyle}>ราคา:</label>
                                                    <input type="number" value={option.price} onChange={(e) => handleOptionFieldChange(optionIndex, 'price', parseFloat(e.target.value) || 0)} style={formInputStyle} />
                                                </div>
                                                <div style={{ gridColumn: '1 / -1' }}>
                                                    <label style={formLabelStyle}>ประเภท:</label>
                                                    <select value={option.type} onChange={(e) => handleOptionFieldChange(optionIndex, 'type', e.target.value)} style={formInputStyle}>
                                                        <option value="single-item">Single Item</option>
                                                        <option value="bundle">Bundle</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {option.type === 'bundle' && (
                                                <div style={{ border: '1px dashed #a0d9ff', padding: '15px', borderRadius: '6px', marginBottom: '15px', backgroundColor: '#e6f7ff' }}>
                                                    <h5 style={{ marginTop: 0, marginBottom: '10px', fontSize: '1.1em', color: '#0056b3' }}>รายการใน Bundle:</h5>
                                                    {option.bundleIncludes.length === 0 && (
                                                        <p style={{ fontSize: '0.8em', color: '#555', marginBottom: '10px' }}>ยังไม่มีรายการใน Bundle</p>
                                                    )}
                                                    {option.bundleIncludes.map((bundleItem, bundleItemIndex) => (
                                                        <div key={bundleItem.id || bundleItemIndex} style={{ border: '1px solid #cceeff', padding: '10px', borderRadius: '4px', marginBottom: '10px', position: 'relative' }}>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveBundleItem(optionIndex, bundleItemIndex)}
                                                                style={{ position: 'absolute', top: '5px', right: '5px', background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '1.2em' }}
                                                            >
                                                                <FaTimesCircle />
                                                            </button>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 10px' }}>
                                                                <div>
                                                                    <label style={{ fontSize: '0.9em', fontWeight: 'bold' }}>ประเภทรายการ:</label>
                                                                    <select value={bundleItem.itemType} onChange={(e) => handleBundleItemFieldChange(optionIndex, bundleItemIndex, 'itemType', e.target.value)} style={formInputStyle}>
                                                                        <option value="">-- เลือกประเภท --</option>
                                                                        {Object.keys(productForm.selected_available_item_choices).filter(k => productForm.selected_available_item_choices[k] || productForm.selected_available_item_choices.custom.includes(k)).map(choice => (
                                                                            <option key={choice} value={choice}>{choice}</option>
                                                                        ))}
                                                                        {productForm.selected_available_item_choices.custom.map(choice => (
                                                                            <option key={choice} value={choice}>{choice} (Custom)</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div>
                                                                    <label style={{ fontSize: '0.9em', fontWeight: 'bold' }}>รูปแบบการเลือก:</label>
                                                                    <select value={bundleItem.selectionType} onChange={(e) => handleBundleItemFieldChange(optionIndex, bundleItemIndex, 'selectionType', e.target.value)} style={formInputStyle}>
                                                                        <option value="select-single">เลือก 1</option>
                                                                        <option value="select-multiple">เลือกได้หลาย</option>
                                                                    </select>
                                                                </div>
                                                                <div>
                                                                    <label style={{ fontSize: '0.9em', fontWeight: 'bold' }}>จำนวนที่เลือก:</label>
                                                                    <input type="number" value={bundleItem.count} onChange={(e) => handleBundleItemFieldChange(optionIndex, bundleItemIndex, 'count', parseInt(e.target.value) || 1)} min="1" style={formInputStyle} />
                                                                </div>
                                                                <div style={{ gridColumn: '1 / -1' }}>
                                                                    <label style={{ fontSize: '0.9em', fontWeight: 'bold' }}>คำอธิบาย:</label>
                                                                    <input type="text" value={bundleItem.description} onChange={(e) => handleBundleItemFieldChange(optionIndex, bundleItemIndex, 'description', e.target.value)} style={formInputStyle} placeholder="เช่น 'เลือกรูป 4x6 จำนวน 3 แบบ'" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <button type="button" onClick={() => handleAddBundleItem(optionIndex)} style={formButtonStyle('#007bff', false)}>
                                                        <FaPlus /> เพิ่มรายการใน Bundle
                                                    </button>
                                                </div>
                                            )}

                                            {option.type === 'single-item' && (
                                                <div style={{ border: '1px dashed #a0d9ff', padding: '15px', borderRadius: '6px', marginBottom: '15px', backgroundColor: '#e6f7ff' }}>
                                                    <h5 style={{ marginTop: 0, marginBottom: '10px', fontSize: '1.1em', color: '#0056b3' }}>รายละเอียด Single Item:</h5>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 10px' }}>
                                                        <div>
                                                            <label style={{ fontSize: '0.9em', fontWeight: 'bold' }}>ประเภทรายการ:</label>
                                                            <select value={option.itemType} onChange={(e) => handleOptionFieldChange(optionIndex, 'itemType', e.target.value)} style={formInputStyle}>
                                                                <option value="">-- เลือกประเภท --</option>
                                                                {Object.keys(productForm.selected_available_item_choices).filter(k => productForm.selected_available_item_choices[k] || productForm.selected_available_item_choices.custom.includes(k)).map(choice => (
                                                                    <option key={choice} value={choice}>{choice}</option>
                                                                ))}
                                                                {productForm.selected_available_item_choices.custom.map(choice => (
                                                                    <option key={choice} value={choice}>{choice} (Custom)</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label style={{ fontSize: '0.9em', fontWeight: 'bold' }}>รูปแบบการเลือก:</label>
                                                            <select value={option.selectionType} onChange={(e) => handleOptionFieldChange(optionIndex, 'selectionType', e.target.value)} style={formInputStyle} disabled>
                                                                <option value="select-single">เลือก 1</option>
                                                            </select>
                                                            <p style={{ fontSize: '0.75em', color: '#777', marginTop: '3px' }}>*สำหรับ Single Item จะเป็น 'เลือก 1' เสมอ</p>
                                                        </div>
                                                        <div>
                                                            <label style={{ fontSize: '0.9em', fontWeight: 'bold' }}>จำนวน:</label>
                                                            <input type="number" value={option.count} onChange={(e) => handleOptionFieldChange(optionIndex, 'count', parseInt(e.target.value) || 1)} min="1" style={formInputStyle} disabled />
                                                            <p style={{ fontSize: '0.75em', color: '#777', marginTop: '3px' }}>*สำหรับ Single Item จะเป็น '1' เสมอ</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div style={{ border: '1px dashed #ffc107', padding: '15px', borderRadius: '6px', marginBottom: '15px', backgroundColor: '#fffbe6' }}>
                                                <h5 style={{ marginTop: 0, marginBottom: '10px', fontSize: '1.1em', color: '#cc8400' }}>Extra Features:</h5>
                                                {option.extraFeatures.length === 0 && (
                                                    <p style={{ fontSize: '0.8em', color: '#555', marginBottom: '10px' }}>ยังไม่มี Extra Feature</p>
                                                )}
                                                {option.extraFeatures.map((feature, featureIndex) => (
                                                    <div key={feature.id || featureIndex} style={{ border: '1px solid #ffeeba', padding: '10px', borderRadius: '4px', marginBottom: '10px', position: 'relative' }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveExtraFeature(optionIndex, featureIndex)}
                                                            style={{ position: 'absolute', top: '5px', right: '5px', background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '1.2em' }}
                                                        >
                                                            <FaTimesCircle />
                                                        </button>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 10px' }}>
                                                            <div>
                                                                <label style={{ fontSize: '0.9em', fontWeight: 'bold' }}>ชื่อ Feature:</label>
                                                                <input type="text" value={feature.name} onChange={(e) => handleExtraFeatureFieldChange(optionIndex, featureIndex, 'name', e.target.value)} style={formInputStyle} />
                                                            </div>
                                                            <div>
                                                                <label style={{ fontSize: '0.9em', fontWeight: 'bold' }}>ราคาเพิ่ม:</label>
                                                                <input type="number" value={feature.price} onChange={(e) => handleExtraFeatureFieldChange(optionIndex, featureIndex, 'price', parseFloat(e.target.value) || 0)} style={formInputStyle} />
                                                            </div>
                                                            {/* Type is generally checkbox for extra features */}
                                                            <div>
                                                                <label style={{ fontSize: '0.9em', fontWeight: 'bold' }}>ประเภท:</label>
                                                                <select value={feature.type} onChange={(e) => handleExtraFeatureFieldChange(optionIndex, featureIndex, 'type', e.target.value)} style={formInputStyle} disabled>
                                                                    <option value="checkbox">Checkbox</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button type="button" onClick={() => handleAddExtraFeature(optionIndex)} style={formButtonStyle('#ffc107', false)}>
                                                    <FaPlus /> เพิ่ม Extra Feature
                                                </button>
                                            </div>

                                            <div style={{ border: '1px dashed #d1e7dd', padding: '15px', borderRadius: '6px', backgroundColor: '#e2f7ed' }}>
                                                <h5 style={{ marginTop: 0, marginBottom: '10px', fontSize: '1.1em', color: '#155724' }}>Cast Selection:</h5>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={option.castSelection.enabled}
                                                        onChange={(e) => handleCastSelectionFieldChange(optionIndex, 'enabled', e.target.checked)}
                                                    />
                                                    <span>เปิดใช้งานการเลือก Cast</span>
                                                </label>
                                                {option.castSelection.enabled && (
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 10px' }}>
                                                        <div>
                                                            <label style={{ fontSize: '0.9em', fontWeight: 'bold' }}>รูปแบบการเลือก Cast:</label>
                                                            <select value={option.castSelection.selectionType} onChange={(e) => handleCastSelectionFieldChange(optionIndex, 'selectionType', e.target.value)} style={formInputStyle}>
                                                                <option value="select-single">เลือก 1 คน</option>
                                                                <option value="select-multiple">เลือกได้หลายคน</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label style={{ fontSize: '0.9em', fontWeight: 'bold' }}>จำนวน Cast ที่เลือกได้:</label>
                                                            <input type="number" value={option.castSelection.count} onChange={(e) => handleCastSelectionFieldChange(optionIndex, 'count', parseInt(e.target.value) || 1)} min="1" style={formInputStyle} />
                                                        </div>
                                                        <div style={{ gridColumn: '1 / -1' }}>
                                                            <label style={{ fontSize: '0.9em', fontWeight: 'bold' }}>คำอธิบายการเลือก Cast:</label>
                                                            <input type="text" value={option.castSelection.description} onChange={(e) => handleCastSelectionFieldChange(optionIndex, 'description', e.target.value)} style={formInputStyle} placeholder="เช่น 'เลือก Cast 1 คน'" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <button type="button" onClick={handleAddOption} style={formButtonStyle('#007bff', false)}>
                                        <FaPlus /> เพิ่มตัวเลือกใหม่
                                    </button>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                                <button type="submit" disabled={isProductSubmitting} style={formButtonStyle(selectedProductForEditing ? '#ffc107' : '#28a745', isProductSubmitting)}>
                                    {selectedProductForEditing ? <FaEdit /> : <FaPlus />} {isProductSubmitting ? 'กำลังบันทึก...' : (selectedProductForEditing ? 'อัปเดตสินค้า' : 'เพิ่มสินค้าใหม่')}
                                </button>
                                {selectedProductForEditing && (
                                    <button type="button" onClick={resetProductForm} disabled={isProductSubmitting} style={formButtonStyle('#6c757d', isProductSubmitting)}>
                                        ยกเลิกการแก้ไข
                                    </button>
                                )}
                                {isProductSubmitting && <p style={{ color: '#007bff', marginLeft: '10px' }}>กำลังดำเนินการ...</p>}
                            </div>
                        </form>

                        <h3 style={{ fontSize: '1.5em', color: '#333', marginTop: '40px', borderBottom: '1px solid #ccc', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaBoxes /> รายการสินค้าทั้งหมด ({managedProducts.length})
                        </h3>
                        <div style={{ maxHeight: '800px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '8px', marginTop: '10px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '0.9em' }}>
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1, background: '#f8f9fa' }}>
                                    <tr>
                                        <th style={{ padding: '10px 12px', borderBottom: '2px solid #dee2e6', textAlign: 'center', borderRight: '1px solid #eee', width: '80px' }}>รูป</th>
                                        <th style={{ padding: '10px 12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', borderRight: '1px solid #eee' }}>ID</th>
                                        <th style={{ padding: '10px 12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', borderRight: '1px solid #eee' }}>ชื่อสินค้า</th>
                                        <th style={{ padding: '10px 12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', minWidth: '150px' }}>จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {managedProducts.length > 0 ? managedProducts.map(product => (
                                        <tr key={product.id} style={{ backgroundColor: selectedProductForEditing?.id === product.id ? '#fff9e6' : 'transparent', transition: 'background-color 0.2s' }} className="hover:bg-gray-50">
                                            <td style={{ padding: '10px', borderRight: '1px solid #eee', textAlign: 'center', verticalAlign: 'middle' }}>
                                                {product.main_image_url ? <img src={product.main_image_url} alt={product.name.substring(0, 10)} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', display: 'inline-block', boxShadow: '0 0 5px rgba(0,0,0,0.1)' }} /> : <FaBoxes color="#ccc" size={30} />}
                                            </td>
                                            <td style={{ padding: '10px', borderRight: '1px solid #eee', verticalAlign: 'middle', fontFamily: 'monospace' }}>{product.id}</td>
                                            <td style={{ padding: '10px', borderRight: '1px solid #eee', fontWeight: '500', verticalAlign: 'middle' }}>{product.name}</td>
                                            <td style={{ padding: '10px', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                                                <button onClick={() => handleSelectProductForEditing(product)} style={{ marginRight: '8px', marginBottom: '5px', padding: '6px 12px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '3px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                    <FaEdit /> แก้ไข
                                                </button>
                                                <button onClick={() => handleDeleteProduct(product.id, product.name, product.main_image_url, product.images_urls)} style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                    <FaTrash /> ลบ
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#777', fontSize: '1.1em' }}><FaBoxes style={{ marginRight: '10px', fontSize: '1.5em' }} /> ไม่พบข้อมูลสินค้า</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {/* NEW: Announcement Section */}
                {activeAdminSection === 'announcements' && (
                    <div className="announcement-management-section" style={{ marginTop: '20px' }}>
                        <h2 style={{ fontSize: '1.6em', color: '#0056b3', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaBullhorn /> จัดการประกาศ (สำหรับแถบข้อความวิ่ง)
                        </h2>

                        {announcementActionMessage && <p style={{ color: 'green', border: '1px solid #4CAF50', padding: '12px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#e8f5e9' }}>✅ {announcementActionMessage}</p>}
                        {announcementError && <p style={{ color: 'red', border: '1px solid #f44336', padding: '12px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#ffebee' }}>❌ {announcementError}</p>}

                        <form onSubmit={handleAnnouncementSubmit} id="announcement-form-section" style={{ ...formSectionStyle, backgroundColor: selectedAnnouncement ? '#fff9e6' : '#e6f7ff' }}>
                            <h3 style={{ marginTop: 0, borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '20px', fontSize: '1.3em', color: '#333' }}>
                                {selectedAnnouncement ? `แก้ไขประกาศ: #${selectedAnnouncement.id}` : 'สร้างประกาศใหม่'}
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                                <div>
                                    <label htmlFor="announcementMessage" style={formLabelStyle}>ข้อความประกาศ (*):</label>
                                    <textarea id="announcementMessage" name="message" value={announcementForm.message} onChange={handleAnnouncementFormChange} required rows="3" style={formInputStyle}></textarea>
                                </div>
                                <div>
                                    <label htmlFor="announcementLinkUrl" style={formLabelStyle}><FaLink style={{ marginRight: '5px' }} />URL ลิงก์ (เมื่อคลิก):</label>
                                    <input type="text" id="announcementLinkUrl" name="link_url" value={announcementForm.link_url} onChange={handleAnnouncementFormChange} placeholder="เช่น https://example.com (ไม่บังคับ)" style={formInputStyle} />
                                </div>
                                <div style={{ display: 'flex', gap: '30px' }}>
                                    <div>
                                        <label htmlFor="announcementSortOrder" style={formLabelStyle}>ลำดับการแสดง (Sort Order):</label>
                                        <input type="number" id="announcementSortOrder" name="sort_order" value={announcementForm.sort_order} onChange={handleAnnouncementFormChange} style={{ ...formInputStyle, width: '120px' }} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '25px' }}>
                                        <input type="checkbox" id="announcementIsActive" name="is_active" checked={announcementForm.is_active} onChange={handleAnnouncementFormChange} style={{ width: '20px', height: '20px', marginRight: '10px' }} />
                                        <label htmlFor="announcementIsActive" style={{ fontWeight: 'bold', cursor: 'pointer' }}>เปิดใช้งาน (Active)</label>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginTop: '10px' }}>
                                    <button type="submit" disabled={isAnnouncementSubmitting} style={formButtonStyle(selectedAnnouncement ? '#ffc107' : '#28a745', isAnnouncementSubmitting)}>
                                        <FaPlus /> {isAnnouncementSubmitting ? 'กำลังบันทึก...' : (selectedAnnouncement ? 'อัปเดตประกาศ' : 'สร้างประกาศ')}
                                    </button>
                                    {selectedAnnouncement && (
                                        <button type="button" onClick={resetAnnouncementForm} disabled={isAnnouncementSubmitting} style={formButtonStyle('#6c757d', isAnnouncementSubmitting)}>
                                            ยกเลิกการแก้ไข
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>

                        <h3 style={{ fontSize: '1.3em', color: '#333', marginTop: '40px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
                            รายการประกาศทั้งหมด ({announcements.length})
                        </h3>
                        <div style={{ maxHeight: '600px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px', marginTop: '10px' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '0.9em' }}>
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>
                                    <tr>
                                        <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', borderRight: '1px solid #dee2e6' }}>ข้อความ</th>
                                        <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', borderRight: '1px solid #dee2e6' }}>ลิงก์</th>
                                        <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6', textAlign: 'center', borderRight: '1px solid #dee2e6', width: '100px' }}>Active</th>
                                        <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6', textAlign: 'center', borderRight: '1px solid #dee2e6', width: '100px' }}>Sort</th>
                                        <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6', textAlign: 'left', minWidth: '150px' }}>จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {announcements.length > 0 ? announcements.map(ann => (
                                        <tr key={ann.id} style={{ backgroundColor: selectedAnnouncement?.id === ann.id ? '#fff9e6' : 'white' }} className="admin-table-row">
                                            <td style={{ padding: '10px', borderRight: '1px solid #eee', verticalAlign: 'middle', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={ann.message}>
                                                {ann.message}
                                            </td>
                                            <td style={{ padding: '10px', borderRight: '1px solid #eee', verticalAlign: 'middle', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {ann.link_url ? <a href={ann.link_url} target="_blank" rel="noopener noreferrer">{ann.link_url}</a> : '-'}
                                            </td>
                                            <td style={{ padding: '10px', borderRight: '1px solid #eee', textAlign: 'center', verticalAlign: 'middle' }}>
                                                <span style={{ color: ann.is_active ? 'green' : 'red', fontWeight: 'bold' }}>{ann.is_active ? '✔' : '✖'}</span>
                                            </td>
                                            <td style={{ padding: '10px', borderRight: '1px solid #eee', textAlign: 'center', verticalAlign: 'middle' }}>{ann.sort_order}</td>
                                            <td style={{ padding: '10px', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                                                <button onClick={() => handleSelectAnnouncementForEditing(ann)} style={{ marginRight: '8px', padding: '6px 12px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>แก้ไข</button>
                                                <button onClick={() => handleDeleteAnnouncement(ann.id, ann.message)} style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>ลบ</button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#777' }}>ไม่พบข้อมูลประกาศ</td></tr>
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