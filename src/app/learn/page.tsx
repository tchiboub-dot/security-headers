'use client'
/* eslint-disable react/no-unescaped-entities */

import { useState } from 'react'

interface Lesson {
  id: string
  title: string
  icon: string
  description: string
  content: string
}

interface Quiz {
  id: string
  title: string
  questions: Question[]
}

interface Question {
  id: string
  text: string
  options: string[]
  correct: number
  explanation: string
}

const lessons: Lesson[] = [
  {
    id: 'pwd-basics',
    title: 'Password Basics',
    icon: '🔐',
    description: 'Learn why strong passwords matter and how to create them.',
    content: `A strong password is your first line of defense against cyber attacks. 
    
Key Principles:
• Length > Complexity: Aim for 12+ characters
• Character Variety: Mix uppercase, lowercase, numbers, and symbols
• Uniqueness: Use different passwords for different accounts
• Memorability vs Security: Use passphrases instead of random characters
• Never Reuse: Each account should have a unique password

Common Mistakes:
❌ Using personal information (birthdate, names)
❌ Sequential numbers (123456)
❌ Keyboard patterns (qwerty)
❌ Dictionary words
❌ Obvious substitutions (p@ssw0rd)

Best Practices:
✓ Use a passphrase: "BlueBanana-Sunrise#42"
✓ Enable two-factor authentication (2FA)
✓ Use a password manager
✓ Change passwords if compromised
✓ Never share via email or chat`
  },
  {
    id: 'phishing-signs',
    title: 'Phishing Red Flags',
    icon: '⚠️',
    description: 'Recognize common phishing tactics and protect yourself.',
    content: `Phishing is the most common cyber attack. Learn to spot it.

Classic Phishing Indicators:
🚩 Urgent language ("Act immediately", "Verify now")
🚩 Unusual requests (passwords, credit card info)
🚩 Generic greetings ("Dear Customer")
🚩 Grammar/spelling errors
🚩 Suspicious sender addresses
🚩 Links that don't match the displayed text
🚩 Shortened URLs (tinyurl, bit.ly)
🚩 Fake login pages
🚩 Requests for gift cards or money

URL Warning Signs:
🚩 IP address instead of domain
🚩 Extra dots in domain (paypa1.com vs paypal.com)
🚩 @ symbol in URL
🚩 Too many subdomains
🚩 Punycode (xn--) tricks

Email Red Flags:
🚩 "Verify your account"
🚩 "Unusual activity detected"
🚩 "Update payment method"
🚩 "Confirm your identity"
🚩 "Click here to activate"

What To Do:
✓ Hover over links to check real URL
✓ Contact the company directly
✓ Never click attachments from unknown senders
✓ Report phishing to your email provider
✓ Enable two-factor authentication`
  },
  {
    id: 'two-factor',
    title: 'Two-Factor Authentication',
    icon: '🔑',
    description: 'Understand why 2FA is essential for account security.',
    content: `Two-Factor Authentication (2FA) adds an extra security layer.

Types of 2FA:
📱 SMS Codes: Text to your phone
🔐 Authenticator Apps: Google Authenticator, Authy
🔑 Security Keys: Physical devices (YubiKey)
📧 Email Codes: Verification links via email
☎️ Phone Calls: Voice verification

Why 2FA Matters:
✓ Password alone isn't enough
✓ Protects against phishing even if password stolen
✓ Adds time barrier for attackers
✓ Prevents unauthorized access

Most Secure to Least:
1. Security keys (physical)
2. Authenticator apps (time-based)
3. SMS codes
4. Email verification

Best Practices:
✓ Enable 2FA on all important accounts
✓ Use authenticator apps over SMS
✓ Save backup codes in secure location
✓ Use a password manager with 2FA integration
✓ Keep authenticator device secure`
  },
  {
    id: 'safe-browsing',
    title: 'Safe Browsing Habits',
    icon: '🌐',
    description: 'Stay safe while browsing the internet.',
    content: `Your browsing habits directly impact your security.

Browser Security:
🔒 HTTPS: Always use (lock icon in address bar)
🔍 Check domains carefully before logging in
⚠️ Update browser regularly (security patches)
🧩 Use security extensions (uBlock Origin, Privacy Badger)
🍪 Clear cookies/cache periodically

Password Management:
✓ Use a password manager (1Password, Bitwarden, LastPass)
✓ Let it auto-fill (avoids typosquatting)
✓ Never use browser "save password" for sensitive sites
✓ Keep master password strong

Suspicious Content:
⚠️ Pop-ups claiming virus warnings
⚠️ "You won a prize!" banners
⚠️ Unusual download prompts
⚠️ File downloads from odd sources
⚠️ Fake software updates

Public WiFi Safety:
🚫 Avoid sensitive transactions
✓ Use VPN on public networks
✓ Disable auto-connect
✓ Don't stay logged in to important accounts
✓ Use your phone hotspot when possible`
  },
]

