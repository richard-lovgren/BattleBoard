import SearchBar from "@/components/search/search-bar";
import './search-module.css';
import SearchToggleButton from "@/components/search/search-toggle-btn";
import CompetitonSearchItem from "@/components/search/competition-search-item";

import Competition from "@/models/competition";
import Community from "@/models/community";

let communities : Community[] = [
  {
    title: "Uppsala Fighting Game Club",
    game: "Street Fighter",
    active_competitions: 1,
    created_date: "1 january 2020"
  },
  {
    title: "BattleBoard Team",
    game: "Leauge of legends",
    active_competitions: 0,
    created_date: "1 october 2024"
  }
]

let competitons : Competition[] = [
  {
    title: "LOL rival leauge",
    game: "Leauge of legends",
    participants: 2,
    competition_type: "rival match",
    start_date: "1 december 2024"
  },
  {
    title: "Kappa Clash 10",
    game: "Street Fighter 6",
    participants: 30,
    competition_type: "leauge match",
    start_date: "7 september 2024"
  }
]

let test : Competition =   {
  title: "Kappa Clash 10",
  game: "Street Fighter 6",
  participants: 30,
  competition_type: "leauge match",
  start_date: "7 september 2024"
}
export default function Search() {
  return (
    <div className="bg-background flex flex-col items-center">
      <main className=" flex-auto item font-odibee text-9xl text-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-between w-[50vw]">
            <div className="text-10xl">Search</div>

            <div className="flex items-center mt-10 h-8">
              <div className="competitons-text text-3xl mr-5 font-nunito font-semibold ">Competitions</div> 
              <SearchToggleButton/>
            </div>

          </div>

          <div className="mt-10">
            <SearchBar/>
          </div>

          <div className="flex flex-wrap gap-10 justify-center mt-32 min-h-[80vh] w-[80vw] p-20">
            {competitons.map(comp => (
                <CompetitonSearchItem
                key={comp.title}
                title={comp.title} 
                participants={comp.participants} 
                competition_type={comp.competition_type}
                game={comp.game}
                start_date={comp.start_date}
                />
            ))}
            
          </div>
        </div>


      </main>
    </div>
  );
}
