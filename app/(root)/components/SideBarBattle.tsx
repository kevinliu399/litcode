import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

function SidebarBattle() {
  return (
    <div className="flex flex-col space-y-4">
      <Card className="h-60 px-4 py-2">
        <CardTitle>
          <h1 className="py-2">Problem Description</h1>
        </CardTitle>
        <CardDescription className="space-y-4 pb-4">
          <p>
            Write a program that takes a string as input and returns the number of vowels in the string.
          </p>
          <h2>Examples:</h2>
          <ul>
            <li>Input: "hello"</li>
            <li>Output: 2</li>
          </ul>
          <ul>
            <li>Input: "world"</li>
            <li>Output: 1</li>
          </ul>
        </CardDescription>
      </Card>

      <Card>
        <CardContent className="py-2 h-20 w-full">
          <h2 className="underline font-bold">Opponent: </h2>
          <div className="flex flex-row space-x-10">
            <div className="flex flex-row text-sm space-x-2">
              <Check size={20} className="text-lime-400 mt-1" />
              <p className="mt-1"> 10/23 tests passed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SidebarBattle;
