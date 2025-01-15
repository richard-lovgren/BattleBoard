// components/ManageInvites.tsx
"use client";

import GeneralButton from "@/components/general-btn";
import { useSession } from "next-auth/react";
import { FC } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ManageInvitesProps {
  invites: { id: number; name: string }[];
}

const ManageInvites: FC<ManageInvitesProps> = ({ invites }) => {
  const clientSession = useSession();
  const user_name = clientSession.data?.user.name;

  const renderInvites = () => {
    // Use map to iterate over invites
    return invites.map((invite) => (
      <div key={invite.id} className="invite-item flex flex-row justify-between items-center gap-4">
        <h1 className="font-bold text-lg">{invite.name}</h1>
        <div className="flex flex-row gap-2">
          <GeneralButton
            text="Accept"
            onClick={() => console.log(`Accepted invite from ${invite.name}`)}
          />
          <GeneralButton
            text="Reject 🙅"
            onClick={() => console.log(`Rejected invite from ${invite.name}`)}
          />
        </div>
      </div>
    ));
  };

  return (
    <div className="">
      <Dialog>
        <DialogTrigger asChild>
          <GeneralButton
            text="Edit"
            onClick={() => {
              console.log("Opened modal for editing invites");
            }}
          />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Competition Invites</DialogTitle>
            <DialogDescription>
              Click the accept button to allow users into the competition or decide not to do so by clicking the 🙅 button.
            </DialogDescription>
          </DialogHeader>
          {renderInvites()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageInvites;
