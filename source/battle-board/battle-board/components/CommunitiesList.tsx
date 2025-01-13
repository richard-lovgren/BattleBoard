"use client";

import * as React from "react";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import GeneralButton from "./general-btn";

interface CommunitiesListProps {
  communities: { id: string; name: string }[];
}

const CommunitiesList: React.FC<CommunitiesListProps> = ({ communities }) => {
  return (
    <div className="flex  flex-row flex-wrap gap-4 w-full  py-10">
      {communities.map((community) => (
        <Card key={community.id} className="w-[350px]">
          <CardHeader>
            <CardTitle className="font-thin font-odibee text-4xl">{community.name}</CardTitle>
          </CardHeader>
          <CardFooter className="flex justify-between">
          <Link href={`/community/${community.id}`}>
              <GeneralButton type="button" text="View"/>
            </Link>

          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CommunitiesList;
