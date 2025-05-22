import React from 'react';

const LoginPage = () => {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f4f4',
  };

  const boxStyle = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    width: '400px',
    textAlign: 'center',
  };

  const headingStyle = {
    color: '#333',
    marginBottom: '20px',
  };

  const inputGroupStyle = {
    marginBottom: '15px',
    textAlign: 'left',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    color: '#555',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  const signupLinkStyle = {
    marginTop: '20px',
    color: '#777',
  };

  const linkStyle = {
    color: '#007bff',
    textDecoration: 'none',
  };

  const linkHoverStyle = {
    textDecoration: 'underline',
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h1 style={headingStyle}>เข้าสู่ระบบ</h1>
        <form>
          <div style={inputGroupStyle}>
            <label htmlFor="email" style={labelStyle}>
              อีเมล:
            </label>
            <input type="email" id="email" name="email" required style={inputStyle} />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="password" style={labelStyle}>
              รหัสผ่าน:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              style={inputStyle}
            />
          </div>
          <button type="submit" style={buttonStyle} onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)} onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}>
            เข้าสู่ระบบ
          </button>
        </form>
        <div style={signupLinkStyle}>
          ยังไม่มีบัญชี?{' '}
          <a href="/register" style={linkStyle} onMouseOver={(e) => Object.assign(e.target.style, linkHoverStyle)} onMouseOut={(e) => Object.assign(e.target.style, linkStyle)}>
            สมัครสมาชิก
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;