const quizzes: Quiz[] = [
  {
    id: 'password-quiz',
    title: 'Password Security Quiz',
    questions: [
      {
        id: 'q1',
        text: 'Which password is strongest?',
        options: [
          'MyBirthday1990',
          'MyPassword123',
          'BlueSunrise#Elephant42',
          'admin123'
        ],
        correct: 2,
        explanation: 'Longer passphrases with mixed characters are stronger. Personal dates are weak.'
      },
      {
        id: 'q2',
        text: 'What is the minimum recommended password length?',
        options: ['6 characters', '8 characters', '12 characters', '20 characters'],
        correct: 2,
        explanation: '12 characters provides good security balance. Longer is always better.'
      },
      {
        id: 'q3',
        text: 'Should you reuse passwords across multiple accounts?',
        options: ['Yes, easier to remember', 'Only for unimportant accounts', 'Never', 'Only for 2 accounts'],
        correct: 2,
        explanation: 'Never reuse passwords. Each account needs a unique password.'
      },
    ]
  },
  {
    id: 'phishing-quiz',
    title: 'Phishing Detection Quiz',
    questions: [
      {
        id: 'q1',
        text: 'What is a major phishing indicator?',
        options: [
          'Professional design',
          'Urgent language asking to verify account',
          'Clear sender information',
          'Proper grammar'
        ],
        correct: 1,
        explanation: 'Urgent language is a classic phishing tactic.'
      },
      {
        id: 'q2',
        text: 'You receive an email from your bank asking to "update payment method". What should you do?',
        options: [
          'Click the link and update',
          'Reply with your information',
          'Contact the bank directly using their official website',
          'Ignore and delete'
        ],
        correct: 2,
        explanation: 'Always contact companies directly using official channels, never via email links.'
      },
      {
        id: 'q3',
        text: 'What does the @ symbol in a URL mean?',
        options: [
          'It\'s normal and safe',
          'It can hide the real domain',
          'It indicates the site is official',
          'It has no security significance'
        ],
        correct: 1,
        explanation: 'The @ symbol in URLs is a known phishing trick to hide the real domain.'
      },
    ]
  },
]

