import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function GlobalEmailNotifyBox() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [show, setShow] = useState(true);
  const router = useRouter();

  // 邮箱验证
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // 检测footer邮箱输入框是否进入视口
  useEffect(() => {
    function checkFooterInView() {
      const el = document.querySelector('input[type="email"]');
      if (el) {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom >= 0;
        setShow(!inView);
      }
    }
    window.addEventListener('scroll', checkFooterInView);
    checkFooterInView();
    return () => window.removeEventListener('scroll', checkFooterInView);
  }, []);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };
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
          source: "global-notify-bar",
          note: "notify-global-bar",
        }),
      });
      const text = await res.text();
      if (!text.includes('OK')) {
        setError('Submit failed: ' + text);
        return;
      }
      // 成功后直接跳转
      router.push('/reserve-vip-spot');
    } catch (err) {
      setError('Network error');
    }
  };

  if (!show) return null;

  // UI 细节变量
  const OUTER_WIDTH = 458; // 外黄色框更窄些
  const BOX_HEIGHT = 60; // 内部输入和按钮高度
  const BLACK_BORDER = 2;
  const OUTER_RADIUS = 12;
  const INNER_RADIUS = 12;
  const GAP = 8;
  const SIDE_PAD = 18;
  const INPUT_WIDTH = 180;
  const BTN_WIDTH = 120;
  const FONT_SIZE = 14;
  const BTN_FONT_SIZE = 13;

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 10,
        margin: '0 auto',
        width: OUTER_WIDTH,
        height: 81,
        background: '#FCD77F',
        border: `${BLACK_BORDER}px solid #111`,
        borderRadius: OUTER_RADIUS,
        display: 'flex',
        alignItems: 'center',
        zIndex: 1001,
        justifyContent: 'center',
        boxSizing: 'border-box',
        boxShadow: '0 3px 10px 0 rgba(39,40,47,0.3)'
      }}
    >
      {/* 左侧 18px 间距 */}
      <div style={{ width: SIDE_PAD, height: BOX_HEIGHT }} />
      {/* 输入框（减小尺寸） */}
      <input
        type="email"
        value={email}
        onChange={handleInputChange}
        placeholder="Enter email address..."
        style={{
          width: 281,
          height: 44,
          background: '#fff',
          borderRadius: INNER_RADIUS,
          border: 'none',
          outline: 'none',
          fontSize: FONT_SIZE,
          color: '#A7A7A7',
          padding: '0 16px',
          boxSizing: 'border-box',
        }}
        className="placeholder:text-[#A7A7A7]"
      />
      {/* 中间gap */}
      <div style={{ width: GAP }} />
      {/* 按钮 */}
      <button
        onClick={handleNotify}
        style={{
          width: 158,
          height: 44,
          background: '#2F2737',
          color: '#fff',
          fontWeight: 500,
          fontSize: BTN_FONT_SIZE,
          borderRadius: INNER_RADIUS,
          border: 'none',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          padding: 0
        }}
      >
        Join Adventure
      </button>
      {/* 右侧 18px 间距 */}
      <div style={{ width: 18, height: BOX_HEIGHT-30 }} />
      {/* 错误提示 */}
      {error && (
        <div
          style={{
            position: 'absolute',
            bottom: -26,
            left: 24,
            color: '#dc2626',
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
