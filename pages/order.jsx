import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import BlueTopBar from '../components/BlueTopBar';
import ProductCarousel from '../components/ProductCarousel';
import { useLanguage } from '../context/LanguageContext';
import { trackInitiateCheckout } from '../lib/fbq';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import ImpactSection from '../components/sections/ImpactSection';
import OrderStepsSection from '../components/sections/OrderStepsSection';
import PrivacySection from '../components/sections/PrivacySection';
import KitCategories from '../components/KitCategories';
import PopModal from '../components/PopModal';

// ISR (Incremental Static Regeneration): Fast load + near-realtime data
// - Build/revalidate: Fetch from Google Script → cache result
// - User opens page: Instantly shows cached value (极快)
// - Client-side: Silent refresh for absolute latest
const FALLBACK_REMAINING = 97; // Used only if Google Script completely fails
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyC8hgXKH7L9JJf2JpFvfDhrjyO00saKSEs3enX1ppC8RzkHn7PZnuBGmkhH7jhFJmwNg/exec';

export async function getStaticProps() {
  let initialRemaining = FALLBACK_REMAINING;

  // Skip slow Google Script fetch in development (client-side will refresh anyway)
  if (process.env.NODE_ENV === 'production') {
    try {
      // Fetch during build/revalidation (not blocking user request in production)
      const res = await fetch(GOOGLE_SCRIPT_URL);
      const data = await res.json();
      if (typeof data.remaining === 'number') {
        initialRemaining = data.remaining;
      }
    } catch (err) {
      console.log('[ISR] Google Script fetch failed, using fallback:', FALLBACK_REMAINING);
    }
  }

  return {
    props: {
      initialRemaining,
    },
    revalidate: 60, // Re-fetch every 60 seconds in background (production only)
  };
}

