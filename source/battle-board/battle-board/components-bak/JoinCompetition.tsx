"use client";

import GeneralButton from "@/components/general-btn";
import { FC, useState } from "react";

interface JoinCompetitionProps {
  competition_id: string;
  user_name: string;
}

interface JoinDto {
  competition_id: string;
  user_names: string[];
}

const joinCompetition = async (
  body: JoinDto
): Promise<string[] | null> => {
  try {
    const url = `/api/competitions/join`;
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Error joining competition: ${errorMessage}`);
      return null;
    }

    const result = await response.json();
    console.log("Successfully joined competition. Created IDs:", result);
    return result as string[];
  } catch (error) {
    console.error("Error in joinCompetition:", error);
    return null;
  }
};

const JoinCompetition: FC<JoinCompetitionProps> = ({ competition_id, user_name }) => {
  const [joined, setJoined] = useState(false);
  const [requestPending, setRequestPending] = useState(false);


  const handleJoinClick = async () => {
    setRequestPending(true);
    const body: JoinDto = {
      competition_id: competition_id, // Replace with actual competition ID
      user_names: [user_name], // Replace with actual user names
    };

    console.log("Competition_id and username inside the join click", competition_id, user_name)

    console.log("Attempting to join competition with body:", body);
    const result = await joinCompetition(body);

    if (result) {
      setJoined(true);
      console.log("Successfully joined competition. Created IDs:", result);
    } else {
      console.log("Failed to join the competition.");
    }
    setRequestPending(false);
  };

  const handleLeaveClick = () => {
    setJoined(false);
    console.log("Left the competition.");
  };

  const handleCancelRequestClick = () => {
    setRequestPending(false);
    console.log("Canceled the join request.");
  };

  if (user_name === "") {
    return <p className="font-odibee">Loading...</p>; // Or a loading spinner
  }

  if (joined) {
    return (
      <div className="flex flex-row gap-4">
        <GeneralButton text="Leave" onClick={handleLeaveClick} />
      </div>
    );
  } else if (requestPending) {
    return (
      <div className="flex flex-row gap-4">
        <GeneralButton text="Cancel Request" onClick={handleCancelRequestClick} />
      </div>
    );
  } else {
    return (
      <div className="flex flex-row gap-4">
        <GeneralButton text="Join" onClick={handleJoinClick} />
      </div>
    );
  }
};

export default JoinCompetition; 
