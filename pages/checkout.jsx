import { useState } from 'react';
import Head from 'next/head';
import { safeApiCall } from '../lib/api';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function Checkout() {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Paypal');
  const [formStatus, setFormStatus] = useState({ message: '', type: '' });
  
  // 硬编码中英文内容
  const translations = {
    en: {
      title: 'Checkout - Unicorn Blocks',
      pageTitle: 'Complete Your VIP Reservation',
      subtitle: 'Secure your spot with a $10 deposit. Pay the remaining $119 when we ship.',
      emailLabel: 'Enter your email address',
      emailPlaceholder: 'your.email@example.com',
      paymentMethodLabel: 'Choose Payment Method',
      paypalButton: 'Pay with Paypal',
      payoneerButton: 'Pay with Payoneer',
      processing: 'Processing payment...',
      ctaButton: 'Complete Reservation',
      trustNote: '✔ Fully Refundable $10 Deposit · ✔ Limited to 500 Families (Only 436 out 500 left) · ✔ Safe Checkout',
      emailError: 'Please enter a valid email address',
      paymentError: 'Please choose a payment method',
      paymentSuccess: 'Awesome! Check your email for confirmation.',
      paymentFailed: 'Something went wrong. Please try again.',
      connectionError: 'Can\'t connect to server. Please try again.',
      paypalRedirectMessage: 'Taking you to PayPal...',
      payoneerRedirectMessage: 'Opening Payoneer in a new tab...',
      redirecting: 'Redirecting...',
      pricing: {
        title: 'Pricing Breakdown',
        now: 'Pay Now: $10',
        later: 'Pay Later: $119',
        total: 'Total: $129 (Save $70!)',
        original: 'Retail Price: $199',
        limitedOffer: '🎉 Limited VIP — 500 Families'
      }
    },
    zh: {
      title: '结账 - 独角兽积木',
      pageTitle: '完成您的VIP预订',
      subtitle: '支付$10订金锁定名额。发货时支付剩余$119。',
      emailLabel: '输入您的电子邮箱地址',
      emailPlaceholder: 'your.email@example.com',
      paymentMethodLabel: '选择支付方式',
      paypalButton: '使用Paypal支付',
      payoneerButton: '使用Payoneer支付',
      processing: '正在处理支付...',
      ctaButton: '完成预订',
      trustNote: '✔ $10订金可随时全额退款 · ✔ 仅限500个家庭（仅剩436/500）· ✔ 安全支付',
      emailError: '请输入有效的邮箱地址',
      paymentError: '请选择支付方式',
      paymentSuccess: '太棒了！请查看邮箱确认信息。',
      paymentFailed: '出了点问题，请重试一下。',
      connectionError: '连接不上服务器，请重试一下。',
      paypalRedirectMessage: '正在跳转到PayPal...',
      payoneerRedirectMessage: '正在新标签页打开Payoneer...',
      redirecting: '正在跳转...',
      pricing: {
        title: '价格明细',
        now: '现在支付：$10',
        later: '稍后支付：$119',
        total: '总计：$129（立省$70！）',
        original: '零售价：$199',
        limitedOffer: '🎉 VIP限量 — 500个家庭'
      }
    }
  };
  
  // 根据当前语言选择正确的翻译
  const t = translations[language] || translations.en;
  const trustItems = (t.trustNote || '').split('·').map((s) => s.trim()).filter(Boolean);
  const trustLine = trustItems.join(' · ');
  
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
    
    if (!paymentMethod) {
      setFormStatus({
        message: t.paymentError,
        type: 'error'
      });
      return;
    }
    
    // Show loading state
    setIsProcessing(true);
    
    // 调用支付API
    safeApiCall('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        email,
        paymentMethod,
        amount: 10,
        language
      })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
          // 根据支付方式显示不同的消息
          if (paymentMethod === 'Paypal') {
            setFormStatus({
              message: t.paypalRedirectMessage,
              type: 'success'
            });
            
            // PayPal: 直接重定向到支付页面
            if (data.paymentUrl) {
              setTimeout(() => {
                window.location.href = data.paymentUrl;
              }, 800);
              
              // 跳转后自动关闭通知
              setTimeout(() => {
                setFormStatus({ message: '', type: '' });
              }, 3000);
            }
          } else if (paymentMethod === 'Payoneer') {
            setFormStatus({
              message: t.payoneerRedirectMessage,
              type: 'success'
            });
            
            // Payoneer: 在新标签页中打开支付页面
            if (data.paymentUrl) {
              setTimeout(() => {
                window.open(data.paymentUrl, '_blank');
              }, 1000);
              
              // 跳转后自动关闭通知
              setTimeout(() => {
                setFormStatus({ message: '', type: '' });
              }, 3500);
            }
          } else {
            // 其他情况显示通用成功消息
            setFormStatus({
              message: data.message || t.paymentSuccess,
              type: 'success'
            });
          }
      } else {
        // Show error message - always use frontend localized message
        setFormStatus({
          message: t.paymentFailed,
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
      setIsProcessing(false);
    });
  };

  // 从页脚提交的处理函数
  const handleFooterSubmit = (footerEmail, setFooterStatus) => {
    // 设置 email 状态并触发表单提交
    setEmail(footerEmail);
    
    // Show loading state
    setIsProcessing(true);
    
    // 使用 safeApiCall 发送请求
    safeApiCall('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        email: footerEmail,
        language
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // 不仅更新主表单状态，也更新页脚状态
        setFormStatus({
          message: data.message || 'Thank you for subscribing!',
          type: 'success'
        });
        
        if (setFooterStatus) {
          setFooterStatus({
            message: data.message || 'Thank you for subscribing!',
            type: 'success'
          });
        }
      } else {
        // 更新错误状态
        setFormStatus({
          message: data.error || 'Subscription failed, please try again later',
          type: 'error'
        });
        
        if (setFooterStatus) {
          setFooterStatus({
            message: data.error || 'Subscription failed, please try again later',
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
      setIsProcessing(false);
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
      <main className="min-h-screen pt-48 px-4 pb-24">
        <div className="buy-container">
          {/* 页面标题 */}
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-3">{t.pageTitle}</h1>
            <p className="text-lg text-gray-600">{t.subtitle}</p>
          </div>

          {/* 支付表单和价格明细 */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-10 max-w-5xl mx-auto mb-10">
            {/* 左侧：支付表单 */}
            <div className="payment-form-container surface-card">
              <form id="payment-form" onSubmit={handleSubmit} className="payment-form-content">
                {/* 邮箱输入 */}
                <div className="mb-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.emailLabel}
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    className="payment-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    required
                    disabled={isProcessing}
                    onInvalid={(e) => {
                      e.preventDefault();
                      setFormStatus({
                        message: t.emailError,
                        type: 'error'
                      });
                    }}
                  />
                  {formStatus.type === 'error' && formStatus.message && (
                    <div className="validation-message error mt-2">
                      {formStatus.message}
                    </div>
                  )}
                </div>

                {/* 支付方式选择 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.paymentMethodLabel}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="payment-method-option">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="Paypal"
                        checked={paymentMethod === 'Paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={isProcessing}
                        className="sr-only"
                      />
                      <div className={`payment-method-card ${paymentMethod === 'Paypal' ? 'selected' : ''}`}>
                        <div className="flex items-center justify-center">
                          <img src="/assets/paypal-logo.svg" alt="Paypal" className="w-6 h-6 mr-2" />
                          <span className="font-medium text-sm">{t.paypalButton}</span>
                        </div>
                      </div>
                    </label>
                    
                    <label className="payment-method-option">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="Payoneer"
                        checked={paymentMethod === 'Payoneer'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={isProcessing}
                        className="sr-only"
                      />
                      <div className={`payment-method-card ${paymentMethod === 'Payoneer' ? 'selected' : ''}`}>
                        <div className="flex items-center justify-center">
                          <img src="/assets/payoneer-logo.svg" alt="Paypal" className="w-6 h-6 mr-2" />
                          <span className="font-medium text-sm">{t.payoneerButton}</span>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 提交按钮 */}
                <button 
                  type="submit" 
                  className="payment-button button-shine"
                  disabled={isProcessing}
                >
                  {isProcessing ? t.processing : t.ctaButton}
                </button>
                {trustItems.length > 0 && (
                  <div className="trust-ticker" role="note" aria-label="payment assurances">
                    <div className="ticker-viewport">
                      <div className="ticker-track">
                        <span className="ticker-text">{trustLine} · {trustLine}</span>
                      </div>
                    </div>
                  </div>
                )}
              </form>

            </div>

            {/* 右侧：价格明细 */}
            <div className="pricing-card glass-up surface-card">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{t.pricing.title}</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-[#7D9ED4] to-[#F7AEBF] mx-auto rounded-full"></div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <span className="text-gray-700 font-medium">{t.pricing.now}</span>
                  <span className="font-bold text-green-600 text-lg">$10</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">{t.pricing.later}</span>
                  <span className="font-semibold text-gray-700">$119</span>
                </div>
                
                <div className="border-t-2 border-dashed border-gray-300 my-4"></div>
                
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                    <div>
                      <span className="text-lg font-bold text-gray-800">{t.pricing.total}</span>
                      <div className="text-sm text-blue-600 font-medium">{t.pricing.limitedOffer}</div>
                    </div>
                    <span className="font-bold text-blue-600 text-xl">$129</span>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full">
                      <span className="text-sm text-gray-500 line-through mr-2">{t.pricing.original}</span>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 浮动通知 */}
      {formStatus.type === 'success' && formStatus.message && (
        <div className="floating-notification">
          <div className="notification-content">
            <div className="notification-header">
              <div className="notification-icon">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <button 
                className="notification-close"
                onClick={() => setFormStatus({ message: '', type: '' })}
                aria-label="Close notification"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="notification-text">
              <div className="notification-title">{t.redirecting}</div>
              <div className="notification-message">{formStatus.message}</div>
            </div>
            <div className="notification-progress">
              <div className="progress-bar"></div>
            </div>
          </div>
        </div>
      )}

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

        .buy-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .payment-form-container {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          box-shadow: none;
          padding: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .payment-form-content {
          width: 100%;
          max-width: 400px;
        }

        @media (max-width: 1024px) {
          .buy-container {
            padding: 0 1rem;
          }
          
          .payment-form-container {
            padding: 2rem;
            min-height: 380px;
          }
          
          .pricing-card {
            padding: 2rem;
          }
        }

        @media (max-width: 768px) {
          .buy-container {
            padding: 0 1rem;
          }
          
          .payment-form-container {
            padding: 1.5rem;
            min-height: auto;
            align-items: flex-start;
          }
          
          .payment-form-content {
            max-width: none;
          }
          
          .pricing-card {
            padding: 1.5rem;
          }
        }

        .payment-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .payment-input:focus {
          outline: none;
          border-color: #7d9ed4;
          box-shadow: 0 0 0 3px rgba(125, 158, 212, 0.2);
        }

        .payment-method-option {
          cursor: pointer;
        }

        .payment-method-card {
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          transition: all 0.2s ease;
          background: white;
          min-height: 60px;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .payment-method-card:hover {
          border-color: #7d9ed4;
          box-shadow: 0 2px 8px rgba(125, 158, 212, 0.15);
          transform: translateY(-1px);
        }

        .payment-method-card.selected {
          border-color: #7d9ed4;
          background: rgba(125, 158, 212, 0.08);
          box-shadow: 0 0 0 3px rgba(125, 158, 212, 0.25);
          transform: translateY(-1px);
        }

        .payment-button {
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

        .button-shine {
          position: relative;
          overflow: hidden;
        }

        .button-shine::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -30%;
          width: 50%;
          height: 200%;
          transform: rotate(25deg);
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.5) 50%, rgba(255,255,255,0) 100%);
          transition: all .5s ease;
        }

        .button-shine:hover::after {
          left: 120%;
        }

        .payment-button:hover:not(:disabled) {
          background: linear-gradient(90deg, #F7AEBF 0%, #9b90da 100%);
          transform: none;
          filter: none;
        }

        .payment-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .pricing-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          box-shadow: none;
          padding: 2.5rem;
        }

        .glass-up {
          background: rgba(255,255,255,0.8);
          border: 1px solid rgba(255,255,255,0.5);
          box-shadow: none;
        }

        /* 统一卡片底部样式：背景与边框 */
        .surface-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.86) 100%);
          border: 1px solid rgba(229, 231, 235, 0.45);
          box-shadow: none;
        }

        .validation-message {
          padding: 0.75rem 1rem;
          border-radius: 12px;
          margin-top: 0.5rem;
          text-align: left;
          font-size: 0.875rem;
          font-weight: 500;
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .validation-message.success {
          color: #059669;
          background-color: rgba(209, 250, 229, 0.9);
          border: 1px solid rgba(5, 150, 105, 0.3);
        }

        .validation-message.error {
          color: #dc2626;
          background-color: rgba(254, 226, 226, 0.9);
          border: 1px solid rgba(220, 38, 38, 0.3);
        }

        .validation-message::before {
          content: '';
          width: 16px;
          height: 16px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .validation-message.success::before {
          background-color: #059669;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 20 20'%3E%3Cpath fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/%3E%3C/svg%3E");
          background-size: 12px;
          background-position: center;
          background-repeat: no-repeat;
        }

        .validation-message.error::before {
          background-color: #dc2626;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 20 20'%3E%3Cpath fill-rule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clip-rule='evenodd'/%3E%3C/svg%3E");
          background-size: 12px;
          background-position: center;
          background-repeat: no-repeat;
        }

        /* 浮动通知样式 */
        .floating-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          animation: slideInRight 0.3s ease-out;
        }

        .notification-content {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          min-width: 320px;
          max-width: 400px;
        }

        .notification-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .notification-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
        }

        .notification-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .notification-close:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .notification-close:active {
          transform: scale(0.95);
        }

        .notification-text {
          margin-bottom: 0.75rem;
        }

        .notification-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .notification-message {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .notification-progress {
          height: 3px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 2px;
          animation: progressAnimation 3s ease-out forwards;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes progressAnimation {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        /* 移动端适配 */
        @media (max-width: 768px) {
          .floating-notification {
            top: 10px;
            right: 10px;
            left: 10px;
          }
          
          .notification-content {
            min-width: auto;
            max-width: none;
          }
        }

        @media (max-width: 768px) {
          .buy-container {
            padding: 1rem;
          }
          
          .payment-form-container, .pricing-card {
            padding: 1.5rem;
          }

          .payment-method-card {
            padding: 0.5rem;
            min-height: 50px;
          }

          .payment-method-card span {
            font-size: 0.75rem;
          }
        }

        /* 信任提示：细长信息条（跑马灯式，单行不卡断） */
        .trust-ticker {
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.85rem;
        }
        .ticker-viewport {
          max-width: 100%;
          overflow: hidden;
        }
        .ticker-track {
          display: inline-block;
          white-space: nowrap;
          animation: tickerMove 36s linear infinite;
        }
        .ticker-text { padding-left: 0.25rem; }
        @keyframes tickerMove {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
}
