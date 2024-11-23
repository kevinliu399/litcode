'use client';

import React, { useEffect, useRef, useState } from 'react';

type Position = { x: number; y: number };

interface VisualizerProps {
    width: number;
    height: number;
    cellSize: number;
    start: Position;
    end: Position;
    displaySpeed: number; // Speed in milliseconds
}

const BFSVisualizer: React.FC<VisualizerProps> = ({
    width,
    height,
    cellSize,
    start,
    end,
    displaySpeed,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [grid, setGrid] = useState<string[][]>(
        Array.from({ length: height }, () => Array(width).fill('.'))
    );

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        const drawGrid = (gridToDraw: string[][]) => {
            ctx.clearRect(0, 0, width * cellSize, height * cellSize);

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const cell = gridToDraw[y][x];
                    ctx.fillStyle = getCellColor(cell);

                    ctx.fillRect(
                        x * cellSize,
                        y * cellSize,
                        cellSize,
                        cellSize
                    );
                    ctx.strokeRect(
                        x * cellSize,
                        y * cellSize,
                        cellSize,
                        cellSize
                    );
                }
            }
        };

        const runBFS = async () => {
            // Create a local mutable grid copy
            const localGrid = grid.map((row) => [...row]);
            const visited = Array.from({ length: height }, () =>
                Array(width).fill(false)
            );

            const queue: Position[] = [start];
            visited[start.y][start.x] = true;

            localGrid[start.y][start.x] = 'S';
            localGrid[end.y][end.x] = 'E';

            while (queue.length > 0) {
                const current = queue.shift()!;
                if (current.x === end.x && current.y === end.y) break;

                if (localGrid[current.y][current.x] !== 'S' && localGrid[current.y][current.x] !== 'E') {
                    localGrid[current.y][current.x] = '#';
                }

                drawGrid(localGrid);
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

            // Update state only once after BFS completes
            setGrid(localGrid);
            drawGrid(localGrid);
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

        const getCellColor = (cell: string): string => {
            switch (cell) {
                case 'S':
                    return '#80EF80';
                case 'E':
                    return '#054215';
                case '#':
                    return '#04D52F';
                case '*':
                    return '#049948';
                default:
                    return '#000';
            }
        };

        runBFS();
    }, [start, end, displaySpeed, width, height, cellSize]); // Dependencies include start, end, and displaySpeed

    return <canvas ref={canvasRef} width={width * cellSize} height={height * cellSize} />;
};

export default BFSVisualizer;
