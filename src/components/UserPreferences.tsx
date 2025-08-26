"use client";


import { Settings, Thermometer, Ruler, Globe } from "lucide-react";

interface UserPreferencesProps {
  measurementSystem: string;
  temperatureUnit: string;
  distanceUnit: string;
  onMeasurementSystemChange: (value: string) => void;
  onTemperatureUnitChange: (value: string) => void;
  onDistanceUnitChange: (value: string) => void;
}

export default function UserPreferences({
  measurementSystem,
  temperatureUnit,
  distanceUnit,
  onMeasurementSystemChange,
  onTemperatureUnitChange,
  onDistanceUnitChange
}: UserPreferencesProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5 text-pink-500" />
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
          Measurement Preferences
        </h3>
      </div>

      {/* Measurement System */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          <Globe className="w-4 h-4 inline mr-2" />
          Measurement System
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onMeasurementSystemChange('metric')}
            className={`p-3 rounded-lg border-2 transition-colors ${
              measurementSystem === 'metric'
                ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300'
                : 'border-gray-300 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-500'
            }`}
          >
            <div className="text-center">
              <div className="font-medium">Metric</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Celsius, Kilometers
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onMeasurementSystemChange('imperial')}
            className={`p-3 rounded-lg border-2 transition-colors ${
              measurementSystem === 'imperial'
                ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300'
                : 'border-gray-300 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-500'
            }`}
          >
            <div className="text-center">
              <div className="font-medium">Imperial</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Fahrenheit, Miles
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Temperature Unit */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          <Thermometer className="w-4 h-4 inline mr-2" />
          Temperature Unit
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onTemperatureUnitChange('celsius')}
            className={`p-3 rounded-lg border-2 transition-colors ${
              temperatureUnit === 'celsius'
                ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300'
                : 'border-gray-300 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-500'
            }`}
          >
            <div className="text-center">
              <div className="font-medium">Celsius (°C)</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Water freezes at 0°C
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onTemperatureUnitChange('fahrenheit')}
            className={`p-3 rounded-lg border-2 transition-colors ${
              temperatureUnit === 'fahrenheit'
                ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300'
                : 'border-gray-300 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-500'
            }`}
          >
            <div className="text-center">
              <div className="font-medium">Fahrenheit (°F)</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Water freezes at 32°F
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Distance Unit */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          <Ruler className="w-4 h-4 inline mr-2" />
          Distance Unit
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onDistanceUnitChange('km')}
            className={`p-3 rounded-lg border-2 transition-colors ${
              distanceUnit === 'km'
                ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300'
                : 'border-gray-300 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-500'
            }`}
          >
            <div className="text-center">
              <div className="font-medium">Kilometers (km)</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                1 km = 0.62 miles
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onDistanceUnitChange('mi')}
            className={`p-3 rounded-lg border-2 transition-colors ${
              distanceUnit === 'mi'
                ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300'
                : 'border-gray-300 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-500'
            }`}
          >
            <div className="text-center">
              <div className="font-medium">Miles (mi)</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                1 mile = 1.61 km
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Note:</strong> These preferences will be used for weather data, distance calculations, and other measurements throughout the app. You can change these later in your profile settings.
        </p>
      </div>
    </div>
  );
}
