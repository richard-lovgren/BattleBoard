import SearchBar from "@/components/search/search-bar";
import "./search-module.css";
import SearchToggleButton from "@/components/search/search-toggle-btn";
import SearchListItem from "@/components/search/search-list-item";
export default function Search() {
  return (
    <div className="bg-background flex flex-col items-center">
      <main className=" flex-auto item font-odibee text-9xl text-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-between w-[50vw]">
            <div className="text-10xl">Search</div>

            <div className="flex items-center mt-10 h-8">
              <div className="competitons-text text-3xl mr-5 font-nunito font-semibold ">
                Competitions
              </div>
              <SearchToggleButton />
            </div>
          </div>

          <div className="mt-10">
            <SearchBar />
          </div>

          <div className="flex flex-wrap gap-10 justify-center mt-32 min-h-[80vh] w-[80vw] p-20">
            <SearchListItem />
            <SearchListItem />
            <SearchListItem />
            <SearchListItem />
            <SearchListItem />
            <SearchListItem />
            <SearchListItem />
            <SearchListItem />
            <SearchListItem />
            <SearchListItem />
            <SearchListItem />
            <SearchListItem />
            <SearchListItem />
            <SearchListItem />
            <SearchListItem />
          </div>
        </div>
      </main>
    </div>
  );
}
