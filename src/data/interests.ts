export interface Interest {
  id: string;
  label: string;
  category: string;
  emoji: string;
}

export const interests: Interest[] = [
  // 🎭 Arts & Culture
  { id: 'music', label: 'Music', category: 'Arts & Culture', emoji: '🎵' },
  { id: 'movies-tv', label: 'Movies & TV', category: 'Arts & Culture', emoji: '🎬' },
  { id: 'reading', label: 'Reading', category: 'Arts & Culture', emoji: '📚' },
  { id: 'writing', label: 'Writing', category: 'Arts & Culture', emoji: '✍️' },
  { id: 'visual-arts', label: 'Visual Arts / Design', category: 'Arts & Culture', emoji: '🎨' },
  { id: 'theater', label: 'Theater / Performing Arts', category: 'Arts & Culture', emoji: '🎭' },

  // 🌍 Lifestyle & Social
  { id: 'travel', label: 'Travel', category: 'Lifestyle & Social', emoji: '✈️' },
  { id: 'food-cooking', label: 'Food & Cooking', category: 'Lifestyle & Social', emoji: '👨‍🍳' },
  { id: 'fitness-wellness', label: 'Fitness & Wellness', category: 'Lifestyle & Social', emoji: '💪' },
  { id: 'fashion-style', label: 'Fashion & Style', category: 'Lifestyle & Social', emoji: '👗' },
  { id: 'volunteering', label: 'Volunteering / Community', category: 'Lifestyle & Social', emoji: '🤝' },
  { id: 'spirituality', label: 'Spirituality / Mindfulness', category: 'Lifestyle & Social', emoji: '🧘' },

  // 🏞️ Outdoors & Active
  { id: 'hiking', label: 'Hiking', category: 'Outdoors & Active', emoji: '🥾' },
  { id: 'camping', label: 'Camping', category: 'Outdoors & Active', emoji: '⛺' },
  { id: 'sports-playing', label: 'Sports (Playing)', category: 'Outdoors & Active', emoji: '⚽' },
  { id: 'sports-watching', label: 'Sports (Watching)', category: 'Outdoors & Active', emoji: '📺' },
  { id: 'gardening', label: 'Gardening', category: 'Outdoors & Active', emoji: '🌱' },
  { id: 'exercise-gym', label: 'Exercise / Gym', category: 'Outdoors & Active', emoji: '🏋️' },

  // 🧠 Knowledge & Hobbies
  { id: 'technology', label: 'Technology & Gadgets', category: 'Knowledge & Hobbies', emoji: '💻' },
  { id: 'science', label: 'Science & Discovery', category: 'Knowledge & Hobbies', emoji: '🔬' },
  { id: 'history', label: 'History & Culture', category: 'Knowledge & Hobbies', emoji: '📜' },
  { id: 'gaming', label: 'Gaming (Video / Board)', category: 'Knowledge & Hobbies', emoji: '🎮' },
  { id: 'diy-crafting', label: 'DIY / Crafting', category: 'Knowledge & Hobbies', emoji: '🔧' },
  { id: 'photography', label: 'Photography', category: 'Knowledge & Hobbies', emoji: '📸' },

  // 💬 Social & Personal
  { id: 'family-time', label: 'Family Time', category: 'Social & Personal', emoji: '👨‍👩‍👧‍👦' },
  { id: 'friends-socializing', label: 'Friends & Socializing', category: 'Social & Personal', emoji: '👥' },
  { id: 'pets-animals', label: 'Pets & Animals', category: 'Social & Personal', emoji: '🐕' },
  { id: 'romance-relationships', label: 'Romance & Relationships', category: 'Social & Personal', emoji: '💕' },
  { id: 'personal-growth', label: 'Personal Growth', category: 'Social & Personal', emoji: '🌱' },
  { id: 'career-ambition', label: 'Career & Ambition', category: 'Social & Personal', emoji: '💼' }
];

export const interestCategories = [
  'Arts & Culture',
  'Lifestyle & Social',
  'Outdoors & Active',
  'Knowledge & Hobbies',
  'Social & Personal'
];

export const getInterestsByCategory = () => {
  const categorized: Record<string, Interest[]> = {};
  interests.forEach(interest => {
    if (!categorized[interest.category]) {
      categorized[interest.category] = [];
    }
    categorized[interest.category].push(interest);
  });
  return categorized;
};
