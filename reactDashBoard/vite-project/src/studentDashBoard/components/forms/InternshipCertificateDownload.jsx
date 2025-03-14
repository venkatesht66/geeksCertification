import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar";

const StudentCertificate = () => {
    const location = useLocation();
    const student = location.state?.student;

    if (!student || !student.studentName || !student.studentCourseName) {
        return <h2>No Certificate Data Found!</h2>;
    }

    const handleDownloadCertificate = () => {
        // Assuming the backend provides a certificate download URL
        if (student.certificateUrl) {
            window.open(student.certificateUrl, "_blank");
        } else {
            alert("Certificate download is not available.");
        }
    };

    return (
        <>
        <Navbar/>
        <div className="studentLoginForm">
            <h1 className="formHeading">Internship Completion Certificate</h1>
            <div className="">
                <div className="courseCompleteDetails">
                    <label className="labelText">Name  : </label>
                    <p className="labelText">{student.studentName}</p>
                </div>
                <div className="courseCompleteDetails">
                    <label className="labelText">Course Taken  : </label>
                    <p className="labelText">{student.studentCourseName}</p>
                </div>
                <div className="courseCompleteDetails">
                    <label className="labelText">Certificate Id  : </label>
                    <p className="labelText">{student.certificateId}</p>
                </div>
                <div className="courseCompleteDetails">
                    <label className="labelText">Valid Until  : </label>
                    <p className="labelText">{student.expiryDate}</p>
                </div>
            </div>
            <button className="getCertificateBtn" onClick={handleDownloadCertificate}>
                Download Certificate
            </button>
        </div>
        </>
        
    );
};

export default StudentCertificate;