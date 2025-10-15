import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="nav-wrapper">
      <div className="nav-container navbar">
        <div className="py-0 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/assets/logo_horizontal_white_eng.svg" alt="Unicorn Logo" className="h-12" />
          </Link>
          
          {/* 桌面端导航 */}
          <div className="hidden md:flex items-center mr-auto ml-6">
            <Link href="/features" className="nav-item text-black hover:text-[#7d9ed4] transition-colors">
              {language === 'en' ? 'Features' : '功能特点'}
            </Link>
            <Link href="/faq" className="nav-item text-black hover:text-[#7d9ed4] transition-colors">
              {language === 'en' ? 'FAQ' : '常见问题'}
            </Link>
            <Link href="/shop" className="nav-item text-black hover:text-[#7d9ed4] transition-colors">
              {language === 'en' ? 'Shop Now' : '立即购买'}
            </Link>
            <a href="mailto:support@unicorntoy.ai" target="_blank" className="text-black hover:text-[#7d9ed4] transition-colors">
              {language === 'en' ? 'Contact Us' : '联系我们'}
            </a>
          </div>
          
          {/* 语言切换按钮 */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center text-black hover:text-[#7d9ed4] transition-colors mr-4 focus:outline-none"
            aria-label="切换语言"
          >
            <img src="/assets/Translate.svg" alt="语言切换" className="w-5 h-5 mr-1" />
          </button>
          
          {/* 移动端汉堡菜单按钮 */}
          <button 
            className="md:hidden flex items-center p-2" 
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
          <div className="md:hidden py-4 flex flex-col space-y-4 absolute right-0 bg-white rounded-lg shadow-lg p-4 mt-2 w-auto min-w-[150px]">
            <Link href="/features" className="text-black hover:text-[#7d9ed4] transition-colors whitespace-nowrap">
              {language === 'en' ? 'Features' : '功能特点'}
            </Link>
            <Link href="/faq" className="text-black hover:text-[#7d9ed4] transition-colors whitespace-nowrap">
              {language === 'en' ? 'FAQ' : '常见问题'}
            </Link>
            <Link href="/shop" className="text-black hover:text-[#7d9ed4] transition-colors whitespace-nowrap">
              {language === 'en' ? 'Shop Now' : '立即购买'}
            </Link>
            <a href="mailto:support@unicorntoy.ai" target="_blank" className="text-black hover:text-[#7d9ed4] transition-colors whitespace-nowrap">
              {language === 'en' ? 'Contact Us' : '联系我们'}
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 