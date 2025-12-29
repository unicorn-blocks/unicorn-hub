import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import { safeApiCall } from '../lib/api';
import { getStepsMobileImage } from '../lib/content';
import { useLanguage } from '../context/LanguageContext';

import dynamic from 'next/dynamic'
import BlueTopBar from '../components/BlueTopBar';
const PopModal = dynamic(() => import('../components/PopModal'), { ssr: false });

export default function Home() {
  const [popOpen, setPopOpen] = useState(false);
  const [familyPage, setFamilyPage] = useState(0); // 添加家庭见证页面状态
  const [kitPanelOpen, setKitPanelOpen] = useState([false, false, false, false]); // Kit Section 展开状态
  // 弹窗只弹一次
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // const closed = localStorage.getItem('popModalClosed');
    // if (closed) return;
    // 监听滚动到section3
    function handleScroll() {
      const section3 = document.querySelector('img[alt="Everything to Build the Magic."]') || document.querySelector('section[id*="section3"]');
      if (!section3) return;
      const rect = section3.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setPopOpen(true);
        window.removeEventListener('scroll', handleScroll);
      }
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState(0);

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
      steps: {
        heading: 'Spark Creativity Through Adventure And Let Them Shine',
        subheading: 'With Sparky, Kids Create, Parents Relax.',
        cards: [
          {
            title: 'Pick To Start',
            description: 'Pick a Magic Hat. Snap on the hat to unlock the world.',
            background: '#D8CBFF',
            image: '/assets/ks_pic/space.png'
          },
          {
            title: 'Story Sparks Creation',
            description: 'Every build is part of a Story.',
            background: '#FFD7D0',
            image: '/assets/ks_pic/room.png'
          },
          {
            title: 'Create & Understand',
            description: 'Build and show your creation to Sparky.',
            background: '#FFE7B2',
            image: '/assets/ks_pic/App-1.png'
          },
          {
            title: 'The Adventure Continues',
            description: 'The Magic Hat and Block light up to celebrate success!',
            background: '#CFEFD5',
            image: '/assets/ks_pic/App-2.png'
          }
        ]
      },
      kit: {
        heading: 'Everything to Build the Magic.',
        subheading: "Meet Sparky's Adventure Kit:",
        button: 'Book Now',
        media: '/assets/reserve-vip-spot/adventure-kit.svg',
        mediaAlt: 'Sparky adventure kit illustration',
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
        subheading: "Your Child's Data. Yours Alone.",
        tag: 'COPPA Compliant by Design',
        cards: [
          {
            title: 'All Data Stays Yours',
            description:
              'Data is automatically wiped and NEVER exposed to third parties. You can permanently delete any history instantly via the app.'
          },
          {
            title: 'No Eavesdropping. Ever',
            description:
              'Physically OFF until you press. Mic & Camera are hard-wired to stay OFF. They cannot see or hear a thing until you actively hold the button.'
          },
          {
            title: 'No Third-Party Ads',
            description:[
              'A 100% Pure Play Zone. Contains no third-party ads, no tracking,',
              'and no stranger interaction.'
            ]
          }
        ]
      },
      impact: {
        heading: '3x Creativity. 90 Mins Focus. Real STEAM Skills',
        stats: [
          {
            title: '3x Creativity Boost',
            titleLine1: '3x',
            titleLine2: 'Creativity Boost',
            description:
              'From simple stacks to complex masterpieces. Testers show a 3x increase in complexity, using more colors, bolder shapes, and richer details than ever before.',
            descriptionMobile: [
              'Testers show a 3x increase in complexity,',
              'using more colors, bolder shapes, and',
              'richer details than ever before.'
            ]
          },
          {
            title: '90 Mins Deep Focus',
            titleLine1: '90',
            titleLine1Small: 'mins',
            titleLine2: 'Deep Focus',
            description:
              "Kids build wonderlands. Parents make coffee. Average play time extends to 90 minutes (vs. the usual 15). That's deep flow state for them, and well deserved downtime for you.",
            descriptionMobile: "Average play time extends to 90 minutes (vs. the usual 15). That's deep flow state for them, and downtime for you."
          },
          {
            title: 'Steam & Problem Solving',
            titleLine1: 'Steam',
            titleLine2: 'Problem Solving',
            description:
              'Learning engineering without knowing it. Sparky guides them to solve structural problems to advance the story. They learn physics and math naturally while saving the day.',
            descriptionMobile: 'Learning Engineering without knowing it. Sparky guides them to solve structural problems to advance the story. They learn Physics and Math naturally while saving the day.'
          }
        ]
      },
      story: {
        heading: 'From Dreamers to Builders',
        cards: [
          {
            title: 'The Team',
            description:
              '“As kids, we pretended our toys were alive. Now, we use our engineering minds to finally build them, turning the magic we once only imagined into reality for the next generation.”',
            avatars: ['Bruce', 'Bryan']
          },
          {
            title: 'The Science',
            description:
              'Collaborating with Top Minds. We partnered with engineers and researchers from UPenn, Purdue, and other top universities to craft a play experience that is joyful and positive, ensuring kids love every moment of the adventure.'
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
        heading: 'Frequently Asked Questions',
        items: [
          {
            question: 'What age is Unicorn Blocks suitable for?',
            answer:
              'Unicorn Blocks is perfectly designed for children aged 3 to 8 years old. The content adapts to their growing skills.'
          },
          {
            question: 'Do I need a subscription?',
            answer:
              'No subscription is required. Once you reserve your adventure kit, Sparky tells stories, tracks progress, and unlocks Creator Mode without hidden fees.'
          },
          {
            question: 'Is it safe for my child?',
            answer:
              'Every block is BPA-free, CPC/FCC certified, and paired with privacy-first voice controls. Parents stay in control from day one.'
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
  const kitIconPalette = [
    { base: '#feb79c', shadow: 'rgba(254, 183, 156, 0.35)' },
    { base: '#ffcf6a', shadow: 'rgba(255, 207, 106, 0.35)' },
    { base: '#b7c3ff', shadow: 'rgba(183, 195, 255, 0.35)' },
    { base: '#ffa0e1', shadow: 'rgba(255, 160, 225, 0.3)' }
  ];
  const familyBlocks = Array.from({ length: 3 }, (_, idx) => {
    // 使用当前页面的见证内容，如果是数组的数组则使用对应页面，否则使用原来的逻辑
    const testimonials = Array.isArray(copy.family.testimonials[0]) 
      ? copy.family.testimonials[familyPage] || copy.family.testimonials[0]
      : copy.family.testimonials;
    
    let testimonial = testimonials[idx % testimonials.length];
    
    // 根据页面和索引硬编码特定的更改
    if (familyPage === 1 && idx === 0) {
      // 第二页的第一个矩形块
      testimonial = {
        quote: '"So much better than watching TV."',
        author: '—Dad of 3-Year- Old'
      };
    } else if (familyPage === 2 && idx === 1) {
      // 第三页的第二个矩形块
      testimonial = {
        quote: '"I love that Sparky doesn’t ‘correct’ him. If he says it’s a rocket, Sparky sees a rocket. It really protects his imagination."',
        author: '—Mom of 5-Year-Old'
      };
    }
    
    const palette = idx % 2 === 0 ? 'sunset' : 'sky';

    return {
      ...testimonial,
      palette,
      id: `${testimonial.author}-${idx}-${familyPage}`
    };
  });

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


  return (
    <>
      {popOpen && <PopModal onClose={() => { setPopOpen(false); localStorage.setItem('popModalClosed', '1'); }} />}
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
      <BlueTopBar />
      
      <main className="home-root min-h-screen">
        {/* <Navigation /> */}

        <section className="hero-block">
          <div className="hero-backdrop" aria-hidden="true">
            <Image
              src="/assets/ima/hero-image.webp"
              alt=""
              fill
              className="hero-background-image"
              priority
              style={{ objectFit: 'contain', objectPosition: 'center' }}
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

          <div className="hero-transitions">
            <div className="hero-transition hero-transition-yellow">
              <Image
                src="/assets/image/Vector_17_1367.png"
                alt=""
                fill
                style={{ objectFit: 'cover', objectPosition: 'top center' }}
              />
            </div>
            <div className="hero-transition hero-transition-purple">
              <Image
                src="/assets/image/Vector_17_1368.png"
                alt=""
                fill
                style={{ objectFit: 'cover', objectPosition: 'top center' }}
              />
            </div>
            <div className="hero-transition hero-transition-blue">
              <Image
                src="/assets/image/Vector_17_1369.png"
                alt=""
                fill
                style={{ objectFit: 'cover', objectPosition: 'top center' }}
              />
            </div>
          </div>
        </section>

        <section className="steps-section">
          <div className="content-container">
            <div className="section-heading text-center">
              <h2 style={{textAlign: 'center', margin: '0 auto', width: '100%', whiteSpace: 'normal'}}>
                <span className="steps-heading-line1">{copy.steps.heading}</span>
                <span className="steps-heading-line2">{copy.steps.headingLine2}</span>
              </h2>
              <p>{copy.steps.subheading}</p>
            </div>
            <div className="steps-grid">
              {/* 第一组 */}
              <div className="step-item" style={{zIndex:2}}>
                <div className="step-card step-card-image-only">
                  <div className="step-image-full" style={{minHeight:'520px'}}>
                    {/* 移动端图片 */}
                    <Image src={getStepsMobileImage(0)} alt="" fill className="step-image-full-item md:hidden" style={{transform:'scale(1.15)'}} />
                    {/* PC端图片 */}
                    <Image src="/assets/ima/组合 721.png" alt="" fill className="step-image-full-item hidden md:block" style={{transform:'scale(1.15)'}} />
                  </div>
                </div>
                {/* 第一、二组之间连接矢量 */}
                <div className="step-connector">
                  <img src="/assets/ima/Vector_17_913.png" alt="arrow-1" className="step-connector-image" />
                </div>
              </div>

              {/* 第二组 */}
              <div className="step-item" style={{zIndex:1}}>
                <div className="step-card step-card-image-only">
                  <div className="step-image-full" style={{minHeight:'520px'}}>
                    {/* 移动端图片 */}
                    <Image src={getStepsMobileImage(1)} alt="" fill className="step-image-full-item md:hidden" style={{transform:'scale(1.15)'}} />
                    {/* PC端图片 */}
                    <Image src="/assets/ima/bule.png" alt="" fill className="step-image-full-item hidden md:block" style={{transform:'scale(1.15)'}} />
                  </div>
                </div>
                {/* 二、三组之间连接矢量 */}
                <div className="step-connector">
                  <img src="/assets/ima/Vector_17_911.png" alt="arrow-2" className="step-connector-image" />
                </div>
              </div>

              {/* 第三组 */}
              <div className="step-item" style={{zIndex:0}}>
                <div className="step-card step-card-image-only">
                  <div className="step-image-full" style={{minHeight:'520px'}}>
                    {/* 移动端图片 */}
                    <Image src={getStepsMobileImage(2)} alt="" fill className="step-image-full-item md:hidden" style={{transform:'scale(1.15)'}} />
                    {/* PC端图片 */}
                    <Image src="/assets/ima/组合 723 (1).png" alt="" fill className="step-image-full-item hidden md:block" style={{transform:'scale(1.15)'}} />
                  </div>
                </div>
                {/* 三、四组之间连接矢量 */}
                <div className="step-connector">
                  <img src="/assets/ima/Vector_17_913.png" alt="arrow-3" className="step-connector-image" />
                </div>
              </div>

              {/* 第四组 */}
              <div className="step-item" style={{zIndex:-1}}>
                <div className="step-card step-card-image-only">
                  <div className="step-image-full" style={{minHeight:'520px'}}>
                    {/* 移动端图片 */}
                    <Image src={getStepsMobileImage(3)} alt="" fill className="step-image-full-item md:hidden" style={{transform:'scale(1.15)'}} />
                    {/* PC端图片 */}
                    <Image src="/assets/ima/green.png" alt="" fill className="step-image-full-item hidden md:block" style={{transform:'scale(1.15)'}} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section3" className="kit-section">
          <div className="content-container">
            <div className="kit-heading-block">
              <h2>{copy.kit.heading}</h2>
              <p className="kit-subheading">{copy.kit.subheading}</p>
            </div>

              <div className="kit-layout">
                <div className="kit-media-block">
                  <div className="kit-media-single">
                    {/* 移动端图片 */}
                    <Image src="/assets/ima/section3.png" alt="Sparky Adventure Kit" fill className="kit-media-single-image md:hidden" />
                    {/* PC端图片 */}
                    <Image src="/assets/ima/组合 673.png" alt="Sparky Adventure Kit" fill className="kit-media-single-image hidden md:block" />
                  </div>
                </div>
                <div className="kit-details-block">
                  <div className="kit-panel">
                    {copy.kit.categories.map((category, index) => {
                      const accent = kitIconPalette[index % kitIconPalette.length];
                      const isOpen = kitPanelOpen[index];
                      const toggleOpen = () => {
                        const newState = [...kitPanelOpen];
                        newState[index] = !newState[index];
                        setKitPanelOpen(newState);
                      };
                      
                      return (
                      <div
                        className="kit-panel-row"
                        key={category.title}
                        style={{ '--kit-accent': accent.base, '--kit-accent-shadow': accent.shadow }}
                      >
                        <button 
                          className="kit-panel-title-button"
                          onClick={toggleOpen}
                          style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                          <div className="kit-panel-title" style={{ flex: 1, margin: 0 }}>
                            <div className="kit-panel-icon">
                              <Image 
                                src={index === 0 ? '/assets/ima/section3-1.svg' : 
                                     index === 1 ? '/assets/ima/section3-2.svg' : 
                                     index === 2 ? '/assets/ima/section3-3.svg' : 
                                     '/assets/ima/section3-4.svg'} 
                                alt="" 
                                width={40} 
                                height={40} 
                                className="kit-panel-icon-svg"
                              />
                            </div>
                            <h3 style={{ color: isOpen ? '#B589E2' : '#0F172A' }}>{index === 0 ? 'Magical Buddy' : 
                                 index === 1 ? 'Magic Hats' : 
                                 index === 2 ? 'Magic Blocks' : 
                                 '100 Universal Blocks'}</h3>
                          </div>
                          <span className="kit-panel-toggle" style={{ display: 'none', marginLeft: '8px', fontSize: '16px' }}>
                            {isOpen ? '▲' : '▼'}
                          </span>
                        </button>
                        <ul className="kit-panel-content" style={{ 
                          maxHeight: isOpen ? '1000px' : '0',
                          overflow: 'hidden',
                          transition: 'max-height 0.3s ease',
                          margin: 0,
                          padding: isOpen ? '12px 0 0 0' : '0'
                        }}>
                          {category.highlights.map((item) => (
                            <li key={item}>{renderHighlight(item)}</li>
                          ))}
                        </ul>
                      </div>
                    );
                    })}
                  </div>
                </div>

            </div>
          </div>
        </section>

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
                  // 更新见证内容
                  let updatedQuote = block.quote;
                  let updatedAuthor = block.author;
                  
                  if (index === 0) {
                    updatedQuote = '"So much better than watching TV."';
                    updatedAuthor = '—Dad of 3-Year- Old';
                  } else if (index === 1) {
                    updatedQuote = '"I love that Sparky doesn’t ‘correct’ him. If he says it’s a rocket, Sparky sees a rocket. It really protects his imagination."';
                    updatedAuthor = '—Mom of 5-Year-Old';
                  } else if (index === 2) {
                    updatedQuote = '"Pleeease, just five more minutes! I have to light up all the lights on Sparky’s hat!"';
                    updatedAuthor = '—Our Little Builder, 5';
                  }
                  
                  return (
                  <div className={`family-card ${block.palette}`} key={block.id || `${block.author}-${index}`}>
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
                {[0, 1, 2].map((pageIndex) => (
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

        <section className="privacy-section">
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
                    Data is automatically wiped and NEVER exposed to third parties. 
                    <br />
                    You can permanently delete any history instantly via the app.
                  </p>
                </div>
              </div>
              <div className="privacy-illustration">
                <Image src="/assets/ima/Rectangle_17_1101.png" alt="" width={400} height={400} className="privacy-illustration-image" />
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
                    Physically OFF Until You Press.
                    <br />
                    Mic & Camera are hard-wired to stay OFF.
                    <br />
                    They can't see or hear a thing until you actively hold the button.
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
                    A 100% Pure Play Zone.
                    <br />
                    Contains No Third-Party Ads, no tracking,
                    <br />
                    and no stranger interaction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

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
              <span className="impact-heading-line1 md:hidden">3x Creativity. 90 Mins</span>
              <span className="impact-heading-line2 md:hidden">Focus. Real STEAM Skills</span>
              <span className="hidden md:inline">{copy.impact.heading}</span>
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

        <section className="story-section">
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

        <Footer onSubscribe={handleFooterSubmit} />
      </main>

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
          padding: calc(var(--nav-height) +0.1px) 0 0;
          overflow: visible;
          background: linear-gradient(90deg, #FEFAE5 0%, #D9F1FC 100%);
          //max-height: 80vh;
        }

        .hero-block::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #FEFAE5 0%, #D9F1FC 100%);
          z-index: -2;
        }

        .hero-backdrop {
          position: absolute;
          inset: -5%;
          pointer-events: none;
          z-index: 6;
        }

        .hero-background-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          transform: none;
          //left: -100%; /* 向左偏移5%来居中 */
          //top: -50%;  /* 向上偏移5%来居中 */
        }

        .hero-shell {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-mobile);  /* 移动端：16px */
          position: relative;
          z-index: 10;
          text-align: center;
          padding-top: 50px;
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
          margin: 0 0 10px;
          font-size: clamp(3.1rem, 5vw, 4.8rem);
          line-height: 1.05;
        }

        .hero-title-primary {
          display: block;
          color: var(--color-primary-dark);  /* 移动端：#0F192A */
          font-weight: 800;
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
        }

        @media (min-width: 768px) {
          .hero-title-primary {
            color: #54545C;  /* PC端：恢复原色 */
          }
        }

        .hero-title-accent {
          display: block;
          color: #f7ad3b;
          font-weight: 800;
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
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
          font-size: 1.2rem;
          line-height: 1.6;
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
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-top: 0;
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

        .hero-transitions {
          position: relative;
          width: 100%;
          height: clamp(360px, 60vw, 640px); /* 自适应高度 */
          z-index: 0;
          overflow: visible;
          background: #EEF9FF0;
        }

        /* 大屏幕响应式调整 */
        /*
        @media (min-width: 1440px) {
          .hero-block {
            max-height: 88vh;
          }
          
          .hero-transitions {
            height: min(640px, calc(90vh - var(--nav-height) - 200px));
          }
        */

        .hero-transition {
          position: absolute;
          width: 100%;
          left: 0;
        }

        .hero-transition-yellow {
          top: 0;
          height: 537px;
          z-index: 1;
        }

        .hero-transition-purple {
          top: 151px;
          height: 349px;
          z-index: 2;
        }

        .hero-transition-blue {
          top: 284px;
          height: 364px;
          z-index: 3;
        }

        .hero-transition img {
          width: 100%;
          height: 100%;
          object-fit: fill;
          display: block;
        }

        .steps-section {
          padding: 80px 0 0;
          background: #EEF9FF;
          margin-top: 0;
          position: relative;
          z-index: 3;
        }

        .steps-section::after {
          content: '';
          position: absolute;
          bottom: -50px;
          left: 0;
          right: 0;
          height: 80px;
          background: #EEF9FF;
          border-radius: 0 0 50% 50% / 0 0 60px 60px;
          z-index: 2;
        }

        .content-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .section-heading h2 {
          font-size: clamp(2rem, 3vw, 3rem);
          margin-bottom: 12px;
          color: var(--color-primary-dark);  /* 移动端：#0F192A */
          font-weight: 700;
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
        }

        @media (min-width: 768px) {
          .section-heading h2 {
            color: #54545C;  /* PC端：恢复原色 */
          }
        }

        /* Steps Section标题分行 */
        .steps-heading-line1,
        .steps-heading-line2 {
          display: block;
        }

        @media (min-width: 768px) {
          .steps-heading-line1::after {
            content: ' ';  /* PC端：单行显示 */
          }
          
          .steps-heading-line2 {
            display: inline;
          }
        }

        .section-heading p {
          font-size: 1.125rem;
          color: #54545C;
          font-weight: 400;
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
        }

        .steps-grid {
          margin-top: 48px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 6px;  /* PC端间距 */
          position: relative;
          z-index: 3;
        }

        .step-item {
          position: relative;
        }

        .step-card {
          position: relative;
          border-radius: 32px;
          padding: 24px;
          min-height: 380px;
          box-shadow: 0 20px 40px rgba(17, 24, 39, 0.08);
          display: flex;
          flex-direction: column;
          z-index: 1;
          background: transparent;
        }

        .step-card-image-only {
          padding: 0;
          min-height: auto;
          overflow: visible;
          box-shadow: none;
        }

        .step-image-full {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 450px;
          z-index: 3;
          overflow: visible;
        }

        .step-image-full-item {
          object-fit: contain;
          border-radius: 32px;
          width: 100%;
          height: 100%;
        }

        .step-image-layered {
          position: relative;
          width: 100%;
          height: 160px;
          margin-bottom: 16px;
        }

        .step-image-border {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .step-image-border-item {
          object-fit: cover;
          border-radius: 24px;
        }

        .step-image-inner {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          bottom: 20px;
          z-index: 2;
        }

        .step-image-inner-item {
          object-fit: cover;
          border-radius: 16px;
        }

        .step-body {
          margin-top: auto;
        }

        .step-card h3 {
          font-size: 1.3rem;
          margin-bottom: 6px;
        }

        .step-card p {
          font-size: 1rem;
          color: #374151;
        }

        .step-connector {
          position: absolute;
          /* 移动端：底部居中，镜像翻转（斜向下） */
          bottom: -50px;
          left: 50%;
          transform: translateX(-50%) rotate(-50deg) scaleX(-1);
          width: 100px;
          height: 100px;
          pointer-events: none;
          z-index: 3;
        }

        @media (min-width: 768px) {
          .step-connector {
            /* PC端：右侧垂直居中，不旋转 */
            bottom: auto;
            left: auto;
            right: -50px;
            top: 50%;
            transform: translateY(-50%);
            width: 150px;
            height: 90px;
          }
        }

        .step-connector-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .kit-section {
          padding: 100px 0 90px;
          background: #FFFEF3;
          position: relative;
          z-index: -2;
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
          white-space: nowrap;
        }

        @media (min-width: 768px) {
          .kit-heading-block h2 {
            color: #54545C;  /* PC端：恢复原色 */
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
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1fr);
          gap: 46px;
          align-items: stretch;
        }

        .kit-media-block {
          display: flex;
          flex-direction: column;
          gap: 22px;
          position: relative;
          padding: 10px 0 0 14px;
        }

        .kit-media-single {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 500px;
        }

        .kit-media-single-image {
          object-fit: contain;
          object-position: center;
          width: 100%;
          height: 100%;
        }
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

        .kit-panel {
          background: #F7F3FD;
          border-radius: 34px;
          padding: 28px 30px;
          box-shadow: 0 24px 55px rgba(106, 96, 185, 0.12);
          display: grid;
          gap: 18px;
        }

        /* 移动端白色矩形背景 */
        @media (max-width: 767px) {
          .kit-panel {
            background: rgba(255, 255, 255, 1);
            border-radius: 20px;
            box-shadow: inset 0px 4px 4px 0px rgba(235, 223, 247, 0.5), 0px 2px 2px 0px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }
        }

        .kit-panel-row {
          padding-bottom: 10px;
        }

        .kit-panel-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .kit-panel-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.95rem;
          font-weight: 700;
          margin-bottom: 10px;
          color: #4b35b4;
        }

        .kit-panel-title h3 {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Rubik', sans-serif;
          color: #0F172A;
          line-height: 30px;
          letter-spacing: 0;
          text-align: left;
        }

        /* 移动端标题颜色 - 展开时为 #B589E2，未展开时为 #0F172A */
        @media (max-width: 767px) {
          .kit-panel-title h3 {
            color: #0F172A;
          }
        }

        .kit-panel-icon {
          width: 40px;
          height: 40px;
          position: relative;
          display: inline-flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          margin-left: 20px;
        }

        .kit-panel-icon-svg {
          display: block;
          width: 40px;
          height: 40px;
          flex-shrink: 0;
        }

        .kit-panel-row ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 8px;
        }

        .kit-panel-row ul {
          margin-left: 30px;
        }

        /* 移动端展开/收起样式 */
        @media (max-width: 767px) {
          .kit-panel-title-button {
            cursor: pointer;
          }

          .kit-panel-toggle {
            display: inline-block !important;
          }
        }

        /* PC端始终展开 */
        @media (min-width: 768px) {
          .kit-panel-toggle {
            display: none !important;
          }

          .kit-panel-content {
            max-height: none !important;
            overflow: visible !important;
          }
        }

        .kit-panel-row li {
          color: #6C6767;
          font-size: 0.88rem;
          line-height: 1.45;
          white-space: pre-line;
        }

        .kit-panel-row li strong::first-letter {
          font-size: 2rem;
          line-height: 0.88rem;
          vertical-align: text-bottom;
          display: inline-block;
          margin-right: 4px;
        }

        .kit-panel-row li .kit-text-rest {
          display: inline;
        }

        .family-section {
          padding: 95px 0 50px;
          background: #F7F3FD;  /* 移动端：紫色 */
          position: relative;
          overflow: hidden;
          z-index: 3;
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

        .family-pagination {
          margin-top: 46px;
          display: flex;
          gap: 12px;
          justify-content: center;
          position: relative;
          z-index: 2;
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

        @media (min-width: 768px) {
          .privacy-section {
            background: #FFFCF9;  /* PC端：原色 */
          }
        }

        .privacy-heading {
          text-align: center;
          padding-top: 80px;
        }

        .privacy-heading h2 {
          font-size: clamp(2rem, 3vw, 3rem);
          line-height: 1.3;
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
          display: inline-block;
          color: #20604B;
          font-size: 12px;  /* 减小两号字体 */
          font-weight: 600;
          margin-top: 12px;
          text-align: center;
          min-width: 200px;  /* 增加最小宽度让文字一行显示 */
          height: 19px;
          border-radius: 10px;
          background: #EAF6F2;
          padding: 4px 16px;  /* 增加左右padding */
          line-height: 19px;
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

        /* 第二行：两个对话框卡片 */
        .privacy-cards-row {
          margin-top: -50px;
          display: flex;
          gap: 24px;
          justify-content: center;
        }

        .privacy-card-with-text {
          position: relative;
          flex: 1;
          min-height: 300px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 40px;
        }

        /* 第一行的第一个卡片 - 放大并设置 z-index */
        .privacy-card-row .privacy-card-with-text {
          flex: 0 0 80%;
          max-width: 1190px;
          min-height: 350px;
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
          }

          .privacy-illustration {
            margin-left: 0;
            position: absolute;  /* 移动端改为绝对定位 */
            top: 16px;  /* 右上角 */
            right: 16px;
            z-index: 3;
          }

          .privacy-illustration-image {
            max-width: 120px;  /* 移动端图片更小 */
          }

          .privacy-cards-row {
            flex-direction: column;
          }

          .privacy-card-with-text {
            min-height: 250px;
          }

          .privacy-card-content {
            padding: 30px 20px;
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
            position: relative;
          }

          /* 移动端卡片左上角图标 */
          .privacy-card-icon {
            position: absolute;
            top: 30px;  /* 与 privacy-card-content 的 padding-top 对齐 */
            left: 20px;  /* 与 privacy-card-content 的 padding-left 对齐 */
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
            margin-left: 60px;  /* 为
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
            text-align: left;
            color: transparent;
          }

          /* 第一行卡片的正文 */
          .privacy-card-row .privacy-card-content p {
            color: #697077;
            font-family: 'Rubik', sans-serif;
            font-size: 14px;
            line-height: 1.6;
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
        }

        @media (min-width: 768px) {
          .impact-section h2 {
            color: #54545C;  /* PC端：恢复原色 */
          }
        }

        /* Impact Section 标题分行 */
        .impact-heading-line1,
        .impact-heading-line2 {
          display: block;
        }

        @media (min-width: 768px) {
          .impact-heading-line1::after {
            content: ' ';  /* PC端：单行显示 */
          }
          
          .impact-heading-line2 {
            display: inline;
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

        .story-section h2 {
          text-align: center;
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          margin-bottom: 48px;
          font-weight: 700;
          color: var(--color-primary-dark);  /* 移动端：#0F192A */
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
          white-space: normal;
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
            gap: 16px;
          }

          /* 移动端隐藏 PC 端图片 */
          .story-card-visual {
            display: none !important;
          }

          .story-card-body {
            background: rgba(255, 255, 255, 1);
            border-radius: 20px;
            box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.1);
            padding: 20px;
            min-height: auto;
          }

          /* 移动端：图片和标题在同一行 */
          .story-card-header {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 12px;
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

        .faq-section h2 {
          text-align: center;
          font-size: clamp(2rem, 3vw, 3rem);
          margin-bottom: 32px;
          color: var(--color-primary-dark);  /* 移动端：#0F172A */
          font-weight: 700;  /* 移动端：加粗 */
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
          border-color: #7d6cf5;
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
        }

        .faq-icon {
          font-size: 1.5rem;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
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

          .hero-block {
            padding: calc(var(--nav-height) +0.1px) 0 0;
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

          .hero-background-image {
            transform: scale(0.85);
            object-position: center 40px;
          }

          .hero-badge-icon {
            width: 18px;
            height: 18px;
          }

          .hero-transitions {
            height: 380px;
          }

          .hero-transition-yellow {
            height: 420px;
          }

          .hero-transition-purple {
            top: 118px;
            height: 273px;
          }

          .hero-transition-blue {
            top: 221px;
            height: 284px;
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
            min-height: 400px;
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
          .steps-grid,
          .timeline-points {
            grid-template-columns: minmax(0, 1fr);
          }

          /* 移动端 Section 2 图片间距更小 */
          .steps-grid {
            gap: 8px;
          }

          .hero-block {
            padding: calc(var(--nav-height) +0.1px) 0 0;
          }

          .hero-shell {
            padding: 20px 18px 0;
          }

          .hero-background-image {
            transform: scale(0.82);
            object-position: center 60px;
          }

          .hero-transitions {
            height: 300px;
          }

          .hero-transition-yellow {
            height: 335px;
          }

          .hero-transition-purple {
            top: 94px;
            height: 218px;
          }

          .hero-transition-blue {
            top: 177px;
            height: 227px;
          }

          .hero-heading h1 {
            font-size: clamp(2.6rem, 8vw, 3.6rem);
          }

          .hero-description {
            font-size: 1.05rem;
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
            min-height: 400px;
          }

          .family-stage {
            padding: 48px 24px;
            clip-path: polygon(7% 0, 100% 0, 100% 100%, 0 100%, 0 18%);
          }

          .family-mosaic {
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }

          .family-card {
            padding: 16px 18px;
          }

          .story-panels {
            gap: 18px;
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
