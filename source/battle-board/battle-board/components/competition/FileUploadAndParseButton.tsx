"use client";

import { useState } from "react";
import { Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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

async function postLeaderboard(
  leaderboard: LeaderboardDTO
): Promise<Leaderboard> {
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
async function parseCsv<T = Record<string, string>>(
  fileContent: string,
  userNames: string[],
  competitionId: string,
  prevLeaderboard: Leaderboard | null
): Promise<Leaderboard | LeaderboardDTO | string> {
  const { data, errors } = parse<T>(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  if (errors.length > 0) {
    return errors.map((error) => error.message).join(", ");
  }

  console.log("Data:", data);

  // Check same number of keys
  const keyCounts = data.map(
    (obj) => Object.keys(obj as Record<string, string>).length
  );
  const allSameLength = keyCounts.every((count) => count === keyCounts[0]);

  if (!allSameLength) {
    return "Data contains rows with inconsistent column counts";
  }

  const userNamesInCSV = data.map(
    (obj) => (obj as Record<string, string>).name
  );

  for (const element of userNamesInCSV) {
    if (!userNames.includes(element)) {
      return "Data contains unknown users";
    }
  }

  for (const element of userNames) {
    if (!userNamesInCSV.includes(element)) {
      return "Data does not contain all users in the competition";
    }
  }

  const columnNames = Object.keys(data[0] as Record<string, string>);
  const entries = data.map((entry) => {
    return {
      ...Object.fromEntries(Object.entries(entry as Record<string, string>)),
    };
  });

  if (prevLeaderboard) { // Assert columns unchanged
    const prevColumnNames = prevLeaderboard.column_names;
    if (columnNames.length !== prevColumnNames.length) {
      return "Column count mismatch between loaded data and previous leaderboard";
    }

    prevColumnNames.forEach(element => {
      if (!columnNames.includes(element)) {
        return "Column names mismatch between loaded data and previous leaderboard";
      }
    });

    columnNames.forEach(element => {
      if (!prevColumnNames.includes(element)) {
        return "Column names mismatch between loaded data and previous leaderboard";
      }
    });
  }

  const leaderboard_dto: LeaderboardDTO = {
    competition_id: competitionId,
    column_names: columnNames,
    leaderboard_entries: entries,
  };

  try {
    const leaderboard = await postLeaderboard(leaderboard_dto);
    if (leaderboard) {
      console.log("Success - returned leaderboard");
      return leaderboard;
    } else {
      return "Failed to save leaderboard";
    }
  } catch (error) {
    console.error("Error saving leaderboard:", error);
    return "Big oof";
  }
}

interface FileUploadAndParseComponentProps {
  prevLeaderboard: Leaderboard | null;
  userNames: string[];
  competitionId: string;
  handleCompetitionDataParsed: () => void;
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

    reader.onload = async () => {
      try {
        const result = reader.result as string;
        const data = await parseCsv(
          result,
          userNames,
          competitionId,
          prevLeaderboard
        );

        if (typeof data === "string") {
          setFileHelperText(`Parsing errors: ${data}`);
        } else {
          setFileHelperText("File parsed successfully!");
          setTimeout(() => setFileHelperText(null), 3000);
          console.log("Parsed Data:", data); // Handle parsed data here
          handleCompetitionDataParsed();
        }
      } catch (error) {
        console.error("Error parsing CSV:", error);
        setFileHelperText(
          "An unexpected error occurred while parsing the file."
        );
      }
      finally {
        event.target.value = ""; // Reset file input to allow same file to be uploaded again (might have been changed -> new data)
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
        startIcon={<CloudUploadIcon />}
        style={{borderRadius: "10px", textTransform: "none", height:'40px'}}
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
