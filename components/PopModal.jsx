import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from './PopModal.module.css';
// 不再持久化邮箱，本地状态即可
const SURVEY_PREFILL_EMAIL_KEY = 'unicorn_survey_prefill_email';

export default function PopModal({
  onClose,
  isVip = true,
  source = "pop-modal",
  onVipLeadSuccess,
  customTitle,
  customBody,
  customCtaText,
  showEmailInput = true,
  onAction,
  countdownMinutes = 0,
  onCountdownExpire,      // NEW: callback when countdown reaches 0
  showTryAgain = false,   // NEW: show Try Again button instead of CTA
  onTryAgain,             // NEW: callback for Try Again click
  isExpired = false,      // NEW: final expired state (no retry)
  isLoading = false,      // NEW: show loading state on CTA
  showSecondaryAction = false,
  secondaryActionText,
  onSecondaryAction,
  hideCloseButton = false, // NEW: Hide the close button
  centerLayout = false, // NEW: Center layout prop
}) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEmailSaved, setIsEmailSaved] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState(countdownMinutes * 60); // seconds

  useEffect(() => {
    if (countdownMinutes <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Trigger callback when countdown expires
          if (onCountdownExpire) {
            setTimeout(() => onCountdownExpire(), 0);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdownMinutes, onCountdownExpire]);

  // Format time as M:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Google Sheets 版提交通知 - 乐观更新：先跳转，后台异步提交
  const handleNotify = async () => {
    // 防止重复提交
    if (isProcessing) return;

    if (!isValidEmail(email)) {
      setError('Please provide a valid email address');
      return;
    }

    setIsProcessing(true);
    setIsHovered(false);

    const normalizedEmail = email.trim().toLowerCase();
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(SURVEY_PREFILL_EMAIL_KEY, normalizedEmail);
      } catch (err) {
        console.warn('Failed to cache survey prefill email:', err);
      }
    }

    // 显示 700ms "Joining" 状态后执行
    setTimeout(() => {
      if (isVip) {
        // VIP站：默认跳转 reservenow；若页面提供回调则交由页面自行分流/后续动作
        if (onVipLeadSuccess) {
          try {
            onVipLeadSuccess({
              email: normalizedEmail,
              source: source || "pop-modal",
            });
          } catch (err) {
            console.error('onVipLeadSuccess callback error:', err);
            router.push('/reservenow?source=vip');
          }
        } else {
          router.push('/reservenow?source=vip');
        }
      } else {
        // 主站：显示成功视图
        setShowSuccess(true);
        setIsProcessing(false);
      }
    }, 700);

    // 后台异步提交（不阻塞）
    // 当 VIP 且由页面提供 onVipLeadSuccess 时，交由页面统一提交（避免重复写入）
    const shouldDeferToParent = isVip && !!onVipLeadSuccess;
    if (!shouldDeferToParent) {
      import('../lib/googleSheets').then(({ submitEmailToGoogleSheets }) => {
        // 使用传递进来的 source 参数，如果未传则默认为 pop-modal (虽然上面prop已有默认值，这里保持原本逻辑兼容性)
        const finalSource = source || "pop-modal";
        submitEmailToGoogleSheets(normalizedEmail, finalSource, "reserve-pop-modal")
          .then(result => {
            if (!result.success) {
              console.warn('Email submission failed:', result.message);
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

  // 固定按钮文案 (fallback)
  const btnText = customCtaText || 'Unlock VIP Access →';

  // Handle direct action (no email)
  const handleActionClick = () => {
    if (onAction) {
      onAction();
    }
  };

  // 成功视图（仅主站使用）
  if (showSuccess) {
    return (
      <div className={styles.popModalMask}>
        <div className={styles.popModalMain + (centerLayout ? ' ' + styles.centerLayout : '')}>
          <div className={styles.blackShadow}></div>
          <div className={styles.yellowPanel}>
            <button className={styles.closeBtn} onClick={onClose} aria-label="close">×</button>
            <div className={styles.successView}>
              <div className={styles.successEmoji}>🎉</div>
              <h2 className={styles.successTitle}>Thank You for Joining!</h2>
              <p className={styles.successText}>We will notify you when we launch!</p>
              <button className={styles.gotItBtn} onClick={onClose}>Got it!</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.popModalMask}>
      <div
        className={styles.popModalMain + (centerLayout ? ' ' + styles.centerLayout : '')}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 黑色叠底 */}
        <div className={styles.blackShadow}></div>
        {/* 黄色主弹窗 */}
        <div className={styles.yellowPanel}>
          {/* 关闭按钮 */}
          {!hideCloseButton && <button className={styles.closeBtn} onClick={onClose} aria-label="close">×</button>}
          {/* 顶部飞机 */}
          <Image src="/assets/ima/Image copy 1.png" alt="airplane" width={151} height={161} className={styles.plane} />
          {/* 大标题 */}
          <h2 className={styles.reserveTitle}>
            <span>{customTitle || 'Unlock VIP Access'}</span>
          </h2>
          {/* 内容区域 - hover时不再隐藏 */}
          <div className={styles.contentMiddle}>
            <div className={styles.txtLine}>
              {customBody ? customBody : (
                countdownMinutes > 0 ? (
                  <>
                    Complete your order within <span style={{ color: '#DC2626', fontWeight: 700 }}>{formatTime(timeLeft)} </span>
                    to keep your <span style={{ color: '#DC2626', fontWeight: 700 }}>$50</span> VIP discount.
                  </>
                ) : (
                  <>Get <span>early updates</span>, and later have the chance to secure <span>VIP pricing</span> with a small, refundable deposit.</>
                )
              )}
            </div>
          </div>
          {/* 底部输入区块 - hover时位置不再改变 */}
          <div className={styles.bottomInputWrapper}>
            {/* 邮箱输入框放左边 - 仅在 showEmailInput 为 true 时显示 */}
            {showEmailInput && (
              <div style={{ position: 'relative', width: 281, height: 44 }}>
                <input
                  type="email"
                  placeholder="Enter your email to join"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value); setError(''); setSubmitted(false);
                  }}
                  className={styles.inputEmail}
                  style={{ paddingRight: isEmailSaved ? '40px' : '17px' }}
                  disabled={submitted}
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
            )}

            {/* 按钮+dudu置于右边 (或者居中如果没输入框) */}
            <div className={styles.btnWithDogWrap} style={!showEmailInput ? { marginLeft: 'auto', marginRight: 'auto', width: '100%', justifyContent: 'center' } : {}}>


              {/* Conditional button rendering based on state */}
              {showTryAgain ? (
                // EXPIRED_1 state: Show Try Again button
                <button
                  className={styles.notifyBtn}
                  style={{ width: '100%', maxWidth: '300px', background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)' }}
                  onClick={onTryAgain}
                >
                  🔄 Try Again
                </button>
              ) : isExpired ? (
                // FINAL_EXPIRED state: Show action button with custom text
                <button
                  className={styles.notifyBtn + (isLoading ? ' ' + styles.loading : '')}
                  style={{ width: '100%', maxWidth: '300px' }}
                  onClick={handleActionClick}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <svg style={{ animation: 'spin 1s linear infinite', height: '20px', width: '20px', color: 'white' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : btnText}
                </button>
              ) : (
                // ACTIVE states: Normal CTA button
                <button
                  className={styles.notifyBtn + (submitted ? ' ' + styles.submitted : '') + (isLoading ? ' ' + styles.loading : '')}
                  style={submitted ? { background: '#4E81A8' } : {}}
                  onClick={showEmailInput ? handleNotify : handleActionClick}
                  disabled={(showEmailInput && (submitted || isProcessing)) || isLoading}
                >
                  {isLoading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <svg style={{ animation: 'spin 1s linear infinite', height: '20px', width: '20px', color: 'white' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : showEmailInput ? (isProcessing ? 'Joining' : btnText) : btnText}
                </button>
              )}

              {/* Secondary Action Button (Optional) */}
              {showSecondaryAction && (
                <button
                  className={styles.secondaryBtn}
                  onClick={onSecondaryAction}
                >
                  {secondaryActionText || 'No Thanks'}
                </button>
              )}
            </div>
            {/* 错误提示 */}
            {error && <div className={styles.errorTip}>{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
