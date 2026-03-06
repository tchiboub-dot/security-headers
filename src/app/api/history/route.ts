import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const QuerySchema = z.object({
  type: z.enum(['PASSWORD', 'URL', 'EMAIL']).optional(),
  riskLevel: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  offset: z.coerce.number().min(0).optional().default(0),
})

export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const validated = QuerySchema.parse({
      type: searchParams.get('type'),
      riskLevel: searchParams.get('riskLevel'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
    })

    // Build where clause
    const where: any = {}
    if (validated.type) {
      where.type = validated.type
    }
    if (validated.riskLevel) {
      const riskScores: Record<string, number[]> = {
        'Low': [0, 33],
        'Medium': [34, 66],
        'High': [67, 89],
        'Critical': [90, 100],
      }
      const [min, max] = riskScores[validated.riskLevel]
      where.riskScore = { gte: min, lte: max }
    }

    const [scans, total] = await Promise.all([
      prisma.scan.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: validated.limit,
        skip: validated.offset,
        select: {
          id: true,
          type: true,
          riskScore: true,
          flags: true,
          urlDomain: true,
          passwordLength: true,
          emailRedacted: true,
          createdAt: true,
        },
      }),
      prisma.scan.count({ where }),
    ])

    return NextResponse.json({
      scans,
      total,
      limit: validated.limit,
      offset: validated.offset,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      )
    }

    console.error('History fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}
