import { useState } from 'react';
import Image from 'next/image';
import { getKitIcon } from '../lib/content';

const kitIconPalette = [
  { base: '#feb79c', shadow: 'rgba(254, 183, 156, 0.35)' },
  { base: '#ffcf6a', shadow: 'rgba(255, 207, 106, 0.35)' },
  { base: '#b7c3ff', shadow: 'rgba(183, 195, 255, 0.35)' },
  { base: '#ffa0e1', shadow: 'rgba(255, 160, 225, 0.3)' }
];

export default function KitCategories({ categories, initialState, desktopStatic = false }) {
  // 默认全关，或者使用传入的初始状态
  const [kitPanelOpen, setKitPanelOpen] = useState(initialState || [false, false, false, false]);

  if (!categories) return null;

  return (
    <>
      <div className={`kit-panel ${desktopStatic ? 'desktop-static' : ''}`}>
        {categories.map((category, index) => {
          const accent = kitIconPalette[index % kitIconPalette.length];
          const isOpen = kitPanelOpen[index];
          const toggleOpen = () => {
            // 在 desktopStatic 模式下，PC端点击无效（但移动端需要有效，所以不在这里完全禁用，而是通过CSS控制PC端表现）
            // 如果需要在JS层完全禁用PC端点击，需要检测屏幕宽度，但这会导致 hydration mismatch。
            // 所以让点击发生，但在 CSS 中强制 PC 端展开且无交互反馈。

            const newState = [...kitPanelOpen];
            newState[index] = !newState[index]; // 仅切换当前项（非互斥）
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
                aria-expanded={isOpen}
              // desktopStatic模式下PC端禁用点击事件可以通过 pointer-events: none 在 CSS 处理，
              // 或者在这里简单处理。为了确保移动端正常，CSS是更好的选择。
              >
                <div className="kit-panel-title">
                  <div className="kit-panel-icon">
                    <Image
                      src={getKitIcon(index)}
                      alt=""
                      width={40}
                      height={40}
                      className="kit-panel-icon-svg"
                    />
                  </div>
                  <h3 style={{ color: (isOpen && (!desktopStatic || typeof window !== 'undefined' && window.innerWidth < 768)) ? '#B589E2' : '#0F172A' }}>
                    {/* 上面的 color 逻辑太复杂且不仅靠谱（hydration）。
                        更好的方式是用 CSS 类名控制颜色。
                        我们将依赖 CSS .open 类名。
                    */}
                    <span className="title-text">{category.title}</span>
                  </h3>
                </div>

                {/* Mobile Toggle Indicator */}
                <div className="kit-panel-toggle">
                  {isOpen ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M18 15L12 9L6 15" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9L12 15L18 9" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </button>

              <div className={`kit-panel-content ${isOpen ? 'open' : ''}`}>
                <ul>
                  {category.highlights.map((item, idx) => {
                    const parts = item.split('—');
                    const title = parts[0].trim();
                    const descRaw = parts.slice(1).join('—');
                    const desc = descRaw ? descRaw.replace(/^[ \t]+|[ \t]+$/g, '') : '';
                    const hasDesc = !!desc;
                    return (
                      <li key={idx}>
                        {hasDesc ? (
                          <>
                            <strong>{title}</strong> — {desc}
                          </>
                        ) : (
                          title
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .kit-panel {
          background: #F7F3FD; 
          border-radius: 34px;
          padding: 28px 24px;
          box-shadow: 0 24px 55px rgba(106, 96, 185, 0.12);
          display: grid;
          gap: 18px;
        }

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

        .kit-panel-title-button {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          -webkit-tap-highlight-color: transparent;
          outline: none;
        }

        .kit-panel-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.95rem;
          font-weight: 700;
          color: #4b35b4;
          flex: 1;
          margin: 0;
        }

        .kit-panel-title h3 {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          color: #0F172A; /* Default color */
          line-height: 1.4;
          text-align: left;
          transition: color 0.2s ease;
        }

        /* Highlight color when open (except in static mode on desktop) */
        .kit-panel-row:has(.kit-panel-content.open) h3 {
           color: #B589E2;
        }

        .kit-panel-icon {
          width: 40px;
          height: 40px;
          position: relative;
          display: inline-flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
        }

        .kit-panel-icon :global(.kit-panel-icon-svg) {
          display: block;
          width: 40px;
          height: 40px;
          flex-shrink: 0;
        }

        /* Universal Toggle Logic (Mobile & Desktop) */
        .kit-panel-toggle {
           display: block; /* Visible on all screens */
           margin-left: 8px; 
           font-size: 16px;
        }

        .kit-panel-content {
          display: none; /* Hidden by default */
          padding-top: 10px;
          padding-left: 50px;
        }
        
        .kit-panel-content.open {
          display: block; /* Shown when open */
        }
        
        .kit-panel-content ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 8px;
        }

        .kit-panel-content li {
          font-size: 0.95rem;
          color: #4B5563;
          line-height: 1.5;
          position: relative;
          white-space: pre-wrap;
        }
        
        .kit-panel-content li strong {
          color: #111827;
          font-weight: 600;
        }

        @media (max-width: 767px) {
           .kit-panel-title h3 {
              font-size: 14px;
           }
        }

        /* Desktop Sizing Only */
        @media (min-width: 768px) {
          .kit-panel-title h3 {
            font-size: 20px;
          }
          .kit-panel-content li {
            font-size: 14px;
          }
          
          /* ====== Desktop Static Mode (Home Page) ====== */
          .kit-panel.desktop-static .kit-panel-content {
            display: block !important; /* Always open */
            padding-left: 50px;
          }
          
          .kit-panel.desktop-static .kit-panel-toggle {
            display: none !important; /* Hide toggle arrow */
          }
          
          .kit-panel.desktop-static .kit-panel-title-button {
            cursor: default; /* Remove pointer cursor */
          }
          
          /* Reset highlight color for static mode on desktop */
          .kit-panel.desktop-static .kit-panel-row:has(.kit-panel-content.open) h3 {
             color: #0F172A;
          }
        }
      `}</style>
    </>
  );
}
