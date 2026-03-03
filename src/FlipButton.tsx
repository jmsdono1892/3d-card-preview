import React from 'react';

export interface FlipButtonProps {
  /** Whether the card is currently flipped */
  isFlipped: boolean;
  /** Click handler to toggle flip state */
  onClick: () => void;
  /** Button variant - 'light' for light backgrounds, 'dark' for dark backgrounds */
  variant?: 'light' | 'dark';
}

/**
 * FlipButton - A glassmorphic button to toggle card flip state
 */
const FlipButton: React.FC<FlipButtonProps> = ({
  isFlipped,
  onClick,
  variant = 'dark',
}) => {
  const isDark = variant === 'dark';
  
  return (
    <button
      onClick={onClick}
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        border: isDark ? 'none' : '1px solid rgba(0, 0, 0, 0.08)',
        background: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 1)';
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = isDark ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.9)';
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = isDark ? '0 2px 8px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.08)';
      }}
      aria-label={isFlipped ? 'Show front of card' : 'Show back of card'}
    >
      <svg 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.6)'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transition: 'transform 0.3s ease',
          transform: isFlipped ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      >
        <path d="M17 1l4 4-4 4" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <path d="M7 23l-4-4 4-4" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    </button>
  );
};

export default FlipButton;
