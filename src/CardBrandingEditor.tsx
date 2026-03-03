import { useState, useCallback } from 'react';
import Card3DPreview from './Card3DPreview';

export interface Entity {
  id: string;
  name: string;
  alias: string;
}

export interface CardBrandingEditorProps {
  /** Initial entities with their names and card aliases */
  initialEntities?: Entity[];
  /** Callback when save is clicked */
  onSave?: (entities: Entity[], cardDesign: 'name_only' | 'name_company') => void;
  /** Callback when cancel is clicked */
  onCancel?: () => void;
  /** Card front SVG source */
  cardFrontSrc?: string;
  /** Card back SVG source */
  cardBackSrc?: string;
}

const CardBrandingEditor: React.FC<CardBrandingEditorProps> = ({
  initialEntities = [
    { id: '1', name: 'Acme Corporation', alias: 'ACME CORP' },
  ],
  onSave,
  onCancel,
  cardFrontSrc = '/card-front.svg',
  cardBackSrc = '/card-back.svg',
}) => {
  // Card flip state
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isCardFlipping, setIsCardFlipping] = useState(false);

  // Branding state
  const [tempEntities, setTempEntities] = useState<Entity[]>(initialEntities);
  const [tempCardDesign, setTempCardDesign] = useState<'name_only' | 'name_company'>('name_company');
  const [brandingMode, setBrandingMode] = useState<'same' | 'different'>('same');
  const [previewEntityId, setPreviewEntityId] = useState<string | null>(null);

  const handleFlip = useCallback(() => {
    if (isCardFlipping) return;
    setIsCardFlipping(true);
    setIsCardFlipped(prev => !prev);
    setTimeout(() => setIsCardFlipping(false), 800);
  }, [isCardFlipping]);

  const handleEntityAliasChange = useCallback((entityId: string, newAlias: string) => {
    setTempEntities(prev => 
      prev.map(e => e.id === entityId ? { ...e, alias: newAlias } : e)
    );
  }, []);

  const handleSave = useCallback(() => {
    onSave?.(tempEntities, tempCardDesign);
  }, [tempEntities, tempCardDesign, onSave]);

  const handleCancel = useCallback(() => {
    setTempEntities(initialEntities);
    setTempCardDesign('name_company');
    setBrandingMode('same');
    onCancel?.();
  }, [initialEntities, onCancel]);

  // Get the company name to display on the card preview
  const getPreviewCompanyName = () => {
    if (tempCardDesign === 'name_only') return undefined;
    
    if (brandingMode === 'same') {
      return tempEntities[0]?.alias || 'COMPANY';
    }
    
    const entity = previewEntityId 
      ? tempEntities.find(e => e.id === previewEntityId)
      : tempEntities[0];
    return entity?.alias || 'COMPANY';
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '768px',
      background: '#ffffff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #e5e5e5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: 600,
          color: '#1a1a1a',
        }}>
          Edit card branding
        </h2>
        <button
          onClick={handleCancel}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Card Preview Section */}
      <div style={{
        background: '#F9F7F6',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        position: 'relative',
      }}>
        {/* 3D Card Preview */}
        <div style={{ transform: 'scale(0.85)', transformOrigin: 'center center' }}>
          <Card3DPreview 
            companyName={getPreviewCompanyName()}
            isFlipped={isCardFlipped}
            isFlipping={isCardFlipping}
            cardFrontSrc={cardFrontSrc}
            cardBackSrc={cardBackSrc}
          />
        </div>

        {/* Flip Button */}
        <button
          onClick={handleFlip}
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
          }}
          aria-label={isCardFlipped ? 'Show front of card' : 'Show back of card'}
        >
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="rgba(0, 0, 0, 0.6)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: 'transform 0.3s ease',
              transform: isCardFlipped ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <path d="M17 1l4 4-4 4" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <path d="M7 23l-4-4 4-4" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
        </button>
      </div>

      {/* Form Section */}
      <div style={{
        padding: '24px',
        borderTop: '1px solid #e5e5e5',
      }}>
        <div style={{ marginBottom: '20px' }}>
          <span style={{ 
            fontSize: '14px', 
            fontWeight: 500, 
            color: '#1a1a1a',
            display: 'block',
            marginBottom: '12px',
          }}>
            Business name on card
          </span>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Use same name for all entities */}
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              cursor: 'pointer',
            }}>
              <input
                type="radio"
                name="cardBranding"
                checked={tempCardDesign === 'name_company' && brandingMode === 'same'}
                onChange={() => {
                  setTempCardDesign('name_company');
                  setBrandingMode('same');
                }}
                style={{ 
                  width: '18px', 
                  height: '18px', 
                  accentColor: '#0066FF',
                  cursor: 'pointer',
                }}
              />
              <span style={{ fontSize: '14px', color: '#1a1a1a' }}>
                Use same name for all entities
              </span>
            </label>
            
            {/* Different name per entity */}
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              cursor: 'pointer',
            }}>
              <input
                type="radio"
                name="cardBranding"
                checked={tempCardDesign === 'name_company' && brandingMode === 'different'}
                onChange={() => {
                  setTempCardDesign('name_company');
                  setBrandingMode('different');
                }}
                style={{ 
                  width: '18px', 
                  height: '18px', 
                  accentColor: '#0066FF',
                  cursor: 'pointer',
                }}
              />
              <span style={{ fontSize: '14px', color: '#1a1a1a' }}>
                Different name per entity
              </span>
            </label>
            
            {/* None */}
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              cursor: 'pointer',
            }}>
              <input
                type="radio"
                name="cardBranding"
                checked={tempCardDesign === 'name_only'}
                onChange={() => {
                  setTempCardDesign('name_only');
                  setBrandingMode('same');
                }}
                style={{ 
                  width: '18px', 
                  height: '18px', 
                  accentColor: '#0066FF',
                  cursor: 'pointer',
                }}
              />
              <span style={{ fontSize: '14px', color: '#1a1a1a' }}>None</span>
            </label>
          </div>
        </div>

        {/* Name input - show when "Use same name for all entities" is selected */}
        {tempCardDesign === 'name_company' && brandingMode === 'same' && (
          <div style={{ marginTop: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              color: '#1a1a1a',
              marginBottom: '8px',
            }}>
              Name on card
            </label>
            <input
              type="text"
              value={tempEntities[0]?.alias || ''}
              onChange={(e) => {
                const newAlias = e.target.value;
                setTempEntities(tempEntities.map(ent => ({ ...ent, alias: newAlias })));
              }}
              placeholder="Enter business name"
              maxLength={21}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.target.style.borderColor = '#0066FF'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            <span style={{
              display: 'block',
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '4px',
              textAlign: 'right',
            }}>
              {tempEntities[0]?.alias?.length || 0}/21
            </span>
          </div>
        )}

        {/* Entity inputs - show when "Different name per entity" is selected */}
        {tempCardDesign === 'name_company' && brandingMode === 'different' && (
          <div style={{ 
            marginTop: '16px',
            maxHeight: '300px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            {tempEntities.map(entity => (
              <div key={entity.id}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#1a1a1a',
                  marginBottom: '8px',
                }}>
                  Name on card for {entity.name}
                </label>
                <input
                  type="text"
                  value={entity.alias}
                  onChange={(e) => handleEntityAliasChange(entity.id, e.target.value)}
                  onFocus={() => setPreviewEntityId(entity.id)}
                  placeholder="Enter company name"
                  maxLength={21}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid #e5e5e5',
        display: 'flex',
        justifyContent: 'space-between',
        gap: '12px',
      }}>
        <button
          onClick={handleCancel}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#1a1a1a',
            background: 'transparent',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f5f5f5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#ffffff',
            background: '#0066FF',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#0052cc';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#0066FF';
          }}
        >
          Save changes
        </button>
      </div>
    </div>
  );
};

export default CardBrandingEditor;
