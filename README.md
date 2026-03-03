# Card Branding Editor

A beautiful, interactive card branding editor component with 3D card preview, dynamic lighting effects, and flip animation.

![Card Branding Editor](https://via.placeholder.com/768x500?text=Card+Branding+Editor)

## Features

- **3D Interactive Card Preview** - Hover to see realistic 3D tilt and dynamic lighting
- **Flip Animation** - Smooth card flip to view front/back
- **Intro Animation** - Light sweep animation on load
- **Business Name Options**:
  - Same name for all entities
  - Different name per entity
  - No business name
- **Live Preview** - See changes reflected on the card in real-time
- **Character Limit** - 21 character max with counter

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Usage

```tsx
import { CardBrandingEditor } from './components';

function App() {
  const handleSave = (entities, cardDesign) => {
    console.log('Saved:', { entities, cardDesign });
  };

  return (
    <CardBrandingEditor
      initialEntities={[
        { id: '1', name: 'Acme Corporation', alias: 'ACME CORP' },
        { id: '2', name: 'TechStart Inc', alias: 'TECHSTART' },
      ]}
      onSave={handleSave}
      onCancel={() => console.log('Cancelled')}
      cardFrontSrc="/card-front.svg"
      cardBackSrc="/card-back.svg"
    />
  );
}
```

## Props

### CardBrandingEditor

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialEntities` | `Entity[]` | `[{ id: '1', name: 'Acme Corporation', alias: 'ACME CORP' }]` | Initial entities with names and aliases |
| `onSave` | `(entities: Entity[], cardDesign: 'name_only' \| 'name_company') => void` | - | Callback when save is clicked |
| `onCancel` | `() => void` | - | Callback when cancel is clicked |
| `cardFrontSrc` | `string` | `'/card-front.svg'` | Path to card front SVG |
| `cardBackSrc` | `string` | `'/card-back.svg'` | Path to card back SVG |

### Entity Type

```typescript
interface Entity {
  id: string;
  name: string;    // Full company name (displayed in form)
  alias: string;   // Name printed on card (max 21 chars)
}
```

## Card Assets

Place your card SVG assets in the `public/` folder:
- `public/card-front.svg` - Front of the card
- `public/card-back.svg` - Back of the card

## Build

```bash
npm run build
```

## License

MIT
