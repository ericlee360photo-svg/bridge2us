"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, ArrowRight } from "lucide-react";

interface ExtendedUser {
  id?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  timezone?: string;
  country?: string;
  language?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export default function SignInPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already signed in
    if (status === "authenticated" && session?.user) {
      // Store user data in localStorage for our app
      const extendedUser = session.user as ExtendedUser;
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
      router.push("/dashboard");
    }
  }, [session, status, router]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      console.log("Starting Google sign in...");
      const result = await signIn("google", { callbackUrl: "/dashboard" });
      console.log("Sign in result:", result);
      if (result?.error) {
        console.error("Sign in error:", result.error);
        alert(`Sign in failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      alert(`Sign in error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-pink-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white ml-3">
              bridge2us
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Sign in to connect with your partner
          </p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <div className="space-y-6">
            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-xl border border-gray-300 dark:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 dark:border-white"></div>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              {isLoading ? "Signing in..." : "Continue with Google"}
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  or
                </span>
              </div>
            </div>

            {/* Demo Sign In Button */}
            <button
              onClick={() => {
                // Demo sign in for testing
                const demoUser = {
                  id: 'demo-user-1',
                  firstName: 'Demo',
                  lastName: 'User',
                  email: 'demo@example.com',
                  avatar: '',
                  timezone: 'UTC',
                  country: 'US',
                  language: 'en'
                };
                localStorage.setItem('user', JSON.stringify(demoUser));
                router.push('/');
              }}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium py-3 px-4 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-colors"
            >
              Demo Sign In (for testing)
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  New to bridge2us?
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <button
                onClick={() => router.push("/signup")}
                className="text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 font-medium"
              >
                Create an account
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            By signing in, you agree to our{" "}
            <a href="#" className="text-pink-600 hover:text-pink-700 dark:text-pink-400">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-pink-600 hover:text-pink-700 dark:text-pink-400">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
