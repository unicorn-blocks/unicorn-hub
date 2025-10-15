import { useState } from 'react';
import Head from 'next/head';
import { safeApiCall } from '../lib/api';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function ShopNew() {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ message: '', type: '' });
  
  // 硬编码中英文内容
  const translations = {
    en: {
      title: 'Subscribe - Unicorn Toy',
      joinWaitlist: 'Join Our Waitlist',
      beFirst: 'Be the first to know when Unicorn Toy becomes available!',
      enterEmail: 'Enter your email address',
      buttonText: 'Join Waitlist',
      processing: 'Processing...',
      emailError: 'Please provide a valid email address',
      subscribeSuccess: 'Thank you for subscribing! We will keep you updated.',
      subscribeFailed: 'Subscription failed, please try again later',
      connectionError: 'Error connecting to server, please try again later'
    },
    zh: {
      title: '订阅 - 独角兽玩具',
      joinWaitlist: '加入我们的候补名单',
      beFirst: '成为第一个知道独角兽玩具开售的人！',
      enterEmail: '输入您的电子邮箱地址',
      buttonText: '加入候补名单',
      processing: '处理中...',
      emailError: '请提供有效的电子邮箱地址',
      subscribeSuccess: '感谢您的订阅！我们会及时通知您最新消息。',
      subscribeFailed: '订阅失败，请稍后再试',
      connectionError: '连接服务器错误，请稍后再试'
    }
  };
  
  // 根据当前语言选择正确的翻译
  const t = translations[language] || translations.en;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset status
    setFormStatus({ message: '', type: '' });
    
    // Form validation
    if (!email || !email.includes('@')) {
      setFormStatus({
        message: t.emailError,
        type: 'error'
      });
      return;
    }
    
    // Show loading state
    setIsSubmitting(true);
    
    // 使用 safeApiCall 而不是直接使用 fetch
    safeApiCall('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        email,
        language   // 添加语言参数
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Show success message
        setFormStatus({
          message: data.message || t.subscribeSuccess,
          type: 'success'
        });
        setEmail(''); // Clear input
      } else {
        // Show error message
        setFormStatus({
          message: data.error || t.subscribeFailed,
          type: 'error'
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setFormStatus({
        message: t.connectionError,
        type: 'error'
      });
    })
    .finally(() => {
      // Restore button state
      setIsSubmitting(false);
    });
  };

  // 从页脚提交的处理函数
  const handleFooterSubmit = (footerEmail, setFooterStatus) => {
    // 设置 email 状态并触发表单提交
    setEmail(footerEmail);
    
    // Show loading state
    setIsSubmitting(true);
    
    // 使用 safeApiCall 发送请求
    safeApiCall('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        email: footerEmail,
        language   // 添加语言参数
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // 不仅更新主表单状态，也更新页脚状态
        setFormStatus({
          message: data.message || t.subscribeSuccess,
          type: 'success'
        });
        
        if (setFooterStatus) {
          setFooterStatus({
            message: data.message || t.subscribeSuccess,
            type: 'success'
          });
        }
      } else {
        // 更新错误状态
        setFormStatus({
          message: data.error || t.subscribeFailed,
          type: 'error'
        });
        
        if (setFooterStatus) {
          setFooterStatus({
            message: data.error || t.subscribeFailed,
            type: 'error'
          });
        }
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setFormStatus({
        message: t.connectionError,
        type: 'error'
      });
      
      if (setFooterStatus) {
        setFooterStatus({
          message: t.connectionError,
          type: 'error'
        });
      }
    })
    .finally(() => {
      // Restore button state
      setIsSubmitting(false);
    });
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{t.title}</title>
      </Head>

      <div className="background-gradient"></div>
      
      {/* 使用导航组件 */}
      <Navigation />

      {/* Main Content */}
      <main className="min-h-[calc(100vh-300px)] pt-48 px-4">
        <div className="subscribe-container">
          <h1 className="text-3xl font-bold text-center mb-6">{t.joinWaitlist}</h1>
          <p className="text-gray-600 text-center mb-8">{t.beFirst}</p>
          
          <form id="subscribe-form" onSubmit={handleSubmit}>
            <input 
              type="email" 
              id="email" 
              className="subscribe-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.enterEmail}
              required
              disabled={isSubmitting}
            />
            <button 
              type="submit" 
              className="subscribe-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? t.processing : t.buttonText}
            </button>
          </form>

          {formStatus.message && (
            <div className={formStatus.type === 'success' ? 'success-message !block' : 'error-message !block'}>
              {formStatus.message}
            </div>
          )}
        </div>
      </main>

      {/* 传递订阅回调函数给 Footer */}
      <Footer onSubscribe={handleFooterSubmit} />

      <style jsx global>{`
        /* Basic styles */
        body {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          min-height: 100vh;
          margin: 0;
          padding: 0;
          position: relative;
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

        .subscribe-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .subscribe-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }

        .subscribe-input:focus {
          outline: none;
          border-color: #7d9ed4;
          box-shadow: 0 0 0 3px rgba(125, 158, 212, 0.2);
        }

        .subscribe-button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(90deg, #F7AEBF 0%, #9b90da 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .subscribe-button:hover {
          background: linear-gradient(90deg, #72BCA3 0%, #9b90da 100%);
          transform: translateY(-1px);
        }

        .success-message {
          display: none;
          color: #059669;
          background-color: #d1fae5;
          padding: 1rem;
          border-radius: 12px;
          margin-top: 1rem;
          text-align: center;
        }

        .section-spacing {
          padding-top: 4rem;
          padding-bottom: 4rem;
          margin-top: 2rem;
        }

        .error-message {
          display: none;
          color: #dc2626;
          background-color: #fee2e2;
          padding: 1rem;
          border-radius: 12px;
          margin-top: 1rem;
          text-align: center;
        }
      `}</style>
    </>
  );
} 