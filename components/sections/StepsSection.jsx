import { useLanguage } from '../../context/LanguageContext';

export default function StepsSection({ className = '', style = {} }) {
  const { language } = useLanguage();

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

  return (
    <section className={`steps-section ${className}`} style={style}>
      <div className="content-container">
        <div className="section-heading text-center">
          <h2 style={{ textAlign: 'center', margin: '0 auto', width: '100%' }}>
            <span className="steps-heading-line1">{copy.heading}</span>
            <span className="steps-heading-line2 hidden md:block">{copy.headingLine2}</span>
          </h2>
          <p>{copy.subheading}</p>
        </div>
        <div className="steps-grid">
          {/* 第一组 */}
          <div className="step-item" style={{ zIndex: 2 }}>
            <div className="step-card step-card-image-only">
              <div className="step-image-full">
                {/* 移动端：分层展示结构 */}
                <div className="step-mobile-wrapper md:hidden">
                  <div className="step-mobile-bg"></div>
                  <div className="step-mobile-content">
                    <div className="step-mobile-frame">
                      <video
                        src="/assets/steps/step1.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </div>
                    <div className="step-mobile-text">
                      <h3>1. Pick To Start</h3>
                      <p>Pick a Magic Hat Snap to unlock the world.</p>
                    </div>
                  </div>
                </div>
                {/* PC Structure matching Mobile style */}
                <div className="step-pc-content hidden md:flex">
                  <div className="step-pc-frame">
                    <video
                      src="/assets/steps/step1.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                  <div className="step-pc-text">
                    <h3>1. Pick To Start</h3>
                    <p>Pick a Magic Hat Snap to unlock the world.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 第二组 */}
          <div className="step-item" style={{ zIndex: 1 }}>
            <div className="step-card step-card-image-only">
              <div className="step-image-full">
                <div className="step-mobile-wrapper md:hidden">
                  <div className="step-mobile-bg"></div>
                  <div className="step-mobile-content">
                    <div className="step-mobile-frame">
                      <video
                        src="/assets/steps/step2.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </div>
                    <div className="step-mobile-text">
                      <h3>2. Story Sparks Creation</h3>
                      <p>Every Build is part of a Story.</p>
                    </div>
                  </div>
                </div>
                <div className="step-pc-content hidden md:flex">
                  <div className="step-pc-frame">
                    <video
                      src="/assets/steps/step2.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                  <div className="step-pc-text">
                    <h3>2. Story Sparks Creation</h3>
                    <p>Every Build is part of a Story.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 第三组 */}
          <div className="step-item" style={{ zIndex: 0 }}>
            <div className="step-card step-card-image-only">
              <div className="step-image-full">
                <div className="step-mobile-wrapper md:hidden">
                  <div className="step-mobile-bg"></div>
                  <div className="step-mobile-content">
                    <div className="step-mobile-frame">
                      <video
                        src="/assets/steps/step3.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </div>
                    <div className="step-mobile-text">
                      <h3>3. Create & Understand</h3>
                      <p>Build and show your creation to Sparky.</p>
                    </div>
                  </div>
                </div>
                <div className="step-pc-content hidden md:flex">
                  <div className="step-pc-frame">
                    <video
                      src="/assets/steps/step3.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                  <div className="step-pc-text">
                    <h3>3. Create & Understand</h3>
                    <p>Build and show your creation to Sparky.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 第四组 */}
          <div className="step-item" style={{ zIndex: -1 }}>
            <div className="step-card step-card-image-only">
              <div className="step-image-full">
                <div className="step-mobile-wrapper md:hidden">
                  <div className="step-mobile-bg"></div>
                  <div className="step-mobile-content">
                    <div className="step-mobile-frame">
                      <video
                        src="/assets/steps/step4.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </div>
                    <div className="step-mobile-text">
                      <h3>4. The Adventure Continues</h3>
                      <p>The Magic Hat and Blocks light up to celebrate success!</p>
                    </div>
                  </div>
                </div>
                <div className="step-pc-content hidden md:flex">
                  <div className="step-pc-frame">
                    <video
                      src="/assets/steps/step4.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                  <div className="step-pc-text">
                    <h3>4. The Adventure Continues</h3>
                    <p>The Magic Hat and Blocks light up to celebrate success!</p>
                  </div>
                </div>
              </div>
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

        .steps-section {
          padding: 80px 0 0;
          background: #EEF9FF;
          margin-top: clamp(-120px, -8vw, -60px);
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

        .section-heading h2 {
          font-size: clamp(2rem, 3vw, 3rem);
          margin-bottom: 12px;
          color: #0F192A;  /* 移动端：#0F192A */
          font-weight: 700;
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
          line-height: 1.2;
        }

        @media (min-width: 768px) {
          .section-heading h2 {
            color: #000000;  /* PC端：变为黑色 */
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
          /* Default Mobile: 1 column */
          grid-template-columns: minmax(0, 1fr);
          gap: 8px; /* Mobile gap */
          position: relative;
          z-index: 3;
        }

        /* PC: 2x2 Grid with tight spacing */
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
           
           .steps-section {
             padding-bottom: 20px;
           }
        }

        .step-item {
          position: relative;
          min-width: 0; /* Prevent grid blowout */
        }

        /* PC Refacted Styles */
        .step-pc-content {
          display: grid;
          grid-template-rows: 1fr 90px; /* Video first (flexible), text second (fixed) */
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
           margin-bottom: 10px;
           box-shadow: 0 4px 12px rgba(0,0,0,0.05); 
           overflow: hidden;
           background: #fff;
        }

        .step-pc-text {
           text-align: center;
           overflow: hidden; /* Hide any text that exceeds the fixed row height */
        }

        .step-pc-text h3 {
           font-size: 1.3rem;
           font-weight: 700;
           color: #13234d;
           margin-bottom: 6px;
        }

        .step-pc-text p {
           font-size: 1rem;
           color: #374151;
           line-height: 1.5;
           max-width: 100%;
           margin: 0 auto;
        }

        /* ========= Mobile Layered Step Item Styles (copied from homepage) ========= */
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

        /* Hide mobile wrapper on PC */
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
          margin-top: 0;
          margin-bottom: 24px;
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
          color: #6E6E73;
          font-size: 14px;
          line-height: 1.4;
          margin: 0;
          opacity: 0.9;
          font-weight: 500;
        }

        /* ========= Mobile Spacing Overrides ========= */
        @media (max-width: 767px) {
          .steps-grid {
            margin-top: 24px !important;
          }
          
          .steps-section {
            padding-top: 40px !important;
            padding-bottom: 20px !important;
          }

          .step-image-full {
            min-height: 320px !important;
          }
          
          .step-mobile-wrapper {
            min-height: 320px !important;
          }
          
          /* Reduce gap between steps */
          .step-item + .step-item {
            margin-top: -20px;
          }
        }

      `}</style>
    </section>
  );
}
