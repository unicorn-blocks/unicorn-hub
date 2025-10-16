import { useRouter } from 'next/router';
import Head from 'next/head';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { useLanguage } from '../../context/LanguageContext';
import { safeApiCall } from '../../lib/api';

export default function PaymentSuccess() {
  const router = useRouter();
  const { language } = useLanguage();

  // 硬编码中英文内容
  const translations = {
    en: {
      title: 'Payment Successful!',
      subtitle: 'Thank you for your purchase',
      message: 'Your payment has been processed successfully. You will receive a confirmation email shortly.',
      voucher: 'Your $40 discount voucher has been sent to your email and will be available when our product launches.',
      nextSteps: 'What happens next?',
      steps: [
        'Check your email for discount voucher',
        'Keep your email address updated',
        'We\'ll notify you when the product launches',
        'Use your $40 discount voucher at checkout'
      ],
      backToHome: 'Back to Home',
      emailError: 'Please provide a valid email address',
      subscribeSuccess: 'Thank you for subscribing!',
      subscribeFailed: 'Subscription failed, please try again later',
      connectionError: 'Error connecting to server, please try again later'
    },
    zh: {
      title: '支付成功！',
      subtitle: '感谢您的购买',
      message: '您的支付已成功处理。您将很快收到确认邮件。',
      voucher: '您的40美元折扣券已发送到您的邮箱，产品发布后即可使用。',
      nextSteps: '接下来会发生什么？',
      steps: [
        '查看邮箱中的折扣券',
        '保持邮箱地址更新',
        '产品发布时我们会通知您',
        '在结账时使用您的40美元折扣券'
      ],
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
        <title>{t.title} - Unicorn Toy</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Navigation />
      
      <div className="background-gradient"></div>
      <main className="min-h-screen">
        <section className="hero-section relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* 成功图标 */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>

              {/* 标题 */}
              <p className="text-[clamp(1.2rem,4vw,2rem)] text-gray-600 mb-8">{t.title}{language === 'zh' ? '' : ' '}{t.subtitle}</p>
              
              {/* 成功消息 */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto mb-8 shadow-lg">
                <p className="text-lg text-gray-800 mb-4">{t.message}</p>
                <div className="inline-flex items-center bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {t.voucher}
                </div>
              </div>

              {/* 下一步说明 */}
              <div className="max-w-4xl mx-auto mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">{t.nextSteps}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {t.steps.map((step, index) => (
                    <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                          <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 返回按钮 */}
              <button
                onClick={() => router.push('/')}
                className="back-button duration-200"
              >
                {t.backToHome}
              </button>
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

        .hero-section {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 200px;
          padding-bottom: 100px;
        }

        @media (min-width: 1920px) {
          .nav-container {
            max-width: 1530px;
          }
        }

         .back-button {
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

         .back-button:hover {
           background: linear-gradient(90deg, #72BCA3 0%, #9b90da 100%);
           transform: translateY(-1px);
         }
      `}</style>
    </>
  );
}
