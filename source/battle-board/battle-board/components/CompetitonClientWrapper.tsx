"use client"

import React, { useState } from "react";
import UploadFiles from "@/components/UploadFiles";
import ClassicMode from "./competitionModes/classicMode/ClassicMode";

type RowData = {
  [key: string]: string | number;
}

const CompetitionClientWrapper: React.FC = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);

  return (
    <div className="flex flex-row gap-4 items-center justify-start w-full">
      <UploadFiles onUpload={(data) => setRowData(data)} />
      <ClassicMode Rows={rowData} /> {/* Pass the data to PlayerGrid */}
    </div>
  );
};

export default CompetitionClientWrapper;
