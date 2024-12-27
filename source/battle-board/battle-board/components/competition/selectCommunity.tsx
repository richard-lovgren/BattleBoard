// Code for selecting a community
import React, { FC, useState } from 'react';
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';

interface SelectCommunityProps {
    communityIds: string[];
}

const SelectCommunity: FC<SelectCommunityProps> = ({ communityIds }) => {
    const [community, setCommunity] = useState('');

    const handleCommunityChange = (event: SelectChangeEvent) => {
        setCommunity(event.target.value);
    };

    return (
        <div className="createGroup">
            <label className="text-5xl">Select Community</label>
            <div className="search-bar flex items-center rounded-full border-solid border-white border-[5px] h-[50px] w-[28vw] py-10 pl-4 pr-8 shadow-lg shadow-indigo-500/50">
                <FormControl sx={{ m: 1, width: '28vw' }}>
                    <InputLabel id="community-select-label">Select community</InputLabel>
                    <Select
                        labelId="community-select-label"
                        id="community-select"
                        value={community}
                        onChange={handleCommunityChange}
                        input={<OutlinedInput label="Select community" />}
                    >
                        {communityIds.map((communityId) => (
                            <MenuItem key={communityId} value={communityId}>
                                Community {communityId}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
        </div>
    );
};

export default SelectCommunity;
