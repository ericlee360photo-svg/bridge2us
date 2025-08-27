"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, ArrowRight, Calendar, Clock, AlertTriangle } from "lucide-react";

function LandingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showBurnedMessage, setShowBurnedMessage] = useState(false);

  useEffect(() => {
    // Check if user was redirected after burning the bridge
    const burned = searchParams?.get('burned');
    if (burned === 'true') {
      setShowBurnedMessage(true);
    }

    // Check if user is already authenticated
    const user = localStorage.getItem('user');
    if (user) {
      router.push('/dashboard');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Burned Bridge Notification */}
        {showBurnedMessage && (
          <div className="mb-8 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">
                Bridge Burned
              </h3>
            </div>
            <p className="text-red-600 dark:text-red-400">
              Your partner has burned the bridge. Their account has been permanently deleted.
            </p>
            <button 
              onClick={() => setShowBurnedMessage(false)}
              className="mt-3 text-sm text-red-600 dark:text-red-400 underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Bridge2Us
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
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
              className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-lg text-lg font-semibold border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Sync Calendars
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Import Google, Apple, and Outlook calendars to coordinate your schedules.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Timezone Management
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              See both your times at a glance and plan activities across time zones.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Meetup Planning
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Countdown to your next meetup and plan future visits together.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to bridge the distance?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Join thousands of couples staying connected across the miles.
          </p>
          <button
            onClick={() => router.push('/signup')}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
          >
            Start Your Journey
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LandingPageContent />
    </Suspense>
  );
}
