import React, { useState, useCallback } from 'react';
import Card3DPreview from './Card3DPreview';
import FlipButton from './FlipButton';

function App() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [companyName, setCompanyName] = useState('ACME CORP');
  const [cardType, setCardType] = useState<'metal' | 'plastic'>('metal');

  const handleFlip = useCallback(() => {
    if (isFlipping) return;
    setIsFlipping(true);
    setIsFlipped(prev => !prev);
    setTimeout(() => setIsFlipping(false), 800);
  }, [isFlipping]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      gap: '32px',
    }}>
      <h1 style={{ 
        color: 'white', 
        fontSize: '28px', 
        fontWeight: 600, 
        margin: 0,
        letterSpacing: '-0.5px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        ✨ 3D Card Preview Component
      </h1>
      
      {/* Card Type Toggle */}
      <div style={{ 
        display: 'flex', 
        gap: '4px', 
        background: 'rgba(255,255,255,0.08)', 
        borderRadius: '12px',
        padding: '4px',
      }}>
        <button
          onClick={() => setCardType('metal')}
          style={{
            padding: '10px 24px',
            border: 'none',
            borderRadius: '8px',
            background: cardType === 'metal' ? 'rgba(255,255,255,0.15)' : 'transparent',
            color: cardType === 'metal' ? 'white' : 'rgba(255,255,255,0.5)',
            fontWeight: 500,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          Metal
        </button>
        <button
          onClick={() => setCardType('plastic')}
          style={{
            padding: '10px 24px',
            border: 'none',
            borderRadius: '8px',
            background: cardType === 'plastic' ? 'rgba(255,255,255,0.15)' : 'transparent',
            color: cardType === 'plastic' ? 'white' : 'rgba(255,255,255,0.5)',
            fontWeight: 500,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          Plastic
        </button>
      </div>

      {/* Card Preview with Flip Button */}
      <div style={{ position: 'relative' }}>
        <Card3DPreview 
          isMetal={cardType === 'metal'}
          companyName={companyName}
          isFlipped={isFlipped}
          isFlipping={isFlipping}
          cardFrontSrc="/card-front.svg"
          cardBackSrc="/card-back.svg"
        />
        
        {/* Flip button positioned at bottom right */}
        <div style={{ position: 'absolute', bottom: '16px', right: '16px', zIndex: 10 }}>
          <FlipButton 
            isFlipped={isFlipped}
            onClick={handleFlip}
            variant="dark"
          />
        </div>
      </div>

      {/* Company Name Input */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px',
        alignItems: 'center',
      }}>
        <label style={{ 
          color: 'rgba(255,255,255,0.6)', 
          fontSize: '13px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}>
          Company Name
        </label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value.toUpperCase())}
          maxLength={21}
          style={{
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 500,
            textAlign: 'center',
            width: '200px',
            outline: 'none',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
          placeholder="COMPANY NAME"
        />
      </div>

      <p style={{ 
        color: 'rgba(255,255,255,0.4)', 
        fontSize: '13px', 
        margin: 0,
        textAlign: 'center',
        maxWidth: '400px',
        lineHeight: 1.6,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        Hover over the card to see the 3D tilt effect with dynamic lighting that follows your cursor. 
        Click the flip button to see the back of the card.
      </p>
    </div>
  );
}

export default App;
