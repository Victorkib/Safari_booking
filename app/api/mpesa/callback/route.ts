import { NextResponse } from 'next/server'
import { processStkCallback } from '@/lib/mpesa/callback'

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const result = await processStkCallback(payload)

    return NextResponse.json({
      ResultCode: result.processed ? 0 : 1,
      ResultDesc: result.message,
    })
  } catch (error) {
    console.error('[mpesa/callback]', error)
    return NextResponse.json(
      { ResultCode: 1, ResultDesc: 'Callback processing error' },
      { status: 500 }
    )
  }
}
