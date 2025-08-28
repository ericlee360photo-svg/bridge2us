"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart, ArrowRight, Calendar, Clock, AlertTriangle } from "lucide-react";

export default function HomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for authenticated session first
    if (status === "authenticated" && session?.user) {
      // Store user data in localStorage for our app
      const extendedUser = session.user as any; // Type assertion for extended user properties
      const userData = {
        id: extendedUser.id || 'temp-id',
        firstName: extendedUser.firstName || session.user.name?.split(' ')[0] || '',
        lastName: extendedUser.lastName || session.user.name?.split(' ').slice(1).join(' ') || '',
        email: session.user.email || '',
        avatar: extendedUser.avatar || session.user.image || '',
        timezone: extendedUser.timezone || "UTC",
        country: extendedUser.country || '',
        language: extendedUser.language || ''
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Redirect to dashboard
      router.push('/dashboard');
      return;
    }
    
    // Check for user in localStorage (demo/development)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // If user exists and there's no specific redirect, go to dashboard
        if (!searchParams?.get('redirect')) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setIsLoading(false);
  }, [router, searchParams, session, status]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Hero Section */}
        <div className="mb-12">
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
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Sync Calendars
            </h3>
            <p className="text-gray-300">
              Import Google, Apple, and Outlook calendars to coordinate your schedules.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Timezone Management
            </h3>
            <p className="text-gray-300">
              See both your times at a glance and plan activities across time zones.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Meetup Planning
            </h3>
            <p className="text-gray-300">
              Countdown to your next meetup and plan future visits together.
            </p>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to bridge the distance?
          </h2>
          <p className="text-gray-300 mb-6">
            Join thousands of couples staying connected across the miles.
          </p>
          <button
            onClick={() => router.push('/signup')}
            className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
          >
            Start Your Journey
          </button>
        </div>
      </div>
    </div>
  );
}
