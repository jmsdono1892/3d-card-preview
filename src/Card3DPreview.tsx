import { useRef, useState, useEffect, useCallback } from 'react';

interface Card3DPreviewProps {
  isMetal?: boolean;
  companyName?: string;
  isFlipped?: boolean;
  isFlipping?: boolean;
  cardFrontSrc?: string;
  cardBackSrc?: string;
  width?: number;
  height?: number;
}

const Card3DPreview: React.FC<Card3DPreviewProps> = ({ 
  companyName = 'RIPPLING',
  isFlipped = false,
  isFlipping = false,
  cardFrontSrc = '/card-front.svg',
  cardBackSrc = '/card-back.svg',
  width = 448,
  height = 280,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [lightPosition, setLightPosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [isPlayingIntro, setIsPlayingIntro] = useState(false);
  const [introLightPosition, setIntroLightPosition] = useState({ x: -20, y: -20 });

  // Intro animation - light sweeps across the card at 45 degrees on mount
  useEffect(() => {
    const startDelay = setTimeout(() => {
      setIsPlayingIntro(true);
      
      const duration = 1800;
      const startTime = performance.now();
      const startX = -30;
      const startY = -30;
      const endX = 130;
      const endY = 130;
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const eased = progress < 0.5 
          ? 4 * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        const currentX = startX + (endX - startX) * eased;
        const currentY = startY + (endY - startY) * eased;
        
        setIntroLightPosition({ x: currentX, y: currentY });
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setTimeout(() => {
            setIsPlayingIntro(false);
          }, 400);
        }
      };
      
      requestAnimationFrame(animate);
    }, 600);
    
    return () => clearTimeout(startDelay);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
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

  const handleMouseEnter = useCallback(() => {
    if (!isFlipping) setIsHovering(true);
  }, [isFlipping]);
  
  const handleMouseLeave = useCallback(() => {
    if (!isFlipping) {
      setIsHovering(false);
      setRotation({ x: 0, y: 0 });
      setLightPosition({ x: 50, y: 50 });
    }
  }, [isFlipping]);

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
          
          {/* Company name overlay - positioned to match card design */}
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
          
          {/* Dynamic light effect */}
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
              transition: isHovering || isPlayingIntro ? 'opacity 0.2s ease-in' : 'opacity 0.8s ease-out',
              pointerEvents: 'none',
            }} />
          </div>
        </div>

        {/* Back face */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}>
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
              transition: isHovering ? 'opacity 0.2s ease-in' : 'opacity 0.8s ease-out',
              pointerEvents: 'none',
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card3DPreview;
