import React, { useState}  from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'
import StudentLogin from '../components/forms/StudentLogin'
import StudentCertificate from '../components/forms/StudentCertificate'
import StudentVerify from '../components/forms/StudentVerify'
import CertificateHomePage from '../components/forms/CertificateHomePage'
import CertificateVerified from '../components/forms/CertificateVerified'


const LandingPage = () => {
  const [showStudentActions, setShowStudentAction] = useState(true)
  const [studentToEnterDetails, setStudentToEnterDetails] = useState(false);
  // const [studentToEnterId, setStudentToEnterId] = useState(false);
  const [studentVerified,setStudentVerified] = useState(false);
  const [verifyCertificate,setVerifyCertificate] = useState(false);
  const [studentData, setStudentData] = useState(null);

  const navigate = useNavigate();

  const showCandidateToEnterDetails = () => {
    setStudentToEnterDetails(true)
    // setStudentToEnterId(false)
    setShowStudentAction(false)
    setStudentVerified(false)
    setVerifyCertificate(false)
  }

  const handleStudentLoginSuccess = (data)=>{
    setStudentData(data);
    setStudentToEnterDetails(false)
    // setStudentToEnterId(false)
    setShowStudentAction(false)
    setStudentVerified(true)
    // setVerifyCertificate(false)
    navigate('/certificate',{state:{student:data}});
  }

  const showCandidateToEnterId = () => {
    setStudentToEnterDetails(false)
    // setStudentToEnterId(true)
    setShowStudentAction(false)
    setStudentVerified(false)
    setVerifyCertificate(false)
  }

  const showCandidateVerify = () => {
    setStudentToEnterDetails(false)
    // setStudentToEnterId(false)
    setShowStudentAction(false)
    setStudentVerified(false)
    setVerifyCertificate(true)
  }

  return (
    <>
      <Navbar />
      {showStudentActions && <CertificateHomePage showCandidateToEnterDetails={showCandidateToEnterDetails} showCandidateToEnterId={showCandidateToEnterId} />}
      {studentToEnterDetails && <StudentLogin handleStudentLoginSuccess={handleStudentLoginSuccess}/>}
      {studentVerified && studentData && <StudentCertificate />}
      {/* {studentToEnterId && <StudentVerify showCandidateVerify={showCandidateVerify} />} */}
      {verifyCertificate && <CertificateVerified />}
    </>
  )
}

export default LandingPage