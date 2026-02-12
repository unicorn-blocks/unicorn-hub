import { useState, useRef, useEffect } from 'react';

export default function KitCarousel({ mobileImages, desktopImages }) {
    // Use a simple heuristic or prop to decide image source, 
    // but for carousel interactions we should avoid 'isMobile' state if possible 
    // to prevent hydration mismatches. 
    // However, since we have two different sets of images, we DO need to know which to show.
    // We can use a CSS-based approach for images? 
    // No, the requirement is "dual aspect ratio images". 
    // We will stick to the dual-image logic but improve the Arrows rendering.

    // Actually, standard practice for responsive images:
    // Render BOTH sets of images and hide one set via CSS? 
    // Or stick to state. State is cleaner for DOM size.
    // But for the Navigation Arrows, we should definitely use CSS to hide them on mobile.

    // Let's rely on 'window' check for images (state), 
    // but for ARROWS, just render them and hide via CSS media query.

    const [currentImage, setCurrentImage] = useState(0);
    const [isMobileState, setIsMobileState] = useState(false);

    // Sync image source logic
    useEffect(() => {
        const checkMobile = () => {
            setIsMobileState(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const images = isMobileState ? mobileImages : desktopImages;



    // Drag logic
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const startX = useRef(0);

    const goToSlide = (index) => {
        setCurrentImage(index);
    };

    const goToPrevious = () => {
        setCurrentImage((prev) => Math.max(0, prev - 1));
    };

    const goToNext = () => {
        setCurrentImage((prev) => Math.min(images.length - 1, prev + 1));
    };

    const handleDragStart = (e) => {
        // We can allow drag on desktop too if desired, strictly mimicking 'ProductCarousel' if it has it. 
        // ProductCarousel supports drag. 
        // But let's restrict to touch for now or keep generic. Use generic to be safe.
        if (e.type.includes('mouse') && e.button !== 0) return;
        setIsDragging(true);
        startX.current = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    };

    const handleDragMove = (e) => {
        if (!isDragging) return;
        // Prevent page from scrolling horizontally during carousel swipe
        if (e.type === 'touchmove') {
            e.preventDefault();
        }
        const x = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const diff = x - startX.current;
        if ((currentImage === 0 && diff > 0) || (currentImage === images.length - 1 && diff < 0)) {
            setDragOffset(diff * 0.3);
        } else {
            setDragOffset(diff);
        }
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        const threshold = 50;
        if (dragOffset < -threshold) goToNext();
        else if (dragOffset > threshold) goToPrevious();
        setDragOffset(0);
    };
    // Use ref to register non-passive touchmove so preventDefault() works
    const wrapperRef = useRef(null);

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;
        const handler = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.touches[0].clientX;
            const diff = x - startX.current;
            if ((currentImage === 0 && diff > 0) || (currentImage === images.length - 1 && diff < 0)) {
                setDragOffset(diff * 0.3);
            } else {
                setDragOffset(diff);
            }
        };
        el.addEventListener('touchmove', handler, { passive: false });
        return () => el.removeEventListener('touchmove', handler);
    }, [isDragging, currentImage, images.length]);

    return (
        <div className="kit-carousel">
            <div
                ref={wrapperRef}
                className="kit-carousel-wrapper"
                onTouchStart={handleDragStart}
                onTouchEnd={handleDragEnd}
                style={{ touchAction: 'pan-y' }}
            >
                <div
                    className="kit-carousel-track"
                    style={{
                        transform: `translateX(calc(-${currentImage * 100}% + ${dragOffset}px))`,
                        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
                    }}
                >
                    {images.map((src, index) => (
                        <div key={index} className="kit-carousel-slide">
                            <img src={src} alt={`Kit image ${index + 1}`} draggable={false} />
                        </div>
                    ))}
                </div>

                {/* Indicators */}
                <div className="kit-carousel-indicators">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={`kit-carousel-dot ${currentImage === index ? 'active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                goToSlide(index);
                            }}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Desktop Navigation Arrows - Render ALWAYS, hide with CSS on mobile */}
                <button
                    className="kit-nav-btn kit-nav-prev"
                    onClick={goToPrevious}
                    disabled={currentImage === 0}
                    style={{ display: currentImage === 0 ? 'none' : 'flex' }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" style={{ minWidth: '24px', minHeight: '24px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    className="kit-nav-btn kit-nav-next"
                    onClick={goToNext}
                    disabled={currentImage === images.length - 1}
                    style={{ display: currentImage === images.length - 1 ? 'none' : 'flex' }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" style={{ minWidth: '24px', minHeight: '24px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <style jsx>{`
        .kit-carousel {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            user-select: none;
            -webkit-user-select: none;
        }
        .kit-carousel-wrapper {
            width: 100%;
            height: 100%;
            position: relative;
            cursor: grab;
        }
        .kit-carousel-wrapper:active {
            cursor: grabbing;
        }
        .kit-carousel-track {
            display: flex;
            height: 100%;
            width: 100%;
        }
        .kit-carousel-slide {
            min-width: 100%;
            height: 100%;
            position: relative;
        }
        .kit-carousel-slide img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            pointer-events: none; /* Prevent image drag */
            user-select: none;
            -webkit-user-drag: none;
        }
        
        /* Indicators */
        .kit-carousel-indicators {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 6px;
            z-index: 10;
        }
        .kit-carousel-dot {
            width: 7px !important;
            height: 7px !important;
            min-width: 7px !important;
            max-width: 7px !important;
            min-height: 7px !important;
            max-height: 7px !important;
            padding: 0 !important;
            margin: 0 !important;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        .kit-carousel-dot.active {
            background: #ffffff;
            transform: scale(1.3);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .kit-carousel-dot:hover {
            background: rgba(255, 255, 255, 0.8);
        }

        /* Arrows */
        .kit-nav-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.9);
            color: #000000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            z-index: 10;
            border: 1px solid rgba(0,0,0,0.05);
            padding: 0;
        }
        .kit-nav-btn svg {
            display: block;
            width: 24px;
            height: 24px;
        }
        .kit-nav-btn:hover {
            background: #ffffff;
            transform: translateY(-50%) scale(1.05);
            box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
        .kit-nav-prev { left: 16px; }
        .kit-nav-next { right: 16px; }

        /* Hide arrows on mobile */
        @media (max-width: 768px) {
            .kit-nav-btn {
                display: none !important;
            }
        }
      `}</style>
        </div>
    );
}
