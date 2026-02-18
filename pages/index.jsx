import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import KitCarousel from '../components/KitCarousel';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import { safeApiCall } from '../lib/api';
import { getStepsMobileImage } from '../lib/content';
import { useLanguage } from '../context/LanguageContext';
import { trackInitiateCheckout } from '../lib/fbq';
import {
  INDEX_POSTLEAD_RESERVE_CLICK_EVENT,
  INDEX_POSTLEAD_VIP_LEAD_EVENT,
  emitIndexPostLeadReserveResult,
  isIndexPostLeadReserveMode,
  setIndexPostLeadReserveMode,
} from '../lib/postLeadReserve';

import dynamic from 'next/dynamic'
import BlueTopBar from '../components/BlueTopBar';
import { isVipHost } from '../lib/domain';
import KitCategories from '../components/KitCategories';
import OrderStepsSection from '../components/sections/OrderStepsSection';
const PopModal = dynamic(() => import('../components/PopModal'), { ssr: false });
const SurveyModal = dynamic(() => import('../components/SurveyModal'), { ssr: false });
const PostLeadOfferModal = dynamic(() => import('../components/PostLeadOfferModal'), { ssr: false });

const SURVEY_PREFILL_EMAIL_KEY = 'unicorn_survey_prefill_email';
const POST_LEAD_AB_STORAGE_KEY = 'ub_postlead_flow_v1';


