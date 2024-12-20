"use client";

import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { parse } from "papaparse";
import { Leaderboard } from "@/models/leaderboard";
import LeaderboardDTO from "@/models/dtos/leaderboard-dto";

// Styled components
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

async function postLeaderboard(leaderboard: LeaderboardDTO): Promise<Leaderboard> {
  const response = await fetch(
    `/api/competitions/leaderboard?competitionId=${leaderboard.competition_id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leaderboard),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to post leaderboard");
  }

  return response.json();

}

// Utility function to parse CSV
function parseCsv<T = Record<string, string>>(
  fileContent: string,
  userNames: string[],
  competitionId: string,
  prevLeaderboard: Leaderboard | null
): Leaderboard | LeaderboardDTO | string {
  const { data, errors } = parse<T>(fileContent, {
    header: true,
    skipEmptyLines: true,
  });
  if (errors.length > 0) {
    return errors.map((error) => error.message).join(", ");
  }
  // I am sorry for this - LT

  console.log("Data:", data);

  // Check same number of keys
  const keyCounts = data.map(
    (obj) => Object.keys(obj as Record<string, string>).length
  );
  const allSameLength = keyCounts.every((count) => count === keyCounts[0]);

  if (!allSameLength) {
    return "Data contains rows with inconsistent column counts";
  }

  const userNamesInCSV = Object.keys(data[0] as Record<string, string>).filter(
    (key) => key !== "name"
  );
  userNames.forEach((element) => {
    if (!userNamesInCSV.includes(element)) {
      return "Data does not contain all users";
    }
  });

  //check that all objects are same length

  if (!prevLeaderboard) {
    const columnNames = Object.keys(data[0] as Record<string, string>);

    const entries = data.map((entry) => {
      return {
        ...Object.fromEntries(
          Object.entries(entry as Record<string, string>)
        ),
      };
    });

    const leaderboard_dto: LeaderboardDTO = {
      competition_id: competitionId,
      column_names: columnNames,
      leaderboard_entries: entries,
    }

    console.log("leaderboard_dto", leaderboard_dto);

    postLeaderboard(leaderboard_dto).then((leaderboard) => {
      if (leaderboard) {
        return leaderboard;
      }
      return "oof";
    });
  }

  return "oof";
}

interface FileUploadAndParseComponentProps {
  prevLeaderboard: Leaderboard | null;
  userNames: string[];
  competitionId: string;
  handleCompetitionDataParsed: (data: Leaderboard) => void;
}

const FileUploadAndParseButton: React.FC<FileUploadAndParseComponentProps> = ({
  prevLeaderboard,
  userNames,
  handleCompetitionDataParsed,
  competitionId,
}) => {
  const [fileHelperText, setFileHelperText] = useState<string | null>(null);

  if (userNames === null) {
    return <p>silli :P</p>;
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setFileHelperText("No files selected.");
      return;
    }

    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const data = parseCsv(result, userNames, competitionId, prevLeaderboard);
      if (typeof data === "string") {
        setFileHelperText(`Parsing errors: ${data}`);
      } else {
        setFileHelperText("File parsed successfully!");
        setTimeout(() => setFileHelperText(null), 3000);
        console.log("Parsed Data:", data); // Handle parsed data
      }
    };

    reader.onerror = () => {
      setFileHelperText("Error reading file. Please try again.");
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <Button
        component="label"
        variant="contained"
      >
        Upload Results using CSV
        <VisuallyHiddenInput
          type="file"
          onChange={handleFileUpload}
          accept=".csv"
        />
      </Button>
      {fileHelperText && <p>{fileHelperText}</p>}
    </div>
  );
};

export default FileUploadAndParseButton;
