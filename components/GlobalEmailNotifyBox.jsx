import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  emitIndexPostLeadReserveClick,
  emitIndexPostLeadVipLead,
  INDEX_POSTLEAD_RESERVE_MODE_EVENT,
  INDEX_POSTLEAD_RESERVE_RESULT_EVENT,
  isIndexPostLeadReserveMode,
} from '../lib/postLeadReserve';
// 不再持久化邮箱

export default function GlobalEmailNotifyBox() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [show, setShow] = useState(true);
  const [isEmailSaved, setIsEmailSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isVip, setIsVip] = useState(true); // 默认 VIP 行为
  const [showReserveDiscountCta, setShowReserveDiscountCta] = useState(false);
  const [reserveDiscountLoading, setReserveDiscountLoading] = useState(false);
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

  // 客户端检测域名
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.host.toLowerCase().replace(/:\d+$/, '');
      setIsVip(host === 'vip.unicornblocks.ai' || host === 'localhost');
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (router.pathname !== '/') {
      setShowReserveDiscountCta(false);
      setReserveDiscountLoading(false);
      return;
    }

    const syncReserveMode = () => {
      setShowReserveDiscountCta(isIndexPostLeadReserveMode());
    };
    const handleReserveResult = (event) => {
      if (event?.detail?.status === 'error') {
        setReserveDiscountLoading(false);
      }
    };

    syncReserveMode();
    window.addEventListener(INDEX_POSTLEAD_RESERVE_MODE_EVENT, syncReserveMode);
    window.addEventListener(INDEX_POSTLEAD_RESERVE_RESULT_EVENT, handleReserveResult);

    return () => {
      window.removeEventListener(INDEX_POSTLEAD_RESERVE_MODE_EVENT, syncReserveMode);
      window.removeEventListener(INDEX_POSTLEAD_RESERVE_RESULT_EVENT, handleReserveResult);
    };
  }, [router.pathname]);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };
  // 乐观更新：先跳转，后台异步提交
  const handleNotify = async () => {
    if (showReserveDiscountCta && router.pathname === '/') {
      if (reserveDiscountLoading) return;
      setReserveDiscountLoading(true);
      emitIndexPostLeadReserveClick('global-email-box');
      setTimeout(() => {
        setReserveDiscountLoading(false);
      }, 12000);
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please provide a valid email address');
      return;
    }

    setIsLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    const shouldRunAbOnIndex = isVip && router.pathname === '/';

    // 显示 700ms "Joining" 状态后执行
    setTimeout(() => {
      if (isVip) {
        if (shouldRunAbOnIndex) {
          emitIndexPostLeadVipLead({
            email: normalizedEmail,
            source: 'global-notify-bar',
            note: '',
          });
          setIsLoading(false);
        } else {
          // VIP站：跳转到新的预定页面并带上来源
          router.push('/reservenow?source=vip');
        }
      } else {
        // 主站：显示成功消息
        setShowSuccess(true);
        setIsLoading(false);
      }
    }, 700);

    // 后台异步提交（不阻塞）
    // index 页由页面统一提交（含AB分流字段），避免重复写入
    if (!shouldRunAbOnIndex) {
      import('../lib/googleSheets').then(({ submitEmailToGoogleSheets }) => {
        submitEmailToGoogleSheets(normalizedEmail, "global-notify-bar", "")
          .then(result => {
            if (!result.success) {
              console.warn('Global notify bar email submission failed:', result.message);
            } else {
              // Track Lead with Session Deduplication
              if (typeof window !== 'undefined' && !sessionStorage.getItem('lead_tracked_session')) {
                import('../lib/fbq').then(({ trackLead }) => {
                  trackLead();
                  sessionStorage.setItem('lead_tracked_session', '1');
                });
              }
            }
          })
          .catch(err => console.error('提交错误:', err));
      });
    }
  };

  if (!show) return null;

  // 主站隐藏底部浮动输入框
  if (!isVip) return null;

  // Double Insurance: Explicitly hide on /preorder page to prevent iPad overlap issues
  if (router.pathname === '/preorder') return null;

  // 成功视图（仅主站使用）
  if (showSuccess) {
    return (
      <div
        className="hidden md:flex"
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 15,
          margin: '0 auto',
          width: 'calc(100% - 30px)',
          maxWidth: 420,
          height: 60,
          background: 'linear-gradient(90deg, #E8A4B8 0%, #A79BDB 100%)',
          border: '2px solid #111',
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          boxSizing: 'border-box',
          boxShadow: '0 3px 10px 0 rgba(39,40,47,0.3)',
          gap: 10
        }}
      >
        <span style={{ fontSize: 24 }}>🎉</span>
        <span style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>
          Thank you for Joining! We will notify you when we launch!
        </span>
      </div>
    );
  }

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
  const CONTROL_HEIGHT = 44;
  const FONT_SIZE = 14;
  const BTN_FONT_SIZE = 13;
  const isReserveDiscountMode = showReserveDiscountCta && router.pathname === '/';
  const buttonLoading = isReserveDiscountMode ? reserveDiscountLoading : isLoading;

  return (
    <div
      className="hidden md:flex"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 15,//到页面底部距离
        margin: '0 auto',
        width: 'calc(100% - 30px)',
        maxWidth: OUTER_WIDTH,
        height: 60,
        background: '#FCD77F',
        border: `${BLACK_BORDER}px solid #111`,
        borderRadius: OUTER_RADIUS,
        alignItems: 'center',
        zIndex: 1001,
        justifyContent: 'center',
        boxSizing: 'border-box',
        boxShadow: '0 3px 10px 0 rgba(39,40,47,0.3)'
      }}
    >
      {!isReserveDiscountMode && (
        <>
          {/* 左侧 12px 间距 */}
          <div style={{ width: SIDE_PAD, flexShrink: 0, height: BOX_HEIGHT }} />
          {/* 输入框 */}
          <div style={{ position: 'relative', flex: 1, minWidth: 0, height: CONTROL_HEIGHT }}>
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
                color: email ? '#54545C' : '#A7A7A7',
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
          <div style={{ width: GAP, flexShrink: 0 }} />
        </>
      )}
      {/* 按钮 */}
      <button
        onClick={handleNotify}
        disabled={buttonLoading}
        style={{
          width: isReserveDiscountMode ? 220 : 158,
          flexShrink: 0,
          height: CONTROL_HEIGHT,
          background: '#2F2737',
          color: '#fff',
          fontWeight: 500,
          fontSize: BTN_FONT_SIZE,
          borderRadius: INNER_RADIUS,
          border: 'none',
          cursor: buttonLoading ? 'not-allowed' : 'pointer',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          padding: 0,
          lineHeight: `${CONTROL_HEIGHT}px`,
          opacity: buttonLoading ? 0.7 : 1,
        }}
      >
        {isReserveDiscountMode
          ? (reserveDiscountLoading ? 'Processing...' : 'Reserve Discount')
          : (isLoading ? 'Joining' : 'Unlock VIP Access')}
      </button>
      {!isReserveDiscountMode && (
        <div style={{ width: 12, flexShrink: 0, height: CONTROL_HEIGHT }} />
      )}
      {/* 错误提示 */}
      {error && (
        <div
          style={{
            position: 'absolute',
            bottom: -20,
            left: 20,
            color: '#dc2626',
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
