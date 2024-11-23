import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Check } from 'lucide-react';

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
    setIsProcessing(true);
    try {
      // Submit code to the Judge0 API route
      const response = await axios.post('/api/judge0', {
        code,
        language_id: 4, // Example: 4 for C
        stdin: '', // Optional, provide input if needed
      });
      console.log(response.data)
      const { token } = response.data;

      // Poll the status of the submission every 2 seconds
      const checkStatus = setInterval(async () => {
        const statusResponse = await axios.get(`/api/judge0-status?token=${token}`);
        console.log(statusResponse.data)
        if (statusResponse.data.status === 'Processing') {
          // Continue polling until finished
          return;
        }
        setIsProcessing(false);
        setIsExecuting(false);
        clearInterval(checkStatus);
        setOutput(statusResponse.data.output || statusResponse.data.errors || 'No output');
      }, 2000); // Poll every 2 seconds
    } catch (error) {
      console.error('Error executing code:', error);
      setIsExecuting(false);
      setOutput('Error executing code');
    }
  };

  return (
    <div className="w-full max-w-3xl">
      <div className="flex space-x-4 mx-8">
        <Card className="w-full max-w-3xl mx-auto">
          <CardContent className="p-4">
            <Editor
              height="50vh"
              defaultLanguage={language}
              defaultValue={defaultValue}
              onChange={(value) => setCode(value || '')}
              theme={'vs-dark'}
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
      </div>
    </div>


  );
};

export default EditorComponent;
