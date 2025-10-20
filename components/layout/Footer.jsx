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

  return (
    <footer className="bg-white section-spacing">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo and Contact */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/assets/logo_horizontal_white_eng.svg" alt="Unicorn Logo" className="h-10" />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              <a href="mailto:support@unicornblocks.ai" className="hover:text-[#7d9ed4] transition-colors" target="_blank" rel="noopener">support@unicornblocks.ai</a>
            </p>
            <div className="flex gap-4">
              <a href="https://www.tiktok.com/@unicorntoyworld" className="text-gray-600 hover:text-[#7d9ed4]">
                <svg width="30" height="30" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M24.3735 47.7153C37.2736 47.7153 47.7311 37.2577 47.7311 24.3576C47.7311 11.4576 37.2736 1 24.3735 1C11.4734 1 1.01587 11.4576 1.01587 24.3576C1.01587 37.2577 11.4734 47.7153 24.3735 47.7153Z" stroke="#0A142F" strokeWidth="2.00208"/>
                  <path d="M22.6949 21.57C19.7506 21.4279 17.704 22.4777 16.5551 24.7192C14.8317 28.0815 16.256 33.5833 22.0053 33.5833C27.7546 33.5833 27.9209 28.0277 27.9209 27.4457C27.9209 27.0577 27.9209 24.8882 27.9209 20.9373C29.1506 21.7162 30.1874 22.185 31.0313 22.3439C31.8752 22.5027 32.4116 22.5731 32.6407 22.555V19.3172C31.8602 19.2231 31.1852 19.0437 30.6157 18.7791C29.7615 18.3822 28.0677 17.2806 28.0677 15.666C28.0689 15.6739 28.0689 15.2575 28.0677 14.4166H24.5087C24.4981 22.3247 24.4981 26.6677 24.5087 27.4457C24.5246 28.6128 23.6193 30.2453 21.7836 30.2453C19.948 30.2453 19.0426 28.6141 19.0426 27.562C19.0426 26.9179 19.2639 25.9843 20.1784 25.2929C20.7208 24.8829 21.4735 24.7192 22.6949 24.7192C22.6949 24.3414 22.6949 23.2917 22.6949 21.57Z" fill="#333333" stroke="#333333" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61574149535785" className="text-gray-600 hover:text-[#7d9ed4]">
                <svg width="30" height="30" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M24.3735 47.7154C37.2736 47.7154 47.7311 37.2578 47.7311 24.3578C47.7311 11.4577 37.2736 1.00012 24.3735 1.00012C11.4734 1.00012 1.01587 11.4577 1.01587 24.3578C1.01587 37.2578 11.4734 47.7154 24.3735 47.7154Z" stroke="#0A142F" strokeWidth="2.00208"/>
                  <path d="M30.0159 18.2998H27.6403H27.0094C26.4663 18.2998 26.026 18.7401 26.026 19.2833V22.7337H30.0159L29.4315 26.5322H26.026V33.5H21.6384V26.5322H18.0159V22.7337H21.5916L21.6384 19.1281L21.6318 18.4735C21.6098 16.3011 23.3531 14.5222 25.5256 14.5002C25.5388 14.5001 25.5521 14.5 25.5653 14.5H30.0159V18.2998Z" fill="#333333" stroke="#333333" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@Unicorn-p6p" className="text-gray-600 hover:text-[#7d9ed4]">
                <svg width="30" height="30" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M24.3576 47.7154C37.2577 47.7154 47.7153 37.2578 47.7153 24.3578C47.7153 11.4577 37.2577 1.00012 24.3576 1.00012C11.4576 1.00012 1 11.4577 1 24.3578C1 37.2578 11.4576 47.7154 24.3576 47.7154Z" stroke="#0A142F" strokeWidth="2.00208"/>
                  <path d="M17.5318 17.2072C20.3034 17.0691 22.4591 17 23.999 17C25.539 17 27.6955 17.0691 30.4685 17.2073C31.9695 17.2821 33.1836 18.4559 33.3088 19.9536C33.4356 21.4706 33.499 22.8067 33.499 23.9619C33.499 25.1313 33.434 26.486 33.3041 28.0261C33.1793 29.5052 31.9916 30.6706 30.5105 30.7675C28.1398 30.9225 25.9693 31 23.999 31C22.029 31 19.8593 30.9225 17.4899 30.7675C16.0093 30.6707 14.8218 29.506 14.6964 28.0275C14.5648 26.4759 14.499 25.1207 14.499 23.9619C14.499 22.817 14.5633 21.4805 14.6917 19.9522C14.8176 18.4551 16.0314 17.282 17.5318 17.2072Z" fill="#333333" stroke="#333333" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M22.5 21.8046V26.203C22.5 26.4397 22.6919 26.6316 22.9285 26.6316C23.0126 26.6316 23.0948 26.6069 23.1649 26.5606L26.4637 24.3803C26.6612 24.2498 26.7154 23.9839 26.5849 23.7864C26.5537 23.7392 26.5135 23.6987 26.4665 23.6671L23.1677 21.449C22.9713 21.3169 22.705 21.3691 22.5729 21.5655C22.5254 21.6362 22.5 21.7194 22.5 21.8046Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t.quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-gray-600 hover:text-[#7d9ed4]">
                  {t.features}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-[#7d9ed4]">
                  {t.faq}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-sm text-gray-600 mr-2">{t.productOf}</span>
            <img src="/assets/logo_horizontal_white_eng.svg" alt="Unicorn Logo" className="h-6" />
          </div>
          <p className="text-sm text-gray-600">{t.allRightsReserved}</p>
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