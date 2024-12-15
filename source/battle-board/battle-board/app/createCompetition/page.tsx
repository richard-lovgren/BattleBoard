'use client'

import CompetitionDto from '@/models/dtos/competition-dto';
import './createCompetition.css'
import Game from '@/models/game';

const fetchGameData = async () => {
  try {
    const response = await fetch(`/api/games`);

    if (!response.ok) {
      throw new Error(`Error fetching games: ${response.statusText}`);
    }

    const result: Game[] = await response.json();

    console.log(result);
    
    return result;

  } catch (error) {
      console.error("Error in fetchGameData:", error);
  }
}

const games: Game[] | undefined = await fetchGameData();

export default function CreateCompetition() {

  const placeholderUsers: string[] = ["laswer5", ".nattap", "cafg", "richard", "nagnub"];

  async function postCompetitionData(body: CompetitionDto) {
    try {
      console.log("Creating competition with body::", body);
      const url = `/api/competitions`;

      const response = await fetch(url, 
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      )
      if (!response.ok) {
        throw new Error(`Error creating competition: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result.message);


    } catch (error) {
        console.error("Error in postCompetitionData:", error);
    }
  };

  async function handleSumbit(e: any) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);

    const body: CompetitionDto = {
      competition_name: formJson.competitionName.toString(),
      competition_description: formJson.competitionDesc.toString(),
      competition_type: parseInt(formJson.competitionType.toString()),
      format: 1,
      is_open: true,
      is_running: true,
      game_id: formJson.game.toString(),
      rank_alg: 1,
      is_public: !!formJson.isPublic,
    };

    console.log(body);
    await postCompetitionData(body);
  }

  return (
    <div className='bg-background flex flex-col items-center'>
      <main className='flex-auto item font-odibee text-9xl'>
        <form method='post' onSubmit={handleSumbit} className='createWrapper'>
          <div className='text-6xl'>
            Create a competition
            <hr />
          </div>

          <div className='createGroupTwoCols'>
            <div className='createGroup'>
              <label className='text-5xl '>Title</label>
              <div className='search-bar flex items-center rounded-full border-solid border-white border-[5px] h-[50px] w-[30vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50'>
                <input name='competitionName' className=' text-3xl text-left w-full'></input>
              </div>
            </div>
            <div className='createGroup'>
              <label className='text-5xl'>Date</label>
              <div className='search-bar flex items-center rounded-full border-solid border-white border-[5px] h-[50px] w-[30vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50'>
                <input name='date' className=' text-3xl text-left w-full'></input>
              </div>
            </div>
          </div>

          <div className='createGroup'>
              <label className='text-5xl '>
                Description
                <textarea name='competitionDesc' 
                  className=' appearance-none focus:outline-none mt-5 p-4 flex items-center text-3xl rounded-3xl bg-[#0E0030] border-solid border-white border-[5px] h-[150px] w-[62vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50'>
                </textarea>
              </label>

            </div>

          <div className='createGroup'>
            <label className='text-5xl'>Add a cover image</label>
            <button type='button' className='uploadButton font-nunito'>Upload image</button>
          </div>

          <div className='createGroup'>
            <div className='text-5xl'>Settings</div>
            <label className='font-nunito textshadow text-xl hover:cursor-pointer w-fit '><input className=' appearance-auto' type='radio' name='isPublic' value={1} defaultChecked={true}></input> Public </label>
            <label className='font-nunito textshadow text-xl hover:cursor-pointer w-fit '><input className=' appearance-auto' type='radio' name='isPublic' value={0}></input> Private </label>
          </div>

          <div className='createGroup'>
            <label className='text-5xl'>Choose game</label>
            <div className='search-bar flex items-center rounded-full border-solid border-white border-[5px] h-[50px] w-[50vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50'>
              <select className=' decorated text-3xl text-left w-full bg-[#0E0030] rounded-full focus:outline-none 'name="game">
                {games!.map(game => (
                  <option key={game.id} value={game.id}> {game.game_name} </option>
                  ))
                }
              </select> 
            </div>
          </div>

          <div className='createGroup'>
            <div className='text-5xl'>Choose mode</div>
            <label className='font-nunito textshadow text-xl hover:cursor-pointer w-fit '><input className=' appearance-auto' type='radio' name='competitionType' value={1} defaultChecked={true}></input> Tournament </label>
            <label className='font-nunito textshadow text-xl hover:cursor-pointer w-fit '><input className=' appearance-auto' type='radio' name='competitionType' value={2}></input> Classic </label>
            <label className='font-nunito textshadow text-xl hover:cursor-pointer w-fit '><input className=' appearance-auto' type='radio' name='competitionType' value={3}></input> Rival </label>
          </div>

          <div className='createGroup'>
            <label className='text-5xl'>Invite players</label>
            <div className='search-bar flex items-center rounded-full border-solid border-white border-[5px] h-[50px] w-[50vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50'>
              <select className=' decorated text-3xl text-left w-full bg-[#0E0030] rounded-full focus:outline-none 'name="invtedUsers">
                {
                  placeholderUsers.map(user => (
                    <option key={user} value={user}> {user} </option>
                  ))
                }
              </select>
            </div>
          </div>

          <button type='submit' className='createButton font-nunito'>Save</button>

        </form>
      </main>
    </div>
  )
}
