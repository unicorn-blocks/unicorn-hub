import { createContext, useState, useContext, useEffect } from 'react';

// 创建语言上下文
const LanguageContext = createContext();

// 语言提供器组件
export function LanguageProvider({ children }) {
  // 从本地存储获取语言偏好，默认为英文
  const [language, setLanguage] = useState('en');
  
  // 首次加载时检查本地存储
  useEffect(() => {
    // const savedLanguage = localStorage.getItem('language');
    // if (savedLanguage) {
    //   setLanguage(savedLanguage);
    // }
    // 强制使用英文，无视本地存储中的任何偏好
    localStorage.setItem('language', 'en');
    setLanguage('en');
  }, []);

  // 切换语言的函数
  const toggleLanguage = () => {
    // const newLanguage = language === 'en' ? 'zh' : 'en';
    // setLanguage(newLanguage);
    // localStorage.setItem('language', newLanguage);
    // 保持为英文，不执行真正的切换
    setLanguage('en');
    localStorage.setItem('language', 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// 创建一个自定义钩子，方便组件使用语言上下文
export function useLanguage() {
  return useContext(LanguageContext);
} 