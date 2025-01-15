"use client";

import React, { FC } from "react";
import {
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Checkbox,
    ListItemText,
    SelectChangeEvent,
} from "@mui/material";
import User from "@/models/interfaces/user";

interface SelectCommunityProps {
    users: User[];
    username: string;
    participants: string[];
    handleParticipantsChange: (event: SelectChangeEvent<string[]>) => void;
}

const InvitePlayers: FC<SelectCommunityProps> = ({
    users,
    username,
    participants,
    handleParticipantsChange,
}) => {
    return (
        <div className="createGroup">
            <label className="text-5xl">Invite players</label>
            <div className="search-bar flex items-center rounded-full border-solid border-white border-[5px] h-[50px] w-[28vw] py-10 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
                <FormControl sx={{ m: 1, width: "28vw" }}>
                    <InputLabel id="multiple-checkbox-label">Select players</InputLabel>
                    <Select
                        labelId="multiple-checkbox-label"
                        id="multiple-checkbox"
                        multiple={true}
                        value={participants} // Array of selected participants
                        onChange={handleParticipantsChange} // Update the state on change
                        input={<OutlinedInput label="Select players" />}
                        renderValue={(selected) => (selected as string[]).join(", ")}
                    >
                        {users
                            .filter((user) => user.user_name !== username) // Exclude the current user
                            .map((user) => (
                                <MenuItem key={user.id} value={user.user_name}>
                                    <Checkbox checked={participants.includes(user.user_name)} />
                                    <ListItemText primary={user.user_name} />
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </div>
        </div>
    );
};

export default InvitePlayers;
