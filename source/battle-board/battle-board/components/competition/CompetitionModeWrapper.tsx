import { Fragment, FC } from 'react';
import { Typography } from '@mui/material';
import ClassicMode from '@/components/competitionModes/classicMode/ClassicMode';
import RivalMode from '@/components/competitionModes/rivalMode/RivalMode';

interface CompetitionModeWrapperProps {
    mode: number;
    competitionId: string;
    reloadTrigger: number;
    userNames: string[] | null;
}

const CompetitonModeWrapper: FC<CompetitionModeWrapperProps> = ({ mode, competitionId, reloadTrigger, userNames }) => {
    const renderContent = () => {

        console.log("Loading competition mode:", mode);

        switch (mode) {
            case 1:
                return <ClassicMode competitionId={competitionId} />;
            case 2:
                return (
                    <RivalMode competitionId={competitionId} userNames={userNames} />
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

    return ( // Reload component when reloadTrigger changes
        <Fragment key={reloadTrigger}>
            {renderContent()}
        </Fragment>
    );
};

export default CompetitonModeWrapper;
