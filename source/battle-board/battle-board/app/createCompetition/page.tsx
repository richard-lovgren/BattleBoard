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
import { Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import CompetitionFormDto from "@/models/dtos/competiton-form-dto";
import SelectRival from "@/components/selectRival";
import InvitePlayers from "@/components/invitePlayers";

// Styled components
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

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
  const [communityData, setCommunityData] = useState<Record<string, string>>({});
  const [community, setCommunity] = useState<string>("")
  const [uploadedImage, setUploadedImage] = useState<Blob | undefined>(undefined);
  const [fileHelperText, setFileHelperText] = useState<string | undefined>(undefined);
  const [competitionType, setType] = useState<number>(0);

  // load API data
  useEffect(() => {
    loadAPIData();
  }, [username]);


  async function loadAPIData() {
    try {
      const games = await createCompetition.getGames();
      const users = await createCompetition.getUsers();
      if (username != "undefined") {
        const communityData = await createCompetition.getCommunities(username);
        setCommunityData(communityData);
      }
      setGames(games);
      setUsers(users);
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

  const handleParticipantChange = (event: SelectChangeEvent) => {
    setParticipants([event.target.value]);
  }

  const handleRadioCompetitionTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType(parseInt(event.target.value));
  }

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
      community_id: !community ? undefined : community,
    };

    const competitionForm: CompetitionFormDto = {
      competition_data: body,
      competition_image: uploadedImage,
    };

    const competition_id = await createCompetition.postCompetitionData(competitionForm);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setFileHelperText("No files selected.");
      return;
    }

    const file = files[0];
    setUploadedImage(file);

    event.target.value = ""; // Reset file input to allow same file to be uploaded again (might have been changed -> new data)
  };

  /* Render Functions */
  const renderPlayers = () => {
    if (competitionType === 2) {
      return (
        <SelectRival
          users={users}
          username={username}
          participants={participants}
          setUsers={handleParticipantChange}
        />
      );
    } else {
      return (
        <InvitePlayers
          users={users}
          username={username}
          participants={participants}
          handleParticipantsChange={handleParticipantsChange}
        />
      );
    }
  };


  if (!session.data) {
    return (
      <NotLoggedIn />
    );
  }

  return (
    <div className="bg-background flex flex-col items-center" >
      <main className="flex-auto item font-odibee text-9xl" style={{ maxWidth: '65vw', width: '100%' }}>
        <form method="post" onSubmit={handleSubmit} className="createWrapper">
          <div className="text-6xl">
            Create a competition
            <hr />
          </div>

          {/* Title and Date */}
          <div className="createGroupTwoCols" >
            <div className="createGroup" style={{ width: '70%' }}>
              <label className="text-5xl">Title</label>
              <div className="search-bar flex items-center rounded-full border-solid border-white border-[5px] h-[50px] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
                <input
                  name="competitionName"
                  className=" font-nunito textshadow appearance-none text-2xl text-left w-full"
                />
              </div>
            </div>
            <div className="createGroup" style={{ width: '30%' }}>
              <label className="text-5xl">Start date</label>
              <div className="search-bar flex items-center rounded-full border-solid border-white border-[5px] h-[50px] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sv">
                  <DatePicker
                    onChange={(newValue) => setSelectedDate(newValue)}
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
                className="appearance-none font-nunito textshadow focus:outline-none mt-5 p-4 flex items-center text-2xl rounded-3xl bg-[#0E0030] border-solid border-white border-[5px] h-[150px] w-[100%] py-3 pl-4 pr-8 shadow-lg shadow-indigo-500/50"
              ></textarea>
            </label>
          </div>

          {/* Cover Image */}
          <div className="createGroup">
            <label className="text-5xl">Add a cover image</label>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              style={{ width: '180px' }}
            >
              Upload Image
              <VisuallyHiddenInput
                type="file"
                onChange={handleFileUpload}
                accept=".png, .jpg, .jpeg"
              />
            </Button>
            {uploadedImage && <p className="text-xl font-nunito textshadow">Image uploaded</p>}
            {fileHelperText && <p className="text-xl font-nunito textshadow">{fileHelperText}</p>}
          </div>

          {/* Settings */}
          <RadioButton {...createCompetition.getSettingsRadioButtonProps()} />

          {/* Games */}
          <div className="createGroup">
            <label className="text-5xl">Choose game</label>
            <div className=" flex items-center rounded-full border-solid border-white border-[5px] h-[50px] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
              {loading ? (
                <div className=" font-nunito textshadow">Loading games...</div>
              ) : (
                <FormControl fullWidth>
                  {game === '' && <InputLabel shrink={false} id="demo-simple-select-label">Select game</InputLabel>}
                  <Select
                    labelId="simple-select-label"
                    id="simple-select"
                    value={game}
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
          <RadioButton {...createCompetition.getModeRadioButtonProps()} onChange={handleRadioCompetitionTypeChange} />


          {/* Players */}
          {renderPlayers()}

          {/* Select Community */}
          {Object.keys(communityData).length > 0 &&
            <div>
              <SelectCommunity communityData={communityData} community={community} setCommunity={setCommunity} />
            </div>
          }
          <div style={{ width: '220px' }}>
            <GeneralButton text="Create competition" type="submit" />
          </div>
        </form>
      </main>
    </div>
  );
}
