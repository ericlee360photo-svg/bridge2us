'use client';

import React from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Header */}
      <header className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-6 h-6 text-pink-500" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Bridge2Us - Privacy Policy
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

      {/* Privacy Content */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Privacy Policy
          </h2>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
                1. Information We Collect
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                use our services, or contact us for support.
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Personal information (name, email, birthday, location)</li>
                <li>Profile information and preferences</li>
                <li>Communication data (messages, journal entries)</li>
                <li>Usage data and analytics</li>
                <li>Device and technical information</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
                2. How We Use Your Information
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Facilitate communication with your partner</li>
                <li>Personalize your experience</li>
                <li>Send notifications and updates</li>
                <li>Ensure security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
                3. Information Sharing
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties except as described below:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>With your explicit consent</li>
                <li>With your partner (for shared features like journal entries)</li>
                <li>With service providers who assist our operations</li>
                <li>To comply with legal requirements</li>
                <li>To protect our rights and safety</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
                4. Third-Party Services
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Bridge2Us integrates with third-party services to enhance your experience:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li><strong>Google Services:</strong> Authentication, Maps, Calendar integration</li>
                <li><strong>Spotify:</strong> Music sharing and activity display</li>
                <li><strong>Weather Services:</strong> Location-based weather information</li>
                <li><strong>Horoscope Services:</strong> Daily horoscope content</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                These services have their own privacy policies, and we encourage you to review them.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
                5. Data Security
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. However, no internet transmission 
                is completely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
                6. Data Retention
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We retain your information for as long as your account is active or as needed to provide 
                services. If you delete your account, we will delete your personal information, though 
                some data may be retained for legal or business purposes.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
                7. Your Rights
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Access and update your personal information</li>
                <li>Delete your account and data</li>
                <li>Control sharing settings</li>
                <li>Opt out of marketing communications</li>
                <li>Request data portability</li>
                <li>File complaints with data protection authorities</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
                8. Children's Privacy
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Bridge2Us is not intended for children under 13. We do not knowingly collect personal 
                information from children under 13. If we become aware of such data collection, we will 
                delete the information immediately.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
                9. International Users
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Bridge2Us is operated from the United States. If you are accessing our service from 
                outside the US, please be aware that your information may be transferred to and processed 
                in the United States.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
                10. Changes to This Policy
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material 
                changes by posting the new policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
                11. Contact Us
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Email: privacy@bridge2us.app<br />
                  Website: https://bridge2us.app<br />
                  Address: [Your Business Address]
                </p>
              </div>
            </section>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-600 pt-8 mt-12">
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
              By using Bridge2Us, you acknowledge that you have read, understood, and agree to this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
