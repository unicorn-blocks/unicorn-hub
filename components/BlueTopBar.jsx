import { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { isVipHost, isVipDomain } from '../lib/domain';
import { proceedToCheckout } from '../lib/fbq';

const PopModal = dynamic(() => import('./PopModal'), { ssr: false });

export default function BlueTopBar({ onCheckout, isLoading }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isVip, setIsVip] = useState(false);

  // 检查是否在预订页面
  const isReservePage = router.pathname === '/reserve-vip-spot' || router.pathname === '/preorder' || router.pathname === '/order';

  // 客户端检测域名
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsVip(isVipHost(window.location.host));
    }
  }, []);

  const handleCheckoutClick = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      proceedToCheckout();
    }
  };

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

        {isReservePage ? (
          <button
            className="blue-top-bar-btn reserve-btn"
            onClick={handleCheckoutClick}
            disabled={isLoading}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : ((router.pathname === '/preorder' || router.pathname === '/order') ? 'Pre-Order Now for $5' : 'Reserve My VIP Price')}
          </button>
        ) : (
          <button
            className="blue-top-bar-btn"
            onClick={() => setShowModal(true)}
          >
            Unlock VIP Access
          </button>
        )}

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

          /* Joined 状态样式 */
          .blue-top-bar-btn.joined {
            cursor: default;
            transform: none !important;
            animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }

          @keyframes pop {
            0% { transform: scale(0.8); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
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

          /* Mobile adjustment for reserve page button */
          @media (max-width: 767px) {
            .reserve-btn {
              margin-right: -5px;
            }
          }
        `}</style>
      </div>
      {showModal && <PopModal isVip={isVip} source="ManualPopModal" onClose={() => setShowModal(false)} />}
    </>
  );
}