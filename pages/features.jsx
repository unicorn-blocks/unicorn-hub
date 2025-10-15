import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { marked } from 'marked';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import { useLanguage } from '../context/LanguageContext';
import { safeApiCall } from '../lib/api';

export default function Features() {
  const { language } = useLanguage();
  const [tableOfContents, setTableOfContents] = useState([]);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('');
  const contentRef = useRef(null);
  const headingsRef = useRef([]);

  // 订阅处理函数
  const handleFooterSubmit = (email, setFooterStatus) => {
    if (!email || !email.includes('@')) {
      if (setFooterStatus) {
        setFooterStatus({
          message: t.emailError,
          type: 'error'
        });
      }
      return;
    }
    
    safeApiCall('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email,
        language   // 添加语言参数
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        if (setFooterStatus) {
          setFooterStatus({
            message: data.message || t.subscribeSuccess,
            type: 'success'
          });
        }
      } else {
        if (setFooterStatus) {
          setFooterStatus({
            message: data.message || t.subscribeFailed,
            type: 'error'
          });
        }
      }
    })
    .catch(error => {
      console.error('Error:', error);
      if (setFooterStatus) {
        setFooterStatus({
          message: t.connectionError,
          type: 'error'
        });
      }
    });
  };

  useEffect(() => {
    async function loadContent() {
      try {
        setIsLoading(true);
        
        // 根据当前语言加载不同的 markdown 文件
        const fileName = language === 'zh' ? '/features-zh.md' : '/features.md';
        const response = await fetch(fileName);
        
        if (!response.ok) {
          // 如果中文版不存在，则回退到英文版
          if (language === 'zh') {
            const enResponse = await fetch('/features.md');
            if (enResponse.ok) {
              const markdown = await enResponse.text();
              setContent(markdown);
              setIsLoading(false);
              return;
            }
          }
          throw new Error(`Failed to load features content: ${response.status}`);
        }
        
        const markdown = await response.text();
        setContent(markdown);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading features content:', err);
        setError(err.message);
        setIsLoading(false);
      }
    }
    
    loadContent();
  }, [language]); // 语言变化时重新加载内容

  // 处理内容和生成目录
  useEffect(() => {
    if (!content || !contentRef.current) return;
    
    // 使用一个临时div来解析HTML并提取标题
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = marked(content);
    
    const headings = tempDiv.querySelectorAll('h2');
    const toc = Array.from(headings).map((heading, index) => {
      const id = `section-${index}`;
      heading.id = id;
      return {
        id,
        text: heading.textContent,
      };
    });
    
    setTableOfContents(toc);
    
    // 使用dangerouslySetInnerHTML设置内容
    contentRef.current.innerHTML = tempDiv.innerHTML;
    
    // 缓存标题引用以便滚动监听
    headingsRef.current = Array.from(contentRef.current.querySelectorAll('h2'));
  }, [content]);

  // 设置滚动监听
  useEffect(() => {
    if (!contentRef.current || tableOfContents.length === 0) return;
    
    function onScroll() {
      const scrollPosition = window.scrollY;
      
      // 查找当前可见的标题
      for (let i = 0; i < headingsRef.current.length; i++) {
        const section = headingsRef.current[i];
        const nextSection = headingsRef.current[i + 1];
        
        if (
          section.offsetTop - 150 <= scrollPosition && 
          (!nextSection || nextSection.offsetTop - 150 > scrollPosition)
        ) {
          setActiveSection(section.id);
          break;
        }
      }
    }
    
    window.addEventListener('scroll', onScroll);
    // 首次加载时触发滚动事件
    setTimeout(onScroll, 100);
    
    // 清理函数
    return () => window.removeEventListener('scroll', onScroll);
  }, [tableOfContents]);

  // 处理目录点击事件
  const handleTocClick = (e, id) => {
    e.preventDefault();
    const targetElement = document.getElementById(id);
    
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 120,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  // 翻译页面标题
  const pageTitle = language === 'zh' ? '功能特点 - 独角兽玩具' : 'Features - Unicorn Toy';
  const loadingText = language === 'zh' ? '正在加载内容...' : 'Loading content...';
  const errorText = language === 'zh' ? '加载内容失败。请重试。' : 'Failed to load content. Please try again.';
  const contentsText = language === 'zh' ? '目录' : 'Contents';

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{pageTitle}</title>
      </Head>

      <div className="background-gradient"></div>
      <main className="min-h-screen">
        {/* 使用导航组件 */}
        <Navigation />

        {/* Features Section */}
        <section className="features-section">
          <div className="content-layout">
            {/* 添加目录组件 */}
            <div className="table-of-contents">
              <h3>{contentsText}</h3>
              <ul className="toc-list" id="toc-list">
                {tableOfContents.map((item) => (
                  <li key={item.id}>
                    <a 
                      href={`#${item.id}`}
                      onClick={(e) => handleTocClick(e, item.id)}
                      className={activeSection === item.id ? 'active' : ''}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="content-main">
              <div className="feature-content">
                {isLoading && (
                  <div id="loading-indicator">{loadingText}</div>
                )}
                {error && (
                  <div id="error-message" style={{ display: 'block' }}>
                    {errorText}
                  </div>
                )}
                <div 
                  ref={contentRef}
                  id="markdown-content"
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* 使用页脚组件 */}
        <Footer onSubscribe={handleFooterSubmit} />
      </main>

      <style jsx global>{`
        /* Basic styles */
        body {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          position: relative;
          min-height: 100vh;
          margin: 0;
          padding: 0;
        }
        
        .background-gradient {
          position: fixed;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          background: linear-gradient(180deg, #EBF1FF 0%, #FFEDE4 100%);
          z-index: -1;
        }

        .nav-wrapper {
          position: fixed;
          width: 100%;
          z-index: 100;
          padding: 40px;
          top: 0;
          left: 0;
        }

        .nav-container {
          max-width: 1530px;
          width: 100%;
          margin: 0 auto;
          padding-left: 40px;
          padding-right: 40px;
          border-radius: 100px;
          background-color: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
        }

        .navbar {
          font-family: 'Jost', sans-serif;
        }

        .nav-item {
          margin-right: 24px;
        }

        .section-spacing {
          padding-top: 4rem;
          padding-bottom: 4rem;
        }

        .features-section {
          padding-top: 160px;
          padding-bottom: 4rem;
          padding-left: 40px;
          padding-right: 40px;
        }

        /* 调整内容布局 */
        .content-layout {
          display: flex;
          gap: 100px; /* 增加间距 */
          max-width: 1200px;
          margin: 0 auto;
        }

        .content-main {
          flex: 1;
          max-width: 800px;
        }

        /* Markdown content styles */
        .feature-content {
          max-width: 100%;
          overflow-x: hidden;
        }

        .feature-content img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 2rem 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .feature-content h2 {
          font-size: 2rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0rem 0 1.5rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .feature-content h2 strong {
          color: #72BCA3;
        }

        .feature-content p {
          font-size: 1.125rem;
          line-height: 1.75;
          color: #4a4a4a;
          margin: 1.25rem 0;
        }

        .feature-content ul {
          list-style-type: none;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
        }

        .feature-content li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
          font-size: 1.125rem;
          line-height: 1.75;
          color: #4a4a4a;
        }

        .feature-content li:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #72BCA3;
          font-weight: bold;
        }

        .feature-content em {
          color: #72BCA3;
          font-style: normal;
          font-weight: 500;
        }

        .feature-content strong {
          color: #333;
          font-weight: 600;
        }

        #loading-indicator {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        #error-message {
          text-align: center;
          padding: 2rem;
          color: #ef4444;
          display: none;
        }

        @media (min-width: 1920px) {
          .nav-container {
            max-width: 1530px;
          }
        }

        /* 修改目录样式 */
        .table-of-contents {
          position: sticky; /* 改为sticky定位 */
          top: 160px;
          width: 250px;
          height: fit-content;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-height: calc(100vh - 200px);
          overflow-y: auto;
          flex-shrink: 0; /* 防止目录被压缩 */
        }

        .table-of-contents h3 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #333;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .toc-list li {
          margin-bottom: 0.5rem;
        }

        .toc-list a {
          color: #666;
          text-decoration: none;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          display: block;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .toc-list a:hover {
          color: #72BCA3;
          background: rgba(114, 188, 163, 0.1);
        }

        .toc-list a.active {
          color: #72BCA3;
          background: rgba(114, 188, 163, 0.1);
          font-weight: 500;
        }

        @media (max-width: 1400px) {
          .table-of-contents {
            display: none;
          }
          .content-layout {
            gap: 0;
          }
          .content-main {
            margin: 0 auto;
          }
        }
      `}</style>
    </>
  );
} 