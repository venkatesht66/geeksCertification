import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar.jsx';
import StudentLogin from './StudentLogin.jsx';
import StudentCertificate from './StudentCertificate.jsx';
import InternshipCertificateLogin from './InternshipCertificateLogin.jsx';

const StudentPanel = () => {
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [showInternshipLogin, setShowInternshipLogin] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);

    // Handle successful Course Certificate login
    const handleStudentLoginSuccess = (data) => {
        setStudentData(data);
        setShowLogin(false); // Hide login form
        setShowInternshipLogin(false); // Ensure only one login is shown at a time
        setShowCertificate(true); // Show certificate
        console.log("Course Student Data Set:", data);
    };

    // Handle successful Internship Certificate login
    const handleInternshipLoginSuccess = (data) => {
        setStudentData(data);
        setShowInternshipLogin(false); // Hide login form
        setShowLogin(false); // Ensure only one login is shown at a time
        setShowCertificate(true); // Show certificate
        console.log("Internship Student Data Set:", data);
    };


    return (
        <>
            <Navbar />
            <div className="adminPanel">
                <h2 className="formHeading">Student Panel</h2>
                <div className="btnContainer">
                    <div className="">
                        <button className="landingBtns" onClick={() => navigate('/student/course-login')}>
                            Course Completion Certificate
                        </button>
                    </div>
                    <div className="">
                        <button className="landingBtns" onClick={() => navigate('/student/internship-login')}>
                            Internship Certificate
                        </button>
                    </div>
                    <div className="">
                        <button className="landingBtns" onClick={() => navigate('/student/verify-certificate')}>
                            Verify Certificate
                        </button>
                    </div>
                </div>
                
                {showLogin && <StudentLogin handleStudentLoginSuccess={handleStudentLoginSuccess} />}
                {showInternshipLogin && !studentData && (
                    <InternshipCertificateLogin handleInternshipLoginSuccess={handleInternshipLoginSuccess} />
                )}
                {showCertificate && studentData && <StudentCertificate student={studentData} />}
            </div>
        </>
    );
};

export default StudentPanel;