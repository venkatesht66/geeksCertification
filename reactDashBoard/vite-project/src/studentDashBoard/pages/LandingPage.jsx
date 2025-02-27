import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StudentLogin from '../components/forms/StudentLogin';
import StudentCertificate from '../components/forms/StudentCertificate';
import StudentVerify from '../components/forms/StudentVerify';
import CertificateHomePage from '../components/forms/CertificateHomePage';

const LandingPage = () => {
  const [showStudentActions, setShowStudentActions] = useState(true);
  const [studentToEnterDetails, setStudentToEnterDetails] = useState(false);
  const [studentToEnterId, setStudentToEnterId] = useState(false);
  const [studentVerified, setStudentVerified] = useState(false);
  const [verifyCertificate, setVerifyCertificate] = useState(false);
  const [studentData, setStudentData] = useState(null);

  const navigate = useNavigate();

  const showCandidateToEnterDetails = () => {
    setStudentToEnterDetails(true);
    setShowStudentActions(false);
    setStudentVerified(false);
    setVerifyCertificate(false);
  };

  const handleStudentLoginSuccess = (data) => {
    setStudentData(data);
    setStudentToEnterDetails(false);
    setShowStudentActions(false);
    setStudentVerified(true);
  };

  const showCandidateToEnterId = () => {
    setStudentToEnterDetails(false);
    setStudentToEnterId(true);
    setShowStudentActions(false);
    setStudentVerified(false);
    setVerifyCertificate(false);
  };

  const showCandidateVerify = () => {
    setStudentToEnterDetails(false);
    setShowStudentActions(false);
    setStudentVerified(false);
    setVerifyCertificate(true);
  };

  return (
    <>
      <Navbar />
      {showStudentActions && (
        <CertificateHomePage
          showCandidateToEnterDetails={showCandidateToEnterDetails}
          showCandidateVerify={showCandidateVerify}
        />
      )}
      {studentToEnterDetails && <StudentLogin handleStudentLoginSuccess={handleStudentLoginSuccess} />}
      {studentVerified && studentData && <StudentCertificate student={studentData} />}
      {studentToEnterId && <StudentVerify showCandidateVerify={showCandidateVerify} />}
      {verifyCertificate && <StudentVerify />}
    </>
  );
};

export default LandingPage;