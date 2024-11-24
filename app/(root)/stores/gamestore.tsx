import { create } from 'zustand';
import { Socket, io } from 'socket.io-client';

interface Question {
    _id?: string;
    title: string;
    description: string;
    testCases: Array<{
        testId: string;
        input: string;
        output: string;
    }>;
    type: "graph" | "tree" | "array" | "";
}

interface GameState {
    status: 'idle' | 'queuing' | 'in_game' | 'ended';
    socket: Socket | null;
    question: Question | null;
    opponent: {
        id: string;
        name: string;
    } | null;
    matchId: string | null;
    opponentProgress: {
        tests_passed: number;
        total_tests: number;
    };
    myProgress: {
        tests_passed: number;
        total_tests: number;
    };
    timeRemaining: number;
    initializeSocket: () => void;
    setStatus: (status: GameState['status']) => void;
    setQuestion: (question: Question | null) => void;
    setOpponent: (opponent: GameState['opponent']) => void;
    setMatchId: (matchId: string | null) => void;
    updateProgress: (player: 'me' | 'opponent', progress: { tests_passed: number; total_tests: number }) => void;
    updateTimer: (time: number) => void;
    reset: () => void;
}

const useGameStore = create<GameState>((set, get) => ({
    status: 'idle',
    socket: null,
    question: null,
    opponent: null,
    matchId: null,
    opponentProgress: { tests_passed: 0, total_tests: 0 },
    myProgress: { tests_passed: 0, total_tests: 0 },
    timeRemaining: 1800,

    initializeSocket: () => {
        if (get().socket?.connected) return;

        const socket = io('10.121.128.78:5000');
        
        socket.on('connect', () => {
            console.log('Connected to game server');
        });

        socket.on('match_found', (data) => {
            set({
                status: 'in_game',
                question: data.question,
                opponent: data.opponent,
                matchId: data.match_id,
                myProgress: { tests_passed: 0, total_tests: data.total_tests },
                opponentProgress: { tests_passed: 0, total_tests: data.total_tests }
            });
            // Redirect to battle page
            window.location.href = '/battle';
        });

        socket.on('opponent_progress', (data) => {
            set(state => ({
                opponentProgress: {
                    tests_passed: data.tests_passed,
                    total_tests: data.total_tests
                }
            }));
        });

        socket.on('match_ended', (data) => {
            set(state => ({
                status: 'ended',
            }));
        });

        set({ socket });
    },

    setStatus: (status) => set({ status }),
    setQuestion: (question) => set({ question }),
    setOpponent: (opponent) => set({ opponent }),
    setMatchId: (matchId) => set({ matchId }),
    updateProgress: (player, progress) => set(state => ({
        ...(player === 'me' 
            ? { myProgress: progress }
            : { opponentProgress: progress }
        )
    })),
    updateTimer: (time) => set({ timeRemaining: time }),
    reset: () => set({
        status: 'idle',
        question: null,
        opponent: null,
        matchId: null,
        opponentProgress: { tests_passed: 0, total_tests: 0 },
        myProgress: { tests_passed: 0, total_tests: 0 },
        timeRemaining: 1800
    })
}));

export default useGameStore;