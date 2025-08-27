import React from 'react';
import OverlayLayer from './OverlayLayer';

type Card = { 
  id: string; 
  x: number; 
  y: number; 
  content: React.ReactNode;
};

export default function MapCards({ cards }: { cards: Card[] }) {
  return (
    <OverlayLayer>
      {cards.map(c => (
        <div key={c.id}
             style={{
               position: 'fixed', 
               left: c.x, 
               top: c.y,
               transform: 'translate(-50%, -100%)',
               pointerEvents: 'auto',
               background: 'rgba(16,18,24,0.75)',
               border: '1px solid rgba(255,255,255,0.12)',
               backdropFilter: 'blur(6px)',
               borderRadius: 12, 
               padding: 12, 
               color: '#eaeef9',
               zIndex: 2147483647
             }}>
          {c.content}
        </div>
      ))}
    </OverlayLayer>
  );
}
