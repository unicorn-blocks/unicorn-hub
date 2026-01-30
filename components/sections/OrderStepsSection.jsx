import { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function OrderStepsSection({ className = '', style = {} }) {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const translations = {
    en: {
      heading: 'Spark Creativity Through Adventure',
      headingLine2: 'And Let Them Shine',
      subheading: 'With Sparky, Kids Create, Parents Relax.',
    },
    zh: {
      heading: '通过冒险激发创造力',
      headingLine2: '让孩子闪耀',
      subheading: '有了 Sparky，孩子创作，家长放心。',
    }
  };

  const copy = translations[language] || translations.en;

  // Step data with images
  const steps = [
    { image: '/assets/steps/Step1.webp', title: '1. Pick To Start', desc: 'Pick a Magic Hat Snap to unlock the world.' },
    { image: '/assets/steps/Step2.webp', title: '2. Story Sparks Creation', desc: 'Every Build is part of a Story.' },
    { image: '/assets/steps/Step3.webp', title: '3. Create & Understand', desc: 'Build and show your creation to Sparky.' },
    { image: '/assets/steps/Step4.webp', title: '4. The Adventure Continues', desc: 'The Magic Hat and Blocks light up to celebrate success!' },
  ];

  return (
    <section className={`order-steps-section ${className}`} style={style}>
      <div className="content-container">
        <div className="section-heading text-center">
          <h2 style={{ textAlign: 'center', margin: '0 auto', width: '100%' }}>
            <span className="steps-heading-line1">{copy.heading}</span>
            <span className="steps-heading-line2 hidden md:block">{copy.headingLine2}</span>
          </h2>
          <p>{copy.subheading}</p>
        </div>

        {/* 4 Steps Grid with Images (1:1) */}
        <div className="steps-grid">
          {steps.map((step, idx) => (
            <div key={idx} className="step-item" style={{ zIndex: 2 - idx }}>
              <div className="step-card step-card-image-only">
                <div className="step-image-full">
                  {/* Mobile */}
                  <div className="step-mobile-wrapper md:hidden">
                    <div className="step-mobile-bg"></div>
                    <div className="step-mobile-content">
                      <div className="step-mobile-text">
                        <h3>{step.title}</h3>
                        <p>{step.desc}</p>
                      </div>
                      <div className="step-mobile-frame step-frame-square">
                        <img
                          src={step.image}
                          alt={step.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* PC */}
                  <div className="step-pc-content hidden md:flex">
                    <div className="step-pc-text">
                      <h3>{step.title}</h3>
                      <p>{step.desc}</p>
                    </div>
                    <div className="step-pc-frame step-frame-square">
                      <img
                        src={step.image}
                        alt={step.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Video Section (16:9) */}
        <div className="video-section">
          <div className="video-wrapper">
            <div className="video-text">
              <h3>Story Inspires Creative Building</h3>
            </div>
            <div className="video-frame" onClick={togglePlay}>
              <video
                ref={videoRef}
                src="/assets/steps/Steps.mp4"
                loop
                playsInline
                preload="metadata"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {!isPlaying && (
                <div className="play-button-overlay">
                  <div className="play-button">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .content-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .order-steps-section {
          padding: 80px 0 0;
          background: #EEF9FF;
          margin-top: clamp(-120px, -8vw, -60px);
          position: relative;
          z-index: 3;
        }

        .order-steps-section::after {
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

        .section-heading h2 {
          font-size: clamp(2rem, 3vw, 3rem);
          margin-bottom: 12px;
          color: #0F192A;
          font-weight: 700;
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
          line-height: 1.2;
        }

        @media (min-width: 768px) {
          .section-heading h2 {
            color: #54545C;
          }
        }

        .steps-heading-line1,
        .steps-heading-line2 {
          display: block;
        }

        @media (max-width: 767px) {
          .steps-heading-line2 {
            display: none !important;
          }
        }

        @media (min-width: 1024px) {
          .section-heading h2 {
             display: block; 
             width: 100%;
             white-space: normal; 
             text-align: center;
          }
          .steps-heading-line1 {
            display: inline;
          }
          .steps-heading-line2 {
            display: inline-block; 
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
          grid-template-columns: minmax(0, 1fr);
          gap: 8px;
          position: relative;
          z-index: 3;
        }

        @media (min-width: 768px) {
           .steps-grid {
             grid-template-columns: repeat(2, minmax(0, 1fr));
             column-gap: 6px;
             row-gap: 10px;
             align-items: stretch; /* Ensure both items in a row have equal height */
           }
           
           .step-item {
             display: flex;
             flex-direction: column;
           }
           
           .step-card {
             flex: 1;
             display: flex;
             flex-direction: column;
           }
           
           .step-image-full {
             flex: 1;
             display: flex;
             flex-direction: column;
           }
           
           .order-steps-section {
             padding-bottom: 20px;
           }
        }

        .step-item {
          position: relative;
          min-width: 0; /* Prevent grid blowout */
        }

        /* PC Styles */
        .step-pc-content {
          display: grid;
          grid-template-rows: 45px 1fr; /* Reduced height for title only */
          align-items: start;
          width: 100%;
          height: 100%;
          border-radius: 32px;
          background: transparent;
          padding: 8px;
          box-shadow: none;
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
           margin-top: 10px;
           box-shadow: 0 4px 12px rgba(0,0,0,0.05); 
           overflow: hidden;
           background: #fff;
        }

        /* Square frame override for images */
        .step-frame-square {
          aspect-ratio: 1 / 1 !important;
        }

        .step-pc-text {
           text-align: center;
           overflow: hidden; /* Hide any text that exceeds the fixed row height */
        }

        .step-pc-text h3 {
           font-size: 1.3rem;
           font-weight: 700;
           color: #13234d;
           margin-bottom: 0;
        }

        .step-pc-text p {
           display: none; /* Hide subtitle */
        }

        /* Mobile Styles */
        .step-mobile-wrapper {
          position: relative;
          width: 90vw;
          max-width: 400px;
          margin: 0 auto;
          height: 100%;
          min-height: 400px;
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
          padding: 24px;
          box-sizing: border-box;
        }

        .step-mobile-frame {
          width: 100%;
          aspect-ratio: 16 / 9;
          border: 3px solid #FFFFFF;
          border-radius: 20px;
          margin-top: 16px;
          margin-bottom: 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          flex-shrink: 0;
          overflow: hidden;
        }

        .step-mobile-text {
          width: 100%;
          text-align: center;
          padding: 0 4px;
        }

        .step-mobile-text h3 {
          color: #13234d;
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 8px;
          line-height: 1.2;
          white-space: nowrap;
        }

        .step-mobile-text p {
          display: none; /* Hide subtitle on mobile */
        }

        @media (max-width: 767px) {
          .steps-grid {
            margin-top: 24px !important;
          }
          
          .order-steps-section {
            padding-top: 40px !important;
            padding-bottom: 20px !important;
          }

          .step-image-full {
            min-height: 320px !important;
          }
          
          .step-mobile-wrapper {
            min-height: 320px !important;
          }
          
          .step-item + .step-item {
            margin-top: -20px;
          }
        }

        /* ========= Bottom Video Section ========= */
        .video-section {
          margin-top: 40px;
          padding: 0 16px 60px;
          position: relative;
          z-index: 3;
        }

        .video-wrapper {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .video-frame {
          width: 100%;
          aspect-ratio: 16 / 9;
          border: 4px solid #FFFFFF;
          border-radius: 24px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          overflow: hidden;
          background: #fff;
          position: relative;
          cursor: pointer;
        }

        .video-text {
          text-align: center;
          margin-bottom: 16px;
        }

        .video-text h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #13234d;
          margin: 0;
        }

        .play-button-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
        }

        .video-frame:hover .play-button-overlay {
          background: transparent;
        }

        .play-button {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .video-frame:hover .play-button {
          transform: scale(1.1);
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
        }

        .play-button svg {
          width: 18px;
          height: 18px;
          color: #13234d;
          margin-left: 2px;
        }

        @media (max-width: 767px) {
          .video-section {
            margin-top: 20px;
            padding: 0 16px 40px;
          }

          .video-frame {
            border-radius: 20px;
            border-width: 3px;
          }

          .video-text h3 {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </section>
  );
}
