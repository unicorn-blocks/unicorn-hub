import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { saveEmail, getSavedEmail } from '../lib/emailStorage';

export default function GlobalEmailNotifyBox() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [show, setShow] = useState(true);
  const [isEmailSaved, setIsEmailSaved] = useState(false);
  const router = useRouter();

  // 组件加载时检查是否有保存的邮箱
  useEffect(() => {
    const savedEmail = getSavedEmail();
    if (savedEmail) {
      setEmail(savedEmail);
      setIsEmailSaved(true);
    }
  }, []);

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
  // Google Sheets 版邮箱收集 - 使用统一工具函数
  const handleNotify = async () => {
    if (!isValidEmail(email)) {
      setError('Please provide a valid email address');
      //setError('❌');
      return;
    }
    try {
      // 动态导入工具函数
      const { submitEmailToGoogleSheets } = await import('../lib/googleSheets');
      const result = await submitEmailToGoogleSheets(email, "global-notify-bar", "");
      
      if (result.success) {
        // 保存邮箱到 localStorage
        saveEmail(email);
        setIsEmailSaved(true);
        // 成功后直接跳转
        router.push('/reserve-vip-spot');
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('提交错误:', err);
      setError('Network error');
    }
  };

  if (!show) return null;

  // UI 细节变量
  const OUTER_WIDTH = 420; // 外黄色框更窄些
  const BOX_HEIGHT = 50; // 内部输入和按钮高度
  const BLACK_BORDER = 2;//黑色描边
  const OUTER_RADIUS = 12;
  const INNER_RADIUS = 12;
  const GAP = 8;
  const SIDE_PAD = 12;
  const INPUT_WIDTH = 180;
  const BTN_WIDTH = 120;
  const FONT_SIZE = 14;
  const BTN_FONT_SIZE = 13;

  return (
    <div
      className="hidden md:flex"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 15,//到页面底部距离
        margin: '0 auto',
        width: OUTER_WIDTH,
        height: 60,
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
      {/* 左侧 12px 间距 */}
      <div style={{ width: SIDE_PAD, height: BOX_HEIGHT }} />
      {/* 输入框（减小尺寸） */}
      <div style={{ position: 'relative', width: 281, height: 37 }}>
        <input
          type="email"
          value={email}
          onChange={handleInputChange}
          placeholder="Enter your email to join"
          style={{
            width: '100%',
            height: '100%',
            background: '#fff',
            borderRadius: INNER_RADIUS,
            border: 'none',
            outline: 'none',
            fontSize: FONT_SIZE,
            color: email ? '#54545C' : '#A7A7A7', // 有输入时使用 #54545C，否则使用 #A7A7A7
            padding: '0 16px',
            paddingRight: isEmailSaved ? '40px' : '16px',
            boxSizing: 'border-box',
          }}
          className="placeholder:text-[#A7A7A7]"
        />
        {isEmailSaved && (
          <span style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '16px',
            color: '#10B981',
            pointerEvents: 'none'
          }}>
            ✅
          </span>
        )}
      </div>
      {/* 中间gap */}
      <div style={{ width: GAP }} />
      {/* 按钮 */}
      <button
        onClick={handleNotify}
        style={{
          width: 158,
          height: 37,
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
      {/* 右侧 12px 间距 */}
      <div style={{ width: 12, height: BOX_HEIGHT-30 }} />
      {/* 错误提示 */}
      {error && (
        <div
          style={{
            position: 'absolute',
            bottom: -20,
            left: 20,
            color: '#dc2626',
            fontSize: 13,
            
           //left:200
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
