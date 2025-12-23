import { useState } from 'react';
import { useRouter } from 'next/router';

export default function EmailNotifyFloatingBox() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // 邮箱验证
  const isValidEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  // 按钮点击
  // Google Sheets 版邮箱收集
  const handleNotify = async () => {
    if (!isValidEmail(email)) {
      setError('Please provide a valid email address');
      return;
    }
    try {
      const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyn8MOU7baUKZ2exFQsLZD6hGs8poE8KpE31vIrpLXgeoLB4EItUzVgn0qTKi9eqmk9/exec";
      const res = await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          email,
          source: "floating-bar",
          note: "notify-floating-bar",
        }),
      });
      const text = await res.text();
      if (!text.includes('OK')) {
        setError('Submit failed: ' + text);
        return;
      }
      router.push('/reserve-vip-spot');
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div style={{
      width: 496,
      height: 89,
      background: '#FFE090',
      borderRadius: 16,
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 3px 10px 0 rgba(39,40,47,0.12)',
      position: 'relative',
      margin: '40px auto',
      zIndex: 20
    }}>
      {/* 输入框 */}
      <input
        type="email"
        value={email}
        onChange={handleInputChange}
        placeholder="Enter email address..."
        style={{
          background: '#fff',
          borderRadius: '16px 0 0 16px',
          border: 'none',
          outline: 'none',
          padding: '0 24px',
          fontSize: 22,
          height: 56,
          flex: 1,
          color: '#A7A7A7',
          boxSizing: 'border-box'
        }}
        className="placeholder:text-[#A7A7A7]"
      />
      {/* 按钮 */}
      <button
        onClick={handleNotify}
        style={{
          height: 56,
          width: 160,
          background: '#2F2737',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 20,
          borderRadius: '0 16px 16px 0',
          border: 'none',
          cursor: 'pointer',
          marginRight: 8,
          marginLeft: 8
        }}
      >
        Join Adventure
      </button>
      {/* 错误提示 */}
      {error && (
        <div style={{position:'absolute', bottom: -26, left: 24, color:'#dc2626', fontSize:14}}>{error}</div>
      )}
    </div>
  );
}


