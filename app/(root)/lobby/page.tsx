'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Image from "next/image";
import { Globe, ChevronRight } from "lucide-react";

export default function TreePage() {


    return (
        <div className="min-h-screen bg-gradient-to-br">
            <div className="flex items-center justify-center pt-8">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    BATTLE ONLINE
                    <Globe size={24} className="text-lime-600 animate-spin-slow" />
                </h1>
            </div>
       
            <div className="flex flex-row items-center justify-center min-h-[80vh] px-4 md:px-8 lg:px-16 gap-8 lg:gap-16">

                <div className={`transform transition-all duration-700`}>
                    <Card className="p-6  backdrop-blur shadow-lg hover:shadow-xl transition-shadow">
                        <CardTitle className="text-xl mb-4">
                            Pick an algorithm to practice!
                        </CardTitle>
                        <div className="mb-6">
                            <Select>
                                <SelectTrigger className="w-[300px]">
                                    <SelectValue placeholder="Choose here" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Graphs">Graphs</SelectItem>
                                    <SelectItem value="Trees">Trees</SelectItem>
                                    <SelectItem value="Arrays">Arrays</SelectItem>
                                    <SelectItem value="Random">Anything!</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-lime-600 to-purple-300 bg-clip-text text-transparent">
                                Queue up and prepare for battle!
                            </h2>
                            <button className="flex flex-row animate-pulse rounded-md hover:underline transition-colors duration-2500">
                                <div className="text-md text-gray-500 font-normal">
                                    Start Battle
                                </div>
                                <ChevronRight size={24} className="text-lime-600" />
                            </button>
                        </div>
                    </Card>
                </div>


                <div className={`flex-shrink transform transition-all duration-1000`}>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-lime-400 rounded-lg blur opacity-30 group-hover:opacity-70 transition-opacity"></div>
                        <Image
                            src="/demo4.png"
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