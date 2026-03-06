# Password & Phishing Lab

> **Test password strength, detect phishing patterns, and learn security best practices.**

A comprehensive, production-ready full-stack web application for cybersecurity education and hands-on learning. Analyze password strength, detect phishing attacks, track security metrics, and master cybersecurity fundamentals with interactive lessons and quizzes.

## 🎯 Features

### Password Strength Analyzer
- **Real-time Analysis**: Instant feedback as you type
- **Comprehensive Scoring**: 0-100 score based on length, character variety, entropy, patterns
- **Actionable Feedback**: Specific suggestions for improvement
- **Secure Password Generator**: Create strong passwords with customizable options
- **Password Checklist**: Learn best practices with visual indicators
- **Pattern Detection**: Identifies keyboard sequences, leet speak, dates, common passwords
- **Banned Words**: Prevent passwords with personal information

### Phishing Detector
- **URL Analyzer**: 
  - Parse and analyze URL components
  - Detect IP addresses, punycode, suspicious TLDs
  - Flag typosquatting, excessive subdomains, malicious patterns
  - Risk score (0-100) with detailed explanations
  
- **Email Analyzer**:
  - Detect urgency language, threats, payment requests
  - Highlight phishing cues
  - Grammar/spelling error detection
  - Suspicious link detection
  - Risk assessment with recommendations

### History & Analytics
- Secure scan history with privacy controls
- Filter by type, risk level, date
- Detailed reports for each scan
- Delete individual scans or all history
- No raw password storage (hashed only)

### Interactive Learning
- **Lessons**: Password basics, phishing red flags, 2FA, safe browsing
- **Quizzes**: Test your knowledge with multiple-choice questions
- **Explanations**: Learn why answers are correct
- **Progress Tracking**: See your learning journey

### Security Features
- **Privacy First**: Never stores raw passwords
- **Secure Headers**: CSP, X-Frame-Options, X-Content-Type-Options
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Zod schema validation
- **Encryption**: HTTPS-only, data encrypted in transit
- **No Third-Party Sharing**: Your data is yours alone

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Glassmorphism UI with animated background

**Backend:**
- Next.js API Routes
- Node.js/Express-compatible runtime
- Zod for validation
- Rate limiting (in-memory)

**Database:**
- Prisma ORM
- PostgreSQL (production)
- SQLite (local development)

**Deployment:**
- Vercel (recommended)
- Environment-based configuration
- Easy PostgreSQL integration

## 📋 Pages & Routes

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Dashboard with feature overview |
| Password Analyzer | `/password-analyzer` | Analyze and test passwords |
| Phishing Detector | `/phishing-detector` | URL and email analysis |
| Learn | `/learn` | Interactive lessons and quizzes |
| History | `/history` | View and manage scan history |
| Settings | `/settings` | Privacy, theme, data management |
| Legal | `/legal` | Terms, disclaimer, privacy policy |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun
- PostgreSQL (production) or SQLite (development default)

### Local Development

```bash
# Clone repository
git clone <repo-url>
cd phishing-lab

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local if needed (default uses SQLite)

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

Visit `http://localhost:3000`

### Database Setup

**SQLite (Local Development - Default)**
```bash
# Uses file:./prisma/dev.db by default
# Already configured in .env.local
npm run db:migrate
```

**PostgreSQL (Production Ready)**
```bash
# Update .env.local:
DATABASE_URL="postgresql://user:password@localhost:5432/phishing_lab"

# Run migrations
npm run db:migrate
```

## 📦 API Endpoints

### Password Analysis
```bash
POST /api/password/analyze
{
  "password": "string",
  "bannedWords": ["optional", "array"]
}
```

### Phishing Detection
```bash
POST /api/phishing/url
{ "url": "string" }

POST /api/phishing/email
{ "emailText": "string" }
```

### History
```bash
GET /api/history?type=PASSWORD&riskLevel=High&limit=20
GET /api/history/:id
DELETE /api/history/:id
```

## 📊 Database Schema

```prisma
model Scan {
  id              String
  userId          String?      // Optional auth
  type            ScanType     // PASSWORD | URL | EMAIL
  riskScore       Int          // 0-100
  
  // Password fields
  passwordHash    String?      // SHA256 for duplicate detection
  passwordLength  Int?
  passwordMeta    Json?        // metrics, not raw password
  
  // URL fields
  urlNormalized   String?
  urlDomain       String?
  urlRiskFlags    String[]
  
  // Email fields
  emailRedacted   String?      // PII removed
  emailRiskFlags  String[]
  
  flags           String[]
  recommendations String[]
  createdAt       DateTime
}
```

