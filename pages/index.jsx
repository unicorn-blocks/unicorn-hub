import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import { safeApiCall } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState(0);

  const translations = {
    en: {
      meta: {
        title: 'Not Just Stacking, Creating! | Unicorn Blocks',
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
            quote: '“So much better than watching TV.”',
            author: 'Mom of 3-Year-Old',
            image: '/assets/reserve-vip-spot/toy-1.jpg'
          },
          {
            quote:
              "“I love that Sparky doesn’t ‘correct’ him. If he says it’s a rocket, Sparky sees a rocket. It really protects his imagination.”",
            author: 'Our Little Builder, 5',
            image: '/assets/reserve-vip-spot/toy-2.jpg'
          },
          {
            quote:
              '“Pleeease, just five more minutes! I have to light up all the lights on Sparky’s hat!”',
            author: 'Our Little Builder, 5',
            image: '/assets/ks_pic/train.png'
          }
        ]
      },
      privacy: {
        heading: 'Uncompromising Privacy:',
        subheading: "Your Child's Data Is Yours Alone.",
        tag: 'COPPA Compliant Design',
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
            description:
              'A 100% Pure Play Zone. Contains no third-party ads, no tracking, and no stranger interaction.'
          }
        ]
      },
      impact: {
        heading: '3x Creativity. 90 Mins Focus. Real STEAM Skills',
        stats: [
          {
            title: '3x Creativity Boost',
            description:
              'From simple stacks to complex masterpieces. Testers show a 3x increase in complexity, using more colors, bolder shapes, and richer details than ever before.'
          },
          {
            title: '90 Mins Deep Focus',
            description:
              "Kids build wonderlands. Parents make coffee. Average play time extends to 90 minutes (vs. the usual 15). That's deep flow state for them, and well deserved downtime for you."
          },
          {
            title: 'STEAM & Problem Solving',
            description:
              'Learning engineering without knowing it. Sparky guides them to solve structural problems to advance the story. They learn physics and math naturally while saving the day.'
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
  const familyBlocks = Array.from({ length: 4 }, (_, idx) => {
    const testimonial = copy.family.testimonials[idx % copy.family.testimonials.length];
    const palette = idx % 2 === 0 ? 'sunset' : 'sky';

    return {
      ...testimonial,
      palette,
      id: `${testimonial.author}-${idx}`
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
        <strong style={{ color: isSpecial ? '#6C6767' : '#2f2d65' }}>·  {lead} --</strong> <span className="kit-text-rest">{processedRest}</span>
      </>
    );
  };

  const handleFooterSubmit = (email, setFooterStatus) => {
    if (!email || !email.includes('@')) {
      if (setFooterStatus) {
        setFooterStatus({
          message: copy.messages.emailError,
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
        language
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          if (setFooterStatus) {
            setFooterStatus({
              message: data.message || copy.messages.subscribeSuccess,
              type: 'success'
            });
          }
        } else {
          if (setFooterStatus) {
            setFooterStatus({
              message: data.message || copy.messages.subscribeFailed,
              type: 'error'
            });
          }
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        if (setFooterStatus) {
          setFooterStatus({
            message: copy.messages.connectionError,
            type: 'error'
          });
        }
      });
  };

  return (
    <>
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
      <main className="home-root min-h-screen">
        <Navigation />

        <section className="hero-block">
          <div className="hero-top-bar">
            <Image
              src="/assets/image/Rectangle_17_1389.png"
              alt="Unicorn Blocks Logo"
              width={60}
              height={60}
              className="hero-logo"
            />
            <span className="hero-brand-text">Unicorn Blocks</span>
          </div>
          <div className="hero-backdrop" aria-hidden="true">
            <Image
              src="/assets/image/8e907cfa4c8d829cac77709d26f232866e8bbbcc.png"
              alt=""
              fill
              className="hero-background-image"
              priority
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="hero-ellipse" />

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
              <h2>{copy.steps.heading}</h2>
              <p>{copy.steps.subheading}</p>
            </div>
            <div className="steps-grid">
              {/* 第一组 */}
              <div className="step-item">
                <div className="step-card step-card-image-only">
                  <div className="step-image-full">
                    <Image src="/assets/ima/组合 721.png" alt="" fill className="step-image-full-item" />
                  </div>
                </div>
              </div>

              {/* 第二组 */}
              <div className="step-item">
                <div className="step-card step-card-image-only">
                  <div className="step-image-full">
                    <Image src="/assets/ima/bule.png" alt="" fill className="step-image-full-item" />
                  </div>
                </div>
              </div>

              {/* 第三组 */}
              <div className="step-item">
                <div className="step-card step-card-image-only">
                  <div className="step-image-full">
                    <Image src="/assets/ima/组合 723 (1).png" alt="" fill className="step-image-full-item" />
                  </div>
                </div>
              </div>

              {/* 第四组 */}
              <div className="step-item">
                <div className="step-card step-card-image-only">
                  <div className="step-image-full">
                    <Image src="/assets/ima/green.png" alt="" fill className="step-image-full-item" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="kit-section">
          <div className="content-container">
            <div className="kit-heading-block">
              <h2>{copy.kit.heading}</h2>
              <p className="kit-subheading">{copy.kit.subheading}</p>
            </div>

              <div className="kit-layout">
                <div className="kit-media-block">
                  <div className="kit-media-single">
                    <Image src="/assets/ima/组合 673.png" alt="Sparky Adventure Kit" fill className="kit-media-single-image" />
                  </div>
                </div>
                <div className="kit-details-block">
                  <div className="kit-panel">
                    {copy.kit.categories.map((category, index) => {
                      const accent = kitIconPalette[index % kitIconPalette.length];
                      return (
                      <div
                        className="kit-panel-row"
                        key={category.title}
                        style={{ '--kit-accent': accent.base, '--kit-accent-shadow': accent.shadow }}
                      >
                        <div className="kit-panel-title">
                          <div className="kit-panel-icon">
                            <Image 
                              src={index === 0 ? '/assets/ima/1.svg' : 
                                   index === 1 ? '/assets/ima/orange.svg' : 
                                   index === 2 ? '/assets/ima/3.svg' : 
                                   '/assets/ima/4.svg'} 
                              alt="" 
                              width={25} 
                              height={25} 
                              className="kit-panel-icon-svg"
                            />
                          </div>
                          <h3>{category.title}</h3>
                        </div>
                        <ul>
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
                {familyBlocks.map((block, index) => (
                  <div className={`family-card ${block.palette}`} key={block.id || `${block.author}-${index}`}>
                    <div className={`family-photo frame-${block.palette}`}>
                      <Image src={block.image} alt={block.author} width={320} height={240} />
                    </div>
                    <div className="family-quote">
                      <p>{block.quote}</p>
                      <span>{block.author}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="family-pagination" aria-hidden="true">
                <span className="active" />
                <span />
                <span />
              </div>
            </div>
          </div>
        </section>

        <section className="privacy-section">
          <div className="content-container">
            <div className="privacy-heading">
              <div>
                <h2>
                  <span className="privacy-line1">{copy.privacy.heading}</span>
                  <br />
                  <span className="privacy-line2">{copy.privacy.subheading}</span>
                </h2>
                <p className="privacy-tag">{copy.privacy.tag}</p>
              </div>
            </div>
            <div className="privacy-images">
              <div className="privacy-image-item">
                <Image src="/assets/ima/组合 643.png" alt="" width={1200} height={600} className="privacy-image" />
              </div>
              <div className="privacy-image-item">
                <Image src="/assets/ima/组合 648.png" alt="" width={1200} height={600} className="privacy-image" />
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
            <h2>{copy.impact.heading}</h2>
            <div className="impact-grid">
              {copy.impact.stats.map((stat, index) => (
                <div className="impact-card" key={stat.title}>
                  <div className="impact-icon-wrapper">
                    <Image
                      src={index === 0 ? '/assets/ima/svg 5.svg' : index === 1 ? '/assets/ima/svg 6.svg' : '/assets/ima/svg 7.svg'}
                      alt=""
                      width={64}
                      height={64}
                      className="impact-icon"
                    />
                  </div>
                  <h3>{stat.title}</h3>
                  <p>{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="story-section">
          <div className="content-container">
            <h2>{copy.story.heading}</h2>
            <div className="story-panels">
              {copy.story.cards.map((card) => (
                <div className="story-card" key={card.title}>
                  <div className="story-card-visual">
                    {card.avatars ? (
                      <div className="story-avatar-stack">
                        {card.avatars.map((avatar) => (
                          <div className="story-avatar" key={avatar}>
                            <span>{avatar[0]}</span>
                            <small>{avatar}</small>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="story-logo-stack">
                        <span>UPenn</span>
                        <span>Purdue</span>
                      </div>
                    )}
                  </div>
                  <div className="story-card-body">
                    <div className="story-card-title">{card.title}</div>
                    <p>{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="story-roadmap">
              <svg className="story-roadmap-line" viewBox="0 0 1200 160" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 140 Q 150 40 300 120 T 600 120 T 900 120 T 1200 40" stroke="#115499" strokeWidth="8" strokeDasharray="18 18" fill="none" strokeLinecap="round" />
              </svg>
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
          padding: calc(var(--nav-height) + 48px) 0 0;
          overflow: visible;
          background: linear-gradient(90deg, #FEFAE5 0%, #D9F1FC 100%);
        }

        .hero-top-bar {
          position: relative;
          width: 100%;
          background-color: #AAC2F4;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px 24px;
          z-index: 8;
          margin-top: -100px;
          top: -100px;
        }

        .hero-logo {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }

        .hero-brand-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: #000000;
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
          inset: 0;
          pointer-events: none;
          z-index: 6;
        }

        .hero-background-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-ellipse {
          position: absolute;
          left: 50%;
          top: 89%;
          transform: translateX(-50%);
          width: 700px;
          max-width: 52%;
          height: 150px;
          background-color: #D1EDFA;
          border-radius: 50%;
          z-index: 5;
        }

        .hero-shell {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 10;
          text-align: center;
          margin-top: -60px;
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
          margin: 18px 0 10px;
          font-size: clamp(3.1rem, 5vw, 4.8rem);
          line-height: 1.05;
        }

        .hero-title-primary {
          display: block;
          color: #54545C;
          font-weight: 800;
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
        }

        .hero-title-accent {
          display: block;
          color: #f7ad3b;
          font-weight: 800;
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
        }

        .hero-description-wrapper {
          margin: 6px auto 18px;
          max-width: 720px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }

        .hero-description {
          margin: 0;
          font-size: 1.15rem;
          line-height: 1.6;
          color: #54545C;
          font-weight: 600;
          text-align: center;
        }

        .hero-description-line2 {
          margin-top: 0;
        }

        .hero-badge-row {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-top: -3px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 400;
          color: #54545C;
          font-size: 1rem;
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
          height: 640px;
          z-index: 0;
          overflow: visible;
          background: #EEF9FF0;
        }

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
          padding: 100px 0 0;
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
          height: 100px;
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
          color: #54545C;
          font-weight: 700;
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
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
          gap: 16px;
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
          right: -90px;
          top: 50%;
          transform: translateY(-50%);
          width: 150px;
          height: 90px;
          pointer-events: none;
          z-index: 2;
        }

        .step-connector-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .kit-section {
          padding: 100px 0 130px;
          background: #FFFEF3;
          position: relative;
          margin-top: -50px;
          z-index: 1;
        }

        .kit-heading-block {
          text-align: center;
          max-width: 760px;
          margin: 50px auto 38px;
        }

        .kit-heading-block h2 {
          font-size: clamp(2.2rem, 3.2vw, 3.2rem);
          color: #54545C;
          font-weight: 700;
          margin-bottom: 10px;
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
          white-space: nowrap;
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
          font-size: 1.25rem;
          color: #483E92;
        }

        .kit-panel-icon {
          width: 25px;
          height: 25px;
          position: relative;
          display: inline-flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
        }

        .kit-panel-icon-svg {
          display: block;
          width: 25px;
          height: 25px;
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
          padding: 95px 0 1px;
          background: #FFFEF3;
          position: relative;
        }

        .family-bg-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          pointer-events: none;
          z-index: 1;
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
          top: 0;
          z-index: 2;
        }

        .family-bg-bottom {
          top: 45px;
          z-index: 1;
        }

        .family-stage {
          position: relative;
          border-radius: 56px;
          padding: 90px 80px;
          background: transparent;
          box-shadow: 0 40px 80px rgba(19, 35, 77, 0.15);
          clip-path: polygon(5% 0, 100% 0, 100% 95%, 0 100%, 0 15%);
          overflow: hidden;
          z-index: 2;
        }

        .family-header {
          max-width: 540px;
          position: relative;
          z-index: 2;
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
          color: #1c2957;
          margin: 0;
          line-height: 1.05;
        }

        .family-mosaic {
          margin-top: 54px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 38px 40px;
          position: relative;
          z-index: 2;
        }

        .family-card {
          --quote-color: #f07f1f;
          --frame-color: #f49f3f;
          --photo-bg: #fff1df;
          display: grid;
          grid-template-columns: minmax(150px, 210px) 1fr;
          align-items: center;
          gap: 22px;
          padding: 24px 32px;
          border-radius: 34px;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 25px 45px rgba(25, 43, 80, 0.15);
          position: relative;
          z-index: 2;
        }

        .family-card:nth-child(odd) {
          transform: translateY(-18px);
        }

        .family-card:nth-child(even) {
          transform: translateY(18px);
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

        .family-quote p {
          font-family: 'Playfair Display', 'Times New Roman', serif;
          font-size: clamp(1.3rem, 2.6vw, 1.8rem);
          font-weight: 700;
          color: var(--quote-color);
          line-height: 1.35;
          margin: 0 0 12px;
        }

        .family-quote span {
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #25336a;
          text-transform: uppercase;
          font-size: 0.9rem;
        }

        .family-pagination {
          margin-top: 46px;
          display: flex;
          gap: 12px;
          justify-content: center;
          position: relative;
          z-index: 2;
        }

        .family-pagination span {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: rgba(30, 47, 97, 0.3);
        }

        .family-pagination .active {
          background: #1d4acb;
        }

        .privacy-section {
          padding: 0 0 150px;
          background: #FFFCF9;
          margin-top: 0;
          position: relative;
          z-index: 0;
        }

        .privacy-heading {
          text-align: center;
          padding-top: 120px;
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
          color: #54545C;
          font-weight: 700;
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
        }

        .privacy-tag {
          display: block;
          color: #878787;
          font-size: clamp(1.125rem, 1.6875vw, 1.6875rem);
          font-weight: 400;
          margin-top: 12px;
          text-align: center;
        }

        .privacy-images {
          margin-top: 60px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .privacy-image-item {
          width: 100%;
          position: relative;
        }

        .privacy-image {
          width: 100%;
          height: auto;
          object-fit: contain;
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
          background: #FFFCF9;
          position: relative;
        }

        .impact-bg-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          pointer-events: none;
          z-index: 0;
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
          color: #54545C;
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
          margin-top: 10px;
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
          color: #54545C;
          font-size: 1.5rem;
        }

        .impact-card p {
          color: #646464;
          text-align: center;
          font-size: 0.8rem;
        }

        .story-section {
          padding: 140px 0;
          background: #FFF6D0;
        }

        .story-section h2 {
          text-align: center;
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          margin-bottom: 48px;
          font-weight: 700;
          color: #54545C;
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
        }

        .story-panels {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 26px;
        }

        .story-card {
          display: grid;
          grid-template-columns: 160px 1fr;
          gap: 28px;
          padding: 32px;
          border-radius: 42px;
          background: #dce8ff;
          box-shadow: inset 0 0 0 4px #b8d1ff;
          position: relative;
        }

        .story-card:nth-child(2) {
          background: #e1e9ff;
          box-shadow: inset 0 0 0 4px #c6d5ff;
        }

        .story-card-visual {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .story-avatar-stack {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .story-avatar {
          width: 130px;
          border-radius: 32px;
          background: #fafdff;
          box-shadow: 0 18px 30px rgba(41, 55, 97, 0.22);
          padding: 20px 16px;
          text-align: center;
        }

        .story-avatar span {
          display: inline-flex;
          width: 54px;
          height: 54px;
          border-radius: 16px;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          font-weight: 700;
          color: #1f2937;
          background: linear-gradient(135deg, #ffd9a8, #ffb876);
        }

        .story-avatar small {
          display: block;
          margin-top: 10px;
          font-size: 0.95rem;
          font-weight: 700;
          color: #42557a;
        }

        .story-logo-stack {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 140px;
        }

        .story-logo-stack span {
          display: block;
          padding: 16px;
          border-radius: 24px;
          background: #ffffff;
          font-weight: 700;
          text-align: center;
          color: #1d2c4e;
          box-shadow: 0 18px 28px rgba(32, 41, 68, 0.15);
        }

        .story-card-body {
          background: #ffffffcc;
          border-radius: 32px;
          padding: 28px;
          position: relative;
          box-shadow: inset 0 0 0 2px rgba(24, 60, 131, 0.1);
        }

        .story-card-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: #859FD3;
          margin-bottom: 12px;
          position: relative;
        }

        .story-card-title::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -6px;
          width: 120px;
          height: 4px;
          border-radius: 999px;
          background: #859FD3;
        }

        .story-card p {
          margin: 16px 0 0;
          color: #014188;
          font-size: 1rem;
          line-height: 1.6;
        }

        .story-roadmap {
          position: relative;
          padding: 10px 0;
        }

        .story-roadmap-line {
          width: 100%;
          height: 180px;
          display: block;
        }

        .story-milestones {
          position: relative;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: -60px;
        }

        .story-milestone {
          text-align: center;
          position: relative;
        }

        .story-pin {
          width: 34px;
          height: 50px;
          margin: 0 auto 14px;
          background: #ffd44d;
          border-radius: 20px 20px 50px 50px;
          position: relative;
          box-shadow: 0 10px 18px rgba(244, 175, 0, 0.3);
        }

        .story-pin span {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #0f4c81;
        }

        .story-milestone-text h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #15305c;
          margin-bottom: 6px;
        }

        .story-milestone-text p {
          color: #4b5563;
          font-size: 0.95rem;
        }

        .faq-section {
          padding: 120px 0;
          background: #fff;
        }

        .faq-section h2 {
          text-align: center;
          font-size: clamp(2rem, 3vw, 3rem);
          margin-bottom: 32px;
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

        @media (max-width: 1280px) {
          .step-connector {
            display: none;
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
            padding: calc(var(--nav-height) + 30px) 0 0;
          }

          .hero-badge-row {
            flex-wrap: wrap;
            justify-content: center;
          }

          .hero-transitions {
            height: 500px;
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
            grid-template-columns: minmax(0, 1fr);
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

          .hero-block {
            padding: calc(var(--nav-height) + 12px) 0 0;
          }

          .hero-shell {
            padding: 0 18px;
          }

          .hero-transitions {
            height: 400px;
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
            flex-direction: column;
            gap: 10px;
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
            grid-template-columns: minmax(0, 1fr);
            gap: 22px;
          }

          .family-card {
            grid-template-columns: minmax(0, 1fr);
            padding: 18px 22px;
          }

          .story-panels {
            gap: 18px;
          }

          .story-roadmap-line {
            height: 140px;
          }

          .story-milestones {
            grid-template-columns: minmax(0, 1fr);
            gap: 24px;
          }

          .timeline-line {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
