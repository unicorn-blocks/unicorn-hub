import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer({ onSubscribe, showEmailInput = true }) {
  const { language } = useLanguage();
  const [footerEmail, setFooterEmail] = useState('');
  const [footerStatus, setFooterStatus] = useState({ message: '', type: '' });
  
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
        allRightsReserved: '© 2025 Stardust Echo, LLC. All rights reserved',
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
        allRightsReserved: '© 2025 Stardust Echo, LLC. 保留所有权利',
        emailError: '请提供有效的电子邮箱地址'
      }
    }
  };
  
  const t = translations.footerText[language === 'zh' ? 'zh' : 'en'];
  
  // email 格式校验 - 悬浮框同款
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleFooterSubmit = async (e) => {
    e.preventDefault();
    setFooterStatus({ message: '', type: '' }); // 重置状态
    
    if (!isValidEmail(footerEmail)) {
      setFooterStatus({
        message: t.emailError,
        type: 'error'
      });
      return;
    }
    
    try {
      // 使用统一的Google Sheets工具函数
      const { submitEmailToGoogleSheets } = await import('../../lib/googleSheets');
      const result = await submitEmailToGoogleSheets(footerEmail, "footer", "footer-subscription");
      
      if (result.success) {
        setFooterStatus({
          message: '您已成功加入我们的通知列表！🎉',
          type: 'success'
        });
        setFooterEmail(''); // 清空输入框
        
        // 提交成功后跳转到VIP页面
        setTimeout(() => {
          window.location.href = '/reserve-vip-spot';
        }, 1500); // 等待1.5秒显示成功消息后跳转
      } else {
        setFooterStatus({
          message: result.message,
          type: 'error'
        });
      }
    } catch (err) {
      console.error('Footer邮箱提交错误:', err);
      setFooterStatus({
        message: '网络错误，请稍后重试',
        type: 'error'
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

  return (
    <footer className="py-12 md:py-16 relative z-50" style={{ minHeight: 180 }}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Logo and Contact */}
          <div>
            <div className="flex items-center mb-4">
  <img src="/assets/group 85.svg" alt="Unicorn Blocks Logo" className="h-14" decoding="async" />
</div>
            <p className="mb-4 leading-relaxed" style={{ fontSize: '15px', color: '#666' }}>
              A world of blocks, stories, and imagination.<br/>
              Join the adventure that sparks imagination.
            </p>
            <div className="flex items-center mb-4" style={{ fontSize: '12px', color: '#666' }}>
              <a href="mailto:support@unicornblocks.ai" className="hover:text-[#7d9ed4] transition-colors" target="_blank" rel="noopener">support@unicornblocks.ai</a>
              <span style={{ marginLeft: '20px', color: '#555' }}>{t.allRightsReserved}</span>
            </div>
          </div>

          {/* Let's be friends ! */}
          {showEmailInput && (<div>
            <h3 className="font-semibold mb-4" style={{position: 'relative', top: '20px'}}>{footerT.joinMagicList}</h3>
            <form onSubmit={handleFooterSubmit} className="flex items-end gap-0" style={{ transform: 'translateY(-25px)' }}>
              <div className="flex-1" style={{ maxWidth: '427px', transform: 'translateY(-23px)' }}>
                <input
                  type="email"
                  value={footerEmail}
                  onChange={e => { setFooterEmail(e.target.value); if (footerStatus.message) setFooterStatus({ message: '', type: '' }); }}
                  placeholder="Enter your email to join"
                  className="w-full px-0 py-2 border-0 border-b-2 border-gray-300 focus:outline-none focus:border-[#7d9ed4] bg-transparent text-sm placeholder-gray-400"
                  style={{ borderRadius: 0, color: '#54545C' }}
                />
                {footerStatus.message && (
  <div className={`text-sm ${footerStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
    style={{ marginTop: '4px', minHeight: '18px', lineHeight: '18px' }}>
    {footerStatus.message}
  </div>
)}
              </div>
              <button
                type="submit"
                className="relative flex items-center justify-center transition-all hover:opacity-80"
                style={{ width: '120px', height: '120px', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <img 
                  src="/assets/ima/Group 83.svg" 
                  alt="Join Adventure" 
                  className="w-full h-full object-contain"
                  style={{ position: 'relative', zIndex: 1 }}
                />
                <span 
                  className="absolute font-bold text-center whitespace-nowrap"
                  style={{ 
                    color: '#fff',
                    fontSize: '12px',
                    lineHeight: '0.8',
                    bottom: '34px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 2
                  }}
                >
                  Join Adventure
                </span>
              </button>
            </form>
          </div>)}
        </div>
      </div>
      {/* 添加页脚消息样式 */}
      <style jsx>{`
        .footer-success-message {
          color: #059669;
          background-color: #d1fae5;
          padding: 0.5rem;
          border-radius: 6px;
          margin-top: 0.5rem;
          font-size: 0.875rem;
          text-align: center;
        }
        
        .footer-error-message {
          color: #dc2626;
          background-color: #fee2e2;
          padding: 0.5rem;
          border-radius: 6px;
          margin-top: 0.5rem;
          font-size: 0.875rem;
          text-align: center;
        }
      `}</style>
    </footer>
  );
}
