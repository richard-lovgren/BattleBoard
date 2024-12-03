import SearchBar from "@/components/search/search-bar";
import './search-module.css';
export default function Search() {
  return (
    <div className="bg-background flex flex-col items-center">
      <main className=" flex-auto font-odibee text-9xl text-center">

        <div className="flex items-center justify-between w-[50vw]">
          <div className="text-10xl">Search</div>

          <div className="flex items-center mt-10 h-8">
            <div className="competitons-text text-3xl mr-5 font-nunito font-semibold ">Competitions</div> 
            <div className="flex items-center justify-end appearance-none bg-white shadow-sm shadow-white rounded-full h-8 w-20 p-1">
              <div className="h-7 w-7 rounded-full bg-buttonprimary "></div>
            </div>
          </div>

        </div>

        <div className="mt-10">
          <SearchBar/>
        </div>

        <div className="mt-32 bg-slate-400h-screen">
        
        </div>

      </main>
    </div>
  );
}
