'use client';
import Image from "next/image";
import { MyButton } from "./components/MyButton";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();

  let nav = () => {
    router.push("/lobby");
  }

  return (
    <div>
      <div className="h-screen w-screen flex items-center justify-center cursor-default">

        <div className="flex flex-col items-center space-y-8">

          <div className="flex flex-col items-center space-y-2">
            <h1 className="font-extrabold text-7xl bg-gradient-to-r from-lime-600 to-purple-200 bg-clip-text text-transparent">LitCode</h1>
            <h3 className="text-center text-2xl font-semibold">
              Practice makes <a className="text-lime-400 italic">perfect</a>
            </h3>
          </div>

          <div className="flex flex-row mr-20">
            <div className="">
              <Image
                src="/arrow-white.png"
                alt="logo"
                width={100}
                height={100}
                className="rotate-180 scale-x-[-1]"
              />
            </div>
            <div className="flex flex-row items-center justify-center space-x-6">
              <div className="flex flex-row justify-center space-x-6">
                <MyButton text={"graph"} onClick={nav} />
                <MyButton text={"tree"} onClick={nav}/>
                <MyButton text={"array"} onClick={nav}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
