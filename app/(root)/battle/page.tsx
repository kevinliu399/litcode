'use client';
import React, { useEffect, useState } from 'react';
import EditorComponent from '../components/EditorComponent';
import { Check, Hourglass, Swords } from 'lucide-react';
import SidebarBattle from '../components/SideBarBattle';
import { Badge } from '@/components/ui/badge';

interface SidebarBattleProps {
  question: {
    title: string;
    description: string;
    testCases: Array<{
      testId: string;
      input: string;
      output: string;
    }>;
    displayTestCases?: Array<{
      testId: string;
      input: string;
      output: string;
    }>;
  };
}

const Battle = () => {
  const [question, setQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(10); // Example: 10 seconds timer
  const [showModal, setShowModal] = useState(false);
  const [winner, setWinner] = useState<string>('Placeholder Winner'); // Replace with real winner logic

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/questions');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch question');
        }

        if (data.success && data.data.length > 0) {
          const firstQuestion = data.data[0];
          setQuestion({
            ...firstQuestion,
          });
        } else {
          setError('No questions available');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch question');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestion();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else {
      setShowModal(true); // Show modal when timer hits 0
    }
  }, [timer]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="relative h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-lime-400/5 rounded-full blur-3xl" />
        <div className="absolute left-1/4 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Timer and Header */}
      <div className="flex flex-row justify-between items-center px-8 py-6 border-b border-white/10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
            <Swords size={20} className="text-lime-400 mr-3" />
            <span className="font-medium">Battling:</span>
            <span className="text-lime-400 ml-2 font-bold hover:text-lime-300 transition-colors">
              orlolol
            </span>
          </div>
        </div>
        <div className="relative flex items-center bg-white/5 px-6 py-2 rounded-lg border border-white/10 cursor-default">
          <div className="flex items-center space-x-2 text-white/80">
            <span className="font-medium">Timer</span>
            <Hourglass size={16} className="text-lime-400" />
            <span className="font-mono text-lime-400">{`00:00:${timer
              .toString()
              .padStart(2, '0')}`}</span>
          </div>
        </div>
        <Badge
          variant="outline"
          className="bg-white/5 border-white/10 px-4 py-2 text-sm hover:bg-white/10 transition-all cursor-default"
        >
          <Check size={16} className="text-lime-400 mr-2" />
          <span className="font-medium">
            {question ? `${(question as SidebarBattleProps['question']).testCases.length} total tests` : '0 tests'}
          </span>
        </Badge>
      </div>

      {/* Main Content */}
      <div className="flex flex-row w-full justify-center mt-4 px-4">
        <EditorComponent />
        {question && <SidebarBattle question={question} /> as React.ReactElement<SidebarBattleProps>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-black border-2 border-gray-600 bg-opacity-50 rounded-lg p-6 w-96">
            <h2 className="text-2xl font-bold mb-4">Winner!</h2>
            <p className="text-lg mb-6">{winner}</p>
            <div className="flex justify-between">
              <button
                onClick={() => (window.location.href = '/')}
                className="bg-lime-400 text-black px-4 py-2 rounded-md hover:bg-lime-500 transition"
              >
                Home
              </button>
              <button
                onClick={() => (window.location.href = '/lobby')}
                className="bg-lime-400 text-black px-4 py-2 rounded-md hover:bg-lime-500 transition"
              >
                Lobby
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Battle;
