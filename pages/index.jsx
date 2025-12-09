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
          'Meet Sparky: The Magical Block Buddy that turns every build into a story.',
        badges: [
          { label: "Sparky's First Adventure Age 3-8", icon: '🎒' },
          { label: 'Compatible with LEGO®', icon: '🧱' }
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
              'Creative Journey — Packed with 30+ stories per hat! Start with 6 guided stories, then unlock Creator Mode for infinite challenges!'
            ]
          },
          {
            title: 'The Magic Blocks: 4x Light-Up Magical Blocks',
            highlights: [
              'Theme Matched — Each block pairs specifically with one Magic Hat.',
              'The Magical Prize — Unlocks upon reaching Creator Mode to light up infinite creations!'
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
              'Collaborating with Top Minds. We partnered with engineers and researchers from UPenn, Purdue, and other top universities to craft a play experience that is joyful, positive, and parent-approved.'
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

    return (
      <>
        <strong>{lead} —</strong> {rest}
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
          <div className="hero-curve" aria-hidden="true" />
          <div className="hero-container">
            <div className="hero-grid">
              <div className="hero-visual">
                <div className="speech-bubble">{copy.hero.speechBubble}</div>
                <div className="hero-character">
                  <Image
                    src="/assets/checkout/sparky.jpg"
                    alt="Sparky block buddy"
                    width={640}
                    height={640}
                    priority
                  />
                  <div className="hero-shadow" aria-hidden="true" />
                </div>
              </div>
              <div className="hero-copy">
                <h1>
                  <span className="hero-title-primary">{copy.hero.title.primary}</span>
                  <span className="hero-title-accent">{copy.hero.title.accent}</span>
                </h1>
                <p className="hero-description">{copy.hero.description}</p>
                <div className="hero-badges">
                  {copy.hero.badges.map((badge) => (
                    <div className="hero-badge" key={badge.label}>
                      <span role="img" aria-hidden="true">
                        {badge.icon}
                      </span>
                      <span>{badge.label}</span>
                    </div>
                  ))}
                </div>
              </div>
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
              {copy.steps.cards.map((card, index) => (
                <div className={`step-item ${index < copy.steps.cards.length - 1 ? 'has-connector' : ''}`} key={card.title}>
                  <div className="step-card" style={{ backgroundColor: card.background }}>
                    <div className="step-image">
                      <Image src={card.image} alt={card.title} width={320} height={220} />
                    </div>
                    <div className="step-body">
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                    </div>
                  </div>
                  {index < copy.steps.cards.length - 1 && (
                    <div className="step-connector" aria-hidden="true">
                      <svg viewBox="0 0 180 80" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 60C60 15 120 15 170 60" stroke="#13234d" strokeWidth="10" fill="none" strokeLinecap="round" />
                        <path d="M130 35L170 60L130 68" stroke="#13234d" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
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
                  <div className="kit-media-frame" aria-hidden="true" />
                  <div className="kit-media-card">
                    <div className="kit-blocks-stage">
                      <span className="kit-block kit-block-a">A</span>
                      <span className="kit-block kit-block-b">B</span>
                      <span className="kit-block kit-block-c">C</span>
                    </div>
                  </div>
                  <div className="kit-cta-card">
                    <Link href="/reserve-vip-spot" className="primary-button kit-cta">
                      {copy.kit.button}
                    </Link>
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
                          <span
                            className="kit-panel-icon"
                            style={{ backgroundColor: accent.base }}
                          />
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
          <div className="content-container">
            <div className="family-stage">
              <div className="family-angle family-angle-top" aria-hidden="true" />
              <div className="family-angle family-angle-bottom" aria-hidden="true" />
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
                  {copy.privacy.heading}{' '}
                  <span>{copy.privacy.subheading}</span>
                </h2>
                <p className="privacy-tag">{copy.privacy.tag}</p>
              </div>
            </div>
            <div className="privacy-grid">
              {copy.privacy.cards.map((card) => (
                <div className="privacy-card" key={card.title}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="impact-section">
          <div className="content-container">
            <h2>{copy.impact.heading}</h2>
            <div className="impact-grid">
              {copy.impact.stats.map((stat) => (
                <div className="impact-card" key={stat.title}>
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
          padding: calc(100px + var(--nav-height)) 0 140px;
          background: linear-gradient(180deg, #bfcbff 0%, #fff4d3 70%, #fffaf2 100%);
          overflow: hidden;
        }

        .hero-curve {
          position: absolute;
          inset: auto auto -120px -120px;
          width: 520px;
          height: 520px;
          border: 6px solid #f2c14f;
          border-radius: 60% 40% 60% 40% / 40% 60% 40% 60%;
          opacity: 0.6;
        }

        .hero-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 48px;
          align-items: center;
        }

        .hero-visual {
          position: relative;
          display: flex;
          justify-content: center;
        }

        .speech-bubble {
          position: absolute;
          top: -40px;
          left: 20px;
          background: #7d6cf5;
          color: #fff;
          padding: 12px 24px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 1rem;
          box-shadow: 0 15px 25px rgba(125, 108, 245, 0.3);
        }

        .hero-character {
          position: relative;
          background: #fffdf7;
          border-radius: 38px;
          padding: 24px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1);
        }

        .hero-character img {
          border-radius: 24px;
          object-fit: cover;
        }

        .hero-shadow {
          position: absolute;
          inset: auto 30px -30px 30px;
          height: 60px;
          filter: blur(40px);
          background: rgba(17, 24, 39, 0.25);
          border-radius: 50%;
        }

        .hero-copy h1 {
          font-size: clamp(2.8rem, 4.8vw, 5rem);
          line-height: 1.02;
          margin-bottom: 12px;
        }

        .hero-title-primary {
          display: block;
          color: #0f3e9d;
          font-weight: 800;
        }

        .hero-title-accent {
          display: block;
          color: #ffb534;
          font-weight: 800;
        }

        .hero-description {
          font-size: 1.25rem;
          margin-bottom: 24px;
          color: #374151;
        }

        .hero-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .hero-badge {
          background: #fff;
          padding: 12px 20px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
        }

        .steps-section {
          padding: 100px 0;
          background: #dff1ff;
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
        }

        .section-heading p {
          font-size: 1.125rem;
          color: #4b5563;
        }

        .steps-grid {
          margin-top: 48px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 32px;
          position: relative;
        }

        .step-item {
          position: relative;
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

        .step-connector svg {
          width: 100%;
          height: 100%;
          display: block;
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
        }

        .step-image {
          width: 100%;
          height: 160px;
          overflow: hidden;
          border-radius: 24px;
          margin-bottom: 16px;
        }

        .step-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
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

        .kit-section {
          padding: 140px 0 130px;
          background: #fffaf5;
        }

        .kit-heading-block {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 38px;
        }

        .kit-heading-block h2 {
          font-size: clamp(2.6rem, 3.8vw, 3.7rem);
          color: #161335;
          margin-bottom: 10px;
        }

        .kit-subheading {
          font-size: 1.15rem;
          color: #7b7b8e;
          margin: 0;
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

        .kit-media-frame {
          position: absolute;
          inset: 16px 110px 16px 0;
          border: 4px solid #d4c4ff;
          border-radius: 48px;
          z-index: 0;
          box-shadow: 0 20px 50px rgba(128, 93, 201, 0.2);
        }

        .kit-media-card {
          background: linear-gradient(160deg, #f5ecff 0%, #f4f0ff 50%, #fef6ff 100%);
          border-radius: 44px;
          padding: 48px;
          box-shadow: 0 30px 60px rgba(24, 20, 52, 0.1);
          position: relative;
          overflow: hidden;
          z-index: 1;
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
          background: #f4edff;
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
          font-size: 1.1rem;
          color: #36266f;
        }

        .kit-panel-icon {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          display: inline-flex;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
        }

        .kit-panel-row ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 8px;
        }

        .kit-panel-row li {
          position: relative;
          padding-left: 26px;
          color: #4b5563;
          font-size: 0.88rem;
          line-height: 1.45;
          letter-spacing: -0.005em;
        }

        .kit-panel-row li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.6rem;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--kit-accent, #a38bff);
          box-shadow: 0 0 0 4px var(--kit-accent-shadow, rgba(163, 139, 255, 0.25));
        }

        .kit-panel-row li strong {
          color: #2f2d65;
        }

        .family-section {
          padding: 140px 0 150px;
          background: linear-gradient(180deg, #f5fbff 0%, #fff7ee 100%);
        }

        .family-stage {
          position: relative;
          border-radius: 56px;
          padding: 90px 80px;
          background: #d5ecff;
          box-shadow: 0 40px 80px rgba(19, 35, 77, 0.15);
          clip-path: polygon(5% 0, 100% 0, 100% 95%, 0 100%, 0 15%);
          overflow: hidden;
        }

        .family-angle {
          position: absolute;
          background: rgba(255, 255, 255, 0.65);
          pointer-events: none;
        }

        .family-angle-top {
          top: -6%;
          left: -8%;
          width: 45%;
          height: 40%;
          clip-path: polygon(0 0, 100% 0, 0 100%);
        }

        .family-angle-bottom {
          right: -12%;
          bottom: -18%;
          width: 55%;
          height: 60%;
          clip-path: polygon(100% 0, 100% 100%, 15% 100%);
          opacity: 0.4;
        }

        .family-header {
          max-width: 540px;
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
          padding: 120px 0;
          background: #fff;
        }

        .privacy-heading h2 {
          font-size: clamp(2rem, 3vw, 3rem);
        }

        .privacy-heading span {
          color: #111827;
        }

        .privacy-tag {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          border-radius: 999px;
          background: #ece8ff;
          font-weight: 600;
          margin-top: 12px;
        }

        .privacy-grid {
          margin-top: 48px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
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
          padding: 140px 0 120px;
          background: #dbeedc;
          position: relative;
        }

        .impact-section::before {
          content: '';
          position: absolute;
          top: -80px;
          left: 0;
          width: 100%;
          height: 120px;
          background: #dbeedc;
          transform: skewY(-4deg);
        }

        .impact-section h2 {
          text-align: center;
          font-size: clamp(2rem, 3vw, 3rem);
          margin-bottom: 48px;
        }

        .impact-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        .impact-card {
          background: #f7fff5;
          border-radius: 28px;
          padding: 24px;
          box-shadow: 0 18px 30px rgba(15, 118, 110, 0.15);
        }

        .impact-card h3 {
          margin-bottom: 12px;
        }

        .story-section {
          padding: 120px 0;
          background: #fff3e6;
        }

        .story-section {
          padding: 140px 0;
          background: #fff5e8;
        }

        .story-section h2 {
          text-align: center;
          font-size: clamp(2rem, 3vw, 3rem);
          margin-bottom: 48px;
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
          color: #4b5c9a;
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
          background: #9bb4ff;
        }

        .story-card p {
          margin: 16px 0 0;
          color: #22314d;
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
          .hero-grid,
          .kit-layout,
          .story-panels,
          .privacy-grid,
          .impact-grid,
          .steps-grid,
          .timeline-points {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .kit-layout {
            grid-template-columns: minmax(0, 1fr);
          }

          .kit-media-block {
            max-width: 520px;
            margin: 0 auto;
            padding: 0;
          }

          .kit-media-frame {
            inset: 10px;
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

          .hero-grid,
          .kit-layout,
          .story-panels,
          .privacy-grid,
          .impact-grid,
          .steps-grid,
          .timeline-points {
            grid-template-columns: minmax(0, 1fr);
          }

          .kit-panel {
            padding: 28px;
          }

          .kit-media-frame {
            display: none;
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

          .speech-bubble {
            position: relative;
            left: auto;
            top: auto;
            margin-bottom: 16px;
            display: inline-block;
          }

          .hero-block {
            padding: 120px 0 80px;
          }

          .timeline-line {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
