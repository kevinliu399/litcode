'use client';

import React, { useEffect, useRef, useState } from 'react';

type Position = { x: number; y: number };
type CellType = '.' | 'S' | 'E' | '#' | '*' | 'P';

interface VisualizerProps {
    width: number;
    height: number;
    cellSize: number;
    start: Position;
    end: Position;
}

const BFSVisualizer: React.FC<VisualizerProps> = ({
    width,
    height,
    cellSize,
    start,
    end,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>();
    const isRunningRef = useRef(false);
    
    const [grid, setGrid] = useState<CellType[][]>(() => 
        Array.from({ length: height }, () => Array(width).fill('.'))
    );

    const getCellColor = (cell: CellType): string => {
        switch (cell) {
            case 'S': return '#CBC3E3'; // Start 
            case 'E': return '#ef4444'; // End 
            case '#': return '#04D52F'; // Visited 
            case '*': return '#049948'; // Exploring 
            case 'P': return '#CBC3E3'; // Path 
            default: return '#1e293b'; // Default 
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
            
            const displaySpeed = 100;
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
    }, [start, end, width, height, cellSize]);

    return (
        <div className="relative">
            <canvas 
                ref={canvasRef} 
                width={width * cellSize} 
                height={height * cellSize} 
                className="rounded-lg"
            />
        </div>
    );
};

export default BFSVisualizer;