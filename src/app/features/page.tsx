export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-gray-100 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold">Features</h1>
          <p className="text-gray-300 mt-2">Tools that help you stay close across any distance.</p>
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
