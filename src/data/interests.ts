export interface Interest {
  id: string;
  label: string;
  category: string;
  emoji: string;
}

export const interests: Interest[] = [
  // Music & Entertainment
  { id: 'music', label: 'Music', category: 'Entertainment', emoji: '🎵' },
  { id: 'concerts', label: 'Concerts', category: 'Entertainment', emoji: '🎤' },
  { id: 'festivals', label: 'Festivals', category: 'Entertainment', emoji: '🎪' },
  { id: 'movies', label: 'Movies', category: 'Entertainment', emoji: '🎬' },
  { id: 'tv-shows', label: 'TV Shows', category: 'Entertainment', emoji: '📺' },
  { id: 'podcasts', label: 'Podcasts', category: 'Entertainment', emoji: '🎧' },
  { id: 'gaming', label: 'Gaming', category: 'Entertainment', emoji: '🎮' },
  { id: 'board-games', label: 'Board Games', category: 'Entertainment', emoji: '🎲' },
  { id: 'karaoke', label: 'Karaoke', category: 'Entertainment', emoji: '🎤' },
  { id: 'dancing', label: 'Dancing', category: 'Entertainment', emoji: '💃' },
  { id: 'comedy', label: 'Comedy', category: 'Entertainment', emoji: '😂' },
  { id: 'theater', label: 'Theater', category: 'Entertainment', emoji: '🎭' },

  // Food & Dining
  { id: 'cooking', label: 'Cooking', category: 'Food', emoji: '👨‍🍳' },
  { id: 'baking', label: 'Baking', category: 'Food', emoji: '🍰' },
  { id: 'wine', label: 'Wine', category: 'Food', emoji: '🍷' },
  { id: 'craft-beer', label: 'Craft Beer', category: 'Food', emoji: '🍺' },
  { id: 'coffee', label: 'Coffee', category: 'Food', emoji: '☕' },
  { id: 'tea', label: 'Tea', category: 'Food', emoji: '🫖' },
  { id: 'fine-dining', label: 'Fine Dining', category: 'Food', emoji: '🍽️' },
  { id: 'street-food', label: 'Street Food', category: 'Food', emoji: '🌮' },
  { id: 'food-trucks', label: 'Food Trucks', category: 'Food', emoji: '🚚' },
  { id: 'farmers-markets', label: 'Farmers Markets', category: 'Food', emoji: '🥬' },
  { id: 'food-photography', label: 'Food Photography', category: 'Food', emoji: '📸' },

  // Sports & Fitness
  { id: 'running', label: 'Running', category: 'Sports', emoji: '🏃' },
  { id: 'cycling', label: 'Cycling', category: 'Sports', emoji: '🚴' },
  { id: 'swimming', label: 'Swimming', category: 'Sports', emoji: '🏊' },
  { id: 'yoga', label: 'Yoga', category: 'Sports', emoji: '🧘' },
  { id: 'pilates', label: 'Pilates', category: 'Sports', emoji: '🤸' },
  { id: 'weightlifting', label: 'Weightlifting', category: 'Sports', emoji: '🏋️' },
  { id: 'crossfit', label: 'CrossFit', category: 'Sports', emoji: '💪' },
  { id: 'rock-climbing', label: 'Rock Climbing', category: 'Sports', emoji: '🧗' },
  { id: 'hiking', label: 'Hiking', category: 'Sports', emoji: '🥾' },
  { id: 'camping', label: 'Camping', category: 'Sports', emoji: '⛺' },
  { id: 'skiing', label: 'Skiing', category: 'Sports', emoji: '⛷️' },
  { id: 'snowboarding', label: 'Snowboarding', category: 'Sports', emoji: '🏂' },
  { id: 'surfing', label: 'Surfing', category: 'Sports', emoji: '🏄' },
  { id: 'tennis', label: 'Tennis', category: 'Sports', emoji: '🎾' },
  { id: 'basketball', label: 'Basketball', category: 'Sports', emoji: '🏀' },
  { id: 'soccer', label: 'Soccer', category: 'Sports', emoji: '⚽' },
  { id: 'golf', label: 'Golf', category: 'Sports', emoji: '⛳' },
  { id: 'martial-arts', label: 'Martial Arts', category: 'Sports', emoji: '🥋' },
  { id: 'dance-fitness', label: 'Dance Fitness', category: 'Sports', emoji: '💃' },

  // Travel & Adventure
  { id: 'travel', label: 'Travel', category: 'Adventure', emoji: '✈️' },
  { id: 'backpacking', label: 'Backpacking', category: 'Adventure', emoji: '🎒' },
  { id: 'road-trips', label: 'Road Trips', category: 'Adventure', emoji: '🚗' },
  { id: 'cruises', label: 'Cruises', category: 'Adventure', emoji: '🚢' },
  { id: 'beach-vacations', label: 'Beach Vacations', category: 'Adventure', emoji: '🏖️' },
  { id: 'mountain-trips', label: 'Mountain Trips', category: 'Adventure', emoji: '🏔️' },
  { id: 'city-breaks', label: 'City Breaks', category: 'Adventure', emoji: '🏙️' },
  { id: 'cultural-travel', label: 'Cultural Travel', category: 'Adventure', emoji: '🏛️' },
  { id: 'food-travel', label: 'Food Travel', category: 'Adventure', emoji: '🍜' },
  { id: 'photography-travel', label: 'Photography Travel', category: 'Adventure', emoji: '📷' },
  { id: 'volunteer-travel', label: 'Volunteer Travel', category: 'Adventure', emoji: '🤝' },
  { id: 'solo-travel', label: 'Solo Travel', category: 'Adventure', emoji: '🧳' },

  // Arts & Creativity
  { id: 'painting', label: 'Painting', category: 'Arts', emoji: '🎨' },
  { id: 'drawing', label: 'Drawing', category: 'Arts', emoji: '✏️' },
  { id: 'photography', label: 'Photography', category: 'Arts', emoji: '📸' },
  { id: 'sculpture', label: 'Sculpture', category: 'Arts', emoji: '🗿' },
  { id: 'pottery', label: 'Pottery', category: 'Arts', emoji: '🏺' },
  { id: 'knitting', label: 'Knitting', category: 'Arts', emoji: '🧶' },
  { id: 'crochet', label: 'Crochet', category: 'Arts', emoji: '🪡' },
  { id: 'sewing', label: 'Sewing', category: 'Arts', emoji: '🧵' },
  { id: 'calligraphy', label: 'Calligraphy', category: 'Arts', emoji: '✒️' },
  { id: 'digital-art', label: 'Digital Art', category: 'Arts', emoji: '💻' },
  { id: 'graphic-design', label: 'Graphic Design', category: 'Arts', emoji: '🎯' },
  { id: 'interior-design', label: 'Interior Design', category: 'Arts', emoji: '🏠' },
  { id: 'fashion-design', label: 'Fashion Design', category: 'Arts', emoji: '👗' },
  { id: 'jewelry-making', label: 'Jewelry Making', category: 'Arts', emoji: '💍' },
  { id: 'woodworking', label: 'Woodworking', category: 'Arts', emoji: '🪚' },
  { id: 'glass-blowing', label: 'Glass Blowing', category: 'Arts', emoji: '🔥' },

  // Learning & Education
  { id: 'reading', label: 'Reading', category: 'Learning', emoji: '📚' },
  { id: 'writing', label: 'Writing', category: 'Learning', emoji: '✍️' },
  { id: 'poetry', label: 'Poetry', category: 'Learning', emoji: '📝' },
  { id: 'languages', label: 'Languages', category: 'Learning', emoji: '🗣️' },
  { id: 'history', label: 'History', category: 'Learning', emoji: '📜' },
  { id: 'science', label: 'Science', category: 'Learning', emoji: '🔬' },
  { id: 'philosophy', label: 'Philosophy', category: 'Learning', emoji: '🤔' },
  { id: 'psychology', label: 'Psychology', category: 'Learning', emoji: '🧠' },
  { id: 'astronomy', label: 'Astronomy', category: 'Learning', emoji: '🔭' },
  { id: 'archaeology', label: 'Archaeology', category: 'Learning', emoji: '🏺' },
  { id: 'genealogy', label: 'Genealogy', category: 'Learning', emoji: '👨‍👩‍👧‍👦' },
  { id: 'online-courses', label: 'Online Courses', category: 'Learning', emoji: '💻' },
  { id: 'workshops', label: 'Workshops', category: 'Learning', emoji: '🔧' },
  { id: 'lectures', label: 'Lectures', category: 'Learning', emoji: '🎓' },

  // Technology & Innovation
  { id: 'programming', label: 'Programming', category: 'Technology', emoji: '💻' },
  { id: 'ai-ml', label: 'AI & Machine Learning', category: 'Technology', emoji: '🤖' },
  { id: 'blockchain', label: 'Blockchain', category: 'Technology', emoji: '⛓️' },
  { id: 'cryptocurrency', label: 'Cryptocurrency', category: 'Technology', emoji: '₿' },
  { id: 'virtual-reality', label: 'Virtual Reality', category: 'Technology', emoji: '🥽' },
  { id: 'augmented-reality', label: 'Augmented Reality', category: 'Technology', emoji: '📱' },
  { id: 'robotics', label: 'Robotics', category: 'Technology', emoji: '🤖' },
  { id: 'drones', label: 'Drones', category: 'Technology', emoji: '🚁' },
  { id: '3d-printing', label: '3D Printing', category: 'Technology', emoji: '🖨️' },
  { id: 'smart-home', label: 'Smart Home', category: 'Technology', emoji: '🏠' },
  { id: 'cybersecurity', label: 'Cybersecurity', category: 'Technology', emoji: '🔒' },
  { id: 'data-science', label: 'Data Science', category: 'Technology', emoji: '📊' },
  { id: 'web-development', label: 'Web Development', category: 'Technology', emoji: '🌐' },
  { id: 'mobile-apps', label: 'Mobile Apps', category: 'Technology', emoji: '📱' },

  // Nature & Outdoors
  { id: 'gardening', label: 'Gardening', category: 'Nature', emoji: '🌱' },
  { id: 'bird-watching', label: 'Bird Watching', category: 'Nature', emoji: '🐦' },
  { id: 'wildlife', label: 'Wildlife', category: 'Nature', emoji: '🦁' },
  { id: 'marine-life', label: 'Marine Life', category: 'Nature', emoji: '🐠' },
  { id: 'forest-bathing', label: 'Forest Bathing', category: 'Nature', emoji: '🌲' },
  { id: 'stargazing', label: 'Stargazing', category: 'Nature', emoji: '⭐' },
  { id: 'weather', label: 'Weather', category: 'Nature', emoji: '🌤️' },
  { id: 'geology', label: 'Geology', category: 'Nature', emoji: '🪨' },
  { id: 'botany', label: 'Botany', category: 'Nature', emoji: '🌸' },
  { id: 'foraging', label: 'Foraging', category: 'Nature', emoji: '🍄' },
  { id: 'fishing', label: 'Fishing', category: 'Nature', emoji: '🎣' },
  { id: 'hunting', label: 'Hunting', category: 'Nature', emoji: '🏹' },
  { id: 'horseback-riding', label: 'Horseback Riding', category: 'Nature', emoji: '🐎' },

  // Social & Community
  { id: 'volunteering', label: 'Volunteering', category: 'Social', emoji: '🤝' },
  { id: 'community-service', label: 'Community Service', category: 'Social', emoji: '🏘️' },
  { id: 'activism', label: 'Activism', category: 'Social', emoji: '✊' },
  { id: 'environmentalism', label: 'Environmentalism', category: 'Social', emoji: '🌍' },
  { id: 'social-justice', label: 'Social Justice', category: 'Social', emoji: '⚖️' },
  { id: 'mentoring', label: 'Mentoring', category: 'Social', emoji: '👨‍🏫' },
  { id: 'networking', label: 'Networking', category: 'Social', emoji: '🤝' },
  { id: 'book-clubs', label: 'Book Clubs', category: 'Social', emoji: '📖' },
  { id: 'meetups', label: 'Meetups', category: 'Social', emoji: '👥' },
  { id: 'conferences', label: 'Conferences', category: 'Social', emoji: '🎤' },
  { id: 'workshops-social', label: 'Workshops', category: 'Social', emoji: '🔧' },
  { id: 'support-groups', label: 'Support Groups', category: 'Social', emoji: '💙' },

  // Health & Wellness
  { id: 'meditation', label: 'Meditation', category: 'Wellness', emoji: '🧘‍♀️' },
  { id: 'mindfulness', label: 'Mindfulness', category: 'Wellness', emoji: '🧠' },
  { id: 'spirituality', label: 'Spirituality', category: 'Wellness', emoji: '🕉️' },
  { id: 'yoga-wellness', label: 'Yoga', category: 'Wellness', emoji: '🧘' },
  { id: 'massage', label: 'Massage', category: 'Wellness', emoji: '💆' },
  { id: 'acupuncture', label: 'Acupuncture', category: 'Wellness', emoji: '🪡' },
  { id: 'herbal-medicine', label: 'Herbal Medicine', category: 'Wellness', emoji: '🌿' },
  { id: 'nutrition', label: 'Nutrition', category: 'Wellness', emoji: '🥗' },
  { id: 'fitness-wellness', label: 'Fitness', category: 'Wellness', emoji: '💪' },
  { id: 'mental-health', label: 'Mental Health', category: 'Wellness', emoji: '🧠' },
  { id: 'sleep-hygiene', label: 'Sleep Hygiene', category: 'Wellness', emoji: '😴' },
  { id: 'stress-management', label: 'Stress Management', category: 'Wellness', emoji: '😌' },
  { id: 'breathwork', label: 'Breathwork', category: 'Wellness', emoji: '🫁' },

  // Business & Finance
  { id: 'entrepreneurship', label: 'Entrepreneurship', category: 'Business', emoji: '💼' },
  { id: 'investing', label: 'Investing', category: 'Business', emoji: '📈' },
  { id: 'real-estate', label: 'Real Estate', category: 'Business', emoji: '🏠' },
  { id: 'stock-market', label: 'Stock Market', category: 'Business', emoji: '📊' },
  { id: 'personal-finance', label: 'Personal Finance', category: 'Business', emoji: '💰' },
  { id: 'budgeting', label: 'Budgeting', category: 'Business', emoji: '📋' },
  { id: 'side-hustles', label: 'Side Hustles', category: 'Business', emoji: '💡' },
  { id: 'freelancing', label: 'Freelancing', category: 'Business', emoji: '💻' },
  { id: 'consulting', label: 'Consulting', category: 'Business', emoji: '👔' },
  { id: 'marketing', label: 'Marketing', category: 'Business', emoji: '📢' },
  { id: 'sales', label: 'Sales', category: 'Business', emoji: '🤝' },
  { id: 'leadership', label: 'Leadership', category: 'Business', emoji: '👑' },
  { id: 'public-speaking', label: 'Public Speaking', category: 'Business', emoji: '🎤' },

  // Lifestyle & Personal
  { id: 'minimalism', label: 'Minimalism', category: 'Lifestyle', emoji: '🧹' },
  { id: 'sustainability', label: 'Sustainability', category: 'Lifestyle', emoji: '♻️' },
  { id: 'zero-waste', label: 'Zero Waste', category: 'Lifestyle', emoji: '🚫' },
  { id: 'veganism', label: 'Veganism', category: 'Lifestyle', emoji: '🌱' },
  { id: 'vegetarianism', label: 'Vegetarianism', category: 'Lifestyle', emoji: '🥬' },
  { id: 'keto', label: 'Keto', category: 'Lifestyle', emoji: '🥑' },
  { id: 'intermittent-fasting', label: 'Intermittent Fasting', category: 'Lifestyle', emoji: '⏰' },
  { id: 'paleo', label: 'Paleo', category: 'Lifestyle', emoji: '🥩' },
  { id: 'gluten-free', label: 'Gluten Free', category: 'Lifestyle', emoji: '🌾' },
  { id: 'organic-living', label: 'Organic Living', category: 'Lifestyle', emoji: '🌿' },
  { id: 'homesteading', label: 'Homesteading', category: 'Lifestyle', emoji: '🏡' },
  { id: 'tiny-houses', label: 'Tiny Houses', category: 'Lifestyle', emoji: '🏠' },
  { id: 'van-life', label: 'Van Life', category: 'Lifestyle', emoji: '🚐' },
  { id: 'digital-nomad', label: 'Digital Nomad', category: 'Lifestyle', emoji: '💻' },
  { id: 'slow-living', label: 'Slow Living', category: 'Lifestyle', emoji: '🐌' },

  // Collecting & Hobbies
  { id: 'stamp-collecting', label: 'Stamp Collecting', category: 'Collecting', emoji: '📮' },
  { id: 'coin-collecting', label: 'Coin Collecting', category: 'Collecting', emoji: '🪙' },
  { id: 'vinyl-records', label: 'Vinyl Records', category: 'Collecting', emoji: '💿' },
  { id: 'comic-books', label: 'Comic Books', category: 'Collecting', emoji: '📚' },
  { id: 'action-figures', label: 'Action Figures', category: 'Collecting', emoji: '🤖' },
  { id: 'model-trains', label: 'Model Trains', category: 'Collecting', emoji: '🚂' },
  { id: 'lego', label: 'LEGO', category: 'Collecting', emoji: '🧱' },
  { id: 'puzzles', label: 'Puzzles', category: 'Collecting', emoji: '🧩' },
  { id: 'magic-tricks', label: 'Magic Tricks', category: 'Collecting', emoji: '🎩' },
  { id: 'juggling', label: 'Juggling', category: 'Collecting', emoji: '🤹' },
  { id: 'origami', label: 'Origami', category: 'Collecting', emoji: '🦢' },
  { id: 'knot-tying', label: 'Knot Tying', category: 'Collecting', emoji: '🎗️' },
  { id: 'lock-picking', label: 'Lock Picking', category: 'Collecting', emoji: '🔓' },
  { id: 'escape-rooms', label: 'Escape Rooms', category: 'Collecting', emoji: '🚪' },

  // Pets & Animals
  { id: 'dogs', label: 'Dogs', category: 'Pets', emoji: '🐕' },
  { id: 'cats', label: 'Cats', category: 'Pets', emoji: '🐱' },
  { id: 'birds', label: 'Birds', category: 'Pets', emoji: '🦜' },
  { id: 'fish', label: 'Fish', category: 'Pets', emoji: '🐠' },
  { id: 'reptiles', label: 'Reptiles', category: 'Pets', emoji: '🦎' },
  { id: 'hamsters', label: 'Hamsters', category: 'Pets', emoji: '🐹' },
  { id: 'rabbits', label: 'Rabbits', category: 'Pets', emoji: '🐰' },
  { id: 'horses', label: 'Horses', category: 'Pets', emoji: '🐎' },
  { id: 'ferrets', label: 'Ferrets', category: 'Pets', emoji: '🦦' },
  { id: 'guinea-pigs', label: 'Guinea Pigs', category: 'Pets', emoji: '🐹' },
  { id: 'pet-training', label: 'Pet Training', category: 'Pets', emoji: '🎾' },
  { id: 'pet-grooming', label: 'Pet Grooming', category: 'Pets', emoji: '✂️' },
  { id: 'pet-photography', label: 'Pet Photography', category: 'Pets', emoji: '📸' },
  { id: 'animal-rescue', label: 'Animal Rescue', category: 'Pets', emoji: '🆘' },

  // Seasonal & Events
  { id: 'christmas', label: 'Christmas', category: 'Seasonal', emoji: '🎄' },
  { id: 'halloween', label: 'Halloween', category: 'Seasonal', emoji: '🎃' },
  { id: 'easter', label: 'Easter', category: 'Seasonal', emoji: '🐰' },
  { id: 'valentines', label: 'Valentine\'s Day', category: 'Seasonal', emoji: '💝' },
  { id: 'birthdays', label: 'Birthdays', category: 'Seasonal', emoji: '🎂' },
  { id: 'weddings', label: 'Weddings', category: 'Seasonal', emoji: '💒' },
  { id: 'baby-showers', label: 'Baby Showers', category: 'Seasonal', emoji: '👶' },
  { id: 'graduations', label: 'Graduations', category: 'Seasonal', emoji: '🎓' },
  { id: 'holiday-decorating', label: 'Holiday Decorating', category: 'Seasonal', emoji: '🎨' },
  { id: 'party-planning', label: 'Party Planning', category: 'Seasonal', emoji: '🎉' },
  { id: 'event-planning', label: 'Event Planning', category: 'Seasonal', emoji: '📅' },
  { id: 'costume-design', label: 'Costume Design', category: 'Seasonal', emoji: '👗' },
  { id: 'gift-giving', label: 'Gift Giving', category: 'Seasonal', emoji: '🎁' },
  { id: 'holiday-traditions', label: 'Holiday Traditions', category: 'Seasonal', emoji: '🏮' }
];

export const interestCategories = [
  'Entertainment',
  'Food',
  'Sports',
  'Adventure',
  'Arts',
  'Learning',
  'Technology',
  'Nature',
  'Social',
  'Wellness',
  'Business',
  'Lifestyle',
  'Collecting',
  'Pets',
  'Seasonal'
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
