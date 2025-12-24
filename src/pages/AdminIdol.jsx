import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../pages/supabaseClient'; // Make sure this path is correct
import {
    PencilSquareIcon,
    TrashIcon,
    PlusCircleIcon,
    XMarkIcon,
    UserGroupIcon,
    NewspaperIcon,
    CalendarDaysIcon,
    PhotoIcon,
    StarIcon,
    ArrowUpTrayIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';


// --- Reusable UI Components (No changes from previous version) ---

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-2xl p-8 bg-white rounded-2xl shadow-2xl animate-in zoom-in-95">
                <div className="flex items-center justify-between pb-4 mb-4 border-b">
                    <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
                    <button onClick={onClose} className="p-2 transition-colors rounded-full hover:bg-slate-100">
                        <XMarkIcon className="w-6 h-6 text-slate-500" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

const Input = ({ label, name, value, onChange, placeholder, type = 'text', disabled = false, required = false }) => (
    <div>
        <label htmlFor={name} className="block mb-2 text-sm font-semibold text-slate-600">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-4 py-2 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:bg-slate-100"
        />
    </div>
);


const ImageUploadInput = ({ label, name, currentImageUrl, onFileChange, required = false }) => {
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        setPreview(currentImageUrl);
    }, [currentImageUrl]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            onFileChange(file);
        }
    };

    return (
        <div>
            <label className="block mb-2 text-sm font-semibold text-slate-600">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex items-center gap-4">
                {preview ? (
                    <img src={preview} alt="Preview" className="object-cover w-24 h-24 rounded-lg bg-slate-100" />
                ) : (
                    <div className="flex items-center justify-center w-24 h-24 text-slate-400 bg-slate-100 rounded-lg">
                        <PhotoIcon className="w-10 h-10" />
                    </div>
                )}
                <div className="flex-1">
                    <label htmlFor={name} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors border rounded-lg cursor-pointer border-slate-300 text-slate-700 hover:bg-slate-100">
                        <ArrowUpTrayIcon className="w-5 h-5" />
                        Choose new image...
                    </label>
                    <input
                        id={name}
                        name={name}
                        type="file"
                        accept="image/png, image/jpeg, image/gif, image/webp"
                        onChange={handleFileChange}
                        className="sr-only"
                    />
                    <p className="mt-2 text-xs text-slate-500">PNG, JPG, GIF, WEBP. Recommended: 1200x800px</p>
                </div>
            </div>
        </div>
    );
};

const Textarea = ({ label, name, value, onChange, placeholder, rows = 4, required = false }) => (
    <div>
        <label htmlFor={name} className="block mb-2 text-sm font-semibold text-slate-600">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-4 py-2 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
    </div>
);


const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false }) => {
    const baseClasses = "px-5 py-2.5 font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "text-white bg-violet-600 hover:bg-violet-700 focus:ring-violet-500",
        secondary: "text-slate-700 bg-slate-100 hover:bg-slate-200 focus:ring-slate-300",
    };
    return (
        <button type={type} onClick={onClick} disabled={disabled} className={`${baseClasses} ${variants[variant]}`}>
            {children}
        </button>
    );
};

const Section = ({ icon, title, children }) => (
    <div className="p-8 bg-white border rounded-xl border-slate-200/80">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b">
            {React.createElement(icon, { className: "w-7 h-7 text-violet-500" })}
            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        </div>
        {children}
    </div>
);

const uploadImage = async (file, folder) => {
    if (!file) return { data: null, error: null };
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage.from('idol-images').upload(filePath, file);

    if (error) return { data: null, error };

    const { data: publicUrlData } = supabase.storage.from('idol-images').getPublicUrl(data.path);

    return { data: { publicUrl: publicUrlData.publicUrl }, error: null };
};

