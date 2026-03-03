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
      background: '#ffffff',
      display: 'flex',
    }}>
      {/* Main content area (placeholder) */}
      <div style={{
        flex: 1,
        background: '#f5f5f5',
        padding: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          textAlign: 'center',
          color: '#666',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}>
          <h2 style={{ margin: 0, marginBottom: '8px', color: '#1a1a1a' }}>Card Settings</h2>
          <p style={{ margin: 0 }}>Main content area</p>
          
          {savedData && (
            <div style={{
              marginTop: '24px',
              background: '#ffffff',
              padding: '16px 24px',
              borderRadius: '8px',
              textAlign: 'left',
              border: '1px solid #e5e5e5',
            }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>
                Last Saved:
              </h3>
              <pre style={{ 
                margin: 0, 
                fontSize: '12px', 
                overflow: 'auto',
                background: '#f5f5f5',
                padding: '12px',
                borderRadius: '4px',
                color: '#1a1a1a',
              }}>
                {JSON.stringify(savedData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Side Panel - Card Branding Editor */}
      <div style={{
        width: '480px',
        borderLeft: '1px solid #e5e5e5',
        background: '#ffffff',
        height: '100vh',
        overflow: 'auto',
      }}>
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
      </div>
    </div>
  );
}

export default App;
