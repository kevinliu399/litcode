'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

const SortingVisualizer: React.FC<{ algorithm: 'bubble' | 'selection' | 'insertion' }> = ({ algorithm }) => {
    const [numbers, setNumbers] = useState<number[]>([]);
    const [sorting, setSorting] = useState<boolean>(false);
    const [sortedIndices, setSortedIndices] = useState<Set<number>>(new Set());
    const [currentSwap, setCurrentSwap] = useState<[number, number] | null>(null);
    const delay = 1000;

    useEffect(() => {
        resetArray();
    }, []);

    const resetArray = (): void => {
        setNumbers(shuffleArray(Array.from({ length: 10 }, (_, i: number) => i + 1)));
        setSortedIndices(new Set());
        setCurrentSwap(null);
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

    const runSort = async (): Promise<void> => {
        setSorting(true);
        setSortedIndices(new Set());
        setCurrentSwap(null);

        try {
            const arrayCopy = [...numbers];

            if (algorithm === 'bubble') {
                await bubbleSort(arrayCopy);
            } else if (algorithm === 'selection') {
                await selectionSort(arrayCopy);
            } else if (algorithm === 'insertion') {
                await insertionSort(arrayCopy);
            }

            setSortedIndices(new Set(arrayCopy.map((_, i) => i)));
        } catch (err) {
            console.error('Sorting error:', err);
        } finally {
            setSorting(false);
        }
    };

    const bubbleSort = async (arr: number[]): Promise<void> => {
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    await updateVisualization([...arr], [j, j + 1]);
                }
            }
            markSorted(arr.length - i - 1);
        }
    };

    const selectionSort = async (arr: number[]): Promise<void> => {
        for (let i = 0; i < arr.length; i++) {
            let minIdx = i;
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            if (minIdx !== i) {
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                await updateVisualization([...arr], [i, minIdx]);
            }
            markSorted(i);
        }
    };

    const insertionSort = async (arr: number[]): Promise<void> => {
        for (let i = 1; i < arr.length; i++) {
            let j = i;
            while (j > 0 && arr[j] < arr[j - 1]) {
                [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
                await updateVisualization([...arr], [j, j - 1]);
                j--;
            }
    
            // Mark the current element as sorted if it's in its final position
            for (let k = 0; k <= i; k++) {
                if (arr[k] === Math.min(...arr.slice(k))) {
                    markSorted(k);
                }
            }
        }
    
        // After sorting, ensure all elements are marked as sorted
        for (let i = 0; i < arr.length; i++) {
            markSorted(i);
        }
    };
    
    

    return (
        <div className="flex flex-col items-center max-w-4xl mx-auto p-4">
            <Card className="w-full p-6">
                <h1 className="text-2xl font-bold mb-4 text-black">
                    Interactive Sorting Visualizer ({algorithm} sort)
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

                <div className="flex space-x-4">
                    <button
                        onClick={runSort}
                        disabled={sorting}
                        className={`px-4 py-2 rounded ${
                            sorting
                                ? 'bg-gray-400'
                                : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}
                    >
                        {sorting ? 'Sorting...' : 'Start Sort'}
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
