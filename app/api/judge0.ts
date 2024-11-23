// pages/api/judge0.ts
import axios from 'axios';

const JUDGE0_API_URL = 'https://api.jdoodle.com/v1/execute'; // Public API URL (or your own server)
const API_KEY = 'your_judge0_api_key';  // Replace this with your actual API key if needed

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { language, code } = req.body;

    try {
      const response = await axios.post(JUDGE0_API_URL, {
        script: code,
        language: language,
        // Additional parameters like versionIndex, etc.
        stdin: '', // If the code needs input
        // Optionally add any required environment variables
        clientId: API_KEY,
        // Example: add more options based on Judge0 documentation
      });

      return res.status(200).json(response.data);
    } catch (error) {
      console.error('Error executing code:', error);
      return res.status(500).json({ error: 'Code execution failed' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
