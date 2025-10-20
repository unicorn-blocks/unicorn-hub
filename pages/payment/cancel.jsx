import { useRouter } from 'next/router';
import Head from 'next/head';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { useLanguage } from '../../context/LanguageContext';
import { safeApiCall } from '../../lib/api';

export default function PaymentCancel() {
  const router = useRouter();
  const { language } = useLanguage();

  // 硬编码中英文内容
  const translations = {
    en: {
      title: 'Payment Cancelled!',
      subtitle: 'You can try again anytime',
      message: 'Your payment was cancelled. No charges have been made to your account.',
      reason: 'Why was the payment cancelled?',
      reasons: [
        'You clicked the cancel button',
        'Payment session expired',
        'Technical issues occurred',
        'You decided to change your mind'
      ],
      nextSteps: 'What would you like to do?',
      tryAgain: 'Try Again',
      backToHome: 'Back to Home',
      emailError: 'Please provide a valid email address',
      subscribeSuccess: 'Thank you for subscribing!',
      subscribeFailed: 'Subscription failed, please try again later',
      connectionError: 'Error connecting to server, please try again later'
    },
    zh: {
      title: '支付已取消！',
      subtitle: '您可以随时重试',
      message: '您的支付已被取消。您的账户没有被扣费。',
      reason: '为什么支付被取消了？',
      reasons: [
        '您点击了取消按钮',
        '支付会话已过期',
        '发生了技术问题',
        '您决定改变主意'
      ],
      nextSteps: '您想要做什么？',
      tryAgain: '重新支付',
      backToHome: '返回首页',
      emailError: '请提供有效的电子邮箱地址',
      subscribeSuccess: '感谢您的订阅！',
      subscribeFailed: '订阅失败，请稍后再试',
      connectionError: '连接服务器错误，请稍后再试'
    }
  };

  const t = translations[language] || translations.en;

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

  return (
    <>
      <Head>
        <title>{t.title} - Unicorn Blocks</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Navigation />
      
      <div className="background-gradient"></div>
      <main className="min-h-screen">
        <section className="hero-section relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* 取消图标 */}
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-10 h-10 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>

              {/* 标题 */}
              <p className="text-[clamp(1.2rem,4vw,2rem)] text-gray-600 mb-8">{t.title}{language === 'zh' ? '' : ' '}{t.subtitle}</p>
              
              {/* 取消消息 */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto mb-8 shadow-lg">
                <p className="text-lg text-gray-800">{t.message}</p>
              </div>

              {/* 取消原因 */}
              <div className="max-w-4xl mx-auto mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">{t.reason}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {t.reasons.map((reason, index) => (
                    <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                          <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/buy')}
                  className="primary-button duration-200"
                >
                  {t.tryAgain}
                </button>

                <button
                  onClick={() => router.push('/')}
                  className="primary-button duration-200"
                >
                  {t.backToHome}
                </button>
              </div>
            </div>
          </div>
        </section>

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

        /* 导航样式已移至全局样式文件 */

        .section-spacing {
          padding-top: 4rem;
          padding-bottom: 4rem;
        }

        .hero-section {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 180px;
          padding-bottom: 100px;
        }

        @media (min-width: 1920px) {
          .nav-container {
            max-width: 1530px;
          }
        }

        .primary-button {
          padding: 0.75rem 2rem;
          background: linear-gradient(90deg, #F7AEBF 0%, #9b90da 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .primary-button:hover {
          background: linear-gradient(90deg, #72BCA3 0%, #9b90da 100%);
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
}
