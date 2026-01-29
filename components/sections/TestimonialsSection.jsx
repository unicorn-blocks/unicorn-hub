import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function TestimonialsSection() {
  const { language } = useLanguage();
  const [familyPage, setFamilyPage] = useState(0);

  const translations = {
    en: {
      heading: 'Our Family Says',
    },
    zh: {
      heading: '我们的家庭用户说',
    }
  };

  const copy = translations[language] || translations.en;

  const TESTIMONIALS_DATA = [
    {
      quote: '"So much better than staring at screens for hours."',
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

  return (
    <section className="family-section" id="our-family">
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
            <h2>{copy.heading}</h2>
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

      <style jsx>{`
        .family-section {
          padding: 95px 0 50px;
          background: #F7F3FD;  /* 移动端：紫色 */
          position: relative;
          overflow: hidden;
          z-index: 3;
        }

        @media (max-width: 767px) {
          .family-section {
            padding-top: 50px !important;
            padding-bottom: 50px !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          
          /* Mobile overrides - FORCE zero horizontal distance from screen edges */
          .family-section .content-container {
            padding: 0 !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            max-width: 100vw !important;
            width: 100vw !important;
            margin: 0 !important;
          }
          
          .family-stage {
            padding: 20px 0 !important;
            clip-path: none !important;
            overflow: visible !important;
          }
          
          .family-header {
            padding: 0 16px !important;
          }
          
          .family-header h2 {
            white-space: nowrap !important;
          }
          
          .family-mosaic {
            padding: 40px 0 0 !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            gap: 12px !important;
            width: 100vw !important;
            max-width: 100vw !important;
          }
          
          .family-card {
            width: calc(100vw - 32px) !important;
            flex: 0 0 calc(100vw - 32px) !important;
            min-width: 280px !important;
            max-width: unset !important;
            padding: 28px 24px !important;
            margin-left: 0 !important;
          }
        }

        @media (min-width: 768px) {
          .family-section {
            background: #FFFEF3;  /* PC端：原色 */
          }
        }

        .content-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
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
          max-width: 100%; /* Full width for centering */
          position: relative;
          z-index: 2;
          text-align: center;
          margin: 0 auto;
          display: flex;
          justify-content: center;
        }

        .family-header h2 {
          font-size: clamp(2.2rem, 4vw, 3rem);
          color: #0F192A;  /* 移动端：dark */
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
          white-space: nowrap; /* Single line on mobile */
        }

        @media (min-width: 768px) {
          .family-header h2 {
            color: #54545C;  /* PC端：恢复原色 */
            white-space: normal; /* Allow wrapping on PC if needed */
          }
          .family-header {
            max-width: 540px;
          }
        }

        .family-mosaic {
          margin-top: 54px;
          display: flex;
          overflow-x: auto;
          overflow-y: visible;
          gap: 16px;
          position: relative;
          z-index: 2;
          max-width: 100%;
          margin-left: 0;
          margin-right: 0;
          scroll-behavior: smooth;
          padding: 40px 0 0; /* Zero horizontal padding - edge to edge */
          /* Snap scrolling for mobile carousel */
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }

        @media (min-width: 768px) {
          .family-mosaic {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            overflow-x: visible;
            max-width: 1600px;
            padding: 0;
            scroll-snap-type: none;
          }
        }

        .family-card {
          --quote-color: #f07f1f;
          --frame-color: #f49f3f;
          --photo-bg: #fff1df;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 180px; /* Reduced from 60px to proper height */
          padding: 40px 30px; /* Tighter padding for mobile */
          border-radius: 20px;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 8px 16px rgba(25, 43, 80, 0.1);
          position: relative;
          z-index: 2;
          width: calc(100vw - 80px); /* Full viewport minus margins */
          max-width: 320px; /* Reasonable max for mobile */
          flex: 0 0 auto;
          scroll-snap-align: center;
        }

        @media (min-width: 768px) {
          .family-card {
            width: auto;
            flex: 1;
            max-width: none;
            min-height: 60px;
            padding: 58px 50px;
          }
        }

        .family-quote-icon {
          position: absolute;
          top: -35px;
          left: 50%;
          transform: translateX(-50%);
          width: 54px;
          height: 54px;
          background: transparent !important;
          border-radius: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .quote-icon {
          width: 48px;
          height: 48px;
          object-fit: contain;
        }

        .family-card.sky {
          --quote-color: #3e5fd9;
          --frame-color: #6ea8ff;
          --photo-bg: #e8f2ff;
        }
        
        .family-card.sunset {
           /* Default colors */
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
      `}</style>
    </section>
  );
}
