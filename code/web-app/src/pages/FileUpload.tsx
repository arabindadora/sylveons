import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";

interface FileUpload {
  id: string;
  name: string;
}

interface GetFilesQuery {
  files: FileUpload[];
}

  const response = {
    "status": 200,
    "result": [
        {
            "line": 1,
            "problem": "Unused import 'tkinter'",
            "solution": "You are not using 'tkinter' in the code. Remove the import statement if it's not needed."
        },
        {
            "line": 8,
            "problem": "Global variable 'size_of_board' is defined but not used",
            "solution": "Consider removing or utilizing the 'size_of_board' variable if needed."
        },
        {
            "line": 9,
            "problem": "Global variable 'symbol_size' is defined but not used",
            "solution": "Consider removing or utilizing the 'symbol_size' variable if needed."
        },
        {
            "line": 10,
            "problem": "Global variable 'symbol_thickness' is defined but not used",
            "solution": "Consider removing or utilizing the 'symbol_thickness' variable if needed."
        },
        {
            "line": 11,
            "problem": "Global variable 'symbol_X_color' is defined but not used",
            "solution": "Consider removing or utilizing the 'symbol_X_color' variable if needed."
        },
        {
            "line": 12,
            "problem": "Global variable 'symbol_O_color' is defined but not used",
            "solution": "Consider removing or utilizing the 'symbol_O_color' variable if needed."
        },
        {
            "line": 13,
            "problem": "Global variable 'Green_color' is defined but not used",
            "solution": "Consider removing or utilizing the 'Green_color' variable if needed."
        },
        {
            "line": 33,
            "problem": "Unused function 'play_again'",
            "solution": "The 'play_again' function is defined but not called anywhere. Remove it if it's not necessary."
        },
        {
            "line": 80,
            "problem": "Unused function 'is_grid_occupied'",
            "solution": "The 'is_grid_occupied' function is defined but not called anywhere. Remove it if it's not necessary."
        },
    ],
  }


const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleFileUploadClick = async () => {
    const fileInput = document.getElementById("codeFileInput") as HTMLInputElement;

    fileInput.onchange = async (event) => {
      const uploadedFile = (event.target as HTMLInputElement).files?.[0];
      if (uploadedFile) {
        setUploading(true);
        setUploadError(null);
        setUploadSuccess(false);

        const formData = new FormData();
        formData.append("codeFile", uploadedFile);

        try {
          /* const response = await fetch('input/upload_file', {
            method: "POST",
            body: formData,
          }); */
         

          if (response.status === 202) {
            setUploadSuccess(true);
            console.log('File upload accepted, processing in the background.');


          } else if(response.status === 200) {
            setUploadSuccess(true);
            console.log('File upload completed successfully.');

    

          } else {
            /* const errorData = await response.json();
            setUploadError(`Error: ${errorData.message || response.statusText}`); */
            setUploadError('Error fail');
          }
        } catch (error) {
          console.error('FIle upload error:', error);
          setUploadError("Failed to upload the file. Please try again.");
        } finally {
          setUploading(false);
        }
      }
    };
    fileInput.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="navbar bg-base-300 text-neutral-content">
        <div className="flex-1">
          <a href="/" className="p-2 normal-case text-xl">
            Upload a single file
          </a>
        </div>
      </div>

      <div className="flex flex-grow justify-center items-center bg-neutral">
        <div className="card card-compact w-full max-w-lg bg-base-100 shadow-xl">
          <div className="card-body items-stretch text-center">
            <h1 className="card-title self-center text-2xl font-bold mb-4">
              Upload a single file
            </h1>
            <div className="form-control w-full">
              <div className="join">
                <div>
                  <h1>Upload Code File</h1>
                  <button className="btn btn-primary" onClick={handleFileUploadClick}>
                    Upload
                  </button>
                  <input type="file" id="codeFileInput" accept=".js, .ts, .jsx, .tsx, .py" onChange={handleFileChange} style={{ display: "none" }} />

                  {uploading && <p>Uploading...</p>}
                  {uploadSuccess && <p>File uploaded successfully!</p>}
                  {uploadError && <p>Error: {uploadError}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
