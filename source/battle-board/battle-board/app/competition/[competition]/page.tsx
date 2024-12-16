//A default export react NextJS server side rendered page component.

import Image from "next/image";
import ClassicMode from "@/components/competitionModes/ClassicMode";

export default function CompetitionPage() {
  const competition = {
    name: "Competition name",
    description: "League of legends",

    game: "lorem ipsum sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
  };

  return (
    <div className="w-full h-full  flex flex-col gap-4 items-center">
      <div className="w-full  flex text-slate-50 text-3xl flex-row items-center gap-4 px-10 py-0">
        <div className="relative inline-block flex-grow flex-shrink-0 w-96 h-96">
          <Image
            src="/competition-placeholder.jpg"
            alt="example"
            className="rounded-full"
            layout="fill"
            objectFit="cover"
          ></Image>
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full shadow-inner shadow-black"></div>
        </div>

        <div className="flex flex-col gap-4  h-full pl-12 pr-36">
          <h1 className="flex text-8xl font-odibee text-white">
            {competition.name}
          </h1>
          <h2 className="flex text-4xl font-odibee text-white text-wrap">
            {competition.description}
          </h2>

          <h3 className="flex text-xl font-odibee text-white">
            {competition.game}
          </h3>
        </div>

        <div className="flex flex-col gap-5  h-full items-center">
          <Image
            src="/rival_mode_icon.svg"
            alt="Competition Type Image"
            width={100}
            height={100}
          ></Image>
          <Image
            src="/user.svg"
            alt="Players Icon Image"
            width={100}
            height={100}
          ></Image>
          <div className="flex flex-col gap-0 items-center">
            <h1 className="flex text-xl font-odibee text-white py-0 my-0">
              23/12
            </h1>

            <h1 className="flex text-xl font-odibee text-white py-0 my-0">
              2024
            </h1>
          </div>
        </div>
      </div>
      <div>
        <ClassicMode />
      </div>
    </div>
  );
}
