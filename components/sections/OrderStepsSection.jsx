import { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function OrderStepsSection({ className = '', style = {} }) {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
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

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const translations = {
    en: {
      heading: 'Stories guide kids to',
      headingLine2: 'create-step by step',
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
            <span className="steps-heading-line2">{copy.headingLine2}</span>
          </h2>

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
              <h3>How kids are building with stories</h3>
            </div>
            <div className="video-frame" onClick={togglePlay}>
              <video
                ref={videoRef}
                src="/assets/steps/Steps.mp4"
                poster="/assets/reserve-vip-spot/4.webp"
                loop
                muted
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
              {/* 静音切换按钮 */}
              <button className="mute-button" onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
                {isMuted ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
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
          overflow: visible; /* Allow content to show without creating scroll container */
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
          font-size: clamp(1.5rem, 6.5vw, 3rem); /* Larger mobile font, scales with viewport */
          margin-bottom: 12px;
          color: #0F192A;
          font-weight: 700;
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
          line-height: 1.2;
        }

        @media (min-width: 768px) {
          .section-heading h2 {
            color: #54545C;
            font-size: clamp(2rem, 3vw, 3rem); /* Larger on desktop */
          }
        }

        /* Each line stays on one line - use font scaling instead of wrapping */
        .steps-heading-line1,
        .steps-heading-line2 {
          display: block;
          white-space: nowrap;
        }

        /* Mobile: ensure proper spacing from edges */
        @media (max-width: 520px) {
          .section-heading {
            padding-left: 16px;
            padding-right: 16px;
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
          width: calc(100vw - 40px); /* 20px margin on each side - larger images */
          max-width: 400px;
          left: 50%;
          transform: translateX(-50%);
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
          /* 移除点击时的蓝色高亮 */
          outline: none;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
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
          width: 22px;
          height: 22px;
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

        /* 视频移除蓝色高亮 */
        video {
          outline: none;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }

        video:focus {
          outline: none;
        }

        /* 静音按钮样式 - PC端: 白色背景+黑色图标（与播放按钮一致） */
        .mute-button {
          position: absolute;
          bottom: 12px;
          right: 12px;
          width: 28px;
          height: 28px;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          outline: none;
          -webkit-tap-highlight-color: transparent;
          padding: 6px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          color: #13234d;
        }

        .mute-button:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .mute-button svg {
          width: 16px;
          height: 16px;
        }

        /* Mobile: 去除白色背景，只保留图标 */
        @media (max-width: 767px) {
          .mute-button {
            width: 24px;
            height: 24px;
            bottom: 4px;
            right: 4px;
            padding: 0;
            background: transparent;
            box-shadow: none;
          }

          .mute-button:hover,
          .mute-button:focus,
          .mute-button:active {
            background: transparent;
            box-shadow: none;
            transform: none;
          }

          .mute-button svg {
            width: 18px;
            height: 18px;
          }
        }
      `}</style>
    </section>
  );
}
