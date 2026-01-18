import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';

export default function PrivacySection({ className = '', style = {} }) {
  const { language } = useLanguage();

  const translations = {
    en: {
      subheading: "Your Child's Data. Yours Alone",
      tag: 'COPPA Compliant by Design'
    },
    zh: {
      subheading: '您孩子的数据，仅属于您',
      tag: 'COPPA 合规设计'
    }
  };

  const copy = translations[language] || translations.en;

  return (
    <section className={`privacy-section ${className}`} style={style}>
      <div className="content-container">
        <div className="privacy-heading">
          <div>
            <h2>
              <span className="privacy-line2">{copy.subheading}</span>
            </h2>
            <p className="privacy-tag">{copy.tag}</p>
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

        {/* 第二行：两个对话框卡片 (PC only via CSS) */}
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

      <style jsx>{`
        .content-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
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

        .privacy-line2 {
          color: #0F192A;  /* 移动端：#0F192A */
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
          flex: 0 0 100%;
          max-width: 1404px; /* Align with bottom row (690+690+24) */
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

        .md\\:hidden { display: block; }
        .hidden.md\\:block { display: none; }
        @media (min-width: 768px) {
          .md\\:hidden { display: none; }
          .hidden.md\\:block { display: block; }
        }
      `}</style>
    </section>
  );
}
