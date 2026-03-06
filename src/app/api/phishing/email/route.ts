import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { analyzeEmail } from '@/lib/phishingAnalyzer'
import { redactEmail } from '@/lib/utils'
import { prisma } from '@/lib/prisma'

const EmailAnalysisSchema = z.object({
  emailText: z.string().min(10).max(10000),
  saveHistory: z.boolean().optional().default(false),
})

const requestCounts: Record<string, number> = {}

function isRateLimited(clientIp: string, limit: number = 15, windowMs: number = 60000): boolean {
  const now = Date.now()
  const key = `${clientIp}-${Math.floor(now / windowMs)}`

  if (!requestCounts[key]) {
    requestCounts[key] = 0
  }

  requestCounts[key]++
  return requestCounts[key] > limit
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before analyzing again.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validated = EmailAnalysisSchema.parse(body)

    const analysis = analyzeEmail(validated.emailText)

    // Extract and redact email if found
    const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/g
    const emailMatches = validated.emailText.match(emailRegex)
    const redactedEmail = emailMatches && emailMatches.length > 0 ? redactEmail(emailMatches[0]) : undefined

    // Save to history if enabled
    if (validated.saveHistory && process.env.DATABASE_URL) {
      try {
        await prisma.scan.create({
          data: {
            type: 'EMAIL',
            riskScore: analysis.riskScore,
            emailRedacted: redactedEmail,
            emailRiskFlags: JSON.stringify(analysis.flags),
            flags: JSON.stringify(analysis.flags),
            recommendations: JSON.stringify(analysis.recommendations),
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
        { error: 'Invalid request. Email text is required.' },
        { status: 400 }
      )
    }

    console.error('Email analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze email' },
      { status: 500 }
    )
  }
}
