"use client";
import SearchBar from "@/components/search/search-bar";
import SearchToggleButton from "@/components/search/search-toggle-btn";
import CompetitonSearchItem from "@/components/search/competition-search-item";
import CommunitySearchItem from "@/components/search/community-search-item";

import CompetitionData from "@/models/interfaces/CompetitionData";
import Community from "@/models/community";

import { useEffect, useState } from "react";
import ButtonData from "@/models/component-props/button-data";
import SearchBarData from "@/models/component-props/search-bar-data";

async function getCompetitions(): Promise<CompetitionData[]> {
  const response = await fetch("/api/competitions/public");
  return await response.json();
}

async function getCommunities(): Promise<Community[]> {
  const response = await fetch("/api/community/public");
  const data = await response.json();
  return data
}


export default function Search() {
  /* State */
  const [toggleCompetitions, setToggleCompetitions] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [competitions, setCompetitions] = useState<CompetitionData[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filteredCompetitions, setFilteredCompetitions] = useState(competitions);
  const [filteredCommunities, setFilteredCommunities] = useState(communities);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = () => {
    console.log("toggled competitions/community");
    setToggleCompetitions(!toggleCompetitions);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const searchTerm = e.target.value.toLowerCase();
    setSearchString(searchTerm);
    setFilteredCommunities(communities.filter((comm) => comm.community_name.toLowerCase().includes(searchTerm)));
    setFilteredCompetitions(competitions.filter((comp) => comp.competition_name.toLowerCase().includes(searchTerm)));
  }

  const searchBarData: SearchBarData = {
    searchString: searchString,
    handleChange: handleInputChange,
  }

  const buttonData: ButtonData = {
    isOn: toggleCompetitions,
    handleOnClick: handleToggle,
  };
  useEffect(() => {
    const savedValue = window.localStorage.getItem("toggleCompetitions");
    if(savedValue === "true") {
      setToggleCompetitions(Boolean(savedValue));
    }
  },[]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        window.localStorage.setItem("toggleCompetitions", toggleCompetitions.toString());
        
        if (toggleCompetitions) {
          const competitionData = await getCompetitions();
          console.log("competitionData", competitionData);
          setCompetitions(competitionData);
          setFilteredCompetitions(competitionData);

          if(searchString) {
            setFilteredCompetitions(competitionData.filter((comp) => comp.competition_name.toLowerCase().includes(searchString)));
          }
        } else {
          const communityData = await getCommunities();
          console.log("communityData", communityData);
          setCommunities(communityData);
          setFilteredCommunities(communityData);
          if(searchString) {
            setFilteredCommunities(communityData.filter((comm) => comm.community_name.toLowerCase().includes(searchString)));
          }
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
            <div className="text-8xl">Search</div>

            <div className="flex items-center h-8">
              <div className="textshadow text-2xl mr-5 font-nunito font-semibold">
                {toggleCompetitions ? "Competitions" : "Communities"}
              </div>
              <SearchToggleButton {...buttonData} />
            </div>
          </div>

          <div className="mt-10">
            <SearchBar {...searchBarData} />
          </div>

          <div className="flex flex-wrap gap-10 justify-center mt-10 min-h-[80vh] w-[80vw] p-8">
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {!loading && !error && toggleCompetitions && (
              <>
                {filteredCompetitions.map((comp) => (
                  <CompetitonSearchItem key={comp.id} {...comp} />
                ))}
              </>
            )}
            {!loading && !error && !toggleCompetitions && (
              <>
                {filteredCommunities.map((comm) => (
                  <CommunitySearchItem key={comm.community_name} {...comm} />
                ))}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
