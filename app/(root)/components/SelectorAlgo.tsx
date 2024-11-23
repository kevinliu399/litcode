'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardTitle } from "@/components/ui/card";
import { Binary, Code, Swords, ChevronRight, Loader2, X } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import useGameStore from "../stores/gamestore";

const AlgorithmSelector = () => {
    const { user } = useUser();
    const { initializeSocket, socket, status, setStatus } = useGameStore();
    const [isQueuing, setIsQueuing] = useState(false);
    const searchParams = useSearchParams();
    const [value, setValue] = useState("");
    
    useEffect(() => {
      const type = searchParams.get('type');
      if (type) {
        setValue(type);
      }
    }, [searchParams]);

    useEffect(() => {
        initializeSocket();
    }, [initializeSocket]);

    const handleStartBattle = () => {
        if (!socket || !user || !value) return;

        setIsQueuing(true);
        setStatus('queuing');
        
        socket.emit('join_queue', {
            player_id: user.id,
            player_name: user.fullName,
            algorithm_type: value
        });
    };

    const handleCancelQueue = () => {
        if (!socket || !user) return;

        setIsQueuing(false);
        setStatus('idle');
        
        socket.emit('leave_queue', {
            player_id: user.id
        });
    };

    return (
        <div className="transform transition-all duration-700">
            <Card className="border border-white/10 bg-white/5 backdrop-blur-sm p-8">
                {/* Header */}
                <div className="flex items-center space-x-2 mb-6">
                    <Binary size={20} className="text-lime-400" />
                    <CardTitle className="text-xl text-white/90">
                        I want to practice
                    </CardTitle>
                </div>

                {/* Algorithm Selector */}
                <div className="mb-8">
                    <Select value={value} onValueChange={setValue} disabled={isQueuing}>
                        <SelectTrigger className="w-[300px] bg-white/5 border-white/10 text-white/80 hover:bg-white/10 transition-colors">
                            <div className="flex items-center space-x-2">
                                <Code size={16} className="text-lime-400" />
                                <SelectValue placeholder="Choose an algorithm" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="text-white/80">
                            <SelectItem value="graph" className="hover:bg-white/5 focus:bg-white/5">
                                Graphs
                            </SelectItem>
                            <SelectItem value="tree" className="hover:bg-white/5 focus:bg-white/5">
                                Trees
                            </SelectItem>
                            <SelectItem value="array" className="hover:bg-white/5 focus:bg-white/5">
                                Arrays
                            </SelectItem>
                            <SelectItem value="random" className="hover:bg-white/5 focus:bg-white/5">
                                Anything!
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Battle Section */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">
                        <span className="bg-gradient-to-r from-lime-400 to-purple-200 bg-clip-text text-transparent">
                            {isQueuing ? 'Finding an opponent...' : 'Queue Up and Battle!'}
                        </span>
                    </h2>

                    {isQueuing ? (
                        <button 
                            onClick={handleCancelQueue}
                            className="group flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg px-4 py-3 transition-all duration-300 w-full"
                        >
                            <Loader2 size={18} className="text-red-400 animate-spin" />
                            <span className="text-white/80 group-hover:text-white/100 transition-colors">
                                Cancel Queue
                            </span>
                            <X size={18} className="text-red-400 ml-auto" />
                        </button>
                    ) : (
                        <button 
                            onClick={handleStartBattle}
                            disabled={!value}
                            className={`group flex items-center space-x-2 ${
                                value ? 'bg-white/5 hover:bg-white/10' : 'bg-white/5 opacity-50 cursor-not-allowed'
                            } border border-white/10 rounded-lg px-4 py-3 transition-all duration-300 w-full`}
                        >
                            <Swords size={18} className="text-lime-400" />
                            <span className="text-white/80 group-hover:text-white/100 transition-colors">
                                Start Battle
                            </span>
                            <ChevronRight size={18} className="text-lime-400 ml-auto transform group-hover:translate-x-1 transition-transform" />
                        </button>
                    )}

                    {isQueuing && (
                        <div className="text-white/60 text-sm text-center animate-pulse">
                            Looking for players interested in {value === 'random' ? 'any algorithm' : value} problems...
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AlgorithmSelector;