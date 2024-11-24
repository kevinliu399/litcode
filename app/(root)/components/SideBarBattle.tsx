import { Card, CardContent } from '@/components/ui/card';
import { Check, FileText, User, Code, CircleAlert } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import BFSVisualizer from './GraphVisualizer';

interface TestCase {
  testId: string;
  input: {
    graph?: any;
    startNode?: any;
    [key: string]: any;  // Allow for other input properties
  };
  output: any;
}

interface Question {
  _id?: string;
  title: string;
  description: string;
  testCases: TestCase[];
  type: "graph" | "tree" | "array" | "";
}

interface SidebarBattleProps {
  question: Question;
}

function SidebarBattle({ question }: SidebarBattleProps) {
  const [isPopoutOpen, setIsPopoutOpen] = useState(false);
  const [key, setKey] = useState(0);

  const openPopout = () => {
    setIsPopoutOpen(true);
    setKey(prev => prev + 1);
  };
  
  const closePopout = () => {
    setIsPopoutOpen(false);
  };

  useEffect(() => {
    return () => {
      if (!isPopoutOpen) {
        setKey(prev => prev + 1);
      }
    };
  }, [isPopoutOpen]);

  // Format test case input/output for display
  const formatTestCase = (value: any): string => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  return (
    <div className="flex flex-col space-y-4 w-screen px-4">
      {/* Problem Description Card */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-sm max-h-[60vh]">
        <CardContent className="p-6 overflow-y-auto h-full">
          <div className="flex items-center justify-between mb-4 backdrop-blur-sm py-2 z-10">
            <div className="flex items-center space-x-2">
              <FileText size={18} className="text-lime-400" />
              <h2 className="font-medium text-white/90">{question.title}</h2>
            </div>
            {question.type === "graph" && (
              <button 
                onClick={openPopout}
                className="px-4 py-2 rounded bg-lime-500 hover:bg-lime-600 text-white">
                Demo
              </button>
            )}
          </div>
          
          <div className="space-y-4 text-white/75">
            <p className="leading-relaxed">
              {question.description}
            </p>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Code size={16} className="text-lime-400" />
                <h3 className="font-medium text-white/90">Examples:</h3>
              </div>
              
              <div className="space-y-3">
                {question.testCases.slice(0, 2).map((testCase) => (
                  <div key={testCase.testId} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="text-sm space-y-1">
                      <div className="text-white/60">Input:</div>
                      <pre className="font-mono text-purple-300 whitespace-pre-wrap break-words">
                        {formatTestCase(testCase.input)}
                      </pre>
                    </div>
                    <div className="text-sm space-y-1 mt-2">
                      <div className="text-white/60">Output:</div>
                      <pre className="font-mono text-lime-400 whitespace-pre-wrap break-words">
                        {formatTestCase(testCase.output)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opponent Card */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User size={18} className="text-lime-400" />
                <h2 className="font-medium text-white/90">Opponent Status</h2>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center space-x-3">
                <CircleAlert size={16} className="text-purple-400" />
                <span className="text-sm text-white/75">Tests Passed</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check size={16} className="text-lime-400" />
                <span className="text-sm font-medium text-white/90">
                  {`${question.testCases.length}/${question.testCases.length}`}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popout with BFSVisualizer */}
      {isPopoutOpen && question.type === "graph" && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg w-3/4 h-3/4 p-6 relative">
            <button
              onClick={closePopout}
              className="absolute top-4 right-4 px-3 py-2 text-sm rounded bg-[#333] hover:bg-[#444] text-lime-400 hover:text-white transition"
            >
              Close
            </button>

            <div className="flex flex-col items-center justify-center mt-8">
              <h2 className="text-2xl font-semibold text-lime-400 mb-4">
                Graph Visualizer
              </h2>
              <BFSVisualizer
                key={key}
                width={10}
                height={10}
                cellSize={30}
                start={{ x: 0, y: 0 }}
                end={{ x: 6, y: 6 }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SidebarBattle;