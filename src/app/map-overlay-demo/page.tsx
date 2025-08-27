'use client';

import React, { useState, useEffect, useRef } from 'react';
import DotWorldMap from '@/components/DotWorldMap';
import MapCards from '@/components/MapCards';
import { project } from '@/lib/geo';
import { svgToViewport } from '@/lib/mapCoords';

export default function MapOverlayDemo() {
  const [cards, setCards] = useState<any[]>([]);
  const [svgElement, setSvgElement] = useState<SVGSVGElement | null>(null);
  const [simulateRefetch, setSimulateRefetch] = useState(false);
  
  // NYC and Paris coordinates
  const nyc = { lat: 40.7128, lon: -74.0060 };
  const paris = { lat: 48.8566, lon: 2.3522 };

  useEffect(() => {
    if (!svgElement) return;

    // Convert lat/lon to SVG coordinates
    const nycSvg = project([nyc.lon, nyc.lat]);
    const parisSvg = project([paris.lon, paris.lat]);

    // Convert SVG coordinates to viewport coordinates
    const nycViewport = svgToViewport(svgElement, { x: nycSvg[0], y: nycSvg[1] });
    const parisViewport = svgToViewport(svgElement, { x: parisSvg[0], y: parisSvg[1] });

    setCards([
      {
        id: 'nyc',
        x: nycViewport.left,
        y: nycViewport.top,
        content: (
          <div>
            <div className="font-semibold">New York City</div>
            <div className="text-sm opacity-80">40.7128°N, 74.0060°W</div>
          </div>
        )
      },
      {
        id: 'paris',
        x: parisViewport.left,
        y: parisViewport.top,
        content: (
          <div>
            <div className="font-semibold">Paris</div>
            <div className="text-sm opacity-80">48.8566°N, 2.3522°E</div>
          </div>
        )
      }
    ]);
  }, [svgElement]);

  // Simulate React Query refetch every 5 seconds
  useEffect(() => {
    if (!simulateRefetch) return;

    const interval = setInterval(() => {
      console.log('Simulating refetch...');
      // This should not cause cards to disappear
    }, 5000);

    return () => clearInterval(interval);
  }, [simulateRefetch]);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Map Overlay Demo</h1>
          <p className="text-gray-300 mb-4">
            This demo shows persistent overlay cards that should remain visible for at least 60 seconds.
          </p>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSimulateRefetch(!simulateRefetch)}
              className={`px-4 py-2 rounded-lg font-medium ${
                simulateRefetch 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {simulateRefetch ? 'Stop' : 'Start'} Simulated Refetch (5s)
            </button>
            
            <div className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Cards: {cards.length}
            </div>
          </div>
        </div>

        <div className="relative w-full" style={{ minHeight: '400px' }}>
          <DotWorldMap
            a={nyc}
            b={paris}
            label="both"
            className="w-full"
            landColor="#cfd6ff"
            oceanColor="rgba(42,47,58,.55)"
          />
          
          {cards.length > 0 && <MapCards cards={cards} />}
        </div>

        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-2">Test Instructions</h2>
          <ul className="text-gray-300 space-y-1">
            <li>• Cards should appear over NYC and Paris</li>
            <li>• Cards should remain visible for at least 60 seconds</li>
            <li>• Toggle "Simulated Refetch" to test persistence during re-renders</li>
            <li>• Cards should not disappear or fade out</li>
            <li>• Cards should be clickable (pointer-events: auto)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
