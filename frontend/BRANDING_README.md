# Dynamic Branding System

This app now supports dynamic branding that allows you to easily switch between different brands, logos, and themes.

## How to Switch Brands

### Method 1: Using the Brand Switcher (Development Only)
When running in development mode, you'll see a brand switcher widget in the bottom-right corner of the screen. Click on any brand button to instantly switch.

### Method 2: Programmatic Switching
Use the utility functions to switch brands programmatically:

```javascript
import { switchToBrand } from './Utils/brandUtils';

// Switch to RAKSHA branding
switchToBrand('raksha');

// Switch to I'm Safe branding
switchToBrand('imsafe');

// Switch to custom branding
switchToBrand('custom');
```

### Method 3: Direct Context Usage
Use the branding context directly in any component:

```javascript
import { useBranding } from '../Context/BrandingContext';

function MyComponent() {
  const { switchBrand, currentBrand, brandData } = useBranding();

  return (
    <div>
      <h1>{brandData.name}</h1>
      <button onClick={() => switchBrand('raksha')}>
        Switch to RAKSHA
      </button>
    </div>
  );
}
```

## Available Brands

### RAKSHA (Default)
- **Name:** RAKSHA
- **Tagline:** Empowering women with safety
- **Colors:** Red theme (#dc2626)
- **Logo:** Image-based logo

### I'm Safe
- **Name:** I'm Safe
- **Tagline:** Your safety, our priority
- **Colors:** Pink theme (#ec4899)
- **Logo:** Text-based "I'm Safe"

### Custom
- **Name:** Custom Brand
- **Tagline:** Your custom safety solution
- **Colors:** Blue theme (#3b82f6)
- **Logo:** Configurable

## Adding a New Brand

1. Add a new entry to `src/Config/BrandingConfig.js`:

```javascript
export const BRANDS = {
  // ... existing brands
  mybrand: {
    name: "My Brand",
    tagline: "My brand tagline",
    colors: {
      primary: "#your-color",
      secondary: "#your-color",
      accent: "#your-color",
      text: "#1f2937",
      lightText: "#6b7280"
    },
    logo: {
      text: "My Brand",
      image: "https://path-to-logo.png" // or null for text-only
    },
    images: {
      // ... image configurations
    },
    contact: {
      email: "support@mybrand.com",
      phone: { india: "", australia: "" }
    },
    company: "My Brand Ltd"
  }
}
```

2. The brand will automatically appear in the brand switcher.

## What Gets Changed

When you switch brands, the following elements update dynamically:

- **Navbar Logo/Brand Name**
- **Footer Brand Name & Copyright**
- **Contact Information** (emails, phone numbers)
- **Download Button Text**
- **All Brand Name References** in content
- **CSS Custom Properties** for theming

## Persistence

Brand selection is automatically saved to localStorage and persists across browser sessions.