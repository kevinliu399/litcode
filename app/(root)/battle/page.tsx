'use client';
import React from 'react';
import EditorComponent from '../components/EditorComponent';
import { Check, Hourglass } from 'lucide-react';
import SidebarBattle from '../components/SideBarBattle';
import { Badge } from "@/components/ui/badge";


const Battle = () => {
  return (
    <div className='relative overflow-hidden h-screen'>
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-green-500/10 rounded-full blur-3xl" />
      </div>
      <div className="flex flex-row justify-evenly py-8 space-x-2 cursor-default">
        <div className="flex font-bold">
          <div className="mr-2">Battling:</div>
          <div className="text-lime-400 transition-all">
            orlolol
          </div>
        </div>

        <div className="relative flex text-sm bg-neutral-800 px-4 py-2 rounded-md shadow-sm">
          <div className="mr-2 flex flex-row items-center">
            Timer
            <Hourglass size={15} className="mx-2 mt-[0.1rem]" />
          </div>
          <p>00:00:00</p>
          <div className="absolute -top-1 -right-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
            </span>
          </div>
        </div>


        <div>
          <div className="flex flex-row underline text-sm space-x-2">
            
            <Badge variant="outline" className="mt-1"> <Check size={20} className="text-lime-400 m-1" /> 13/23 tests passed </Badge>
          </div>
        </div>
      </div>
      <div className="flex flex-row w-full justify-center">
        <EditorComponent />
        <SidebarBattle />
      </div>
    </div>
  );
};

export default Battle;
