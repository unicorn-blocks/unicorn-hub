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
      title: 'Unicorn Blocks - AI-Powered STEM Building Toys for Kids',
      description: 'Discover Unicorn Blocks, the revolutionary AI-powered STEM building toys that spark creativity in kids while giving parents peace of mind. Watch our demo video and pre-order today!',
      keywords: 'AI toys, STEM toys, building blocks, educational toys, kids toys, unicorn blocks, smart toys, interactive toys, learning toys, creative toys',
      hero: {
        aiPowered: 'AI-powered',
        unicorn: 'Unicorn Blocks',
        toy: '',
        makeYourDream: 'A magical STEM world where',
        kidsCreate: 'kids create',
        parentsRelax: 'parents relax'
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
      title: '独角兽积木 - AI驱动的STEM益智积木玩具',
      description: '探索独角兽积木，革命性的AI驱动STEM积木玩具，激发孩子创造力，让父母安心。观看我们的演示视频，立即预订！',
      keywords: 'AI玩具, STEM玩具, 积木玩具, 教育玩具, 儿童玩具, 独角兽积木, 智能玩具, 互动玩具, 学习玩具, 创意玩具',
      hero: {
        aiPowered: 'AI驱动的',
        unicorn: '独角兽积木',
        toy: '',
        makeYourDream: '一个神奇的STEM世界，让',
        kidsCreate: '孩子创造',
        parentsRelax: '父母放松'
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
        
        {/* SEO Meta Tags */}
        <meta name="description" content={t.description} />
        <meta name="keywords" content={t.keywords} />
        <meta name="author" content="Unicorn Blocks" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content={language === 'zh' ? 'zh-CN' : 'en-US'} />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t.title} />
        <meta property="og:description" content={t.description} />
        <meta property="og:url" content="https://unicornblocks.ai" />
        <meta property="og:site_name" content="Unicorn Blocks" />
        <meta property="og:image" content="https://unicornblocks.ai/assets/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'zh' ? 'zh_CN' : 'en_US'} />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.title} />
        <meta name="twitter:description" content={t.description} />
        <meta name="twitter:image" content="https://unicornblocks.ai/assets/twitter-image.jpg" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#7D9ED4" />
        <meta name="msapplication-TileColor" content="#7D9ED4" />
        <link rel="canonical" href="https://unicornblocks.ai" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "Unicorn Blocks",
              "description": t.description,
              "brand": {
                "@type": "Brand",
                "name": "Unicorn Blocks"
              },
              "category": "Educational Toys",
              "offers": {
                "@type": "Offer",
                "availability": "https://schema.org/PreOrder",
                "priceCurrency": "USD",
                "url": "https://unicornblocks.ai/pre-order"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "150"
              }
            })
          }}
        />
      </Head>

      <div className="background-gradient"></div>
      <main className="min-h-screen">
        {/* 使用导航组件 */}
        <Navigation />

        {/* Hero Section - 增强视觉冲击力 */}
        <section className="hero-section relative overflow-hidden">
          {/* 背景装饰元素 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-[#7D9ED4]/20 to-[#F7AEBF]/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-[#F7AEBF]/20 to-[#72BCA3]/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-[#7D9ED4]/10 to-[#F7AEBF]/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto text-center">
              {/* 主标题 - 增强视觉层次 */}
              <div className="mb-12">
                <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-black leading-[0.9] mb-6">
                  <span className="text-gray-800 font-bold drop-shadow-sm">{t.hero.aiPowered} </span>
                  <span className="bg-gradient-to-r from-[#7D9ED4] via-[#8B9ED4] to-[#F7AEBF] text-transparent bg-clip-text font-black drop-shadow-lg">{t.hero.unicorn}</span>
                </h1>
              </div>
              
              {/* 副标题 - 增强营销感 */}
              <div className="mb-16">
                <p className="text-[clamp(1.4rem,4vw,2.2rem)] font-semibold text-gray-700 leading-tight">
                  <span className="text-gray-600">{t.hero.makeYourDream} </span>
                  <span className="bg-gradient-to-r from-[#7D9ED4] to-[#F7AEBF] text-transparent bg-clip-text font-bold">{t.hero.kidsCreate}</span>
                  <span className="light-effect mx-2"></span>
                  <span className="bg-gradient-to-r from-[#F7AEBF] to-[#72BCA3] text-transparent bg-clip-text font-bold">{t.hero.parentsRelax}</span>
                </p>
              </div>
              
            </div>
          </div>
        </section>

        {/* Blocks decoration - 增强视觉效果 */}
        <section className="relative py-6 overflow-hidden">
          <div className="w-full overflow-hidden">
            <img 
              src="/assets/buildingblock.png" 
              alt="Blocks" 
              className="w-[110%] max-w-none mx-auto relative left-1/2 -translate-x-1/2 transform hover:scale-105 transition-transform duration-700 ease-out" 
            />
          </div>
          {/* 积木上方的装饰光效 */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-32 bg-gradient-to-b from-transparent via-[#7D9ED4]/5 to-transparent pointer-events-none"></div>
        </section>

        {/* Demo Video Section */}
        <section className="pb-32 pt-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-[clamp(1.4rem,4vw,2.2rem)] font-semibold mt-2 mb-6 px-2 mx-auto">
                <span className="text-gray-600 font-normal">{t.demo.come} </span>
                <span className="bg-gradient-to-r from-[#72BCA3] to-[#7D9ED4] text-transparent bg-clip-text">{t.demo.video}</span>
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
          padding-top: 320px;
          padding-bottom: 60px;
        }

        /* 光效动画 */
        .light-effect {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: radial-gradient(circle, rgba(125, 158, 212, 0.8) 0%, rgba(247, 174, 191, 0.6) 50%, transparent 100%);
          border-radius: 50%;
          animation: light-pulse 3s ease-in-out infinite;
          position: relative;
          vertical-align: middle;
          margin-top: -2px;
        }

        .light-effect::before {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          background: radial-gradient(circle, rgba(125, 158, 212, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          animation: light-glow 3s ease-in-out infinite;
        }

        @keyframes light-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
          }
        }

        @keyframes light-glow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(2);
            opacity: 0.6;
          }
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