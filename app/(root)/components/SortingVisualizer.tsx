'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

const SortingVisualizer: React.FC = () => {
    const [numbers, setNumbers] = useState<number[]>([]);
    const [sorting, setSorting] = useState<boolean>(false);
    const [sortedIndices, setSortedIndices] = useState<Set<number>>(new Set());
    const [currentSwap, setCurrentSwap] = useState<[number, number] | null>(null);
    const [userCode, setUserCode] = useState<string>(`// Your sorting function should:
// 1. Take an array as parameter
// 2. Use updateVisualization(array, indices) to show each step
// 3. Use markSorted(index) to mark an index as sorted
// 4. Return the sorted array

async function sort(arr) {
  // Example: Bubble Sort
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        await updateVisualization([...arr], [j, j + 1]);
      }
    }
    markSorted(arr.length - i - 1);
  }
  return arr;
}`);
    const [error, setError] = useState<string>('');
    const delay = 500;

    useEffect(() => {
        resetArray();
    }, []);

    const resetArray = (): void => {
        setNumbers(shuffleArray(Array.from({ length: 10 }, (_, i: number) => i + 1)));
        setSortedIndices(new Set());
        setCurrentSwap(null);
        setError('');
    };

    const shuffleArray = (array: number[]): number[] => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const updateVisualization = async (
        newArray: number[],
        indices: [number, number] | null
    ): Promise<void> => {
        setNumbers([...newArray]);
        setCurrentSwap(indices);
        await new Promise((resolve) => setTimeout(resolve, delay));
    };

    const markSorted = (index: number): void => {
        setSortedIndices((prev) => new Set(prev).add(index));
    };

    const runUserCode = async (): Promise<void> => {
        try {
            setSorting(true);
            setError('');
            setSortedIndices(new Set());
            setCurrentSwap(null);

            // Safe context for user code execution
            const context: Record<string, unknown> = {
                updateVisualization,
                markSorted,
                setTimeout,
                console: { log: console.log },
            };

            const functionBody = `
                "use strict";
                return (${userCode})
            `;
            const userFunction = new Function(
                ...Object.keys(context),
                functionBody
            )(...Object.values(context));

            // Execute user sorting function
            const result = await userFunction([...numbers]);

            // Verify if the array is sorted
            const isSorted = result.every(
                (num: number, i: number) => i === 0 || result[i - 1] <= result[i]
            );
            if (!isSorted) {
                throw new Error('Array is not correctly sorted!');
            }

            // Mark all indices as sorted
            setSortedIndices(new Set(result.map((_: any, i: number) => i)));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error(err);
        } finally {
            setSorting(false);
        }
    };

    return (
        <div className="flex flex-col items-center max-w-4xl mx-auto p-4">
            <Card className="w-full p-6">
                <h1 className="text-2xl font-bold mb-4 text-black">
                    Interactive Sorting Visualizer
                </h1>

                <div className="flex items-center justify-center space-x-4 mb-6 min-h-24">
                    {numbers.map((num: number, index: number) => (
                        <div
                            key={index}
                            className="w-12 h-12 flex items-center justify-center text-xl rounded-full transition-all duration-500 text-black"
                            style={{
                                backgroundColor: sortedIndices.has(index)
                                    ? '#32CD32' // Lime Green
                                    : currentSwap?.includes(index)
                                    ? '#D8BFD8' // Light Purple
                                    : '#FFFFFF', // White
                                border: '1px solid #000000',
                            }}
                        >
                            {num}
                        </div>
                    ))}
                </div>

                <div className="mb-4">
                    <textarea
                        value={userCode}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            setUserCode(e.target.value)
                        }
                        className="w-full h-64 p-4 font-mono text-sm border rounded text-black"
                        disabled={sorting}
                    />
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div className="flex space-x-4">
                    <button
                        onClick={runUserCode}
                        disabled={sorting}
                        className={`px-4 py-2 rounded ${
                            sorting
                                ? 'bg-gray-400'
                                : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}
                    >
                        {sorting ? 'Running...' : 'Run Sort'}
                    </button>

                    <button
                        onClick={resetArray}
                        disabled={sorting}
                        className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
                    >
                        Reset Array
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default SortingVisualizer;
