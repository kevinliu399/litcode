import { Card, CardContent } from '@/components/ui/card';
import { Check, FileText, User, Code, CircleAlert } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import BFSVisualizer from './GraphVisualizer';
import SortingVisualizer from './SortingVisualizer';

function SidebarBattle() {
  const [isPopoutOpen, setIsPopoutOpen] = useState(false);
  const [key, setKey] = useState(0); // Add key to force re-render

  const openPopout = () => {
    setIsPopoutOpen(true);
    // Force BFSVisualizer to reinitialize when popout opens
    setKey(prev => prev + 1);
  };
  
  const closePopout = () => {
    setIsPopoutOpen(false);
  };

  // Clean up when component unmounts or popout closes
  useEffect(() => {
    return () => {
      if (!isPopoutOpen) {
        setKey(prev => prev + 1);
      }
    };
  }, [isPopoutOpen]);

  return (
    <div className="flex flex-col space-y-4 w-screen px-4">
      {/* Problem Description Card */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileText size={18} className="text-lime-400" />
              <h2 className="font-medium text-white/90">Problem Description</h2>
            </div>
            <button 
              onClick={openPopout}
              className="px-4 py-2 rounded bg-lime-500 hover:bg-lime-600 text-white">
              Demo
            </button>
          </div>
          
          <div className="space-y-4 text-white/75">
            <p className="leading-relaxed">
              Write a program that takes a string as input and returns the number of vowels in the string.
            </p>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Code size={16} className="text-lime-400" />
                <h3 className="font-medium text-white/90">Examples:</h3>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="text-sm space-y-1">
                    <div className="text-white/60">Input:</div>
                    <code className="font-mono text-purple-300">"hello"</code>
                  </div>
                  <div className="text-sm space-y-1 mt-2">
                    <div className="text-white/60">Output:</div>
                    <code className="font-mono text-lime-400">2</code>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="text-sm space-y-1">
                    <div className="text-white/60">Input:</div>
                    <code className="font-mono text-purple-300">"world"</code>
                  </div>
                  <div className="text-sm space-y-1 mt-2">
                    <div className="text-white/60">Output:</div>
                    <code className="font-mono text-lime-400">1</code>
                  </div>
                </div>
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
                <span className="text-sm font-medium text-white/90">10/23</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popout with BFSVisualizer */}
      {isPopoutOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg w-3/4 h-3/4 p-6 relative">
            {/* Close Button */}
            <button
              onClick={closePopout}
              className="absolute top-4 right-4 px-3 py-2 text-sm rounded bg-[#333] hover:bg-[#444] text-lime-400 hover:text-white transition"
            >
              Close
            </button>

            {/* Content */}
            <div className="flex flex-col items-center justify-center mt-8 ">
              <h2 className="text-2xl font-semibold text-lime-400 mb-4">
                Sorting Visualizer
              </h2>
              {/* <SortingVisualizer algorithm="bubble" /> */}
              <BFSVisualizer
                width={10}               // Number of cells horizontally
                height={10}              // Number of cells vertically
                cellSize={30}            // Size of each cell in pixels
                start={{ x: 0, y: 0 }}   // Starting position
                end={{ x: 6, y: 6 }}   // Ending position
            />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SidebarBattle;