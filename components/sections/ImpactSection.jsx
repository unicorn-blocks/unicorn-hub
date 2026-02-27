import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';

export default function ImpactSection({ showSteam = true }) {
  const { language } = useLanguage();
  const impactGradientTextStyle = {
    background: 'linear-gradient(90deg, #F7AEBF 0%, #9b90da 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent',
    fontWeight: 700,
    display: 'inline-block'
  };

  const translations = {
    en: {
      heading: 'Why parents are Choosing us',
      stats: [
        {
          title: 'Open-Ended Creative Play',
          titleLine1: '3×',
          titleLine2: 'Creativity',
          description: <span><strong style={impactGradientTextStyle}>Independent play</strong> with endless ideas.</span>,
          descriptionMobile: <span><strong style={impactGradientTextStyle}>Independent play</strong> with endless ideas.</span>
        },
        {
          title: '90 Minutes Every Time',
          titleLine1: '90',
          titleLine1Small: 'mins',
          titleLine2: 'Deep Focus',
          description: <span>Deep Focus - <strong style={impactGradientTextStyle}>Without Screens</strong>.</span>,
          descriptionMobile: <span>Deep Focus - <strong style={impactGradientTextStyle}>Without Screens</strong>.</span>
        },
        {
          title: 'STEAM Problem Solving',
          titleLine1: 'STEAM',
          titleLine2: 'Problem Solving',
          description: <span>Kids learn by <strong className="text-black font-bold">trying, fixing, and building</strong> — not by watching another screen.</span>,
          descriptionMobile: <span>Kids learn by <strong className="text-black font-bold">trying, fixing, and building</strong> — not by watching another screen.</span>
        }
      ]
    },
    zh: {
      heading: '创造力、专注力与真实思考',
      stats: [
        {
          title: '3倍创造力',
          titleLine1: '3倍',
          titleLine2: '创造力',
          description: '更大胆的造型，更丰富的色彩，更复杂的搭建。',
          descriptionMobile: '更大胆的造型，更丰富的色彩，更复杂的搭建。'
        },
        {
          title: '90分钟深度专注',
          titleLine1: '90',
          titleLine1Small: '分钟',
          titleLine2: '深度专注',
          description: '孩子专注玩耍，家长享受真正的咖啡时间。',
          descriptionMobile: '孩子专注玩耍，家长享受真正的咖啡时间。'
        },
        {
          title: 'STEAM 解决问题',
          titleLine1: 'STEAM',
          titleLine2: '解决问题',
          description: '孩子在搭建和玩耍中学习工程思维。',
          descriptionMobile: '孩子在搭建和玩耍中学习工程思维。'
        }
      ]
    }
  };

  const copy = translations[language] || translations.en;
  const displayStats = showSteam ? copy.stats : copy.stats.filter(stat => !stat.title.includes('STEAM'));

  return (
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
          <span>{copy.heading}</span>
        </h2>
        <div className="impact-grid">
          {displayStats.map((stat, index) => (
            <div className="impact-card" key={stat.title}>
              <div className={`impact-icon-wrapper ${index < 2 ? 'impact-image-wrapper' : ''}`}>
                <Image
                  src={index === 0 ? '/assets/ima/impact-creativity.webp' : index === 1 ? '/assets/ima/impact-focus.webp' : '/assets/ima/section6-3.svg'}
                  alt=""
                  width={index < 2 ? 400 : 64}
                  height={index < 2 ? 400 : 64}
                  className={`impact-icon ${index < 2 ? 'impact-image-large' : ''}`}
                />
              </div>
              {/* PC端标题 */}
              <h3 className="hidden md:block">{stat.title}</h3>
              {/* 移动端标题 */}
              <h3 className="impact-card-title-mobile md:hidden">{stat.title}</h3>
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
      </div >

      <style jsx>{`
        .content-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .impact-section {
          padding: 150px 0 120px;
          background: #E9F5EB;
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
          color: #0F192A; /* Mobile default */
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
          margin-top: 10px;
          white-space: normal;
          line-height: 1.2;
        }

        @media (min-width: 768px) {
          .impact-section h2 {
            color: #000000;
          }
        }

        .impact-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr); /* Default Mobile 1 col */
          gap: 24px;
          position: relative;
          z-index: 2;
          margin-top: 10px;
        }

        @media (min-width: 768px) {
          .impact-grid {
            grid-template-columns: ${displayStats.length === 2 ? 'repeat(2, minmax(0, 400px))' : 'repeat(3, minmax(0, 1fr))'};
            justify-content: center;
            gap: 80px;
          }
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
        
        .impact-image-wrapper {
          width: calc(100% + 8px) !important;
          height: auto !important;
          margin-left: -4px;
          margin-right: -4px;
          display: block !important;
          margin-bottom: 12px !important;
        }

        .impact-image-large {
          width: 100% !important;
          height: auto !important;
          object-fit: contain !important;
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
            color: #000000;
            background: none;
            -webkit-background-clip: unset;
            -webkit-text-fill-color: unset;
            background-clip: unset;
          }
        }

        .impact-card p {
          color: #000000;
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

          .impact-card-title-mobile {
            font-family: 'Rubik', sans-serif;
            font-size: 28px;
            font-weight: 700;
            line-height: 1.2;
            text-align: center;
            background: linear-gradient(258.25deg, rgba(0, 0, 0, 1), rgba(0, 35, 105, 1) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            color: transparent;
            margin-bottom: 12px;
            display: block;
          }
        }
      `}</style>
    </section >
  );
}
