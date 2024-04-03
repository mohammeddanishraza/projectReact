import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UploadForm.css';
import NavBar from './NavBar';
import { useToken } from './TokenContext';
import uploadIcon from './images/upload-icon.png'; // Import the image file

function UploadForm() {
  const { updateToken,updateUsername ,updateUserType} = useToken(); // Get the updateToken function from context
  const [selectedFile, setSelectedFile] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientSymptoms, setPatientSymptoms] = useState('');
  const [gender, setGender] = useState('');
  const [buttonEnabled, setButtonEnabled] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    const username = searchParams.get('username');
    const userType = searchParams.get('userType');

    // Call updateToken to set the token
    if (token) {
      updateToken(token);
    }

    // Call updateUsername to set the username
    if (username) {
      updateUsername(username);
    }
    if (userType) {
      updateUserType(userType);
    }
  }, [updateToken, updateUsername,updateUserType]);


  const { token } = useToken();
  const { username } = useToken();
  const { userType } = useToken();

  const handleFileChange = (event) => {
    // Get the selected file from the input
    const file = event.target.files[0];
    setSelectedFile(file);
    validateForm(patientName, patientAge, patientSymptoms, gender, file);
  };

  const handleRemoveFile = () => {
    // Reset selected file to null
    setSelectedFile(null);
    validateForm(patientName, patientAge, patientSymptoms, gender, null);
  };

  const handleUpload = async () => {

    if (patientAge>=1&&patientAge<=100 ) {
      setButtonEnabled(false);
      // Proceed with upload logic
      const formData = new FormData();
      formData.append('token', token);
      formData.append('name', patientName);
      formData.append('age', patientAge);
      formData.append('symptoms', patientSymptoms); 
      formData.append('gender', gender);
      formData.append('image', selectedFile);

      try {
        const response = await fetch('http://13.232.227.222:3000/mediproc/major/uploadFile', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        const responseData = await response.json();
        alert(responseData.message);

        if (responseData.status === 'success') {
          window.location.href = '/patients?token='+token+'';
        } else if (responseData.status === 500) {
          window.location.href = '/';
        } else {
          setButtonEnabled(true);

        }
      } catch (error) {
        console.error('Error:', error);
        alert("Server error");
      }
    } else {
      
        alert('Please enter valid age.');
      
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
    validateForm(patientName, patientAge, patientSymptoms, gender, file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handlePatientNameChange = (event) => {
    setPatientName(event.target.value);
    validateForm(event.target.value, patientAge, patientSymptoms, gender, selectedFile);
  };

  const handlePatientAgeChange = (event) => {
    setPatientAge(event.target.value);
    validateForm(patientName, event.target.value, patientSymptoms, gender, selectedFile);
  };

  const handlePatientSymptomsChange = (event) => {
    setPatientSymptoms(event.target.value);
    validateForm(patientName, patientAge, event.target.value, gender, selectedFile);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
    validateForm(patientName, patientAge, patientSymptoms, event.target.value, selectedFile);
  };

  const validateForm = (name, age, symptoms, gender, file) => {
    if (name.length !== 0 && age.length !== 0 && symptoms.length !== 0 && gender && file) {
      setButtonEnabled(true);
    } else {
      setButtonEnabled(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="file">
        <label style={{ color: "white", fontSize: "30px", fontFamily: "fantasy" }}>Upload patient details</label>
        <input
          type="text"
          placeholder="Patient Name"
          className="patient-input"
          value={patientName}
          onChange={handlePatientNameChange}
        />
        <input
          type="number"
          placeholder="Patient Age"
          className="patient-input"
          value={patientAge}
          onChange={handlePatientAgeChange}
        />
        <div className="radio-container">
          <div>
            <label>
              <input
                type="radio"
                value="male"
                name="gender"
                className='radio-input'
                onChange={handleGenderChange}
              />
              Male
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                value="female"
                name="gender"
                className='radio-input'
                onChange={handleGenderChange}
              />
              Female
            </label>
          </div>
        </div>
        <textarea
          placeholder="Patient Symptoms"
          className='symptoms-input'
          value={patientSymptoms}
          onChange={handlePatientSymptomsChange}
        />
        <div
          className="file-upload-container"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="fileInput"
            className="file-input"
          />
          <img src={uploadIcon} alt="Example Image" className="upload-icon" />
          <label className="instructions">
            <br></br>
            Drag and drop your file here
          </label>
          <p className="instructions">Or</p>
          <label htmlFor="fileInput" className="custom-file-input-button">
            Browse
          </label>
          {selectedFile && (
            <div className="selected-file">
              <p>Selected file: {selectedFile.name}</p>
              <button onClick={handleRemoveFile} className="remove-file-btn">
                Remove File
              </button>
            </div>
          )}
        </div>
        <button onClick={handleUpload} className="upload-file-btn" disabled={!buttonEnabled}>
          Upload Patient details
        </button>
      </div>
    </div>
  );
}

export default UploadForm;
