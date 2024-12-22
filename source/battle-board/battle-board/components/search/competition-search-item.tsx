"use client";

import CompetitionData from "@/models/interfaces/CompetitionData";
import GeneralButton from "../general-btn";
import Image from "next/image";
import { useEffect, useState } from "react";
import formatDate from "@/app/modules/helpers";

import { useRouter } from "next/navigation";
async function fetchGameName(gameId: string): Promise<string | null> {
  const response = await fetch(`/api/game?gameId=${gameId}`);
  if (!response.ok) return null;
  return response.json().then((data) => data.game_name);
}

const competitionTypeEnum: { [key: number]: string } = 
{
  0: "Tournament",
  1: "Classic",
  2: "Rival",
};

export default function CompetitionSearchItem(competition: CompetitionData) {

  const [gameName, setGameName] = useState<string | null>(null);

  useEffect(() => {
    const loadGameName = async () => {
      try {
        const fetchedGameName = await fetchGameName(competition.game_id);
        console.log("fetchedGameName", fetchedGameName);
        if (!fetchedGameName) {
          console.error(
            `Failed to fetch game name for competition: ${competition.competition_name} with game id: ${competition.game_id}`
          );
        }
        setGameName(fetchedGameName || "Unknown Game");
      } catch (error) {
        console.error("Error fetching game name:", error);
        setGameName("Unknown Game");
      }
    };

    loadGameName();
  }, [competition.game_id]);

   const router = useRouter();
  
    const handleNavigation = (id: string) => {
      router.replace(`/competition/${id}`);
    };

  return (
    <div className="flex flex-none flex-col h-[450px] w-[329px] rounded-[2.5rem] bg-gradient-to-br from-[#4E35BE] to-[#241958]">
      <div className="flex flex-none items-center justify-center rounded-t-[2.5rem] bg-[#D9D9D9] h-[173px] ">
        <Image
          src="/image.svg"
          alt="image-placeholder"
          className="fit"
          width={50}
          height={100}
        />
      </div>
      <div className="item-container flex flex-col text-[16px] font-outfit p-4">
        <div className="flex flex-col ml-3 mb-3">
          <span className="flex items-center text-[24px] mb-4">
            {competition.competition_name}
          </span>
          <span className="flex items-center">
            <Image
              src="/controller.svg"
              alt="search"
              className="h-12 w-12 my-[-5px]"
              width={50}
              height={50}
            />
            {gameName || "Loading..."}
          </span>
          <span className="flex items-center">
            <Image
              src="/customer.svg"
              alt="search"
              className="h-12 w-12 my-[-5px]"
              width={50}
              height={50}
            />
            {competition.participants} participants
          </span>
          <span className="flex items-center">
            <Image
              src="/calendar.svg"
              alt="search"
              className="h-12 w-12 my-[-5px]"
              width={50}
              height={50}
            />
            Start date
          </span>
          <span className="flex items-center ml-12 my-2">
            {competitionTypeEnum[competition.competition_type]}
          </span>
        </div>
        <div className="flex items-center justify-center">
          <GeneralButton text="View" 
            onClick={() => handleNavigation((competition.id).toString())}
            />
        </div>
      </div>
    </div>
  );
}
