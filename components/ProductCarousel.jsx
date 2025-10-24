import { useState, useEffect } from 'react';

export default function ProductCarousel() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const images = [
    '/assets/pre-order/toy-1.jpg',
    '/assets/pre-order/toy-2.jpg'
  ];


  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullscreen) return;
      
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        closeFullscreen();
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFullscreen]);

  const goToSlide = (index) => {
    setCurrentImage(index);
  };

  const goToPrevious = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const handleImageClick = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  return (
    <div className="product-carousel">
      <div className="carousel-container">
        <div className="carousel-wrapper" onClick={handleImageClick}>
          <img
            src={images[currentImage]}
            alt={`Product image ${currentImage + 1}`}
            className="carousel-image"
          />
          
          {/* 全屏查看按钮 */}
          <button 
            className="carousel-fullscreen-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleImageClick();
            }}
            aria-label="View fullscreen"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          
          {/* 导航箭头 */}
          <button 
            className="carousel-nav carousel-nav-prev"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            className="carousel-nav carousel-nav-next"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 全屏预览模态框 */}
      {isFullscreen && (
        <div className="fullscreen-modal" onClick={closeFullscreen}>
          <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="fullscreen-close"
              onClick={closeFullscreen}
              aria-label="Close fullscreen"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* 全屏导航按钮 */}
            <button 
              className="fullscreen-nav fullscreen-nav-prev"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              className="fullscreen-nav fullscreen-nav-next"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <img
              src={images[currentImage]}
              alt={`Product image ${currentImage + 1}`}
              className="fullscreen-image"
            />
            
            {/* 全屏底部导航栏 */}
            <div className="fullscreen-navbar">
              <button 
                className="fullscreen-nav-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="fullscreen-counter">{currentImage + 1} / {images.length}</span>
              <button 
                className="fullscreen-nav-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .product-carousel {
          width: 100%;
          max-width: 600px;
          margin: 0 0 0 auto;
        }

        .carousel-container {
          position: relative;
          background: white;
          border-radius: 16px;
          padding: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: none;
          overflow: hidden;
        }

        .carousel-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          border-radius: 0;
          overflow: hidden;
          background: #f8fafc;
          cursor: pointer;
        }

        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: opacity 0.5s ease-in-out;
        }

        .carousel-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.10);
          color: #374151;
          z-index: 10;
        }

        .carousel-nav:hover {
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 14px 36px rgba(15, 23, 42, 0.14);
          transform: translateY(-50%) translateY(-1px);
        }

        .carousel-nav-prev {
          left: 16px;
        }

        .carousel-nav-next {
          right: 16px;
        }

        .carousel-indicators {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 0;
        }

        .carousel-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: rgba(156, 163, 175, 0.4);
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .carousel-indicator.active {
          background: #7D9ED4;
          transform: none;
        }

        .carousel-indicator:hover {
          background: rgba(125, 158, 212, 0.6);
        }

        /* 全屏查看按钮 */
        .carousel-fullscreen-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 6px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.10);
          color: #374151;
          z-index: 10;
        }

        .carousel-fullscreen-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 14px 36px rgba(15, 23, 42, 0.14);
          transform: translateY(-1px);
        }

        /* 全屏预览样式 */
        .fullscreen-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }

        .fullscreen-content {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fullscreen-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #374151;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.10);
        }

        .fullscreen-close:hover {
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 14px 36px rgba(15, 23, 42, 0.14);
          transform: translateY(-1px);
        }

        .fullscreen-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #374151;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.10);
        }

        .fullscreen-nav:hover {
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 14px 36px rgba(15, 23, 42, 0.14);
          transform: translateY(-50%) translateY(-1px);
        }

        .fullscreen-nav-prev {
          left: 20px;
        }

        .fullscreen-nav-next {
          right: 20px;
        }

        .fullscreen-image {
          max-width: 90%;
          max-height: 90%;
          object-fit: contain;
        }

        .fullscreen-navbar {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 20px;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.10);
        }

        .fullscreen-nav-btn {
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          cursor: pointer;
          color: #374151;
          padding: 6px;
          border-radius: 8px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.10);
        }

        .fullscreen-nav-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 14px 36px rgba(15, 23, 42, 0.14);
          transform: translateY(-1px);
        }

        .fullscreen-counter {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          min-width: 40px;
          text-align: center;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .carousel-container {
            padding: 0;
          }

          .carousel-nav {
            width: 36px;
            height: 36px;
          }

          .carousel-nav-prev {
            left: 12px;
          }

          .carousel-nav-next {
            right: 12px;
          }

          .carousel-fullscreen-btn {
            width: 32px;
            height: 32px;
            top: 12px;
            right: 12px;
          }
        }
      `}</style>
    </div>
  );
}
