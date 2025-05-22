    import React, { useState } from 'react';
    import { supabase } from './supabaseClient';

    const styles = {
    container: {
        maxWidth: '400px',
        margin: '50px auto',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
    },
    heading: {
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '20px',
        textAlign: 'center',
    },
    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '20px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '16px',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#1877f2',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    message: {
        marginTop: '15px',
        fontSize: '14px',
        textAlign: 'center',
    },
    };

    const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3000/UpdatePasswordPage', // เปลี่ยนตาม URL ของคุณ
        });

        if (error) {
        setMessage('เกิดข้อผิดพลาด: ' + error.message);
        } else {
        setMessage('ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว');
        }
    };

    return (
        <div style={styles.container}>
        <h1 style={styles.heading}>ลืมรหัสผ่าน</h1>
        <form onSubmit={handleResetPassword}>
            <input
            type="email"
            placeholder="กรอกอีเมลของคุณ"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
            />
            <button type="submit" style={styles.button}>ส่งลิงก์รีเซ็ตรหัสผ่าน</button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
        </div>
    );
    };

    export default ForgotPasswordPage;
