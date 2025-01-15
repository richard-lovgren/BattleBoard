// components/ManageInvites.tsx
"use client";

import GeneralButton from "@/components/general-btn";
import { useSession } from "next-auth/react";
import { FC, useState } from "react";
import ManageInvites from "./ManageInvites";
import JoinCompetition from "./JoinCompetition";

interface CreatorEditProps {
  creatorName: string;
  competition_id: string;
}

const CreatorEdit: FC<CreatorEditProps> = ({ creatorName, competition_id }) => {
  const clientSession = useSession();
  const user_name = clientSession.data?.user.name || "";

  const invites = [{ id: 10, name: "lilgup1337" }, { id: 20, name: "GreatLord6996" }]
  const isCreator = creatorName === user_name;

  return (
    <div>
      {isCreator ? (
        <ManageInvites
          invites={invites}
        />
      ) : (
        <JoinCompetition competition_id={competition_id} user_name={user_name} />
      )}
    </div>

  );
};

export default CreatorEdit;
