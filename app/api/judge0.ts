import axios from 'axios';
import * as dotenv from 'dotenv'
dotenv.config()
const judge0_api_key = process.env.judge0_api_key;

const RAPIDAPI_HOST = 'judge0-ce.p.rapidapi.com'; // RapidAPI Judge0 host
const RAPIDAPI_KEY = judge0_api_key; // Replace with your RapidAPI key

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { code, language_id, stdin, expected_output } = req.body;

    try {
      const response = await axios.post(
        `https://${RAPIDAPI_HOST}/submissions`,
        {
          source_code: code,
          language_id: language_id, // 
          stdin: stdin || '',
          expected_output: expected_output || '',
          cpu_time_limit: 1, // Example time limit (adjustable)
          memory_limit: 128000, // Memory limit (adjustable)
          number_of_runs: 1,
          redirect_stderr_to_stdout: true, 
          wall_time_limit: 10, // Optional time limits
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Host': RAPIDAPI_HOST,
            'X-RapidAPI-Key': RAPIDAPI_KEY,
          },
        }
      );

      const { token } = response.data;
      return res.status(200).json({ token });
    } catch (error) {
      console.error('Error creating submission:', error);
      return res.status(500).json({ error: 'Failed to submit code' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
