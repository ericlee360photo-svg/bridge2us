import React, { useState } from 'react';
import { Calendar, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

interface CalendarImportProps {
  onImportSuccess?: (calendarData: { provider: string; events: unknown[] }) => void;
  className?: string;
}

export default function CalendarImport({ onImportSuccess, className = '' }: CalendarImportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [importing, setImporting] = useState<string | null>(null);
  const [importedCalendars, setImportedCalendars] = useState<string[]>([]);

  const calendarProviders = [
    {
      id: 'google',
      name: 'Google Calendar',
      icon: '📅',
      description: 'Import events from your Google Calendar',
      color: 'bg-blue-500 hover:bg-blue-600',
      authUrl: '/api/calendar/google/auth'
    },
    {
      id: 'apple',
      name: 'Apple Calendar',
      icon: '🍎',
      description: 'Import events from your Apple Calendar',
      color: 'bg-gray-800 hover:bg-gray-900',
      authUrl: '/api/calendar/apple/auth'
    },
    {
      id: 'outlook',
      name: 'Outlook Calendar',
      icon: '📧',
      description: 'Import events from your Outlook Calendar',
      color: 'bg-blue-600 hover:bg-blue-700',
      authUrl: '/api/calendar/outlook/auth'
    }
  ];

  const handleImport = async (providerId: string) => {
    setImporting(providerId);
    
    try {
      // Simulate API call - replace with actual calendar API integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful import
      setImportedCalendars(prev => [...prev, providerId]);
      onImportSuccess?.({ provider: providerId, events: [] });
      
      // Show success message
      alert(`${calendarProviders.find(p => p.id === providerId)?.name} imported successfully!`);
    } catch (error) {
      console.error('Calendar import error:', error);
      alert('Failed to import calendar. Please try again.');
    } finally {
      setImporting(null);
    }
  };

  const handleManualAuth = (providerId: string) => {
    const provider = calendarProviders.find(p => p.id === providerId);
    if (provider) {
      // Open OAuth flow in new window
      window.open(provider.authUrl, '_blank', 'width=500,height=600');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
      >
        <Calendar className="w-4 h-4" />
        Import Calendar
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[300px]">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Import Calendar
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              {calendarProviders.map((provider) => {
                const isImported = importedCalendars.includes(provider.id);
                const isImporting = importing === provider.id;

                return (
                  <div
                    key={provider.id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{provider.icon}</span>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">
                          {provider.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {provider.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isImported ? (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Imported</span>
                        </div>
                      ) : isImporting ? (
                        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm">Importing...</span>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleImport(provider.id)}
                            className={`${provider.color} text-white px-3 py-1 rounded text-sm transition-colors`}
                          >
                            Import
                          </button>
                          <button
                            onClick={() => handleManualAuth(provider.id)}
                            className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Auth
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> Calendar import requires authorization. 
                  Your calendar data will be used to sync events and suggest optimal meeting times.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
