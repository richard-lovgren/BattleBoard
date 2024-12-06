"use client";
import SearchBar from "@/components/search/search-bar";
import "./search-module.css";
import SearchToggleButton from "@/components/search/search-toggle-btn";
import CompetitonSearchItem from "@/components/search/competition-search-item";
import CommunitySearchItem from "@/components/search/community-search-item";

import Competition from "@/models/competition";
import Community from "@/models/community";

import { useState } from "react";
import ButtonData from "@/models/button-data";

export default function Search() {
  /* State */
  const [toggleCompetitions, setToggleCompetitions] = useState(true);

  const handleToggle = () => {
    console.log("toggled competitions/community");
    setToggleCompetitions(!toggleCompetitions);
  };

  /* Static placeholder data */
  const buttonData: ButtonData = {
    isOn: toggleCompetitions,
    handleOnClick: handleToggle,
  };

  const communities: Community[] = [
    {
      id: 1,
      title: "Uppsala FGC",
      game: "Street Fighter 6, Tekken 8",
      members: 50,
      created_date: "1 january 2020",
    },
    {
      id: 2,
      title: "BattleBoard Team",
      game: "Software Engineering Project",
      members: 5,
      created_date: "1 october 2024",
    },
    {
      id: 3,
      title: "Pathetic Failure Squad",
      game: "Dota 2",
      members: 10,
      created_date: "1 january 2024",
    },
    {
      id: 4,
      title: "Community Title",
      game: "Associated game/games",
      members: 10,
      created_date: "date",
    },
    {
      id: 5,
      title: "Community Title",
      game: "Associated game/games",
      members: 10,
      created_date: "date",
    },
    {
      id: 6,
      title: "Community Title",
      game: "Associated game/games",
      members: 10,
      created_date: "date",
    },
    {
      id: 7,
      title: "Community Title",
      game: "Associated game/games",
      members: 10,
      created_date: "date",
    },
    {
      id: 8,
      title: "Community Title",
      game: "Associated game/games",
      members: 10,
      created_date: "date",
    },
  ];

  const competitons: Competition[] = [
    {
      id: 1,
      title: "LOL rival league",
      game: "League of legends",
      participants: 2,
      competition_type: "Rival match",
      start_date: "1 december 2024",
    },
    {
      id: 2,
      title: "Kappa Clash 10",
      game: "Street Fighter 6",
      participants: 30,
      competition_type: "Leauge match",
      start_date: "7 september 2024",
    },
    {
      id: 3,
      title: "Lab Wars: Ångström Edt",
      game: "Among Us",
      participants: 20,
      competition_type: "Tournament",
      start_date: "5 september 2025",
    },
    {
      id: 4,
      title: "Competition Title",
      game: "Game",
      participants: 10,
      competition_type: "Competition type",
      start_date: "Start date",
    },
    {
      id: 5,
      title: "Competition Title",
      game: "Game",
      participants: 10,
      competition_type: "Competition type",
      start_date: "Start date",
    },
    {
      id: 6,
      title: "Competition Title",
      game: "Game",
      participants: 10,
      competition_type: "Competition type",
      start_date: "Start date",
    },
    {
      id: 7,
      title: "Competition Title",
      game: "Game",
      participants: 10,
      competition_type: "Competition type",
      start_date: "Start date",
    },
    {
      id: 8,
      title: "Competition Title",
      game: "Game",
      participants: 10,
      competition_type: "Competition type",
      start_date: "Start date",
    },
  ];
  /* End of Static placeholder data */

  return (
    <div className="bg-background flex flex-col items-center">
      <main className=" flex-auto item font-odibee text-9xl text-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-between w-[50vw]">
            <div className="text-10xl">Search</div>

            <div className="flex items-center mt-10 h-8">
              <div className="competitons-text text-3xl mr-5 font-nunito font-semibold ">
                {toggleCompetitions ? "Competitions" : "Communities"}
              </div>
              <SearchToggleButton {...buttonData} />
            </div>
          </div>

          <div className="mt-10">
            <SearchBar />
          </div>

          <div className="flex flex-wrap gap-10 justify-center mt-32 min-h-[80vh] w-[80vw] p-20">
            {toggleCompetitions && (
              <>
                {competitons.map((comp) => (
                  <CompetitonSearchItem key={comp.id} {...comp} />
                ))}
              </>
            )}

            {!toggleCompetitions && (
              <>
                {communities.map((comm) => (
                  <CommunitySearchItem key={comm.id} {...comm} />
                ))}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
