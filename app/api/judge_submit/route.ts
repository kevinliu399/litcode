import { NextResponse } from 'next/server';
import axios from 'axios';

const JUDGE0_API_BASE = 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

if (!JUDGE0_API_KEY) {
  console.error('JUDGE0_API_KEY is not defined in environment variables');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { source_code, language_id, stdin } = body;

    const submission = await axios.post(
      `${JUDGE0_API_BASE}/submissions`,
      {
        source_code,
        language_id,
        stdin,
        wait: false
      },
      {
        headers: {
          'X-RapidAPI-Key': JUDGE0_API_KEY!,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'Content-Type': 'application/json'
        }
      }
    );

    return NextResponse.json(submission.data);
  } catch (error: any) {
    console.error('Error in judge_submit:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: error.response?.status || 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const response = await axios.get(
      `${JUDGE0_API_BASE}/submissions/${token}`,
      {
        headers: {
          'X-RapidAPI-Key': JUDGE0_API_KEY!,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
      }
    );

    const {
      stdout,
      stderr,
      compile_output,
      status,
      time,
      memory
    } = response.data;

    // Only return final results if status is not "Processing" or "In Queue"
    const result = {
      status: status.description,
      executionTime: time ? `${time} seconds` : 'N/A',
      memoryUsage: memory ? `${memory} bytes` : 'N/A',
      output: stdout || null,
      error: stderr || compile_output || null
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching submission:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: error.response?.status || 500 }
    );
  }
}