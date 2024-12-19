'use client';

import { useSession } from 'next-auth/react';
import { Button } from '@mui/material';

const EditCompetitionButton = ({ competitionCreator }: { competitionCreator: string }) => {
    const { data: session } = useSession();
    const username = session?.user?.name;

    if (username !== competitionCreator) {
        return null;
    }

    return (
        <div>
            <Button variant="contained" color="primary">
                Edit competition results
            </Button>
        </div>
    );
};

export default EditCompetitionButton;
