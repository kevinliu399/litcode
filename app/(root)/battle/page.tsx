'use client';
import React from 'react';
import EditorComponent from '../components/EditorComponent';
import { Check, Hourglass, Swords } from 'lucide-react';
import SidebarBattle from '../components/SideBarBattle';
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const Battle = () => {
  const [opponentName, setOpponentName] = useState<string>("");
  const [timer, setTimer] = useState<string>("00:00:00");
  const [testsPassed, setTestsPassed] = useState<number>(0);
  const [totalTests, setTotalTests] = useState<number>(23);
  const [isConnected, setIsConnected] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(0);
  const router = useRouter();

  useEffect(() => {
    const selectedAlgorithm = localStorage.getItem('selectedAlgorithm');
    if (!selectedAlgorithm) {
      router.push('/'); // Redirect back to lobby if no algorithm selected
      return;
    }

    const ws = new WebSocket("https://your-ngrok-url-here");
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      ws.send(JSON.stringify({
        type: "QUEUE_JOIN",
        algorithm: selectedAlgorithm
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case "MATCH_FOUND":
          setMatchFound(true);
          setOpponentName(data.opponent);
          startTimeRef.current = Date.now();
          startTimer();
          break;
          
        case "SCORE_UPDATE":
          setTestsPassed(data.testsPassed);
          setTotalTests(data.totalTests);
          break;
          
        case "GAME_OVER":
          clearInterval(timerRef.current);
          // Handle game over - you can add a modal or redirect
          break;
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      clearInterval(timerRef.current);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      
      setTimer(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);
  };
  return (
    <div className='relative h-screen '>
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-lime-400/5 rounded-full blur-3xl" />
        <div className="absolute left-1/4 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      
      <div className="flex flex-row justify-between items-center px-8 py-6 border-b border-white/10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
            <Swords size={20} className="text-lime-400 mr-3" />
            <span className="font-medium">Battling:</span>
            <span className="text-lime-400 ml-2 font-bold hover:text-lime-300 transition-colors">
            {matchFound ? opponentName : 'Finding opponent...'}
            </span>
          </div>
        </div>

        {/* Timer Component */}
        <div className="relative flex items-center bg-white/5 px-6 py-2 rounded-lg border border-white/10 cursor-default">
          <div className="flex items-center space-x-2 text-white/80">
            <span className="font-medium">Timer</span>
            <Hourglass size={16} className="text-lime-400" />
            <span className="font-mono text-lime-400"><p>{timer}</p></span>
          </div>
          <div className="absolute -top-1 -right-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-400"></span>
            </span>
          </div>
        </div>

        {/* Test Results Badge */}
        <Badge 
          variant="outline" 
          className="bg-white/5 border-white/10 px-4 py-2 text-sm hover:bg-white/10 transition-all cursor-default"
        >
          <Check size={16} className="text-lime-400 mr-2" />
          <span className="font-medium">{testsPassed}/{totalTests} tests passed</span>
        </Badge>
      </div>

      {/* Main Content */}
      <div className="flex flex-row w-full justify-center mt-4 px-4">
      <EditorComponent 
          onCodeSubmit={(code: any) => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({
                type: "CODE_SUBMIT",
                code: code
              }));
            }
          }}
        />
        <SidebarBattle />
      </div>
    </div>
  );
};

export default Battle;