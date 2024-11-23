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
import { Binary, Code, Swords, ChevronRight } from "lucide-react";

const AlgorithmSelector = () => {
    const searchParams = useSearchParams();
    const [value, setValue] = useState("");
    
    useEffect(() => {
      const type = searchParams.get('type');
      if (type) {
        setValue(type);
      }
    }, [searchParams]);

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
                    <Select value={value} onValueChange={setValue}>
                        <SelectTrigger className="w-[300px] bg-white/5 border-white/10 text-white/80 hover:bg-white/10 transition-colors">
                            <div className="flex items-center space-x-2">
                                <Code size={16} className="text-lime-400" />
                                <SelectValue placeholder="Choose an algorithm" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className=" text-white/80">
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
                            Queue Up and Battle!
                        </span>
                    </h2>

                    <button className="group flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-3 transition-all duration-300 w-full">
                        <Swords size={18} className="text-lime-400" />
                        <span className="text-white/80 group-hover:text-white/100 transition-colors">
                            Start Battle
                        </span>
                        <ChevronRight size={18} className="text-lime-400 ml-auto transform group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default AlgorithmSelector;