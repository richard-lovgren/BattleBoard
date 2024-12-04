"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function LoginBtn() {
  const { data: session } = useSession();

  console.log("Session Data:", session?.user.image); // Log the session data to debug

  if (session?.user) {
    return (
      <main className="  text-white min-h-screen flex flex-col items-center px-2 py-2 font-nunito ">
        <div className="bg-slate-500 flex flex-row w-full px-10 py-10 gap-4 bg-transparent  ">
          <div className="relative inline-block">
            <img
              src={`${session.user.image}`}
              alt="example"
              className="w-full h-auto rounded-[25px]"
            ></img>
            <div className="absolute inset-0 bg-black bg-opacity-20 rounded-[25px] shadow-inner shadow-black"></div>
          </div>

          <div className="flex flex-col gap-4 py-5">
            <h1 className="text-4xl font-bold font-odibee">
              {session.user.name}
            </h1>
            <h2>{session.user.display_name}</h2>
          </div>
        </div>
        <div className="flex-auto w-full text-transparent">Test</div>
      </main>
    );
  } else {
    return (
      <div>
        <p className="text-center text-9xl">Not logged in</p>
      </div>
    );
  }
}
