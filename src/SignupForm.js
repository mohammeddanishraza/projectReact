import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './SignupForm.css';

function SignupForm() {
 
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    // Get the selected file from the input
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    // Reset selected file to null
    setSelectedFile(null);
  };

  const handleUpload = () => {
    // Handle file upload logic here (e.g., send file to server)
    if (selectedFile) {
      console.log('Selected file:', selectedFile);
      // You can implement file upload logic (e.g., using FormData and fetch)
    } else {
      console.log('No file selected');
    }
  };

  return (
    <div style={{backgroundColor:"white", background:"none"}}>
    <input type="file" onChange={handleFileChange} />
    {selectedFile && (
      <div>
        <p>Selected file: {selectedFile.name}</p>
        <button onClick={handleRemoveFile}>Remove File</button>
      </div>
    )}
    <button onClick={handleUpload}>Upload File</button>
  </div>
);
}

export default SignupForm;
