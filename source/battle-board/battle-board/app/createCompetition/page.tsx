"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "./createCompetition.css";
import CompetitionDto from "@/models/dtos/competition-dto";
import Game from "@/models/interfaces/game";
import User from "@/models/interfaces/user";
import GeneralButton from "@/components/general-btn";

import { Dayjs } from "dayjs";
import 'dayjs/locale/sv';

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import JoinCompetitionDto from "@/models/dtos/join-competition-dto";
import RadioButton from "@/components/form-components/radio-button";
import * as createCompetition from "@/lib/create-compitition";
import NotLoggedIn from "@/components/not-logged-in";

import SelectCommunity from "@/components/competition/selectCommunity"; // This is the component we want to extract

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
  const [communityIds, setCommunityIds] = useState<string[]>([]);

  // load API data
  useEffect(() => {
    loadAPIData();
  }, []);

  async function loadAPIData() {
    try {
      const games = await createCompetition.getGames();
      const users = await createCompetition.getUsers();
      //const communityIds = await createCompetition.getCommunities();
      const communityIds = ["1", "2", "3", "4", "5"];

      setGames(games);
      setUsers(users);
      setCommunityIds(communityIds);
    } catch (error) {
      console.error("Error in loadAPIData:", error);
    } finally {
      setLoading(false);
    }
  };

  /* Handlers */
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const formJson = Object.fromEntries(formData.entries());
    const body: CompetitionDto = {
      competition_name: formJson.competitionName.toString(),
      creator_name: username,
      competition_start_date: selectedDate?.add(1, 'day').toISOString() || new Date().toISOString(),
      competition_description: formJson.competitionDesc.toString(),
      competition_type: parseInt(formJson.competitionType.toString()),
      format: 1,
      is_open: true,
      is_running: true,
      game_id: game,
      rank_alg: 1,
      is_public: (parseInt(formJson.isPublic.toString())) > 0 ? true : false,
    };

    console.log(body);
    const competition_id = await createCompetition.postCompetitionData(body);

    if (!competition_id) {
      console.error("Error creating competition");
      console.log("No users joined");
      router.push(`/`);
      return;
    }

    else {
      const joinCompetitionBody: JoinCompetitionDto = {
        competition_id: competition_id!,
        user_names: participants,
      };

      if (joinCompetitionBody.user_names.length > 0) {
        await createCompetition.postJoinCompetitionData(joinCompetitionBody);
      }
    }

    router.push(`/competition/${competition_id}`);
  }

  if (!session.data) {
    return (
      <NotLoggedIn />
    );
  }

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
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sv">
                  <DatePicker
                    label="Select date"
                    onChange={(newValue) => setSelectedDate(newValue)}
                    sx={{ width: '20vw' }}
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
          {/* <div className="createGroup">
            <label className="text-5xl">Add a cover image</label>
            <GeneralButton text="Upload image" type="button" />
          </div> */}

          {/* Settings */}
          <RadioButton {...createCompetition.getSettingsRadioButtonProps()} />

          {/* Games */}
          <div className="createGroup">
            <label className="text-5xl">Choose game</label>
            <div className="search-bar flex items-center rounded-full border-solid border-white border-[5px] h-[50px] w-[28vw] py-10 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
              {loading ? (
                <div className=" font-nunito textshadow">Loading games...</div>
              ) : (
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Select game</InputLabel>
                  <Select
                    labelId="simple-select-label"
                    id="simple-select"
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
          <RadioButton {...createCompetition.getModeRadioButtonProps()} />

          {/* Players */}
          <div className="createGroup">
            <label className="text-5xl">Invite players</label>
            <div className="search-bar flex items-center rounded-full border-solid border-white border-[5px] h-[50px] w-[28vw] py-10 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
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
                  MenuProps={createCompetition.getMUIMenuProps()}
                >
                  {users.filter((user) => user.user_name != username).map((user) => (
                    <MenuItem key={user.id} value={user.user_name}>
                      <Checkbox checked={participants.includes(user.user_name)} />
                      <ListItemText primary={user.user_name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div>
            <SelectCommunity communityIds={['1', '2', '3', '4']} />
          </div>
          <GeneralButton text="Create competition" type="submit" />
        </form>
      </main>
    </div>
  );
}
