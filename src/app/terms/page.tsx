'use client';

import React from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Header */}
      <header className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-6 h-6 text-pink-500" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Bridge2Us - Terms of Use
          </h1>
        </div>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-pink-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </header>

      {/* Terms Content */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Terms of Use
          </h2>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
                1. Acceptance of Terms
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                By accessing and using Bridge2Us (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
                2. Description of Service
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Bridge2Us is a long-distance relationship companion application that provides:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Interactive world map with location tracking</li>
                <li>Shared schedule and calendar integration</li>
                <li>Weather information for partner locations</li>
                <li>Music sharing through Spotify integration</li>
                <li>Shared journal and mood tracking</li>
                <li>Horoscope sharing capabilities</li>
                <li>Meetup planning and countdown features</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
                3. User Accounts and Registration
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                To use certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
                4. Privacy and Data Collection
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We collect and use your information as described in our Privacy Policy. By using the Service, you consent to:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Collection of location data for map and weather features</li>
                <li>Integration with third-party services (Google, Spotify, calendar providers)</li>
                <li>Storage of personal information, journal entries, and preferences</li>
                <li>Analytics and usage tracking to improve the service</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
                5. Acceptable Use Policy
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Upload, post, or transmit any harmful, threatening, or inappropriate content</li>
                <li>Violate any laws or regulations</li>
                <li>Infringe upon intellectual property rights</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service or servers</li>
                <li>Use the service for commercial purposes without permission</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
                6. Third-Party Integrations
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Our service integrates with third-party platforms including Google (OAuth, Maps, Calendar), 
                Spotify (Music sharing), and weather services. Your use of these integrations is subject to 
                their respective terms of service and privacy policies. We are not responsible for the 
                practices or content of these third-party services.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
                7. Intellectual Property
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                The Service and its original content, features, and functionality are and will remain the 
                exclusive property of Bridge2Us and its licensors. The service is protected by copyright, 
                trademark, and other laws. You may not reproduce, distribute, or create derivative works 
                without our express written permission.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
                8. Disclaimer of Warranties
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. We make no representations 
                or warranties of any kind, express or implied, including but not limited to warranties of 
                merchantability, fitness for a particular purpose, or non-infringement.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
                9. Limitation of Liability
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                In no event shall Bridge2Us be liable for any indirect, incidental, special, consequential, 
                or punitive damages, including but not limited to loss of profits, data, or other intangible 
                losses resulting from your use of the Service.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
                10. Termination
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We may terminate or suspend your account and access to the Service immediately, without 
                prior notice or liability, for any reason, including if you breach the Terms of Use.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
                11. Changes to Terms
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, 
                we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
                12. Contact Information
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                If you have any questions about these Terms of Use, please contact us at:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Email: support@bridge2us.app<br />
                  Website: https://bridge2us.app<br />
                  Address: [Your Business Address]
                </p>
              </div>
            </section>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-600 pt-8 mt-12">
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
              By using Bridge2Us, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
