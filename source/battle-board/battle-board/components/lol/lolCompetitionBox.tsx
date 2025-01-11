import createLeagueCompetition from '@/lib/leagueApi/createLeagueCompetition';
import CompetitionData from '@/models/interfaces/CompetitionData';
import React, { useState } from 'react';

interface LolCompetitionBoxProps {
    competitionId: string;
    user: string;
    competitionData: CompetitionData;
}

const LolCompetitionBox: React.FC<LolCompetitionBoxProps> = ({ competitionId, user, competitionData }) => {
    const [matchesToLoad, setMatchesToLoad] = useState(20);
    const [buttonHovered, setButtonHovered] = useState(false);
    const isOwner = true;

    const handleButtonClick = () => {
        createLeagueCompetition(competitionId, matchesToLoad);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMatchesToLoad(Number(event.target.value));
    };

    return (
        <>
            {isOwner && (
                <div className="flex flex-col items-center space-y-4">
                    <input
                        type="number"
                        value={matchesToLoad}
                        onChange={handleInputChange}
                        className="input border rounded p-2"
                        placeholder="Enter number of matches"
                    />
                    <button
                        className={`button bg-blue-500 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform ${buttonHovered ? 'bg-blue-700 scale-105' : 'bg-blue-500'
                            }`}
                        onMouseEnter={() => setButtonHovered(true)}
                        onMouseLeave={() => setButtonHovered(false)}
                        onClick={handleButtonClick}
                    >
                        Load Matches
                    </button>
                </div>
            )}
        </>
    );
};

export default LolCompetitionBox;
