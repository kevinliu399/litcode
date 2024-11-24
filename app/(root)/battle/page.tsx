"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import EditorComponent from "../components/EditorComponent";
import { Check, Hourglass, Swords } from "lucide-react";
import SidebarBattle from "../components/SideBarBattle";
import { Badge } from "@/components/ui/badge";
import useGameStore from "../stores/gamestore";

const Battle = () => {
  const router = useRouter();
  const {
    question,
    opponent,
    status,
    timeRemaining,
    myProgress,
    opponentProgress,
    updateTimer,
  } = useGameStore();

  useEffect(() => {
    // Redirect if not in a game
    if (status !== "in_game") {
      router.push("/lobby");
      return;
    }

    // Timer countdown
    const interval = setInterval(() => {
      if (timeRemaining > 0) {
        updateTimer(timeRemaining - 1); // Changed this line
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status, router, updateTimer, timeRemaining]);

  useEffect(() => {
    // Show game over when timer runs out
    if (timeRemaining === 0 && status === "in_game") {
      useGameStore.getState().setStatus("ended");
    }
  }, [timeRemaining, status]);

  if (!question || !opponent) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-400"></div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-lime-400/5 rounded-full blur-3xl" />
        <div className="absolute left-1/4 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="flex flex-row justify-between items-center px-8 py-6 border-b border-white/10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
            <Swords size={20} className="text-lime-400 mr-3" />
            <span className="font-medium">Battling:</span>
            <span className="text-lime-400 ml-2 font-bold hover:text-lime-300 transition-colors">
              {opponent.name}
            </span>
          </div>
        </div>

        <div className="relative flex items-center bg-white/5 px-6 py-2 rounded-lg border border-white/10 cursor-default">
          <div className="flex items-center space-x-2 text-white/80">
            <span className="font-medium">Timer</span>
            <Hourglass size={16} className="text-lime-400" />
            <span className="font-mono text-lime-400">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

                <Badge
                    variant="outline"
                    className="bg-white/5 border-white/10 px-4 py-2 text-sm hover:bg-white/10 transition-all cursor-default"
                >
                    <span className="font-medium">
                        {question.testCases.length} total tests
                    </span>
                </Badge>
            </div>

      {/* Main Content */}
      <div className="flex flex-row w-full justify-center mt-4 px-4">
        <EditorComponent />
        <SidebarBattle question={question} />
      </div>

      {/* Game Over Modal */}
      {status === "ended" && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-black border-2 border-gray-600 bg-opacity-50 rounded-lg p-6 w-96">
            <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
            <div className="mb-6">
              <p className="text-lg mb-2">Final Score:</p>
              <p>
                You: {myProgress.tests_passed}/{myProgress.total_tests} tests
                passed
              </p>
              <p>
                Opponent: {opponentProgress.tests_passed}/
                {opponentProgress.total_tests} tests passed
              </p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => router.push("/")}
                className="bg-lime-400 text-black px-4 py-2 rounded-md hover:bg-lime-500 transition"
              >
                Home
              </button>
              <button
                onClick={() => router.push("/lobby")}
                className="bg-lime-400 text-black px-4 py-2 rounded-md hover:bg-lime-500 transition"
              >
                Lobby
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Battle;
