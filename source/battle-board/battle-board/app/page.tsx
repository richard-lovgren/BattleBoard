import Hero from "./components/Hero";
import Head from "next/head";

export default function Home() {
  return (
    <div className="bg-background flex flex-col">
      <Head>
        <title>Battle Board</title>
        <meta name="description" content="The Ultimate Scoreboard for Competitive Gaming" />
      </Head>
      <Hero />
      <main className=" flex-auto font-odibee px-6 py-8 ">
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
    </div>
  );
}
