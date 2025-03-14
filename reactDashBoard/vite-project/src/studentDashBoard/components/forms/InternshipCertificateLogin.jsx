import React, { useState } from 'react';  // ✅ Fixed import
import { API_URL } from '../../data/API_Path';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';

const InternshipCertificateLogin = ({ handleInternshipLoginSuccess }) => {
  const [studentPhone, setStudentPhone] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateInputs = () => {
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(studentEmail)) {
      setError("Invalid email format.");
      return false;
    }

    if (!phoneRegex.test(studentPhone)) {
      setError("Invalid Phone Number. Enter a 10-digit number.");
      return false;
    }

    setError("");
    return true;
  };

  const fetchCertificateDetails = async () => {
    if (!validateInputs()) return;

    try {
      const response = await fetch(`${API_URL}student/internship-login`, {  // ✅ Fixed API endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentPhone, studentEmail })
      });

      const data = await response.json();

      console.log("🔥 API Response:", data);

      if (!response.ok) {
        setError(data.message || "Error fetching student details");
        return;
      }

      if (!data.certificateId) {
        setError("Internship not completed yet. Certificate unavailable!");
        return;
      }

      console.log("Updated Student Data:", data);

      navigate('/student/internship-certificate', { state: { student: data } });  // ✅ Fixed navigation route

      setError("");
      handleInternshipLoginSuccess(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className='d-flex flex-column justify-content-center align-items-center'>
        <h1 className='formHeading'>Internship Certification Login</h1>
        <div className='formInputs'>
          <div className="mb-3">
            <label className='labelText'>Candidate Phone Number:</label>
            <input type="text" value={studentPhone} onChange={(e) => setStudentPhone(e.target.value)} onBlur={validateInputs} />
          </div>
          <div className="mb-3">
            <label className='labelText'>Candidate Email Id:</label>
            <input type="text" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} onBlur={validateInputs} />
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}
        <button className='getCertificateBtn' onClick={fetchCertificateDetails}>Get Certificate</button>
      </div>
    </>
  );
};

export default InternshipCertificateLogin;