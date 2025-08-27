'use client';

import React, { useState } from 'react';
import { X, Settings, Eye, EyeOff, Share2 } from 'lucide-react';

interface HoroscopeSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    showHoroscope: boolean;
    shareHoroscope: boolean;
  };
  onSettingsChange: (settings: { showHoroscope: boolean; shareHoroscope: boolean }) => void;
}

export default function HoroscopeSettings({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange 
}: HoroscopeSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
    // Save to localStorage
    localStorage.setItem('horoscopeSettings', JSON.stringify(localSettings));
    onClose();
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Horoscope Settings
            </h3>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Show Horoscope Setting */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                {localSettings.showHoroscope ? (
                  <Eye className="w-5 h-5 text-purple-500" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    Show Horoscope
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Display daily horoscope information
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.showHoroscope}
                  onChange={(e) => setLocalSettings(prev => ({ 
                    ...prev, 
                    showHoroscope: e.target.checked,
                    // If hiding horoscope, also disable sharing
                    shareHoroscope: e.target.checked ? prev.shareHoroscope : false
                  }))}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${
                  localSettings.showHoroscope 
                    ? 'bg-purple-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    localSettings.showHoroscope ? 'translate-x-5' : 'translate-x-0'
                  } mt-0.5 ml-0.5`}></div>
                </div>
              </label>
            </div>

            {/* Share Horoscope Setting */}
            <div className={`flex items-center justify-between p-4 rounded-lg transition-all ${
              localSettings.showHoroscope 
                ? 'bg-gray-50 dark:bg-gray-700' 
                : 'bg-gray-100 dark:bg-gray-800 opacity-50'
            }`}>
              <div className="flex items-center space-x-3">
                <Share2 className={`w-5 h-5 ${
                  localSettings.showHoroscope && localSettings.shareHoroscope 
                    ? 'text-purple-500' 
                    : 'text-gray-400'
                }`} />
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    Share with Partner
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Let your partner see your horoscope
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.shareHoroscope && localSettings.showHoroscope}
                  onChange={(e) => setLocalSettings(prev => ({ 
                    ...prev, 
                    shareHoroscope: e.target.checked 
                  }))}
                  disabled={!localSettings.showHoroscope}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${
                  localSettings.shareHoroscope && localSettings.showHoroscope
                    ? 'bg-purple-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    localSettings.shareHoroscope && localSettings.showHoroscope 
                      ? 'translate-x-5' 
                      : 'translate-x-0'
                  } mt-0.5 ml-0.5`}></div>
                </div>
              </label>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-sm text-purple-800 dark:text-purple-200">
              <div className="font-medium mb-1">About Horoscopes</div>
              <div className="text-purple-700 dark:text-purple-300">
                Daily horoscopes are provided by aztro API and cached for 24 hours. 
                Your partner can only see your horoscope if you enable sharing.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
