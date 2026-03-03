import React from 'react';

export interface Card3DPreviewProps {
  /** Whether to show metal card styling */
  isMetal?: boolean;
  /** Company name to display on the card */
  companyName?: string;
  /** Whether the card is flipped to show the back */
  isFlipped?: boolean;
  /** Whether the card is currently in a flip animation */
  isFlipping?: boolean;
  /** URL/path to the front card image */
  cardFrontSrc?: string;
  /** URL/path to the back card image */
  cardBackSrc?: string;
  /** Card width in pixels */
  width?: number;
  /** Card height in pixels */
  height?: number;
}

/**
 * Card3DPreview - A Mercury-style 3D interactive card component
 * 
 * Features:
 * - 3D tilt effect on hover
 * - Dynamic lighting that follows the cursor
 * - Intro light sweep animation on mount
 * - Flip animation support (controlled via props)
 * - Customizable card images
 */
const Card3DPreview: React.FC<Card3DPreviewProps> = ({ 
  // isMetal can be used for future styling variations
  isMetal: _isMetal = true,
  companyName = 'RIPPLING',
  isFlipped = false,
  isFlipping = false,
  cardFrontSrc = '/card-front.svg',
  cardBackSrc = '/card-back.svg',
  width = 448,
  height = 280,
}) => {
  // Suppress unused variable warning - isMetal reserved for future use
  void _isMetal;
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
  const [lightPosition, setLightPosition] = React.useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = React.useState(false);
  const [isPlayingIntro, setIsPlayingIntro] = React.useState(false);
  const [introLightPosition, setIntroLightPosition] = React.useState({ x: -20, y: -20 });

  // Intro animation - light sweeps across the card at 45 degrees on mount
  React.useEffect(() => {
    const startDelay = setTimeout(() => {
      setIsPlayingIntro(true);
      
      const duration = 1800; // Animation duration in ms
      const startTime = performance.now();
      const startX = -30;
      const startY = -30;
      const endX = 130;
      const endY = 130;
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-in-out cubic for smooth acceleration and deceleration
        const eased = progress < 0.5 
          ? 4 * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        const currentX = startX + (endX - startX) * eased;
        const currentY = startY + (endY - startY) * eased;
        
        setIntroLightPosition({ x: currentX, y: currentY });
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Fade out after animation completes
          setTimeout(() => {
            setIsPlayingIntro(false);
          }, 400);
        }
      };
      
      requestAnimationFrame(animate);
    }, 600); // Initial delay before animation starts
    
    return () => clearTimeout(startDelay);
  }, []);

  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Disable hover effects while flipping
    if (!cardRef.current || isFlipping) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 15;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 15;
    const lightX = ((e.clientX - rect.left) / rect.width) * 100;
    const lightY = ((e.clientY - rect.top) / rect.height) * 100;
    setRotation({ x: rotateX, y: rotateY });
    setLightPosition({ x: lightX, y: lightY });
  }, [isFlipping]);

  const handleMouseEnter = React.useCallback(() => {
    // Don't trigger hover state while flipping
    if (!isFlipping) setIsHovering(true);
  }, [isFlipping]);
  
  const handleMouseLeave = React.useCallback(() => {
    // Only reset if not flipping
    if (!isFlipping) {
      setIsHovering(false);
      setRotation({ x: 0, y: 0 });
      setLightPosition({ x: 50, y: 50 });
    }
  }, [isFlipping]);

  // Calculate the base flip rotation
  const flipRotation = isFlipped ? 180 : 0;
  
  return (
    <div style={{ perspective: '1200px', width: `${width}px`, height: `${height}px`, position: 'relative' }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          cursor: 'pointer',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y + flipRotation}deg)`,
          transition: isFlipping 
            ? 'transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)' 
            : isHovering 
              ? 'transform 0.1s ease-out' 
              : 'transform 0.5s ease-out',
        }}
      >
        {/* Front face */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}>
          {/* Card SVG background */}
          <img 
            src={cardFrontSrc}
            alt="Card Front"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'fill',
              pointerEvents: 'none',
            }}
          />
          
          {/* Dynamic light effect - 45 degree angled, wider spread */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '20px',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              inset: '-50%',
              background: (() => {
                const pos = isPlayingIntro ? introLightPosition : lightPosition;
                return `
                  radial-gradient(ellipse 120% 120% at ${pos.x}% ${pos.y}%, 
                    rgba(255, 255, 255, 0.32) 0%, 
                    rgba(255, 255, 255, 0.18) 20%, 
                    rgba(255, 255, 255, 0.08) 40%,
                    rgba(255, 255, 255, 0.03) 60%,
                    transparent 85%
                  ),
                  linear-gradient(45deg, 
                    transparent 0%, 
                    rgba(255, 255, 255, 0.12) ${pos.x * 0.4 + 20}%, 
                    rgba(255, 255, 255, 0.06) ${pos.x * 0.6 + 30}%,
                    transparent 100%
                  )
                `;
              })(),
              transform: 'rotate(45deg)',
              transformOrigin: 'center center',
              opacity: (isHovering || isPlayingIntro) && !isFlipped ? 1 : 0,
              transition: isPlayingIntro ? 'opacity 0.3s ease' : 'opacity 0.3s ease',
              pointerEvents: 'none',
            }} />
          </div>

          {/* Company name overlay */}
          {companyName && (
            <div style={{
              position: 'absolute',
              bottom: '18%',
              right: '6%',
              fontFamily: '"Basel Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              zIndex: 2,
              marginLeft: '18px',
              marginRight: '18px',
              textAlign: 'right',
            }}>
              {companyName}
            </div>
          )}
        </div>

        {/* Back face */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}>
          {/* Card back SVG */}
          <img 
            src={cardBackSrc}
            alt="Card Back"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'fill',
              pointerEvents: 'none',
            }}
          />
          
          {/* Dynamic light effect for back */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '20px',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              inset: '-50%',
              background: (() => {
                const pos = lightPosition;
                return `
                  radial-gradient(ellipse 120% 120% at ${100 - pos.x}% ${pos.y}%, 
                    rgba(255, 255, 255, 0.32) 0%, 
                    rgba(255, 255, 255, 0.18) 20%, 
                    rgba(255, 255, 255, 0.08) 40%,
                    rgba(255, 255, 255, 0.03) 60%,
                    transparent 85%
                  ),
                  linear-gradient(45deg, 
                    transparent 0%, 
                    rgba(255, 255, 255, 0.12) ${(100 - pos.x) * 0.4 + 20}%, 
                    rgba(255, 255, 255, 0.06) ${(100 - pos.x) * 0.6 + 30}%,
                    transparent 100%
                  )
                `;
              })(),
              transform: 'rotate(45deg)',
              transformOrigin: 'center center',
              opacity: isHovering && isFlipped ? 1 : 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none',
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card3DPreview;
