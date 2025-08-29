'use client';

import { useState, useEffect } from 'react';
import { interests, interestCategories, type Interest } from '@/data/interests';

interface InterestsSelectorProps {
  selectedInterests: string[];
  onInterestsChange: (interests: string[]) => void;
  minSelections?: number;
  maxSelections?: number;
  className?: string;
}

export default function InterestsSelector({
  selectedInterests,
  onInterestsChange,
  minSelections = 5,
  maxSelections = 20,
  className = ''
}: InterestsSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInterests, setFilteredInterests] = useState<Interest[]>(interests);

  // Filter interests based on search term and category
  useEffect(() => {
    let filtered = interests;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(interest => interest.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(interest => 
        interest.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interest.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredInterests(filtered);
  }, [selectedCategory, searchTerm]);

  const handleInterestToggle = (interestId: string) => {
    const newSelected = selectedInterests.includes(interestId)
      ? selectedInterests.filter(id => id !== interestId)
      : [...selectedInterests, interestId];
    
    // Enforce max selections
    if (newSelected.length <= maxSelections) {
      onInterestsChange(newSelected);
    }
  };

  const getInterestById = (id: string) => interests.find(interest => interest.id === id);

  const selectedInterestsData = selectedInterests.map(getInterestById).filter(Boolean) as Interest[];

  const isMinReached = selectedInterests.length >= minSelections;
  const isMaxReached = selectedInterests.length >= maxSelections;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          What interests you? 🎯
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Select {minSelections}-{maxSelections} interests to help personalize your experience
        </p>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {selectedInterests.length} of {maxSelections} selected
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search interests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {['All', ...interestCategories].map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-pink-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Selected Interests Display */}
      {selectedInterestsData.length > 0 && (
        <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4">
          <h4 className="font-medium text-pink-800 dark:text-pink-200 mb-3">
            Selected Interests ({selectedInterestsData.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedInterestsData.map(interest => (
              <button
                key={interest.id}
                onClick={() => handleInterestToggle(interest.id)}
                className="flex items-center gap-1 px-3 py-1 bg-pink-100 dark:bg-pink-800 text-pink-800 dark:text-pink-200 rounded-full text-sm hover:bg-pink-200 dark:hover:bg-pink-700 transition-colors"
              >
                <span>{interest.emoji}</span>
                <span>{interest.label}</span>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interests Grid */}
      <div className="max-h-96 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInterests.map(interest => {
            const isSelected = selectedInterests.includes(interest.id);
            const isDisabled = !isSelected && isMaxReached;
            
            return (
              <button
                key={interest.id}
                onClick={() => handleInterestToggle(interest.id)}
                disabled={isDisabled}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left relative ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-800 dark:text-pink-200 shadow-md scale-105'
                    : isDisabled
                    ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-pink-300 dark:hover:border-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/10 hover:scale-105'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-sm font-medium">{interest.label}</span>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Validation Message */}
      {!isMinReached && selectedInterests.length > 0 && (
        <div className="text-center text-amber-600 dark:text-amber-400 text-sm">
          Please select at least {minSelections} interests
        </div>
      )}

      {isMaxReached && (
        <div className="text-center text-blue-600 dark:text-blue-400 text-sm">
          Maximum {maxSelections} interests selected. Remove some to add more.
        </div>
      )}

      {/* Empty State */}
      {filteredInterests.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p>No interests found matching your search.</p>
        </div>
      )}
    </div>
  );
}
