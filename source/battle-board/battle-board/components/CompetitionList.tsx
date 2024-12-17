"use client";

import "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface CompetitionData {
  competition_id: string;
  competition_name: string;
  competition_description: string
}

interface CompetitionListProps {
  competitions: { id: string }[];
}

async function fetchCommunityCompetitionData(
  competition_id: string
): Promise<CompetitionData> {
  const response = await fetch(
    `/api/users/communities?user_name=${competition_id}` // Correct URL
  );
  if (!response.ok) {
    return { competition_id: "", competition_name: "", competition_description: "" };
  }
  return response.json();
}

const CompetitionList: React.FC<CompetitionListProps> = ({ competitions }) => {
  const router = useRouter();

  const handleNavigation = (id: string) => {
    router.replace(`/competition/${id}`);
  };


  //TODO: To get the actual competition name and stuff an then put in the card title and so on.
  /*useEffect(() => {
    await fetchCommunityCompetitionData(competitions);
  }, competitions);*/

  return (
    <div className="flex  flex-row flex-wrap gap-4 w-full  py-10">
      {competitions.map((competition) => (
        <Card key={competition.id} className="w-[350px]">
          <CardHeader>
            <CardTitle className="font-thin text-3xl">
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h1 className="text-lg font-semibold">BILD KANSKE</h1>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => handleNavigation(competition.id)}
              className="hover:bg-foreground hover:border-foreground"
            >
              View
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CompetitionList;
