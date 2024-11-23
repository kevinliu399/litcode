// api/judge_submit/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

const JUDGE0_API_BASE = 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

if (!JUDGE0_API_KEY) {
  console.error('JUDGE0_API_KEY is not defined in environment variables');
}

interface TestCase {
  input: string;
  output: string;
  testId: string;
}

interface SubmissionResult {
  testId: string;
  status: string;
  executionTime: string;
  memoryUsage: string;
  output: string | null;
  error: string | null;
  passed: boolean;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { source_code, language_id, testCases } = body;

    // Create submissions for all test cases
    const submissionPromises = testCases.map((testCase: TestCase) =>
      axios.post(
        `${JUDGE0_API_BASE}/submissions`,
        {
          source_code,
          language_id,
          stdin: testCase.input,
          expected_output: testCase.output,
          wait: false
        },
        {
          headers: {
            'X-RapidAPI-Key': JUDGE0_API_KEY!,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
          }
        }
      )
    );

    const submissions = await Promise.all(submissionPromises);
    const tokens = submissions.map((submission, index) => ({
      token: submission.data.token,
      testId: testCases[index].testId
    }));

    return NextResponse.json({ tokens });
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
    const testId = searchParams.get('testId');

    if (!token || !testId) {
      return NextResponse.json(
        { error: 'Token and testId are required' },
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
      memory,
      expected_output
    } = response.data;

    const result: SubmissionResult = {
      testId,
      status: status.description,
      executionTime: time ? `${time}s` : 'N/A',
      memoryUsage: memory ? `${memory} KB` : 'N/A',
      output: stdout || null,
      error: stderr || compile_output || null,
      passed: stdout?.trim() === expected_output?.trim()
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