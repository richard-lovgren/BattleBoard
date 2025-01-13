import createLeagueCompetition from '@/lib/leagueApi/createLeagueCompetition';
import CompetitionData from '@/models/interfaces/CompetitionData';
import React, { useState } from 'react';

interface LolCompetitionBoxProps {
    competitionId: string;
    user: string;
    competitionData: CompetitionData;
    triggerReload: () => void;
}

const LolCompetitionBox: React.FC<LolCompetitionBoxProps> = ({ competitionId, user, competitionData, triggerReload }: LolCompetitionBoxProps) => {
    const [matchesToLoad, setMatchesToLoad] = useState(20);
    const [buttonHovered, setButtonHovered] = useState(false);
    const [loading, setLoading] = useState(false);
    const isOwner = user === competitionData.creator_name;

    const handleButtonClick = async () => {
        setLoading(true);
        await createLeagueCompetition(competitionId, matchesToLoad);
        triggerReload();
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
                        disabled={loading}
                    >
                        {loading ? (
                            <svg
                                className="animate-spin h-5 w-5 mr-3"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        ) : (
                            'Load Matches'
                        )}
                    </button>
                </div>
            )}
        </>
    );
};

export default LolCompetitionBox;
