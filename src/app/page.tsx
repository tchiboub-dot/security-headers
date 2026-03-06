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
      description: 'Test password strength, receive real-time scoring, and generate secure passwords with actionable recommendations.',
      href: '/password-analyzer',
      icon: (
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
          </svg>
        </div>
      ),
    },
    {
      title: 'Phishing Detector',
      description: 'Analyze URLs and emails for phishing patterns, suspicious domains, and security red flags with expert assessment.',
      href: '/phishing-detector',
      icon: (
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 15.572 5.013a3 3 0 11-4.95 3.944L5.007 9A4 4 0 1016 4l-1.307 1.547a3 3 0 01-2.216 1.343H6.05a3 3 0 000 6h.05a3 3 0 00.217-5.9" clipRule="evenodd" />
          </svg>
        </div>
      ),
    },
    {
      title: 'Security Learning Center',
      description: 'Master cybersecurity fundamentals through interactive lessons and quizzes designed for all skill levels.',
      href: '/learn',
      icon: (
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </div>
      ),
    },
    {
      title: 'Scan History & Analytics',
      description: 'Review your security analysis history with advanced filtering, detailed insights, and comprehensive reporting.',
      href: '/history',
      icon: (
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        </div>
      ),
    },
  ]

  const features = [
    {
      title: 'Real-Time Analysis',
      description: 'Instant feedback as you type with advanced cryptographic algorithms and pattern detection.',
      icon: '⚡',
    },
    {
      title: 'Privacy-First Design',
      description: 'Passwords are never stored or transmitted. All analysis happens client-side.',
      icon: '🔒',
    },
    {
      title: 'Educational Focused',
      description: 'Learn why passwords are weak and how to spot phishing attempts with detailed explanations.',
      icon: '🎓',
    },
    {
      title: 'Detailed Reporting',
      description: 'Download comprehensive PDF reports with actionable security recommendations.',
      icon: '📊',
    },
    {
      title: 'Secure History',
      description: 'Track your analyses with searchable history. Never worry about your data security.',
      icon: '📚',
    },
    {
      title: 'Expert Guidance',
      description: 'Receive specific, actionable advice to improve your security posture immediately.',
      icon: '💡',
    },
  ]

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16 fade-in">
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 leading-tight">
              Your Cybersecurity Guardian
            </h1>
            <p className="text-xl text-slate-300 mb-2 font-medium">
              Master password security and phishing detection with instant analysis and expert guidance.
            </p>
            <p className="text-base text-slate-400 mb-8 max-w-2xl leading-relaxed">
              PhishLab is your comprehensive security education platform. Analyze password strength, detect phishing threats, and learn cybersecurity best practices through interactive lessons and real-time feedback.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link
              href="/password-analyzer"
              className="px-7 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
              </svg>
              Start Password Analysis
            </Link>
            <Link
              href="/phishing-detector"
              className="px-7 py-3 rounded-lg font-semibold text-slate-200 border border-slate-600 hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 15.572 5.013a3 3 0 11-4.95 3.944L5.007 9A4 4 0 1016 4l-1.307 1.547a3 3 0 01-2.216 1.343H6.05a3 3 0 000 6h.05a3 3 0 00.217-5.9" clipRule="evenodd" />
              </svg>
              Check for Phishing
            </Link>
          </div>

          {/* Trust Elements */}
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.293 5.293a1 1 0 011.414 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z" clipRule="evenodd" />
              </svg>
              Privacy First - No Storage
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.293 5.293a1 1 0 011.414 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z" clipRule="evenodd" />
              </svg>
              Instant Results
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.293 5.293a1 1 0 011.414 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z" clipRule="evenodd" />
              </svg>
              Educational Feedback
            </span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: 'Total Scans', value: loading ? '...' : stats.total, icon: '📊' },
            { label: 'Passwords Analyzed', value: '0', icon: '🔐' },
            { label: 'URLs Checked', value: '0', icon: '🔗' },
            { label: 'Emails Scanned', value: '0', icon: '📧' },
          ].map((stat) => (
            <div key={stat.label} className="surface card-hover p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl opacity-60">{stat.icon}</div>
                <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042L5.960 9H9a2 2 0 100-4H6.77l-.447-1.788A1 1 0 004 1H3zM15 13a2 2 0 110 4H4v2h11a4 4 0 100-8v-2a2 2 0 012 2z" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm font-medium mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tools Section */}
        <div className="mb-16">
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-white mb-3">Powerful Security Tools</h2>
            <p className="text-slate-400 text-lg max-w-2xl">
              Comprehensive suite of tools to strengthen your cybersecurity posture and understand digital threats.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="block group"
              >
                <div className="surface card-hover p-8 h-full flex flex-col">
                  <div className="mb-5">{tool.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-200">
                    {tool.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="flex items-center text-blue-400 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Explore Tool
                    <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="surface p-10 md:p-12">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-white mb-3">Why Choose PhishLab?</h2>
            <p className="text-slate-400 text-lg max-w-2xl">
              Built for security professionals and everyday users who take cybersecurity seriously.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="group">
                <div className="flex items-start gap-4">
                  <div className="text-4xl mt-1">{feature.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Footer */}
      <footer className="footer-container">
        <div className="footer-content">
          <p className="footer-text">
            © 2026 PhishLab. All rights reserved. Created by{' '}
            <a href="/" title="PhishLab Creator">
              Taha Adnane Chiboub
            </a>
            .
          </p>
        </div>
      </footer>
    </main>
  )
}
