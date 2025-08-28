"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Heart, ArrowRight, ArrowLeft, Mail, Lock, User, MapPin, Calendar, ExternalLink, Copy } from "lucide-react";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import { DataStorage } from "@/lib/storage";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import UsualWeekWizard from "@/weekscheduler/UsualWeekWizard";
import "@/sharedschedule/schedule.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Bridge2Us",
  description: "Create your Bridge2Us account and start your long-distance relationship journey. Set up your profile, schedule, and connect with your partner.",
  keywords: [
    "sign up",
    "create account",
    "long distance relationship app",
    "couples app registration",
    "relationship app signup"
  ],
  openGraph: {
    title: "Sign Up - Bridge2Us",
    description: "Create your Bridge2Us account and start your long-distance relationship journey. Set up your profile, schedule, and connect with your partner.",
    url: "https://www.bridge2us.app/signup",
    siteName: "Bridge2Us",
    images: [
      {
        url: "https://www.bridge2us.app/signup-og-image.png",
        width: 1200,
        height: 630,
        alt: "Bridge2Us Sign Up - Create Your Account",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Up - Bridge2Us",
    description: "Create your Bridge2Us account and start your long-distance relationship journey. Set up your profile, schedule, and connect with your partner.",
    images: ["https://www.bridge2us.app/signup-twitter-image.png"],
  },
  alternates: {
    canonical: "https://www.bridge2us.app/signup",
  },
};

interface SignupData {
  // Step 1: Basic Info
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  
  // Step 2: Profile Details
  birthday: string;
  address: string;
  city: string;
  state: string;
  country: string;
  isAddressPublic: boolean;
  avatar?: string;
  timezone?: string;
  language?: string;
  
  // Step 3: Usual Week Schedule
  usualWeekCompleted: boolean;
  
  // Step 4: Relationship
  relationshipType: string;
  howLongTogether: string;
  communicationStyle: string;
  loveLanguages: string;
  futurePlans: string;
  partnerEmail: string;
  
  // Step 5: Preferences
  timeFormat: string; // "12h" or "24h"
  measurementSystem: string; // "metric" or "imperial"
  temperatureUnit: string; // "C" or "F"
  distanceUnit: string; // "km" or "mi"
  
  // Terms Agreement
  agreeToTerms: boolean;
  
  // Partner Invitation
  inviteMethod: 'url' | 'email';
  partnerInviteEmail: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [inviteUrlCopied, setInviteUrlCopied] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [signupData, setSignupData] = useState<SignupData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    birthday: "",
    address: "",
    city: "",
    state: "",
    country: "",
    isAddressPublic: false,
    avatar: "",
    usualWeekCompleted: false,
    relationshipType: "",
    howLongTogether: "",
    communicationStyle: "",
    loveLanguages: "",
    futurePlans: "",
    partnerEmail: "",
    timeFormat: "12h",
    measurementSystem: "imperial",
    temperatureUnit: "F",
    agreeToTerms: false,
    distanceUnit: "mi",
    inviteMethod: "url",
    partnerInviteEmail: ""
  });

  const updateField = (field: keyof SignupData, value: string | boolean) => {
    setSignupData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', 'temp-user-id'); // Will be updated after user creation

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        updateField('avatar', result.url);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Upload failed:', errorData);
        alert(`Upload failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: Network error. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarRemove = () => {
    updateField('avatar', '');
  };

  const handleGoogleSignUp = async () => {
    try {
      // Redirect to signin page with a special parameter to indicate signup flow
      await signIn("google", { callbackUrl: "/auth/signin?signup=true" });
    } catch (error) {
      console.error("Sign up error:", error);
    }
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleUsualWeekComplete = () => {
    updateField('usualWeekCompleted', true);
    nextStep();
  };

  const handleCreateAccount = async () => {
    // Validate terms agreement
    if (!signupData.agreeToTerms) {
      alert('You must agree to the Terms of Use to create an account.');
      return;
    }

    if (!signupData.email || !signupData.password) {
      alert('Email and password are required.');
      return;
    }

    try {
      // Create Supabase auth user with email/password
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            first_name: signupData.firstName,
            last_name: signupData.lastName,
          }
        }
      });

      if (error) {
        console.error('Supabase signup error:', error);
        alert(error.message || 'Signup failed');
        return;
      }

      const supaUserId = data.user?.id || null;
      if (supaUserId) {
        setUserId(supaUserId);
      }

      // Store minimal user locally for UX continuity
      const userData = {
        id: supaUserId || 'pending-verification',
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
        avatar: signupData.avatar,
        timezone: signupData.timezone || "UTC",
        country: signupData.country,
        language: signupData.language
      };
      await DataStorage.setUser(userData);

      // Inform user to check email if confirmation is enabled
      alert('Account created. Please check your email to confirm your address before signing in.');

      // Proceed to invitation step (optional) or navigate to signin
      nextStep();
      // Alternatively redirect to sign-in page:
      // router.push('/auth/signin');
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during signup');
    }
  };

  const handleFinishSignup = () => {
    // Redirect to dashboard after partner invitation
    router.push('/dashboard');
  };

  const copyInviteUrl = () => {
    if (userId) {
      const inviteUrl = `${window.location.origin}/signup?invite=${userId}`;
      navigator.clipboard.writeText(inviteUrl);
      setInviteUrlCopied(true);
      setTimeout(() => setInviteUrlCopied(false), 3000);
    }
  };

  const sendEmailInvite = async () => {
    if (!signupData.partnerInviteEmail || !userId) return;
    
    try {
      const response = await fetch('/api/invite/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          partnerEmail: signupData.partnerInviteEmail,
          senderName: `${signupData.firstName} ${signupData.lastName}`
        }),
      });

      if (response.ok) {
        alert('Invitation email sent successfully!');
      } else {
        alert('Failed to send invitation email. You can copy the link instead.');
      }
    } catch (error) {
      console.error('Email invite error:', error);
      alert('Failed to send invitation email. You can copy the link instead.');
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Create Your Account</h2>
      <p className="text-gray-600 dark:text-gray-300">Let&apos;s start with your basic information</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={signupData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="password"
              value={signupData.password}
              onChange={(e) => updateField('password', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Create a strong password"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={signupData.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="First name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={signupData.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Last name"
                required
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Profile Details</h2>
      <p className="text-gray-600 dark:text-gray-300">Tell us a bit more about yourself</p>
      
      {/* Profile Picture Upload */}
      <ProfilePictureUpload
        currentAvatar={signupData.avatar}
        onUpload={handleAvatarUpload}
        onRemove={handleAvatarRemove}
        isLoading={isUploading}
      />
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Birthday
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={signupData.birthday}
              onChange={(e) => updateField('birthday', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Street Address (Optional)
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={signupData.address}
              onChange={(e) => updateField('address', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="123 Main St"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              City
            </label>
            <input
              type="text"
              value={signupData.city}
              onChange={(e) => updateField('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="City"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              State/Province
            </label>
            <input
              type="text"
              value={signupData.state}
              onChange={(e) => updateField('state', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="State"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Country
            </label>
            <input
              type="text"
              value={signupData.country}
              onChange={(e) => updateField('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Country"
            />
          </div>
        </div>

        <div className="mt-2 flex items-center">
          <input
            type="checkbox"
            id="addressPublic"
            checked={signupData.isAddressPublic}
            onChange={(e) => updateField('isAddressPublic', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="addressPublic" className="text-sm text-gray-600 dark:text-gray-300">
            Share my address with my partner
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Weekly Schedule</h2>
      <p className="text-gray-600 dark:text-gray-300">Set up your usual weekly schedule. You can adjust this later.</p>
      
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          This will be your default schedule template. You can modify individual weeks as needed.
        </p>
      </div>
      
      {/* Usual Week Wizard */}
      <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
        <UsualWeekWizard
          userId={userId || 'temp-user-id'}
          tz={signupData.timezone || 'UTC'}
          onComplete={handleUsualWeekComplete}
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Relationship Details</h2>
      <p className="text-gray-600 dark:text-gray-300">Tell us about your relationship</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Relationship Type
          </label>
          <select
            value={signupData.relationshipType}
            onChange={(e) => updateField('relationshipType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">Select relationship type</option>
            <option value="Dating">Dating</option>
            <option value="Engaged">Engaged</option>
            <option value="Married">Married</option>
            <option value="Long-term">Long-term</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            How long have you been together?
          </label>
          <select
            value={signupData.howLongTogether}
            onChange={(e) => updateField('howLongTogether', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">Select duration</option>
            <option value="Less than 6 months">Less than 6 months</option>
            <option value="6-12 months">6-12 months</option>
            <option value="1-2 years">1-2 years</option>
            <option value="2-5 years">2-5 years</option>
            <option value="5+ years">5+ years</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Communication Style
          </label>
          <select
            value={signupData.communicationStyle}
            onChange={(e) => updateField('communicationStyle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">Select communication style</option>
            <option value="Daily calls">Daily calls</option>
            <option value="Text often">Text often</option>
            
            <option value="Mix of everything">Mix of everything</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Love Languages
          </label>
          <select
            value={signupData.loveLanguages}
            onChange={(e) => updateField('loveLanguages', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">Select love language</option>
            <option value="Words of affirmation">Words of affirmation</option>
            <option value="Quality time">Quality time</option>
            <option value="Physical touch">Physical touch</option>
            <option value="Acts of service">Acts of service</option>
            <option value="Receiving gifts">Receiving gifts</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Future Plans
          </label>
          <select
            value={signupData.futurePlans}
            onChange={(e) => updateField('futurePlans', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">Select future plans</option>
            <option value="Moving in together">Moving in together</option>
            <option value="Getting engaged">Getting engaged</option>
            <option value="Getting married">Getting married</option>
            <option value="Having children">Having children</option>
            <option value="Taking it day by day">Taking it day by day</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Your Preferences</h2>
      <p className="text-gray-600 dark:text-gray-300">Customize your experience with these settings</p>
      
      <div className="space-y-4">
        {/* Time Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Time Format
          </label>
          <select
            value={signupData.timeFormat}
            onChange={(e) => updateField('timeFormat', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="12h">12-hour (AM/PM)</option>
            <option value="24h">24-hour</option>
          </select>
        </div>

        {/* Temperature Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Temperature Unit
          </label>
          <select
            value={signupData.temperatureUnit}
            onChange={(e) => updateField('temperatureUnit', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="F">Fahrenheit (°F)</option>
            <option value="C">Celsius (°C)</option>
          </select>
        </div>

        {/* Measurement System */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Measurement System
          </label>
          <select
            value={signupData.measurementSystem}
            onChange={(e) => updateField('measurementSystem', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="imperial">Imperial (miles, pounds, etc.)</option>
            <option value="metric">Metric (kilometers, kilograms, etc.)</option>
          </select>
        </div>

        {/* Distance Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Distance Unit
          </label>
          <select
            value={signupData.distanceUnit}
            onChange={(e) => updateField('distanceUnit', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="mi">Miles</option>
            <option value="km">Kilometers</option>
          </select>
        </div>

        {/* Terms of Use Agreement */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={signupData.agreeToTerms}
              onChange={(e) => updateField('agreeToTerms', e.target.checked)}
              className="mt-1 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="agreeToTerms" className="text-sm text-gray-700 dark:text-gray-300">
              I agree to the{' '}
              <Link 
                href="/terms" 
                target="_blank"
                className="text-pink-600 hover:text-pink-500 underline inline-flex items-center gap-1"
              >
                Terms of Use
                <ExternalLink className="w-3 h-3" />
              </Link>
              {' '}and acknowledge that I have read and understood them.
            </label>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-7">
            By checking this box, you agree to be bound by our terms and conditions.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> These preferences will be applied throughout your dashboard. 
            You can change them later in your settings.
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Invite Your Partner</h2>
      <p className="text-gray-600 dark:text-gray-300">Connect with your partner to start your journey together</p>
      
      <div className="space-y-4">
        {/* Invitation Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            How would you like to invite your partner?
          </label>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <input
                type="radio"
                name="inviteMethod"
                value="url"
                checked={signupData.inviteMethod === 'url'}
                onChange={(e) => updateField('inviteMethod', e.target.value)}
                className="text-pink-600 focus:ring-pink-500"
              />
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-200">Copy Invite Link</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Get a shareable link to send to your partner</div>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <input
                type="radio"
                name="inviteMethod"
                value="email"
                checked={signupData.inviteMethod === 'email'}
                onChange={(e) => updateField('inviteMethod', e.target.value)}
                className="text-pink-600 focus:ring-pink-500"
              />
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-200">Send Email Invitation</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">We&apos;ll send an invitation email to your partner</div>
              </div>
            </label>
          </div>
        </div>

        {/* URL Copy Section */}
        {signupData.inviteMethod === 'url' && userId && (
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Invite Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/signup?invite=${userId}`}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
              />
              <button
                onClick={copyInviteUrl}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  inviteUrlCopied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-pink-500 hover:bg-pink-600 text-white'
                }`}
              >
                {inviteUrlCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {/* Email Input Section */}
        {signupData.inviteMethod === 'email' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Partner&apos;s Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={signupData.partnerInviteEmail}
                  onChange={(e) => updateField('partnerInviteEmail', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="partner@example.com"
                />
              </div>
            </div>
            <button
              onClick={sendEmailInvite}
              disabled={!signupData.partnerInviteEmail}
              className="w-full px-4 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Send Invitation Email
            </button>
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Note:</strong> Your partner will need to create their own account using this invitation to link your accounts together.
        </p>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      default: return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w.full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Bridge2Us
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Join the journey together</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
            <span>Step {currentStep} of 6</span>
            <span>{Math.round((currentStep / 6) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          {/* Google OAuth Button - Show only on step 1 */}
          {currentStep === 1 && (
            <div className="mb-6">
              <button
                onClick={handleGoogleSignUp}
                className="w-full flex items-center justify-center gap-3 bg.white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors"
              >
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
                Continue with Google
              </button>
              
              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                    or continue with email
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : currentStep === 5 ? (
              <button
                onClick={handleCreateAccount}
                disabled={!signupData.agreeToTerms}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Account
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishSignup}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors"
              >
                Enter Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <a href="/login" className="text-pink-500 hover:text-pink-600 font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
