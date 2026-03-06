import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { analyzeURL } from '@/lib/phishingAnalyzer'
import { normalizeURL } from '@/lib/utils'
import { prisma } from '@/lib/prisma'

const URLAnalysisSchema = z.object({
  url: z.string().min(5).max(2000),
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
    const validated = URLAnalysisSchema.parse(body)

    const analysis = analyzeURL(validated.url)

    // Save to history if enabled
    if (validated.saveHistory && process.env.DATABASE_URL) {
      try {
        await prisma.scan.create({
          data: {
            type: 'URL',
            riskScore: analysis.riskScore,
            urlNormalized: normalizeURL(validated.url),
            urlDomain: analysis.parsed.domain,
            urlRiskFlags: JSON.stringify(analysis.flags),
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
        { error: 'Invalid request. Valid URL is required.' },
        { status: 400 }
      )
    }

    console.error('URL analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze URL' },
      { status: 500 }
    )
  }
}
