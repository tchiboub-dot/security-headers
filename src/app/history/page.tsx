'use client'

import { useState, useEffect } from 'react'
import { formatDate, daysAgo } from '@/lib/utils'

interface Scan {
  id: string
  type: 'PASSWORD' | 'URL' | 'EMAIL'
  riskScore: number
  flags: string[]
  urlDomain?: string
  passwordLength?: number
  emailRedacted?: string
  createdAt: string
}

export default function History() {
  const [scans, setScans] = useState<Scan[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'PASSWORD' | 'URL' | 'EMAIL'>('ALL')
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'Low' | 'Medium' | 'High' | 'Critical'>('ALL')
  const [selectedScan, setSelectedScan] = useState<Scan | null>(null)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    fetchScans()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, riskFilter])

  const fetchScans = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter !== 'ALL') params.append('type', filter)
      if (riskFilter !== 'ALL') params.append('riskLevel', riskFilter)

      const res = await fetch(`/api/history?${params.toString()}`)
      const data = await res.json()
      setScans(data.scans || [])
    } catch (error) {
      console.error('Failed to fetch history:', error)
      setFeedback('Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteScan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scan?')) return

    try {
      const res = await fetch(`/api/history/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setScans(scans.filter(s => s.id !== id))
        setSelectedScan(null)
        setFeedback('Scan deleted')
        setTimeout(() => setFeedback(''), 2000)
      }
    } catch (error) {
      console.error('Failed to delete scan:', error)
      setFeedback('Failed to delete scan')
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-500 bg-red-500 bg-opacity-10'
    if (score >= 60) return 'text-orange-500 bg-orange-500 bg-opacity-10'
    if (score >= 40) return 'text-yellow-500 bg-yellow-500 bg-opacity-10'
    return 'text-green-500 bg-green-500 bg-opacity-10'
  }

  const getRiskLabel = (score: number) => {
    if (score >= 80) return 'Critical'
    if (score >= 60) return 'High'
    if (score >= 40) return 'Medium'
    return 'Low'
  }

  const getTypeIcon = (type: string) => {
    if (type === 'PASSWORD') return '🔐'
    if (type === 'URL') return '🔗'
    return '📧'
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 fade-in">
          <h1 className="text-5xl font-bold text-white mb-3">Scan History</h1>
          <p className="text-xl text-slate-300 font-medium mb-2">Access your security analysis records</p>
          <p className="text-slate-400 text-lg max-w-2xl">
            Review all your password strength and phishing analyses with advanced filtering and comprehensive reports.{scans.length > 0 && ` You have ${scans.length} ${scans.length === 1 ? 'scan' : 'scans'} saved.`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters */}
          <div className="glass rounded-xl p-6 border border-white border-opacity-10 h-fit sticky top-24">
            <h3 className="text-lg font-semibold text-white mb-4">🔍 Filters</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Type</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as typeof filter)}
                  className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="ALL">All Types</option>
                  <option value="PASSWORD">Passwords</option>
                  <option value="URL">URLs</option>
                  <option value="EMAIL">Emails</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Risk Level</label>
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value as typeof riskFilter)}
                  className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="ALL">All Levels</option>
                  <option value="Low">Low Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="High">High Risk</option>
                  <option value="Critical">Critical Risk</option>
                </select>
              </div>

              <button
                onClick={fetchScans}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Scans List */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-400">Loading scans...</p>
              </div>
            ) : scans.length === 0 ? (
              <div className="glass rounded-xl p-8 border border-white border-opacity-10 text-center">
                <p className="text-gray-400 mb-4">No scans found</p>
                <p className="text-sm text-gray-500">Run analyses to build your history</p>
              </div>
            ) : (
              scans.map((scan) => (
                <button
                  key={scan.id}
                  onClick={() => setSelectedScan(scan)}
                  className={`w-full text-left glass rounded-xl p-4 border transition hover:border-opacity-50 ${
                    selectedScan?.id === scan.id
                      ? 'border-blue-400 border-opacity-50'
                      : 'border-white border-opacity-10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{getTypeIcon(scan.type)}</span>
                        <span className="text-sm font-semibold text-gray-300">{scan.type}</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getRiskColor(scan.riskScore)}`}>
                          {getRiskLabel(scan.riskScore)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">{daysAgo(scan.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">{scan.riskScore}%</p>
                    </div>
                  </div>
                  {scan.type === 'URL' && scan.urlDomain && (
                    <p className="text-xs text-gray-400 mt-2 truncate">Domain: {scan.urlDomain}</p>
                  )}
                  {scan.type === 'PASSWORD' && scan.passwordLength && (
                    <p className="text-xs text-gray-400 mt-2">Length: {scan.passwordLength} chars</p>
                  )}
                  {scan.type === 'EMAIL' && scan.emailRedacted && (
                    <p className="text-xs text-gray-400 mt-2">Email: {scan.emailRedacted}</p>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detail View */}
        {selectedScan && (
          <div className="glass rounded-2xl p-6 mt-8 border border-blue-400 border-opacity-30">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {getTypeIcon(selectedScan.type)} {selectedScan.type} Analysis
                </h2>
                <p className="text-gray-400">{formatDate(selectedScan.createdAt)}</p>
              </div>
              <button
                onClick={() => handleDeleteScan(selectedScan.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white transition"
              >
                Delete
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Risk Score */}
              <div className="bg-white bg-opacity-5 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Risk Score</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-white">{selectedScan.riskScore}</p>
                  <p className={`text-lg font-semibold ${getRiskColor(selectedScan.riskScore)}`}>
                    / 100
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="bg-white bg-opacity-5 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Details</p>
                {selectedScan.type === 'PASSWORD' && selectedScan.passwordLength && (
                  <p className="text-white">Password Length: {selectedScan.passwordLength} characters</p>
                )}
                {selectedScan.type === 'URL' && selectedScan.urlDomain && (
                  <p className="text-white">Domain: {selectedScan.urlDomain}</p>
                )}
                {selectedScan.type === 'EMAIL' && selectedScan.emailRedacted && (
                  <p className="text-white">Email: {selectedScan.emailRedacted}</p>
                )}
              </div>
            </div>

            {/* Flags */}
            {selectedScan.flags.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-white mb-3">Findings:</h3>
                <ul className="space-y-2">
                  {selectedScan.flags.map((flag, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-300">
                      <span className="mr-2">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className="fixed bottom-4 right-4 glass rounded-lg px-4 py-2 text-sm text-green-300 border border-green-400 border-opacity-30">
            {feedback}
          </div>
        )}
      </div>
    </main>
  )
}
