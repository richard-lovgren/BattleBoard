"use client";

import { useEffect, useState } from "react";
import CompetitionDto from "@/models/dtos/competition-dto";
import "./createCompetition.css";
import Game from "@/models/game";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs, { Dayjs } from "dayjs";
import GeneralButton from "@/components/general-btn";

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import User from "@/models/user";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const placeholderUsers: string[] = [
  "laswer5",
  ".nattap",
  "cafg",
  "richard",
  "nagnub",
];

export default function CreateCompetitionPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [game, setGame] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const session = useSession();
  const router = useRouter();
  const username = session.data?.user.name || "undefined";
  

  const handleParticipantsChange = (event: SelectChangeEvent<typeof participants>) => {
    const {
      target: { value },
    } = event;
    setParticipants(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleGameChange = (event: SelectChangeEvent) => {
    setGame(event.target.value as string);
  };

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

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/users`);
      if (!response.ok) {
        throw new Error(`Error fetching users: ${response.statusText}`);
      }
      const result: User[] = await response.json();
      setUsers(result);
    } catch (error) {
      console.error("Error in fetchUserData:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch game data
  useEffect(() => {
    fetchGameData();
    fetchUserData();
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

  async function postCompetitionData(
    body: CompetitionDto
  ): Promise<string | null> {
    try {
      console.log("Creating competition with body:", body);
      const url = `/api/competitions`;

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
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
      game_id: game,
      rank_alg: 1,
      is_public: !!formJson.isPublic,
      //competition_date: selectedDate?.toISOString() || null, // TODO: add to db
    };

    console.log(body);
    const competition_id = await postCompetitionData(body);

    if (!competition_id) {
      console.error("Error creating competition");
      router.push(`/`);
    }

    router.push(`/competition/${competition_id}`);
  }

  const radioButtonLabelClasses = `font-nunito textshadow text-xl hover:cursor-pointer w-fit flex items-center`;
  const radioButtonClasses = `appearance-none peer`;
  const radioButtonSpanClasses = `w-4 h-4 mr-2 rounded-full border-solid border-[2px] border-white shadow-lg shadow-indigo-500/50 peer-checked:bg-buttonprimary hover:bg-buttonprimaryhover`;

  return (
    <div className="bg-background flex flex-col items-center">
      <main className="flex-auto item font-odibee text-9xl">
        <form method="post" onSubmit={handleSubmit} className="createWrapper">
          <div className="text-6xl">
            Create a competition
            <hr />
          </div>

          {/* Title and Date */}
          <div className="createGroupTwoCols">
            <div className="createGroup">
              <label className="text-5xl">Title</label>
              <div className="search-bar flex items-center rounded-full border-solid border-white border-[5px] h-[50px] w-[30vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
                <input
                  name="competitionName"
                  className=" font-nunito textshadow appearance-none text-3xl text-left w-full"
                />
              </div>
            </div>
            <div className="ml-32 createGroup">
              <label className="text-5xl">Start date</label>
              <div className="search-bar flex items-center rounded-full border-solid border-white border-[5px] h-[50px] w-[20vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Select date"
                    onChange={(newValue) => setSelectedDate(newValue)}
                    sx={{ width: '20vw'}}
                  />
                </LocalizationProvider>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="createGroup">
            <label className="text-5xl">
              Description
              <textarea
                name="competitionDesc"
                className="appearance-none font-nunito textshadow focus:outline-none mt-5 p-4 flex items-center text-3xl rounded-3xl bg-[#0E0030] border-solid border-white border-[5px] h-[150px] w-[62vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50"
              ></textarea>
            </label>
          </div>

          {/* Cover Image */}
          <div className="createGroup">
            <label className="text-5xl">Add a cover image</label>
            <GeneralButton text="Upload image" type="button" />
          </div>

          {/* Settings */}
          <div className="createGroup">
            <div className="text-5xl">Settings</div>
            <label className={radioButtonLabelClasses}>
              <input
                className={radioButtonClasses}
                type="radio"
                name="isPublic"
                value={1}
                defaultChecked
              />
              <span className={radioButtonSpanClasses}></span>
              <span className="ml-2">Public</span>
            </label>
            <label className={radioButtonLabelClasses}>
              <input
                className={radioButtonClasses}
                type="radio"
                name="isPublic"
                value={0}
              />
              <span className={radioButtonSpanClasses}></span>
              <span className="ml-2">Private</span>
            </label>
          </div>

          {/* Games */}
          <div className="createGroup">
            <label className="text-5xl">Choose game</label>
            <div className="search-bar flex items-center rounded-full border-solid border-white border-[5px] h-[50px] w-[28vw] py-10 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
              {/* {loading ? (
                <div>Loading games...</div>
              ) : (
                <select
                  className="decorated text-3xl text-left w-full bg-[#0E0030] rounded-full focus:outline-none"
                  name="game"
                >
                  {games.map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.game_name}
                    </option>
                  ))}
                </select>
              )} */}
              {loading ? (
                <div className=" font-nunito textshadow">Loading games...</div>
              ) : (
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Select game</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={game}
                  label="Select game"
                  onChange={handleGameChange}
                >
                  {games.map((game) => (
                    <MenuItem key={game.id} value={game.id}>{game.game_name}</MenuItem>
                ))}
                </Select>
              </FormControl>
              )}

            </div>
          </div>

          {/* Modes */}
          <div className="createGroup">
            <div className="text-5xl">Choose mode</div>
            <label className={radioButtonLabelClasses}>
              <input
                className={radioButtonClasses}
                type="radio"
                name="competitionType"
                value={1}
                defaultChecked
              />
              <span className={radioButtonSpanClasses}></span>
              <span className="ml-2"> Tournament </span>
            </label>
            <label className={radioButtonLabelClasses}>
              <input
                className={radioButtonClasses}
                type="radio"
                name="competitionType"
                value={2}
              />
              <span className={radioButtonSpanClasses}></span>
              <span className="ml-2"> Classic </span>
            </label>
            <label className={radioButtonLabelClasses}>
              <input
                className={radioButtonClasses}
                type="radio"
                name="competitionType"
                value={3}
              />
              <span className={radioButtonSpanClasses}></span>
              <span className="ml-2"> Rival </span>
            </label>
          </div>

          {/* Players */}
          <div className="createGroup">
            <label className="text-5xl">Invite players</label>
            <div className="search-bar flex items-center rounded-full border-solid border-white border-[5px] h-[50px] w-[28vw] py-10 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
              {/* <select
                className="decorated text-3xl text-left w-full bg-[#0E0030] rounded-full focus:outline-none"
                name="invitedUsers"
              >
                {placeholderUsers.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select> */}
            <FormControl
              sx={{ m: 1, width: '28vw' }}
            >
              <InputLabel id="multiple-checkbox-label">Select players</InputLabel>
              <Select
                labelId="multiple-checkbox-label"
                id="multiple-checkbox"
                multiple={true}
                value={participants}
                onChange={handleParticipantsChange}
                input={<OutlinedInput label="Select layers" />}
                renderValue={(selected) => (selected as string[]).join(', ')}
                MenuProps={MenuProps}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.user_name}>
                    <Checkbox checked={participants.includes(user.user_name)} />
                    <ListItemText primary={user.user_name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            </div>
          </div>

          <GeneralButton text="Create competition" type="submit" />
        </form>
      </main>
    </div>
  );
}
