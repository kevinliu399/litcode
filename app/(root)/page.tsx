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
    <main className="relative overflow-hidden h-screen">
      {/* Grid pattern with glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-green-500/10 rounded-full blur-3xl" />
      </div>

      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-8">
          <div className="flex flex-col items-center space-y-2">
            <h1
              className="font-extrabold text-7xl"
              style={{
                textShadow: '0 0 4px rgba(255, 255, 255, 255), 0 0 6px rgba(255, 255, 255, 255)',
              }}
            >
              LitCode
            </h1>
            <h3 className="text-center text-2xl font-semibold text-white">
              Practice makes <span className="text-lime-400 italic">perfect</span>
            </h3>
          </div>
          
          <div className="flex flex-row mr-20">
            <div>
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
                <MyButton text="graph" onClick={nav} />
                <MyButton text="tree" onClick={nav} />
                <MyButton text="array" onClick={nav} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}