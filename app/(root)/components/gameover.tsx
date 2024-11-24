import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { Trophy, Home, Users, CircleX, Handshake } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

interface Progress {
  tests_passed: number;
  total_tests: number;
}

interface GameOverModalProps {
  myProgress: Progress;
  opponentProgress: Progress;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ myProgress, opponentProgress }) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  
  // Calculate winner
  const myScore = (myProgress.tests_passed / myProgress.total_tests) * 100;
  const opponentScore = (opponentProgress.tests_passed / opponentProgress.total_tests) * 100;
  const isWinner = myScore > opponentScore;
  const isTie = myScore === opponentScore;

  useEffect(() => {
    // Trigger animation after component mount
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const renderIcon = () => {
    if (isWinner) {
      return <Trophy size={32} className={`${isVisible ? 'animate-bounce' : ''} text-yellow-400`} />;
    } else if (isTie) {
      return <Handshake size={32} className={`${isVisible ? 'animate-bounce' : ''} text-gray-400`} />;
    } else {
      return <CircleX size={32} className={`${isVisible ? 'animate-bounce' : ''} text-red-400`} />;
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center
      transition-all duration-300 ease-out
      ${isVisible ? 'bg-black/90 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'}`}>
      <div className={`absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]
        transition-opacity duration-500 ease-out
        ${isVisible ? 'opacity-20' : 'opacity-0'}`} />
      
      <Card className={`relative w-full max-w-lg bg-black/40 border border-white/10 backdrop-blur-md
        transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
        <div className={`absolute -top-12 left-1/2 -translate-x-1/2
          transition-all duration-500 delay-200 ease-out
          ${isVisible ? 'opacity-100 -translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="rounded-full p-6 bg-black/40 border border-white/10 backdrop-blur-md">
            {renderIcon()}
          </div>
        </div>

        <CardHeader className="pt-12 pb-4">
          <h2 className={`text-3xl font-bold text-center text-white
            transition-all duration-500 delay-300 ease-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {isWinner ? 'Victory!' : isTie ? "It's a Tie!" : 'Defeated!'}
          </h2>
          <p className={`text-white/60 text-center mt-2
            transition-all duration-500 delay-400 ease-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {isWinner 
              ? 'Impressive coding skills!' 
              : isTie 
                ? 'A perfect match of skills!'
                : 'Better luck next time!'}
          </p>
        </CardHeader>

        <CardContent className={`space-y-6
          transition-all duration-500 delay-500 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-white/60">Your Score</p>
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10">
                <Badge variant="outline" className="bg-lime-400/10 text-lime-400 border-lime-400/20">
                  {myProgress.tests_passed}/{myProgress.total_tests}
                </Badge>
                <span className="text-lg font-bold text-lime-400">
                  {Math.round(myScore)}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-white/60">Opponent Score</p>
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10">
                <Badge variant="outline" className="bg-purple-400/10 text-purple-400 border-purple-400/20">
                  {opponentProgress.tests_passed}/{opponentProgress.total_tests}
                </Badge>
                <span className="text-lg font-bold text-purple-400">
                  {Math.round(opponentScore)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className={`flex gap-4 pt-6
          transition-all duration-500 delay-600 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={() => router.push("/")}
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-3 rounded-lg border border-white/10 transition-colors"
          >
            <Home size={18} />
            <span>Home</span>
          </button>
          <button
            onClick={() => router.push("/lobby")}
            className="flex-1 flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-500 text-black px-4 py-3 rounded-lg transition-colors"
          >
            <Users size={18} />
            <span>Find New Battle</span>
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GameOverModal;