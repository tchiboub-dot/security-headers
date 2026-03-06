'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [stats, setStats] = useState({ total: 0, passwords: 0, urls: 0, emails: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/history?limit=1')
        const data = await res.json()
        setStats({
          total: data.total || 0,
          passwords: 0,
          urls: 0,
          emails: 0,
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const tools = [
    {
      title: 'Password Strength Analyzer',
      description: 'Test password strength, get actionable feedback, and generate secure passwords.',
      icon: '🔐',
      href: '/password-analyzer',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Phishing Detector',
      description: 'Analyze URLs and emails for phishing patterns and suspicious indicators.',
      icon: '⚠️',
      href: '/phishing-detector',
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Learning Academy',
      description: 'Interactive lessons and quizzes to master cybersecurity fundamentals.',
      icon: '📚',
      href: '/learn',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Scan History',
      description: 'Review your previous analyses with filters and detailed reports.',
      icon: '📋',
      href: '/history',
      color: 'from-green-500 to-emerald-500',
    },
  ]

  return (
    <main className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="glass rounded-2xl p-8 sm:p-12 mb-12 border border-blue-400 border-opacity-30">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Password & Phishing Lab
          </h1>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl">
            Test password strength, detect phishing patterns, and learn security best practices. 
            Our comprehensive security education platform helps you protect yourself online.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/password-analyzer"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition transform hover:scale-105"
            >
              Analyze Password →
            </Link>
            <Link
              href="/phishing-detector"
              className="px-6 py-3 border border-blue-400 hover:bg-blue-400 hover:bg-opacity-20 rounded-lg font-semibold transition"
            >
              Check Phishing URL →
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Total Scans', value: loading ? '-' : stats.total, icon: '📊' },
            { label: 'Passwords', value: stats.passwords, icon: '🔐' },
            { label: 'URLs', value: stats.urls, icon: '🔗' },
            { label: 'Emails', value: stats.emails, icon: '📧' },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-6 border border-white border-opacity-10">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8">Security Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group"
              >
                <div className="glass rounded-xl p-6 border border-white border-opacity-10 hover:border-opacity-30 transition h-full hover:scale-105 transform duration-300">
                  <div className="text-5xl mb-4">{tool.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition">
                    {tool.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    {tool.description}
                  </p>
                  <div className="flex items-center text-blue-400 text-sm font-semibold group-hover:translate-x-2 transition">
                    Get Started →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="glass rounded-2xl p-8 border border-green-400 border-opacity-20">
          <h2 className="text-3xl font-bold text-white mb-8">Why Use PhishLab?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Real-time Analysis',
                description: 'Get instant feedback as you type with our advanced algorithms.',
                icon: '⚡',
              },
              {
                title: 'Educational Focus',
                description: 'Learn why passwords are weak and how phishing works.',
                icon: '🎓',
              },
              {
                title: 'Privacy First',
                description: 'We never store passwords. Your data is completely safe.',
                icon: '🔒',
              },
              {
                title: 'Comprehensive Reports',
                description: 'Download detailed PDF reports for your analysis results.',
                icon: '📄',
              },
              {
                title: 'History Tracking',
                description: 'Keep track of your scans with searchable, secure history.',
                icon: '📚',
              },
              {
                title: 'Expert Recommendations',
                description: 'Get actionable advice to improve your security posture.',
                icon: '💡',
              },
            ].map((feature) => (
              <div key={feature.title} className="border-l-4 border-blue-400 pl-4">
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
