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
import CompetitionData from "@/models/interfaces/CompetitionData"

interface CompetitionListProps {
  competitions: CompetitionData[];
}

const CompetitionList: React.FC<CompetitionListProps> = ({ competitions }) => {
  const router = useRouter();

  const handleNavigation = (id: string) => {
    router.replace(`/competition/${id}`);
  };

  return (
    <div className="flex  flex-row flex-wrap gap-4 w-full  py-10" >
      {competitions.length > 0 ? 
      competitions.map((competition) => (
        <Card key={competition.id} className="w-[350px]">
          <CardHeader>
            <CardTitle className="font-thin text-3xl">
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h1 className="text-lg font-semibold">{competition.competition_name}</h1>
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
      )) :
      <div>
        <h3 className="h3">
          No competitions found
          </h3>
        </div>}
    </div>
  );
};

export default CompetitionList;
