import { useEffect } from 'react';
import Head from 'next/head';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import { safeApiCall } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { language } = useLanguage();
  
  // 硬编码中英文内容
  const translations = {
    en: {
      title: 'Unicorn Blocks',
      hero: {
        aiPowered: 'AI-powered',
        unicorn: 'Unicorn Blocks',
        toy: '',
        makeYourDream: 'Make all dreams',
        comeTrue: 'come true'
      },
      demo: {
        come: 'Come and watch our',
        video: 'Demo Video'
      },
      emailError: 'Please provide a valid email address',
      subscribeSuccess: 'Thank you for subscribing!',
      subscribeFailed: 'Subscription failed, please try again later',
      connectionError: 'Error connecting to server, please try again later'
    },
    zh: {
      title: '独角兽玩具',
      hero: {
        aiPowered: 'AI',
        unicorn: '独角兽玩具',
        toy: '',
        makeYourDream: '让所有孩子的梦想',
        comeTrue: '成真'
      },
      demo: {
        come: '来观看我们的',
        video: '演示视频'
      },
      emailError: '请提供有效的电子邮箱地址',
      subscribeSuccess: '感谢您的订阅！',
      subscribeFailed: '订阅失败，请稍后再试',
      connectionError: '连接服务器错误，请稍后再试'
    }
  };
  
  // 根据当前语言选择正确的翻译
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
        <title>{t.title}</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="background-gradient"></div>
      <main className="min-h-screen">
        {/* 使用导航组件 */}
        <Navigation />

        {/* Hero Section - 放在中央 */}
        <section className="hero-section relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-[clamp(1.5rem,5vw,3.75rem)] font-bold mb-8 px-2 mx-auto">
                <span className="text-gray-600 font-normal">{t.hero.aiPowered} </span>
                <span className="bg-gradient-to-r from-[#7D9ED4] to-[#F7AEBF] text-transparent bg-clip-text">{t.hero.unicorn}</span>
                <span className="text-gray-600 font-normal"> {t.hero.toy}</span>
              </div>
              <div className="text-[clamp(1.5rem,5vw,3.75rem)] font-bold mt-8 px-2 mx-auto">
                <span className="text-gray-600 font-normal">{t.hero.makeYourDream} </span>
                <span className="bg-gradient-to-r from-[#7D9ED4] to-[#F7AEBF] text-transparent bg-clip-text">{t.hero.comeTrue}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Blocks decoration */}
        <div className="w-full overflow-hidden mb-4">
          <img src="/assets/buildingblock.png" alt="Blocks" className="w-[110%] max-w-none mx-auto relative left-1/2 -translate-x-1/2" />
        </div>

        {/* Demo Video Section */}
        <section className="pb-16 pt-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-left">
              <div className="text-[clamp(1.2rem,4vw,2.5rem)] font-bold mt-2 mb-6 px-2 mx-auto whitespace-nowrap">
                <span className="text-gray-600 font-normal">{t.demo.come} </span>
                <span className="text-[#72BCA3]">{t.demo.video}</span>
              </div>
              <div className="relative overflow-hidden pt-[56.25%] rounded-xl shadow-lg">
                <iframe 
                  className="absolute top-0 left-0 w-full h-full" 
                  src="https://www.youtube.com/embed/hUhocTvvQlA" 
                  title="Unicorn Blocks Demo Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
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
          padding-bottom: 0;
        }

        @media (min-width: 1920px) {
          .nav-container {
            max-width: 1530px;
          }
        }
      `}</style>
    </>
  );
}