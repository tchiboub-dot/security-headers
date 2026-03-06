'use client'

/* eslint-disable react/no-unescaped-entities */

import { useState } from 'react'
import { analyzeURL, analyzeEmail } from '@/lib/phishingAnalyzer'
import type { URLAnalysis, EmailAnalysis } from '@/lib/phishingAnalyzer'

export default function PhishingDetector() {
  const [tab, setTab] = useState<'url' | 'email'>('url')
  const [urlInput, setUrlInput] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [urlAnalysis, setUrlAnalysis] = useState<URLAnalysis | null>(null)
  const [emailAnalysis, setEmailAnalysis] = useState<EmailAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [saveHistory, setSaveHistory] = useState(false)

  const handleAnalyzeURL = async () => {
    if (!urlInput.trim()) {
      setFeedback('Please enter a URL')
      return
    }

    setLoading(true)
    try {
      const analysis = analyzeURL(urlInput)
      setUrlAnalysis(analysis)

      // Save to API if enabled
      if (saveHistory) {
        await fetch('/api/phishing/url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlInput, saveHistory: true }),
        })
        setFeedback('Analysis saved to history')
      }
    } catch (error) {
      console.error('URL analysis error:', error)
      setFeedback('Failed to analyze URL')
    } finally {
      setLoading(false)
      setTimeout(() => setFeedback(''), 3000)
    }
  }

  const handleAnalyzeEmail = async () => {
    if (!emailInput.trim()) {
      setFeedback('Please enter email content')
      return
    }

    setLoading(true)
    try {
      const analysis = analyzeEmail(emailInput)
      setEmailAnalysis(analysis)

      // Save to API if enabled
      if (saveHistory) {
        await fetch('/api/phishing/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailText: emailInput, saveHistory: true }),
        })
        setFeedback('Analysis saved to history')
      }
    } catch (error) {
      console.error('Email analysis error:', error)
      setFeedback('Failed to analyze email')
    } finally {
      setLoading(false)
      setTimeout(() => setFeedback(''), 3000)
    }
  }

  const getRiskColor = (level: string) => {
    if (level === 'Critical') return 'text-red-500 bg-red-500 bg-opacity-10'
    if (level === 'High') return 'text-orange-500 bg-orange-500 bg-opacity-10'
    if (level === 'Medium') return 'text-yellow-500 bg-yellow-500 bg-opacity-10'
    return 'text-green-500 bg-green-500 bg-opacity-10'
  }

  const getRiskBarColor = (level: string) => {
    if (level === 'Critical') return 'bg-gradient-to-r from-red-500 to-pink-500'
    if (level === 'High') return 'bg-gradient-to-r from-orange-500 to-red-500'
    if (level === 'Medium') return 'bg-gradient-to-r from-yellow-500 to-orange-500'
    return 'bg-gradient-to-r from-green-500 to-emerald-500'
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 fade-in">
          <h1 className="text-5xl font-bold text-white mb-3">Phishing Detector</h1>
          <p className="text-xl text-slate-300 font-medium mb-2">Detect suspicious links and phishing threats</p>
          <p className="text-slate-400 text-lg max-w-2xl">
            Analyze URLs and emails to identify phishing patterns, malicious links, and security threats with detailed risk assessment.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {[
            { id: 'url', label: '🔗 URL Analyzer', icon: 'URL' },
            { id: 'email', label: '📧 Email Analyzer', icon: 'EMAIL' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id as typeof tab); setFeedback('') }}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                tab === t.id
                  ? 'glass border border-white border-opacity-30 text-white'
                  : 'border border-white border-opacity-10 text-gray-400 hover:text-white hover:border-opacity-20'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Save History Option */}
        <div className="glass rounded-xl p-4 border border-white border-opacity-10 mb-6 flex items-center">
          <input
            type="checkbox"
            id="saveHistory"
            checked={saveHistory}
            onChange={(e) => setSaveHistory(e.target.checked)}
            className="w-4 h-4 accent-blue-500"
          />
          <label htmlFor="saveHistory" className="ml-3 text-sm text-gray-300">
            Save analyses to my history
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* URL Analyzer */}
          {tab === 'url' && (
            <>
              <div className="lg:col-span-2 space-y-6">
                <div className="glass rounded-xl p-6 border border-white border-opacity-10">
                  <label className="block text-sm font-semibold text-white mb-3">
                    Enter URL to Analyze
                  </label>
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAnalyzeURL()}
                    placeholder="https://example.com or example.com"
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 mb-4"
                  />
                  <button
                    onClick={handleAnalyzeURL}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 rounded-lg font-semibold transition"
                  >
                    {loading ? 'Analyzing...' : 'Analyze URL'}
                  </button>
                </div>

                {urlAnalysis && (
                  <div className="glass rounded-xl p-6 border border-white border-opacity-10">
                    <div className="mb-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-white">Risk Assessment</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(urlAnalysis.riskLevel)}`}>
                          {urlAnalysis.riskLevel}
                        </span>
                      </div>
                      <div className="relative h-3 bg-white bg-opacity-10 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getRiskBarColor(urlAnalysis.riskLevel)}`}
                          style={{ width: `${urlAnalysis.riskScore}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        Risk Score: <span className="text-white font-semibold">{urlAnalysis.riskScore}/100</span>
                      </p>
                    </div>

                    {/* URL Components */}
                    <div className="bg-white bg-opacity-5 rounded-lg p-4 mb-6">
                      <h4 className="text-sm font-semibold text-blue-300 mb-2">🔍 URL Components:</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="text-gray-400">Protocol:</span> <span className="text-white">{urlAnalysis.parsed.protocol}</span></div>
                        <div><span className="text-gray-400">Domain:</span> <span className="text-white">{urlAnalysis.parsed.domain || 'N/A'}</span></div>
                        <div><span className="text-gray-400">TLD:</span> <span className="text-white">.{urlAnalysis.parsed.tld}</span></div>
                        <div><span className="text-gray-400">Subdomain:</span> <span className="text-white">{urlAnalysis.parsed.subdomain || 'none'}</span></div>
                      </div>
                    </div>

                    {/* Flags */}
                    {urlAnalysis.flags.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-red-400 mb-2">⚠️ Warning Signs:</h4>
                        <ul className="space-y-2">
                          {urlAnalysis.flags.map((flag, i) => (
                            <li key={i} className="flex items-start text-sm text-gray-300">
                              <span className="mr-2">•</span>
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations */}
                    <div>
                      <h4 className="text-sm font-semibold text-green-400 mb-2">✓ Recommendations:</h4>
                      <ul className="space-y-2">
                        {urlAnalysis.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start text-sm text-gray-300">
                            <span className="mr-2">→</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Email Analyzer */}
          {tab === 'email' && (
            <>
              <div className="lg:col-span-2 space-y-6">
                <div className="glass rounded-xl p-6 border border-white border-opacity-10">
                  <label className="block text-sm font-semibold text-white mb-3">
                    Paste Email Content
                  </label>
                  <textarea
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Paste the full email text here (including headers if available)..."
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 h-40 resize-none mb-4"
                  />
                  <button
                    onClick={handleAnalyzeEmail}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 rounded-lg font-semibold transition"
                  >
                    {loading ? 'Analyzing...' : 'Analyze Email'}
                  </button>
                </div>

                {emailAnalysis && (
                  <div className="glass rounded-xl p-6 border border-white border-opacity-10">
                    <div className="mb-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-white">Risk Assessment</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(emailAnalysis.riskLevel)}`}>
                          {emailAnalysis.riskLevel}
                        </span>
                      </div>
                      <div className="relative h-3 bg-white bg-opacity-10 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getRiskBarColor(emailAnalysis.riskLevel)}`}
                          style={{ width: `${emailAnalysis.riskScore}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        Risk Score: <span className="text-white font-semibold">{emailAnalysis.riskScore}/100</span>
                      </p>
                    </div>

                    {/* Flags */}
                    {emailAnalysis.flags.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-red-400 mb-2">⚠️ Red Flags Found:</h4>
                        <ul className="space-y-2">
                          {emailAnalysis.flags.map((flag, i) => (
                            <li key={i} className="flex items-start text-sm text-gray-300">
                              <span className="mr-2">•</span>
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Highlighted Phrases */}
                    {emailAnalysis.highlightedPhrases.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-yellow-400 mb-2">🎯 Suspicious Phrases:</h4>
                        <div className="space-y-2">
                          {emailAnalysis.highlightedPhrases.map((phrase, i) => (
                            <div key={i} className="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded px-3 py-2 text-sm">
                              <span className="text-yellow-300 font-semibold">"{phrase.text}"</span>
                              <span className="text-gray-400 ml-2">— {phrase.risk}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    <div>
                      <h4 className="text-sm font-semibold text-green-400 mb-2">✓ What to Do:</h4>
                      <ul className="space-y-2">
                        {emailAnalysis.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start text-sm text-gray-300">
                            <span className="mr-2">→</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Tips Sidebar */}
          <div className="glass rounded-xl p-6 border border-purple-400 border-opacity-20">
            <h3 className="text-lg font-semibold text-white mb-4">
              {tab === 'url' ? '🔗 URL Tips' : '📧 Email Tips'}
            </h3>
            <ul className="space-y-3 text-sm">
              {tab === 'url' ? (
                <>
                  <li>✓ Check domain carefully—typos hide malware</li>
                  <li>✓ Avoid clicking suspicious links—hover to see real URL</li>
                  <li>✓ @ symbol in URL? That&apos;s a red flag!</li>
                  <li>✓ IP addresses instead of domains = sketchy</li>
                  <li>✓ Punycode (xn--) tricks browsers with lookalike chars</li>
                  <li>✓ Too many subdomains = likely phishing</li>
                  <li>✓ Free TLDs (.tk, .ml) are high-risk</li>
                  <li>✓ Always verify HTTPS certificate</li>
                </>
              ) : (
                <>
                  <li>✓ Urgent language = classic phishing tactic</li>
                  <li>✓ "Verify account" = credential theft attempt</li>
                  <li>✓ Payment/gift card requests = 99.9% phishing</li>
                  <li>✓ Bad grammar often signals fake emails</li>
                  <li>✓ Generic greetings (&quot;Dear User&quot;) = suspicious</li>
                  <li>✓ Unusual requests from "banks" = scam</li>
                  <li>✓ Check sender carefully (spoof email addresses)</li>
                  <li>✓ Hover links to see real URL before clicking</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div className="fixed bottom-4 right-4 glass rounded-lg px-4 py-2 text-sm text-blue-300 border border-blue-400 border-opacity-30">
            {feedback}
          </div>
        )}
      </div>
    </main>
  )
}
