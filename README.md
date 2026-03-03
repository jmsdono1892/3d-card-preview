# 3D Card Preview Component

A Mercury-style 3D interactive card preview component built with React and TypeScript.

## Features

- **3D Tilt Effect**: Card tilts in 3D space following your cursor
- **Dynamic Lighting**: Light follows cursor with a 45-degree angled gradient
- **Intro Animation**: Light sweeps across the card on mount
- **Flip Animation**: Smooth flip to reveal card back with polished easing
- **Customizable**: Card images, company name, and dimensions

## Demo

![3D Card Preview](./demo.gif)

## Installation

```bash
npm install
npm run dev
```

## Usage

```tsx
import Card3DPreview from './Card3DPreview';
import FlipButton from './FlipButton';
import { useState, useCallback } from 'react';

function App() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = useCallback(() => {
    if (isFlipping) return;
    setIsFlipping(true);
    setIsFlipped(prev => !prev);
    setTimeout(() => setIsFlipping(false), 800);
  }, [isFlipping]);

  return (
    <div style={{ position: 'relative' }}>
      <Card3DPreview 
        companyName="ACME CORP"
        isFlipped={isFlipped}
        isFlipping={isFlipping}
        cardFrontSrc="/card-front.svg"
        cardBackSrc="/card-back.svg"
      />
      <FlipButton 
        isFlipped={isFlipped}
        onClick={handleFlip}
      />
    </div>
  );
}
```

## Props

### Card3DPreview

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isMetal` | `boolean` | `true` | Whether to show metal card styling |
| `companyName` | `string` | `'RIPPLING'` | Company name to display on the card |
| `isFlipped` | `boolean` | `false` | Whether the card is flipped to show the back |
| `isFlipping` | `boolean` | `false` | Whether the card is currently in a flip animation |
| `cardFrontSrc` | `string` | `'/card-front.svg'` | URL/path to the front card image |
| `cardBackSrc` | `string` | `'/card-back.svg'` | URL/path to the back card image |
| `width` | `number` | `448` | Card width in pixels |
| `height` | `number` | `280` | Card height in pixels |

### FlipButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isFlipped` | `boolean` | - | Whether the card is currently flipped |
| `onClick` | `() => void` | - | Click handler to toggle flip state |
| `variant` | `'light' \| 'dark'` | `'dark'` | Button variant for different backgrounds |

## Card Assets

Place your card SVG files in the `public` folder:
- `public/card-front.svg` - Front of the card
- `public/card-back.svg` - Back of the card

## License

MIT
