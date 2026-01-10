import { useState, useEffect, useRef } from 'react';

export default function ProductCarousel() {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    '/assets/reserve-vip-spot/toy-1.jpg',
    '/assets/reserve-vip-spot/toy-2.jpg'
  ];


  const goToSlide = (index) => {
    setCurrentImage(index);
  };

  const goToPrevious = () => {
    setCurrentImage((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentImage((prev) => Math.min(images.length - 1, prev + 1));
  };

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startX = useRef(0);

  const handleDragStart = (e) => {
    // Only allow left mouse button or touch
    if (e.type.includes('mouse') && e.button !== 0) return;

    setIsDragging(true);
    startX.current = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;

    const x = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const diff = x - startX.current;

    // Apply resistance if dragging out of bounds
    if (
      (currentImage === 0 && diff > 0) ||
      (currentImage === images.length - 1 && diff < 0)
    ) {
      setDragOffset(diff * 0.3);
    } else {
      setDragOffset(diff);
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50; // Threshold to trigger slide
    if (dragOffset < -threshold) {
      goToNext();
    } else if (dragOffset > threshold) {
      goToPrevious();
    }
    setDragOffset(0);
  };

  return (
    <div className="product-carousel">
      <div className="carousel-container">
        <div
          className="carousel-wrapper"
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          <div
            className="carousel-track"
            style={{
              transform: `translateX(calc(-${currentImage * 100}% + ${dragOffset}px))`,
              transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          >
            {images.map((src, index) => (
              <div key={index} className="carousel-slide">
                <img
                  src={src}
                  alt={`Product image ${index + 1}`}
                  className="carousel-image"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* 导航箭头 - Removed Fullscreen button */}
          <button
            className="carousel-nav carousel-nav-prev"
            style={{ display: currentImage === 0 ? 'none' : 'flex' }}
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            aria-label="Previous image"
          >
            <svg
              className="carousel-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              style={{ minWidth: '24px', minHeight: '24px' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            className="carousel-nav carousel-nav-next"
            style={{ display: currentImage === images.length - 1 ? 'none' : 'flex' }}
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Next image"
          >
            <svg
              className="carousel-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              style={{ minWidth: '24px', minHeight: '24px' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Indicators */}
          <div className="carousel-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                className={`carousel-indicator ${index === currentImage ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(index);
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-carousel {
          width: 100%;
          max-width: 600px;
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
          cursor: default;
          touch-action: pan-y;
          user-select: none;
          -webkit-user-select: none;
        }

        .carousel-track {
          display: flex;
          height: 100%;
          transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          width: 100%;
        }

        .carousel-slide {
          min-width: 100%;
          width: 100%;
          height: 100%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .carousel-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          color: #000000;
          z-index: 10;
        }
        
        /* Force SVG visibility */
        .carousel-icon {
           display: block;
        }

        .carousel-nav:hover {
          background: #ffffff;
          transform: translateY(-50%) scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .carousel-nav-prev {
          left: 16px;
        }

        .carousel-nav-next {
          right: 16px;
        }

        .carousel-indicators {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          z-index: 10;
        }

        .carousel-indicator {
          width: 7px !important;
          height: 7px !important;
          min-width: 7px !important;
          max-width: 7px !important;
          min-height: 7px !important;
          max-height: 7px !important;
          padding: 0 !important;
          margin: 0 !important;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .carousel-indicator.active {
          background: #ffffff;
          transform: scale(1.3);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .carousel-indicator:hover {
          background: rgba(255, 255, 255, 0.8);
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
          .product-carousel {
            width: 85%;
            margin: 0 auto;
          }

          .carousel-wrapper {
            aspect-ratio: auto !important; /* Allow natural image height */
            height: auto !important;
          }

          .carousel-image {
            position: relative !important; /* Override absolute positioning if any */
            height: auto !important;
          }
        
          .carousel-container {
            padding: 0;
          }

          .carousel-nav {
            display: none !important;
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
