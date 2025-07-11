// Register.jsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import story1 from "../assets/register/image.png"; // ตรวจสอบว่า path ถูกต้อง
import { supabase } from './supabaseClient'; // ตรวจสอบว่า path ถูกต้อง
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { FiUploadCloud, FiFileText, FiX } from 'react-icons/fi';

// Component สำหรับ Input ทั่วไป
const FormInput = ({ id, name, label, required, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={id}
      name={name}
      required={required}
      className="mt-1 block w-full px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition"
      {...props}
    />
  </div>
);

// Component สำหรับ Social Media Input
const SocialInput = ({ icon: Icon, ...props }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="text-slate-400" />
        </div>
        <input
            className="block w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition"
            {...props}
        />
    </div>
);

// Component สำหรับพื้นที่อัปโหลดไฟล์ (พร้อม Preview และปุ่มลบ)
const FileUploadArea = ({ fileName, imagePreviewUrl, handleFileChange, onRemove, fileInputRef }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">อัปโหลด Resume หรือ รูปถ่ายหน้าตรง (ไม่บังคับ)</label>

        {imagePreviewUrl || fileName ? (
            <div className="relative mt-2 w-full h-48 border border-slate-300 rounded-xl overflow-hidden group">
                {imagePreviewUrl ? (
                    <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center text-center p-4">
                        <FiFileText className="h-12 w-12 text-slate-500" />
                        <p className="mt-2 text-sm font-semibold text-slate-800">ไฟล์ที่เลือก:</p>
                        <p className="text-xs text-slate-600 break-all">{fileName}</p>
                    </div>
                )}
                <button
                    type="button"
                    onClick={onRemove}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-white"
                    aria-label="Remove file"
                >
                    <FiX className="h-5 w-5" />
                </button>
            </div>
        ) : (
            <div className="mt-2 flex justify-center px-6 pt-8 pb-8 border-2 border-slate-300 border-dashed rounded-xl bg-white hover:border-purple-400 transition-colors duration-300">
                <div className="space-y-2 text-center">
                    <FiUploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                            <span>อัปโหลดไฟล์</span>
                            <input id="file-upload" name="resumeFile" type="file" ref={fileInputRef} className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx,image/jpeg,image/png,image/webp" />
                        </label>
                        <p className="pl-1">หรือลากมาวาง</p>
                    </div>
                    <p className="text-xs text-slate-500">PDF, DOC, DOCX, PNG, JPG, WEBP (ไม่เกิน 5MB)</p>
                </div>
            </div>
        )}
    </div>
);

// Component สำหรับแบ่ง Section ของฟอร์ม
const FormSection = ({ title, children }) => (
    <div className="border-t border-slate-200/80 pt-8 first:border-t-0 first:pt-0">
        <h3 className="text-xl font-semibold text-slate-800 mb-6">{title}</h3>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);


// --- Main Register Component ---
const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '', nickname: '', phoneNumber: '', email: '', age: '',
        educationStatus: '', positionApplied: '', otherPosition: '', experience: '',
        recaptchaToken: '', facebook_url: '', instagram_url: '', tiktok_url: '',
    });

    const [heardFrom, setHeardFrom] = useState({
        facebook: false, instagram: false, tiktok: false,
        website: false, storefront: false, other: false,
    });
    const [heardFromOtherText, setHeardFromOtherText] = useState('');

    const [resumeFile, setResumeFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ message: '', type: '' });
    
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const recaptchaRef = useRef();
    const fileInputRef = useRef(null);

    // --- ใส่ Site Key ของคุณที่นี่ ---
    const RECAPTCHA_SITE_KEY = '6Lfkb1krAAAAAMQCx_78_qBdCgIVDQIUPprTcp7n'; 

    const jobPositions = [
        { value: "Cast", label: "แคสต์ (Cast)", qualifications: ["อายุ 18-28 ปี", "บุคลิกดี มีความมั่นใจ กล้าแสดงออก", "รักในงานบริการ ชอบพูดคุย และสามารถให้ความบันเทิงได้", "ไม่มีประสบการณ์ก็สมัครได้ ทางร้านมีเทรนนิ่งให้",], benefits: ["รายได้เริ่มต้น รวม 75 - 150 บาท/ชั่วโมง  (ขึ้นอยู่กับประสบการณ์และความสามารถ)", "ค่าคอมมิชชั่น 10% - 30% ", "ทำงานขั้นต่ำ 2 วัน/สัปดาห์ (วันละ 5-6 ชั่วโมง)",], work_schedule: { title: "กะเวลาทำงาน (สามารถเลือกวันและเวลาได้)", shifts: [ "กะเย็น: 16:00 - 22:00", "กะดึก: 18:30 - 00:30 (+ค่าเดินทางพิเศษ 100 บาท)" ], note: "✨ สามารถทำงานกะดึกได้ จะได้รับการพิจารณาเป็นพิเศษ" } },
        { value: "Idol", label: "ไอดอล (Idol)", qualifications: ["อายุ 18-26 ปี", "มีความสามารถด้านการร้องเพลงหรือเต้น", "มีความฝันและมุ่งมั่นที่จะเป็นศิลปิน", "พร้อมที่จะเรียนรู้และพัฒนาตนเอง",], benefits: ["รายได้เริ่มต้น 75 บาท/ชั่วโมง + เบี้ยขยัน (สำหรับช่วงเวลาทำงานที่ร้าน)", "ค่าคอมมิชชั่น 10% - 25%", "มีโอกาสได้ออกผลงานเพลงและแสดงบนเวที", "ได้รับการฝึกฝนและพัฒนาทักษะจากมืออาชีพ",], work_schedule: { title: "กะเวลาทำงาน (สามารถเลือกวันและเวลาได้)", shifts: [ "กะเย็น: 16:00 - 22:00", "กะดึก: 18:30 - 00:30 (+ค่าเดินทางพิเศษ 100 บาท)" ], note: "✨ สามารถทำงานกะดึกได้ จะได้รับการพิจารณาเป็นพิเศษ" } },
        { value: "Cast & Idol", label: "แคสต์และไอดอล (Cast & Idol)", qualifications: ["มีคุณสมบัติตรงตามตำแหน่ง Cast และ Idol", "สามารถทำงานบริการหน้าร้านและฝึกฝนการเป็นไอดอลควบคู่กันได้", "มีความรับผิดชอบสูงและสามารถบริหารจัดการเวลาได้ดี",], benefits: ["ได้รับสวัสดิการทั้งหมดของตำแหน่ง Cast และ Idol", "รายได้มั่นคงจากงาน Cast เริ่มต้น 75 บาท/ชั่วโมง + ค่าคอมมิชชั่น 10-30%", "มีโอกาสเติบโตในสายงาน Idol พร้อมรับการสนับสนุนเต็มที่",], work_schedule: { title: "กะเวลาทำงาน (สามารถเลือกวันและเวลาได้)", shifts: [  "กะเย็น: 16:00 - 22:00", "กะดึก: 18:30 - 00:30 (+ค่าเดินทางพิเศษ 100 บาท)" ], note: "✨ สามารถทำงานกะดึกได้ จะได้รับการพิจารณาเป็นพิเศษ" } },
        { value: "Bar girl", label: "พนักงานบาร์ (Bar girl)", qualifications: ["อายุ 18 ปีขึ้นไป", "มีความรับผิดชอบและซื่อสัตย์", "สามารถทำงานวันละ 8 ชัวโมงได้ ทำงานอาทิตย์ละ 6 วัน",], benefits: ["รายได้รวมต่อเดือนเริ่มต้น 15,000 - 18,000 บาท ไม่รวมคอมมิชชั่น", "ทิปจากลูกค้า", "วันหยุดประจำสัปดาห์",], work_schedule: { title: "กะเวลาทำงาน (สามารถเลือกวันและเวลาได้)", shifts: [ "สามารถทำงานวันละ 8 ชัวโมงได้ ทำงานอาทิตย์ละ 6 วัน", ], note: "✨ สามารถทำงานกะดึกได้ จะได้รับการพิจารณาเป็นพิเศษ" } },
        { value: "other", label: "อื่นๆ (Other)" },
    ];
    const heardFromOptions = [ { name: 'facebook', label: 'Facebook' }, { name: 'instagram', label: 'Instagram' }, { name: 'tiktok', label: 'TikTok' }, { name: 'website', label: 'Website' }, { name: 'storefront', label: 'หน้าร้าน' }, { name: 'other', label: 'อื่นๆ' }, ];
      
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleRecaptchaChange = useCallback((token) => {
        setFormData(prev => ({ ...prev, recaptchaToken: token }));
        if (token) setSubmitStatus({ message: '', type: '' });
    }, []);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        
        setResumeFile(null);
        setFileName('');
        if (imagePreviewUrl) {
          URL.revokeObjectURL(imagePreviewUrl);
          setImagePreviewUrl('');
        }
    
        if (file) {
          if (file.size > 5 * 1024 * 1024) {
            setSubmitStatus({ message: 'ขนาดไฟล์ต้องไม่เกิน 5MB', type: 'error' });
            return;
          }
          setResumeFile(file);
          setFileName(file.name);
          
          if (file.type.startsWith('image/')) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreviewUrl(previewUrl);
          }
        }
    }, [imagePreviewUrl]);

    const handleRemoveFile = useCallback(() => {
        setResumeFile(null);
        setFileName('');
        if (imagePreviewUrl) {
          URL.revokeObjectURL(imagePreviewUrl);
          setImagePreviewUrl('');
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
    }, [imagePreviewUrl]);

    const handleHeardFromChange = useCallback((e) => {
        const { name, checked } = e.target;
        setHeardFrom(prev => ({ ...prev, [name]: checked }));
    }, []);

    useEffect(() => {
        return () => {
          if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
          }
        };
    }, [imagePreviewUrl]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus({ message: '', type: '' });
        if (!formData.recaptchaToken) { setSubmitStatus({ message: 'กรุณายืนยัน reCAPTCHA', type: 'error' }); return; }
        if (!formData.positionApplied) { setSubmitStatus({ message: 'กรุณาเลือกตำแหน่งที่ต้องการสมัคร', type: 'error' }); return; }
        if (formData.positionApplied === 'other' && !formData.otherPosition.trim()) { setSubmitStatus({ message: 'กรุณาระบุตำแหน่งอื่นที่ท่านต้องการสมัคร', type: 'error' }); return; }
        
        setIsSubmitting(true);
        try {
            let fileUrl = null;
            if (resumeFile) {
                const fileExtension = resumeFile.name.split('.').pop();
                const sanitizedName = formData.fullName.trim().replace(/\s+/g, '_') || 'applicant';
                const uniqueFileName = `${sanitizedName}_${Date.now()}.${fileExtension}`;
                const { error: uploadError } = await supabase.storage.from('job-app-resumes').upload(uniqueFileName, resumeFile);
                if (uploadError) throw new Error(`ไม่สามารถอัปโหลดไฟล์ได้: ${uploadError.message}`);
                const { data: urlData } = supabase.storage.from('job-app-resumes').getPublicUrl(uniqueFileName);
                fileUrl = urlData.publicUrl;
            }
            const finalPosition = formData.positionApplied === 'other' ? formData.otherPosition : formData.positionApplied;
            const sources = Object.keys(heardFrom).filter(key => heardFrom[key]);
            const finalSources = sources.map(sourceLabel => {
                if (sourceLabel === 'other' && heardFromOtherText.trim()) {
                    return `อื่นๆ: ${heardFromOtherText.trim()}`;
                }
                const option = heardFromOptions.find(opt => opt.name === sourceLabel);
                return option ? option.label : sourceLabel;
            }).filter(Boolean);
    
            const submissionData = {
                full_name: formData.fullName, nickname: formData.nickname, phone_number: formData.phoneNumber,
                email: formData.email, age: formData.age ? parseInt(formData.age) : null,
                education_status: formData.educationStatus || null, position_applied: finalPosition,
                experience: formData.experience, resume_url: fileUrl, facebook_url: formData.facebook_url || null,
                instagram_url: formData.instagram_url || null, tiktok_url: formData.tiktok_url || null,
                heard_from_sources: finalSources.length > 0 ? finalSources : null,
            };
            
            const { error } = await supabase.from('job_applications').insert([submissionData]);
            if (error) throw error;
            
            setSubmitStatus({ message: 'ส่งใบสมัครเรียบร้อยแล้ว! ทีมงานจะติดต่อกลับโดยเร็วที่สุดค่ะ', type: 'success' });
            setFormData({ fullName: '', nickname: '', phoneNumber: '', email: '', age: '', educationStatus: '', positionApplied: '', otherPosition: '', experience: '', recaptchaToken: '', facebook_url: '', instagram_url: '', tiktok_url: '' });
            setHeardFrom({ facebook: false, instagram: false, tiktok: false, website: false, storefront: false, other: false });
            setHeardFromOtherText('');
            handleRemoveFile(); // ใช้ฟังก์ชันนี้เพื่อรีเซ็ตไฟล์ทั้งหมด
            recaptchaRef.current?.reset();
        } catch (error) {
            console.error('Submission error:', error);
            setSubmitStatus({ message: `การส่งใบสมัครล้มเหลว: ${error.message}`, type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedJobDetails = jobPositions.find(p => p.value === formData.positionApplied);

    if (!RECAPTCHA_SITE_KEY) {
        return (
          <div className="min-h-screen flex flex-col justify-center items-center bg-slate-100 p-4">
            <p className="text-red-600 font-bold text-center text-lg">ข้อผิดพลาด: ไม่ได้ตั้งค่า RECAPTCHA_SITE_KEY</p>
          </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-white py-12 sm:py-16 font-sans">
            <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 md:mb-12">
                    <img src={story1} alt="Recruitment Banner" className="object-cover w-full h-auto block rounded-2xl shadow-lg" />
                </div>

                <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-2xl w-full border border-slate-200">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">รับสมัครน้องแมว</h1>
                        <p className="mt-3 text-base text-slate-600">สมัครเป็นส่วนหนึ่งของน้องแมวของพวกเรา</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <FormSection title="ข้อมูลผู้สมัคร">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                <FormInput id="fullName" name="fullName" label="ชื่อ-นามสกุล" value={formData.fullName} onChange={handleChange} required placeholder="สมหญิง ใจดี" />
                                <FormInput id="nickname" name="nickname" label="ชื่อเล่น" value={formData.nickname} onChange={handleChange} required placeholder="หญิง" />
                                <FormInput id="email" name="email" label="อีเมล" type="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
                                <FormInput id="phoneNumber" name="phoneNumber" label="เบอร์โทรศัพท์" type="tel" value={formData.phoneNumber} onChange={handleChange} placeholder="08xxxxxxxx" />
                                <FormInput id="age" name="age" label="อายุ" type="number" value={formData.age} onChange={handleChange} min="18" max="65" placeholder="22" />
                                <FormInput id="educationStatus" name="educationStatus" label="สถานะปัจจุบัน (เรียน/ทำงาน)" value={formData.educationStatus} onChange={handleChange} placeholder="เช่น กำลังศึกษาที่ ม.กรุงเทพ ปี 3" />
                            </div>
                        </FormSection>

                        <FormSection title="โซเชียลมีเดีย (ถ้ามี)">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                                <SocialInput icon={FaFacebook} name="facebook_url" value={formData.facebook_url} onChange={handleChange} placeholder="Facebook URL" />
                                <SocialInput icon={FaInstagram} name="instagram_url" value={formData.instagram_url} onChange={handleChange} placeholder="Instagram URL" />
                                <SocialInput icon={FaTiktok} name="tiktok_url" value={formData.tiktok_url} onChange={handleChange} placeholder="TikTok URL" />
                            </div>
                        </FormSection>

                        <FormSection title="ข้อมูลการสมัครงาน">
                            <div>
                                <label htmlFor="positionApplied" className="block text-sm font-medium text-slate-700">ตำแหน่งที่ต้องการสมัคร <span className="text-red-500">*</span></label>
                                <select name="positionApplied" id="positionApplied" value={formData.positionApplied} onChange={handleChange} required className="mt-1 block w-full pl-3 pr-10 py-2.5 border border-slate-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition">
                                    <option value="" disabled>-- กรุณาเลือกตำแหน่ง --</option>
                                    {jobPositions.map(pos => <option key={pos.value} value={pos.value}>{pos.label}</option>)}
                                </select>
                            </div>
                            
                            {selectedJobDetails && selectedJobDetails.value !== 'other' && (
                                <div className="p-5 bg-purple-50 border border-purple-200 rounded-xl text-sm transition-all duration-300 ease-in-out">
                                    <h4 className="font-bold text-lg text-purple-800 mb-4">รายละเอียดตำแหน่ง: {selectedJobDetails.label}</h4>
                                    {selectedJobDetails.qualifications?.length > 0 && <div className="mb-4"><h5 className="font-semibold text-slate-800 mb-2">คุณสมบัติ</h5><ul className="list-disc list-inside text-slate-700 space-y-1.5">{selectedJobDetails.qualifications.map((item, i) => <li key={`q-${i}`}>{item}</li>)}</ul></div>}
                                    {selectedJobDetails.benefits?.length > 0 && <div className="mb-4"><h5 className="font-semibold text-slate-800 mb-2">ค่าตอบแทนและสวัสดิการ</h5><ul className="list-disc list-inside text-slate-700 space-y-1.5">{selectedJobDetails.benefits.map((item, i) => <li key={`b-${i}`}>{item}</li>)}</ul></div>}
                                    {selectedJobDetails.work_schedule && <div><h5 className="font-semibold text-slate-800 mb-2">{selectedJobDetails.work_schedule.title}</h5><ul className="list-disc list-inside text-slate-700 space-y-1.5">{selectedJobDetails.work_schedule.shifts.map((s, i) => <li key={`s-${i}`}>{s}</li>)}</ul>{selectedJobDetails.work_schedule.note && <p className="mt-3 text-sm font-bold text-pink-600">{selectedJobDetails.work_schedule.note}</p>}</div>}
                                </div>
                            )}

                            {formData.positionApplied === 'other' && (
                                <FormInput id="otherPosition" name="otherPosition" label="กรุณาระบุตำแหน่งอื่นๆ ที่ต้องการ" value={formData.otherPosition} onChange={handleChange} required placeholder="ระบุตำแหน่ง..." />
                            )}

                            <div>
                                <label htmlFor="experience" className="block text-sm font-medium text-slate-700">ประสบการณ์ทำงานที่เกี่ยวข้อง (ถ้ามี)</label>
                                <textarea name="experience" id="experience" rows="4" value={formData.experience} onChange={handleChange} className="mt-1 block w-full px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition" placeholder="เล่าประสบการณ์ที่เกี่ยวข้องกับตำแหน่งที่สมัคร..."></textarea>
                            </div>
                            
                            <FileUploadArea 
                                fileName={fileName}
                                imagePreviewUrl={imagePreviewUrl}
                                handleFileChange={handleFileChange}
                                onRemove={handleRemoveFile}
                                fileInputRef={fileInputRef}
                            />
                        </FormSection>

                        <FormSection title="รู้จักเราจากช่องทางใด">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                                {heardFromOptions.map((option) => (
                                    <div key={option.name} className="flex items-center">
                                        <input id={`heard-${option.name}`} name={option.name} type="checkbox" checked={heardFrom[option.name]} onChange={handleHeardFromChange} className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                                        <label htmlFor={`heard-${option.name}`} className="ml-3 block text-sm text-slate-800">{option.label}</label>
                                    </div>
                                ))}
                            </div>
                            {heardFrom.other && (
                                <div className="mt-4">
                                    <FormInput id="heardFromOtherText" name="heardFromOtherText" label="กรุณาระบุช่องทางอื่นๆ" value={heardFromOtherText} onChange={(e) => setHeardFromOtherText(e.target.value)} placeholder="เช่น เพื่อนแนะนำ..." />
                                </div>
                            )}
                        </FormSection>
                        
                        <div className="pt-5 space-y-6">
                            <div className="flex justify-center">
                                <ReCAPTCHA ref={recaptchaRef} sitekey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} onExpired={() => setFormData(prev => ({ ...prev, recaptchaToken: null }))} onError={() => setSubmitStatus({ message: 'เกิดข้อผิดพลาดกับ reCAPTCHA กรุณาลองอีกครั้ง', type: 'error'})} />
                            </div>

                            {submitStatus.message && (
                                <p className={`text-center font-medium ${submitStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {submitStatus.message}
                                </p>
                            )}

                            <button type="submit" disabled={isSubmitting || !formData.recaptchaToken} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-300">
                                {isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งใบสมัคร (Submit Application)'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Register;