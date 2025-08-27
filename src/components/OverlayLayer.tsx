import { createPortal } from 'react-dom';
import React, { useEffect, useState } from 'react';

export default function OverlayLayer({ 
  children, 
  style 
}: {
  children: React.ReactNode; 
  style?: React.CSSProperties;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const root = document.getElementById('overlay-root');
  if (!root) {
    console.warn('Overlay root not found, rendering inline');
    return (
      <div style={{
        position: 'fixed', 
        inset: 0, 
        pointerEvents: 'none',
        zIndex: 2147483647, // max
        ...style
      }}>
        {children}
      </div>
    );
  }

  return createPortal(
    <div style={{
      position: 'fixed', 
      inset: 0, 
      pointerEvents: 'none',
      zIndex: 2147483647, // max
      ...style
    }}>
      {children}
    </div>,
    root
  );
}
