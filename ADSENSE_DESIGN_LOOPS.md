# AdSense Custom Management & Global Toggle — Double-Loop Design Iteration

## Loop 1: Problem & User Pain Analysis
1. **Unwanted Ad Clutter**: Defaulting to visual ad boxes across the interface creates visual noise, especially when no real AdSense script or publisher ID has been configured yet.
2. **Lack of Dynamic Control**: Users have no UI mechanism to turn ads on or off, edit Publisher IDs (`ca-pub-XXXXXXXXXX`), or configure specific slot unit IDs without editing source code.
3. **Layout Impact**: Displaying static ad placeholders when ads are intended to be off harms the core user experience for truck drivers evaluating weight bridge formulas.

---

## Loop 2: Solution Architecture & State Design

### 1. Global AdSense Store (`useAdSenseStore` / Local Storage Persistence)
- **`enabled` (boolean, default: `false`)**: When set to `false`, `<AdSlot />` returns `null` for ALL placements across the application. Zero DOM footprint, zero visual boxes, zero borders.
- **`publisherId` (string)**: Configurable publisher ID (e.g., `ca-pub-1234567890123456`).
- **`autoAds` (boolean)**: Enable/disable Google Auto Ads script injection in `<head>`.
- **Placement Level Toggles**:
  - `topBannerEnabled` (boolean)
  - `sidebarEnabled` (boolean)
  - `inlineContentEnabled` (boolean)
  - `stickyFooterEnabled` (boolean)
- **Slot IDs**: Individual slot units for each position.

### 2. Admin Control Panel (Integrated into `/admin/seo-health`)
- Master **Global Activation Toggle** (ON/OFF).
- Input for **Google AdSense Publisher ID**.
- Granular placement toggles for Top Banner, Sidebar, Content Stream, and Footer.
- Script snippet auto-generator showing the exact `<script>` tag injected for Vercel / Next.js / React integration.
- Persists instantly in `localStorage`.

### 3. Component Behavior (`<AdSlot />`)
- Check global `enabled` state. If `false`, return `null`.
- Check specific placement toggle (e.g., `topBannerEnabled`). If `false`, return `null`.
- Only render if both global and placement settings are active.
