import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './NavBar';
import ImageViewerModal from './ImageViewerModal'; // Import the ImageViewerModal component
import './PatientHistory.css';
import { useToken } from './TokenContext';

function PatientHistory() {
  const [showModal, setShowModal] = useState(false);
  const [patientDetailsList, setPatientDetailsList] = useState([]);
  const { token } = useToken();
  const [imageUrl,setImageUrl]=useState('');

  
  const fetchPatientDetails = async () => {
    try {
      const response = await fetch('http://13.232.227.222:3000/mediproc/major/getPatientHistory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const responseData = await response.json();
      if (responseData.status === 'success') {
        setPatientDetailsList(responseData.patient_records);
        alert(responseData.message);

      } else if(responseData.status==500)
      {
        alert(responseData.message);
        window.location.href = '/';
      }else {
        alert(responseData.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error');
    }
  };
  const onViewButton = async(id) => {
    try {
      const response = await fetch('http://13.232.227.222:3000/mediproc/major/getPatientImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token ,patient_id:id}),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const responseData = await response.json();
      if (responseData.status === 'success') {
        setImageUrl(responseData.image_url);
        setShowModal(true);
        alert(responseData.message);

      } else if(responseData.status==500)
      {
        alert(responseData.message);
        window.location.href = '/';
      }else {
        alert(responseData.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error');
    }
};
const onDeleteButton = async(id) => {
  try {
    const response = await fetch('http://13.232.227.222:3000/mediproc/major/deletePatientDetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token ,patient_id:id}),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const responseData = await response.json();
    if (responseData.status === 'success') {
      alert(responseData.message);
      fetchPatientDetails();

    } else if(responseData.status==500)
    {
      alert(responseData.message);
      window.location.href = '/';
    }else {
      alert(responseData.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Server error');
  }
};
  
useEffect(() => {
        fetchPatientDetails();
  }, [token]);

 
  return (
    <div>
      <Navbar />
      <div className='patient-container'>
        <label style={{ color: 'white', fontSize: '30px', fontFamily: 'fantasy' }}>Patient History</label>
        {patientDetailsList.length === 0 ? (
        <label style={{color:'white',fontSize:'25px',marginTop:'40px',fontFamily:'fantasy'}}>No patient details available</label>
      ) : (
        patientDetailsList.map((patient, index) => (
          <div key={index} className='patient-details'>
            <div className='patient-info'>
              <div>
                <label className='info-label'>{patient.patient_name}</label>
                <p className='info-text'>Name</p>
              </div>
              <div>
                <label className='info-label'>{patient.patient_age} years</label>
                <p className='info-text'>Age</p>
              </div>
              <div>
                <label className='info-label'>{patient.patient_gender.charAt(0).toUpperCase() + patient.patient_gender.slice(1)}</label>
                <p className='info-text'>Gender</p>
              </div>
              <div>
                <label className='info-label'>{patient.patient_symptoms}</label>
                <p className='info-text'>Symptoms</p>
              </div>
              <div>
                <label className='info-label'>{patient.accuracy}%</label>
                <p className='info-text'>Accuracy</p>
              </div>
              <div>
                <label className='info-label'>{patient.predicted_result}</label>
                <p className='info-text'>Result</p>
              </div>
              <div className='image-view'>
  <button onClick={() => onViewButton(patient._id)} className='view-btn'>View Image</button>
</div>

              <div className='delete-btn'>
                <button onClick={() => onDeleteButton(patient._id)} className='delete-btn'>Delete</button>
              </div>
            </div>
          </div>
        ))
        )}
      </div>
      {showModal && <ImageViewerModal imageUrl={imageUrl} onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default PatientHistory;
