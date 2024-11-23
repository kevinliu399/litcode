import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Terminal, Clock, CircuitBoard, AlertCircle } from 'lucide-react';

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
      const submitResponse = await axios.post('/api/judge_submit', {
        source_code: code,
        language_id: 100,
        stdin: '',
      });

      const { token } = submitResponse.data;
      const pollInterval = 1000;
      const maxAttempts = 30;
      let attempts = 0;

      const pollResult = async () => {
        attempts++;
        const response = await axios.get(`/api/judge_submit?token=${token}`);
        const { status, output, error, executionTime, memoryUsage } = response.data;

        if (status === 'Processing' || status === 'In Queue') {
          if (attempts >= maxAttempts) {
            throw new Error('Execution timed out after 30 seconds');
          }
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
    <div className="w-full max-w-4xl px-6">
      <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="p-6">
          {/* Editor Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Terminal size={18} className="text-lime-400" />
              <span className="text-white/80 font-medium">Editor</span>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="border border-white/10 rounded-lg overflow-hidden">
            <Editor
              height="60vh"
              defaultLanguage={language}
              defaultValue={defaultValue}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                fontFamily: 'JetBrains Mono, monospace'
              }}
            />
          </div>

          {/* Controls and Output Section */}
          <div className="mt-6 space-y-4">
            <Button
              onClick={executeCode}
              disabled={isExecuting}
              className="w-full bg-lime-400 text-black hover:bg-lime-500 transition-colors font-medium"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Executing Code...
                </>
              ) : (
                'Run Code'
              )}
            </Button>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle size={18} className="text-red-400" />
                  <span className="text-red-400 font-medium">Execution Error</span>
                </div>
                <pre className="text-red-400/90 text-sm font-mono whitespace-pre-wrap">{error}</pre>
              </div>
            )}

            {result && !error && (
              <div className="space-y-4 p-4 border border-white/10 rounded-lg bg-white/5">
                {/* Status Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Clock size={16} className="text-lime-400" />
                      <span className="text-white/60 text-sm">{result.executionTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CircuitBoard size={16} className="text-lime-400" />
                      <span className="text-white/60 text-sm">{result.memoryUsage}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    result.status === 'Completed' ? 'bg-lime-400/20 text-lime-400' : 'bg-purple-400/20 text-purple-400'
                  }`}>
                    {result.status}
                  </span>
                </div>

                {/* Output */}
                <div className="space-y-2">
                  <div className="text-white/80 font-medium text-sm">Output:</div>
                  <pre className="p-4 bg-black/40 rounded-md text-white/90 text-sm font-mono whitespace-pre-wrap border border-white/5">
                    {result.output || 'No output'}
                  </pre>
                  
                  {result.error && (
                    <>
                      <div className="text-white/80 font-medium text-sm mt-4">Error:</div>
                      <pre className="p-4 bg-red-500/10 rounded-md text-red-400/90 text-sm font-mono whitespace-pre-wrap border border-red-500/20">
                        {result.error}
                      </pre>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeEditor;