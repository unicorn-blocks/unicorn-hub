import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLanguage } from '../../context/LanguageContext';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const { language, toggleLanguage } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 监听滚动事件，实现动态背景效果
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`nav-wrapper ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container navbar">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 nav-logo">
            <img src="/assets/logo_horizontal_white_eng.svg" alt="Unicorn Logo" className="h-12" />
          </Link>
          
          {/* 桌面端导航 */}
          <div className="hidden md:flex items-center mr-auto ml-8">
            <Link href="/features" className={`nav-item transition-all duration-300 font-medium ${router.pathname === '/features' ? 'text-[#7d9ed4] nav-active' : 'text-gray-700 hover:text-[#7d9ed4]'}`}>
              {language === 'en' ? 'Features' : '功能特点'}
            </Link>
            <Link href="/faq" className={`nav-item transition-all duration-300 font-medium ${router.pathname === '/faq' ? 'text-[#7d9ed4] nav-active' : 'text-gray-700 hover:text-[#7d9ed4]'}`}>
              {language === 'en' ? 'FAQ' : '常见问题'}
            </Link>
            <Link href="/pre-order" className={`nav-item transition-all duration-300 font-medium ${router.pathname === '/pre-order' ? 'text-[#7d9ed4] nav-active' : 'text-gray-700 hover:text-[#7d9ed4]'}`}>
              {language === 'en' ? 'Pre Order' : '预约购买'}
            </Link>
            <a href="mailto:support@unicornblocks.ai" target="_blank" className="nav-item text-gray-700 hover:text-[#7d9ed4] transition-all duration-300 font-medium">
              {language === 'en' ? 'Contact Us' : '联系我们'}
            </a>
          </div>
          
          {/* 预购按钮（替代语言切换） */}
          <Link 
            href="/pre-order"
            className="nav-language-btn preorder-active flex items-center transition-all duration-300 mr-4 focus:outline-none"
            aria-label={language === 'en' ? 'Pre-order' : '预购'}
          >
            <img src="/assets/shopping.svg" className="w-5 h-5" />
          </Link>
          
          {/* 移动端汉堡菜单按钮 */}
          <button 
            className="md:hidden nav-menu-btn flex items-center p-2 text-gray-700 hover:text-[#7d9ed4] transition-all duration-300" 
            onClick={toggleMenu}
            aria-label="导航菜单"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* 移动端下拉菜单 */}
        {isMenuOpen && (
          <div className="nav-mobile-menu md:hidden py-4 flex flex-col space-y-4 absolute right-0 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 mt-2 w-auto min-w-[220px] border border-white/20">
            <Link href="/pre-order" className="nav-mobile-item preorder-active transition-all duration-300 whitespace-nowrap font-medium flex items-center justify-center" aria-label={language === 'en' ? 'Pre-order' : '预购'}>
              <img src="/assets/shopping.svg" className="w-5 h-5" />
            </Link>
            <Link href="/features" className={`nav-mobile-item transition-all duration-300 whitespace-nowrap font-medium ${router.pathname === '/features' ? 'text-[#7d9ed4] nav-mobile-active' : 'text-gray-700 hover:text-[#7d9ed4]'}`}>
              {language === 'en' ? 'Features' : '功能特点'}
            </Link>
            <Link href="/faq" className={`nav-mobile-item transition-all duration-300 whitespace-nowrap font-medium ${router.pathname === '/faq' ? 'text-[#7d9ed4] nav-mobile-active' : 'text-gray-700 hover:text-[#7d9ed4]'}`}>
              {language === 'en' ? 'FAQ' : '常见问题'}
            </Link>
            <Link href="/pre-order" className={`nav-mobile-item transition-all duration-300 whitespace-nowrap font-medium ${router.pathname === '/pre-order' ? 'text-[#7d9ed4] nav-mobile-active' : 'text-gray-700 hover:text-[#7d9ed4]'}`}>
              {language === 'en' ? 'Pre Order' : '预约购买'}
            </Link>
            <a href="mailto:support@unicornblocks.ai" target="_blank" className="nav-mobile-item text-gray-700 hover:text-[#7d9ed4] transition-all duration-300 whitespace-nowrap font-medium">
              {language === 'en' ? 'Contact Us' : '联系我们'}
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 