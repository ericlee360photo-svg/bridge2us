import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features - Bridge2Us",
  description: "Discover powerful features designed for long-distance relationships. From Spotify connectivity and shared journaling to secret messages and smart scheduling - everything you need to stay connected.",
  keywords: [
    "long distance relationship features",
    "couples app features",
    "Spotify integration",
    "shared journaling",
    "secret messages",
    "calendar sync",
    "relationship tools",
    "couple communication features"
  ],
  openGraph: {
    title: "Features - Bridge2Us",
    description: "Discover powerful features designed for long-distance relationships. From Spotify connectivity and shared journaling to secret messages and smart scheduling.",
    url: "https://www.bridge2us.app/features",
    siteName: "Bridge2Us",
    images: [
      {
        url: "https://www.bridge2us.app/features-og-image.png",
        width: 1200,
        height: 630,
        alt: "Bridge2Us Features - Long Distance Relationship Tools",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Features - Bridge2Us",
    description: "Discover powerful features designed for long-distance relationships. From Spotify connectivity and shared journaling to secret messages and smart scheduling.",
    images: ["https://www.bridge2us.app/features-twitter-image.png"],
  },
  alternates: {
    canonical: "https://www.bridge2us.app/features",
  },
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-gray-100 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section with Dashboard Screenshot */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Bridge2Us Features
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the power of staying connected across any distance with our comprehensive suite of tools designed for long-distance relationships.
            </p>
          </div>
          
          {/* Dashboard Screenshot */}
          <div className="relative max-w-5xl mx-auto mb-12">
            <div className="bg-gray-800 rounded-2xl p-4 shadow-2xl border border-gray-700">
              <div className="bg-gray-900 rounded-xl overflow-hidden">
                {/* Mock Dashboard Header */}
                <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">❤</span>
                    </div>
                    <span className="text-white font-semibold">Bridge2Us</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-300">Home</span>
                    <span className="text-gray-300">Features</span>
                    <span className="text-gray-300">Sign In</span>
                    <span className="text-gray-300">Sign Up</span>
                  </div>
                </div>
                
                {/* Main Dashboard Content */}
                <div className="p-6">
                  {/* World Map Section */}
                  <div className="bg-gray-950 rounded-xl p-6 mb-6 relative">
                    <div className="flex justify-between items-start mb-4">
                      <button className="text-gray-400 text-sm">Colors</button>
                      <div className="text-center">
                        <div className="text-2xl font-mono text-blue-400 mb-1">14.23.59.28</div>
                        <div className="text-xs text-gray-400">D H M S</div>
                      </div>
                      <button className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm">Set Current Location</button>
                    </div>
                    
                    {/* World Map Grid */}
                    <div className="bg-gray-900 rounded-lg p-4 relative h-64 flex items-center justify-center">
                      <div className="grid grid-cols-12 gap-1 opacity-20">
                        {Array.from({ length: 120 }).map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
                        ))}
                      </div>
                      
                      {/* Location Markers */}
                      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"></div>
                      <div className="absolute top-1/4 left-1/4 -mt-2 -ml-2 text-xs text-yellow-400">You</div>
                      
                      <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                      <div className="absolute top-1/3 right-1/4 -mt-2 -ml-2 text-xs text-green-400">miPartner</div>
                      
                      {/* Connection Line */}
                      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                        <path
                          d="M 25% 25% Q 50% 15% 75% 33%"
                          stroke="url(#gradient)"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray="5,5"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ec4899" />
                            <stop offset="100%" stopColor="#60a5fa" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    
                    {/* Distance and Times */}
                    <div className="text-center mb-4">
                      <div className="text-blue-400 font-semibold">DISTANCE</div>
                      <div className="text-2xl font-bold text-blue-400">2,566 mi</div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <div>
                        <div className="text-gray-300">My Time</div>
                        <div className="font-semibold">12:17 AM</div>
                        <div className="text-gray-400">Aug 28, 2025</div>
                        <div className="text-gray-400">Home Location</div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-300">Alex&apos;s Time</div>
                        <div className="font-semibold">04:17 PM</div>
                        <div className="text-gray-400">Aug 27, 2025</div>
                        <div className="text-gray-400">New York, USA</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Daily Tasks Section */}
                  <div className="bg-gray-800 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Daily Tasks</h3>
                      <div className="text-right">
                        <div className="text-sm text-gray-300">30 total tokens</div>
                        <div className="text-xs text-gray-400">0 / 5 completed</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">Complete tasks to earn 10 tokens each.</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Y</div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Your Progress</span>
                            <span>0%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Alex&apos;s Progress</span>
                            <span>60%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-pink-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">3 / 5 completed</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-4 text-xs">
                      <span className="text-green-400">✓ 20%</span>
                      <span className="text-green-400">✓ 40%</span>
                      <span className="text-green-400">✓ 60%</span>
                      <span className="text-gray-400">80%</span>
                      <span className="text-yellow-400">● 100%</span>
                    </div>
                  </div>
                  
                  {/* Bottom Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Alex's Profile */}
                    <div className="bg-gray-800 rounded-xl p-4">
                      <h3 className="font-semibold mb-3">Alex&apos;s Profile</h3>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                        <div>
                          <div className="font-semibold">Alex Smith</div>
                          <div className="text-sm text-gray-400">New York, NY</div>
                          <div className="text-sm text-gray-400">America/New_York</div>
                        </div>
                        <div className="ml-auto text-right">
                          <div className="text-green-400 text-sm">Status: Online</div>
                          <div className="text-xs text-gray-400">Last Seen: 2 min ago</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-700 rounded-lg p-3 mb-3">
                        <div className="text-sm mb-1">Current Weather</div>
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold">77°F</div>
                          <div className="text-sm text-gray-400">H: 35% | W: 12 mph</div>
                        </div>
                      </div>
                      
                      <div className="bg-red-500 text-white text-xs px-3 py-1 rounded-full inline-flex items-center">
                        <span>N 1 Issue</span>
                        <span className="ml-2">×</span>
                      </div>
                    </div>
                    
                    {/* Shared Journal */}
                    <div className="bg-gray-800 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold">Shared Journal</h3>
                        <div className="flex space-x-2">
                          <button className="text-xs bg-gray-700 px-2 py-1 rounded">Show Journal</button>
                          <button className="text-xs bg-gray-700 px-2 py-1 rounded">Demo Data</button>
                          <button className="text-xs bg-gray-700 px-2 py-1 rounded">Clear</button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {['Happy', 'Excited', 'Loved', 'Missing You', 'Grateful', 'Hopeful', 'Lonely', 'Neutral', 'Sad', 'Anxious'].map((mood, i) => (
                          <span key={mood} className={`text-xs px-2 py-1 rounded ${mood === 'Neutral' ? 'bg-pink-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                            {mood}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-sm mb-2">Journal Prompt</div>
                        <button className="text-xs bg-gray-700 px-2 py-1 rounded">Show Prompts</button>
                      </div>
                      
                      <textarea 
                        className="w-full bg-gray-700 rounded-lg p-3 text-sm resize-none" 
                        rows={3}
                        placeholder="Share your thoughts, feelings, or experiences..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <header className="mb-10">
          <h2 className="text-3xl font-bold text-center mb-4">Powerful Features for Every Couple</h2>
          <p className="text-gray-300 text-center max-w-2xl mx-auto">
            From real-time location sharing to collaborative playlists, Bridge2Us provides everything you need to maintain a strong connection across any distance.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Spotify Connectivity */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-6 shadow-lg">
            <div className="text-pink-400 text-sm font-semibold mb-2">Spotify Connectivity</div>
            <h2 className="text-xl font-semibold mb-2">Listen together, discover together</h2>
            <p className="text-gray-300 mb-4">
              Connect your Spotify accounts to share what you&apos;re listening to, build joint playlists,
              and discover new music together in real-time.
            </p>
            <ul className="text-gray-300 list-disc pl-5 space-y-1">
              <li>Live activity: see what your partner is playing</li>
              <li>Collaborative playlists for any mood</li>
              <li>Weekly &quot;Bridge Mix&quot; recommendations</li>
            </ul>
          </div>

          {/* Shared Journaling */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-6 shadow-lg">
            <div className="text-pink-400 text-sm font-semibold mb-2">Shared Journaling</div>
            <h2 className="text-xl font-semibold mb-2">Reflect and grow together</h2>
            <p className="text-gray-300 mb-4">
              Write daily entries, respond to prompts, and see how you both feel. Keep a private
              timeline of your journey—only visible to the two of you.
            </p>
            <ul className="text-gray-300 list-disc pl-5 space-y-1">
              <li>Mood check-ins with quick reactions</li>
              <li>Prompt library to spark conversations</li>
              <li>Exports for anniversaries and memory books</li>
            </ul>
          </div>

          {/* Secret Messages */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-6 shadow-lg">
            <div className="text-pink-400 text-sm font-semibold mb-2">Secret Messages</div>
            <h2 className="text-xl font-semibold mb-2">Whisper across time zones</h2>
            <p className="text-gray-300 mb-4">
              Send timed or hidden notes that unlock at the right moment—birthdays, countdowns,
              or just a surprise &quot;I love you&quot; when they wake up.
            </p>
            <ul className="text-gray-300 list-disc pl-5 space-y-1">
              <li>Unlock by date, location, or milestone</li>
              <li>Emoji reactions and keepsake archive</li>
              <li>Optional passcode for extra privacy</li>
            </ul>
          </div>

          {/* Shared Scheduling */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-6 shadow-lg">
            <div className="text-pink-400 text-sm font-semibold mb-2">Shared Scheduling</div>
            <h2 className="text-xl font-semibold mb-2">Plan across time zones</h2>
            <p className="text-gray-300 mb-4">
              See both of your local times, find overlap windows, and sync calendars to make
              calls, dates, and meetups effortless.
            </p>
            <ul className="text-gray-300 list-disc pl-5 space-y-1">
              <li>Two‑time view with overlap highlights</li>
              <li>Google, Apple, and Outlook calendar sync</li>
              <li>Countdowns to the next meetup</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <a href="/signup" className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:from-pink-600 hover:to-purple-700 transition-colors">
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}