function NewsManager({ initialData, onDataChange }) {
    const tableName = 'news_idol';
    const tableLabel = 'News';
    const [items, setItems] = useState(initialData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [formData, setFormData] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => { setItems(initialData); }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openModal = (item = null) => {
        setCurrentItem(item);
        setFormData(item ? { ...item } : {});
        setImageFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentItem(null);
        setFormData({});
        setImageFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.date) {
            alert('Please fill in all required fields (Title and Date).');
            return;
        }

        setIsSubmitting(true);
        let finalImageUrl = formData.image_url;

        if (imageFile) {
            const { data: uploadData, error: uploadError } = await uploadImage(imageFile, 'news');
            if (uploadError) {
                alert(`Error uploading image: ${uploadError.message}`);
                setIsSubmitting(false);
                return;
            }
            finalImageUrl = uploadData.publicUrl;
        }
        
        const payload = { ...formData, image_url: finalImageUrl };
        delete payload.imageFile;

        const { error } = currentItem
            ? await supabase.from(tableName).update(payload).eq('id', currentItem.id)
            : await supabase.from(tableName).insert(payload);

        if (error) {
            alert(`Error saving news: ${error.message}`);
        } else {
            alert(`News ${currentItem ? 'updated' : 'added'} successfully!`);
            closeModal();
            onDataChange();
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`Are you sure you want to delete this news item?`)) return;
        const { error } = await supabase.from(tableName).delete().eq('id', id);
        if (error) {
            alert(`Error deleting news: ${error.message}`);
        } else {
            alert(`News deleted successfully!`);
            onDataChange();
        }
    };
    
    return (
        <div>
            <div className="flex justify-end mb-6">
                <Button onClick={() => openModal()}><PlusCircleIcon className="w-5 h-5 mr-2"/>Add New {tableLabel}</Button>
            </div>
            <div className="space-y-4">
                {items.length > 0 ? (
                    items.map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-4 transition-colors bg-white border rounded-lg hover:bg-slate-50">
                            <img src={item.image_url || 'https://placehold.co/100x100/e2e8f0/475569?text=N/A'} alt={item.title} className="object-cover w-24 rounded-md aspect-video"/>
                            <div className="flex-1">
                                <p className="font-bold text-slate-800">{item.title}</p>
                                <p className="text-sm text-slate-500">{item.date ? new Date(item.date).toLocaleDateString() : 'No date'}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openModal(item)} className="p-2 text-blue-600 rounded-full hover:bg-blue-100"><PencilSquareIcon className="w-5 h-5"/></button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 rounded-full hover:bg-red-100"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="py-8 text-center text-slate-500 bg-slate-50 rounded-lg">No {tableLabel.toLowerCase()} found.</p>
                )}
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} title={`${currentItem ? 'Edit' : 'Add'} ${tableLabel}`}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input label="Title" name="title" value={formData.title} onChange={handleInputChange} placeholder="News title here..." required={true} />
                    <Input label="Date" name="date" type="date" value={formData.date} onChange={handleInputChange} required={true} />
                    <ImageUploadInput label="Image" name="imageFile" currentImageUrl={formData.image_url} onFileChange={setImageFile} />
                    <Textarea label="Content" name="content" value={formData.content} onChange={handleInputChange} placeholder="Full news content... (optional)" />
                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="secondary" onClick={closeModal} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : `Save ${tableLabel}`}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