## 🔒 Security Highlights

- ✅ **No Password Storage**: Raw passwords never stored
- ✅ **Hashed Passwords**: SHA256 for duplicate detection only
- ✅ **PII Redaction**: Emails redacted before storage
- ✅ **HTTPS Only**: All data encrypted in transit
- ✅ **CSP Headers**: Content Security Policy enabled
- ✅ **Rate Limiting**: IP-based request throttling
- ✅ **Input Validation**: Zod schema validation
- ✅ **No Third-Party Tracking**: Privacy-focused

## 🎨 UI/UX Features

- **Professional Design**: Cyber/space-themed background
- **Glassmorphism**: Frosted glass panels over photo background
- **Responsive**: Mobile-first, works on all devices
- **Dark Mode**: Eye-friendly dark theme (light mode coming soon)
- **Smooth Animations**: Transitions and fade-ins
- **Accessibility**: Full keyboard navigation, ARIA labels, focus states
- **Real-time Feedback**: Copy, delete, and save confirmations
- **Skeleton Loaders**: Loading states for API calls

## 📈 Performance

- ⚡ **Fast Load Times**: Next.js optimization
- 🎯 **Real-time Analysis**: Client-side password analysis
- 🔄 **Efficient Queries**: Indexed database fields
- 📱 **Mobile Optimized**: Responsive CSS Grid/Flexbox
- ♻️ **Memory Efficient**: Rate limiting cleanup

## 🧪 Testing Checklist

- [ ] Home page loads with all links functional
- [ ] Password analyzer works real-time  
- [ ] Password generator creates secure passwords
- [ ] Copy to clipboard functions
- [ ] URL analyzer detects various phishing patterns
- [ ] Email analyzer highlights suspicious phrases
- [ ] History saves and filters correctly
- [ ] History deletion works
- [ ] Learn page quizzes function
- [ ] Settings persist in localStorage
- [ ] Mobile responsive on all pages
- [ ] No console errors
- [ ] API rate limiting prevents abuse
- [ ] Database migrations work
- [ ] Vercel deployment successful

## 📖 Documentation

- **[Privacy Policy](/legal)**: How we handle your data
- **[Terms of Service](/legal)**: Legal terms
- **[Learn](/learn)**: Interactive lessons and quizzes
- **[Settings](/settings)**: Configure your experience

## 🌍 Deployment

### Vercel (Recommended)

```bash
# Connect GitHub repo to Vercel
# Add environment variable:
DATABASE_URL = postgresql://...

# Deploy
git push origin main
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### Environment Variables

**Development**
```env
DATABASE_URL="file:./prisma/dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

**Production**
```env
DATABASE_URL="postgresql://user:password@host:5432/phishlab"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NODE_ENV="production"
```

## 📝 Project Structure

```
phishing-lab/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── [route]/page.tsx   # Feature pages
│   ├── components/
│   │   └── Navbar.tsx
│   ├── lib/
│   │   ├── passwordAnalyzer.ts
│   │   ├── phishingAnalyzer.ts
│   │   ├── utils.ts
│   │   └── prisma.ts
│   └── app/
│       └── globals.css        # TailwindCSS + custom styles
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── .env.example              # Environment template
├── .env.local                # Local env (git-ignored)
├── next.config.js            # Next.js config
├── tailwind.config.ts        # Tailwind config
└── package.json              # Dependencies

```

## 🎓 Learning Resources

- **Password Best Practices**: [OWASP](https://owasp.org/)
- **Phishing Detection**: [Anti-Phishing Working Group](https://apwg.org/)
- **Cybersecurity Fundamentals**: [CISA](https://www.cisa.gov/)

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Database errors | Run `npm run db:migrate` |
| Port 3000 in use | `PORT=3001 npm run dev` |
| Prisma issues | Delete `node_modules`, reinstall, regenerate |
| Cache stale | Clear `.next` folder |

## 📄 License

Educational use. See [LICENSE](LICENSE) for details.

## 🤝 Contributing

Found a bug? Have a feature idea? 
- Report issues
- Suggest improvements  
- Submit pull requests

## 📞 Support

- **Documentation**: See `/learn` for lessons
- **FAQ**: Check [Legal](/legal) page
- **Issues**: GitHub issue tracker
- **Contact**: security@phishlab.local

---

**Built with ❤️ for cybersecurity education**

**Version:** 1.0.0  
**Last Updated:** March 2026
