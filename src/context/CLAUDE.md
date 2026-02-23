**Statement:** Once the folder I belong to (including file structure, functional positioning, etc.) changes, please update me.

## Member List
- `theme-provider.tsx`
  - Core function: Manages application theme (light/dark/system), persists preference to cookies, applies CSS classes to html element;
  - Technical details: Resolves system theme when set to "system", auto-updates on system theme change, cookie name: vite-ui-theme;
  - Key parameters: Theme ('dark' | 'light' | 'system'), setTheme(), resetTheme(), resolvedTheme (actual applied theme)
- `font-provider.tsx`
  - Core function: Manages application font family, applies font-{name} class to html element, persists preference to cookies;
  - Technical details: Switches between predefined fonts from @/config/fonts, cookie name: font;
  - Key parameters: Font (font type), setFont(), resetFont()
- `direction-provider.tsx`
  - Core function: Manages text direction (LTR/RTL) for internationalization, sets dir attribute on html element;
  - Technical details: Integrates with Radix UI DirectionProvider, persists to cookies (name: dir), used for Arabic/Hebrew RTL languages;
  - Key parameters: Direction ('ltr' | 'rtl'), setDir(), resetDir()
- `layout-provider.tsx`
  - Core function: Manages layout variants and sidebar behavior, persists preferences to cookies;
  - Technical details: Controls collapsible (offcanvas/icon/none) and variant (inset/sidebar/floating), cookies: layout_collapsible, layout_variant;
  - Key parameters: collapsible (sidebar behavior), setCollapsible(), variant (layout style), setVariant(), resetLayout()
- `search-provider.tsx`
  - Core function: Global search state management (reserved for future use);
  - Technical details: Basic implementation ready for search functionality;
  - Key parameters: search state (reserved)
