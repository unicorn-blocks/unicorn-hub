import { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const PopModal = dynamic(() => import('./PopModal'), { ssr: false });

export default function BlueTopBar() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="blue-top-bar">
        <div className="blue-top-bar-left">
          <Image
            src="/assets/image/Rectangle_17_1389.png"
            alt="Unicorn Blocks Logo"
            width={50}
            height={50}
            className="blue-top-bar-logo"
          />
          <span className="blue-top-bar-text">Unicorn Blocks</span>
        </div>

        <button
          className="blue-top-bar-btn"
          onClick={() => setShowModal(true)}
        >
          Join Adventure
        </button>

        <style jsx>{`
          .blue-top-bar {
            position: sticky;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            background-color: #AAC2F4;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 16px;
            z-index: 999;
            height: 60px;
          }

          .blue-top-bar-left {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .blue-top-bar-logo {
            width: 40px;
            height: 40px;
            object-fit: contain;
          }

          .blue-top-bar-text {
            font-size: 1.1rem;
            font-weight: 700;
            color: #5A4A7A;
            white-space: nowrap;
          }

          .blue-top-bar-btn {
            background: linear-gradient(90deg, #F7AEBF 0%, #9b90da 100%);
            color: #fff;
            height: 36px;
            padding: 0 14px;
            border-radius: 12px;
            border: none;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            white-space: nowrap;
            box-shadow: 0 3px 10px 0 rgba(39,40,47,0.3);
            transition: transform 0.2s ease;
          }

          .blue-top-bar-btn:hover {
            transform: translateY(-2px);
          }

          @media (min-width: 768px) {
            .blue-top-bar {
              padding: 8px 24px;
              height: 60px;
            }

            .blue-top-bar-left {
              gap: 12px;
            }

            .blue-top-bar-logo {
              width: 48px;
              height: 48px;
            }

            .blue-top-bar-text {
              font-size: 18px;
            }

            .blue-top-bar-btn {
              font-size: 14px;
              padding: 0 18px;
            }
          }
          
          /* 极小屏幕适配 */
          @media (max-width: 360px) {
            .blue-top-bar-text {
              display: none; /* 屏幕太窄时隐藏文字，只留LOGO */
            }
          }
        `}</style>
      </div>
      {showModal && <PopModal onClose={() => setShowModal(false)} />}
    </>
  );
}