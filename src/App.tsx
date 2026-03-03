import { useState } from 'react';
import CardBrandingEditor, { Entity } from './CardBrandingEditor';

function App() {
  const [savedData, setSavedData] = useState<{ entities: Entity[], cardDesign: string } | null>(null);

  const handleSave = (entities: Entity[], cardDesign: 'name_only' | 'name_company') => {
    setSavedData({ entities, cardDesign });
    console.log('Saved:', { entities, cardDesign });
  };

  const handleCancel = () => {
    console.log('Cancelled');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px',
    }}>
      <h1 style={{
        color: '#ffffff',
        fontSize: '32px',
        fontWeight: 600,
        margin: 0,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}>
        Card Branding Editor
      </h1>
      
      <CardBrandingEditor
        initialEntities={[
          { id: '1', name: 'Acme Corporation', alias: 'ACME CORP' },
          { id: '2', name: 'TechStart Inc', alias: 'TECHSTART' },
          { id: '3', name: 'Global Ventures LLC', alias: 'GLOBAL VENTURES' },
        ]}
        onSave={handleSave}
        onCancel={handleCancel}
        cardFrontSrc="/card-front.svg"
        cardBackSrc="/card-back.svg"
      />

      {savedData && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '16px 24px',
          borderRadius: '8px',
          maxWidth: '768px',
          width: '100%',
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600 }}>
            Last Saved:
          </h3>
          <pre style={{ 
            margin: 0, 
            fontSize: '12px', 
            overflow: 'auto',
            background: '#f5f5f5',
            padding: '12px',
            borderRadius: '4px',
          }}>
            {JSON.stringify(savedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
