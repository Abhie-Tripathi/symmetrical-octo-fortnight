import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page')
  const limit = searchParams.get('limit')

  const response = await fetch(
    `https://demo.agentspanel.com/confidence?page=${page}&limit=${limit}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  const data = await response.json()
  return NextResponse.json(data)
} 