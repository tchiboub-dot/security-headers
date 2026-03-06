'use client'

import { useState, useEffect } from 'react'
import { analyzePassword, generateSecurePassword } from '@/lib/passwordAnalyzer'
import { copyToClipboard } from '@/lib/utils'
import type { PasswordAnalysis } from '@/lib/passwordAnalyzer'

export default function PasswordAnalyzer() {
  const [password, setPassword] = useState('')
  const [bannedWords, setBannedWords] = useState('')
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null)
  const [saveHistory, setSaveHistory] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [genOptions, setGenOptions] = useState({
    length: 16,
    includeSymbols: true,
    avoidAmbiguous: true,
    pronounceable: false,
  })

  // Real-time analysis
  useEffect(() => {
    if (password.length > 0) {
      const words = bannedWords
        .split(',')
        .map(w => w.trim())
        .filter(w => w.length > 0)
      
      const result = analyzePassword(password, words)
      setAnalysis(result)

      // Auto-save to API if option is enabled
      if (saveHistory) {
        saveAnalysis(result)
      }
    } else {
      setAnalysis(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, bannedWords, saveHistory])

  const saveAnalysis = async (_result: PasswordAnalysis) => {
    try {
      await fetch('/api/password/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          bannedWords: bannedWords.split(',').map(w => w.trim()).filter(w => w),
          saveHistory: true,
        }),
      })
      setFeedback('Analysis saved to history')
      setTimeout(() => setFeedback(''), 3000)
    } catch (error) {
      console.error('Failed to save analysis:', error)
      setFeedback('Failed to save analysis')
    }
  }

  const handleGeneratePassword = () => {
    const pwd = generateSecurePassword(genOptions)
    setGeneratedPassword(pwd)
  }

  const handleCopyPassword = async () => {
    if (generatedPassword) {
      const success = await copyToClipboard(generatedPassword)
      setFeedback(success ? 'Password copied!' : 'Failed to copy')
      setTimeout(() => setFeedback(''), 2000)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-r from-green-500 to-emerald-500'
    if (score >= 60) return 'bg-gradient-to-r from-blue-500 to-cyan-500'
    if (score >= 40) return 'bg-gradient-to-r from-yellow-500 to-orange-500'
    return 'bg-gradient-to-r from-red-500 to-pink-500'
  }

  const getStrengthColor = (strength: string) => {
    if (strength.includes('Very Strong') || strength.includes('Strong')) return 'text-green-400'
    if (strength.includes('Good')) return 'text-cyan-400'
    if (strength.includes('Fair')) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 fade-in">
          <h1 className="text-5xl font-bold text-white mb-3">Password Strength Analyzer</h1>
          <p className="text-xl text-slate-300 font-medium mb-2">Real-time analysis with detailed insights</p>
          <p className="text-slate-400 text-lg max-w-2xl">
            Get instant strength scoring, discover vulnerabilities, and receive actionable recommendations to improve your password security.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Password Input */}
            <div className="glass rounded-xl p-6 border border-white border-opacity-10">
              <label className="block text-sm font-semibold text-white mb-2">
                Enter Password to Analyze
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Type your password here..."
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  maxLength={500}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                {password.length}/500 characters
              </div>
            </div>

            {/* Banned Words */}
            <div className="glass rounded-xl p-6 border border-white border-opacity-10">
              <label className="block text-sm font-semibold text-white mb-2">
                Banned Words (Optional)
              </label>
              <textarea
                value={bannedWords}
                onChange={(e) => setBannedWords(e.target.value)}
                placeholder="Enter words to exclude (comma-separated)&#10;e.g., john, smith2023, companyname"
                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 h-24 resize-none"
              />
              <p className="text-xs text-gray-400 mt-2">
                Add personal info, names, or company names to prevent weak passwords
              </p>
            </div>

            {/* Save History Option */}
            <div className="glass rounded-xl p-4 border border-white border-opacity-10 flex items-center">
              <input
                type="checkbox"
                id="saveHistory"
                checked={saveHistory}
                onChange={(e) => setSaveHistory(e.target.checked)}
                className="w-4 h-4 accent-blue-500"
              />
              <label htmlFor="saveHistory" className="ml-3 text-sm text-gray-300">
                Save this analysis to my history
              </label>
            </div>

            {/* Analysis Results */}
            {analysis && (
              <div className="glass rounded-xl p-6 border border-white border-opacity-10">
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white">Password Strength</h3>
                    <span className={`text-2xl font-bold ${getStrengthColor(analysis.strength)}`}>
                      {analysis.strength}
                    </span>
                  </div>
                  <div className="relative h-2 bg-white bg-opacity-10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getScoreColor(analysis.score)} transition-all duration-500`}
                      style={{ width: `${analysis.score}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Score: <span className="text-white font-semibold">{analysis.score}/100</span>
                  </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {[
                    { label: 'Length', value: analysis.metrics.length, target: '12+' },
                    { label: 'Uppercase', value: analysis.metrics.hasUppercase ? '✓' : '✗' },
                    { label: 'Lowercase', value: analysis.metrics.hasLowercase ? '✓' : '✗' },
                    { label: 'Numbers', value: analysis.metrics.hasNumbers ? '✓' : '✗' },
                    { label: 'Symbols', value: analysis.metrics.hasSymbols ? '✓' : '✗' },
                    { label: 'Entropy', value: `${analysis.metrics.entropy}` },
                  ].map((metric) => (
                    <div key={metric.label} className="bg-white bg-opacity-5 rounded-lg p-3">
                      <p className="text-xs text-gray-400">{metric.label}</p>
                      <p className="text-lg font-bold text-white">{metric.value}</p>
                    </div>
                  ))}
                </div>

                {/* Flags */}
                {analysis.flags.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-red-400 mb-2">⚠️ Issues Found:</h4>
                    <ul className="space-y-2">
                      {analysis.flags.map((flag, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-300">
                          <span className="mr-2">•</span>
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {analysis.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-2">💡 Suggestions:</h4>
                    <ul className="space-y-2">
                      {analysis.suggestions.map((sugg, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-300">
                          <span className="mr-2">→</span>
                          <span>{sugg}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Password Generator */}
          <div className="space-y-6">
            <div className="glass rounded-xl p-6 border border-green-400 border-opacity-30 sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4">🎲 Generate Secure Password</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Length: {genOptions.length}
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="32"
                    value={genOptions.length}
                    onChange={(e) => setGenOptions({ ...genOptions, length: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={genOptions.includeSymbols}
                      onChange={(e) => setGenOptions({ ...genOptions, includeSymbols: e.target.checked })}
                      className="w-4 h-4 mr-2 accent-blue-500"
                    />
                    Include Symbols
                  </label>
                </div>

                <div>
                  <label className="flex items-center text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={genOptions.avoidAmbiguous}
                      onChange={(e) => setGenOptions({ ...genOptions, avoidAmbiguous: e.target.checked })}
                      className="w-4 h-4 mr-2 accent-blue-500"
                    />
                    Avoid Ambiguous Chars
                  </label>
                </div>
              </div>

              <button
                onClick={handleGeneratePassword}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-white transition mb-3"
              >
                Generate Password
              </button>

              {generatedPassword && (
                <div className="bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-2">Generated Password:</p>
                  <div className="bg-white bg-opacity-10 rounded p-3 mb-3 break-all font-mono text-sm text-white">
                    {generatedPassword}
                  </div>
                  <button
                    onClick={handleCopyPassword}
                    className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold transition"
                  >
                    📋 Copy to Clipboard
                  </button>
                </div>
              )}
            </div>

            {/* Password Checklist */}
            <div className="glass rounded-xl p-6 border border-blue-400 border-opacity-20">
              <h3 className="text-lg font-semibold text-white mb-4">✓ Password Checklist</h3>
              <ul className="space-y-3 text-sm">
                {[
                  'At least 12 characters long',
                  'Mix of uppercase & lowercase',
                  'Includes numbers (0-9)',
                  'Includes special symbols',
                  'No personal information',
                  'Not a common word or phrase',
                  'Not a keyboard sequence',
                  'No repeated characters',
                ].map((item, i) => (
                  <li key={i} className="flex items-start text-gray-300">
                    <span className="text-blue-400 mr-2">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div className="fixed bottom-4 right-4 glass rounded-lg px-4 py-2 text-sm text-green-300 border border-green-400 border-opacity-30">
            {feedback}
          </div>
        )}
      </div>
    </main>
  )
}
