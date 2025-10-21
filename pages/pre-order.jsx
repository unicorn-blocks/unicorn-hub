import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import ProductCarousel from '../components/ProductCarousel';
import { useLanguage } from '../context/LanguageContext';

export default function PreOrder() {
  const { language } = useLanguage();
  const [expandedFaqIndex, setExpandedFaqIndex] = useState([]);
  
  // 硬编码中英文内容
  const translations = {
    en: {
      title: 'VIP Preorder - Unicorn Blocks',
      pageTitle: 'Get VIP Early Access — Secure Your $129 Price Today',
      subtitle: 'Discover the future of creative play. Join our VIP community and be among the first to experience Unicorn Blocks.',
      ctaButton: 'Reserve Now',
      learnMoreButton: 'Learn More',
      features: {
        title: "More Than a block,\nIt's a Creative Companion.",
        items: [
          "Inspires Creativity: Turns your child’s imagination into interactive play.",
          'Smart Learning Through Fun: Guided by AI to spark curiosity and confidence.',
          'The Gift of Focus — For You Both: Immersive play for their growing mind. Uninterrupted time for your peace of mind.'
        ]
      },
      faq: {
        title: 'FAQ',
        items: [
          {
            q: 'How does the VIP Reservation work?',
            a: 'Step 1 Lock Your Price: Pay $10 now to secure the limited $129 VIP deal (Retail Price: $199). Step 2 Go behind-the-scenes: See exclusive updates, meet our team, and watch the creation process unfold. Step 3 Pay & Receive: We’ll notify you before shipping, then automatically charge the remaining $119 for priority delivery.'
          },
          {
            q: 'What if I change my mind?',
            a: 'No worries! Your $10 deposit is fully refundable anytime before we ship your product — no questions asked.'
          },
          {
            q: 'Is the toy safe for children?',
            a: 'Absolutely! Our building blocks include a camera that fosters creativity. However, it is disabled by default and requires explicit parental consent through our app to activate. You own all data, with the ability to view, manage, and permanently delete it at any time.'
          },
          {
            q: 'What age group are Unicorn blocks suitable for?',
            a: 'Ages 3-8. We personalize the fun! By setting your child\'s age, the system switches between story modes and difficulty levels to deliver an experience that\'s just right for them.'
          },
          {
            q: 'Can multiple children share one set?',
            a: 'Yes, they can share! However, for the best experience, we recommend one per child. The AI bonds as a personal "best friend," and having their own set ensures each child gets a fully personalized creative journey.'
          },
          {
            q: 'When will I pay the remaining amount?',
            a: 'We will send you a friendly email reminder about 14 days before shipping. You can then choose to pay the remaining $119 manually, or opt for automatic payment for a hands-free experience.'
          },
          {
            q: 'When will I receive the product?',
            a: 'Great innovation takes time. Our estimated ship date is mid-2026. By joining us now, you\'re not just pre-ordering — you\'re becoming an insider on our journey to create something extraordinary. You\'ll receive exclusive behind-the-scenes updates as we bring this product to life.'
          }
        ]
      }
    },
    zh: {
      title: '预售VIP - 独角兽积木',
      pageTitle: '获取VIP抢先体验 — 立即锁定$129优惠价',
      subtitle: '探索创意游戏的未来。加入我们的VIP社区，成为首批体验独角兽积木的用户。',
      ctaButton: '立即预订',
      learnMoreButton: '了解更多',
      features: {
        title: '不是一块简单的积木，\n而是孩子的创意伙伴。',
        items: [
          '激发创造力：把孩子的想象变成互动游戏。',
          '寓教于乐更聪明：AI引导，点燃好奇心与自信心。',
          '专注力的礼物：沉浸式玩法促进成长，也给你安心独处时间。'
        ]
      },
      faq: {
        title: '常见问题',
        items: [
          {
            q: 'VIP 预订如何运作？',
            a: '步骤1 锁定价格：现在支付$10，锁定限量$129 VIP优惠（零售价$199）。步骤2 幕后直达：获取独家进展、认识团队、见证创造过程。步骤3 支付并收货：发货前我们会通知你，并自动收取剩余$119，享受优先发货。'
          },
          {
            q: '如果我改变主意怎么办？',
            a: '不用担心！在我们发货前，你的$10订金可随时全额退款，无需理由。'
          },
          {
            q: '这款玩具对儿童安全吗？',
            a: '当然安全！积木内置的摄像头用于激发创造力，但默认关闭，需在家长App中明确授权后才会启用。数据完全归你所有，你可随时查看、管理并永久删除。'
          },
          {
            q: '适合多大年龄的孩子？',
            a: '适合3-8岁。我们会根据你设置的年龄在故事模式与难度之间切换，为孩子提供恰到好处的体验。'
          },
          {
            q: '多个孩子可以共用一套吗？',
            a: '可以共用！但为了最佳体验，我们建议一人一套。AI会形成“挚友式”陪伴，独立使用能获得更个性化的创作旅程。'
          },
          {
            q: '何时支付剩余金额？',
            a: '发货前约14天我们会发送温馨邮件提醒。你可以选择手动支付剩余$119，或开启自动支付，轻松无忧。'
          },
          {
            q: '我什么时候能收到产品？',
            a: '伟大的创新需要时间。预计发货时间为2026年年中。现在加入，你不仅是在预订，更将成为共创见证者，我们会持续发送幕后进展。'
          }
        ]
      }
    }
  };
  
  // 根据当前语言选择正确的翻译
  const t = translations[language] || translations.en;
  const featureIconUrls = [
    '/assets/lightbulb-on-outline.svg', // creativity / inspiration
    '/assets/robot-outline.svg', // smart learning
    '/assets/target.svg' // focus
  ];
  const toggleFaq = (idx) => {
    setExpandedFaqIndex((current) => {
      const set = new Set(current);
      if (set.has(idx)) {
        set.delete(idx);
      } else {
        set.add(idx);
      }
      return Array.from(set).sort((a,b)=>a-b);
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

          {/* 主产品展示区域 */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 items-center">
              
              {/* 左侧：产品轮播图 */}
              <div className="product-showcase">
                <ProductCarousel />
              </div>

              {/* 右侧：产品价值主张 */}
              <div className="product-info">
                <div className="value-proposition-card">
                  <h3 className="value-title">{t.features.title}</h3>
                  <div className="features-list">
                    {t.features.items.map((item, index) => (
                      <div key={index} className="feature-item">
                        <div className="feature-icon-container">
                          <span
                            className="feature-icon"
                            style={{ WebkitMaskImage: `url(${featureIconUrls[index] || featureIconUrls[0]})`, maskImage: `url(${featureIconUrls[index] || featureIconUrls[0]})` }}
                            aria-hidden="true"
                          />
                        </div>
                        <p className="feature-text">{item}</p>
                      </div>
                    ))}
                  </div>

                  {/* 行动按钮区域 */}
                  <div className="action-buttons">
                    <Link href="/checkout">
                      <button className="primary-button button-shine">
                        {t.ctaButton}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* FAQ 区块 */}
          <div className="max-w-5xl mx-auto mt-10">
            <div className="features-card glass-up surface-card">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{t.faq.title}</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-[#7D9ED4] to-[#F7AEBF] mx-auto rounded-full"></div>
              </div>
              <div className="space-y-3">
                {t.faq.items.map((faqItem, idx) => {
                  const open = expandedFaqIndex.includes(idx);
                  return (
                    <div key={idx} className={`faq-item ${open ? 'open' : ''}`}>
                      <button type="button" className="faq-header" onClick={() => toggleFaq(idx)} aria-expanded={open}>
                        <span className="faq-q">{faqItem.q}</span>
                        <span className={`chevron ${open ? 'rotate' : ''}`}>⌄</span>
                      </button>
                      <div className="faq-content" style={{ maxHeight: open ? '300px' : '0px' }}>
                        <div className="faq-a">{faqItem.a}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 使用Footer组件 */}
      <Footer />

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

        /* 导航样式已移至全局样式文件 */

        .buy-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* 产品展示区域样式 */
        .product-showcase {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 2rem 0;
        }

        /* 移动端单列布局时居中 */
        @media (max-width: 1024px) {
          .product-showcase {
            justify-content: center;
          }
        }

        .product-info {
          padding: 1rem 0;
          max-width: none;
        }

        /* 价值主张区域样式 - 纯文本无框版本 */
        .value-proposition-card {
          background: transparent;
          border: none;
          border-radius: 0;
          padding: 0;
          box-shadow: none;
          position: static;
          overflow: visible;
        }

        .value-proposition-card::before,
        .value-proposition-card::after {
          display: none;
        }

        .value-title {
          font-size: 2rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 2rem;
          line-height: 1.2;
          letter-spacing: -0.02em;
          white-space: pre-line;
        }

        .value-title::after {
          display: none;
        }

        .features-list {
          margin-bottom: 2rem;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1.75rem;
          padding: 0;
          position: static;
          padding-left: 0.375rem;
        }

        .feature-item::before {
          display: none;
        }

        .feature-item:last-child {
          margin-bottom: 0;
        }

        .feature-icon-container {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          margin-right: 0.375rem;
          margin-top: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-icon {
          display: inline-block;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #7D9ED4 0%, #F7AEBF 100%);
          -webkit-mask-size: cover;
          -webkit-mask-repeat: no-repeat;
          mask-size: cover;
          mask-repeat: no-repeat;
        }

        .feature-text {
          flex: 1;
          color: #374151;
          font-size: 1.1rem;
          line-height: 1.6;
          margin: 0;
          font-weight: 500;
        }

        .action-buttons {
          margin-top: 1.75rem;
          margin-bottom: 0;
        }

        .primary-button {
          width: 100%;
          background: linear-gradient(90deg, #F7AEBF 0%, #9b90da 100%);
          color: white;
          font-weight: 500;
          padding: 1rem 2rem;
          border-radius: 12px;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
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

        .primary-button:hover:not(:disabled) {
          background: linear-gradient(90deg, #F7AEBF 0%, #9b90da 100%);
          transform: none;
          filter: none;
        }

        .primary-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .secondary-button {
          width: 100%;
          background: transparent;
          color: #7D9ED4;
          font-weight: 500;
          padding: 0.875rem 1.5rem;
          border-radius: 12px;
          border: 1px solid #7D9ED4;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .secondary-button:hover {
          background: #7D9ED4;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(125, 158, 212, 0.3);
        }

        .trust-indicators {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .trust-item {
          font-size: 0.75rem;
          color: #6B7280;
          font-weight: 500;
        }

        /* 中等屏幕优化 - 在单列布局前先缩小 */
        @media (max-width: 1200px) {
          .value-title {
            font-size: 1.75rem;
            margin-bottom: 1.5rem;
            line-height: 1.3;
          }
          
          .feature-item {
            margin-bottom: 1.5rem;
            padding-left: 0.375rem;
          }
          
          .feature-icon-container {
            width: 28px;
            height: 28px;
            margin-right: 0.5rem;
          }
          
          .feature-icon {
            width: 20px;
            height: 20px;
          }
          
          .feature-text {
            font-size: 1rem;
            line-height: 1.5;
          }
          
          .action-buttons {
            margin-top: 1.75rem;
          }
          
          .primary-button {
            padding: 0.875rem 1.5rem;
            font-size: 0.9rem;
            border-radius: 12px;
          }
        }

        /* 响应式调整 */
        @media (max-width: 1024px) {
          .buy-container {
            padding: 0 1rem;
          }
          
          .value-proposition-card {
            padding: 0;
          }
          
          .value-title {
            font-size: 1.5rem;
            margin-bottom: 1.25rem;
            line-height: 1.3;
          }
          
          .feature-item {
            margin-bottom: 1.25rem;
            padding-left: 0.375rem;
          }
          
          .feature-icon-container {
            width: 26px;
            height: 26px;
            margin-right: 0.5rem;
          }
          
          .feature-icon {
            width: 18px;
            height: 18px;
          }
          
          .feature-text {
            font-size: 0.95rem;
            line-height: 1.5;
          }
          
          .action-buttons {
            margin-top: 1.5rem;
          }
          
          .primary-button {
            padding: 0.875rem 1.5rem;
            font-size: 0.9rem;
            border-radius: 12px;
          }
        }

        @media (max-width: 768px) {
          .buy-container {
            padding: 0 1rem;
          }
          
          .value-proposition-card {
            padding: 0;
          }
          
          .value-title {
            font-size: 1.75rem;
            margin-bottom: 1.75rem;
          }
          
          .feature-item {
            padding-left: 0.375rem;
          }
          
          .feature-icon-container {
            width: 28px;
            height: 28px;
            margin-right: 0.375rem;
          }
          
          .feature-icon {
            width: 20px;
            height: 20px;
          }
          
          .feature-text {
            font-size: 1rem;
          }
          
          .features-list {
            margin-bottom: 1.5rem;
          }
          
          .feature-item {
            margin-bottom: 0.875rem;
          }
          
          .feature-icon-container {
            width: 20px;
            height: 20px;
            margin-right: 0.625rem;
          }
          
          .feature-icon {
            width: 20px;
            height: 20px;
          }
          
          .feature-text {
            font-size: 0.8125rem;
          }
          
          .action-buttons {
            margin-bottom: 1.25rem;
          }
          
          .primary-button {
            padding: 0.75rem 1.5rem;
            font-size: 0.9rem;
            border-radius: 12px;
          }
          
          .secondary-button {
            padding: 0.75rem 1.25rem;
            font-size: 0.8125rem;
          }
          
          .trust-indicators {
            gap: 0.5rem;
          }
          
          .trust-item {
            font-size: 0.6875rem;
          }
        }

        .features-card {
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

        .secondary-button {
          width: 100%;
          padding: 1rem;
          background: transparent;
          color: #7d9ed4;
          border: 2px solid #7d9ed4;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .secondary-button:hover {
          background: #7d9ed4;
          color: white;
          transform: translateY(-1px);
        }

        .pricing-card, .features-card {
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

        .section-spacing {
          padding-top: 4rem;
          padding-bottom: 4rem;
        }

        /* FAQ 手风琴 */
        .feature-icon {
          display: inline-block;
          width: 20px;
          height: 20px;
          background: linear-gradient(90deg, #4F6FB1 0%, #E06A8A 100%);
          -webkit-mask-size: cover;
          -webkit-mask-repeat: no-repeat;
          mask-size: cover;
          mask-repeat: no-repeat;
        }
        .faq-item {
          background: rgba(255,255,255,0.98); /* 与系统卡片一致的中性白 */
          border: 1px solid rgba(229,231,235,0.45); /* 与 surface-card 边框一致 */
          border-radius: 12px;
          overflow: hidden;
          transition: border-color .18s ease, box-shadow .18s ease;
        }
        .faq-item:hover { 
          border-color: #e9d5ff; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .faq-item.open { background: #ffffff; border-color: #e9d5ff; }
        .faq-item + .faq-item { margin-top: 0.5rem; }
        .faq-header {
          width: 100%;
          background: transparent;
          border: 0;
          padding: 1rem 1.1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }
        .faq-q {
          font-weight: 600;
          color: #111827;
          text-align: left;
        }
        .faq-item:hover .faq-q { color: #0f172a; }
        .chevron {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          margin-left: 0.5rem;
          font-size: 0; /* 隐藏字符，使用伪元素绘制 */
        }
        .chevron::before {
          content: '';
          width: 14px;
          height: 14px;
          background: #9ca3af; /* 与整体灰度更统一 */
          transition: transform .2s ease;
          -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E") center/14px 14px no-repeat;
                  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E") center/14px 14px no-repeat;
        }
        .chevron.rotate::before {
          transform: rotate(180deg);
        }
        .faq-content {
          transition: max-height .25s ease;
        }
        .faq-a {
          padding: 0 1.1rem 1rem 1.1rem;
          color: #374151;
          font-size: 0.95rem;
          line-height: 1.6;
        }
      `}</style>
    </>
  );
}
