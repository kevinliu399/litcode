'use client';
import Image from "next/image";
import { Button } from "./components/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  let graphNav = () => {
    router.push("/graph");
  };

  let treeNav = () => {
    router.push("/tree");
  };

  let arrNav = () => {
    router.push("/array");
  };

  return (
    <div>
      <nav>
        <div>
          <button>login</button>
        </div>
      </nav>
      <div className="h-screen w-screen flex items-center justify-center cursor-default">

        <div className="flex flex-col items-center space-y-8">

          <div className="flex flex-col items-center space-y-2">
            <h1 className="font-bold text-6xl">LitCode</h1>
            <h3 className="text-center text-2xl">
              Practice makes <a className="text-lime-400">perfect</a>.
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
                <Button text={"graph"} onClick={graphNav} />
                <Button text={"tree"} onClick={treeNav} />
                <Button text={"array"} onClick={arrNav} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
