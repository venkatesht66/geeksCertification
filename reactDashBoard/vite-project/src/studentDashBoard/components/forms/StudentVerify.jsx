import React, { useState } from "react";
import { API_URL } from '../../data/API_Path';
import Navbar from "../Navbar";

const StudentVerify = () => {
    const [certificateId, setCertificateId] = useState("");
    const [verificationResult, setVerificationResult] = useState(null);
    const [error, setError] = useState("");

    const verifyCertificate = async () => {
        if (!certificateId.trim()) {
            setError("Please enter a valid Certificate ID.");
            setVerificationResult(null);
            return;
        }

        try {
            const response = await fetch(`${API_URL}student/verify-certificate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ certificateId }),
            });

            const data = await response.json();
            console.log("API Response:", data); // 🔍 Debugging

            if (!response.ok) {
                throw new Error(data.message || "Invalid Certificate ID");
            }

            setVerificationResult(data);
            setError("");
        } catch (error) {
            setError(error.message);
            setVerificationResult(null);
        }
    };

    return (
        <>
            <Navbar />
            <div className="verifyContainer m-3">
                <h2>Verify Your Certificate</h2>
                <div className="">
                    <input
                        type="text"
                        placeholder="Enter Certificate ID"
                        value={certificateId}
                        onChange={(e) => setCertificateId(e.target.value)}
                    />
                    <br />
                    <button className="verifyBtn getCertificateBtn" onClick={verifyCertificate}>
                        Verify Certificate
                    </button>
                </div>

                {verificationResult && (
                    <div className="verificationResult m-3">
                        <h3 className="verifyColor">✅ Certificate Verified!</h3>
                        <p><strong>Student Name:</strong> {verificationResult.studentName}</p>
                        <p><strong>Course Name:</strong> {verificationResult.courseName}</p>
                        {/* <p><strong>Expire Date:</strong> {verificationResult.expireDate}</p> */}
                    </div>
                )}

                {error && <p className="error">❌ {error}</p>}
            </div>
        </>
    );
};

export default StudentVerify;