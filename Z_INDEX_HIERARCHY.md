# Z-Index Hierarchy for Bridge2Us Components

## Overview
This document outlines the z-index hierarchy to ensure card elements and portals are properly positioned above the world map and other base elements.

## Z-Index Hierarchy (Lowest to Highest)

### 0 - Base Layer
- **DotWorldMap**: `zIndex: 0`
  - World map with dots, partner markers, and connection arcs
  - Serves as the base layer for all overlays

### 10-40 - Widget Layer
- **LayoutEditor Widgets**: `zIndex: 10` (normal), `zIndex: 40` (when dragged)
  - Widget containers and layout elements
  - Positioned above the base map layer

### 10000 - Map Overlay Layer
- **Map Overlays**: `zIndex: 10000`
  - Map color settings buttons
  - Location update buttons
  - Time overlays
  - Positioned well above the map for easy interaction

### 2147483647 - Maximum Layer (Portals & Cards)
- **OverlayLayer**: `zIndex: 2147483647`
  - Portal-based overlays that render outside the normal DOM tree
  - Used for floating cards and absolute positioning

- **MapCards**: `zIndex: 2147483647`
  - Individual card elements that appear over the map
  - Rendered through OverlayLayer portal
  - Highest priority for user interaction

## Component Details

### DotWorldMap (zIndex: 0)
```tsx
<svg
  style={{
    position: "relative",
    zIndex: 0  // Base layer
  }}
>
  {/* Ocean dots, land dots, connection arcs, partner markers */}
</svg>
```

### Map Overlays (zIndex: 10000)
```tsx
<div 
  className="absolute inset-0 pointer-events-none" 
  style={{ zIndex: 10000 }}
>
  {/* Map color settings, location buttons, time overlays */}
</div>
```

### OverlayLayer Portal (zIndex: 2147483647)
```tsx
<div style={{
  position: 'fixed', 
  inset: 0, 
  pointerEvents: 'none',
  zIndex: 2147483647  // Maximum z-index
}}>
  {/* Portal content */}
</div>
```

### MapCards (zIndex: 2147483647)
```tsx
<div style={{
  position: 'fixed', 
  left: c.x, 
  top: c.y,
  zIndex: 2147483647  // Maximum z-index
}}>
  {/* Card content */}
</div>
```

## Usage Guidelines

### For New Card Elements
- Use `OverlayLayer` component for floating cards
- Set `zIndex: 2147483647` for maximum visibility
- Ensure `pointerEvents: 'auto'` for interactivity

### For Map Overlays
- Use `zIndex: 10000` for map-specific controls
- Position relative to map container
- Use `pointerEvents: 'auto'` for interactive elements

### For Widgets
- Use `zIndex: 10-40` for layout widgets
- Higher z-index when being dragged
- Position relative to layout container

## Testing

### Verify Z-Index Hierarchy
1. **Base Layer**: DotWorldMap should be at the bottom
2. **Widget Layer**: Layout widgets should be above map
3. **Overlay Layer**: Map controls should be above widgets
4. **Portal Layer**: Cards should be at the very top

### Common Issues
- **Cards not visible**: Check if using OverlayLayer portal
- **Overlays behind map**: Ensure z-index > 0
- **Interaction blocked**: Set `pointerEvents: 'auto'` on interactive elements

## Best Practices

1. **Use OverlayLayer for floating cards** - Ensures proper portal rendering
2. **Set explicit z-index values** - Don't rely on DOM order
3. **Test on different screen sizes** - Ensure positioning works responsively
4. **Use pointer-events appropriately** - `none` for containers, `auto` for interactive elements
5. **Keep z-index values documented** - Maintain clear hierarchy

---

**Status**: ✅ Implemented
**Last Updated**: December 2024
**Components**: DotWorldMap, MapCards, OverlayLayer, LayoutEditor
