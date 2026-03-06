import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { analyzePassword, hashPassword } from '@/lib/passwordAnalyzer'
import { prisma } from '@/lib/prisma'

const PasswordAnalysisSchema = z.object({
  password: z.string().min(1).max(500),
  bannedWords: z.array(z.string()).optional().default([]),
  saveHistory: z.boolean().optional().default(false),
})

// Simple rate limiting (in-memory, basic)
const requestCounts: Record<string, number> = {}

function isRateLimited(clientIp: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now()
  const key = `${clientIp}-${Math.floor(now / windowMs)}`

  if (!requestCounts[key]) {
    requestCounts[key] = 0
  }

  requestCounts[key]++

  if (requestCounts[key] > limit) {
    return true
  }

  return false
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    // Rate limiting
    if (isRateLimited(clientIp, 20)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before analyzing again.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validated = PasswordAnalysisSchema.parse(body)

    // Analyze password
    const analysis = analyzePassword(validated.password, validated.bannedWords)

    // Save to history if enabled
    if (validated.saveHistory && process.env.DATABASE_URL) {
      try {
        const passwordHash = hashPassword(validated.password)
        await prisma.scan.create({
          data: {
            type: 'PASSWORD',
            riskScore: Math.round(100 - analysis.score),
            passwordHash,
            passwordLength: analysis.metrics.length,
            passwordMeta: JSON.stringify({
              length: analysis.metrics.length,
              hasUpper: analysis.metrics.hasUppercase,
              hasLower: analysis.metrics.hasLowercase,
              hasNumbers: analysis.metrics.hasNumbers,
              hasSymbols: analysis.metrics.hasSymbols,
              entropy: analysis.metrics.entropy,
              uniqueChars: analysis.metrics.uniqueChars,
            }),
            flags: JSON.stringify(analysis.flags),
            recommendations: JSON.stringify(analysis.suggestions),
            rawAnalysis: JSON.stringify(analysis),
          },
        })
      } catch (dbError) {
        console.error('Database error saving scan:', dbError)
      }
    }

    return NextResponse.json(analysis, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request. Password is required.' },
        { status: 400 }
      )
    }

    console.error('Password analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze password' },
      { status: 500 }
    )
  }
}
