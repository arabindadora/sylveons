import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import CodeEditor from "./CodeEditor";
import styled from "styled-components";
import config from "../config";

export const LineCounter = styled.div`
  position: absolute;
  left: 26px;
  top: 20px;
  bottom: 20px;
  font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  overflow: hidden;

  span {
    line-height: 24.8px;
    display: block;
  }
`;
interface FileUpload {
  id: string;
  name: string;
}

interface GetFilesQuery {
  files: FileUpload[];
}

/*   const response = {
    "status": 200,
    "result": [
        {
            "line": 1,
            "problem": "Using wildcard import (*) which imports all symbols from tkinter module.",
            "problem_code": "Using wildcard import (*) which imports all symbols from tkinter module.",
            "solution_code": "from tkinter import *",
            "solution": "Explicitly import only the symbols needed from tkinter to avoid namespace pollution and potential conflicts."
        },
        {
            "line": 2,
            "problem": "Importing the numpy library but not using it.",
            "problem_code": "Importing the numpy library but not using it.",
            "solution_code": "import numpy as np",
            "solution": "Consider removing the numpy import if it's not necessary for the functionality of the code."
        },
        {
            "line": 8,
            "problem": "Using magic numbers for defining the size of the board.",
            "problem_code": "Using magic numbers for defining the size of the board.",
            "solution_code": "size_of_board = 600",
            "solution": "Consider defining a constant variable for the size of the board to improve code readability and maintainability."
        },
        {
            "line": 9,
            "problem": "Complex calculation without explanation.",
            "problem_code": "Complex calculation without explanation.",
            "solution_code": "symbol_size = (size_of_board / 3 - size_of_board / 8) / 2",
            "solution": "Add comments or separate variables to explain the calculation and improve code readability."
        },
        {
            "line": 10,
            "problem": "Using a hardcoded value for the symbol thickness.",
            "problem_code": "Using a hardcoded value for the symbol thickness.",
            "solution_code": "symbol_thickness = 50",
            "solution": "Define a constant variable for the symbol thickness to make it easier to adjust or customize."
        },
        {
            "line": 13,
            "problem": "Class name not following PEP 8 naming conventions.",
            "problem_code": "Class name not following PEP 8 naming conventions.",
            "solution_code": "class Tic_Tac_Toe():",
            "solution": "Rename the class to 'TicTacToe' to comply with PEP 8 naming conventions."
        },
        {
            "line": 26,
            "problem": "Binding directly to '<Button-1>' without explaining its purpose.",
            "problem_code": "Binding directly to '<Button-1>' without explaining its purpose.",
            "solution_code": "self.window.bind('<Button-1>', self.click)",
            "solution": "Add comments or a docstring to explain the purpose of the event binding."
        },
        {
            "line": 58,
            "problem": "Lack of type annotations for function parameters.",
            "problem_code": "Lack of type annotations for function parameters.",
            "solution_code": "def draw_O(self, logical_position):",
            "solution": "Add type annotations to function parameters to improve code clarity and maintainability."
        },
        {
            "line": 93,
            "problem": "Using magic numbers (0) for comparisons.",
            "problem_code": "Using magic numbers (0) for comparisons.",
            "solution_code": "def is_grid_occupied(self, logical_position):",
            "solution": "Define constants for grid states (occupied/unoccupied) to improve code readability."
        },
        {
            "line": 10,
            "problem": "Lack of error handling for invalid player input.",
            "problem_code": "Lack of error handling for invalid player input.",
            "solution_code": "def is_winner(self, player):",
            "solution": "Add error handling to ensure the player input ('X' or 'O') is valid."
        },
        {
            "line": 13,
            "problem": "Lack of error handling for event coordinates.",
            "problem_code": "Lack of error handling for event coordinates.",
            "solution_code": "def click(self, event):",
            "solution": "Add error handling to ensure event coordinates are within the canvas bounds."
        }
    ]
} */


const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [responseFromAnalysis, setResponseFromAnalysis] = useState([
    {
      line: 0,
      problem: "",
      problem_code: "",
      solution_code: "",
      solution: "",
    },
  ]);

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
        formData.append("file", uploadedFile);

        try {

          const response = await fetch(config.apiBaseUrl + '/v2/upload', {
            method: "POST",
            body: formData,
          });

          if(response.status === 200) {
            setUploadSuccess(true);
            console.log('File upload completed successfully.');
            const response = await fetch(config.apiBaseUrl + '/v2/analysis?' + new URLSearchParams({
              file: uploadedFile.name,
          }), {
              method: "GET",
            });

            const responseData = await response.json();
          
            console.log('Response from analysis:', responseData);
            setResponseFromAnalysis(responseData);

          } else {
            const errorData = await response.json();
            setUploadError(`Error: ${errorData.message || response.statusText}`);
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

      <div className="flex flex-grow justify-center items-center bg-neutral pb-5 pt-5">
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


{/* parent div wrapping problem and solution */}
<div className="flex flex-row justify-center align-items-center">
        {/* problem here */}
      <div className="flex flex-grow justify-center items-center bg-neutral">
        <div className="card card-compact w-full max-w-lg bg-base-100 shadow-xl" style={{width:'800px', height:'100px'}}>
          <div className="card-body items-stretch text-center" style={{width:'200px'}}>
            { 
              responseFromAnalysis && responseFromAnalysis.map((item: any) => (
                <>
                  <h3>Problem: {item.problem}</h3>
                  <br/>
                  <CodeEditor
                    type="effect"
                    barColor="#254262"
                    data={item.problem_code} />
                  <br/>
                </>
              ))
          }
            </div>
          </div>
        </div>
        {/* solution here */}
      <div className="flex flex-grow justify-center items-center bg-neutral">
        <div className="card card-compact w-full max-w-lg bg-base-100 shadow-xl" style={{width:'800px', height:'100px'}}>
          <div className="card-body items-stretch text-center" style={{width:'200px'}}>
            {
              responseFromAnalysis && responseFromAnalysis.map((item: any) => (
                <div>
                  <h3>Solution: {item.solution}</h3>
                  <br/>
                  <CodeEditor
                    type="effect"
                    barColor="#254262"
                    data={item.solution_code}
                  />
                  <br/>
                </div>
              ))
            }
            </div>
          </div>
        </div>
          </div>
      

      

      </div>
    

    
  );
};

export default FileUpload;
