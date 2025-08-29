"use client";
import { Heart, ArrowRight, Calendar, Clock, Music, MessageSquare, MapPin, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home(){ 
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-20 pt-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Bridge2Us
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Stay connected with your partner across time zones. Countdown to meetups, sync calendars, and bridge the distance together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/signup')}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => router.push('/auth/signin')}
              className="flex items-center justify-center gap-2 bg-gray-800 text-white px-8 py-4 rounded-lg text-lg font-semibold border-2 border-gray-700 hover:bg-gray-700 transition-all duration-200"
            >
              Sign In
            </button>
          </div>
          

        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything you need to stay connected
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              From real-time location sharing to collaborative playlists, Bridge2Us provides everything you need to maintain a strong connection across any distance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Calendar Sync */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-pink-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Smart Calendar Sync
              </h3>
              <p className="text-gray-300 mb-4">
                Import Google, Apple, and Outlook calendars to coordinate your schedules and never miss important moments together.
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Automatic timezone conversion</li>
                <li>• Shared event planning</li>
                <li>• Conflict detection</li>
              </ul>
            </div>

            {/* Feature 2: Timezone Management */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Timezone Bridge
              </h3>
              <p className="text-gray-300 mb-4">
                See both your times at a glance and plan activities across time zones with our intelligent scheduling system.
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Real-time timezone display</li>
                <li>• Best time to call suggestions</li>
                <li>• Sunrise/sunset tracking</li>
              </ul>
            </div>

            {/* Feature 3: Spotify Integration */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <Music className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Shared Music Experience
              </h3>
              <p className="text-gray-300 mb-4">
                Connect your Spotify accounts to share playlists, see what you&apos;re both listening to, and create shared musical memories.
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Collaborative playlists</li>
                <li>• Real-time listening status</li>
                <li>• Music mood sharing</li>
              </ul>
            </div>

            {/* Feature 4: Shared Journal */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-pink-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Shared Journal
              </h3>
              <p className="text-gray-300 mb-4">
                Write together, share daily thoughts, and keep your memories safe in a private, shared digital space.
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Private shared writing space</li>
                <li>• Photo and memory sharing</li>
                <li>• Mood and thought tracking</li>
              </ul>
            </div>

            {/* Feature 5: Meetup Planning */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-orange-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Meetup Countdown
              </h3>
              <p className="text-gray-300 mb-4">
                Countdown to your next meetup and plan future visits together with location sharing and travel coordination.
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Real-time countdown timer</li>
                <li>• Location sharing</li>
                <li>• Travel planning tools</li>
              </ul>
            </div>

            {/* Feature 6: Community */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-indigo-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Long-Distance Community
              </h3>
              <p className="text-gray-300 mb-4">
                Connect with other long-distance couples, share tips, and find support from people who understand your journey.
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Private couple spaces</li>
                <li>• Community forums</li>
                <li>• Success stories</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl p-8 border border-pink-500/20 mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to bridge the distance?
          </h2>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of couples who are staying connected across the miles. Start your journey today and never feel far apart again.
          </p>
          <button
            onClick={() => router.push('/signup')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-700 pt-8 pb-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Heart className="w-6 h-6 text-pink-500" />
              <span className="text-white font-semibold text-lg">Bridge2Us</span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-6 text-sm">
              <div className="flex items-center gap-6">
                <a 
                  href="/terms" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
                <a 
                  href="/privacy" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </div>
              
              <div className="text-gray-500 text-xs">
                © 2024 Bridge2Us. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
