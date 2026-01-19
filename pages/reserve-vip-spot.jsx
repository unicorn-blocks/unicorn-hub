import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import BlueTopBar from '../components/BlueTopBar';
import ProductCarousel from '../components/ProductCarousel';
import { useLanguage } from '../context/LanguageContext';
import { proceedToCheckout } from '../lib/fbq';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import ImpactSection from '../components/sections/ImpactSection';
import StepsSection from '../components/sections/StepsSection';
import PrivacySection from '../components/sections/PrivacySection';
import KitCategories from '../components/KitCategories';

// Backend: Fetch data at build time / incrementally
export async function getStaticProps() {
  const REMAINING_API = 'https://script.google.com/macros/s/AKfycbyC8hgXKH7L9JJf2JpFvfDhrjyO00saKSEs3enX1ppC8RzkHn7PZnuBGmkhH7jhFJmwNg/exec';
  let remaining = 500;

  try {
    const res = await fetch(REMAINING_API);
    const data = await res.json();
    if (typeof data.remaining === 'number') {
      remaining = data.remaining;
    }
  } catch (error) {
    console.error('ISR Fetch Error:', error);
  }

  return {
    props: {
      initialRemaining: remaining,
    },
    // Next.js will invalidate the cache when a request comes in
    // at most once every 60 seconds.
    revalidate: 60,
  };
}

