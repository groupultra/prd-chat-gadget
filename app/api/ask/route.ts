import { NextRequest, NextResponse } from 'next/server';

const PRD_API_URL = 'https://prd.myintent.cc/ask';
const PRD_API_KEY = process.env.PRD_API_KEY;

export async function POST(request: NextRequest) {
  if (!PRD_API_KEY) {
    return NextResponse.json(
      { error: 'PRD_API_KEY not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(PRD_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': PRD_API_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from PRD API' },
      { status: 500 }
    );
  }
}