export default function Learn() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  const getCurrentQuiz = () => quizzes.find(q => q.id === selectedQuiz)
  const currentLesson = lessons.find(l => l.id === selectedLesson)

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answerIndex }))
  }

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true)
  }

  const calculateScore = () => {
    const quiz = getCurrentQuiz()
    if (!quiz) return 0
    
    let correct = 0
    quiz.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correct) correct++
    })
    return Math.round((correct / quiz.questions.length) * 100)
  }

  return (
    <main className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="glass rounded-2xl p-8 mb-8 border border-purple-400 border-opacity-30">
          <h1 className="text-4xl font-bold text-white mb-2">📚 Security Learning Academy</h1>
          <p className="text-gray-300">
            Master cybersecurity fundamentals with interactive lessons and quizzes.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass rounded-xl p-6 border border-white border-opacity-10 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-4">Course Content</h2>
              
              {/* Lessons */}
              <div className="space-y-2 mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase">Lessons</p>
                {lessons.map(lesson => (
                  <button
                    key={lesson.id}
                    onClick={() => { setSelectedLesson(lesson.id); setSelectedQuiz(null) }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                      selectedLesson === lesson.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    {lesson.icon} {lesson.title}
                  </button>
                ))}
              </div>

              {/* Quizzes */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">Quizzes</p>
                <div className="space-y-2">
                  {quizzes.map(quiz => (
                    <button
                      key={quiz.id}
                      onClick={() => { setSelectedQuiz(quiz.id); setSelectedLesson(null); setQuizSubmitted(false); setQuizAnswers({}) }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                        selectedQuiz === quiz.id
                          ? 'bg-green-600 text-white'
                          : 'text-gray-300 hover:bg-white hover:bg-opacity-10'
                      }`}
                    >
                      ✓ {quiz.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2">
            {selectedLesson && currentLesson && (
              <div className="glass rounded-xl p-8 border border-blue-400 border-opacity-30">
                <div className="mb-6">
                  <p className="text-4xl mb-2">{currentLesson.icon}</p>
                  <h2 className="text-3xl font-bold text-white mb-2">{currentLesson.title}</h2>
                  <p className="text-gray-400">{currentLesson.description}</p>
                </div>

                <div className="border-t border-white border-opacity-10 pt-6 text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {currentLesson.content}
                </div>
              </div>
            )}

            {selectedQuiz && getCurrentQuiz() && !quizSubmitted && (
              <div className="glass rounded-xl p-8 border border-green-400 border-opacity-30">
                <h2 className="text-3xl font-bold text-white mb-6">{getCurrentQuiz()!.title}</h2>

                <div className="space-y-8">
                  {getCurrentQuiz()!.questions.map((question, qIndex) => (
                    <div key={question.id} className="bg-white bg-opacity-5 rounded-lg p-6 border border-white border-opacity-10">
                      <p className="font-semibold text-white mb-4">
                        {qIndex + 1}. {question.text}
                      </p>

                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <button
                            key={oIndex}
                            onClick={() => handleQuizAnswer(question.id, oIndex)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition border-2 ${
                              quizAnswers[question.id] === oIndex
                                ? 'border-blue-500 bg-blue-500 bg-opacity-20'
                                : 'border-white border-opacity-20 hover:border-opacity-40'
                            }`}
                          >
                            <span className="mr-3">{String.fromCharCode(65 + oIndex)}.</span>
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(quizAnswers).length < getCurrentQuiz()!.questions.length}
                  className="w-full mt-8 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-semibold text-white transition"
                >
                  Submit Quiz
                </button>
              </div>
            )}

            {selectedQuiz && getCurrentQuiz() && quizSubmitted && (
              <div className="glass rounded-xl p-8 border border-white border-opacity-30">
                <div className="text-center mb-8">
                  <p className="text-6xl font-bold text-green-400 mb-2">{calculateScore()}%</p>
                  <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
                  <p className="text-gray-300">
                    Excellent work! You've completed the quiz.
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {getCurrentQuiz()!.questions.map((question, qIndex) => {
                    const userAnswer = quizAnswers[question.id]
                    const isCorrect = userAnswer === question.correct
                    
                    return (
                      <div key={question.id} className={`rounded-lg p-6 border-2 ${
                        isCorrect
                          ? 'border-green-500 bg-green-500 bg-opacity-10'
                          : 'border-red-500 bg-red-500 bg-opacity-10'
                      }`}>
                        <p className="font-semibold text-white mb-3">
                          {qIndex + 1}. {question.text}
                        </p>
                        <p className={`text-sm mb-2 ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                          {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                        </p>
                        <p className="text-sm text-gray-300 mb-3">
                          Your answer: <span className="text-white">{question.options[userAnswer]}</span>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-gray-300">
                            Correct answer: <span className="text-green-300">{question.options[question.correct]}</span>
                          </p>
                        )}
                        <p className="text-sm text-gray-400 mt-3">
                          💡 {question.explanation}
                        </p>
                      </div>
                    )
                  })}
                </div>

                <button
                  onClick={() => { setSelectedQuiz(null); setQuizAnswers({}); setQuizSubmitted(false) }}
                  className="w-full mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition"
                >
                  Back to Courses
                </button>
              </div>
            )}

            {!selectedLesson && !selectedQuiz && (
              <div className="glass rounded-xl p-8 border border-white border-opacity-10 text-center">
                <p className="text-gray-400 text-lg">
                  Select a lesson or quiz to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