export default function PreOrder({ initialRemaining }) {
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);


  // Scarcity state: Init with server-provided data (fast!), fallback to 500
  const [reservationsCount, setReservationsCount] = useState(typeof initialRemaining === 'number' ? initialRemaining : 500);
  const totalSpots = 500;
  const REMAINING_API = 'https://script.google.com/macros/s/AKfycbyC8hgXKH7L9JJf2JpFvfDhrjyO00saKSEs3enX1ppC8RzkHn7PZnuBGmkhH7jhFJmwNg/exec';

  useEffect(() => {
    // Client-side refresh (keep data fresh)
    fetch(REMAINING_API)
      .then(res => res.json())
      .then(data => {
        if (typeof data.remaining === 'number') {
          setReservationsCount(data.remaining);
        }
      })
      .catch(() => {
        // silently fail, we have initial data
      });
  }, []);

  // 硬编码中英文内容
  const translations = {
    en: {
      title: 'Reserve VIP Spot - Unicorn Blocks',
      header: {
        badge: 'Selected VIP', // Badge (Not rendered in new design but kept for reference)
        priceVIP: 'Lock Your VIP Price',
        priceRetail: '', // Unused
        deposit: 'Secure the $149 VIP price (retail $199) with a $5 fully refundable deposit.',
        scarcityPrefix: 'Only',
        scarcitySuffix: 'VIP spots left'
      },
      ctaButton: 'Lock My VIP Price',
      learnMoreButton: 'Learn More',
      trustNote: '✔ Fully Refundable $5 Deposit · ✔ Safe Checkout',
      features: {
        title: "Sparky First Adventure Set",
        items: [
          "<strong>Ages 3-8: The Foundational Years</strong><br/>For curious builders ready to explore creativity and STEM.",
          '<strong>The 5-in-1 Adventure Kit</strong><br/>Everything to start. Includes Sparky, 4 themed power-ups, 4 magic blocks, and 100+ classic blocks.',
          '<strong>STEM Learning</strong><br/>Kids build rockets for fun, mastering engineering & creative problem-solving.',
          '<strong>The Gift of Independent Play</strong><br/>Gives you back 100+ minutes of peaceful time to recharge everytime they play.'
        ]
      },
      kit: {
        categories: [
          {
            title: 'Sparky — Your Child’s Creative Story Buddy',
            highlights: [
              'Sees & Understands — Sparky responds to what kids build and continues the story.',
              'Privacy-First — Push-to-talk privacy.',
              'All-Day Play — Up to 7 hours of play.'
            ]
          },
          {
            title: 'The Magic Hats: 4x Magical Theme Hats',
            highlights: [
              'Choose 4 from 7 story worlds — Forest · Ocean · Desert · Castle · Princess · Unicorn · Space',
              'New Story Worlds — Each hat unlocks a new story world.',
              'Guided → Creative — Start guided, then unlock Creator Mode.'
            ]
          },
          {
            title: 'Light-Up Magic Blocks',
            highlights: [
              'Magical Feedback — Blocks react to stories.',
              'Unlock the Surprise — Unlock a magical surprise.'
            ]
          },
          {
            title: '100 Universal Blocks',
            highlights: [
              'LEGO®-Friendly — Works with LEGO®.',
              'Kid-Proof Design — Safe, durable, kid-proof.'
            ]
          }
        ]
      },
      faq: {
        title: 'FAQ',
        items: [
          {
            q: 'How does the VIP Reservation work?',
            a: 'Step 1. Lock Your Price: Pay **$5 today** to reserve the **$149 VIP price** (Retail price: $199).\nStep 2. **Get Exclusive Access**: **See** behind-the-scenes updates, and **follow** the product as it comes to life — all designed to **spark creativity**.\nStep 3. Pay & Receive: Before shipping, we’ll notify you and charge the remaining **$145**. Your order ships with **priority delivery**.'
          },
          {
            q: 'What if I change my mind?',
            a: 'No worries! Your $5 deposit is fully refundable anytime before we ship your product — no questions asked.'
          },
          {
            q: 'Is the toy safe for children?',
            a: '**Absolutely!** Our building blocks include a camera that fosters creativity. However, it is **disabled by default and requires explicit parental consent through our app to activate**. You own all data, with the ability to view, manage, and permanently delete it at any time.'
          },
          {
            q: 'What age group are Unicorn blocks suitable for?',
            a: '**Ages 3-8.** We personalize the fun! By setting your child\'s age, the system switches between story modes and difficulty levels to deliver an experience that\'s just right for them.'
          },
          {
            q: 'Can multiple children share one set?',
            a: 'Yes, they can share! For the best experience, we recommend one set per child. Each Sparky becomes a personal companion, and having their own set allows every child to enjoy a fully personalized creative journey.'
          },
          {
            q: 'When will I pay the remaining amount?',
            a: 'We will send you a friendly email reminder about **14 days before shipping**. You can then choose to **pay the remaining $145 manually**, or opt for automatic payment for a hands-free experience.'
          },
          {
            q: 'When will I receive the product?',
            a: 'Great innovation takes time. Our estimated ship date is mid-2026. By joining us now, you\'re not just reserve-vip-spoting — you\'re becoming an insider on our journey to create something extraordinary. You\'ll receive exclusive behind-the-scenes updates as we bring this product to life.'
          },
          {
            q: 'Is this screen-free?',
            a: 'Unicorn Blocks is designed to reduce passive screen time. Kids build with real, physical blocks while Sparky responds to what they create—encouraging hands-on play, imagination, and movement instead of scrolling or watching.'
          },
          {
            q: 'Does it need Wi-Fi to work?',
            a: 'You will need Wi-Fi to connect and generate new stories. Once your Sparky is connected, you can move it around your home as long as it stays within range.'
          },
          {
            q: 'Is it hard to set up?',
            a: 'Not at all. Setup takes just a few minutes through the parent app. After that, kids can jump straight into building and playing.'
          },
          {
            q: 'What does my child actually learn?',
            a: 'Through play, kids develop creativity, spatial thinking, storytelling skills, and early engineering concepts—without it ever feeling like a lesson.'
          },
          {
            q: 'How long will my child stay engaged?',
            a: 'Many parents are surprised by how long kids stay focused. Sparky encourages continuous building, experimenting, and storytelling, helping play sessions last far longer than traditional blocks.'
          },
          {
            q: 'Will my child outgrow it quickly?',
            a: 'Unicorn Blocks grows with your child. As kids develop, Sparky introduces new challenges and story depth, keeping play fresh, engaging, and age-appropriate over time.'
          },
          {
            q: 'Is it compatible with other building blocks?',
            a: 'Yes! Absolutely. Unicorn Blocks are compatible with LEGO®-style blocks, so kids can mix, expand, and build even bigger worlds using the blocks they already love.'
          }
        ]
      }
    },
    zh: {
      title: '预订VIP名额 - 独角兽积木',
      pageTitle: '限量VIP名额 — $129（零售价$199）',
      subtitle: {
        prefix: '',
        deposit: '$5订金',
        suffix: '预订 — 仅剩436个名额，共500个！'
      },
      ctaButton: '我要锁定VIP名额！',
      learnMoreButton: '了解更多',
      trustNote: '✔ $5订金可随时全额退款 · ✔ 安全支付',
      features: {
        title: '独角兽积木：Sparky首次冒险',
        items: [
          '<strong>适合3-8岁：基础年龄段</strong><br/>为好奇的建造者准备探索创意与STEM。',
          '<strong>5合1冒险套装</strong><br/>开启所需的一切。包含Sparky、4个主题强化道具、4个魔法积木和100+经典积木。',
          '<strong>STEM学习</strong><br/>孩子们为乐趣建造火箭，掌握工程学与创意问题解决。',
          '<strong>独立游戏礼物</strong><br/>每次游戏都给你100+分钟宁静时光来充电。'
        ]
      },
      kit: {
        categories: [
          {
            title: 'Magical Block Buddy: Sparky',
            highlights: [
              'Story Sparks Creation — The Magical Block Buddy that turns every build into a story.',
              'Magic Window — Sees and understands every creative build.',
              'Smart Brain — Adapts stories to Age (3-8) & Interests.',
              'Privacy Button — Press to talk. Eyes & ears closed when off.',
              '7-Hour Playtime — Long-lasting creative sessions.'
            ]
          },
          {
            title: 'The Magic Hats: 4x Magical Theme Hats',
            highlights: [
              'Choose 4 from 7 story worlds — Forest · Ocean · Desert · Castle · Princess · Unicorn · Space',
              'Themes — Magic, Knight, Princess, Vehicle, Animal, Flowers, Fantasy, Buildings.',
              'Creative Journey — Packed with 30+ stories per hat! Start with 6 Guided Stories to learn the basics, then unlock "Creator Mode" for infnite challenges!'
            ]
          },
          {
            title: 'The Magic Blocks: 4x Light-Up Magical Blocks',
            highlights: [
              'Theme Matched — Each block pairs specifically with one Magic Hat.',
              'The Magical Prize — Unlocks upon reaching "Creator Mode"—use this glowing magical block to light up your own infnite creations!'
            ]
          },
          {
            title: '100 Universal Blocks',
            highlights: [
              'Limitless Play — Compatible with LEGO® & major brands.',
              'Kid-Proof — BPA-Free, CPC/FCC Certified. Safe & Durable.'
            ]
          }
        ]
      },
      faq: {
        title: '常见问题',
        items: [
          {
            q: 'VIP 预订如何运作？',
            a: '步骤1. 锁定价格：现在支付**$5**，锁定限量**$129 VIP优惠**（零售价$199）。\n步骤2. 幕后直达：**获取**独家进展、**认识**团队、**见证**创造过程——一切旨在**释放无限创意**。\n步骤3. 支付并收货：发货前我们会通知你，并自动收取剩余**$124**，享受优先发货。'
          },
          {
            q: '如果我改变主意怎么办？',
            a: '不用担心！在我们发货前，你的$5订金可随时全额退款，无需理由。'
          },
          {
            q: '这款玩具对儿童安全吗？',
            a: '**当然安全！**积木内置的摄像头用于激发创造力，但**默认关闭，需在家长App中明确授权后才会启用**。数据完全归你所有，你可随时查看、管理并永久删除。'
          },
          {
            q: '适合多大年龄的孩子？',
            a: '**适合3-8岁**。我们会根据你设置的年龄在故事模式与难度之间切换，为孩子提供恰到好处的体验。'
          },
          {
            q: '多个孩子可以共用一套吗？',
            a: '可以共用！但为了**最佳体验**，我们建议一人一套。AI会形成"挚友式"陪伴，独立使用能获得更个性化的创作旅程。'
          },
          {
            q: '何时支付剩余金额？',
            a: '发货前约**14天**我们会发送温馨邮件提醒。你可以选择**手动支付剩余$124**，或开启自动支付，轻松无忧。'
          },
          {
            q: '我什么时候能收到产品？',
            a: '伟大的创新需要时间。预计发货时间为2026年年中。现在加入，你不仅是在预订，更将成为共创见证者，我们会持续发送幕后进展。'
          },
          {
            q: '这是无屏幕的吗？',
            a: 'Unicorn Blocks 旨在减少被动屏幕时间。孩子们使用真实的物理积木进行搭建，而 Sparky 会对他们创造的内容做出反应——鼓励动手游戏、想象力和运动，而不是刷屏或看视频。'
          },
          {
            q: '它需要 Wi-Fi 才能工作吗？',
            a: '你需要 Wi-Fi 或热点连接来连接并生成新故事。一旦你的 Sparky 连接上了，只要通过 App 操作，你就可以在家中任何信号覆盖范围内使用它。'
          },
          {
            q: '设置很难吗？',
            a: '一点也不。通过家长 App 设置只需几分钟。之后，孩子们就可以直接开始搭建和玩耍了。'
          },
          {
            q: '孩子到底能学到什么？',
            a: '通过游戏，孩子们可以发展创造力、空间思维、讲故事的技巧和早期工程概念——而且完全不会感觉像是在上课。'
          },
          {
            q: '孩子的注意力能保持多久？',
            a: '许多父母都惊讶于孩子能保持如此长时间的专注。Sparky 鼓励持续的搭建、实验和讲故事，帮助游戏时间持续得比传统积木长得多。'
          },
          {
            q: '孩子会很快就不玩了吗？',
            a: '独角兽积木会随孩子一起成长。随着孩子能力的提升，Sparky 会由浅入深地引入新挑战和更复杂的故事，确保游戏内容始终新鲜有趣，且适合不同年龄阶段。'
          },
          {
            q: '它兼容其他积木吗？',
            a: '是的，完全兼容！独角兽积木兼容乐高®式积木，所以孩子们可以将它们混合使用、扩展，利用已有的积木构建更宏大的世界。'
          }
        ]
      }
    }
  };

  // 根据当前语言选择正确的翻译
  const t = translations[language] || translations.en;
  const featureIconUrls = [
    '/assets/reserve-vip-spot/ages-learning.svg', // ages 3-8 / learning foundation
    '/assets/reserve-vip-spot/adventure-kit.svg', // 5-in-1 adventure kit
    '/assets/reserve-vip-spot/stem-education.svg', // creative STEM adventures
    '/assets/reserve-vip-spot/independent-play.svg' // independent play gift
  ];
  // toggleFaq is now inline in the button onClick


  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{t.title}</title>
      </Head>

      <div className="background-gradient"></div>

      {/* 蓝色顶部条 */}
      <BlueTopBar />

      {/* 使用导航组件 */}
      {/* <Navigation /> */}

      {/* Main Content */}
      <main className="min-h-screen pt-2 pb-24">
        <div className="buy-container">
          {/* 页面标题 */}

          {/* Pricing Block Module - Open Layout */}
          <div className="pricing-block-wrapper">
            <div className="pricing-block open-style">
              <div className="pricing-content">

                {/* Row 1: Title */}
                <div className="pricing-row-main">
                  <span className="pricing-vip">{t.header.priceVIP}</span>
                </div>

                {/* Row 2 & 3: Body + Scarcity */}
                <div className="pricing-row-sub">
                  <div className="pricing-deposit-text">
                    {language === 'zh' ? (
                      t.header.deposit
                    ) : (
                      <>Secure the <span className="highlight-price">$149</span> VIP price (<span className="retail-price">retail $199</span>) with a <span className="highlight-price">$5</span> fully refundable deposit.</>
                    )}
                  </div>
                  <div className="pricing-scarcity-text">
                    {t.header.scarcityPrefix} <span className="highlight-number">{reservationsCount}</span> of {totalSpots} {t.header.scarcitySuffix} <span className="scarcity-fire">🔥</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 主产品展示区域 */}
          <div className="product-section-wrapper">
            <div className="grid grid-cols-1 lg:grid-cols-[4fr_5fr] gap-8 items-stretch">

              {/* 左侧：产品轮播图 */}
              <div className="product-showcase">
                <ProductCarousel />
              </div>

              {/* 右侧：产品价值主张 */}
              <div className="product-info">
                <div className="value-proposition-card">
                  <div className="card-section">
                    <h3 className="value-title">{t.features.title}</h3>
                  </div>

                  <div className="card-section">
                    <div className="title-divider"></div>
                  </div>

                  <div className="card-section">
                    <div className="kit-details-block">
                      {t.kit && t.kit.categories && <KitCategories categories={t.kit.categories} initialState={[true, false, false, false]} />}
                    </div>
                  </div>

                  <div style={{ height: '10px', flex: 'none' }}></div>

                  {/* 行动按钮 */}
                  <div className="card-section">
                    <button
                      className="primary-button button-shine sticky-mobile-button"
                      onClick={proceedToCheckout}
                    >
                      {t.ctaButton}
                    </button>

                    {/* 信任提示 - 绝对定位 */}
                    <div className="trust-indicators">
                      <div className="trust-item">{t.trustNote}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* New Sections inserted from reuse */}
        <TestimonialsSection />
        <ImpactSection />
        <StepsSection style={{ marginTop: 0 }} />
        <PrivacySection />

        <div className="buy-container">

          {/* FAQ 区块 */}
          <div className="faq-section-wrapper">
            <div className="features-card glass-up surface-card">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{t.faq.title}</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-[#7D9ED4] to-[#F7AEBF] mx-auto rounded-full"></div>
              </div>
              <div className="faq-list">
                {t.faq.items.map((faqItem, idx) => (
                  <div key={idx} className={`faq-item ${openFaq === idx ? 'open' : ''}`}>
                    <button type="button" className="faq-header" onClick={() => setOpenFaq(openFaq === idx ? null : idx)} aria-expanded={openFaq === idx}>
                      <span className="faq-q">{faqItem.q}</span>
                      <span className="faq-icon" aria-hidden="true">
                        {openFaq === idx ? '−' : '+'}
                      </span>
                    </button>
                    <div className="faq-answer">
                      {faqItem.q.includes('VIP Reservation') || faqItem.q.includes('VIP 预订') ? (
                        <div className="faq-a-steps">
                          {faqItem.a.split('\n').map((step, index) => (
                            <div key={index} className="step-line">
                              <span className="step-number">{step.split('.')[0]}.</span>
                              <span className="step-content" dangerouslySetInnerHTML={{
                                __html: step.split('.').slice(1).join('.').trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              }}></span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p dangerouslySetInnerHTML={{
                          __html: faqItem.a.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')
                        }}></p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 使用Footer组件 */}
      <Footer showEmailInput={false} />

      <style jsx global>{`
        /* ===== 基础样式 ===== */
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

        /* ===== 容器样式 ===== */
        .buy-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .section-spacing {
          padding-top: 4rem;
          padding-bottom: 4rem;
        }

        /* ===== 主标题样式 ===== */
        /* ===== Pricing Block Styles - Refined Open Style ===== */
        .pricing-block-wrapper {
          display: flex;
          justify-content: center; /* Center the block horizontally to balance L/R margins */
          margin-bottom: 0.5rem;
          padding: 0 0.5rem;
          width: 100%;
        }

        .pricing-block.open-style {
          background: transparent;
          border: none;
          box-shadow: none;
          padding: 1rem 0;
          display: flex;
          flex-direction: column;
          align-items: center; /* Center align the content block */
          width: 100%;
          max-width: 100%; /* Allow full width */
          margin: 0;
        }
        
        .pricing-content {
          display: flex;
          flex-direction: column;
          align-items: center; /* Center align content */
          text-align: center;
          width: fit-content;
          max-width: 100%;
          gap: 0.5rem; /* Consistent spacing between all rows */
        }

        /* Row 1: Badge */
        .pricing-badge-row {
          width: 100%;
          display: flex;
          justify-content: center; /* Center align */
        }

        .pricing-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: linear-gradient(90deg, #F0EEF8 0%, #FBF6FC 100%);
          color: #4F475D; 
          border: 1px solid #E9D5FF;
          font-weight: 700;
          font-size: 0.75rem; /* Even smaller font */
          padding: 0.15rem 0.5rem; /* Very compact padding */
          border-radius: 6px; 
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          white-space: nowrap;
        }

        .wave-emoji {
          font-size: 1.1em;
        }

        /* Row 2: Main Price */
        .pricing-row-main {
          display: flex;
          align-items: baseline; 
          justify-content: center; /* Center align */
          flex-wrap: nowrap; 
          gap: clamp(8px, 2vw, 16px);
          width: 100%;
        }
        
           /* Removed styling that conflicted with new structure */
           width: 100%;
        }

        /* Desktop: Left align pricing block to match image */
        @media (min-width: 1024px) {
          .pricing-block-wrapper {
            justify-content: flex-start;
            padding-left: 2rem; /* Nudge pricing block right to align with image */
          }
          
          .pricing-block.open-style {
            align-items: flex-start;
          }
          
          .pricing-content {
            align-items: flex-start;
            text-align: left;
          }
          
            justify-content: flex-start;
          }
        }
        
        .pricing-row-sub {
            display: flex;
            flex-direction: column;
            align-items: center; /* Center on Mobile */
            gap: 8px;
            white-space: normal;
        }

        @media (min-width: 1024px) {
            .pricing-row-sub {
                align-items: flex-start; /* Left on Desktop */
            }
            .pricing-deposit-text {
                text-align: left;
            }
        }

        .highlight-price {
            color: #111827; /* Changed from purple to black per request */
            font-weight: 800;
            font-size: 1.1em;
        }

        .retail-price {
            color: #9CA3AF;
            text-decoration: line-through;
            text-decoration-thickness: 1.5px;
            font-weight: 600;
            margin: 0 2px;
        }

        .pricing-deposit-text {
          font-size: clamp(0.85rem, 2.5vw, 1.25rem); /* Slightly smaller start */
          font-weight: 500;
          color: #4B5563;
          line-height: 1.5;
          text-align: center; /* Center on Mobile by default */
        }

        .pricing-scarcity-text {
          font-size: clamp(0.85rem, 2.5vw, 1.25rem);
          font-weight: 700;
          color: #DC2626;
          display: flex; /* Changed from inline-flex to flex for width control if needed, but flex in flex-col centers nicely */
          justify-content: center; /* Ensure internal content (icon) is centered */
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          width: 100%; /* Take full width to ensure text-align/justify works if parent isn't constraining it tightness */
        }
        
        @media (min-width: 1024px) {
            .pricing-scarcity-text {
                justify-content: flex-start;
                width: auto;
            }
        }

        .pricing-vip {
          font-size: clamp(1.6rem, 6vw, 4rem); /* Responsive fluid font size */
          font-weight: 900;
          color: #111827;
          line-height: 1.1;
          letter-spacing: -0.03em;
          white-space: nowrap; /* Force single line */
        }

        .pricing-retail {
          font-size: clamp(0.9rem, 2.5vw, 1.75rem); /* Responsive fluid font size */
          color: #9CA3AF;
          text-decoration: line-through;
          font-weight: 500;
          white-space: nowrap; /* Force single line */
        }

        @media (min-width: 640px) {
          .pricing-vip {
             /* font-size handled by clamp */
          }
          .pricing-retail {
             /* font-size handled by clamp */
          }
           .pricing-row-secondary {
             font-size: 1.75rem;
           }
        }

        /* PC / Desktop Overrides: Align Header Left */
        @media (min-width: 1024px) {
           .pricing-block-wrapper {
             justify-content: flex-start;
           }
           .pricing-content {
             align-items: flex-start;
             text-align: left;
           }
           .pricing-badge-row {
             justify-content: flex-start;
           }
           .pricing-row-main {
             justify-content: flex-start;
           }
           .pricing-row-sub {
             justify-content: flex-start;
           }
           .value-title {
             text-align: left;
           }
        }

        /* ===== Section Wrappers ===== */
        .product-section-wrapper {
          max-width: 72rem; /* 1152px = 6xl */
          margin: 0 auto 4rem;
          padding: 0 16px;
        }
        
        .faq-section-wrapper {
          max-width: 72rem;
          margin: 2.5rem auto 0;
          padding: 0 16px;
        }
        
        @media (max-width: 768px) {
          .product-section-wrapper,
          .faq-section-wrapper {
            max-width: 100%;
            margin-left: 0;
            margin-right: 0;
            padding: 0 8px;
          }
        }

        /* ===== 产品展示区域 ===== */
        .product-showcase {
          display: flex;
          align-items: stretch;
          justify-content: flex-start;
          padding: 0;
          margin: -5px 0; /* 5px distance top and bottom as requested */
          max-width: 600px;
          width: 100%;
        }

        @media (min-width: 1024px) {
          .product-showcase {
            margin-top: 0; /* Align image top with title */
          }
        }
        
        .product-showcase .product-carousel {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .product-info {
          padding: 0rem 0;
          max-width: none;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 100%;
          box-sizing: border-box;
        }

        /* ===== 价值主张区域 ===== */
        .value-proposition-card {
          background: transparent;
          border: none;
          border-radius: 0;
          padding: 0;
          box-shadow: none;
          position: relative;
          overflow: visible;
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
        }

        .value-proposition-card::before,
        .value-proposition-card::after {
          display: none;
        }
        
        .card-section {
          flex-shrink: 0;
        }
        
        .card-section:last-child {
          position: relative;
        }
        
        .vertical-spacer {
          flex: 1;
          min-height: 0;
        }

        .value-title {
          font-size: clamp(1.5rem, 5vw, 2rem); /* Fluid font size to prevent wrap */
          font-weight: 500;
          color: #111827;
          margin-bottom: 10px; /* 10px spacing */
          line-height: 1.2;
          letter-spacing: -0.02em;
          white-space: nowrap; /* Force single line */
        }

        .value-title::after {
          display: none;
        }

        .title-divider {
          width: 100%;
          height: 1px;
          background: #E5E7EB;
          margin-bottom: 10px; /* 10px spacing below divider */
        }

        .gradient-text {
          background: linear-gradient(135deg, #7D9ED4 0%, #F7AEBF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 600;
        }

        /* ===== Features列表 ===== */
        .features-list {
          display: flex;
          flex-direction: column;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1.25rem;
          padding: 0;
          position: static;
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
          margin-top: -0.125rem;
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
          font-size: 1rem;
          line-height: 1.6;
          margin: 0;
          font-weight: 400;
        }

        .feature-text strong {
          font-weight: 600;
        }

        /* ===== 行动按钮 ===== */
        /* ===== 行动按钮 ===== */
        .primary-button {
          width: 100%;
          background: linear-gradient(90deg, #F7AEBF 0%, #9b90da 100%);
          color: white;
          font-weight: 500;
          padding: 0.875rem 2rem;
          border-radius: 12px;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        @media (max-width: 1023px) {
          .sticky-mobile-button {
            position: fixed !important;
            bottom: calc(10px + env(safe-area-inset-bottom)) !important; /* Adapt to Safari bottom bar/Home Indicator */
            left: 0 !important;
            right: 0 !important;
            margin: 0 auto !important;
            width: calc(100% - 20px) !important;
            max-width: 500px;
            z-index: 1000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
          }
        }

        /* ===== Kit Section Styles ===== */
        .kit-details-block {
          display: flex;
          flex-direction: column;
          width: 100%;
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

        .primary-button:hover:not(:disabled),
        .payment-button:hover:not(:disabled) {
          background: linear-gradient(90deg, #F7AEBF 0%, #9b90da 100%);
          transform: none;
          filter: none;
        }

        .secondary-button:hover {
          background: #7D9ED4;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(125, 158, 212, 0.3);
        }

        .primary-button:disabled,
        .payment-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* ===== 信任提示样式 ===== */
        .trust-indicators {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
          height: 1rem;
          margin-top: 0.5rem;
        }

        .trust-item {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
          text-align: center;
          line-height: 1.4;
        }

        /* ===== 卡片样式 ===== */
        .features-card,
        .pricing-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          box-shadow: none;
          padding: 2.5rem;
        }
        
        /* Mobile: reduce horizontal padding for features-card */
        @media (max-width: 768px) {
          .features-card {
            padding: 1.5rem 0.5rem;
          }
        }

        .glass-up {
          background: rgba(255,255,255,0.8);
          border: 1px solid rgba(255,255,255,0.5);
          box-shadow: none;
        }

        .surface-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.86) 100%);
          border: 1px solid rgba(229, 231, 235, 0.45);
          box-shadow: none;
        }

        /* ===== FAQ样式 ===== */
        .faq-item {
          background: rgba(255,255,255,0.98);
          border: 1px solid rgba(229,231,235,0.45);
          border-radius: 12px;
          overflow: hidden;
          transition: border-color .18s ease, box-shadow .18s ease;
        }

        .faq-item:hover { 
          border-color: #e9d5ff; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .faq-item.open { 
          background: #ffffff; 
          border-color: #e9d5ff; 
        }

        .faq-item + .faq-item { 
          margin-top: 0.5rem; 
        }

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
        
        .faq-icon {
          font-size: 1.5rem;
          color: #111827;
          font-weight: 600;
        }

        .faq-item:hover .faq-q { 
          color: #0f172a; 
        }



        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.15s cubic-bezier(0.4, 0, 0.2, 1), padding-bottom 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0 1.1rem;
        }

        .faq-item.open .faq-answer {
          max-height: 300px;
          padding-bottom: 1rem;
        }

        .faq-answer p {
          color: #4b5563;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .faq-answer p strong {
          font-weight: 600;
          color: #1f2937;
        }

        .faq-list {
          display: grid;
          gap: 12px;
        }

        .faq-a-steps {
          color: #374151;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .step-line {
          display: flex;
          margin-bottom: 0.5rem;
        }

        .step-number {
          min-width: 4em;
          font-weight: 400;
        }

        .step-content {
          flex: 1;
        }

        .step-content strong {
          font-weight: 600;
          color: #1f2937;
        }

        /* ===== 响应式设计 ===== */

        /* 1024px以上屏幕 - 启用等距布局 */
        @media (min-width: 1024px) {
          .vertical-spacer {
            flex: 1;
            min-height: 0;
          }
          
          .product-info {
            height: 100%;
            min-height: 100%;
          }
        }
        
        /* 1200px以上屏幕 - 微调 */
        @media (min-width: 1200px) {
          .vertical-spacer {
            flex: 1;
            min-height: 0;
          }
        }

        /* 小于1200px屏幕 - 调整字体 */
        @media (max-width: 1199px) {
          .value-title {
            font-size: 1.375rem;
            line-height: 1.3;
          }
          
          .feature-item {
            margin-bottom: 0.75rem;
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
            font-size: 0.95rem;
            line-height: 1.5;
          }
          
          .primary-button {
            padding: 0.75rem 1.5rem;
            font-size: 0.9rem;
            border-radius: 12px;
          }
        }

        /* 小于1024px屏幕 - 单列布局 */
        @media (max-width: 1023px) {
          .buy-container {
            padding: 0 16px; /* Match index.jsx content-container mobile padding */
          }
          
          .product-showcase {
            justify-content: center;
            margin: 0 auto;
            /* Removed restrictive max-height to let aspect ratio control height */
          }
          
          .product-info {
            display: flex;
            height: auto;
            padding: 0;
          }
          
          .features-card.value-proposition-card {
            display: flex;
            flex-direction: column;
            flex: none;
            padding: 0; /* Ensure this overrides the .features-card 2.5rem padding */
          }
          
          .card-section:last-child {
            position: static;
          }
          
          .value-title {
            font-size: 1.25rem;
            line-height: 1.3;
            text-align: center;
          }
          
          .vertical-spacer {
            flex: none;
            height: 1.25rem;
          }
          
          .trust-indicators {
            position: static;
            margin-top: 0.5rem;
            height: auto;
          }
          
          .feature-item {
            margin-bottom: 0.75rem;
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
            font-size: 0.9rem;
            line-height: 1.5;
          }
          
          .primary-button {
            padding: 0.75rem 1.5rem;
            font-size: 0.9rem;
            border-radius: 12px;
          }
        }

        /* 小于768px屏幕 - 移动端优化 */
        @media (max-width: 768px) {
          h1 {
            white-space: normal;
            font-size: 2rem !important;
            line-height: 1.2;
            font-weight: 800;
            color: #111827;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
          }
          
          .buy-container {
            padding: 0 16px; /* Match index.jsx content-container mobile padding */
          }
          
          .product-info {
            padding: 0;
          }
          
          .value-proposition-card {
            padding: 0;
          }
          
          .card-section:last-child {
            position: static;
          }
          
          .value-title {
            font-size: 1.375rem;
            padding-left: 0;
            text-align: center;
          }
          
          .vertical-spacer {
            flex: none;
            height: 0.875rem;
          }
          
          .trust-indicators {
            position: static;
            margin-top: 0.5rem;
            height: auto;
          }
          
          .feature-item {
            padding-left: 0;
            margin-bottom: 0.5rem;
          }
          
          .feature-icon-container {
            width: 18px;
            height: 18px;
            margin-right: 0.4rem;
            margin-top: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .feature-icon {
            width: 14px;
            height: 14px;
          }
          
          .feature-text {
            font-size: 0.8rem;
          }
          
          .primary-button {
            padding: 0.6875rem 1.5rem;
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

        /* 小于480px屏幕 - 小屏优化 */
        @media (max-width: 480px) {
          h1 {
            font-size: 1.75rem !important;
            line-height: 1.1;
            font-weight: 800;
            color: #111827;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
          }
        }
        
        /* Mobile width fixes - apply to all small screens */
        @media (max-width: 768px) {
          /* Remove max-width constraint for wider sections */
          .max-w-6xl {
            max-width: 100% !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          
          /* Remove main element horizontal padding */
          main.px-4 {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          
          /* Buy-container padding - match content-container */
          .buy-container {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          
          /* Remove grid gap on mobile */
          .grid.gap-8 {
            gap: 16px !important;
          }
          
          /* Product info full width */
          .product-info {
            width: 100% !important;
            max-width: 100% !important;
          }
          
          /* Value proposition card - remove any constraints */
          .value-proposition-card {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          
          /* Kit details block full width */
          .kit-details-block {
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Features card (FAQ wrapper) - minimal padding on mobile */
          .features-card {
            padding: 12px 8px !important;
            border-radius: 16px !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          /* FAQ section specific - no horizontal padding */
          .features-card.glass-up.surface-card {
            padding: 16px 0 !important;
          }
          
          /* FAQ items full width */
          .faq-item {
            width: 100% !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            border-radius: 12px !important;
          }
          
          /* Space between FAQ items */
          .space-y-3 {
            padding: 0 !important;
          }
        }
      `}</style>
    </>
  );
}
