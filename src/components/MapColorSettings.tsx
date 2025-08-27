import React, { useState, useEffect } from 'react';

interface MapColors {
  landColor: string;
  oceanColor: string;
  backgroundColor: string;
  textColor: string;
}

interface MapColorSettingsProps {
  onColorsChange: (colors: MapColors) => void;
  className?: string;
}

export default function MapColorSettings({ onColorsChange, className = '' }: MapColorSettingsProps) {
  const [colors, setColors] = useState<MapColors>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mapColors');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all properties exist for backward compatibility
        return {
          landColor: parsed.landColor || '#cfd6ff',
          oceanColor: parsed.oceanColor || 'rgba(42,47,58,.55)',
          backgroundColor: parsed.backgroundColor || '#0f1115',
          textColor: parsed.textColor || '#3b82f6'
        };
      }
    }
    return {
      landColor: '#cfd6ff',
      oceanColor: 'rgba(42,47,58,.55)',
      backgroundColor: '#0f1115',
      textColor: '#3b82f6'
    };
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('mapColors', JSON.stringify(colors));
    onColorsChange(colors);
  }, [colors, onColorsChange]);

  const handleColorChange = (type: keyof MapColors, value: string) => {
    setColors(prev => ({
      ...prev,
      [type]: value
    }));
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1.5 rounded-md text-xs transition-colors flex items-center gap-1"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
        Colors
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-lg z-50 min-w-[200px]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Land Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={colors.landColor}
                  onChange={(e) => handleColorChange('landColor', e.target.value)}
                  className="w-10 h-10 rounded border-2 border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={colors.landColor}
                  onChange={(e) => handleColorChange('landColor', e.target.value)}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                  placeholder="#cfd6ff"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ocean Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={(() => {
                    // Extract RGB values from RGBA string for color picker
                    const match = colors.oceanColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                    if (match) {
                      const r = parseInt(match[1]);
                      const g = parseInt(match[2]);
                      const b = parseInt(match[3]);
                      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
                    }
                    return '#2a2f3a';
                  })()}
                  onChange={(e) => {
                    const color = e.target.value;
                    const r = parseInt(color.slice(1,3), 16);
                    const g = parseInt(color.slice(3,5), 16);
                    const b = parseInt(color.slice(5,7), 16);
                    const alpha = colors.oceanColor.match(/[\d.]+\)$/)?.[0] || '0.55)';
                    handleColorChange('oceanColor', `rgba(${r}, ${g}, ${b}, ${alpha}`);
                  }}
                  className="w-10 h-10 rounded border-2 border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={colors.oceanColor}
                  onChange={(e) => handleColorChange('oceanColor', e.target.value)}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                  placeholder="rgba(42,47,58,.55)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Background Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={colors.backgroundColor}
                  onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                  className="w-10 h-10 rounded border-2 border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={colors.backgroundColor}
                  onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                  placeholder="#0f1115"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Text Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={colors.textColor}
                  onChange={(e) => handleColorChange('textColor', e.target.value)}
                  className="w-10 h-10 rounded border-2 border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={colors.textColor}
                  onChange={(e) => handleColorChange('textColor', e.target.value)}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                  placeholder="#3b82f6"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-gray-600">
                              <button
                  onClick={() => {
                    setColors({
                      landColor: '#cfd6ff',
                      oceanColor: 'rgba(42,47,58,.55)',
                      backgroundColor: '#0f1115',
                      textColor: '#3b82f6'
                    });
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded text-sm transition-colors"
                >
                  Reset to Default
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
