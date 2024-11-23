'use client';

import React, { useEffect, useRef, useState } from 'react';

type Position = { x: number; y: number };
type TimeComplexity = 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n²)' | 'O(2ⁿ)';
type CellType = '.' | 'S' | 'E' | '#' | '*' | 'P';

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
    const animationFrameRef = useRef<number>();
    const isRunningRef = useRef(false);
    
    const [grid, setGrid] = useState<CellType[][]>(() => 
        Array.from({ length: height }, () => Array(width).fill('.'))
    );

    const getDisplaySpeed = (complexity: TimeComplexity): number => {
        const n = Math.max(width, height);
        switch (complexity) {
            case 'O(1)': return 100;
            case 'O(log n)': return Math.max(100, Math.log2(n) * 20);
            case 'O(n)': return Math.max(100, n * 10);
            case 'O(n log n)': return Math.max(100, n * Math.log2(n) * 5);
            case 'O(n²)': return Math.max(100, Math.pow(n, 1.5) * 2);
            case 'O(2ⁿ)': return Math.max(100, Math.pow(1.2, n) * 10);
            default: return 100;
        }
    };

    const getCellColor = (cell: CellType): string => {
        switch (cell) {
            case 'S': return '#22c55e'; // Start (green)
            case 'E': return '#ef4444'; // End (red)
            case '#': return '#0ea5e9'; // Visited (blue)
            case '*': return '#60a5fa'; // Exploring (light blue)
            case 'P': return '#22c55e'; // Path (green)
            default: return '#1e293b'; // Default (dark slate)
        }
    };

    const drawGrid = (ctx: CanvasRenderingContext2D, gridToDraw: CellType[][]) => {
        ctx.clearRect(0, 0, width * cellSize, height * cellSize);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const cell = gridToDraw[y][x];
                
                // Fill cell
                ctx.fillStyle = getCellColor(cell);
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                
                // Draw border
                ctx.strokeStyle = '#334155';
                ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);

                // Draw indicators for start and end
                if (cell === 'S' || cell === 'E') {
                    ctx.fillStyle = '#fff';
                    ctx.font = `${cellSize * 0.5}px sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(
                        cell === 'S' ? 'S' : 'E',
                        x * cellSize + cellSize / 2,
                        y * cellSize + cellSize / 2
                    );
                }
            }
        }
    };

    const reconstructPath = (
        cameFrom: Map<string, Position>,
        current: Position,
        gridToDraw: CellType[][]
    ): CellType[][] => {
        const path: Position[] = [current];
        const key = `${current.x},${current.y}`;
        let currentKey = key;

        while (cameFrom.has(currentKey)) {
            const previous = cameFrom.get(currentKey)!;
            path.unshift(previous);
            currentKey = `${previous.x},${previous.y}`;
        }

        const newGrid = gridToDraw.map(row => [...row]);
        path.forEach(pos => {
            if (newGrid[pos.y][pos.x] !== 'S' && newGrid[pos.y][pos.x] !== 'E') {
                newGrid[pos.y][pos.x] = 'P';
            }
        });

        return newGrid;
    };

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        const runBFS = async () => {
            isRunningRef.current = true;
            const localGrid = Array.from({ length: height }, () => 
                Array(width).fill('.') as CellType[]
            );
            const cameFrom = new Map<string, Position>();
            const visited = new Set<string>();
            const queue: Position[] = [start];
            
            // Set start and end points
            localGrid[start.y][start.x] = 'S';
            localGrid[end.y][end.x] = 'E';
            
            const displaySpeed = getDisplaySpeed(timeComplexity);
            let foundPath = false;

            while (queue.length > 0 && isRunningRef.current) {
                const current = queue.shift()!;
                const currentKey = `${current.x},${current.y}`;

                if (current.x === end.x && current.y === end.y) {
                    foundPath = true;
                    break;
                }

                if (localGrid[current.y][current.x] !== 'S') {
                    localGrid[current.y][current.x] = '#';
                }

                drawGrid(ctx, localGrid);
                await new Promise(resolve => setTimeout(resolve, displaySpeed));

                const directions = [
                    { x: -1, y: 0 }, { x: 1, y: 0 },
                    { x: 0, y: -1 }, { x: 0, y: 1 }
                ];

                for (const dir of directions) {
                    const neighbor: Position = {
                        x: current.x + dir.x,
                        y: current.y + dir.y
                    };

                    const neighborKey = `${neighbor.x},${neighbor.y}`;

                    if (
                        neighbor.x >= 0 && neighbor.x < width &&
                        neighbor.y >= 0 && neighbor.y < height &&
                        !visited.has(neighborKey) &&
                        (localGrid[neighbor.y][neighbor.x] === '.' || 
                         localGrid[neighbor.y][neighbor.x] === 'E')
                    ) {
                        visited.add(neighborKey);
                        queue.push(neighbor);
                        cameFrom.set(neighborKey, current);
                        
                        if (localGrid[neighbor.y][neighbor.x] !== 'E') {
                            localGrid[neighbor.y][neighbor.x] = '*';
                        }
                    }
                }
            }

            if (foundPath) {
                const finalGrid = reconstructPath(cameFrom, end, localGrid);
                drawGrid(ctx, finalGrid);
            }
        };

        // Reset and start
        isRunningRef.current = false;
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        setTimeout(() => runBFS(), 100);

        return () => {
            isRunningRef.current = false;
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
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