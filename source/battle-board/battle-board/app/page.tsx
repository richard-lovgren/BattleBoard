'use client';

import { redirect } from 'next/navigation'
import LoginBtn from '../components/login-btn'
import Head from 'next/head';


import Hero from "./components/Hero";

export default function Home() {
  return (
    <>
      <Head>
        <title>Battle Board</title>
        <meta name="description" content="The Ultimate Scoreboard for Competitive Gaming" />
      </Head>
      <Hero />
      <main className="bg-[#0b0320] text-white min-h-screen flex flex-col items-center px-6 py-8">
        <header className="w-full flex justify-between items-center py-4 px-8">
          <h1 className="text-2xl font-bold">Battle/Board</h1>
          <div className="flex items-center space-x-4">
            <LoginBtn />
          </div>
        </header>

        <section className="flex flex-col items-center text-center mt-16">
          <div className="border border-white rounded-lg p-8 relative">
            <h1 className="text-5xl font-bold mb-4">
              Battle
              <br />
              <span className="text-5xl font-bold">Board</span>
            </h1>
            <p className="text-lg text-gray-300">
              The Ultimate Scoreboard for Competitive Gaming
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Track your wins, manage competitions, and connect with your gaming community.
              Create competitions, showcase your skills, and rise to the top!
            </p>
          </div>
        </section>

        <section className="mt-16 w-full text-center">
          <h2 className="text-3xl font-bold mb-8">Features</h2>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
            <div className="border border-white rounded-lg p-6 w-80">
              <h3 className="text-xl font-bold">Communities</h3>
              <p className="mt-2 text-gray-300">
                skibidi skibidi skibidi skibidi.
              </p>
            </div>
            <div className="border border-white rounded-lg p-6 w-80">
              <h3 className="text-xl font-bold">Competitions</h3>
              <p className="mt-2 text-gray-300">
                rizz rizz rizz rizz rizz.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16 w-full text-center">
          <h2 className="text-3xl font-bold mb-8">Competition Modes</h2>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
            <div className="border border-white rounded-lg p-6 w-64">
              <h3 className="text-xl font-bold">Tournament</h3>
              <img src="/tournament.svg" alt="Tournament Mode" className="mt-4" />
            </div>
            <div className="border border-white rounded-lg p-6 w-64">
              <h3 className="text-xl font-bold">Classic</h3>
              <img src="/classic_mode_icon.svg" alt="Classic Mode" className="mt-4" />
            </div>
            <div className="border border-white rounded-lg p-6 w-64">
              <h3 className="text-xl font-bold">Rival</h3>
              <img src="/rival_mode_icon.svg" alt="Rival Mode" className="mt-4" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
