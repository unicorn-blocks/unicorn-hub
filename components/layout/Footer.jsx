import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLanguage } from '../../context/LanguageContext';
import { clearSavedEmail } from '../../lib/emailStorage';

export default function Footer({
  onSubscribe,
  onVipLeadSuccess,
  showEmailInput = true,
  showReserveDiscountCta = false,
  onReserveDiscount,
  reserveDiscountLoading = false,
}) {
  const router = useRouter();
  const { language } = useLanguage();
  const [footerEmail, setFooterEmail] = useState('');
  const [footerStatus, setFooterStatus] = useState({ message: '', type: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEmailSaved, setIsEmailSaved] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isVip, setIsVip] = useState(true); // 默认 VIP 行为

  // 页面加载时不再恢复历史邮箱，并清空本地存储
  useEffect(() => {
    clearSavedEmail();
    setFooterEmail('');
    setIsEmailSaved(false);
  }, []);

  // 客户端检测域名
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.host.toLowerCase().replace(/:\d+$/, '');
      setIsVip(host === 'vip.unicornblocks.ai' || host === 'localhost');
    }
  }, []);

  // 翻译文本
  const translations = {
    footerText: {
      en: {
        joinWaitlist: 'Join Waitlist',
        quickLinks: 'Quick Links',
        features: 'Features',
        faq: 'FAQ',
        enterEmail: 'Enter your email here',
        productOf: 'A product of',
        allRightsReserved: '© 2026 Stardust Echo, LLC. All rights reserved',
        emailError: 'Please provide a valid email address'
        //emailError: '❌'
      },
      zh: {
        joinWaitlist: '加入候补名单',
        quickLinks: '快速链接',
        features: '功能特点',
        faq: '常见问题',
        enterEmail: '在此输入您的邮箱',
        productOf: '产品由',
        allRightsReserved: '© 2026 Stardust Echo, LLC. All rights reserved',
        emailError: '请提供有效的电子邮箱地址'
      }
    }
  };

  const t = translations.footerText[language === 'zh' ? 'zh' : 'en'];

  // email 格式校验 - 悬浮框同款
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // 乐观更新：先跳转，后台异步提交
  const handleFooterSubmit = async (e) => {
    e.preventDefault();
    setFooterStatus({ message: '', type: '' });

    if (showReserveDiscountCta) {
      if (onReserveDiscount) onReserveDiscount();
      return;
    }

    // 防止重复提交
    if (isProcessing) return;

    if (!isValidEmail(footerEmail)) {
      setFooterStatus({
        message: t.emailError,
        type: 'error'
      });
      return;
    }

    setIsProcessing(true);
    const normalizedEmail = footerEmail.trim().toLowerCase();
    const shouldDeferToParent = isVip && typeof onVipLeadSuccess === 'function' && router.pathname === '/';

    // 显示 700ms 状态后执行
    setTimeout(() => {
      if (isVip) {
        // VIP站：若页面提供回调，交由页面处理AB分流；否则保持原有跳转
        if (shouldDeferToParent) {
          try {
            onVipLeadSuccess({
              email: normalizedEmail,
              source: 'footer',
            });
          } catch (err) {
            console.error('Footer onVipLeadSuccess callback error:', err);
            router.push('/reservenow?source=vip');
          }
        } else {
          router.push('/reservenow?source=vip');
        }
      } else {
        // 主站：显示成功消息
        setShowSuccess(true);
        setIsProcessing(false);
      }
    }, 700);

    // 后台异步提交（不阻塞）
    // 若交由页面处理VIP回调，避免重复写入（页面会统一提交并带分流信息）
    if (!shouldDeferToParent) {
      import('../../lib/googleSheets').then(({ submitEmailToGoogleSheets }) => {
        submitEmailToGoogleSheets(normalizedEmail, "footer", "")
          .then(result => {
            if (!result.success) {
              console.warn('Footer email submission failed:', result.message);
            } else {
              // Track Lead with Session Deduplication
              if (typeof window !== 'undefined' && !sessionStorage.getItem('lead_tracked_session')) {
                import('../../lib/fbq').then(({ trackLead }) => {
                  trackLead();
                  sessionStorage.setItem('lead_tracked_session', '1');
                });
              }
            }
          })
          .catch(err => console.error('Footer邮箱提交错误:', err));
      });
    }
  };


  const footerTranslations = {
    en: {
      joinMagicList: "Let's be friends !",
      enterEmail: 'Enter your email',
      subscribe: 'Subscribe',
      tagline: 'Inspiring the next generation of creators through magical, screen-free play.',
      terms: 'Terms & Conditions',
      privacy: 'Privacy Policy'
    },
    zh: {
      joinMagicList: '让我们成为朋友吧！',
      enterEmail: '输入您的邮箱',
      subscribe: '订阅',
      tagline: '通过神奇的、无屏幕的游戏激励下一代创造者。',
      terms: '条款与条件',
      privacy: '隐私政策'
    }
  };

  const footerT = footerTranslations[language === 'zh' ? 'zh' : 'en'];
  const isReserveDiscountMode = showReserveDiscountCta;

  return (
    <footer className="footer-responsive py-8 md:py-12 lg:py-16 relative z-50" style={{ minHeight: 180 }}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-8 md:mb-12">
          {/* Logo and Contact */}
          <div className="footer-logo-section">
            <div className="flex items-center mb-3 md:mb-4">
              <img src="/assets/Group 85.svg" alt="Unicorn Blocks Logo" className="h-10 md:h-14" decoding="async" />
            </div>
            <p className="footer-tagline mb-3 md:mb-4 leading-relaxed" style={{ marginTop: '16px' }}>
              A world of blocks, stories, and imagination.
            </p>
            <div className="footer-contact flex flex-col md:flex-row md:items-center mb-3 md:mb-4 gap-2 md:gap-0">
              <a href="mailto:support@unicornblocks.ai" className="hover:text-[#7d9ed4] transition-colors" target="_blank" rel="noopener">
                support@unicornblocks.ai
              </a>
              <span className="footer-copyright hidden md:inline md:ml-10">{t.allRightsReserved}</span>
            </div>
          </div>

          {/* Let's be friends ! */}
          {showEmailInput && (
            <div className="footer-email-section flex justify-start md:justify-end">
              <div className="w-full md:max-w-[547px]">
                <h3 className="footer-email-title font-semibold mb-3 md:mb-4">
                  {showSuccess ? '🎉 Thank You!' : footerT.joinMagicList}
                </h3>
                {showSuccess ? (
                  <p style={{ color: '#666', fontSize: '1rem' }}>
                    Thank you for Joining! We will notify you when we launch!
                  </p>
                ) : (
                  <form onSubmit={handleFooterSubmit} className={`footer-email-form flex flex-col md:flex-row md:items-end gap-4 md:gap-0 ${isReserveDiscountMode ? 'justify-center md:justify-end' : ''}`}>
                    {!isReserveDiscountMode && (
                      <div className="footer-input-wrapper flex-1 w-full md:max-w-[427px] relative">
                        <input
                          type="email"
                          value={footerEmail}
                          onChange={e => { setFooterEmail(e.target.value); if (footerStatus.message) setFooterStatus({ message: '', type: '' }); }}
                          placeholder="Enter your email to join"
                          className="footer-email-input w-full px-0 py-2 border-0 border-b-2 border-gray-300 focus:outline-none focus:border-[#7d9ed4] bg-transparent placeholder-gray-400"
                          style={{ borderRadius: 0, color: '#54545C', paddingRight: isEmailSaved ? '30px' : '0' }}
                        />
                        {isEmailSaved && (
                          <span className="footer-checkmark">✅</span>
                        )}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={showReserveDiscountCta ? reserveDiscountLoading : isProcessing}
                      className="footer-submit-btn relative flex items-center justify-center transition-all self-center md:self-auto"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                        cursor: (showReserveDiscountCta ? reserveDiscountLoading : isProcessing) ? 'not-allowed' : 'pointer',
                        opacity: (showReserveDiscountCta ? reserveDiscountLoading : isProcessing) ? 0.7 : 1,
                      }}
                    >
                      <img
                        src="/assets/ima/Group 83.svg"
                        alt="Join Adventure"
                        className="w-full h-full object-contain"
                        style={{ position: 'relative', zIndex: 1 }}
                      />
                      <span
                        className="footer-btn-text absolute font-bold text-center whitespace-nowrap"
                        style={{
                          color: '#fff',
                          lineHeight: '0.8',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          zIndex: 2
                        }}
                      >
                        {showReserveDiscountCta
                          ? (reserveDiscountLoading ? 'Processing...' : 'Reserve Discount')
                          : (isProcessing ? 'Joining' : 'Unlock VIP Access')}
                      </span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Welcome message for pages without email input */}
          {!showEmailInput && (
            <div className="footer-welcome-section hidden md:flex justify-start md:justify-end">
              <div className="w-full md:max-w-[547px]">
                <p className="footer-welcome-text mb-3 md:mb-4 leading-relaxed md:pl-[150px]">
                  Welcome to the Adventure ✨<br />
                  You're officially part of the Unicorn Blocks world.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile-only copyright at bottom */}
        <div className="footer-copyright-mobile md:hidden text-left mt-6">
          <span className="footer-copyright-mobile-text">{t.allRightsReserved}</span>
        </div>
      </div>
      {/* Footer响应式样式 */}
      <style jsx>{`
        /* 移动端样式 */
        .footer-responsive {
          font-size: 14px;
        }
        
        .footer-tagline {
          font-size: 14px;
          color: #666;
        }
        
        .footer-contact {
          font-size: 12px;
          color: #666;
        }
        
        .footer-copyright {
          color: #555;
        }
        
        .footer-copyright-mobile-text {
          font-size: 12px;
          color: #555;
        }
        
        .footer-email-title {
          font-size: 16px;
        }
        
        .footer-email-input {
          font-size: 14px;
        }
        
        .footer-submit-btn {
          width: 100px;
          height: 100px;
        }
        
        .footer-btn-text {
          font-size: 11px;
          bottom: 28px;
        }
        
        .footer-checkmark {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 18px;
          color: #10B981;
          pointer-events: none;
        }
        
        .footer-welcome-text {
          font-size: 14px;
          color: #666;
          margin-top: 20px;
        }
        
        /* PC端样式 */
        @media (min-width: 768px) {
          .footer-responsive {
            font-size: 16px;
          }
          
          .footer-tagline {
            font-size: 15px;
            margin-top: 26px;
          }
          
          .footer-email-title {
            font-size: 18px;
            position: relative;
            top: 20px;
          }
          
          .footer-email-form {
            transform: translateY(-25px);
          }
          
          .footer-input-wrapper {
            transform: translateY(-23px);
          }
          
          .footer-submit-btn {
            width: 120px;
            height: 120px;
          }
          
          .footer-btn-text {
            font-size: 12px;
            bottom: 34px;
          }
          
          .footer-welcome-text {
            font-size: 15px;
            margin-top: 57.5px;
          }
        }
      `}</style>
    </footer>
  );
}
