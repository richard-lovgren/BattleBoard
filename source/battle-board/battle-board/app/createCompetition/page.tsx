'use client';

import { useEffect, useState } from 'react';
import CompetitionDto from '@/models/dtos/competition-dto';
import './createCompetition.css';
import Game from '@/models/game';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CreateCompetition() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const placeholderUsers: string[] = ["laswer5", ".nattap", "cafg", "richard", "nagnub"];
  const session = useSession();
  const router = useRouter();
  const username = session.data?.user.name || "undefined";

  // Fetch game data
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await fetch(`/api/games`);
        if (!response.ok) {
          throw new Error(`Error fetching games: ${response.statusText}`);
        }
        const result: Game[] = await response.json();
        setGames(result);
      } catch (error) {
        console.error("Error in fetchGameData:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, []);

  if (!session.data) {
    return (
      <div className="bg-background flex flex-col items-center">
        <main className="flex-auto item font-odibee text-9xl">
          <div className="text-6xl">
            You must be logged in to create a competition
            <hr />
          </div>
        </main>
      </div>
    );
  }

  async function postCompetitionData(body: CompetitionDto): Promise<string | null> {
    try {
      console.log("Creating competition with body:", body);
      const url = `/api/competitions`;

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error creating competition: ${response.statusText}`);
      }

      const result = await response.json();
      const id = result.id;
      return id;
    } catch (error) {
      console.error("Error in postCompetitionData:", error);
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const formJson = Object.fromEntries(formData.entries());
    const body: CompetitionDto = {
      competition_name: formJson.competitionName.toString(),
      creator_name: username,
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
    const competition_id = await postCompetitionData(body);
    
    if (!competition_id) {
      console.error("Error creating competition");
      router.push(`/`);
    }

    router.push(`/competition/${competition_id}`);

  }

  return (
    <div className='bg-background flex flex-col items-center'>
      <main className='flex-auto item font-odibee text-9xl'>
        <form method='post' onSubmit={handleSubmit} className='createWrapper'>
          <div className='text-6xl'>
            Create a competition
            <hr />
          </div>

          {/* Title and Date */}
          <div className='createGroupTwoCols'>
            <div className='createGroup'>
              <label className='text-5xl'>Title</label>
              <div className='search-bar flex items-center rounded-full border-solid border-white border-[5px] h-[50px] w-[30vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50'>
                <input name='competitionName' className='text-3xl text-left w-full' />
              </div>
            </div>
            <div className='createGroup'>
              <label className='text-5xl'>Date</label>
              <div className='search-bar flex items-center rounded-full border-solid border-white border-[5px] h-[50px] w-[30vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50'>
                <input name='date' className='text-3xl text-left w-full' />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className='createGroup'>
            <label className='text-5xl'>
              Description
              <textarea
                name='competitionDesc'
                className='appearance-none focus:outline-none mt-5 p-4 flex items-center text-3xl rounded-3xl bg-[#0E0030] border-solid border-white border-[5px] h-[150px] w-[62vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50'
              ></textarea>
            </label>
          </div>

          {/* Cover Image */}
          <div className='createGroup'>
            <label className='text-5xl'>Add a cover image</label>
            <button type='button' className='uploadButton font-nunito'>Upload image</button>
          </div>

          {/* Settings */}
          <div className='createGroup'>
            <div className='text-5xl'>Settings</div>
            <label className='font-nunito textshadow text-xl hover:cursor-pointer w-fit'>
              <input className='appearance-auto' type='radio' name='isPublic' value={1} defaultChecked /> Public
            </label>
            <label className='font-nunito textshadow text-xl hover:cursor-pointer w-fit'>
              <input className='appearance-auto' type='radio' name='isPublic' value={0} /> Private
            </label>
          </div>

          {/* Games */}
          <div className='createGroup'>
            <label className='text-5xl'>Choose game</label>
            <div className='search-bar flex items-center rounded-full border-solid border-white border-[5px] h-[50px] w-[50vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50'>
              {loading ? (
                <div>Loading games...</div>
              ) : (
                <select
                  className='decorated text-3xl text-left w-full bg-[#0E0030] rounded-full focus:outline-none'
                  name='game'
                >
                  {games.map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.game_name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Modes */}
          <div className='createGroup'>
            <div className='text-5xl'>Choose mode</div>
            <label className='font-nunito textshadow text-xl hover:cursor-pointer w-fit'>
              <input className='appearance-auto' type='radio' name='competitionType' value={1} defaultChecked /> Tournament
            </label>
            <label className='font-nunito textshadow text-xl hover:cursor-pointer w-fit'>
              <input className='appearance-auto' type='radio' name='competitionType' value={2} /> Classic
            </label>
            <label className='font-nunito textshadow text-xl hover:cursor-pointer w-fit'>
              <input className='appearance-auto' type='radio' name='competitionType' value={3} /> Rival
            </label>
          </div>

          {/* Players */}
          <div className='createGroup'>
            <label className='text-5xl'>Invite players</label>
            <div className='search-bar flex items-center rounded-full border-solid border-white border-[5px] h-[50px] w-[50vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50'>
              <select
                className='decorated text-3xl text-left w-full bg-[#0E0030] rounded-full focus:outline-none'
                name='invitedUsers'
              >
                {placeholderUsers.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type='submit' className='createButton font-nunito'>
            Create competition
          </button>
        </form>
      </main>
    </div>
  );
}
