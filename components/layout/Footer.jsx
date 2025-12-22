import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer({ onSubscribe }) {
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
        allRightsReserved: '© Unicorn. All rights reserved',
        emailError: 'Please provide a valid email address'
      },
      zh: {
        joinWaitlist: '加入候补名单',
        quickLinks: '快速链接',
        features: '功能特点',
        faq: '常见问题',
        enterEmail: '在此输入您的邮箱',
        productOf: '产品由',
        allRightsReserved: '© Unicorn. 保留所有权利',
        emailError: '请提供有效的电子邮箱地址'
      }
    }
  };
  
  const t = translations.footerText[language === 'zh' ? 'zh' : 'en'];
  
  const handleFooterSubmit = (e) => {
    e.preventDefault();
    setFooterStatus({ message: '', type: '' }); // 重置状态
    
    if (!footerEmail || !footerEmail.includes('@')) {
      setFooterStatus({
        message: t.emailError,
        type: 'error'
      });
      return;
    }
    
    if (onSubscribe) {
      // 使用回调函数处理订阅，并传入状态更新函数
      onSubscribe(footerEmail, setFooterStatus);
      setFooterEmail(''); // 清空输入框
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
    <footer className="py-12 md:py-16 relative z-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Logo and Contact */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/assets/logo_horizontal_white_eng.svg" alt="Unicorn Logo" className="h-14" decoding="async" />
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {footerT.tagline}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <a href="mailto:support@unicornblocks.ai" className="hover:text-[#7d9ed4] transition-colors" target="_blank" rel="noopener">support@unicornblocks.ai</a>
            </p>
          </div>

          {/* Let's be friends ! */}
          <div>
            <h3 className="font-semibold mb-4" style={{position: 'relative', top: '20px'}}>{footerT.joinMagicList}</h3>
            <div className="flex items-end gap-0" style={{ transform: 'translateY(-25px)' }}>
              <div className="flex-1" style={{ maxWidth: '427px', transform: 'translateY(-23px)' }}>
                <input
                  type="email"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  placeholder="Enter email address..."
                  className="w-full px-0 py-2 border-0 border-b-2 border-gray-300 focus:outline-none focus:border-[#7d9ed4] bg-transparent text-sm placeholder-gray-400"
                  style={{ borderRadius: 0 }}
                />
              </div>
              <Link 
                href="/reserve-vip-spot"
                className="relative flex items-center justify-center transition-all hover:opacity-80"
                style={{ width: '120px', height: '120px' }}
              >
                <img 
                  src="/assets/ima/Group 82.svg" 
                  alt="Notify at Launch" 
                  className="w-full h-full object-contain"
                  style={{ position: 'relative', zIndex: 1 }}
                />
                <span 
                  className="absolute font-bold text-center whitespace-nowrap"
                  style={{ 
                    color: '#54545C',
                    fontSize: '12px',
                    lineHeight: '0.8',
                    bottom: '34px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 2
                  }}
                >
                  Notify at Launch
                </span>
              </Link>
            </div>
            {footerStatus.message && (
              <div className={`text-sm mt-2 ${
                footerStatus.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {footerStatus.message}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">{t.productOf}</span>
            <img src="/assets/logo_horizontal_white_eng.svg" alt="Unicorn Logo" className="h-6" decoding="async" />
          </div>
          <p className="text-sm text-gray-600">{t.allRightsReserved}</p>
          <div className="flex gap-4 text-sm">
            <Link href="/terms" className="text-gray-600 hover:text-[#7d9ed4] transition-colors">
              {footerT.terms}
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/privacy" className="text-gray-600 hover:text-[#7d9ed4] transition-colors">
              {footerT.privacy}
            </Link>
          </div>
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