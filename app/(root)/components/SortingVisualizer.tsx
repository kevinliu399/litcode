'use client';

import React, { useState, useEffect } from 'react';

const SortingVisualizer: React.FC = () => {
    const [numbers, setNumbers] = useState<number[]>([]);
    const [sorting, setSorting] = useState<boolean>(false);
    const [sortedIndices, setSortedIndices] = useState<Set<number>>(new Set());
    const [currentSwap, setCurrentSwap] = useState<[number, number] | null>(null);

    const delay = 500; // Delay in milliseconds for animation

    useEffect(() => {
        setNumbers(shuffleArray(Array.from({ length: 10 }, (_, i) => i + 1)));
    }, []);

    // Function to shuffle an array
    const shuffleArray = (array: number[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    // Bubble Sort Animation
    const bubbleSort = async () => {
        setSorting(true);
        const arr = [...numbers];
        const sortedSet = new Set<number>();

        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Highlight the swapped pair
                    setCurrentSwap([j, j + 1]);

                    // Swap elements
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    setNumbers([...arr]); // Update state to re-render

                    await new Promise((resolve) => setTimeout(resolve, delay));
                }
            }

            // Mark the last sorted element as correct
            sortedSet.add(arr.length - i - 1);
            setSortedIndices(new Set(sortedSet));
        }

        setCurrentSwap(null); // Reset highlight
        setSorting(false);
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Sorting Visualizer</h1>
            <div className="flex items-center space-x-4 mb-6">
                {numbers.map((num, index) => (
                    <div
                        key={index}
                        className="w-12 h-12 flex items-center justify-center text-white text-xl rounded-full"
                        style={{
                            backgroundColor: sortedIndices.has(index)
                                ? '#4CAF50' // Green for sorted
                                : currentSwap?.includes(index)
                                ? '#FF5722' // Orange for current swap
                                : '#2196F3', // Blue for unsorted
                            transition: 'all 0.5s ease',
                        }}
                    >
                        {num}
                    </div>
                ))}
            </div>
            <button
                onClick={bubbleSort}
                disabled={sorting}
                className={`px-4 py-2 rounded ${
                    sorting ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
                } text-white`}
            >
                {sorting ? 'Sorting...' : 'Start Bubble Sort'}
            </button>
        </div>
    );
};

export default SortingVisualizer;
