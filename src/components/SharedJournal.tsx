'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Smile, Frown, Meh, MessageCircle, Send, HeartHandshake, MapPin, Clock, Star, Book, X, Search, Calendar, User } from 'lucide-react';

interface JournalEntry {
  id: string;
  userId: string;
  userName: string;
  mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'anxious' | 'loved' | 'missing' | 'grateful' | 'hopeful' | 'lonely';
  content: string;
  prompt?: string;
  timestamp: Date;
}

interface SharedJournalProps {
  currentUserId: string;
  currentUserName: string;
  partnerId: string;
  partnerName: string;
  onPartnerMoodUpdate?: (mood: JournalEntry['mood'] | null) => void;
  onJournalEntryCreated?: (userId: string) => void;
}

const moodOptions = [
  { value: 'happy', label: 'Happy', icon: Smile, color: 'text-yellow-600', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
  { value: 'excited', label: 'Excited', icon: Heart, color: 'text-red-600', bgColor: 'bg-red-100', textColor: 'text-red-800' },
  { value: 'loved', label: 'Loved', icon: Heart, color: 'text-pink-600', bgColor: 'bg-pink-100', textColor: 'text-pink-800' },
  { value: 'missing', label: 'Missing You', icon: HeartHandshake, color: 'text-rose-600', bgColor: 'bg-rose-100', textColor: 'text-rose-800' },
  { value: 'grateful', label: 'Grateful', icon: Star, color: 'text-amber-600', bgColor: 'bg-amber-100', textColor: 'text-amber-800' },
  { value: 'hopeful', label: 'Hopeful', icon: Clock, color: 'text-green-600', bgColor: 'bg-green-100', textColor: 'text-green-800' },
  { value: 'lonely', label: 'Lonely', icon: MapPin, color: 'text-indigo-600', bgColor: 'bg-indigo-100', textColor: 'text-indigo-800' },
  { value: 'neutral', label: 'Neutral', icon: Meh, color: 'text-gray-600', bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
  { value: 'sad', label: 'Sad', icon: Frown, color: 'text-blue-600', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
  { value: 'anxious', label: 'Anxious', icon: Frown, color: 'text-purple-600', bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
];

const journalPrompts = [
  "No Prompt - Free Writing",
  "What's the highlight of your day so far?",
  "What are you looking forward to today?",
  "What made you smile today?",
  "What's on your mind right now?",
  "What's something you're grateful for today?",
  "What's a challenge you're facing?",
  "What's something you want to share with me?",
  "What's your favorite memory of us?",
  "What's something you're proud of?",
  "What's something you need support with?",
];

export default function SharedJournal({ 
  currentUserId, 
  currentUserName, 
  partnerId, 
  partnerName,
  onPartnerMoodUpdate,
  onJournalEntryCreated
}: SharedJournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState<JournalEntry['mood']>('neutral');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'user' | 'partner'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Load entries from localStorage or create demo entries
  useEffect(() => {
    // Always clear localStorage first to ensure fresh demo data
    localStorage.removeItem('sharedJournal');
    
    // Create demo entries for demonstration
    const demoEntries: JournalEntry[] = [
      {
        id: 'demo-1',
        userId: 'partner-default',
        userName: 'Alex',
        mood: 'excited',
        content: "Just finished my morning workout! Feeling energized and ready to tackle the day. Can&apos;t wait to hear about your day too! 💪",
        prompt: "What's the highlight of your day so far?",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: 'demo-2',
        userId: 'user-default',
        userName: 'You',
        mood: 'loved',
        content: "Missing you today, but feeling so grateful for our connection. Your messages always brighten my day. Counting down until we can be together again! ❤️",
        prompt: "What's something you're grateful for today?",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      },
      {
        id: 'demo-3',
        userId: 'partner-default',
        userName: 'Alex',
        mood: 'happy',
        content: "Had such a great conversation with my mom today. She asked about you and said she can&apos;t wait to meet you! Family approval feels amazing 😊",
        prompt: "What made you smile today?",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      },
      {
        id: 'demo-4',
        userId: 'user-default',
        userName: 'You',
        mood: 'neutral',
        content: "Work has been pretty busy today, but I&apos;m managing. Looking forward to our video call tonight - that&apos;s what&apos;s keeping me going!",
        prompt: "What's on your mind right now?",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      },
      {
        id: 'demo-5',
        userId: 'partner-default',
        userName: 'Alex',
        mood: 'anxious',
        content: "Feeling a bit stressed about my presentation tomorrow. Could really use some encouragement and maybe a virtual hug? 🤗",
        prompt: "What's a challenge you're facing?",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      }
    ];
    
    setEntries(demoEntries);
    localStorage.setItem('sharedJournal', JSON.stringify(demoEntries));
  }, []); // Remove dependencies to avoid re-running

  // Notify parent component when partner's mood changes
  useEffect(() => {
    if (onPartnerMoodUpdate) {
      const partnerMood = getPartnerTodayMood();
      onPartnerMoodUpdate(partnerMood);
    }
  }, [entries, onPartnerMoodUpdate, partnerId]);

  // Save entries to localStorage
  const saveEntries = (newEntries: JournalEntry[]) => {
    localStorage.setItem('sharedJournal', JSON.stringify(newEntries));
    setEntries(newEntries);
  };

  const addEntry = () => {
    if (!newEntry.trim()) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      userId: currentUserId,
      userName: currentUserName,
      mood: selectedMood,
      content: newEntry,
      prompt: selectedPrompt || undefined,
      timestamp: new Date(),
    };

    const updatedEntries = [entry, ...entries];
    saveEntries(updatedEntries);
    setNewEntry('');
    setSelectedMood('neutral');
    setSelectedPrompt('');
    setShowPrompts(false);
    
    // Notify parent component about new journal entry
    if (onJournalEntryCreated) {
      onJournalEntryCreated(currentUserId);
    }
  };

  const selectPrompt = (prompt: string) => {
    // If "No Prompt - Free Writing" is selected, clear the prompt
    if (prompt === "No Prompt - Free Writing") {
      setSelectedPrompt('');
    } else {
      setSelectedPrompt(prompt);
    }
    setShowPrompts(false);
  };

  const getMoodIcon = (mood: JournalEntry['mood']) => {
    const moodOption = moodOptions.find(option => option.value === mood);
    const IconComponent = moodOption?.icon || Meh;
    return <IconComponent className={`w-4 h-4 ${moodOption?.color}`} />;
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const clearDemoData = () => {
    localStorage.removeItem('sharedJournal');
    setEntries([]);
  };

  // Filter and sort entries for the modal
  const getFilteredEntries = () => {
    let filtered = entries;

    // Filter by user
    if (filterBy === 'user') {
      filtered = filtered.filter(entry => entry.userId === currentUserId);
    } else if (filterBy === 'partner') {
      filtered = filtered.filter(entry => entry.userId === partnerId);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(entry => 
        entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.prompt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort entries
    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  // Get partner's mood from today
  const getPartnerTodayMood = () => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    
    const partnerTodayEntries = entries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entry.userId === partnerId && 
             entryDate >= todayStart && 
             entryDate < todayEnd;
    });

    // Return the mood from the most recent entry today
    if (partnerTodayEntries.length > 0) {
      const latestEntry = partnerTodayEntries.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];
      return latestEntry.mood;
    }
    
    return null;
  };

  const hasDemoData = entries.some(entry => entry.id.startsWith('demo-'));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Shared Journal
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowJournalModal(true)}
            className="flex items-center space-x-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 px-2 py-1 rounded transition-all"
          >
            <Book className="w-3 h-3" />
            <span>Show Journal</span>
          </button>
          {hasDemoData && (
            <>
              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                Demo Data
              </span>
              <button
                onClick={clearDemoData}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded transition-all"
                title="Clear demo data"
              >
                Clear
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* New Entry Section */}
      <div className="mb-4">
        {/* Mood Picker */}
        <div className="mb-3">
          <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
            How are you feeling?
          </label>
          <div className="flex flex-wrap gap-2">
            {moodOptions.map((mood) => {
              const IconComponent = mood.icon;
              return (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value as JournalEntry['mood'])}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedMood === mood.value
                      ? `${mood.bgColor} ${mood.textColor}`
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <IconComponent className={`w-3 h-3 ${selectedMood === mood.value ? mood.color : ''}`} />
                  <span>{mood.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Prompt Selector */}
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Journal Prompt
            </label>
            <button
              onClick={() => setShowPrompts(!showPrompts)}
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded transition-all"
            >
              {showPrompts ? 'Hide' : 'Show'} Prompts
            </button>
          </div>
          
          {selectedPrompt && (
            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300">
              &quot;{selectedPrompt}&quot;
            </div>
          )}
          
          {showPrompts && (
            <div className="mt-2 max-h-32 overflow-y-auto bg-gray-50 dark:bg-gray-700 rounded p-2">
              {journalPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => selectPrompt(prompt)}
                  className="block w-full text-left text-sm p-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Text Input */}
        <div className="mb-3">
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="Share your thoughts, feelings, or experiences..."
            className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={addEntry}
          disabled={!newEntry.trim()}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Journal Entries */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {entries.length === 0 ? (
          <div className="text-center py-4">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
            <p className="text-sm text-gray-600 dark:text-gray-400">No journal entries yet. Be the first to share!</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className={`p-3 rounded-lg border ${
                entry.userId === currentUserId
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 ml-4'
                  : 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800 mr-4'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    entry.userId === currentUserId 
                      ? 'bg-blue-100 dark:bg-blue-800' 
                      : 'bg-pink-100 dark:bg-pink-800'
                  }`}>
                    <span className={`text-xs font-bold ${
                      entry.userId === currentUserId 
                        ? 'text-blue-700 dark:text-blue-200' 
                        : 'text-pink-700 dark:text-pink-200'
                    }`}>
                      {entry.userName.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{entry.userName}</span>
                  {getMoodIcon(entry.mood)}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(entry.timestamp)}</span>
              </div>
              
              {entry.prompt && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 italic">
                  &quot;{entry.prompt}&quot;
                </div>
              )}
              
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{entry.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Journal Modal */}
      {showJournalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10001] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Complete Journal History
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {getFilteredEntries().length} of {entries.length} entries
                </p>
              </div>
              <button
                onClick={() => setShowJournalModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Search and Filter Controls */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search entries, prompts, or names..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Filter by User */}
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as 'all' | 'user' | 'partner')}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Entries</option>
                    <option value="user">My Entries</option>
                    <option value="partner">{partnerName}&apos;s Entries</option>
                  </select>
                </div>

                {/* Sort */}
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {getFilteredEntries().length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm || filterBy !== 'all' ? 'No entries match your search criteria.' : 'No journal entries found.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getFilteredEntries().map((entry) => (
                    <div
                      key={entry.id}
                      className={`p-4 rounded-lg border ${
                        entry.userId === currentUserId
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                          : 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            entry.userId === currentUserId 
                              ? 'bg-blue-100 dark:bg-blue-800' 
                              : 'bg-pink-100 dark:bg-pink-800'
                          }`}>
                            <span className={`text-sm font-bold ${
                              entry.userId === currentUserId 
                                ? 'text-blue-700 dark:text-blue-200' 
                                : 'text-pink-700 dark:text-pink-200'
                            }`}>
                              {entry.userName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-800 dark:text-gray-200">{entry.userName}</span>
                              {getMoodIcon(entry.mood)}
                              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {moodOptions.find(m => m.value === entry.mood)?.label}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {new Intl.DateTimeFormat('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                              }).format(new Date(entry.timestamp))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {entry.prompt && entry.prompt !== "No Prompt - Free Writing" && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 italic bg-gray-100 dark:bg-gray-700 p-2 rounded">
                          &quot;{entry.prompt}&quot;
                        </div>
                      )}
                      
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{entry.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                <span>Total memories shared: {entries.length}</span>
                <button
                  onClick={() => setShowJournalModal(false)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
