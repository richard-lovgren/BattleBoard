

import * as React from 'react';
import { Paper, Typography } from '@mui/material';
import ClassicMode from '@/components/competitionModes/classicMode/ClassicMode';

interface CompetitionModeWrapperProps {
    mode: number;
}

const CompetitonModeWrapper: React.FC<CompetitionModeWrapperProps> = ({ mode }) => {
    const renderContent = () => {
        switch (mode) {
            case 1:
                return <ClassicMode />;
            case 1:
                return (
                    <div className="w-full flex items-center justify-center">
                        <Typography className="text-3xl font-odibee">Rival Mode</Typography>
                    </div>
                );
            case 3:
                return (
                    <div className="w-full flex items-center justify-center">
                        <Typography className="text-3xl font-odibee">Tournament Mode</Typography>
                    </div>
                );
            default:
                return (
                    <div className="w-full flex items-center justify-center">
                        <Typography className="text-3xl font-odibee">Classic Mode</Typography>
                    </div>
                );
        }
    };

    return renderContent(); // Call the function to get the JSX
};

export default CompetitonModeWrapper;
