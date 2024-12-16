"use client";

//import { useState } from 'react';
import CompetitionDto from "@/models/dtos/competition-dto";
import "./createCompetition.css";

export default function CreateCompetition() {
  // const competition : CompetitionDto = {
  //   competition_name: "Test use state",
  //   competition_description: "test desc",
  //   competition_type: 1,
  //   format: 1,
  //   is_open: true,
  //   is_running: true,
  //   game_id: "8ffdbc35-84ab-4e3b-8743-789a59939e59",
  //   rank_alg: 1,
  //   is_public: true,
  // };

  //const [newCompetition, setNewCompetition] = useState<CompetitionDto | null>(null);

  // const updateNewCompetitionState = async () => {
  //   setNewCompetition(competition);
  //   console.log(newCompetition);
  // }

  const handleTitleChange = async () => {};

  const postCompetitionData = async () => {
    try {
      const body: CompetitionDto = {
        competition_name: "Test 2",
        competition_description: "test desc",
        competition_type: 1,
        format: 1,
        is_open: true,
        is_running: true,
        game_id: "8ffdbc35-84ab-4e3b-8743-789a59939e59",
        rank_alg: 1,
        is_public: true,
      };

      console.log("Creating competition with body::", body);
      const url = `/api/competitions`;

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`Error creating competition: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error("Error in postCompetitionData:", error);
    }
  };

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
              <div className="search-bar flex items-center rounded-full border-solid border-white border-[5px] h-[50px] w-[30vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
                <input
                  onChange={handleTitleChange}
                  className=" text-3xl text-left w-full"
                ></input>
              </div>
            </div>
            <div className="createGroup">
              <div className="text-5xl">Date</div>
              <div className="search-bar flex items-center rounded-full border-solid border-white border-[5px] h-[50px] w-[30vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
                <input className=" text-3xl text-left w-full"></input>
              </div>
            </div>
          </div>

          <div className="createGroup">
            <div className="text-5xl ">Description</div>
            <div className="search-bar flex items-center rounded-3xl border-solid border-white border-[5px] h-[150px] w-[62vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
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
            <div className="search-bar flex items-center rounded-full border-solid border-white border-[5px] h-[50px] w-[50vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
              <input className=" text-3xl text-left w-full"></input>
            </div>
          </div>
          <div className="createGroup">
            <div className="text-5xl">Choose mode</div>

            <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
              <div className="border-solid border-white border-[5px] shadow-lg shadow-indigo-500/50 rounded-3xl  p-6 w-64">
                <h3 className="textshadow text-xl font-bold">Tournament</h3>
                <img
                  src="/tournament.svg"
                  alt="Tournament Mode"
                  className="mt-4"
                />
              </div>
              <div className="border-solid border-white border-[5px] shadow-lg shadow-indigo-500/50 rounded-3xl  p-6 w-64">
                <h3 className="textshadow text-xl font-bold">Classic</h3>
                <img
                  src="/classic_mode_icon.svg"
                  alt="Classic Mode"
                  className="mt-4"
                />
              </div>
              <div className="border-solid border-white border-[5px] shadow-lg shadow-indigo-500/50 rounded-3xl  p-6 w-64">
                <h3 className="textshadow text-xl font-bold">Rival</h3>
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
            <div className="search-bar flex items-center rounded-full border-solid border-white border-[5px] h-[50px] w-[50vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
              <input className=" text-3xl text-left w-full"></input>
            </div>
          </div>

          <button
            onClick={postCompetitionData}
            className="createButton font-nunito"
          >
            Save
          </button>
        </div>
      </main>
    </div>
  );
}
