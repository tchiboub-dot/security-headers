import crypto from 'crypto'

export interface PasswordAnalysis {
  score: number
  strength: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong'
  flags: string[]
  suggestions: string[]
  metrics: {
    length: number
    hasUppercase: boolean
    hasLowercase: boolean
    hasNumbers: boolean
    hasSymbols: boolean
    entropy: number
    uniqueChars: number
  }
}

// Common passwords list (simplified - in production, use a larger database)
const COMMON_PASSWORDS = new Set([
  'password', '123456', '12345678', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'master', 'sunshine',
  'princess', 'qazwsx', '1q2w3e4r', 'iloveyou', '666666', '123123',
  'football', 'batman', 'trustno1', '1234567890', 'internet', 'shadow',
  'ashley', 'michael', 'superman', '1q2w3e', 'baseball', 'myspace1',
  'passw0rd', 'starwars', 'chocolate', 'passpass', '123456789', 'aaaaaa',
])

// Keyboard sequences to detect
const KEYBOARD_SEQUENCES = [
  'qwerty', 'qwertyuiop', 'asdfgh', 'zxcvbnm', '123456',
  'qazwsx', 'qweasd', 'poiuytrewq', 'asdqwe'
]

// Detect repeated characters
function hasExcessiveRepeat(password: string): boolean {
  return /(.)\1{2,}/.test(password)
}

// Detect keyboard sequences
function hasKeyboardSequence(password: string): boolean {
  const lowercase = password.toLowerCase()
  return KEYBOARD_SEQUENCES.some(seq => lowercase.includes(seq))
}

// Detect potential leet speak
function hasLeetSpeak(password: string): boolean {
  return /[0135478]/.test(password)
}

// Detect year/date patterns
function hasYearOrDate(password: string): boolean {
  return /19\d{2}|20\d{2}|0?[1-9]|1[0-2](?:[0-3]\d)/.test(password)
}

// Calculate password entropy
function calculateEntropy(password: string): number {
  const charsetSize = 0 +
    (password.match(/[a-z]/) ? 26 : 0) +
    (password.match(/[A-Z]/) ? 26 : 0) +
    (password.match(/[0-9]/) ? 10 : 0) +
    (password.match(/[^a-zA-Z0-9]/) ? 32 : 0)

  return password.length * Math.log2(charsetSize)
}

export function analyzePassword(password: string, bannedWords: string[] = []): PasswordAnalysis {
  const flags: string[] = []
  const suggestions: string[] = []
  let score = 0

  // Basic metrics
  const length = password.length
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumbers = /[0-9]/.test(password)
  const hasSymbols = /[^a-zA-Z0-9]/.test(password)
  const entropy = calculateEntropy(password)
  const uniqueChars = new Set(password).size

  // Length score (0-25 points)
  if (length < 6) {
    flags.push('Too short')
    suggestions.push('Use at least 8 characters')
  } else if (length < 8) {
    score += 10
    flags.push('Short')
    suggestions.push('Consider using 12+ characters for better security')
  } else if (length < 12) {
    score += 15
  } else if (length < 16) {
    score += 20
  } else {
    score += 25
  }

  // Character variety (0-25 points)
  let varietyScore = 0
  if (hasLowercase) varietyScore += 6
  if (hasUppercase) varietyScore += 6
  if (hasNumbers) varietyScore += 6
  if (hasSymbols) varietyScore += 7

  if (varietyScore < 12) {
    flags.push('Low character variety')
    suggestions.push('Use a mix of uppercase, lowercase, numbers, and symbols')
  }
  score += varietyScore

  // Common password check (0-15 points)
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    flags.push('Common password')
    suggestions.push('This password is commonly used—choose a more unique one')
  } else {
    score += 15
  }

  // Banned words check (0-10 points)
  let hasBannedWord = false
  const lowerPassword = password.toLowerCase()
  for (const banned of bannedWords) {
    if (lowerPassword.includes(banned.toLowerCase())) {
      flags.push(`Contains banned word: "${banned}"`)
      hasBannedWord = true
      break
    }
  }
  if (!hasBannedWord) {
    score += 10
  }

  // Pattern detection (penalties)
  if (hasExcessiveRepeat(password)) {
    flags.push('Excessive character repetition')
    suggestions.push('Avoid repeating the same character more than twice')
    score = Math.max(0, score - 10)
  }

  if (hasKeyboardSequence(password)) {
    flags.push('Contains keyboard sequence')
    suggestions.push('Avoid keyboard patterns like "qwerty"')
    score = Math.max(0, score - 10)
  }

  if (hasLeetSpeak(password)) {
    flags.push('Contains obvious leet speak')
    suggestions.push('Use more creative character substitutions')
    score = Math.max(0, score - 5)
  }

  if (hasYearOrDate(password)) {
    flags.push('Contains year or date')
    suggestions.push('Avoid using personal dates or years')
    score = Math.max(0, score - 5)
  }

  // Entropy bonus
  if (entropy > 50) {
    score = Math.min(100, score + 5)
  }

  // Final suggestions if score is low
  if (score < 40) {
    suggestions.push('Increase password complexity with a mix of character types')
  }
  if (score < 60) {
    suggestions.push('Make your password longer and more random')
  }

  // Determine strength
  let strength: PasswordAnalysis['strength'] = 'Very Weak'
  if (score >= 90) strength = 'Very Strong'
  else if (score >= 75) strength = 'Strong'
  else if (score >= 60) strength = 'Good'
  else if (score >= 40) strength = 'Fair'
  else if (score >= 20) strength = 'Weak'

  return {
    score: Math.min(100, Math.max(0, score)),
    strength,
    flags,
    suggestions,
    metrics: {
      length,
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSymbols,
      entropy: Math.round(entropy * 10) / 10,
      uniqueChars,
    },
  }
}

// Generate a secure password
export function generateSecurePassword(options = {
  length: 16,
  includeSymbols: true,
  avoidAmbiguous: true,
  pronounceable: false,
}): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  const ambiguous = 'il1Lo0O'

  let chars = lowercase + uppercase + numbers
  if (options.includeSymbols) chars += symbols
  if (options.avoidAmbiguous) {
    chars = chars.split('').filter(c => !ambiguous.includes(c)).join('')
  }

  let password = ''
  // Ensure we have at least one of each required type
  const required = [
    lowercase[Math.floor(Math.random() * lowercase.length)],
    uppercase[Math.floor(Math.random() * uppercase.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
  ]
  if (options.includeSymbols) {
    required.push(symbols[Math.floor(Math.random() * symbols.length)])
  }

  password = required.join('')

  // Fill the rest randomly
  while (password.length < options.length) {
    password += chars[Math.floor(Math.random() * chars.length)]
  }

  // Shuffle
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

// Hash password for duplicate detection (SHA256)
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}
