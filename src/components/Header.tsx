"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Heart, Menu, X, User, LogOut, Coins } from "lucide-react";
import { getTokenBalance, TokenBalance } from "@/lib/tokens";

interface HeaderProps {
  isAuthenticated?: boolean;
  userName?: string;
}

export default function Header({ isAuthenticated = false, userName }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authStatus, setAuthStatus] = useState({ isAuthenticated: false, userName: '', userId: '' });
  const [tokenBalance, setTokenBalance] = useState<TokenBalance | null>(null);


  // Check authentication status on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setAuthStatus({
        isAuthenticated: true,
        userName: `${userData.firstName} ${userData.lastName}`,
        userId: userData.id || 'local-user'
      });
    }
  }, []);

  // Load token balance when we have a user id
  useEffect(() => {
    if (authStatus.userId) {
      try {
        const bal = getTokenBalance(authStatus.userId);
        setTokenBalance(bal);
      } catch {}
    }
  }, [authStatus.userId]);

  // Use props if provided, otherwise use local state
  const isAuth = isAuthenticated || authStatus.isAuthenticated;
  const displayName = userName || authStatus.userName;

  const handleSignOut = async () => {
    // Clear any stored auth data
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    // Sign out from NextAuth
    await signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-pink-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Bridge2Us
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isAuth ? (
              <>
                <Link 
                  href="/" 
                  className="text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/calendar" 
                  className="text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
                >
                  Calendar
                </Link>

                <Link 
                  href="/meetups" 
                  className="text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
                >
                  Meetups
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/" 
                  className="text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
                >
                  Home
                </Link>
                <Link 
                  href="#features" 
                  className="text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
                >
                  Features
                </Link>
              </>
            )}
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuth ? (
              <div className="flex items-center space-x-4">
                {tokenBalance && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{tokenBalance.balance}</span>
                    <button
                      className="text-xs font-medium text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300"
                      onClick={() => alert('Purchase flow coming soon')}
                    >
                      Buy more
                    </button>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {displayName || 'User'}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAuth ? (
                <>
                  <Link
                    href="/"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/calendar"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Calendar
                  </Link>

                  <Link
                    href="/meetups"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meetups
                  </Link>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                    <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                      {displayName || 'User'}
                    </div>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="#features"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Features
                  </Link>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                    <Link
                      href="/auth/signin"
                      className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
