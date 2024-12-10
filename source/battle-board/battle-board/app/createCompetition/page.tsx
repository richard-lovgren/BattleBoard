import "./createCompetition.css";

export default function CreateCompetition() {
  return (
    <div className="bg-background flex flex-col items-center">
      <main className="flex-auto item font-odibee text-9xl">
        <div className="createWrapper">
          <div className="text-6xl">
            Create a competition
            <hr />
          </div>

          <div className="createGroupTwoCols">
            <div className="createGroup">
              <div className="text-5xl ">Title</div>
              <div className="search-bar flex items-center rounded-full border-solid border-[5px] h-[50px] w-[30vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
                <input className=" text-3xl text-left w-full"></input>
              </div>
            </div>
            <div className="createGroup">
              <div className="text-5xl">Date</div>
              <div className="search-bar flex items-center rounded-full border-solid border-[5px] h-[50px] w-[30vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
                <input className=" text-3xl text-left w-full"></input>
              </div>
            </div>
          </div>

          <div className="createGroup">
            <div className="text-5xl ">Description</div>
            <div className="search-bar flex items-center rounded-3xl border-solid border-[5px] h-[150px] w-[62vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
              <input className=" text-3xl text-left w-full"></input>
            </div>
          </div>

          <div className="createGroup">
            <div className="text-5xl">Add a cover image</div>
            <button className="uploadButton font-nunito">Upload image</button>
          </div>

          <div className="createGroup">
            <div className="text-5xl">Settings</div>

            <button className="uploadButton font-nunito">Public</button>
            <button className="uploadButton font-nunito">Private</button>
          </div>

          <div className="createGroup">
            <div className="text-5xl">Choose game</div>
            <div className="search-bar flex items-center rounded-full border-solid border-[5px] h-[50px] w-[50vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
              <input className=" text-3xl text-left w-full"></input>
            </div>
          </div>
          <div className="createGroup">
            <div className="text-5xl">Choose mode</div>

            <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
              <div className="border border-white rounded-lg p-6 w-64">
                <h3 className="text-xl font-bold">Tournament</h3>
                <img
                  src="/tournament.svg"
                  alt="Tournament Mode"
                  className="mt-4"
                />
              </div>
              <div className="border border-white rounded-lg p-6 w-64">
                <h3 className="text-xl font-bold">Classic</h3>
                <img
                  src="/classic_mode_icon.svg"
                  alt="Classic Mode"
                  className="mt-4"
                />
              </div>
              <div className="border border-white rounded-lg p-6 w-64">
                <h3 className="text-xl font-bold">Rival</h3>
                <img
                  src="/rival_mode_icon.svg"
                  alt="Rival Mode"
                  className="mt-4"
                />
              </div>
            </div>
          </div>
          <div className="createGroup">
            <div className="text-5xl">Invite players</div>
            <div className="search-bar flex items-center rounded-full border-solid border-[5px] h-[50px] w-[50vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
              <input className=" text-3xl text-left w-full"></input>
            </div>
          </div>

          <button className="createButton font-nunito">Save</button>
        </div>
      </main>
    </div>
  );
}
