"use client";
import SearchBar from "@/components/search/search-bar";
import SearchToggleButton from "@/components/search/search-toggle-btn";
import CompetitonSearchItem from "@/components/search/competition-search-item";
import CommunitySearchItem from "@/components/search/community-search-item";

import CompetitionData from "@/models/interfaces/CompetitionData";
import Community from "@/models/community";

import { useEffect, useState } from "react";
import ButtonData from "@/models/button-data";

async function getCompetitions(): Promise<CompetitionData[]> {
  const response = await fetch("/api/competitions/public");
  return await response.json();
}

async function getCommunities(): Promise<Community[]> {
  const response = await fetch("/api/community/public");
  const data = await response.json();
  const sketchyJSInts = data.map((item: any) => ({
    ...item,
    id: item.id.toString()
  }));
  return sketchyJSInts;
}


export default function Search() {
  /* State */
  const [toggleCompetitions, setToggleCompetitions] = useState(localStorage.getItem('toggleCompetitions') === 'true');
  const [competitions, setCompetitions] = useState<CompetitionData[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = () => {
    console.log("toggled competitions/community");
    setToggleCompetitions(!toggleCompetitions);
  };

  /* Static placeholder data */
  const buttonData: ButtonData = {
    isOn: toggleCompetitions,
    handleOnClick: handleToggle,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        localStorage.setItem('toggleCompetitions', toggleCompetitions.toString())

        if (toggleCompetitions) {
          const competitionData = await getCompetitions();
          console.log("competitionData", competitionData);
          setCompetitions(competitionData);
        } else {
          const communityData = await getCommunities();
          console.log("communityData", communityData);
          setCommunities(communityData);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toggleCompetitions]);
  
  /* End of Static placeholder data */

  return (
    <div className="bg-background flex flex-col items-center">
      <main className="flex-auto item font-odibee text-9xl text-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-between w-[50vw]">
            <div className="text-10xl">Search</div>

            <div className="flex items-center mt-10 h-8">
              <div className="textshadow text-3xl mr-5 font-nunito font-semibold">
                {toggleCompetitions ? "Competitions" : "Communities"}
              </div>
              <SearchToggleButton {...buttonData} />
            </div>
          </div>

          <div className="mt-10">
            <SearchBar />
          </div>

          <div className="flex flex-wrap gap-10 justify-center mt-32 min-h-[80vh] w-[80vw] p-20">
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {!loading && !error && toggleCompetitions && (
              <>
                {competitions.map((comp) => (
                  <CompetitonSearchItem key={comp.id} {...comp} />
                ))}
              </>
            )}
            {!loading && !error && !toggleCompetitions && (
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
