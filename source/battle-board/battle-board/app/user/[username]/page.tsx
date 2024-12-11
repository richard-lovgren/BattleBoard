"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import LolUsernameBox from "../../../components/add-lol-box";

export default function LoginBtn() {
  const { data: session } = useSession();

  console.log("Session Data:", session?.user.image); // Log the session data to debug

  if (session?.user) {
    return (
      <main className="  text-white min-h-screen flex flex-col items-center px-2 py-2 font-nunito ">
        <div className="bg-slate-500 flex flex-row w-full px-10 py-10 gap-4 bg-transparent  ">
          <div className="relative inline-block">
            <Image
              src={`${session.user.image}`}
              alt="example"
              className="h-auto rounded-[70px]"
              height={200}
              width={200}
            ></Image>
            <div className="absolute inset-0 bg-black bg-opacity-20 rounded-[70px] shadow-inner shadow-black"></div>
          </div>
          <div className="flex flex-col gap py-5">
            <h1 className="text-4xl font-bold font-odibee my-2">
              {session.user.name}
            </h1>
            <h2 className="font-bold">{session.user.display_name}</h2>
            <h2 className="font-bold">
              I like to play{" "}
              <span className="text-foreground">League Of Legends.</span> It&apos;s
              actually my most favourite of games. I get great enjoyment and
              relaxation out of playing league. The rift is calling....
            </h2>
            <LolUsernameBox></LolUsernameBox>
          </div>
        </div>
        <div className="px-5 flex flex-grow flex-row w-full gap-4 bg-purple-500 bg bg-transparent">
          <div className=" w-1/3 p-5 border-2 border-white rounded-xl flex flex-col gap-4 items-center h-fit">
            <div className="bg-foreground rounded-full h-52 w-52 flex items-center justify-center">
              <div className="bg-background rounded-full h-36 w-36 flex items-center justify-center">
                <p className="text-xl font-bold">33%</p>
              </div>
            </div>
            <div className="flex flex-row gap-2 ">
              <p className="text-slate-500 font-thin">18G</p>
              <p className="text-slate-500 font-thin">W6</p>
              <p className="text-slate-500 font-thin">L12</p>
            </div>
          </div>
          <div className=" w-full rounded-xl flex flex-col gap-2 h-1/2 pr-56">
            <div className="bg-foreground w-full flex flex-auto rounded-xl border-2 border-white items-center p-4 text-xl font-bold">
              Competition #1
            </div>
            <div className="bg-foreground w-full flex flex-auto rounded-xl border-2 border-white items-center p-4 text-xl font-bold">
              Competition #2
            </div>
            <div className="bg-foreground w-full flex flex-auto rounded-xl border-2 border-white items-center p-4 text-xl font-bold">
              Competition #3
            </div>
          </div>
        </div>
      </main>
    );
  } else {
    return (
      <div>
        <p className="text-center text-9xl font-odibee">Not logged in</p>
      </div>
    );
  }
}
