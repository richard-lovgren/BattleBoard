"use client";

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { parse } from "papaparse";

// Type for the parsed CSV data
type RowData = {
  [key: string]: string
}

// Props for UploadFiles
interface UploadFilesProps {
  onUpload: (data: RowData[]) => void;
}

const VisuallyHiddenInput = styled("input")({
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
});

const UploadFiles: React.FC<UploadFilesProps> = ({ onUpload }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result) {
          const fileContent = reader.result.toString();
          const { data, errors } = parse<RowData>(fileContent, {
            header: true,
            skipEmptyLines: true,
          });

          if (errors.length > 0) {
            console.error("CSV Parsing Errors:", errors);
            return;
          }

          onUpload(data);
        }
      };

      reader.onerror = () => {
        console.error("Error reading the file.");
      };

      reader.readAsText(file);
    }
  };

  return (
    <Button component="label" variant="contained" className="flex md:h-10 sm:h-5  ">
      Upload files
      <VisuallyHiddenInput type="file" onChange={handleFileUpload} accept=".csv" />
    </Button>
  );
};

export default UploadFiles;
