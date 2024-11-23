import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, Clock, CircuitBoard } from 'lucide-react';

interface TestResult {
  testId: string;
  status: string;
  executionTime: string;
  memoryUsage: string;
  output: string | null;
  error: string | null;
  passed: boolean;
}

interface TestResultsProps {
  results: TestResult[];
  isExecuting: boolean;
}

export default function TestResults({ results, isExecuting }: TestResultsProps) {
  const totalTests = results.length;
  const passedTests = results.filter(r => r.passed).length;

  return (
    <div className="space-y-4 w-full">
      {/* Summary Card */}
      <Card className="border border-white/10 bg-white/5">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-white/80">Test Results:</span>
              <span className={`font-mono ${passedTests === totalTests ? 'text-lime-400' : 'text-red-400'}`}>
                {passedTests}/{totalTests}
              </span>
            </div>
            {isExecuting && (
              <span className="text-purple-400">Running tests...</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Individual Test Results */}
      {results.map((result) => (
        <Card key={result.testId} className="border border-white/10 bg-white/5">
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {result.passed ? (
                    <Check className="text-lime-400" size={18} />
                  ) : (
                    <X className="text-red-400" size={18} />
                  )}
                  <span className="text-white/80 font-medium">Test {result.testId}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock size={14} className="text-lime-400" />
                    <span className="text-white/60">{result.executionTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CircuitBoard size={14} className="text-lime-400" />
                    <span className="text-white/60">{result.memoryUsage}</span>
                  </div>
                </div>
              </div>

              {/* Output */}
              {result.output && (
                <div className="space-y-1">
                  <div className="text-white/60 text-sm">Output:</div>
                  <pre className="p-2 bg-black/40 rounded text-sm font-mono text-white/80 whitespace-pre-wrap">
                    {result.output}
                  </pre>
                </div>
              )}

              {/* Error */}
              {result.error && (
                <div className="space-y-1">
                  <div className="text-red-400 text-sm">Error:</div>
                  <pre className="p-2 bg-red-500/10 rounded text-sm font-mono text-red-400/90 whitespace-pre-wrap">
                    {result.error}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}