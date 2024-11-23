import React from "react";
import Link from "next/link";
import { CircleArrowLeft } from "lucide-react";

type NavBarProps = {};

function NavBar(props: NavBarProps) {
  return (
    <nav className="text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex-shrink-0">
            <Link href="/">
              <CircleArrowLeft size={18} className="hover:text-lime-400 transition-all"/>
            </Link>
          </div>

          <div className="hidden md:flex">
            <Link href="/">
              <div className="underline hover:text-lime-400 transition-all text-sm">login</div>
            </Link>
          </div>
      </div>

      </div>
    </nav>
  );
}

export default NavBar;
