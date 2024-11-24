'use client';
import Image from "next/image";
import { useEffect } from "react";
import { Globe, ChevronRight } from "lucide-react";
import AlgorithmSelector from "../components/SelectorAlgo"
import { useRouter } from "next/navigation";
import useGameStore from "../stores/gamestore";

export default function LobbyPage() {
    const router = useRouter();
    const {status, initializeSocket} = useGameStore();

    useEffect(() => {
        initializeSocket();
    }, [initializeSocket]);

    useEffect(() => {
        if (status === 'in_game') {
            router.push('/battle');
        }
    }, [status, router]);

    return (
        <div className="min-h-screen bg-gradient-to-br">
            
        <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-green-500/10 rounded-full blur-3xl" />
        </div>
            <div className="flex items-center justify-center pt-8">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    BATTLE ONLINE
                    <Globe size={24} className="text-lime-600 animate-spin-slow" />
                </h1>
            </div>
       
            <div className="flex flex-row items-center justify-center min-h-[80vh] px-4 md:px-8 lg:px-16 gap-8 lg:gap-16">

                <AlgorithmSelector />


                <div className={`flex-shrink transform transition-all duration-1000`}>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-lime-400 rounded-lg blur opacity-30 group-hover:opacity-70 transition-opacity"></div>
                        <Image
                            src="/demo6.png"
                            alt="logo"
                            width={900}
                            height={900}
                            className="relative rounded-xl transform transition-transform hover:scale-100"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}