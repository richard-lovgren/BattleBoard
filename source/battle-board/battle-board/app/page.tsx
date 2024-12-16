"use client";

import Head from "next/head";

import Hero from "../components/Hero";
import GeneralButton from "@/components/general-btn";
import Link from "next/link";

import Image from "next/image";

export default function Home() {
  return (
    <>
      <Head>
        <title>Battle Board</title>
        <meta
          name="description"
          content="The Ultimate Scoreboard for Competitive Gaming"
        />
      </Head>
      <Hero />
      <main className="bg-background text-white min-h-screen flex flex-col items-center px-6 py-8 font-nunito ">
        <section className="mt-16 w-full text-center">
          <h2 className="text-5xl font-bold mb-8 font-odibee ">Features</h2>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
            <div className="flex flex-col items-center justify-center border-solid border-white border-[5px] shadow-lg shadow-indigo-500/50 rounded-3xl p-6 w-80">
              <h3 className="textshadow text-xl font-bold">Communities</h3>
              <p className="mt-2 mb-4 text-gray-300">
                Create your own community or join exsisting ones.
                Already part of community in discord? In that case you are already all set up!
              </p>
              <Link href="/createCommunity"><GeneralButton text="Create community"/></Link>
            </div>
            <div className="flex flex-col items-center justify-center border-solid border-white border-[5px] shadow-lg shadow-indigo-500/50 rounded-3xl p-6 w-80">
              <h3 className="textshadow text-xl font-bold">Competitions</h3>
              <p className="mt-2 mb-4 text-gray-300">
                Create or join communities on BattleBoard. Competitions types include 
                tournament bracket mode, rival mode and classic mode.
              </p>
              <Link href="/createCompetition" ><GeneralButton text="Create competition"/></Link>
            </div>
          </div>
        </section>

        <section className="mt-16 w-full text-center">
          <h2 className="text-5xl font-bold mb-8 font-odibee ">
            Competition Modes
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
            <div className="border border-white rounded-lg p-6 w-64 flex-col flex items-center">
              <h3 className="text-xl font-bold">Tournament</h3>
              <Image
                src="/tournament.svg"
                alt="Tournament Mode"
                className="mt-4"
                height={100}
                width={100}
              />
            </div>
            <div className="border border-white rounded-lg p-6 w-64 flex-col flex items-center ">
              <h3 className="text-xl font-bold">Classic</h3>
              <Image
                src="/classic_mode_icon.svg"
                alt="Classic Mode"
                className="mt-4"
                height={100}
                width={100}
              />
            </div>
            <div className="border border-white rounded-lg p-6 w-64 flex-col flex items-center ">
              <h3 className="text-xl font-bold">Rival</h3>
              <Image
                src="/rival_mode_icon.svg"
                alt="Rival Mode"
                className="mt-4"
                height={100}
                width={100}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
