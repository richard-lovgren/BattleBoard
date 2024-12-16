"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface CompetitionListProps {
  competitions: { id: string; competition_name: string }[];
}

const CompetitionList: React.FC<CompetitionListProps> = ({ competitions }) => {
  const router = useRouter();

  const handleNavigation = (id: string) => {
    router.replace(`/competition/${id}`);
  };

  return (
    <div className="flex  flex-row flex-wrap gap-4 w-full  py-10">
      {competitions.map((competition) => (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="font-thin text-3xl">
              {competition.competition_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h1 className="text-lg font-semibold">BILD KANSKE</h1>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => handleNavigation(competition.id)}
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
