import { Card, CardContent } from '@/components/ui/card';
import { Check, FileText, User, Code, CircleAlert } from 'lucide-react';

function SidebarBattle() {
  return (
    <div className="flex flex-col space-y-4 w-screen px-4">
      {/* Problem Description Card */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText size={18} className="text-lime-400" />
            <h2 className="font-medium text-white/90">Problem Description</h2>
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
    </div>
  );
}

export default SidebarBattle;