'use client';
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import NavBar from "../components/navbar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { MyButton } from "../components/MyButton";

export default function TreePage() {

    return (
        <div>
            <NavBar />
            <div className="h-screen w-screen">
                <div className="flex items-center justify-center">
                    <h1 className="text-2xl font-bold">Find an opponent</h1>
                </div>
                <div className="flex flex-col space-y-2 p-4 mt-2 w-full ">
                    <div>
                        <h1>
                            Pick an algorithm to practice!
                        </h1>
                    </div>
                    <div className="">
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
                </div>

                <div>
                    <h1>Battle Online</h1>
                    <p> and refine your DSA skills</p>
                </div>

            </div>
        </div>
    )
}