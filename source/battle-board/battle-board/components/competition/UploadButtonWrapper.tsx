import LolCompetitionBox from "@/components/lol/lolCompetitionBox";
import fetchGameName from "@/lib/leaderboard/fetchGameName";
import FileUploadAndParseComponent from "@/components/competition/FileUploadAndParseButton";
import { Leaderboard } from "@/models/leaderboard";
import CompetitionData from "@/models/interfaces/CompetitionData";

interface UploadButtonWrapperProps {
    initialLeaderboard: Leaderboard | null;
    userNames: string[];
    competitionId: string;
    competitionData: CompetitionData;
    creatorName: string;
    triggerReload: () => void;
}

const UploadButtonWrapper: React.FC<UploadButtonWrapperProps> =
    ({ initialLeaderboard, userNames, competitionId, competitionData, creatorName, triggerReload }) => {
        if (competitionData.game_id === "121e3728-5a50-45a1-92cf-c8695af932e1") {
            return (
                <LolCompetitionBox competitionId={competitionId} user={creatorName} competitionData={competitionData} />
            );
        }
        return (<FileUploadAndParseComponent
            prevLeaderboard={initialLeaderboard}
            userNames={userNames}
            handleCompetitionDataParsed={triggerReload}
            competitionId={competitionId}
        />);
    }

export default UploadButtonWrapper;