"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Heart, ArrowRight, ArrowLeft, Mail, Lock, User, MapPin, Calendar, ExternalLink, Copy, Target } from "lucide-react";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import { DataStorage } from "@/lib/storage";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import UsualWeekWizard from "@/weekscheduler/UsualWeekWizard";
import "@/sharedschedule/schedule.css";
import { useSearchParams } from "next/navigation";
import InterestsSelector from "@/components/InterestsSelector";

interface SignupData {
  // Step 1: Basic Info
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  
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
  wakeUpTime: string;
  bedTime: string;
  workStartTime: string;
  workEndTime: string;
  gymTime: string;
  schoolTime: string;
  
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
  
  // Interests
  interests: string[];
}

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [inviteUrlCopied, setInviteUrlCopied] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [magicLink, setMagicLink] = useState<string>('');
  const [invitationToken, setInvitationToken] = useState<string>('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [signupData, setSignupData] = useState<SignupData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    gender: "",
    birthday: "",
    address: "",
    city: "",
    state: "",
    country: "",
    isAddressPublic: false,
    avatar: "",
    usualWeekCompleted: false,
    wakeUpTime: "07:00",
    bedTime: "23:00",
    workStartTime: "09:00",
    workEndTime: "17:00",
    gymTime: "18:00",
    schoolTime: "08:00",
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
    partnerInviteEmail: "",
    interests: []
  });

  // Handle OAuth flow and invitation tokens
  useEffect(() => {
    const oauthStep = searchParams?.get('step');
    const isOAuth = searchParams?.get('oauth') === 'true';
    const invitationToken = searchParams?.get('invite');
    
    if (isOAuth && oauthStep) {
      // Start at the specified step for OAuth users
      const stepNumber = parseInt(oauthStep);
      setCurrentStep(stepNumber);
      
      // Pre-fill data from localStorage if available
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setSignupData(prev => ({
            ...prev,
            email: userData.email || "",
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            avatar: userData.avatar || "",
            timezone: userData.timezone || "UTC",
            country: userData.country || "",
            language: userData.language || "en"
          }));
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      
      // For OAuth users, we need to create a user ID since they don't go through email/password
      if (!userId) {
        const tempUserId = `oauth-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setUserId(tempUserId);
      }
    }

    // Store invitation token if present
    if (invitationToken) {
      localStorage.setItem('pendingInvitation', invitationToken);
      console.log('Invitation token stored:', invitationToken);
    }
  }, [searchParams, userId]);

  const updateField = (field: keyof SignupData, value: string | boolean | string[]) => {
    setSignupData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Use a unique temporary ID based on timestamp and email
      const tempUserId = `temp-${Date.now()}-${signupData.email.replace(/[^a-zA-Z0-9]/g, '')}`;
      formData.append('userId', tempUserId);

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        updateField('avatar', result.url);
        console.log('Upload successful:', result.message);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Upload failed:', errorData);
        const errorMessage = errorData.error || errorData.message || 'Unknown error';
        alert(`Upload failed: ${errorMessage}`);
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
    // Validate interests on step 6 (before moving to step 7)
    if (currentStep === 6 && signupData.interests.length < 5) {
      alert('Please select at least 5 interests before continuing.');
      return;
    }
    
    if (currentStep < 8) {
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
      // Create user profile in our database via API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupData.email,
          password: signupData.password,
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          gender: signupData.gender,
          birthday: signupData.birthday,
          address: signupData.address,
          city: signupData.city,
          state: signupData.state,
          country: signupData.country,
          isAddressPublic: signupData.isAddressPublic,
          timezone: signupData.timezone || 'UTC',
          language: signupData.language || 'en',
          wakeUpTime: signupData.wakeUpTime,
          bedTime: signupData.bedTime,
          workStartTime: signupData.workStartTime,
          workEndTime: signupData.workEndTime,
          gymTime: signupData.gymTime,
          schoolTime: signupData.schoolTime,
          timeFormat: signupData.timeFormat,
          measurementSystem: signupData.measurementSystem,
          temperatureUnit: signupData.temperatureUnit,
          distanceUnit: signupData.distanceUnit,
          interests: signupData.interests,
          partnerEmail: signupData.partnerEmail || null,
          relationshipType: signupData.relationshipType || null,
          howLongTogether: signupData.howLongTogether || null,
          communicationStyle: signupData.communicationStyle || null,
          loveLanguages: signupData.loveLanguages || null,
          futurePlans: signupData.futurePlans || null
        }),
      });

      const result = await response.json();

      if (response.ok) {
        const dbUserId = result.userId;
        if (dbUserId) {
          setUserId(dbUserId);
          console.log('User created successfully with ID:', dbUserId);
        }

        // Store user data locally
        const userData = {
          id: dbUserId || 'pending-verification',
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          email: signupData.email,
          avatar: signupData.avatar,
          timezone: signupData.timezone || "UTC",
          country: signupData.country,
          language: signupData.language
        };
        await DataStorage.setUser(userData);

        // Proceed to next step
        nextStep();
      } else {
        console.error('Signup API error:', result);
        alert(result.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during signup');
    }
  };

  const generateMagicLink = async () => {
    console.log('generateMagicLink called');
    console.log('userId:', userId);
    console.log('firstName:', signupData.firstName);
    console.log('lastName:', signupData.lastName);
    console.log('email:', signupData.email);
    
    if (!userId) {
      alert('User ID not found. Please try refreshing the page and starting over.');
      return;
    }
    
    setIsGeneratingLink(true);
    try {
      console.log('Sending request to /api/invite/generate');
      const response = await fetch('/api/invite/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviterId: userId,
          inviterName: `${signupData.firstName} ${signupData.lastName}`,
          inviterEmail: signupData.email
        }),
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response result:', result);

      if (response.ok) {
        setMagicLink(result.magicLink);
        setInvitationToken(result.invitationToken);
        console.log('Magic link generated successfully:', result.magicLink);
      } else {
        console.error('Failed to generate magic link:', result);
        alert(`Failed to generate invitation link: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error generating magic link:', error);
      alert('Failed to generate invitation link. Please try again.');
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const copyMagicLink = async () => {
    if (magicLink) {
      try {
        await navigator.clipboard.writeText(magicLink);
        setInviteUrlCopied(true);
        setTimeout(() => setInviteUrlCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy link:', error);
        alert('Failed to copy link. Please copy it manually.');
      }
    }
  };

  const handleFinishSignup = async () => {
    // Check for pending invitation and accept it
    const pendingInvitation = localStorage.getItem('pendingInvitation');
    
    if (pendingInvitation && userId) {
      try {
        const response = await fetch('/api/invite/accept', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            invitationToken: pendingInvitation,
            inviteeId: userId,
            inviteeName: `${signupData.firstName} ${signupData.lastName}`,
            inviteeEmail: signupData.email
          }),
        });

        if (response.ok) {
          console.log('Partnership created successfully');
          localStorage.removeItem('pendingInvitation');
        } else {
          console.error('Failed to accept invitation');
        }
      } catch (error) {
        console.error('Error accepting invitation:', error);
      }
    }

    // Save user data to localStorage
    const userData = {
      id: userId || 'temp-user-id',
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      email: signupData.email,
      avatar: signupData.avatar,
      timezone: signupData.timezone,
      country: signupData.country,
      language: signupData.language
    };
    
    // Save user settings and preferences
    await DataStorage.setUser(userData);
    await DataStorage.setUserSettings(userData.id, {
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      email: signupData.email,
      birthday: signupData.birthday,
      timezone: signupData.timezone || "UTC",
      country: signupData.country,
      language: signupData.language || "en",
      avatar: signupData.avatar,
      timeFormat: signupData.timeFormat,
      measurementSystem: signupData.measurementSystem,
      temperatureUnit: signupData.temperatureUnit,
      distanceUnit: signupData.distanceUnit,
      spotifySharing: true,
      horoscopeSharing: true,
      showHoroscope: true,
      shareHoroscope: true,
      weeklySchedule: {}
    });
    
    // Save interests
    if (signupData.interests.length > 0) {
      await DataStorage.setData('userInterests', signupData.interests);
    }
    
    // Redirect to dashboard
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
    console.log('sendEmailInvite called');
    console.log('partnerInviteEmail:', signupData.partnerInviteEmail);
    console.log('userId:', userId);
    console.log('firstName:', signupData.firstName);
    console.log('lastName:', signupData.lastName);
    
    if (!signupData.partnerInviteEmail) {
      alert('Please enter your partner\'s email address');
      return;
    }
    
    if (!userId) {
      alert('User ID not found. Please try refreshing the page and starting over.');
      return;
    }
    
    try {
      console.log('Sending request to /api/invite/email');
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

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response result:', result);

      if (response.ok) {
        alert('Invitation email sent successfully!');
      } else {
        alert(`Failed to send invitation email: ${result.error || 'Unknown error'}`);
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

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Gender
          </label>
          <select
            value={signupData.gender}
            onChange={(e) => updateField('gender', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
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
      <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden w-full">
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
        {/* Magic Link Generation */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Magic Link Invitation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Generate a secure link to invite your partner</p>
            </div>
            <button
              onClick={generateMagicLink}
              disabled={isGeneratingLink || !!magicLink}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                magicLink 
                  ? 'bg-green-500 text-white cursor-not-allowed' 
                  : isGeneratingLink
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-pink-500 hover:bg-pink-600 text-white'
              }`}
            >
              {magicLink ? 'Generated!' : isGeneratingLink ? 'Generating...' : 'Generate Link'}
            </button>
          </div>

          {magicLink && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={magicLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                />
                <button
                  onClick={copyMagicLink}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    inviteUrlCopied 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {inviteUrlCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Share this link with your partner. When they sign up using this link, your accounts will be automatically linked as partners.
              </p>
            </div>
          )}
        </div>

        {/* Alternative Invitation Methods */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Alternative invitation methods:
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
                <div className="font-medium text-gray-800 dark:text-gray-200">Simple User ID Link</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Basic invitation link (less secure)</div>
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
              Simple Invite Link
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
          The magic link is the most secure option and will automatically link your accounts when your partner signs up.
        </p>
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Target className="w-8 h-8 text-pink-500" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Your Interests</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Help us personalize your experience by selecting your interests
        </p>
      </div>

      <InterestsSelector
        selectedInterests={signupData.interests}
        onInterestsChange={(interests) => updateField('interests', interests)}
        minSelections={5}
        maxSelections={20}
      />

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Why we ask:</strong> Your interests help us suggest activities, events, and content that you and your partner might enjoy together. 
          This information is used to personalize your dashboard and improve your experience.
        </p>
      </div>
    </div>
  );

  const renderStep8 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-8 h-8 text-pink-500" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Sign Up Complete!</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We'll set up your dashboard when your partner joins the journey.
        </p>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <p className="text-sm text-green-800 dark:text-green-200">
          <strong>Account Created Successfully!</strong> Your profile is ready and waiting for your partner to join.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
          <div>
            <div className="font-medium text-gray-800 dark:text-gray-200">Profile Complete</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Your profile has been set up with all your preferences</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
          <div>
            <div className="font-medium text-gray-800 dark:text-gray-200">Schedule Configured</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Your weekly schedule has been set up</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
          <div>
            <div className="font-medium text-gray-800 dark:text-gray-200">Interests Added</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Your interests have been saved for personalization</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">⏳</span>
          </div>
          <div>
            <div className="font-medium text-gray-800 dark:text-gray-200">Waiting for Partner</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Your dashboard will be fully activated once your partner joins</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4(); // Relationship details
      case 5: return renderStep5(); // Preferences
      case 6: return renderStep7(); // Interests
      case 7: return renderStep6(); // Partner invitation
      case 8: return renderStep8(); // Completion
      default: return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className={`w-full ${currentStep === 3 || currentStep === 6 ? 'max-w-4xl' : 'max-w-md'}`}>
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
            <span>Step {currentStep} of 8</span>
            <span>{Math.round((currentStep / 7) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 7) * 100}%` }}
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

            {currentStep < 7 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors"
              >
                Next
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

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Loading...</h2>
        </div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
