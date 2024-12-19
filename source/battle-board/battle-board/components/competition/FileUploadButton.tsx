'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { parse } from 'papaparse';

// Styled components
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

// Utility function to parse CSV
function parseCsv<T>(fileContent: string): T[] | string {
    const { data, errors } = parse<T>(fileContent, {
        header: true,
        skipEmptyLines: true,
    });
    if (errors.length > 0) {
        return errors[0].message;
    }
    return data;
}

const FileUploadButton = () => {
    const [fileHelperText, setFileHelperText] = useState<string | null>(null);

    return (
        <div>
            <Button
                component="label"
                variant="contained"
                startIcon={< CloudUploadIcon />}
            >
                Upload CSV
                < VisuallyHiddenInput
                    type="file"
                    onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                        const files = event.target.files;
                        if (!files) {
                            setFileHelperText("No files selected");
                            return;
                        }
                        const reader = new FileReader();
                        reader.onload = () => {
                            const data = parseCsv(reader.result as string);
                            if (typeof data === 'string') {
                                setFileHelperText(data);
                            } else {
                                setFileHelperText(null);
                            }
                        };
                        reader.readAsText(files[0]);
                    }}
                />
            </Button>
            {fileHelperText && <p>{fileHelperText} </p>}
        </div>
    );
};

export default FileUploadButton;