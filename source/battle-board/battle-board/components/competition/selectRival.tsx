"use client"
// Code for selecting a rival 
import React, { FC } from 'react';
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
import User from '@/models/interfaces/user';

interface SelectRivalProps {
    users: User[],
    participants: string[],
    setUsers: (event: SelectChangeEvent) => void
}

const SelectRival: FC<SelectRivalProps> = ({ users, participants, setUsers }) => {

    const handleUsersChange = (event: SelectChangeEvent) => {
        console.log(event.target.value)
        setUsers(event)

    };

    return (
        <div className="createGroup">
            <label className="text-5xl">Select Rival</label>
            <div className="search-bar flex items-center rounded-full border-solid border-white border-[5px] h-[50px] w-[28vw] py-10 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
                <FormControl sx={{ m: 1, width: '28vw' }}>
                    <InputLabel id="community-select-label">Select rival</InputLabel>
                    <Select
                        labelId="rival-select-label"
                        id="rival-select"
                        value={participants[0] || ''}
                        onChange={handleUsersChange}
                        input={<OutlinedInput label="Select rival" />}
                    >
                        {users.map((user) => (
                            <MenuItem key={user.id} value={user.user_name}>
                                {user.user_name}
                            </MenuItem>
                        ))}

                    </Select>
                </FormControl>
            </div>
        </div>
    );
};

export default SelectRival;
