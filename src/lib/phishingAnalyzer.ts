export interface URLAnalysis {
  riskScore: number
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'
  flags: string[]
  recommendations: string[]
  parsed: {
    domain: string
    subdomain: string
    tld: string
    path: string
    hasQuery: boolean
    protocol: string
  }
}

export interface EmailAnalysis {
  riskScore: number
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'
  flags: string[]
  recommendations: string[]
  highlightedPhrases: Array<{ text: string; risk: string }>
}

// Suspicious TLDs
const SUSPICIOUS_TLDS = new Set([
  'tk', 'ml', 'ga', 'cf', 'pw', 'gq', 'xyz', 'download',
  'icu', 'online', 'site', 'space', 'trade', 'accountant'
])

// Known brand keywords
const BRAND_KEYWORDS = [
  'amazon', 'apple', 'google', 'microsoft', 'facebook', 'twitter',
  'paypal', 'bank', 'chase', 'wells', 'citibank', 'irs', 'apple'
]

// Parse URL and extract components
function parseURL(url: string): URLAnalysis['parsed'] {
  try {
    // Add protocol if missing
    let urlToparse = url
    if (!url.match(/^https?:\/\//)) {
      urlToparse = 'http://' + url
    }

    const parsed = new URL(urlToparse)
    const hostname = parsed.hostname || ''
    const parts = hostname.split('.')
    const tld = parts.length > 0 ? parts[parts.length - 1] : ''
    const domain = parts.length > 1 ? parts[parts.length - 2] : ''
    const subdomain = parts.slice(0, -2).join('.')

    return {
      protocol: parsed.protocol || 'http:',
      subdomain: subdomain || 'none',
      domain,
      tld,
      path: parsed.pathname || '/',
      hasQuery: !!parsed.search,
    }
  } catch {
    return {
      protocol: 'unknown',
      subdomain: 'unknown',
      domain: 'unknown',
      tld: 'unknown',
      path: '/',
      hasQuery: false,
    }
  }
}

export function analyzeURL(url: string): URLAnalysis {
  const flags: string[] = []
  const recommendations: string[] = []
  let score = 0

  if (!url || url.trim().length === 0) {
    return {
      riskScore: 100,
      riskLevel: 'Critical',
      flags: ['Empty URL'],
      recommendations: ['Provide a valid URL to analyze'],
      parsed: parseURL(''),
    }
  }

  const parsed = parseURL(url)

  // Check for IP address in URL (common phishing)
  if (/(\d{1,3}\.){3}\d{1,3}/.test(url)) {
    flags.push('URL contains IP address instead of domain')
    recommendations.push('Legitimate sites use domain names, not IP addresses')
    score += 25
  }

  // Check for punycode URL (internationalized domain attack)
  if (url.includes('xn--')) {
    flags.push('URL contains punycode (possible unicode homograph attack)')
    recommendations.push('Be cautious with internationalized domains')
    score += 20
  }

  // Check for excessive subdomains
  const subdomainParts = parsed.subdomain.split('.')
  if (subdomainParts.length > 3) {
    flags.push('Too many subdomains')
    recommendations.push('Suspicious URLs often have multiple subdomains')
    score += 15
  }

  // Check for @ symbol in URL (credential theft)
  if (url.includes('@')) {
    flags.push('URL contains @ symbol (credential stealer pattern)')
    recommendations.push('Never click URLs with @ symbols—they may hide the real domain')
    score += 30
  }

  // Check for suspicious TLD
  if (SUSPICIOUS_TLDS.has(parsed.tld.toLowerCase())) {
    flags.push(`Suspicious TLD: .${parsed.tld}`)
    recommendations.push('These TLDs are commonly used in phishing campaigns')
    score += 20
  }

  // Check for excessive query parameters
  if (url.includes('?')) {
    const queryCount = (url.match(/[&?]/g) || []).length
    if (queryCount > 5) {
      flags.push('Excessive query parameters')
      recommendations.push('Complex URLs with many parameters can hide malicious intent')
      score += 10
    }
  }

  // Check for misleading path
  if (parsed.path.includes('login') || parsed.path.includes('signin') ||
      parsed.path.includes('verify') || parsed.path.includes('confirm')) {
    flags.push('Path contains common phishing keywords')
    recommendations.push('Verify this is the official site before entering credentials')
    score += 15
  }

  // Check for brand impersonation
  const urlLower = url.toLowerCase()
  for (const brand of BRAND_KEYWORDS) {
    if (urlLower.includes(brand) && !parsed.domain.toLowerCase().includes(brand)) {
      flags.push(`Contains "${brand}" but not as main domain`)
      recommendations.push(`Verify ${brand} is the primary domain, not in a subdomain`)
      score += 15
    }
  }

  // Check for typosquatting (simple heuristic)
  if (parsed.domain && parsed.domain.length > 1) {
    // Check for transposed letters
    if (/([a-z])\1/.test(parsed.domain) || parsed.domain.length > 20) {
      flags.push('Domain name appears unusual')
      recommendations.push('Check if the domain is spelled correctly')
      score += 10
    }
  }

  // If no flags, it seems legitimate
  if (flags.length === 0) {
    recommendations.push('This URL appears legitimate, but always verify the domain before entering sensitive information')
    score = 15
  }

  // Determine risk level
  let riskLevel: URLAnalysis['riskLevel'] = 'Low'
  if (score >= 80) riskLevel = 'Critical'
  else if (score >= 60) riskLevel = 'High'
  else if (score >= 40) riskLevel = 'Medium'

  return {
    riskScore: Math.min(100, score),
    riskLevel,
    flags,
    recommendations,
    parsed,
  }
}

// Phishing cue detection for emails
const URGENCY_PHRASES = [
  'verify', 'confirm', 'urgent', 'immediate', 'action required',
  'click here', 'act now', 'limited time', 'expire', 'expired', 'suspended'
]

const THREAT_PHRASES = [
  'account locked', 'access denied', 'unusual activity', 'suspicious',
  'illegal', 'violation', 'banned', 'restricted', 'compromised'
]

const PAYMENT_PHRASES = [
  'transfer', 'payment', 'credit card', 'billing', 'invoice',
  'wire transfer', 'gift card', 'money', 'purchase', 'refund',
  'update your account', 'update payment method'
]

const VERIFICATION_PHRASES = [
  'verify account', 'confirm identity', 'validate', 're-enter', 'update information',
  'confirm details', 'validate account', 'security check'
]

const SUSPICIOUS_GRAMMAR = [
  'dear user', 'dear valued', 'dear customer',
  'to whom it may concern', 'greetings',
  'you have been', 'we have detected'
]

export function analyzeEmail(emailText: string): EmailAnalysis {
  const flags: string[] = []
  const recommendations: string[] = []
  const highlightedPhrases: EmailAnalysis['highlightedPhrases'] = []
  let score = 0

  if (!emailText || emailText.trim().length === 0) {
    return {
      riskScore: 0,
      riskLevel: 'Low',
      flags: [],
      recommendations: ['Paste email content to analyze'],
      highlightedPhrases: [],
    }
  }

  const lowerEmail = emailText.toLowerCase()

  // Check for urgency language
  for (const phrase of URGENCY_PHRASES) {
    if (lowerEmail.includes(phrase)) {
      highlightedPhrases.push({ text: phrase, risk: 'Urgency language' })
      flags.push('Urgency language detected')
      score += 10
      break
    }
  }

  // Check for threats
  for (const phrase of THREAT_PHRASES) {
    if (lowerEmail.includes(phrase)) {
      highlightedPhrases.push({ text: phrase, risk: 'Threat language' })
      flags.push('Threatening language detected')
      score += 15
      break
    }
  }

  // Check for payment/gift card requests
  for (const phrase of PAYMENT_PHRASES) {
    if (lowerEmail.includes(phrase)) {
      highlightedPhrases.push({ text: phrase, risk: 'Payment request' })
      flags.push('Payment or money transfer request detected')
      score += 20
      break
    }
  }

  // Check for verification/credential requests
  for (const phrase of VERIFICATION_PHRASES) {
    if (lowerEmail.includes(phrase)) {
      highlightedPhrases.push({ text: phrase, risk: 'Credential request' })
      flags.push('Request to verify or update account information')
      score += 20
      break
    }
  }

  // Check for suspicious greetings
  for (const phrase of SUSPICIOUS_GRAMMAR) {
    if (lowerEmail.includes(phrase)) {
      highlightedPhrases.push({ text: phrase, risk: 'Generic greeting' })
      flags.push('Generic or impersonal greeting')
      score += 10
      break
    }
  }

  // Check for suspicious links
  const urlPattern = /https?:\/\/[^\s]+/g
  const urls = emailText.match(urlPattern) || []
  if (urls.length > 0) {
    const suspiciousUrls = urls.filter(url => {
      const analysis = analyzeURL(url)
      return analysis.riskLevel === 'High' || analysis.riskLevel === 'Critical'
    })
    if (suspiciousUrls.length > 0) {
      flags.push(`${suspiciousUrls.length} suspicious link(s) detected`)
      highlightedPhrases.push({ text: 'Suspicious links', risk: 'Malicious URL' })
      score += 25
    }
  }

  // Check for typos and grammar errors (simple heuristic)
  const commonMisspellings = emailText.match(/\b(cmpany|recieve|adress|passowrd|confirme|verifiction)\b/gi)
  if (commonMisspellings && commonMisspellings.length > 0) {
    flags.push('Multiple spelling/grammar errors')
    recommendations.push('Legitimate companies maintain professional communication standards')
    score += 15
  }

  // Determine risk level
  let riskLevel: EmailAnalysis['riskLevel'] = 'Low'
  if (score >= 80) riskLevel = 'Critical'
  else if (score >= 60) riskLevel = 'High'
  else if (score >= 40) riskLevel = 'Medium'

  // Add recommendations based on score
  if (riskLevel === 'Low') {
    recommendations.push('This email appears legitimate, but always verify sender identity')
  } else if (riskLevel === 'Medium') {
    recommendations.push('Approach with caution. Verify the sender independently.')
    recommendations.push('Do not click links or download attachments from untrusted senders.')
  } else if (riskLevel === 'High' || riskLevel === 'Critical') {
    recommendations.push('This email has multiple phishing indicators.')
    recommendations.push('Do NOT click any links or download attachments.')
    recommendations.push('Report the email as phishing to your email provider.')
    recommendations.push('Delete the email immediately.')
  }

  return {
    riskScore: Math.min(100, score),
    riskLevel,
    flags,
    recommendations,
    highlightedPhrases,
  }
}
