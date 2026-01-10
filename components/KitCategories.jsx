import { useState } from 'react';
import Image from 'next/image';
import { getKitIcon } from '../lib/content';

const kitIconPalette = [
  { base: '#feb79c', shadow: 'rgba(254, 183, 156, 0.35)' },
  { base: '#ffcf6a', shadow: 'rgba(255, 207, 106, 0.35)' },
  { base: '#b7c3ff', shadow: 'rgba(183, 195, 255, 0.35)' },
  { base: '#ffa0e1', shadow: 'rgba(255, 160, 225, 0.3)' }
];

export default function KitCategories({ categories }) {
  const [kitPanelOpen, setKitPanelOpen] = useState([false, false, false, false]);

  if (!categories) return null;

  return (
    <>
      <div className="kit-panel">
        {categories.map((category, index) => {
          const accent = kitIconPalette[index % kitIconPalette.length];
          const isOpen = kitPanelOpen[index];
          const toggleOpen = () => {
            const newState = [false, false, false, false];
            if (!isOpen) {
              newState[index] = true;
            }
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
                  <h3 style={{ color: isOpen ? '#B589E2' : '#0F172A' }}>
                    {category.title}
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
                    const parts = item.split('—').map(s => s.trim());
                    const title = parts[0];
                    const desc = parts[1];
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
          /* font-family: 'Rubik', sans-serif; -- inherited */
          color: #0F172A;
          line-height: 1.4;
          text-align: left;
        }

        /* 移动端标题颜色 - 展开时在JSX中已处理 */

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

        .kit-panel-content {
          padding-top: 10px;
          padding-left: 50px; /* Indent content */
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
          /* padding-left: 0; -- handled by structure */
        }
        
        .kit-panel-content li strong {
          color: #111827;
          font-weight: 600;
        }
        
        /* Mobile Toggle Logic */
        .kit-panel-toggle {
           display: none;
           margin-left: 8px; 
           font-size: 16px;
        }

        @media (max-width: 767px) {
           .kit-panel-toggle {
             display: block !important;
           }
           .kit-panel-content {
             display: none;
           }
           .kit-panel-content.open {
             display: block;
           }
           
           .kit-panel-title h3 {
              font-size: 14px;
           }
        }

        /* Desktop Always Open */
        @media (min-width: 768px) {
          .kit-panel-content {
            display: block !important;
            max-height: none !important;
            overflow: visible !important;
          }
          .kit-panel-toggle {
            display: none !important;
          }
          .kit-panel-title h3 {
            font-size: 20px;
          }
          .kit-panel-content li {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
}
