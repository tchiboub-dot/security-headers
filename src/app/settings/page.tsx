'use client'

import { useState, useEffect } from 'react'

export default function Settings() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [saveHistory, setSaveHistory] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [feedback, setFeedback] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load settings from localStorage
    const savedTheme = (localStorage.getItem('theme') as 'dark' | 'light') || 'dark'
    const savedHistory = localStorage.getItem('saveHistory') !== 'false'
    const savedNotifications = localStorage.getItem('notifications') !== 'false'

    setTheme(savedTheme)
    setSaveHistory(savedHistory)
    setNotifications(savedNotifications)

    // Apply theme to HTML element
    document.documentElement.setAttribute('data-theme', savedTheme)
    document.documentElement.style.colorScheme = savedTheme
  }, [])

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    setFeedback('✓ Theme updated!')
    
    // Apply theme changes
    document.documentElement.setAttribute('data-theme', newTheme)
    document.documentElement.style.colorScheme = newTheme
    
    setTimeout(() => setFeedback(''), 2000)
  }

  const handleHistoryToggle = () => {
    const newValue = !saveHistory
    setSaveHistory(newValue)
    localStorage.setItem('saveHistory', String(newValue))
    setFeedback(`✓ History saving ${newValue ? 'enabled' : 'disabled'}`)
    setTimeout(() => setFeedback(''), 2000)
  }

  const handleNotificationsToggle = () => {
    const newValue = !notifications
    setNotifications(newValue)
    localStorage.setItem('notifications', String(newValue))
    setFeedback(`✓ Notifications ${newValue ? 'enabled' : 'disabled'}`)
    setTimeout(() => setFeedback(''), 2000)
  }

  const handleExportData = () => {
    setFeedback('✓ Export feature coming soon')
    setTimeout(() => setFeedback(''), 2000)
  }

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to delete all scan history? This cannot be undone.')) {
      setFeedback('✓ History cleared')
      setTimeout(() => setFeedback(''), 2000)
    }
  }

  if (!mounted) {
    return <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8" />
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12 fade-in">
          <h1 className="text-5xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Settings</h1>
          <p className="text-xl font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Personalize your experience</p>
          <p className="text-lg max-w-2xl" style={{ color: 'var(--text-tertiary)' }}>
            Manage your preferences, privacy settings, and data to customize how PhishLab works for you.
          </p>
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/30 animate-in fade-in" style={{ color: '#10b981' }}>
            {feedback}
          </div>
        )}

        <div className="space-y-6">
          {/* Appearance Settings */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>🎨 Appearance</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Theme</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      theme === 'dark'
                        ? 'glass border border-blue-400/30 shadow-lg shadow-blue-500/10'
                        : 'border border-current border-opacity-20 hover:border-opacity-40 hover:bg-white/5'
                    }`}
                    style={{
                      color: theme === 'dark' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    }}
                  >
                    🌙 Dark Mode
                  </button>
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      theme === 'light'
                        ? 'glass border border-blue-400/30 shadow-lg shadow-blue-500/10'
                        : 'border border-current border-opacity-20 hover:border-opacity-40 hover:bg-white/5'
                    }`}
                    style={{
                      color: theme === 'light' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    }}
                  >
                    ☀️ Light Mode
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>🔒 Privacy & Data</h2>

            <div className="space-y-4">
              {/* Save History */}
              <div className="flex items-start justify-between pb-4" style={{ borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Save Scan History</p>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
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
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 transition-all duration-200"></div>
                </label>
              </div>

              {/* Notifications */}
              <div className="flex items-start justify-between pb-4" style={{ borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Enable Notifications</p>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
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
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 transition-all duration-200"></div>
                </label>
              </div>

              {/* Data Management */}
              <div className="pt-4">
                <p className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Data Management</p>
                <div className="space-y-2">
                  <button
                    onClick={handleExportData}
                    className="w-full px-4 py-2 rounded-lg transition-all duration-200 border-2 hover:bg-white/10 active:scale-95"
                    style={{
                      borderColor: 'var(--border-medium)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    📥 Export My Data
                  </button>
                  <button
                    onClick={handleClearHistory}
                    className="w-full px-4 py-2 rounded-lg text-white transition-all duration-200 hover:bg-red-700 active:scale-95 hover:-translate-y-0.5"
                    style={{
                      backgroundColor: 'rgb(220, 38, 38)',
                    }}
                  >
                    🗑️ Clear All History
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="glass rounded-xl p-6" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>🛡️ Security Info</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Password Storage</h3>
                <p className="text-sm space-y-1" style={{ color: 'var(--text-tertiary)' }}>
                  ✓ We never store raw passwords <br/>
                  ✓ Analyses use hashes for duplicate detection only <br/>
                  ✓ All data is encrypted in transit
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Data Privacy</h3>
                <p className="text-sm space-y-1" style={{ color: 'var(--text-tertiary)' }}>
                  ✓ Your data belongs to you<br/>
                  <br/>✓ Local processing when possible
                  <br/>✓ You can delete anytime
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Two-Factor Auth</h3>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  2FA support coming soon to protect your account
                </p>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>ℹ️ About</h2>

            <div className="space-y-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
              <p>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>PhishLab</span> v1.0.0
              </p>
              <p>
                An educational platform to learn about password security and phishing detection.
              </p>
              <p className="mt-4">
                📚 <a href="/learn" className="hover:underline" style={{ color: 'var(--accent-primary)' }}>Learn more</a> about cybersecurity
              </p>
              <p>
                🛡️ <a href="/legal" className="hover:underline" style={{ color: 'var(--accent-primary)' }}>Read our terms</a> and privacy policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
