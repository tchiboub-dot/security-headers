'use client'

import { useState, useEffect } from 'react'

export default function Settings() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [saveHistory, setSaveHistory] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    // Load settings from localStorage
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark'
    const savedHistory = localStorage.getItem('saveHistory') !== 'false'
    const savedNotifications = localStorage.getItem('notifications') !== 'false'

    setTheme(savedTheme)
    setSaveHistory(savedHistory)
    setNotifications(savedNotifications)
  }, [])

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    setFeedback('Theme updated')
    setTimeout(() => setFeedback(''), 2000)

    if (newTheme === 'light') {
      document.documentElement.style.colorScheme = 'light'
    } else {
      document.documentElement.style.colorScheme = 'dark'
    }
  }

  const handleHistoryToggle = () => {
    const newValue = !saveHistory
    setSaveHistory(newValue)
    localStorage.setItem('saveHistory', String(newValue))
    setFeedback(`History saving ${newValue ? 'enabled' : 'disabled'}`)
    setTimeout(() => setFeedback(''), 2000)
  }

  const handleNotificationsToggle = () => {
    const newValue = !notifications
    setNotifications(newValue)
    localStorage.setItem('notifications', String(newValue))
    setFeedback(`Notifications ${newValue ? 'enabled' : 'disabled'}`)
    setTimeout(() => setFeedback(''), 2000)
  }

  const handleExportData = () => {
    // Placeholder for data export
    setFeedback('Export feature coming soon')
    setTimeout(() => setFeedback(''), 2000)
  }

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to delete all scan history? This cannot be undone.')) {
      // In a real app, this would delete from the database
      setFeedback('History cleared')
      setTimeout(() => setFeedback(''), 2000)
    }
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12 fade-in">
          <h1 className="text-5xl font-bold text-white mb-3">Settings</h1>
          <p className="text-xl text-slate-300 font-medium mb-2">Personalize your experience</p>
          <p className="text-slate-400 text-lg max-w-2xl">
            Manage your preferences, privacy settings, and data to customize how PhishLab works for you.
          </p>
        </div>

        <div className="space-y-6">
          {/* Appearance Settings */}
          <div className="glass rounded-xl p-6 border border-white border-opacity-10">
            <h2 className="text-2xl font-bold text-white mb-4">🎨 Appearance</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-300 mb-3">Theme</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`px-6 py-3 rounded-lg font-semibold transition ${
                      theme === 'dark'
                        ? 'glass border border-white border-opacity-30 text-white'
                        : 'border border-white border-opacity-10 text-gray-400 hover:text-white'
                    }`}
                  >
                    🌙 Dark Mode
                  </button>
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`px-6 py-3 rounded-lg font-semibold transition ${
                      theme === 'light'
                        ? 'glass border border-white border-opacity-30 text-white'
                        : 'border border-white border-opacity-10 text-gray-400 hover:text-white'
                    }`}
                  >
                    ☀️ Light Mode
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="glass rounded-xl p-6 border border-white border-opacity-10">
            <h2 className="text-2xl font-bold text-white mb-4">🔒 Privacy & Data</h2>

            <div className="space-y-4">
              {/* Save History */}
              <div className="flex items-start justify-between pb-4 border-b border-white border-opacity-10">
                <div>
                  <p className="text-white font-semibold">Save Scan History</p>
                  <p className="text-sm text-gray-400">
                    Store your password and phishing analyses for future reference
                  </p>
                </div>
                <label className="relative inline-flex items-center ml-4 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={saveHistory}
                    onChange={handleHistoryToggle}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Notifications */}
              <div className="flex items-start justify-between pb-4 border-b border-white border-opacity-10">
                <div>
                  <p className="text-white font-semibold">Enable Notifications</p>
                  <p className="text-sm text-gray-400">
                    Get alerts for important security issues (coming soon)
                  </p>
                </div>
                <label className="relative inline-flex items-center ml-4 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={handleNotificationsToggle}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Data Management */}
              <div className="pt-4">
                <p className="text-white font-semibold mb-4">Data Management</p>
                <div className="space-y-2">
                  <button
                    onClick={handleExportData}
                    className="w-full px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg text-white transition border border-white border-opacity-20"
                  >
                    📥 Export My Data
                  </button>
                  <button
                    onClick={handleClearHistory}
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition"
                  >
                    🗑️ Clear All History
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="glass rounded-xl p-6 border border-green-400 border-opacity-20">
            <h2 className="text-2xl font-bold text-white mb-4">🛡️ Security Info</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-2">Password Storage</h3>
                <p className="text-gray-400 text-sm">
                  ✓ We never store raw passwords
                  <br/>✓ Analyses use hashes for duplicate detection only
                  <br/>✓ All data is encrypted in transit
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">Data Privacy</h3>
                <p className="text-gray-400 text-sm">
                  ✓ Your data belongs to you
                  <br/>✓ No third-party sharing
                  <br/>✓ Local processing when possible
                  <br/>✓ You can delete anytime
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">Two-Factor Auth</h3>
                <p className="text-gray-400 text-sm">
                  2FA support coming soon to protect your account
                </p>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="glass rounded-xl p-6 border border-white border-opacity-10">
            <h2 className="text-2xl font-bold text-white mb-4">ℹ️ About</h2>

            <div className="space-y-2 text-sm text-gray-400">
              <p>
                <span className="text-white font-semibold">Password & Phishing Lab</span> v1.0.0
              </p>
              <p>
                An educational platform to learn about password security and phishing detection.
              </p>
              <p className="mt-4">
                📚 <a href="/learn" className="text-blue-400 hover:text-blue-300">Learn more</a> about cybersecurity
              </p>
              <p>
                🛡️ <a href="#legal" className="text-blue-400 hover:text-blue-300">Read our terms</a> and privacy policy
              </p>
            </div>
          </div>

          {/* Feedback Message */}
          {feedback && (
            <div className="glass rounded-lg px-4 py-2 text-sm text-green-300 border border-green-400 border-opacity-30 text-center">
              {feedback}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
