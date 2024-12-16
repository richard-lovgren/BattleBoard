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

interface CommunitiesListProps {
  communities: { id: string; name: string }[];
}

const CommunitiesList: React.FC<CommunitiesListProps> = ({ communities }) => {
  const router = useRouter();

  const handleNavigation = (id: string) => {
    router.replace(`/community/${id}`);
  };

  return (
    <div className="flex  flex-row flex-wrap gap-4 w-full  py-10">
      {communities.map((community) => (
        <Card key={community.id} className="w-[350px]">
          <CardHeader>
            <CardTitle className="font-thin">{community.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <h1 className="text-lg font-semibold">BILD KANSKE</h1>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => handleNavigation(community.id)}
            >
              View
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CommunitiesList;
