import LolCompetitionBox from "@/components/lol/lolCompetitionBox";
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
    gameName: string | null;
}

const UploadButtonWrapper: React.FC<UploadButtonWrapperProps> =
    ({ initialLeaderboard, userNames, competitionId, competitionData, creatorName, triggerReload, gameName }) => {
        if (gameName === "League of legends") {
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