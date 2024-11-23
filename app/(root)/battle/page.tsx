'use client';
import React from 'react';
import EditorComponent from '../components/EditorComponent';
import { Check, Hourglass } from 'lucide-react';
import SidebarBattle from '../components/SideBarBattle';
import { Badge } from "@/components/ui/badge";


const Battle = () => {
  return (
    <div>
      <div className="flex flex-row justify-evenly py-8 space-x-2 cursor-default">
        <div className="flex font-bold">
          <div className="mr-2">Battling:</div>
          <div className="text-lime-400 transition-all">
            orlolol
          </div>
        </div>

        <div className="relative flex text-sm bg-neutral-800 px-4 py-2 rounded-md shadow-sm">
          <div className="mr-2 flex flex-row">
            Timer
            <Hourglass size={15} className="mx-2 mt-[0.1rem]" />
          </div>
          <p>00:00:00</p>
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
