"use client";

import "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import CompetitionData from "@/models/interfaces/CompetitionData"
import GeneralButton from "./general-btn";
import Link from "next/link";

interface CompetitionListProps {
  competitions: CompetitionData[];
}

const CompetitionList: React.FC<CompetitionListProps> = ({ competitions }) => {
  return (
    <div className="flex  flex-row flex-wrap gap-4 w-full  py-10 " >
      {competitions.length > 0 ? 
      competitions.map((competition) => (
        <Card key={competition.id} className="w-[350px]">
          <CardHeader>
            <CardTitle className="font-thin font-odibee text-4xl">{competition.competition_name}</CardTitle>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <Link href={`/competition/${competition.id}`}>
              <GeneralButton type="button" text="View"/>
            </Link>
            
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