export default function Home({ isVip = false }) {
  const router = useRouter();
  const [popOpen, setPopOpen] = useState(false);
  const [autoPopSource, setAutoPopSource] = useState('AutoPopModalEvent');
  const [showPostLeadOfferModal, setShowPostLeadOfferModal] = useState(false);
  const [showPostLeadSurveyModal, setShowPostLeadSurveyModal] = useState(false);
  const [postLeadCheckoutSource, setPostLeadCheckoutSource] = useState(null);
  const [postLeadSurveyEmail, setPostLeadSurveyEmail] = useState('');
  const [trafficSource, setTrafficSource] = useState('vip');
  const [postLeadExperiment, setPostLeadExperiment] = useState({ group: null, forced: false });
  const [showReserveDiscountCta, setShowReserveDiscountCta] = useState(false);
  const [familyPage, setFamilyPage] = useState(0); // 添加家庭见证页面状态

  // 弹窗只弹一次
  // 弹窗逻辑：滚动到底部 OR 停留3秒
  const popTimerRef = useState(null); // actually useRef is better but I can use a local var in useEffect scope if I don't need it elsewhere, simpler to use useRef globally in component or just vars in useEffect closure if no re-renders mess it up.
  // Actually, to be safe across re-renders (though this useEffect is [] dependency), I'll use refs inside the component body or just let the closure handle it if [] is true.
  // But let's use refs to be React-clean.
  const timerRef = useState(null); // misuse of useState, wait.

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // const closed = localStorage.getItem('popModalClosed');
    // if (closed) return;

    let timerId = null;
    let hasTriggered = false;

    function triggerModal(triggerType = 'event') {
      if (hasTriggered) return;
      hasTriggered = true;
      setAutoPopSource(triggerType === 'scroll' ? 'AutoPopModalScroll' : 'AutoPopModalEvent');
      setPopOpen(true);
      if (timerId) clearTimeout(timerId);
      window.removeEventListener('scroll', handleScroll);
    }

    function handleScroll() {
      if (hasTriggered) return;

      const privacySection = document.querySelector('.privacy-section');
      if (!privacySection) return;
      const rect = privacySection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // 1. Scroll-to-bottom Logic (Now for Privacy Section)
      if (rect.bottom <= windowHeight) {
        triggerModal('scroll');
        return;
      }

      // 2. Dwell Logic: 3 seconds in Privacy Section
      const isVisible = rect.top < windowHeight && rect.bottom > 0;

      if (isVisible) {
        if (!timerId) {
          timerId = setTimeout(() => {
            triggerModal('scroll');
          }, 3000);
        }
      } else {
        if (timerId) {
          clearTimeout(timerId);
          timerId = null;
        }
      }
    }

    // 3. New Global Logic: 40 seconds residency
    const globalTimeoutId = setTimeout(() => {
      triggerModal('event');
    }, 40000);

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timerId) clearTimeout(timerId);
      if (globalTimeoutId) clearTimeout(globalTimeoutId);
    };
  }, []);

  useEffect(() => {
    if (!router.isReady || typeof window === 'undefined') return;
    const sourceFromUrl = typeof router.query.source === 'string' ? router.query.source : '';
    if (sourceFromUrl) {
      setTrafficSource(sourceFromUrl);
    }
    const cachedEmail = sessionStorage.getItem(SURVEY_PREFILL_EMAIL_KEY);
    if (cachedEmail) {
      setPostLeadSurveyEmail(cachedEmail);
    }
    if (isIndexPostLeadReserveMode()) {
      setShowReserveDiscountCta(true);
    }
  }, [router.isReady, router.query.source]);
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);

  const translations = {
    en: {
      meta: {
        title: 'Unicorn Blocks | Not Just Stacking, Creating!',
        description:
          'Meet Sparky, the magical block buddy that turns every build into a story. Spark creativity, unlock STEAM skills, and keep playtime screen-free with uncompromising privacy.',
        keywords:
          'Sparky, Unicorn Blocks, STEM toys, STEAM learning, creative play, AI toys, educational building blocks, privacy-first kids tech'
      },
      hero: {
        title: {
          primary: 'Not Just Stacking',
          accent: 'Creating!'
        },
        description:
          'Meet Sparky：The magical block buddy',
        descriptionLine2:
          'who turns every build into a story',
        badges: [
          { label: 'Compatible with LEGO®', icon: '/assets/image/Vector_17_1381.png' },
          { label: "For Age 3-8", icon: '/assets/image/Vector_17_1385.png' }
        ],
        speechBubble: "Hi! I'm Sparky!"
      },
      kit: {
        heading: 'Everything to Build the Magic',
        subheading: "Meet Sparky's Adventure Kit:",
        button: 'Book Now',
        media: '/assets/reserve-vip-spot/adventure-kit.svg',
        mediaAlt: 'Sparky adventure kit illustration',
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
            title: '4 Magic Hats = Endless Adventures',
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
      family: {
        heading: 'Our Family Says',
        testimonials: [
          {
            quote: '"So much better than watching TV."',
            author: '—Dad of 3-Year- Old'
          },
          {
            quote:
              "“I love that Sparky doesn’t ‘correct’ him. If he says it’s a rocket, Sparky sees a rocket. It really protects his imagination.”",
            author: '—Mom of 5-Year-Old'
          },
          {
            quote:
              '“Pleeease, just five more minutes! I have to light up all the lights on Sparky’s hat!”',
            author: '—Our Little Builder, 5'
          }
        ]
      },
      privacy: {
        /*heading: 'Uncompromising Privacy:',*/
        subheading: "Your Child's Data. Yours Alone",
        tag: 'COPPA Compliant by Design',
        cards: [
          {
            title: 'All Data Stays Yours',
            description:
              'Data is automatically deleted and never shared with third parties. You can review or clear it anytime.'
          },
          {
            title: 'No Eavesdropping. Ever',
            description:
              'Mic and camera are physically off by default. They only activate when you press and hold the button.'
          },
          {
            title: 'No Third-Party Ads',
            description: [
              'A safe, distraction-free play space.',
              'No ads, no tracking, no outside interactions.'
            ]
          }
        ]
      },
      impact: {
        heading: 'Creativity, Focus, and Real Thinking',
        stats: [
          {
            title: '3× Creativity',
            titleLine1: '3×',
            titleLine2: 'Creativity',
            description:
              'Bolder shapes, more colors, richer builds.',
            descriptionMobile: 'Bolder shapes, more colors, richer builds.'
          },
          {
            title: '90 mins Deep Focus Every Time',
            titleLine1: '90',
            titleLine1Small: 'mins',
            titleLine2: 'Deep Focus Every Time',
            description:
              'Kids stay focused longer. You get a real coffee break.',
            descriptionMobile: 'Kids stay focused longer. You get a real coffee break.'
          },
          {
            title: 'STEAM Problem Solving',
            titleLine1: 'STEAM',
            titleLine2: 'Problem Solving',
            description:
              'Kids learn engineering by building and playing.',
            descriptionMobile: 'Kids learn engineering by building and playing.'
          }
        ]
      },
      story: {
        heading: 'From Dreamers to Builders',
        cards: [
          {
            title: 'The Team',
            description:
              'We grew up imagining our toys were alive. Now, as engineers, we’re building the magic we once dreamed of—for the next generation.',
            avatars: ['Bruce', 'Bryan']
          },
          {
            title: 'The Science',
            description:
              'Built with guidance from engineers and researchers at UPenn, Purdue, and other top universities—designed to be joyful, positive, and truly engaging for kids.'
          }
        ],
        milestones: [
          {
            title: 'Verified By 100+ Kids',
            subtitle: 'Refined over 1 year of beta testing'
          },
          {
            title: '40-Year Factory Partner',
            subtitle: 'Industrial-grade quality secured'
          },
          {
            title: 'On Schedule',
            subtitle: 'Shipping Jun 2026'
          }
        ]
      },
      faq: {
        heading: 'FAQs',
        items: [
          {
            question: 'Is the toy safe for children?',
            answer:
              'Absolutely. Unicorn Blocks is designed with safety as a top priority. The camera is disabled by default and can only be activated with explicit parental consent through the app. Parents fully own the data and can view, manage, or permanently delete it at any time.'
          },
          {
            question: 'Is this screen-free?',
            answer:
              'Unicorn Blocks is designed to reduce passive screen time. Kids build with real, physical blocks while Sparky responds to what they create—encouraging hands-on play, imagination, and movement instead of scrolling or watching.'
          },
          {
            question: 'When will I receive it?',
            answer:
              'Shipping is planned for June 2026. We’ll email you before shipping to confirm your order, and you can still cancel for a full refund.'
          },
          {
            question: 'What age group are Unicorn Blocks suitable for?',
            answer:
              'Ages 3–8. By setting your child’s age, the experience adapts with age-appropriate stories and difficulty levels, so it always feels just right.'
          },
          {
            question: 'Can multiple children share one set?',
            answer:
              'Yes, they can share! For the best experience, we recommend one set per child. Each Sparky becomes a personal companion, and having their own set allows every child to enjoy a fully personalized creative journey.'
          },
          {
            question: 'Does it need Wi-Fi to work?',
            answer:
              'You will need Wi-Fi to connect and generate new stories. Once your Sparky is connected, you can move it around your home as long as it stays within range.'
          },
          {
            question: 'Is it hard to set up?',
            answer:
              'Not at all. Setup takes just a few minutes through the parent app. After that, kids can jump straight into building and playing.'
          },
          {
            question: 'What does my child actually learn?',
            answer:
              'Through play, kids develop creativity, spatial thinking, storytelling skills, and early engineering concepts—without it ever feeling like a lesson.'
          },
          {
            question: 'How long will my child stay engaged?',
            answer:
              'Many parents are surprised by how long kids stay focused. Sparky encourages continuous building, experimenting, and storytelling, helping play sessions last far longer than traditional blocks.'
          },
          {
            question: 'Will my child outgrow it quickly?',
            answer:
              'Unicorn Blocks grows with your child. As kids develop, Sparky introduces new challenges and story depth, keeping play fresh, engaging, and age-appropriate over time.'
          },
          {
            question: 'Is it compatible with other building blocks?',
            answer:
              'Yes! Absolutely. Unicorn Blocks are compatible with LEGO®-style blocks, so kids can mix, expand, and build even bigger worlds using the blocks they already love.'
          }
        ]
      },
      messages: {
        emailError: 'Please provide a valid email address',
        subscribeSuccess: 'Thank you for subscribing!',
        subscribeFailed: 'Subscription failed, please try again later',
        connectionError: 'Error connecting to server, please try again later'
      }
    }
  };

  const copy = translations[language] || translations.en;


  // Google Sheets 版订阅 Footer - 使用统一工具函数
  const handleFooterSubmit = async (email, setFooterStatus) => {
    // 动态导入工具函数
    const { submitEmailToGoogleSheets } = await import('../lib/googleSheets');

    const result = await submitEmailToGoogleSheets(email, "index-footer", "");

    if (setFooterStatus) {
      setFooterStatus({
        message: result.success ? copy.messages.subscribeSuccess : result.message,
        type: result.success ? 'success' : 'error'
      });
    }
  };

  const resolvePostLeadExperiment = () => {
    if (typeof window === 'undefined') {
      return { group: 'control', forced: false };
    }

    const params = new URLSearchParams(window.location.search);
    const forcedGroup = params.get('ab_postlead');
    if (forcedGroup === 'control' || forcedGroup === 'variant') {
      return { group: forcedGroup, forced: true };
    }

    const savedGroup = localStorage.getItem(POST_LEAD_AB_STORAGE_KEY);
    if (savedGroup === 'control' || savedGroup === 'variant') {
      return { group: savedGroup, forced: false };
    }

    const assignedGroup = Math.random() < 0.5 ? 'control' : 'variant';
    localStorage.setItem(POST_LEAD_AB_STORAGE_KEY, assignedGroup);
    return { group: assignedGroup, forced: false };
  };

  const buildIndexPopupSource = (actionName) => {
    const sourcePrefix = trafficSource ? `${trafficSource}_` : '';
    const expSuffix = postLeadExperiment.group ? `_${postLeadExperiment.group}` : '';
    const forcedSuffix = postLeadExperiment.forced ? '_forced' : '';
    return `${sourcePrefix}index-popup-${actionName}${expSuffix}${forcedSuffix}`;
  };

  const handleVipLeadSuccess = ({ email: leadEmail, source: leadSource, note: leadNote = '' }) => {
    const normalizedEmail = (leadEmail || '').trim().toLowerCase();
    const normalizedSource = (leadSource || 'pop-modal').toString().trim() || 'pop-modal';
    const normalizedNote = (leadNote || '').toString();
    if (normalizedEmail && typeof window !== 'undefined') {
      sessionStorage.setItem(SURVEY_PREFILL_EMAIL_KEY, normalizedEmail);
      setPostLeadSurveyEmail(normalizedEmail);
    }

    const experiment = resolvePostLeadExperiment();
    setPostLeadExperiment(experiment);

    if (normalizedEmail) {
      const postLeadView = experiment.group === 'variant' ? 'popup' : 'reservenow';
      import('../lib/googleSheets')
        .then(({ submitEmailToGoogleSheets }) =>
          submitEmailToGoogleSheets(
            normalizedEmail,
            normalizedSource,
            normalizedNote,
            { postLeadView }
          )
        )
        .then((result) => {
          if (!result?.success) {
            console.warn('VIP lead submission failed:', result?.message);
            return;
          }

          // Track Lead with Session Deduplication
          if (typeof window !== 'undefined' && !sessionStorage.getItem('lead_tracked_session')) {
            import('../lib/fbq').then(({ trackLead }) => {
              trackLead();
              sessionStorage.setItem('lead_tracked_session', '1');
            });
          }
        })
        .catch((err) => console.warn('VIP lead submission error:', err));
    }

    if (experiment.group === 'control') {
      const params = new URLSearchParams();
      params.set('source', trafficSource || 'vip');
      params.set('postlead_ab', experiment.group);
      if (experiment.forced) params.set('ab_forced', '1');
      router.push(`/reservenow?${params.toString()}`);
      return;
    }

    setPopOpen(false);
    setShowPostLeadOfferModal(true);
  };

  const handlePostLeadReserve = async () => {
    if (postLeadCheckoutSource || typeof window === 'undefined') return;

    const sourceTag = buildIndexPopupSource('reserve');
    setPostLeadCheckoutSource(sourceTag);
    trackInitiateCheckout({ content_name: sourceTag });

    const leadId = `${sourceTag}_order_${Date.now()}`;

    try {
      const res = await fetch('/api/payment/stripe/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourcePage: 'index-popup',
          leadId,
          returnUrl: window.location.origin,
          amount: 2,
        }),
      });

      const data = await res.json();
      if (data.url) {
        setShowReserveDiscountCta(true);
        setIndexPostLeadReserveMode(true);
        window.location.href = data.url;
        return;
      }

      throw new Error(data.error || 'No checkout URL returned');
    } catch (err) {
      console.error('Index post-lead checkout error:', err);
      alert('Connection error. Please try again.');
      emitIndexPostLeadReserveResult('error');
      setPostLeadCheckoutSource(null);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onReserveClick = () => {
      handlePostLeadReserve();
    };
    window.addEventListener(INDEX_POSTLEAD_RESERVE_CLICK_EVENT, onReserveClick);
    return () => {
      window.removeEventListener(INDEX_POSTLEAD_RESERVE_CLICK_EVENT, onReserveClick);
    };
  }, [handlePostLeadReserve]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onVipLeadFromGlobal = (event) => {
      handleVipLeadSuccess(event?.detail || {});
    };
    window.addEventListener(INDEX_POSTLEAD_VIP_LEAD_EVENT, onVipLeadFromGlobal);
    return () => {
      window.removeEventListener(INDEX_POSTLEAD_VIP_LEAD_EVENT, onVipLeadFromGlobal);
    };
  }, [handleVipLeadSuccess]);

  const handlePostLeadNoThanks = () => {
    setShowPostLeadOfferModal(false);
    setShowReserveDiscountCta(true);
    setIndexPostLeadReserveMode(true);
    setShowPostLeadSurveyModal(true);
  };

  const submitIndexPopupSurvey = async (data, sessionId, isPartial) => {
    const payload = {
      ...data,
      source: buildIndexPopupSource('survey'),
      timestamp: new Date().toISOString(),
      sessionId,
      isPartial,
    };

    await fetch('/api/submit-survey', {
      method: 'POST',
      body: JSON.stringify(payload),
      ...(isPartial ? { keepalive: true } : {}),
    });
  };

  const TESTIMONIALS_DATA = [
    {
      quote: '"So much better than watching TV."',
      author: '—Dad of a 3-year-old who usually asks for a screen after dinner'
    },
    {
      quote:
        "“I love that Sparky doesn’t ‘correct’ him. If he says it’s a rocket, Sparky sees a rocket. It really protects his imagination.”",
      author: '—Mom of a 5-year-old who loves pretending everything is a spaceship'
    },
    {
      quote:
        '“Pleeease, just five more minutes! I have to light up all the lights on Sparky’s hat!”',
      author: '—Our Little Builder, 6\nStill playing after 90 minutes'
    },
    {
      quote: '“Sparky, I added a swimming pool next to my house.”',
      author: '—Our Little Builder, 7\nCreated a different swimming pool each time'
    },
    {
      quote: '“I am amazed. He sat there and built for over an hour straight. No screens, just pure focus.”',
      author: '—Mom of a 6-year-old who normally switches toys every 10 minutes'
    },
    {
      quote: '“I want to try the Unicorn Hat next time!”',
      author: '—Our Little Builder, 4\nAlready thinking about the next build'
    }
  ];

  const familyBlocks = TESTIMONIALS_DATA.map((t, idx) => ({
    ...t,
    palette: idx % 2 === 0 ? 'sunset' : 'sky',
    id: `testimonial-${idx}`
  }));

  const renderHighlight = (text) => {
    if (!text || typeof text !== 'string') return text;
    const parts = text.split('—');
    if (parts.length <= 1) return text;

    const lead = parts.shift().trim();
    const rest = parts.join('—').trim();

    // 需要设置为 #6C6767 的文字
    const specialTexts = [
      'Story Sparks Creation',
      'Magic Window',
      'Smart Brain',
      'Privacy Button',
      '7-Hour Playtime',
      'Themes',
      'Creative Journey',
      'Theme Matched',
      'Magical Prize',
      'Limitless Play',
      'Kid-Proof'
    ];
    const isSpecial = specialTexts.some(special => lead.includes(special));

    // 处理换行：将 rest 中的换行符替换为换行+3个空格
    const processedRest = rest.split('\n').map((line, index) =>
      index === 0 ? line : `   ${line}`
    ).join('\n');

    return (
      <>
        <strong style={{ color: isSpecial ? '#6C6767' : '#2f2d65' }}>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#F4C025', marginRight: '8px', verticalAlign: 'middle' }}></span>
          {lead} --
        </strong> <span className="kit-text-rest">{processedRest}</span>
      </>
    );
  };

  // Impact Section 渲染函数（用于在不同位置渲染）
  const renderImpactSection = () => (
    <section className="impact-section">
      <div className="impact-bg-wrapper">
        <div className="impact-bg-image impact-bg-bottom" aria-hidden="true">
          <img src="/assets/ima/Vector_17_927.png" alt="" className="impact-bg-image-item" />
        </div>
        <div className="impact-bg-image impact-bg-top" aria-hidden="true">
          <img src="/assets/ima/Vector_17_928.png" alt="" className="impact-bg-image-item" />
        </div>
      </div>
      <div className="content-container">
        <h2>
          <span>{copy.impact.heading}</span>
        </h2>
        <div className="impact-grid">
          {copy.impact.stats.map((stat, index) => (
            <div className="impact-card" key={stat.title}>
              <div className="impact-icon-wrapper">
                {/* 移动端图片 */}
                <Image
                  src={index === 0 ? '/assets/ima/section6-1.svg' : index === 1 ? '/assets/ima/section6-2.svg' : '/assets/ima/section6-3.svg'}
                  alt=""
                  width={64}
                  height={64}
                  className="impact-icon md:hidden"
                />
                {/* PC端图片 */}
                <Image
                  src={index === 0 ? '/assets/ima/svg 5.svg' : index === 1 ? '/assets/ima/svg 6.svg' : '/assets/ima/svg 7.svg'}
                  alt=""
                  width={64}
                  height={64}
                  className="impact-icon hidden md:block"
                />
              </div>
              {/* PC端标题 */}
              <h3 className="hidden md:block">{stat.title}</h3>
              {/* 移动端标题 */}
              <h3 className="impact-card-title-mobile md:hidden">
                <span className="impact-title-line1">
                  {stat.titleLine1}
                  {stat.titleLine1Small && <span className="impact-title-small">{stat.titleLine1Small}</span>}
                </span>
                <span className="impact-title-line2">{stat.titleLine2}</span>
              </h3>
              {/* PC端描述 */}
              <p className="hidden md:block">{stat.description}</p>
              {/* 移动端描述 */}
              <p className="md:hidden">
                {Array.isArray(stat.descriptionMobile)
                  ? stat.descriptionMobile.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < stat.descriptionMobile.length - 1 && <br />}
                    </span>
                  ))
                  : stat.descriptionMobile
                }
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );




  return (
    <>
      {popOpen && (
        <PopModal
          isVip={isVip}
          source={autoPopSource}
          onVipLeadSuccess={isVip ? handleVipLeadSuccess : undefined}
          onClose={() => {
            setPopOpen(false);
            localStorage.setItem('popModalClosed', '1');
          }}
        />
      )}
      <PostLeadOfferModal
        isOpen={showPostLeadOfferModal}
        onReserve={handlePostLeadReserve}
        onNoThanks={handlePostLeadNoThanks}
        isLoading={!!postLeadCheckoutSource}
      />
      <SurveyModal
        isOpen={showPostLeadSurveyModal}
        prefillEmail={postLeadSurveyEmail}
        onClose={() => setShowPostLeadSurveyModal(false)}
        onSubmit={(data, sessionId) => {
          submitIndexPopupSurvey(data, sessionId, false).catch(err => {
            console.error('Index popup survey submit error:', err);
          });
        }}
        onStepSubmit={(data, sessionId) => {
          submitIndexPopupSurvey(data, sessionId, true).catch(err => {
            console.error('Index popup survey partial submit error:', err);
          });
        }}
      />
      <Head>
        <title>{copy.meta.title}</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={copy.meta.description} />
        <meta name="keywords" content={copy.meta.keywords} />
        <meta name="author" content="Unicorn Blocks" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={copy.meta.title} />
        <meta property="og:description" content={copy.meta.description} />
        <meta property="og:url" content="https://unicornblocks.ai" />
        <meta property="og:site_name" content="Unicorn Blocks" />
        <meta property="og:image" content="https://unicornblocks.ai/assets/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={copy.meta.title} />
        <meta name="twitter:description" content={copy.meta.description} />
        <meta name="twitter:image" content="https://unicornblocks.ai/assets/twitter-image.jpg" />
        <meta name="theme-color" content="#A7C1FF" />
        <meta name="msapplication-TileColor" content="#A7C1FF" />
        <link rel="canonical" href="https://unicornblocks.ai" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: 'Unicorn Blocks',
              description: copy.meta.description,
              brand: {
                '@type': 'Brand',
                name: 'Unicorn Blocks'
              },
              category: 'Educational Toys',
              offers: {
                '@type': 'Offer',
                availability: 'https://schema.org/PreOrder',
                priceCurrency: 'USD',
                url: 'https://unicornblocks.ai/reserve-vip-spot'
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                reviewCount: '150'
              }
            })
          }}
        />
      </Head>

      <div className="background-gradient" />

      {/* 蓝色顶部条 */}
      <BlueTopBar
        showCart={!isVip}
        onVipLeadSuccess={isVip ? handleVipLeadSuccess : undefined}
        showReserveDiscountCta={showReserveDiscountCta}
        onReserveDiscount={handlePostLeadReserve}
        reserveDiscountLoading={!!postLeadCheckoutSource}
      />

      <main className="home-root min-h-screen">
        {/* <Navigation /> */}

        <section className={`hero-block ${!isVip ? 'main-site' : ''}`}>
          <div className="hero-backdrop" aria-hidden="true">
            {/* 移动端图片 */}
            <img
              src="/assets/ima/HeroImageMobile.webp"
              alt=""
              className="hero-background-image md:hidden"
            />
            {/* PC端图片 */}
            <img
              src="/assets/image/HeroImage1230.webp"
              alt=""
              className="hero-background-image hidden md:block"
            />
          </div>

          <div className="hero-shell">
            <div className="hero-eyebrow" style={{ visibility: 'hidden', height: '0', margin: '0', padding: '0' }}>UNICORN Blocks</div>
            <div className="hero-heading">
              <h1>
                <span className="hero-title-primary">{copy.hero.title.primary}</span>
                <span className="hero-title-accent">{copy.hero.title.accent}</span>
              </h1>
              <div className="hero-description-wrapper">
                <p className="hero-description">{copy.hero.description}</p>
                <p className="hero-description hero-description-line2">{copy.hero.descriptionLine2}</p>
              </div>
            </div>

            <div className="hero-badge-row">
              {copy.hero.badges.map((badge, index) => (
                <>
                  <div className="hero-badge" key={badge.label}>
                    <Image
                      src={badge.icon}
                      alt=""
                      width={20}
                      height={20}
                      className="hero-badge-icon"
                    />
                    <span className="hero-badge-text">
                      {badge.label.includes('LEGO') ? (
                        <>
                          Compatible with LEGO<span style={{ fontSize: 'inherit', verticalAlign: 'baseline' }}>®</span>
                        </>
                      ) : (
                        badge.label
                      )}
                    </span>
                  </div>
                  {index < copy.hero.badges.length - 1 && (
                    <span className="hero-badge-separator">|</span>
                  )}
                </>
              ))}
            </div>
          </div>

        </section>

        {/* Impact Section - 主站时显示在这里（第2位） */}
        {!isVip && renderImpactSection()}

        {/* Steps Section - 仅 VIP 域名显示 */}
        {isVip && <OrderStepsSection style={{ marginTop: 0 }} />}

        {/* Kit Section - 仅 VIP 域名显示 */}
        {
          isVip && (<section id="section3" className="kit-section">
            <div className="content-container">
              <div className="kit-heading-block">
                <h2>{copy.kit.heading}</h2>
                <p className="kit-subheading">{copy.kit.subheading}</p>
              </div>

              <div className="kit-layout">
                <div className="kit-media-block">
                  <div className="kit-media-single">
                    <KitCarousel
                      mobileImages={[
                        '/assets/kit/mobile/Sparky.webp',
                        '/assets/kit/mobile/0.webp',
                        '/assets/kit/mobile/1.webp',
                        '/assets/kit/mobile/5.png',
                        '/assets/kit/mobile/2.webp',
                        '/assets/kit/mobile/3.png',
                        '/assets/kit/mobile/4.webp'
                      ]}
                      desktopImages={[
                        '/assets/kit/desktop/Sparky.webp',
                        '/assets/kit/desktop/0.webp',
                        '/assets/kit/desktop/1.webp',
                        '/assets/kit/desktop/5.png',
                        '/assets/kit/desktop/2.webp',
                        '/assets/kit/desktop/3.png',
                        '/assets/kit/desktop/4.webp',
                        '/assets/kit/desktop/6.png'
                      ]}
                    />
                  </div>
                </div>
                <div className="kit-details-block">
                  <KitCategories categories={copy.kit.categories} desktopStatic={true} />
                </div>

              </div>
            </div>
          </section>
          )
        }

        <section className="family-section">
          <div className="family-bg-wrapper">
            <div className="family-bg-image family-bg-top" aria-hidden="true">
              <img src="/assets/ima/Vector_17_1152.png" alt="" className="family-bg-image-item" />
            </div>
            <div className="family-bg-image family-bg-bottom" aria-hidden="true">
              <img src="/assets/ima/Vector_17_1124.png" alt="" className="family-bg-image-item" />
            </div>
          </div>
          <div className="content-container">
            <div className="family-stage">
              <div className="family-header">
                <h2>{copy.family.heading}</h2>
              </div>
              <div className="family-mosaic">
                {familyBlocks.map((block, index) => {
                  const isHiddenOnPC = !(index >= familyPage * 3 && index < (familyPage + 1) * 3);

                  return (
                    <div className={`family-card ${block.palette} ${isHiddenOnPC ? 'hidden-pc' : ''}`} key={block.id}>
                      <div className="family-quote-icon">
                        <img src="/assets/ima/逗号.svg" alt="quote" className="quote-icon" />
                      </div>
                      <div className="family-quote">
                        <p>{block.quote}</p>
                        <span>{block.author}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="family-pagination">
                {[0, 1].map((pageIndex) => (
                  <button
                    key={pageIndex}
                    className={familyPage === pageIndex ? 'active' : ''}
                    onClick={() => setFamilyPage(pageIndex)}
                    aria-label={`显示第${pageIndex + 1}页见证`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={`privacy-section ${!isVip ? 'main-site' : ''}`}>
          <div className="content-container">
            <div className="privacy-heading">
              <div>
                <h2>
                  <span className="privacy-line2">{copy.privacy.subheading}</span>
                </h2>
                <p className="privacy-tag">{copy.privacy.tag}</p>
              </div>
            </div>

            {/* 第一个卡片：All Data Stays Yours */}
            <div className="privacy-card-row">
              <div className="privacy-card-with-text">
                <div className="privacy-card-bg">
                  <Image src="/assets/ima/section5-1.svg" alt="" fill className="privacy-bg-image" />
                </div>
                {/* 移动端左上角图标 */}
                <div className="privacy-card-icon md:hidden">
                  <Image src="/assets/ima/section5-11.svg" alt="" width={48} height={48} />
                </div>
                <div className="privacy-card-content">
                  <h3 style={{ color: '#383838', fontWeight: 'bold' }}>All Data Stays Yours</h3>
                  <p style={{ color: '#646464', }}>
                    Data is automatically deleted and never shared with third parties.
                    <br />
                    You can review or clear it anytime.
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile-only: 复制的两个卡片 */}
            <div className="privacy-mobile-extra-cards">
              {/* Copy 1 - Card 2 content */}
              <div className="privacy-card-row">
                <div className="privacy-card-with-text">
                  <div className="privacy-card-bg">
                    <Image src="/assets/ima/section5-2.svg" alt="" fill className="privacy-bg-image" />
                  </div>
                  <div className="privacy-card-icon md:hidden">
                    <Image src="/assets/ima/section5-22.svg" alt="" width={48} height={48} />
                  </div>
                  <div className="privacy-card-content">
                    <h3 style={{ color: '#383838', fontWeight: 'bold' }}>No Eavesdropping. Ever</h3>
                    <p style={{ color: '#646464' }}>
                      Mic and camera are physically off by default.
                      <br />
                      They only activate when you press and hold the button.
                    </p>
                  </div>
                </div>
              </div>

              {/* Copy 2 - Card 3 content */}
              <div className="privacy-card-row">
                <div className="privacy-card-with-text">
                  <div className="privacy-card-bg">
                    <Image src="/assets/ima/section5-3.svg" alt="" fill className="privacy-bg-image" />
                  </div>
                  <div className="privacy-card-icon md:hidden">
                    <Image src="/assets/ima/section5-33.svg" alt="" width={48} height={48} />
                  </div>
                  <div className="privacy-card-content">
                    <h3 style={{ color: '#383838', fontWeight: 'bold' }}>No Third-Party Ads</h3>
                    <p style={{ color: '#646464' }}>
                      A safe, distraction-free play space.
                      <br />
                      No ads, no tracking, no outside interactions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 第二行：两个对话框卡片 */}
            <div className="privacy-cards-row">
              {/* No Eavesdropping. Ever */}
              <div className="privacy-card-with-text">
                <div className="privacy-card-bg">
                  <Image src="/assets/ima/section5-2.svg" alt="" fill className="privacy-bg-image" />
                </div>
                {/* 移动端左上角图标 */}
                <div className="privacy-card-icon md:hidden">
                  <Image src="/assets/ima/section5-22.svg" alt="" width={48} height={48} />
                </div>
                <div className="privacy-card-content">
                  <h3 style={{ color: '#383838', fontWeight: 'bold' }}>No Eavesdropping. Ever</h3>
                  <p style={{ color: '#646464' }}>
                    Mic and camera are physically off by default.
                    <br />
                    They only activate when you press and hold the button.
                  </p>
                </div>
              </div>

              {/* No Third-Party Ads */}
              <div className="privacy-card-with-text">
                <div className="privacy-card-bg">
                  <Image src="/assets/ima/section5-3.svg" alt="" fill className="privacy-bg-image" />
                </div>
                {/* 移动端左上角图标 */}
                <div className="privacy-card-icon md:hidden">
                  <Image src="/assets/ima/section5-33.svg" alt="" width={48} height={48} />
                </div>
                <div className="privacy-card-content">
                  <h3 style={{ color: '#383838', fontWeight: 'bold' }}>No Third-Party Ads</h3>
                  <p style={{ color: '#646464' }}>
                    A safe, distraction-free play space.
                    <br />
                    No ads, no tracking, no outside interactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section - VIP站时显示在这里（原位置） */}
        {isVip && renderImpactSection()}

        {/* Story Section */}

        <section className={`story-section ${!isVip ? 'main-site' : ''}`}>
          <div className="content-container">
            <h2>
              <span className="story-heading-line1">From Dreamers to</span>
              <span className="story-heading-line2">Builders</span>
            </h2>
            <div className="story-panels">
              {copy.story.cards.map((card, index) => (
                <div className="story-card" key={card.title}>
                  {/* PC端：图片在上方 */}
                  <div className="story-card-visual hidden md:block">
                    {card.avatars ? (
                      <div className="story-team-visual">
                        <img src="/assets/ima/组合 626.svg" alt="Team" className="story-team-image" />
                        <div className="story-team-names">
                          <span className="story-name-bruce">Bruce</span>
                          <span className="story-name-bryan">Bryan</span>
                        </div>
                      </div>
                    ) : (
                      <img src="/assets/ima/组合 627.svg" alt="Science" className="story-science-image" />
                    )}
                  </div>

                  {/* 移动端和PC端：文字内容 */}
                  <div className="story-card-body">
                    {/* 移动端：图片和标题在同一行 */}
                    <div className="story-card-header md:hidden">
                      <div className="story-card-image-mobile">
                        {card.avatars ? (
                          <img src="/assets/ima/section7-1.png" alt="Team" />
                        ) : (
                          <img src="/assets/ima/section7-2.png" alt="Science" />
                        )}
                      </div>
                      <div className="story-card-title-wrapper">
                        <div className="story-card-title">{card.title}</div>
                        {/* 移动端：The Team下方添加Bruce & Bryan副标题 */}
                        {card.avatars && (
                          <div className="story-card-subtitle">Bruce & Bryan</div>
                        )}
                      </div>
                    </div>

                    {/* PC端：只显示标题 */}
                    <div className="hidden md:block">
                      <div className="story-card-title">{card.title}</div>
                    </div>

                    <p>{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="story-roadmap hidden md:block">
              <img src="/assets/ima/Frame 1000007460.svg" alt="" className="story-roadmap-line" />
              <div className="story-milestones">
                {copy.story.milestones.map((milestone) => (
                  <div className="story-milestone" key={milestone.title}>
                    <div className="story-pin" aria-hidden="true">
                      <span />
                    </div>
                    <div className="story-milestone-text">
                      <h4>{milestone.title}</h4>
                      <p>{milestone.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="faq-section">
          <div className="content-container">
            <h2>{copy.faq.heading}</h2>
            <div className="faq-list">
              {copy.faq.items.map((item, index) => (
                <div className={`faq-item ${openFaq === index ? 'open' : ''}`} key={item.question}>
                  <button type="button" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                    <span>{item.question}</span>
                    <span className="faq-icon" aria-hidden="true">
                      {openFaq === index ? '−' : '+'}
                    </span>
                  </button>
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer
          onSubscribe={handleFooterSubmit}
          onVipLeadSuccess={isVip ? handleVipLeadSuccess : undefined}
          showReserveDiscountCta={showReserveDiscountCta}
          onReserveDiscount={handlePostLeadReserve}
          reserveDiscountLoading={!!postLeadCheckoutSource}
        />
      </main >

      <style jsx global>{`
        :root {
          --nav-height: 140px;
        }

        body {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background: #f8f7ff;
          color: #111827;
        }

        .background-gradient {
          position: fixed;
          inset: 0;
          background: linear-gradient(180deg, #cfd9ff 0%, #fff5dd 55%, #ffffff 100%);
          z-index: -2;
        }

        .home-root {
          position: relative;
          overflow-x: hidden;
          padding-top: var(--nav-height);
        }

        .hero-block {
          position: relative;
          margin-top: calc(var(--nav-height) * -1);
          overflow: visible;
          background: linear-gradient(90deg, #FEFAE5 0%, #D9F1FC 100%);
        }

        /* 主站（非VIP）隐藏 hero 底部多余区域 */
        .hero-block.main-site {
          margin-bottom: -60px;
        }
        @media (min-width: 768px) {
          .hero-block.main-site {
            margin-bottom: -80px;
          }
        }

        .hero-block::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #FEFAE5 0%, #D9F1FC 100%);
          z-index: -2;
        }

        .hero-backdrop {
          position: relative;
          width: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .hero-background-image {
          width: 100%;
          height: auto;
          /* 保持 SVG 原始比例自适应宽度 */
        }
        
        /* 强制覆盖可能的其他样式，确保移动端隐藏PC图片，PC端隐藏移动端图片 */
        /* PC端图片默认隐藏，仅在md及以上显示 */
        .hero-background-image.hidden.md\:block {
          display: none;
        }
        @media (min-width: 768px) {
          .hero-background-image.hidden.md\:block {
            display: block;
          }
        }
        
        /* 移动端图片默认显示，仅在md及以上隐藏 */
        .hero-background-image.md\:hidden {
          display: block;
        }
        @media (min-width: 768px) {
          .hero-background-image.md\:hidden {
            display: none;
          }
        }
        
        /* Fix overlap on iPhone SE/Pro sizes */
        @media (max-width: 430px) {
          .hero-background-image.md\:hidden {
             transform: translateY(45px);
          }
        }

        .hero-shell {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-mobile);  /* 移动端：16px */
          z-index: 10;
          text-align: center;
          padding-top: calc(var(--nav-height) - clamp(30px, 4vw, 60px));
        }

        @media (min-width: 769px) and (max-width: 1200px) {
          .hero-shell {
            transform: translateY(-50px);
          }
        }

        @media (min-width: 770px) and (max-width: 930px) {
          .hero-shell {
            transform: translateY(-80px);
          }
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 999px;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #13234d;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
          text-transform: uppercase;
        }

        .hero-heading h1 {
          margin: 0 0 clamp(6px, 1vw, 10px);
          font-size: clamp(2.2rem, 4vw, 4.2rem);
          line-height: 1.1;
        }

        .hero-title-primary {
          display: block;
          color: var(--color-primary-dark);  /* 移动端：#0F192A */
          font-weight: 800;
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
          font-size: clamp(1.8rem, 4.5vw, 4rem); /* 缩小移动端字体以防止换行 */
        }

        @media (min-width: 768px) {
          .hero-title-primary {
            color: #54545C;  /* PC端：恢复原色 */
            font-size: inherit; /* PC端恢复继承h1大小 */
          }
        }

        .hero-title-accent {
          display: block;
          color: #f7ad3b;
          font-weight: 800;
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
          font-size: clamp(1.8rem, 4.5vw, 4rem); /* 保持与Not Just Stacking一致 */
          margin-top: 5px; /* 增加移动端行间距 */
        }

        
        @media (min-width: 768px) {
           .hero-title-accent {
             margin-top: 0; 
             font-size: clamp(2.2rem, 4vw, 3.5rem);
           }
        }

        .hero-description-wrapper {
          margin: 10px auto 15px;//上 左右 下
          max-width: 720px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }

        .hero-description {
          margin: 0;
          font-size: clamp(0.95rem, 1.2vw, 1.2rem);
          line-height: 1.5;
          color: var(--color-secondary-gray);  /* 移动端：#475569 */
          font-weight: 600;
          text-align: center;
        }

        @media (min-width: 768px) {
          .hero-description {
            color: #54545C;  /* PC端：恢复原色 */
          }
        }

        .hero-description-line2 {
          margin-top: 0;
        }

        .hero-badge-row {
          display: flex; /* 改为flex以确保宽度控制 */
          align-items: center;
          margin-top: 0;
          flex-direction: column; /* 默认垂直排列 (Mobile First) */
          gap: 8px;
          width: 100%; /* 占满容器以便居中 */
          justify-content: center;
        }

        /* 移动端隐藏分隔符 */
        @media (max-width: 767px) {
           .hero-badge-separator {
             display: none;
           }
           .hero-badge-row {
             flex-direction: column !important; /* 强制垂直排列 */
             align-items: center;
           }
        }
        
        @media (min-width: 768px) {
           .hero-badge-row {
             display: inline-flex; /* PC端恢复为inline-flex */
             width: auto;
             flex-direction: row;
             gap: 12px;
           }
           .hero-badge-separator {
             display: inline;
           }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 400;
          color: #54545C;
          font-size: 0.78rem;
        }

        .hero-badge-text {
          color: #54545C;
        }

        .hero-badge-separator {
          color: #54545C;
          font-size: 1rem;
        }

        .hero-badge-icon {
          width: 20px;
          height: 20px;
          object-fit: contain;
        }



        .kit-section {
          padding: 100px 0 90px;
          background: #FFFEF3;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 767px) {
          .kit-section {
            padding-top: 50px;
          }
          .kit-heading-block {
            margin-top: 25px;
          }
        }

        .kit-heading-block {
          text-align: center;
          max-width: 760px;
          margin: 50px auto 38px;
        }

        .kit-heading-block h2 {
          font-size: clamp(2.2rem, 3.2vw, 3.2rem);
          color: var(--color-primary-dark);  /* 移动端：#0F192A */
          font-weight: 700;
          margin-bottom: 10px;
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
          white-space: normal;
          line-height: 1.2;
        }

        @media (min-width: 768px) {
          .kit-heading-block h2 {
            color: #54545C;  /* PC端：恢复原色 */
            white-space: nowrap;
          }
        }

        .kit-subheading {
          font-size: 1.3rem;
          color: #54545C;
          margin: 0;
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
        }

        .kit-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          align-items: stretch;
          justify-items: center;
        }

        @media (min-width: 768px) {
          .kit-layout {
            grid-template-columns: minmax(0, 0.95fr) minmax(0, 1fr);
            gap: 46px;
            align-items: start;
          }
        }

        .kit-media-block {
          display: flex;
          flex-direction: column;
          gap: 22px;
          position: relative;
          padding: 10px 0 0 0;
          margin: 0 auto;
          width: 100%;
        }

        .kit-media-single {
          position: relative;
          width: 100%;
          /* Mobile default */
          height: auto;
          aspect-ratio: 1/1;
        }

        @media (min-width: 768px) {
          .kit-media-single {
            height: auto;
            aspect-ratio: 1 / 1;
            max-width: 612px;
          }
        }

        .kit-media-single-image {
          object-fit: contain;
          object-position: center;
          width: 100%;
          height: 100%;
        }

        .kit-media-card {
          background: linear-gradient(180deg, #DCD2EB 0%, #EDE8F5 100%);
          border: 2px solid #D3C3EC;
          border-radius: 44px;
          padding: 48px;
          box-shadow: 0 30px 60px rgba(24, 20, 52, 0.1);
          position: relative;
          overflow: hidden;
          z-index: 1;
        }

        .kit-image-container {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 400px;
        }

        .kit-main-image {
          object-fit: cover;
          object-position: center;
          border-radius: 24px;
        }

        .kit-blocks-stage {
          position: relative;
          width: min(360px, 100%);
          height: 320px;
          margin: 0 auto;
        }

        .kit-block {
          position: absolute;
          width: 165px;
          height: 165px;
          border-radius: 28px;
          border: 8px solid #2baf9e;
          background: #fffdfc;
          font-size: 4.5rem;
          font-weight: 700;
          color: #f3d356;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 20px 45px rgba(36, 57, 97, 0.15);
        }

        .kit-block-a {
          top: 18px;
          left: 40px;
          transform: rotate(-12deg);
        }

        .kit-block-b {
          top: 120px;
          left: -8px;
          transform: rotate(8deg);
        }

        .kit-block-c {
          top: 96px;
          right: 4px;
          transform: rotate(-4deg);
        }

        .kit-cta-card {
          background: #fff;
          border-radius: 30px;
          padding: 28px 32px;
          box-shadow: 0 25px 45px rgba(36, 57, 97, 0.12);
          display: flex;
          justify-content: center;
          position: relative;
        }

        .primary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 40px;
          border-radius: 999px;
          background: linear-gradient(120deg, #8c8cf5, #f495c3);
          color: #fff;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          box-shadow: 0 20px 35px rgba(125, 158, 212, 0.35);
        }

        .kit-details-block {
          display: flex;
          flex-direction: column;
        }


        .family-section {
          padding: 95px 0 50px;
          background: #F7F3FD;  /* 移动端：紫色 */
          position: relative;
          overflow: hidden;
          z-index: 3;
        }

        @media (max-width: 767px) {
          .family-section {
            padding-top: 50px;
            padding-bottom: 50px;
          }
        }

        @media (min-width: 768px) {
          .family-section {
            background: #FFFEF3;  /* PC端：原色 */
          }
        }

        .family-bg-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
          overflow: hidden;
          display: none;  /* 移动端隐藏背景图片 */
        }

        @media (min-width: 768px) {
          .family-bg-wrapper {
            display: block;  /* PC端显示背景图片 */
          }
        }

        .family-bg-image {
          position: absolute;
          left: 0;
          width: 100%;
          pointer-events: none;
        }

        .family-bg-image-item {
          width: 100%;
          height: auto;
          display: block;
        }

        .family-bg-top {
          top: -50px;
          z-index: 2;
        }

        .family-bg-bottom {
          top: -5px;
          z-index: 1;
        }

        .family-stage {
          position: relative;
          border-radius: 56px;
          padding: 90px 80px;
          background: transparent;
          clip-path: polygon(5% 0, 100% 0, 100% 95%, 0 100%, 0 15%);
          overflow: hidden;
          z-index: 2;
        }

        .family-header {
          max-width: 540px;
          position: relative;
          z-index: 2;
          text-align: center;
          margin: 0 auto;
        }

        .family-tagline {
          font-size: 0.85rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #ff9546;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .family-header h2 {
          font-size: clamp(2.2rem, 4vw, 3rem);
          color: var(--color-primary-dark);  /* 移动端：#0F192A */
          font-weight: bold;
          margin: 0;
          line-height: 1.05;
          -webkit-text-stroke: 1px white;
          text-stroke: 1px white;
          text-shadow: 
            -1px -1px 0 white,
            1px -1px 0 white,
            -1px 1px 0 white,
            1px 1px 0 white;
        }

        @media (min-width: 768px) {
          .family-header h2 {
            color: #54545C;  /* PC端：恢复原色 */
          }
        }

        .family-mosaic {
          margin-top: 54px;
          display: flex;
          overflow-x: auto;
          overflow-y: visible;  /* 允许垂直方向溢出，确保逗号图片显示 */
          gap: 16px;
          position: relative;
          z-index: 2;
          max-width: 100%;
          margin-left: auto;
          margin-right: auto;
          scroll-behavior: smooth;
          padding: 40px 16px 0;  /* 增加顶部 padding，为逗号图片留出空间 */
        }

        @media (min-width: 768px) {
          .family-mosaic {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            overflow-x: visible;
            max-width: 1600px;
            padding: 0;
          }
        }

        .family-card {
          --quote-color: #f07f1f;
          --frame-color: #f49f3f;
          --photo-bg: #fff1df;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 60px;
          padding: 58px 50px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 8px 16px rgba(25, 43, 80, 0.1);
          position: relative;
          z-index: 2;
          width: 103%;
          max-width: none;
          flex: 0 0 calc(100% - 80px);
          min-width: 280px;
        }

        @media (min-width: 768px) {
          .family-card {
            width: auto;
            flex: 1;
            max-width: none;
          }
        }

        .family-quote-icon {
          position: absolute;
          top: -35px;  /* 增加向上偏移，确保完全显示 */
          left: 50%;
          transform: translateX(-50%);
          width: 54px;
          height: 54px;
          background: transparent !important;
          border-radius: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;  /* 增加 z-index 确保不被遮盖 */
        }

        .quote-icon {
          width: 48px;
          height: 48px;
          object-fit: contain;
        }

        .family-card:nth-child(odd) {
          transform: translateY(0);
        }

        .family-card:nth-child(even) {
          transform: translateY(0);
        }

        .family-card.sky {
          --quote-color: #3e5fd9;
          --frame-color: #6ea8ff;
          --photo-bg: #e8f2ff;
        }

        .family-photo {
          position: relative;
          border-radius: 26px;
          padding: 12px;
          background: var(--photo-bg);
          overflow: hidden;
        }

        .family-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 18px;
          position: relative;
          z-index: 1;
          box-shadow: 0 18px 30px rgba(20, 32, 67, 0.25);
        }

        .family-photo::after {
          content: '';
          position: absolute;
          inset: 0;
          background-repeat: no-repeat;
          background-size: 100% 100%;
          pointer-events: none;
        }

        .family-photo.frame-sunset::after {
          background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMjAgMjQwJz4KPHBhdGggZD0nTTE4IDYwIFEgNDIgNSA3MCA2MCBRIDk4IDExNSAxMjYgNjAgUSAxNTQgNSAxODIgNjAgUSAyMTAgMTE1IDIzOCA2MCBRIDI2NiA1IDI5NCA2MCBMIDI5NCAxODAgUSAyNjAgMjEwIDIzMCAxODggUSAyMDAgMTY2IDE3MCAxODggUSAxNDAgMjEwIDExMCAxODggUSA4MCAxNjYgNTAgMTg4IFEgMzAgMjAyIDE4IDE4OCBaJyBzdHJva2U9JyNGNDlGM0YnIHN0cm9rZS13aWR0aD0nMTInIGZpbGw9J25vbmUnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcvPgo8L3N2Zz4=");
        }

        .family-photo.frame-sky::after {
          background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMjAgMjQwJz4KPHBhdGggZD0nTTE4IDYwIFEgNDIgNSA3MCA2MCBRIDk4IDExNSAxMjYgNjAgUSAxNTQgNSAxODIgNjAgUSAyMTAgMTE1IDIzOCA2MCBRIDI2NiA1IDI5NCA2MCBMIDI5NCAxODAgUSAyNjAgMjEwIDIzMCAxODggUSAyMDAgMTY2IDE3MCAxODggUSAxNDAgMjEwIDExMCAxODggUSA4MCAxNjYgNTAgMTg4IFEgMzAgMjAyIDE4IDE4OCBaJyBzdHJva2U9JyM2RUE4RkYnIHN0cm9rZS13aWR0aD0nMTInIGZpbGw9J25vbmUnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcvPgo8L3N2Zz4=");
        }

        .family-quote {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
        }

        .family-quote p {
          font-family: 'Playfair Display', 'Times New Roman', serif;
          font-size: clamp(1rem, 2vw, 1.2rem);
          font-weight: 700;
          color: #45334D;
          line-height: 1.35;
          margin: 0;
          flex-grow: 1;
        }

        .family-quote span {
          font-family: 'Rubik', sans-serif;
          font-weight: 400;
          letter-spacing: 0.08em;
          color: #697077;
          /* 去除 text-transform: capitalize; 保持原文样式 */
          font-size: 0.9rem;
          margin-top: 16px;
          align-self: flex-start;
        }

        @media (min-width: 768px) {
          .hidden-pc {
            display: none !important;
          }
        }

        .family-pagination {
          display: none;
        }

        @media (min-width: 768px) {
          .family-pagination {
            margin-top: 46px;
            display: flex;
            gap: 12px;
            justify-content: center;
            position: relative;
            z-index: 2;
          }
        }

        .family-pagination button {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: rgba(229, 222, 237, 1);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .family-pagination button:hover {
          background: rgba(244, 192, 37, 0.7);
        }

        .family-pagination button.active {
          width: 80px;
          height: 10px;
          border-radius: 20px;
          background: rgba(244, 192, 37, 1);
        }

        .privacy-section {
          padding: 0 0 150px;
          background: #F3F8FA;  /* 移动端：淡蓝色 */
          margin-top: 0;
          position: relative;
          z-index: 0;
        }

        @media (max-width: 767px) {
          .privacy-section {
            padding-top: 50px;
            padding-bottom: 50px;
          }
        }

        @media (min-width: 768px) {
          .privacy-section {
            background: #FFFCF9;  /* PC端：原色 */
          }
        }

        .privacy-heading {
          text-align: center;
          padding-top: 80px;
        }

        @media (max-width: 767px) {
          .privacy-heading {
            padding-top: 0;
          }
        }

        .privacy-heading h2 {
          font-size: clamp(2rem, 3vw, 3rem);
          line-height: 1.2;
          text-align: center;
        }

        .privacy-line1 {
          font-size: clamp(1.5rem, 2.25vw, 2.25rem);
          color: #54545C;
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
        }

        .privacy-line2 {
          color: var(--color-primary-dark);  /* 移动端：#0F192A */
          font-weight: 700;
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
        }

        @media (min-width: 768px) {
          .privacy-line2 {
            color: #54545C;  /* PC端：恢复原色 */
          }
        }

        .privacy-tag {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #20604B;
          font-size: 12px;  /* 减小两号字体 */
          font-weight: 600;
          margin-top: 12px;
          text-align: center;
          min-width: 200px;  /* 增加最小宽度让文字一行显示 */
          height: 27px;
          border-radius: 10px;
          background: #EAF6F2;
          padding: 0 16px;  /* 只保留左右padding，高度由height控制 */
          white-space: nowrap;  /* 确保一行显示 */
        }

        @media (min-width: 768px) {
          .privacy-tag {
            background: transparent;  /* PC端无背景 */
            color: #878787;  /* PC端颜色 */
            font-size: clamp(1.125rem, 1.6875vw, 1.6875rem);  /* PC端字体 */
            font-weight: 400;
            padding: 0;
            min-width: auto;
          }
        }

        /* 第一行：卡片 + 插图 */
        .privacy-card-row {
          margin-top: 60px;
          display: flex;
          gap: 0;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        /* Mobile-only extra cards - hidden on PC */
        .privacy-mobile-extra-cards {
          display: none;
        }

        /* 第二行：两个对话框卡片 */
        .privacy-cards-row {
          margin-top: -20px;
          display: flex;
          gap: 24px;
          justify-content: center;
        }

        .privacy-card-with-text {
          position: relative;
          flex: 1;
          min-height: 250px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 40px;
        }

        /* 第一行的第一个卡片 - 放大并设置 z-index */
        .privacy-card-row .privacy-card-with-text {
          flex: 0 0 100%;
          max-width: 1404px; /* Align with bottom row (690+690+24) */
          min-height: 280px;
          z-index: 1;
          align-items: center;
          padding-top: 0;
        }

        /* 第二行的卡片 - 放大尺寸 */
        .privacy-cards-row .privacy-card-with-text {
          flex: 0 0 50%;
          max-width: 690px;
          min-height: 320px;
        }

        .privacy-card-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .privacy-bg-image {
          object-fit: contain;
        }

        .privacy-card-content {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 40px 40px 40px 40px;
          max-width: 1000px;
        }

        /* 第一行卡片的文字位置 */
        .privacy-card-row .privacy-card-content {
          padding: 40px 40px 40px 40px;
        }

        /* 第二行卡片的文字位置 - 标题和正文各下移 10px */
        .privacy-cards-row .privacy-card-content {
          padding: 60px 40px 40px 40px;
        }

        .privacy-card-content h3 {
          font-size: clamp(1.25rem, 2vw, 1.75rem);
          margin-bottom: 20px;
          line-height: 1.3;
        }

        /* 第二行卡片的标题下移 10px */
        .privacy-cards-row .privacy-card-content h3 {
          margin-bottom: 10px;
          margin-left: 70px;
        }

        /* 第二行卡片的正文下移 10px */
        .privacy-cards-row .privacy-card-content p {
          margin-top: 20px;
          margin-left: 70px;
        }

        .privacy-card-content p {
          font-size: clamp(16px, 1vw, 18px);
          line-height: 1.5;
        }

        /* 插图 - 重叠在卡片右侧，z-index 更高 */
        .privacy-illustration {
          flex-shrink: 0;
          position: relative;
          z-index: 2;
          margin-left: -150px;
        }

        .privacy-illustration-image {
          width: 100%;
          height: auto;
          max-width: 400px;
        }

        /* 移动端响应式 */
        @media (max-width: 768px) {
          .privacy-card-row {
            flex-direction: column;
            gap: 24px;
          }

          .privacy-card-row .privacy-card-with-text {
            flex: 1;
            max-width: 100%;
            min-height: auto;
            padding-bottom: 0px;
          }

          .privacy-illustration {
            display: none;
          }

          .privacy-illustration-image {
            max-width: 120px;  /* 移动端图片更小 */
          }

          .privacy-cards-row {
            display: none;  /* 移动端隐藏原本的 Card 2 和 Card 3 */
          }

          /* 移动端显示复制的卡片 */
          .privacy-mobile-extra-cards {
            display: flex;
            flex-direction: column;
            gap: 0px;
            margin-top: 0px;
          }

          .privacy-mobile-extra-cards .privacy-card-row {
            margin-top: 25px;
          }



          .privacy-card-content {
            padding: 30px 20px 30px 80px;
            text-align: left;
          }

          /* 移动端：隐藏 PC 端背景图片，显示白色卡片 */
          .privacy-card-bg {
            display: none;
          }

          .privacy-card-with-text {
            background: rgba(255, 255, 255, 1);
            border-radius: 20px;
            box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.1);
            padding: 24px;
            padding-top: 0 !important;
            align-items: flex-start !important;
            min-height: 200px;
            position: relative;
          }

          /* 移动端卡片左上角图标 */
          .privacy-card-icon {
            position: absolute;
            top: 30px;  /* 与 privacy-card-content 的 padding-top 对齐 */
            left: 30px;  /* 与 privacy-card-content 的 padding-left 对齐 */
            z-index: 2;
            width: 48px;
            height: 48px;
          }

          /* 移动端卡片标题渐变文字 */
          .privacy-cards-row .privacy-card-content h3 {
            background: linear-gradient(258.25deg, rgba(0, 0, 0, 1), rgba(0, 35, 105, 1) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            font-family: 'Rubik', sans-serif;
            font-weight: 600;
            font-size: 18px;
            line-height: 30px;
            letter-spacing: 0;
            text-align: left;
            margin-left: 60px;  
            margin-bottom: 10px;
            color: transparent;
          }

          /* 移动端卡片正文 */
          .privacy-cards-row .privacy-card-content p {
            margin-left: 0;
            margin-top: 10px;
            color: #697077;
            font-family: 'Rubik', sans-serif;
            font-size: 14px;
            line-height: 1.6;
          }

          /* 第一行卡片的标题渐变 */
          .privacy-card-row .privacy-card-content h3 {
            background: linear-gradient(258.25deg, rgba(0, 0, 0, 1), rgba(0, 35, 105, 1) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            font-family: 'Rubik', sans-serif;
            font-weight: 600;
            font-size: 18px;
            line-height: 30px;
            letter-spacing: 0;
            text-align: center;
            color: transparent;
            margin-left: 20px;
          }

          /* 第一行卡片的正文 */
          .privacy-card-row .privacy-card-content p {
            color: #697077;
            font-family: 'Rubik', sans-serif;
            font-size: 14px;
            line-height: 1.6;
            text-align: left;
            margin-top: 30px;
            margin-left: -35px;
            margin-right: -40px;
          }

          /* 移动端：隐藏 br 让文字以一个段落展示 */
          .privacy-card-row .privacy-card-content p br {
            display: none;
          }

          /* 移动端：减小标题和正文的间距 */
          .privacy-card h3,
          .privacy-card-row .privacy-card-content h3 {
            margin-bottom: 6px;  /* 从 12px 减小到 6px */

          }
        }

        .privacy-card {
          background: #f8f7ff;
          border-radius: 28px;
          padding: 24px;
          box-shadow: inset 0 0 0 1px rgba(125, 108, 245, 0.2);
        }

        .privacy-card h3 {
          margin-bottom: 12px;
          font-size: 1.3rem;
        }

        .privacy-card p {
          color: #4b5563;
        }

        .impact-section {
          padding: 150px 0 120px;
          background: #E9F5EB;  /* 改为绿色 */
          position: relative;
          z-index: 1;
        }

        @media (max-width: 767px) {
          .impact-section {
            padding-top: 80px;
            padding-bottom: 50px;
          }
        }

        .impact-section::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60%;
          background: #E9F5EB;
          z-index: -1;
          pointer-events: none;
        }

        .impact-bg-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          pointer-events: none;
          z-index: -1;
        }

        .impact-bg-image {
          position: absolute;
          left: 0;
          width: 100%;
          pointer-events: none;
        }

        .impact-bg-image-item {
          width: 100%;
          height: auto;
          display: block;
        }

        .impact-bg-bottom {
          top: -5px;
          z-index: 1;
        }

        .impact-bg-top {
          top: 20px;
          z-index: 2;
        }

        .impact-section h2 {
          text-align: center;
          font-size: clamp(2rem, 3vw, 3rem);
          margin-bottom: 48px;
          position: relative;
          z-index: 2;
          font-weight: 700;
          color: var(--color-primary-dark);  /* 移动端：#0F192A */
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
          margin-top: 10px;
          white-space: normal;
          line-height: 1.2;
        }

        @media (min-width: 768px) {
          .impact-section h2 {
            color: #54545C;  /* PC端：恢复原色 */
          }
        }

        /* Impact Section 标题分行 - 仅移动端生效 */
        @media (max-width: 767px) {
          .impact-heading-line1,
          .impact-heading-line2 {
            display: block;
          }
        }

        .impact-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          position: relative;
          z-index: 2;
          margin-top: 10px;
        }

        .impact-card {
          background: transparent;
          border-radius: 28px;
          padding: 24px;
          box-shadow: none;
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        /* 移动端白色矩形背景 */
        @media (max-width: 767px) {
          .impact-card {
            background: rgba(255, 255, 255, 1);
            border-radius: 20px;
            box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.1);
            padding: 24px;
          }
        }

        .impact-icon-wrapper {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .impact-icon {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .impact-card h3 {
          margin-bottom: 12px;
          font-weight: 700;
          background: linear-gradient(258.25deg, rgba(0, 0, 0, 1), rgba(0, 35, 105, 1) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          font-size: 1.5rem;
          font-family: 'Rubik', sans-serif;
          line-height: 30px;
          letter-spacing: 0;
          text-align: center;
          color: transparent;
        }

        @media (min-width: 768px) {
          .impact-card h3 {
            color: #54545C;
            background: none;
            -webkit-background-clip: unset;
            -webkit-text-fill-color: unset;
            background-clip: unset;
          }
        }

        .impact-card p {
          color: #4a4a4a;
          text-align: center;
          font-size: 0.8rem;
          font-family: 'Rubik', sans-serif;
          line-height: 1.6;
        }

        @media (max-width: 767px) {
          .impact-card p {
            color: #697077;
            font-size: 14px;
          }

          /* 移动端标题样式 */
          .impact-card-title-mobile {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 12px;
          }

          .impact-title-line1 {
            font-family: 'Rubik', sans-serif;
            font-size: 32px;
            font-weight: 700;
            line-height: 1.2;
            background: linear-gradient(258.25deg, rgba(0, 0, 0, 1), rgba(0, 35, 105, 1) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            color: transparent;
          }

          .impact-title-small {
            font-size: 20px;
            font-weight: 400;
            margin-left: 4px;
          }

          .impact-title-line2 {
            font-family: 'Rubik', sans-serif;
            font-size: 24px;
            font-weight: 600;
            line-height: 1.3;
            background: linear-gradient(258.25deg, rgba(0, 0, 0, 1), rgba(0, 35, 105, 1) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            color: transparent;
          }
        }

        .story-section {
          padding: 140px 0;
          background: #FFFCEB;  /* 移动端：更淡的黄色 */
          position: relative;
          z-index: 10;
        }

        @media (max-width: 767px) {
          .story-section {
            padding-top: 50px;
            padding-bottom: 50px;
          }
        }

        @media (min-width: 768px) {
          .story-section {
            background: #FFF6D0;  /* PC端：原色 */
          }
        }

        .story-section::before {
          content: '';
          position: absolute;
          top: -135px;
          left: 0;
          right: 0;
          height: 135px;
          background: #E9F5EB;
          z-index: -1;
        }

        @media (max-width: 767px) {
          .story-section::before {
            display: none !important;
          }
        }

        /* 主站PC端：隐藏绿色过渡区域（因为 Impact Section 不在这个位置） */
        @media (min-width: 768px) {
          .story-section.main-site::before {
            display: none;
          }
        }

        .story-section h2 {
          text-align: center;
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          margin-bottom: 48px;
          font-weight: 700;
          color: var(--color-primary-dark);  /* 移动端：#0F192A */
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
          white-space: normal;
          line-height: 1.2;
        }

        @media (max-width: 767px) {
          .story-section h2 {
            margin-top: 0;
          }
        }

        @media (min-width: 768px) {
          .story-section h2 {
            color: #54545C;  /* PC端：恢复原色 */
          }
        }

        /* Story Section 标题分行 */
        .story-heading-line1,
        .story-heading-line2 {
          display: block;
        }

        @media (min-width: 768px) {
          .story-heading-line1::after {
            content: ' ';  /* PC端：单行显示 */
          }
          
          .story-heading-line2 {
            display: inline;
          }
        }

        .story-panels {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 60px;
        }

        .story-card {
          display: flex;
          gap: 15px;
          padding: 0;
          border-radius: 39px;
          background: transparent;
          box-shadow: none;
          position: relative;
          align-items: stretch;
        }

        .story-card:nth-child(2) {
          background: transparent;
          box-shadow: none;
        }

        .story-card-visual {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
        }

        .story-team-visual {
          position: relative;
          width: 236px;
          min-width: 236px;
          height: 294px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .story-team-image {
          width: 236px;
          height: 294px;
          object-fit: contain;
        }

        .story-team-names {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: flex-start;
          padding-left: 10px;
        }

        .story-name-bruce {
          font-family: 'Do Hyeon', sans-serif;
          font-size: 24px;
          font-weight: 400;
          line-height: 30px;
          text-align: center;
          color: #859FD3;
          margin-top: 120px;
          margin-left: 20px;
        }

        .story-name-bryan {
          font-family: 'Do Hyeon', sans-serif;
          font-size: 24px;
          font-weight: 400;
          line-height: 30px;
          text-align: center;
          color: #FFFFFF;
          margin-top: -50px;
          margin-left: 120px;
        }

        .story-science-image {
          width: 202px;
          min-width: 202px;
          height: 294px;
          object-fit: contain;
          flex-shrink: 0;
        }

        .story-card-body {
          flex: 1;
          max-width: 600px;
          min-height: 349px;
          background: rgba(215, 229, 255, 1);
          border-radius: 39px;
          padding: 28px;
          position: relative;
          box-shadow: none;
          display: flex;
          flex-direction: column;
        }

        /* 移动端白色背景框 */
        @media (max-width: 767px) {
          .story-card {
            flex-direction: column;
            gap: 10px;
          }

          /* 移动端隐藏 PC 端图片 */
          .story-card-visual {
            display: none !important;
          }

          .story-card-body {
            background: rgba(255, 255, 255, 1);
            border-radius: 20px;
            box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.1);
            padding: 0 20px 10px 20px;
            min-height: auto;
            margin-top: -25px;
          }

          /* 移动端：图片和标题在同一行 */
          .story-card-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
            margin-top: 35px;
          }

          .story-card-image-mobile {
            flex-shrink: 0;
            width: 80px;
            height: 80px;
          }

          .story-card-image-mobile img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          .story-card-title-wrapper {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
          }

          .story-team-visual,
          .story-science-image {
            width: 80px;
            min-width: 80px;
            height: 80px;
          }

          .story-team-image {
            width: 80px;
            height: 80px;
            object-fit: contain;
          }
        }

        .story-card-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: #859FD3;
          margin-bottom: 20px;
          position: relative;
        }

        /* 移动端标题渐变文字 */
        @media (max-width: 767px) {
          .story-card-title {
            background: linear-gradient(258.25deg, rgba(0, 0, 0, 1), rgba(0, 35, 105, 1) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            font-family: 'Rubik', sans-serif;
            font-weight: 600;
            font-size: 18px;
            line-height: 24px;
            letter-spacing: 0;
            text-align: left;
            color: transparent;
            margin-bottom: 4px;  /* 减小与副标题的间距 */
          }

          .story-card-title::after {
            display: none;
          }

          /* 移动端副标题：Bruce & Bryan */
          .story-card-subtitle {
            color: #3F89F7;
            font-family: 'Rubik', sans-serif;
            font-size: 16px;  /* 比The Team小两号 */
            font-weight: 400;
            line-height: 1.5;
            text-align: left;
            margin-bottom: 0;
          }
        }

        .story-card-title::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -10px;
          width: 120px;
          height: 4px;
          border-radius: 999px;
          background: #859FD3;
        }

        .story-card p {
          margin: 20px 0 0;
          color: #014188;
          font-size: 18px;
          line-height: 1.6;
        }

        /* 移动端正文样式 */
        @media (max-width: 767px) {
          .story-card p {
            color: #697077;
            font-family: 'Rubik', sans-serif;
            font-style: italic;
            font-size: 14px;
            line-height: 1.6;
            margin-top: 10px;
          }
        }

        .story-roadmap {
          position: relative;
          padding: 60px 0 20px;
          margin-top: 60px;
        }

        .story-roadmap-line {
          width: 100%;
          height: auto;
          display: block;
        }

        .story-milestones {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .story-milestone {
          text-align: center;
          position: relative;
        }

        .story-milestone-text h4 {
          font-family: 'Combo', cursive;
          font-size: 24px;
          font-weight: 800;
          line-height: 29px;
          letter-spacing: 0px;
          color: #014188;
          margin-bottom: 6px;
          text-align: center;
        }

        .story-milestone:nth-child(1) {
          transform: translateX(100px) translateY(-30px);
        }

        .story-milestone:nth-child(2) {
          transform: translateX(75px) translateY(3px);
        }

        .story-milestone:nth-child(3) {
          transform: translateX(-20px) translateY(-40px);
        }

        .story-milestone-text p {
         color:#014188;
         font-size:0.9rem;
        }

        .faq-section {
          padding: 120px 0;
          background: #fff;
        }

        @media (max-width: 767px) {
          .faq-section {
            padding-top: 50px;
            padding-bottom: 50px;
          }
        }

        .faq-section h2 {
          text-align: center;
          font-size: clamp(2rem, 3vw, 3rem);
          margin-bottom: 32px;
          color: var(--color-primary-dark);  /* 移动端：#0F172A */
          font-weight: 700;  /* 移动端：加粗 */
          line-height: 1.2;
        }

        @media (min-width: 768px) {
          .faq-section h2 {
            color: inherit;  /* PC端：恢复原色 */
            font-weight: 600;  /* PC端：正常粗细 */
          }
        }

        .faq-list {
          max-width: 800px;
          margin: 0 auto;
          display: grid;
          gap: 16px;
        }

        .faq-item {
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 24px;
          overflow: hidden;
          background: #fdfdfd;
          transition: border 0.2s ease;
        }

        .faq-item.open {
          /* border-color: #7d6cf5;  Removed blue highlight */
        }

        .faq-item button {
          width: 100%;
          padding: 20px 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: none;
          border: none;
          font-size: 1.125rem;
          font-weight: 600;
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        /* 移动端FAQ问题标题左对齐 */
        @media (max-width: 767px) {
          .faq-item button span:first-child {
            text-align: left;
          }
        }

        .faq-icon {
          font-size: 1.5rem;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.15s cubic-bezier(0.4, 0, 0.2, 1), padding-bottom 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0 28px;
        }

        .faq-item.open .faq-answer {
          max-height: 200px;
          padding-bottom: 24px;
        }

        .faq-answer p {
          color: #4b5563;
        }

    /*    @media (max-width: 1280px) {
          .step-connector {
            display: none;
          }
        }
    */
        @media (max-width: 780px) {
          .step-connector-image {
            transform: rotate(90deg);
            transition: transform 0.3s;
          }

          /* 移动端：第二个箭头特殊旋转角度 */
          .step-connector-image[alt="arrow-2"] {
            transform: rotate(-10deg);
          }
        }

        @media (max-width: 1024px) {
          .kit-layout,
          .story-panels,
          .privacy-grid,
          .impact-grid,
          .steps-grid,
          .timeline-points {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .hero-badge-row {
            flex-wrap: nowrap;
            justify-content: center;
            gap: 8px;
          }

          .hero-badge {
            font-size: 0.7rem;
            gap: 6px;
          }

          .hero-badge-icon {
            width: 18px;
            height: 18px;
          }

          .kit-layout {
            grid-template-columns: minmax(0, 1fr);
          }

          .kit-media-block {
            max-width: 520px;
            margin: 0 auto;
            padding: 0;
          }

          .kit-media-single {
            min-height: unset;
          }

          .family-stage {
            padding: 70px 54px;
          }

          .family-mosaic {
            gap: 28px;
          }

          .family-card {
            grid-template-columns: minmax(140px, 1fr) 1fr;
            transform: translateY(0);
          }

          .story-card {
            flex-direction: column;
          }

          .story-card-body {
            max-width: 100%;
            width: 100%;
            min-height: 300px;
          }

          .story-team-visual {
            width: 180px;
            min-width: 180px;
            height: 224px;
          }

          .story-team-image {
            width: 180px;
            height: 224px;
          }

          .story-science-image {
            width: 154px;
            min-width: 154px;
            height: 224px;
          }

          /* 移动端不显示 Bruce 和 Bryan 名字 */
          .story-team-names {
            display: none !important;
          }
        }


        /* Mobile Layered Step Item Styles */
        .step-mobile-wrapper {
          position: relative;
          width: 90vw; /* Use viewport width for better scaling */
          max-width: 400px; 
          margin: 0 auto;
          height: 100%;
          min-height: 400px; /* 进一步减小高度 */
          display: flex;
          flex-direction: column;
          border-radius: 32px;
          overflow: hidden;
        }

        .step-mobile-bg {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        /* Target the Next.js Image component class if needed, or rely on global img styles */
        .step-mobile-bg-img {
          object-fit: contain !important; /* Ensure it mimics the original scaling */
          border-radius: 32px;
        }

        /* 确保PC端隐藏移动端组件 */
        @media (min-width: 768px) {
          .step-mobile-wrapper {
             display: none !important;
          }
        }

        .step-mobile-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          height: 100%;
          padding: 24px; /* 控制 顶边距 & 侧边距 = 24px */
          box-sizing: border-box;
          /* transform: rotate(-4deg);  已移除旋转 */
        }

        .step-mobile-frame {
          width: 100%; /* 自适应宽度，距离两侧各24px */
          aspect-ratio: 16 / 9; /* 16:9 比例 */
          border: 3px solid #FFFFFF;
          border-radius: 20px;
          margin-top: 0; 
          margin-bottom: 24px; /* 底边距 = 24px (等于padding) */
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          flex-shrink: 0;
        }

        .step-mobile-text {
          width: 100%;
          text-align: center; /* 保持用户当前的居中设置 */
          padding: 0 4px;
          /* 移除 margin-top: auto，确保紧跟 frame下方24px处 */
        }

        .step-mobile-text h3 {
          color: #13234d; /* Dark Navy matches theme */
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 8px;
          line-height: 1.2;
          white-space: nowrap;
        }

        .step-mobile-text p {
          color: #6E6E73;
          font-size: 14px;
          line-height: 1.4;
          margin: 0;
          opacity: 0.9;
          font-weight: 500;
        }

        /* PC Refacted Styles */
        .step-pc-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          height: 100%;
          border-radius: 32px;
          /* Optional: Background logic if needed, currently transparent as per request "white frame" */
        }

        @media (max-width: 767px) {
          .step-pc-content {
            display: none !important;
          }
        }
        
        .step-pc-frame {
           width: 100%;
           aspect-ratio: 16 / 9;
           border: 4px solid #FFFFFF;
           border-radius: 20px;
           margin-bottom: 30px;
           box-shadow: 0 4px 12px rgba(0,0,0,0.05); 
           /* Empty frame as requested */
        }

        .step-pc-text {
           text-align: center;
        }



        @media (max-width: 768px) {
          :root {
            --nav-height: 120px;
          }

          .home-root {
            padding-top: var(--nav-height);
          }

          .kit-layout,
          .story-panels,
          .privacy-grid,
          .impact-grid,
          .timeline-points {
            grid-template-columns: minmax(0, 1fr);
          }



          .hero-shell {
            padding: 20px 18px 0;
            padding-top: calc(var(--nav-height) - 120px);
          }

          .hero-heading h1 {
            font-size: clamp(1.4rem, 5vw, 2rem);
          }

          .hero-description {
            font-size: clamp(0.85rem, 2.5vw, 1rem);
          }

          .hero-badge-row {
            flex-direction: row;
            flex-wrap: nowrap;
            gap: 6px;
          }

          .hero-badge {
            font-size: 0.65rem;
            gap: 4px;
          }

          .hero-badge-icon {
            width: 16px;
            height: 16px;
          }

          .hero-badge-separator {
            font-size: 0.8rem;
          }

          .kit-panel {
            padding: 28px;
          }

          .kit-media-single {
            min-height: unset;
          }

          .family-stage {
            padding: 20px 0;
            clip-path: none;
          }

          .family-section .content-container {
            padding: 0;
          }

          .family-mosaic {
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-top: 20px;
          }

          .family-pagination {
            display: none;
          }

          .family-card {
            padding: 16px 18px;
          }

          .story-panels {
            gap: 60px;
          }


          .story-roadmap-line {
            height: 140px;
          }

          .story-milestones {
            position: relative;
            grid-template-columns: minmax(0, 1fr);
            gap: 24px;
          }

          .story-milestone-text h4 {
            font-size: 20px;
            line-height: 24px;
          }

          .story-milestone-text p {
            font-size: 16px;
            line-height: 20px;
          }

          .timeline-line {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

/**
 * SSR: 检测请求域名，传递 isVip 给页面组件
 * - vip.unicornblocks.ai → isVip = true (显示全部内容)
 * - unicornblocks.ai → isVip = false (隐藏部分内容)
 */
export async function getServerSideProps({ req }) {
  const host = req?.headers?.host || "";
  return {
    props: {
      isVip: isVipHost(host),
    },
  };
}
