"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Search, Loader2 } from "lucide-react";

interface AddressSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface AddressLookupProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
  className?: string;
}

export default function AddressLookup({ 
  value, 
  onChange, 
  placeholder = "Start typing your address...",
  className = ""
}: AddressLookupProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounce function to limit API calls
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  // Fetch address suggestions from Google Places API
  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // For demo purposes, we'll use a mock API response
      // In production, you'd use the Google Places API
      const mockSuggestions: AddressSuggestion[] = [
        {
          place_id: "1",
          description: "123 Main St, New York, NY 10001, USA",
          structured_formatting: {
            main_text: "123 Main St",
            secondary_text: "New York, NY 10001, USA"
          }
        },
        {
          place_id: "2", 
          description: "456 Broadway, New York, NY 10013, USA",
          structured_formatting: {
            main_text: "456 Broadway",
            secondary_text: "New York, NY 10013, USA"
          }
        },
        {
          place_id: "3",
          description: "789 5th Ave, New York, NY 10065, USA", 
          structured_formatting: {
            main_text: "789 5th Ave",
            secondary_text: "New York, NY 10065, USA"
          }
        }
      ];

      // Filter suggestions based on query
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.description.toLowerCase().includes(query.toLowerCase())
      );

      setSuggestions(filtered);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  useEffect(() => {
    debouncedFetchSuggestions(value);
  }, [value]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectSuggestion = (suggestion: AddressSuggestion) => {
    onChange(suggestion.description);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          placeholder={placeholder}
        />
        {isLoading ? (
          <Loader2 className="absolute right-3 top-3 h-5 w-5 text-gray-400 animate-spin" />
        ) : (
          <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.place_id}
              type="button"
              onClick={() => selectSuggestion(suggestion)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                index === selectedIndex ? "bg-pink-50 dark:bg-pink-900/20" : ""
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {suggestion.structured_formatting.main_text}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {suggestion.structured_formatting.secondary_text}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && !isLoading && suggestions.length === 0 && value.length >= 3 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-gray-500 dark:text-gray-400">
            No addresses found. Try a different search term.
          </div>
        </div>
      )}
    </div>
  );
}