// --- Specialized Editor with Image Upload ---
function SingleItemUploadEditor({ tableName, tableLabel, formFields, initialData, onDataChange }) {
    const [formData, setFormData] = useState(initialData || {});
    const [imageFile, setImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => { setFormData(initialData || {}); setImageFile(null); }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // --- [FIXED] Enhanced Validation Logic ---
        const isCreating = !formData.id;
        const requiredFields = formFields.filter(f => f.required);

        for (const field of requiredFields) {
            // Check for required text fields
            if (field.type !== 'imageUpload' && !formData[field.name]) {
                alert(`Error: The "${field.label}" field is required.`);
                return;
            }
            // Check for a required image ONLY when creating a new item
            if (field.type === 'imageUpload' && isCreating && !imageFile) {
                alert(`Error: An "${field.label}" is required to create a new item.`);
                return;
            }
        }
        // --- End of Validation ---

        setIsSubmitting(true);
        let finalImageUrl = formData.image_url;

        if (imageFile) {
            const { data: uploadData, error: uploadError } = await uploadImage(imageFile, tableName);
            if (uploadError) {
                alert(`Error uploading image: ${uploadError.message}`);
                setIsSubmitting(false);
                return;
            }
            finalImageUrl = uploadData.publicUrl;
        }

        const { id, created_at, ...updateData } = { ...formData, image_url: finalImageUrl };
        delete updateData.imageFile;
        let error;
        const isUpdating = !!id;

        if (isUpdating) {
            const { error: updateError } = await supabase.from(tableName).update(updateData).eq('id', id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase.from(tableName).insert(updateData);
            error = insertError;
        }

        if (error) {
            alert(`Error saving ${tableLabel}: ${error.message}`);
        } else {
            alert(`${tableLabel} ${isUpdating ? 'updated' : 'created'} successfully!`);
            onDataChange();
        }
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {formFields.map(field => {
                if (field.type === 'imageUpload') {
                    return <ImageUploadInput key={field.name} {...field} currentImageUrl={formData.image_url} onFileChange={setImageFile} />;
                }
                if (field.type === 'textarea') {
                    return <Textarea key={field.name} {...field} value={formData[field.name]} onChange={handleInputChange} />;
                }
                return <Input key={field.name} {...field} value={formData[field.name]} onChange={handleInputChange} />;
            })}
            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : `${formData.id ? 'Update' : 'Create'} ${tableLabel}`}</Button>
            </div>
        </form>
    );
}


// --- Main Admin Page Component ---
const AdminIdol = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        news: [],
        banner: null,
        featured: null,
    });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [newsRes, bannerRes, featuredRes] = await Promise.all([
                supabase.from('news_idol').select('*').order('created_at', { ascending: false }),
                supabase.from('banners_idol').select('*').order('created_at', { ascending: false }).limit(1),
                supabase.from('featured_idol').select('*').order('created_at', { ascending: false }).limit(1),
            ]);

            const responses = { newsRes, bannerRes, featuredRes };
            for (const key in responses) { if (responses[key].error) throw responses[key].error; }

            setData({
                news: newsRes.data || [],
                banner: bannerRes.data?.[0] || null,
                featured: featuredRes.data?.[0] || null,
            });
        } catch (error) {
            console.error("Error fetching admin data:", error);
            alert("Failed to load data: " + error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading Admin Panel...</div>;
    }

    return (
        <div className="min-h-screen p-4 bg-slate-100 sm:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900">Idol Content Management</h1>
                    <p className="mt-2 text-lg text-slate-600">Manage all content for the main idol page.</p>
                </header>

                <main className="space-y-8">
                    <Section icon={NewspaperIcon} title="Latest News">
                        <NewsManager
                            initialData={data.news}
                            onDataChange={fetchData}
                        />
                    </Section>
                    
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <Section icon={StarIcon} title="Featured Idol of the Month">
                            <SingleItemUploadEditor
                                tableName="featured_idol"
                                tableLabel="Featured Idol"
                                initialData={data.featured}
                                onDataChange={fetchData}
                                formFields={[
                                    { label: 'Name', name: 'name', placeholder: 'Idol Name', required: true },
                                    // [FIXED] Mark 'Image' as a required field for validation
                                    { label: 'Image', name: 'imageFile', type: 'imageUpload', required: true },
                                    { label: 'Description', name: 'description', type: 'textarea', rows: 5 },
                                ]}
                            />
                        </Section>

                        <Section icon={PhotoIcon} title="Main Banner">
                            <SingleItemUploadEditor
                                tableName="banners_idol"
                                tableLabel="Banner"
                                initialData={data.banner}
                                onDataChange={fetchData}
                                formFields={[
                                    { label: 'Title', name: 'title', placeholder: 'Banner main title', required: true },
                                    { label: 'Subtitle', name: 'subtitle', placeholder: 'Banner subtitle' },
                                    // [FIXED] Mark 'Image' as a required field for validation
                                    { label: 'Image', name: 'imageFile', type: 'imageUpload', required: true },
                                ]}
                            />
                        </Section>
                    </div>

                    <div className="p-4 mt-8 rounded-lg bg-slate-200/60">
                         <p className="text-sm text-center text-slate-600">Members & Schedule management have been removed for this example to focus on image uploads and validation.</p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminIdol;