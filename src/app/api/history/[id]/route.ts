import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const scan = await prisma.scan.findUnique({
      where: { id: params.id },
    })

    if (!scan) {
      return NextResponse.json(
        { error: 'Scan not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(scan)
  } catch (error) {
    console.error('Scan fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scan' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const scan = await prisma.scan.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true, deleted: scan })
  } catch (error) {
    console.error('Scan delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete scan' },
      { status: 500 }
    )
  }
}
