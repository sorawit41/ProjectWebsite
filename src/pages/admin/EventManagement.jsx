import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient'; // <<== ปรับ path ให้ถูกต้อง
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

const EVENT_IMAGES_BUCKET_NAME = 'event-images';

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

function EventManagement() {
    // Event Management States
    const [isLoading, setIsLoading] = useState(true);
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
    
    // --- Data Fetching Callback ---
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
    
    // --- Main Data Fetching Effect ---
    useEffect(() => {
        setIsLoading(true);
        fetchAdminEvents().finally(() => setIsLoading(false));
    }, [fetchAdminEvents]);

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
        } catch (err) {
            console.error("Error saving event data to database:", err); setEventError("บันทึกข้อมูลอีเว้นท์ไม่สำเร็จ: " + err.message);
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
                } catch (storageError) { console.warn("ลบรูปภาพอีเว้นท์จาก Storage ไม่สำเร็จ:", storageError.message); }
            }
            setEventActionMessage(`อีเว้นท์ ID: ${eventId} ถูกลบสำเร็จ!`); await fetchAdminEvents(); resetEventForm();
        } catch (err) {
            console.error("Error deleting event:", err); setEventError("ลบอีเว้นท์ไม่สำเร็จ: " + err.message);
        } finally { setIsEventSubmitting(false); }
    };

    if (isLoading) return <div style={{ textAlign: 'center', padding: '20px' }}>⏳ กำลังโหลดข้อมูลอีเว้นท์...</div>;

    return (
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
    );
}

export default EventManagement;