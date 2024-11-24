import { useState } from 'react';

export default function CodeTester() {
  const [code, setCode] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    try {
      // Example test cases
      const testCases = [
        { input: "5", expectedOutput: "25" }, // Assuming a square function
        { input: "3", expectedOutput: "9" }
      ];

      const response = await fetch('/api/test-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, testCases }),
      });

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-64 p-2 border rounded"
        placeholder="Enter your Python code here..."
      />
      <button
        onClick={runTests}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? 'Running...' : 'Run Tests'}
      </button>
      {results && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Results:</h3>
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-4 mt-2 rounded ${
                result.passed ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              <p>Input: {result.input}</p>
              <p>Expected: {result.expectedOutput}</p>
              <p>Got: {result.actualOutput || result.error}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}