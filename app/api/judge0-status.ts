import axios from 'axios';
import * as dotenv from 'dotenv'
dotenv.config()
const judge0_api_key = process.env.judge0_api_key;


const RAPIDAPI_HOST = 'judge0-ce.p.rapidapi.com'; // RapidAPI Judge0 host
const RAPIDAPI_KEY = judge0_api_key; // Replace with your RapidAPI key

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const { token } = req.query;

    try {
      const response = await axios.get(
        `https://${RAPIDAPI_HOST}/submissions/${token}`,
        {
          headers: {
            'X-RapidAPI-Host': RAPIDAPI_HOST,
            'X-RapidAPI-Key': RAPIDAPI_KEY,
          },
        }
      );

      const submission = response.data;
      // Wait for the submission to complete
      if (submission.status.id === 3) { 
        return res.status(200).json({
          output: submission.stdout,
          errors: submission.stderr,
          time: submission.time,
          memory: submission.memory,
        });
      }

      // If not finished yet
      return res.status(200).json({ status: 'Processing', token });
    } catch (error) {
      console.error('Error fetching submission status:', error);
      return res.status(500).json({ error: 'Failed to fetch submission status' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
