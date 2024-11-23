'use client';

import React, { useEffect, useRef, useState } from 'react';

type Position = { x: number; y: number };
type TimeComplexity = 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n²)' | 'O(2ⁿ)';

interface VisualizerProps {
    width: number;
    height: number;
    cellSize: number;
    start: Position;
    end: Position;
    timeComplexity: TimeComplexity;
}

const BFSVisualizer: React.FC<VisualizerProps> = ({
    width,
    height,
    cellSize,
    start,
    end,
    timeComplexity,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [grid, setGrid] = useState<string[][]>(
        Array.from({ length: height }, () => Array(width).fill('.'))
    );
    const isRunningRef = useRef(true);

    const getDisplaySpeed = (complexity: TimeComplexity): number => {
        const n = Math.max(width, height);

        switch (complexity) {
            case 'O(1)':
                return 50;
            case 'O(log n)':
                return Math.max(50, Math.log2(n) * 30);
            case 'O(n)':
                return Math.max(100, n * 15);
            case 'O(n log n)':
                return Math.max(150, n * Math.log2(n) * 10);
            case 'O(n²)':
                return Math.max(200, Math.pow(n, 2) * 5);
            case 'O(2ⁿ)':
                return Math.max(250, Math.pow(1.5, n) * 20);
            default:
                return 100;
        }
    };

    const drawGrid = (ctx: CanvasRenderingContext2D, gridToDraw: string[][]) => {
        ctx.clearRect(0, 0, width * cellSize, height * cellSize);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const cell = gridToDraw[y][x];
                ctx.fillStyle = getCellColor(cell);
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    };

    const getCellColor = (cell: string): string => {
        switch (cell) {
            case 'S':
                return '#80EF80'; // Start
            case 'E':
                return '#054215'; // End
            case '#':
                return '#04D52F'; // Visited
            case '*':
                return '#049948'; // Exploring
            default:
                return '#000'; // Default
        }
    };

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        const runBFS = async () => {
            const localGrid = grid.map((row) => [...row]);
            const visited = Array.from({ length: height }, () =>
                Array(width).fill(false)
            );

            const queue: Position[] = [start];
            visited[start.y][start.x] = true;

            localGrid[start.y][start.x] = 'S';
            localGrid[end.y][end.x] = 'E';

            const displaySpeed = getDisplaySpeed(timeComplexity);

            while (queue.length > 0 && isRunningRef.current) {
                const current = queue.shift()!;
                if (current.x === end.x && current.y === end.y) {
                    break;
                }

                if (localGrid[current.y][current.x] !== 'S' && localGrid[current.y][current.x] !== 'E') {
                    localGrid[current.y][current.x] = '#';
                }

                drawGrid(ctx, localGrid);
                await new Promise((resolve) => setTimeout(resolve, displaySpeed));

                const neighbors = getNeighbors(current, localGrid);
                for (const neighbor of neighbors) {
                    if (!visited[neighbor.y][neighbor.x]) {
                        visited[neighbor.y][neighbor.x] = true;
                        queue.push(neighbor);
                        if (localGrid[neighbor.y][neighbor.x] !== 'E') {
                            localGrid[neighbor.y][neighbor.x] = '*';
                        }
                    }
                }
            }

            drawGrid(ctx, localGrid);
        };

        const getNeighbors = (pos: Position, localGrid: string[][]): Position[] => {
            const directions = [
                { x: -1, y: 0 },
                { x: 1, y: 0 },
                { x: 0, y: -1 },
                { x: 0, y: 1 },
            ];
            return directions
                .map((dir) => ({ x: pos.x + dir.x, y: pos.y + dir.y }))
                .filter(
                    (neighbor) =>
                        neighbor.x >= 0 &&
                        neighbor.x < width &&
                        neighbor.y >= 0 &&
                        neighbor.y < height &&
                        (localGrid[neighbor.y][neighbor.x] === '.' ||
                            (neighbor.x === end.x && neighbor.y === end.y))
                );
        };

        runBFS();

        return () => {
            isRunningRef.current = false;
        };
    }, [start, end, timeComplexity, width, height, cellSize]);

    return (
        <div className="relative">
            <canvas 
                ref={canvasRef} 
                width={width * cellSize} 
                height={height * cellSize} 
                className="rounded-lg"
            />
            <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded">
                {timeComplexity}
            </div>
        </div>
    );
};

export default BFSVisualizer;