export default function OrderPage({ initialRemaining }) {
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);
  const [checkoutSource, setCheckoutSource] = useState(null);


  // Scarcity state: Initialize with SSR value (instant display, no spinner)
  const [reservationsCount, setReservationsCount] = useState(initialRemaining ?? FALLBACK_REMAINING);
  const totalSpots = 500;

  useEffect(() => {
    // Silent background refresh for fresh stock count (non-blocking)
    fetch('/api/stock-count')
      .then(res => res.json())
      .then(data => {
        if (typeof data.remaining === 'number' && data.remaining !== reservationsCount) {
          setReservationsCount(data.remaining);
        }
      })
      .catch(() => {
        // Silently ignore - we already have SSR value
      });
  }, []);

  // Stripe Payment Link (from Stripe Dashboard)
  // Change this in Dashboard if price changes - no code change needed
  const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/aFa9ASdzF3Kv6ck9WfbbG01';

  const handleFastCheckout = (source) => {
    if (checkoutSource) return;
    setCheckoutSource(source);

    // Track Pixel/GA with source info
    // source will be 'top' or 'bottom' or 'pop-modal'
    trackInitiateCheckout({ content_name: source || 'unknown' });

    // Use dynamic Checkout Session API instead of static link
    fetch('/api/payment/stripe/checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourcePage: 'order', // Signal to backend to use "Pre-order" product name
        leadId: 'order_' + Date.now(), // Basic lead tracking
        returnUrl: window.location.origin, // Ensure redirects come back to the correct domain/port
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          window.location.href = data.url;
        } else {
          console.error('No checkout URL returned:', data);
          alert('Something went wrong. Please try again.');
          setCheckoutSource(null);
        }
      })
      .catch((err) => {
        console.error('Checkout error:', err);
        alert('Connection error. Please try again.');
        setCheckoutSource(null);
      });
  };

  /* Scroll Trigger Logic for PopModal */
  const [showScrollModal, setShowScrollModal] = useState(false);
  const [hasTriggeredScrollModal, setHasTriggeredScrollModal] = useState(false); // Ref equivalent

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let hasTriggered = false; // Local var to prevent double firing in effect cycle

    function triggerModal() {
      if (hasTriggered) return;
      hasTriggered = true;
      setShowScrollModal(true);
      window.removeEventListener('scroll', handleScroll);
    }

    function handleScroll() {
      if (hasTriggered) return;

      const impactSection = document.querySelector('.impact-section');
      if (!impactSection) return;
      const rect = impactSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Trigger when bottom of impact section enters viewport (or is scrolled past)
      if (rect.bottom <= windowHeight) {
        triggerModal();
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 硬编码中英文内容
  const translations = {
    en: {
      title: 'Reserve VIP Spot - Unicorn Blocks',
      header: {
        badge: 'Selected VIP', // Badge (Not rendered in new design but kept for reference)
        priceVIP: 'Not Just Stacking-Creating!',
        priceRetail: '', // Unused
        deposit: "Meet Sparky：The magical block buddy who tells stories to inspire kids' creative building",
        scarcityPrefix: 'Only',
        scarcitySuffix: 'VIP bundles remaining'
      },
      ctaButton: 'Order Now',
      learnMoreButton: 'Learn More',
      trustNote: '✔ Fully Refundable $5 Deposit · ✔ Safe Checkout',
      features: {
        title: "Unicorn Blocks VIP Bundle",
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
            q: 'What age group are Unicorn blocks suitable for?',
            a: '**Ages 3-8.** We personalize the fun! By setting your child\'s age, the system switches between story modes and difficulty levels to deliver an experience that\'s just right for them.'
          },
          {
            q: 'Is the toy safe for children?',
            a: '**Absolutely!** Our building blocks include a camera that fosters creativity. However, it is **disabled by default and requires explicit parental consent through our app to activate**. You own all data, with the ability to view, manage, and permanently delete it at any time.'
          },
          {
            q: 'When will I receive the product?',
            a: 'We expect Unicorn Blocks to ship around April 2026. Before shipping, we’ll email you to confirm. If it’s not the right time, you can cancel for a full refund — no questions asked.'
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
      ctaButton: 'Reserve My VIP Price',
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
            q: '适合多大年龄的孩子？',
            a: '**适合3-8岁**。我们会根据你设置的年龄在故事模式与难度之间切换，为孩子提供恰到好处的体验。'
          },
          {
            q: '这款玩具对儿童安全吗？',
            a: '**当然安全！**积木内置的摄像头用于激发创造力，但**默认关闭，需在家长App中明确授权后才会启用**。数据完全归你所有，你可随时查看、管理并永久删除。'
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
      <BlueTopBar onCheckout={() => handleFastCheckout('top')} isLoading={checkoutSource === 'top'} />

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
                  <span className="pricing-vip">
                    {language === 'zh' ? (
                      t.header.priceVIP
                    ) : (
                      <>Not Just Stacking—<span className="text-gradient-highlight">Creating!</span></>
                    )}
                  </span>
                </div>

                {/* Row 2 & 3: Body + Scarcity */}
                <div className="pricing-row-sub">
                  <div className="pricing-deposit-text">
                    {language === 'zh' ? (
                      t.header.deposit
                    ) : (
                      <>Meet Sparky：The magical block buddy who tells stories to inspire kids' creative building</>
                    )}
                  </div>
                  <div className="spec-pills-container">
                    <div className="spec-pill">
                      <span className="spec-pill-icon">✨</span> Ages 3–8
                    </div>
                    <div className="spec-pill">
                      <span className="spec-pill-icon">🧱</span> Works with LEGO®
                    </div>
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

                    {/* Spec Pills Moved to Header */}

                    {/* Price Block */}
                    <div className="price-block">
                      <div className="price-row">
                        <span className="current-price">$199</span>
                        <span className="original-price">$249</span>
                        <span className="save-badge">Save $50</span>
                      </div>
                    </div>

                    {/* Review Rating */}
                    <div
                      className="rating-action"
                      onClick={() => document.getElementById('our-family')?.scrollIntoView({ behavior: 'smooth' })}
                      role="button"
                      tabIndex={0}
                    >
                      <span className="rating-score">4.8</span>
                      <div className="rating-stars-container">
                        <span className="star filled">★</span>
                        <span className="star filled">★</span>
                        <span className="star filled">★</span>
                        <span className="star filled">★</span>
                        <span className="star partial">★</span>
                      </div>
                      <span className="rating-text">400+ reviews</span>
                      <span className="rating-arrow">^</span>
                    </div>
                  </div>

                  <div className="card-section">
                    <div className="title-divider"></div>
                  </div>

                  <div className="card-section">
                    <div className="kit-details-block">
                      {t.kit && t.kit.categories && <KitCategories categories={t.kit.categories} initialState={[false, false, false, false]} />}
                    </div>
                  </div>

                  <div style={{ height: '10px', flex: 'none' }}></div>

                  {/* 行动按钮 */}
                  <div className="card-section">
                    <div className="mobile-sticky-wrapper">
                      {/* Stock Indicator - Moved above button */}
                      <div className="flex items-center justify-center gap-1.5 mb-1 text-xs font-medium text-[#DC2626] bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm w-fit mx-auto">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></span>
                        Only 3 VIP Bundles Remaining
                      </div>

                      <button
                        className={`primary-button button-shine ${checkoutSource ? 'opacity-80 cursor-wait' : ''}`}
                        onClick={() => handleFastCheckout('bottom')}
                        disabled={!!checkoutSource}
                      >
                        {checkoutSource === 'bottom' ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          <div className="flex items-center justify-center gap-1 leading-tight text-sm sm:text-base">
                            <span className="font-bold">Order Now</span>
                          </div>
                        )}
                      </button>
                    </div>

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
        <OrderStepsSection style={{ marginTop: 0 }} />

        {/* What Happens After You Reserve Section - HIDDEN */}
        {false && (
          <section className="reserve-flow-section">
            <div className="reserve-flow-container">
              <h2 className="reserve-flow-title">What Happens Next</h2>
              <div className="reserve-flow-card">
                <div className="reserve-flow-steps">
                  <div className="reserve-flow-step">
                    <div className="reserve-flow-badge">1</div>
                    <div className="reserve-flow-content">
                      <span className="reserve-flow-label">Step 1</span>
                      <p className="reserve-flow-description">Pre-order with a $5 refundable payment</p>
                    </div>
                  </div>
                  <div className="reserve-flow-step">
                    <div className="reserve-flow-badge">2</div>
                    <div className="reserve-flow-content">
                      <span className="reserve-flow-label">Step 2</span>
                      <p className="reserve-flow-description">Your $149 VIP Price (<span className="retail-price">Retail $199</span>) is Locked plus Early Shipping</p>
                    </div>
                  </div>
                  <div className="reserve-flow-step">
                    <div className="reserve-flow-badge">3</div>
                    <div className="reserve-flow-content">
                      <span className="reserve-flow-label">Step 3</span>
                      <p className="reserve-flow-description">Before shipping (April 2026), we'll email you to confirm — or cancel for a full refund.</p>
                    </div>
                  </div>
                </div>
                <div className="reserve-flow-trust">
                  ✅ Fully refundable $5 pre-order · ✅ 400+ families pre-ordered
                </div>
              </div>
            </div>
          </section>
        )}

        <TestimonialsSection />
        <ImpactSection />
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
          margin-bottom: 0; /* Reduced from 0.5rem */
          padding: 0 0.5rem;
          width: 100%;
        }

        .pricing-block.open-style {
          background: transparent;
          border: none;
          box-shadow: none;
          padding: 0.25rem 0; /* Reduced from 1rem 0 */
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
          width: fit-content;
          max-width: 100%;
          gap: 2px; /* Reduced from 0.5rem to minimize title-to-tags gap */
          margin: 0 auto;
          padding-left: 0;
          padding-right: 0;
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
          
          /* Force rows to left align on desktop */
            justify-content: flex-start;
            align-items: flex-start;
            text-align: left;
          }

          .pricing-row-sub {
             width: 100%; /* Force full width to match Title so tags can center */
             align-items: center; /* Center children (pills container) */
          }
          
          .pricing-row-main {
             justify-content: flex-start;
          }
        }
        
        .pricing-row-sub {
            display: flex;
            flex-direction: column;
            align-items: flex-start; /* Left align on Mobile too */
            gap: 4px; 
            white-space: normal;
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
          display: none; /* Hidden as requested */
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
        /* PC / Desktop Overrides: Align Header Center (Removed Left Align) */
        @media (min-width: 1024px) {
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

        /* ===== Reserve Flow Section ===== */
        .reserve-flow-section {
          padding: 5rem 1rem 3rem;
          background: linear-gradient(180deg, rgba(235, 241, 255, 0.5) 0%, rgba(255, 237, 228, 0.5) 100%);
        }

        .reserve-flow-container {
          max-width: 72rem;
          margin: 0 auto;
        }

        .reserve-flow-title {
          text-align: center;
          font-size: clamp(1.5rem, 4vw, 2.25rem);
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .reserve-flow-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 2rem 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }

        .reserve-flow-steps {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .reserve-flow-step {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: linear-gradient(135deg, #f8f9ff 0%, #fff8f6 100%);
          border-radius: 16px;
        }

        .reserve-flow-badge {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #F7AEBF 0%, #9b90da 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
          box-shadow: 0 2px 8px rgba(155, 144, 218, 0.3);
        }

        .reserve-flow-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .reserve-flow-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #9b90da;
        }

        .reserve-flow-description {
          font-size: 1rem;
          font-weight: 500;
          color: #374151;
          margin: 0;
          line-height: 1.5;
        }

        .reserve-flow-trust {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
        }

        /* Desktop: 3-column grid */
        @media (min-width: 768px) {
          .reserve-flow-section {
            padding: 4rem 2rem;
          }

          .reserve-flow-card {
            padding: 2.5rem;
          }

          .reserve-flow-steps {
            flex-direction: row;
            gap: 1.5rem;
          }

          .reserve-flow-step {
            flex: 1;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 1.5rem 1rem;
          }

          .reserve-flow-content {
            align-items: center;
          }

          .reserve-flow-badge {
            width: 56px;
            height: 56px;
            font-size: 1.5rem;
            border-radius: 16px;
            margin-bottom: 0.5rem;
          }

          .reserve-flow-description {
            font-size: 1.05rem;
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

        /* ===== Spec Pills ===== */
        .spec-pills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center; /* Centered as requested */
          width: 100%; /* Ensure full width for centering */
          margin-top: 0px; /* Reduced to 0 to minimize top gap */
          margin-bottom: 2px; /* Small bottom gap to match visual balance */
        }

        .spec-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          background: linear-gradient(90deg, #F0EEF8 0%, #FBF6FC 100%);
          border: 1px solid #E9D5FF;
          color: #4F475D;
          font-size: 0.85rem;
          font-weight: 600;
          line-height: 1;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
          white-space: nowrap;
        }

        /* Desktop: Ensure tags remain centered despite parent left-align */
        @media (min-width: 1024px) {
          .spec-pills-container {
            justify-content: center !important;
            margin-left: auto;
            margin-right: auto;
            width: 100%;
          }
        }
        
        .spec-pill-icon {
           font-size: 1.1em;
           line-height: 1;
        }
        
        .vertical-spacer {
          flex: 1;
          min-height: 0;
        }

        .value-title {
          font-size: clamp(1.5rem, 5vw, 2rem); /* Fluid font size to prevent wrap */
          font-weight: 500;
          color: #111827;
          margin-bottom: 4px; /* Reduced from 10px */
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

        .text-gradient-highlight {
          background: linear-gradient(90deg, #F7AEBF 0%, #9b90da 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
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
          padding: 0.75rem 1rem; /* Reduced padding for height */
          border-radius: 12px;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        @media (max-width: 1023px) {
          .mobile-sticky-wrapper {
            position: fixed !important;
            bottom: calc(10px + env(safe-area-inset-bottom)) !important; /* Adapt to Safari bottom bar/Home Indicator */
            left: 0 !important;
            right: 0 !important;
            margin: 0 auto !important;
            width: calc(100% - 20px) !important;
            max-width: 500px;
            z-index: 1000;
            background: transparent; /* Removed background */
            padding: 0; /* Removed padding */
            pointer-events: none; /* Let clicks pass through empty space */
          }
          /* Re-enable pointer events for children */
          .mobile-sticky-wrapper > * {
            pointer-events: auto;
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

        /* ===== Price Block Styles ===== */
        .price-block {
          margin-bottom: 0px; /* Reduced from 4px to tighten gap */
        }
        
        .price-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }
        
        .current-price {
          font-size: clamp(1.5rem, 5vw, 2rem); /* Match Value Title Size */
          font-weight: 500; /* Match Value Title Weight (removed bold) */
          color: #111827;
          line-height: 1;
        }
        
        .original-price {
          font-size: 1.15rem; /* Reduced from 1.5rem */
          font-weight: 400;
          color: #9CA3AF;
          text-decoration: line-through;
        }
        
        .save-badge {
          background: #FEF2F2;
          color: #DC2626;
          font-weight: 600;
          font-size: 0.875rem;
          padding: 4px 8px;
          border-radius: 6px;
          align-self: center;
        }

        /* Mobile override for save-badge */
        @media (max-width: 768px) {
          .save-badge {
             background: transparent;
             padding: 0;
          }
        }

        /* ===== Rating Block Styles ===== */
        .rating-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          margin-bottom: 4px; /* Reduced to 4px to match consistent spacing */
          width: fit-content;
        }
        
        .rating-score {
          font-weight: 400; /* Normal weight as requested */
          color: #111827;
          font-size: 1rem;
          line-height: 1;
        }
        
        .rating-stars-container {
          display: flex;
          align-items: center;
          gap: 1px;
        }

        .star {
          font-size: 1.1rem;
          line-height: 1;
        }

        .star.filled {
          color: #9b90da; /* Theme Purple */
        }

        .star.partial {
          background: linear-gradient(90deg, #9b90da 80%, #DBEAFE 80%); /* 80% Purple, 20% Light Grey/White */
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }

        .rating-text {
          font-size: 0.9rem;
          color: #6B7280; /* Grey text */
          text-decoration: none; /* No underline */
          font-weight: 400;
          margin-left: 2px;
        }
        
        .rating-arrow {
            font-size: 0.8rem;
            color: #9CA3AF;
            transform: rotate(180deg);
            display: inline-block;
            margin-left: 4px;
        }
        
        .rating-action:hover .rating-text {
            color: #111827;
        }
        
        /* Mobile: Ensure it is centered or left aligned as per rest of UI */
        @media (max-width: 768px) {
             .rating-action {
                 /* Inherit flex alignment from parent */
             }
        }

        /* ===== Stock Indicator Styles ===== */
        .stock-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          color: #DC2626;
          font-weight: 600;
          font-size: 0.95rem;
          animation: fadeIn 0.5s ease-out;
        }
        
        .pulsing-dot {
          width: 8px;
          height: 8px;
          background-color: #DC2626;
          border-radius: 50%;
          position: relative;
        }
        
        .pulsing-dot::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background-color: #DC2626;
          border-radius: 50%;
          animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
        
        @keyframes pulse-ring {
          0% {
            transform: scale(0.9);
            opacity: 1;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
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

        /* ===== Mobile Tweaks ===== */
        @media (max-width: 768px) {
          .price-row {
            justify-content: flex-start; /* Left align on Mobile */
          }
        }
        
        /* Desktop: Left Align Title & Price */
        @media (min-width: 1024px) {
          .value-title {
            text-align: left;
          }
          .price-row {
            justify-content: flex-start;
          }
        }

        @media (max-width: 1023px) {
           /* Removed fixed stock indicator styles */
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
            text-align: left; /* Left align on Mobile */
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
            text-align: left; /* Left align on Mobile */
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

          /* Spec Pills - Mobile Overrides */
          .spec-pills-container {
             justify-content: center !important;
             margin-top: 10px;
             margin-bottom: 10px; /* Reduced to avoid gap */
          }
          
          .spec-pill {
             padding: 6px 10px;
             font-size: 13px;
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
      {/* Reuse existing sections */}
      {/* ... */}
      {/* Reuse existing sections */}

      {/* Scroll Triggered PopModal */}
      {
        showScrollModal && (
          <PopModal
            onClose={() => setShowScrollModal(false)}
            isVip={true}
            source="pop-modal"
            customTitle="Join VIP Families ❤️"
            customBody={
              <>
                Reserve your <span>$149 VIP price</span> with a <span>$5 refundable deposit</span>
                <br />
                ✅ Trusted by <span>400+ families</span>
              </>
            }
            customCtaText="Pre-Order Now for $5"
            showEmailInput={false}
            onAction={() => handleFastCheckout('pop-modal')}
          />
        )
      }
    </>
  );
}
