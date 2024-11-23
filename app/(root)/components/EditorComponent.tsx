import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface EditorProps {
  defaultValue?: string;
  language?: string;
}

interface ExecutionResult {
  status: string;
  executionTime: string;
  memoryUsage: string;
  output: string | null;
  error: string | null;
}

const CodeEditor: React.FC<EditorProps> = ({
  defaultValue = '# Write your Python code here\n',
  language = 'python',
}) => {
  const [code, setCode] = useState<string>(defaultValue);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeCode = async () => {
    setIsExecuting(true);
    setError(null);
    setResult(null);

    try {
      // Submit code
      const submitResponse = await axios.post('/api/judge_submit', {
        source_code: code,
        language_id: 100, // Python
        stdin: '',
      });

      const { token } = submitResponse.data;

      // Poll for results
      const pollInterval = 1000; // 1 second
      const maxAttempts = 30; // Maximum 30 seconds of polling
      let attempts = 0;

      const pollResult = async () => {
        attempts++;
        const response = await axios.get(`/api/judge_submit?token=${token}`);
        const { status, output, error, executionTime, memoryUsage } = response.data;

        if (status === 'Processing' || status === 'In Queue') {
          if (attempts >= maxAttempts) {
            throw new Error('Execution timed out after 30 seconds');
          }
          // Continue polling
          setTimeout(pollResult, pollInterval);
        } else {
          setIsExecuting(false);
          setResult({
            status,
            executionTime,
            memoryUsage,
            output,
            error
          });
        }
      };

      await pollResult();
    } catch (err: any) {
      setIsExecuting(false);
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="flex space-x-4 mx-8">
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="p-4">
          <Editor
            height="50vh"
            defaultLanguage={language}
            defaultValue={defaultValue}
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
          <div className="mt-4 space-y-4">
            <Button
              onClick={executeCode}
              disabled={isExecuting}
              className="w-full"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                'Run Code'
              )}
            </Button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <pre className="text-red-600 whitespace-pre-wrap">{error}</pre>
              </div>
            )}

            {result && !error && (
              <div className="p-4 border rounded-md dark">
                <pre className="whitespace-pre-wrap">
                  <strong>Status:</strong> {result.status}
                  <br />
                  <strong>Execution Time:</strong> {result.executionTime}
                  <br />
                  <strong>Memory Usage:</strong> {result.memoryUsage}
                  <br />
                  <strong>Output:</strong> <br />
                  {result.output || 'No output'}
                  {result.error && (
                    <>
                      <br />
                      <strong>Error:</strong> {result.error}
                    </>
                  )}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <div className='flex flex-col space-y-4'>
        <Card className="h-60 p-4">
          <CardTitle>
            <h1 className="py-2">Problem Description</h1>
          </CardTitle>
          <CardDescription className="space-y-4">
            <p>
              Write a program that takes a string as input and returns the number of vowels in the string.
            </p>
            <ul>
              <li>Input: "hello"</li>
              <li>Output: 2</li>
            </ul>
            <ul>
              <li>Input: "world"</li>
              <li>Output: 1</li>
            </ul>
          </CardDescription>
        </Card>

        <Card>
          <CardContent className="py-2 h-20">
            <h2>Opponent: <p className='underline font-semibold'>orlolol</p></h2>
          </CardContent>
        </Card>
      </div>
    </div>

  );
};

export default CodeEditor;