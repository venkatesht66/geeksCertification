import React, { useState } from 'react';
import { API_URL } from '../../data/API_Path';
import Navbar from '../Navbar';

const StudentUpload = () => {
    const [file, setFile] = useState(null);
    const [uploadType, setUploadType] = useState("course"); // Default: Course
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        // Validate file type (Only allow .xlsx, .xls)
        if (!selectedFile.name.match(/\.(xls|xlsx)$/)) {
            setError("Invalid file type. Please upload an Excel file.");
            setFile(null);
            return;
        }

        // Validate file size (Max: 5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            setError("File size exceeds 5MB limit.");
            setFile(null);
            return;
        }

        setFile(selectedFile);
        setMessage("");
        setError("");
    };

    // Handle file upload
    const handleUpload = async () => {
        if (!file) {
            setError("Please select an Excel file.");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`${API_URL}admin/upload-excel/${uploadType}`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Upload failed.");
            }

            setMessage(`${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)} data uploaded successfully!`);
            setFile(null); // Clear file input
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="registerSection studentLoginForm">
                <h2 className='formHeading'>Upload Student Excel</h2>

                {/* Dropdown to Select Upload Type */}
                <label className='labelText'>Select Data Type:</label>
                <select value={uploadType} onChange={(e) => setUploadType(e.target.value)}>
                    <option value="course">Course Certification</option>
                    <option value="internship">Internship Certification</option>
                </select>

                {/* File Input */}
                <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />

                {/* Upload Button */}
                <button className='getCertificateBtn' onClick={handleUpload} disabled={loading}>
                    {loading ? "Uploading..." : "Upload"}
                </button>

                {/* Error & Success Messages */}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {message && <p style={{ color: "green" }}>{message}</p>}
            </div>
        </>
    );
};

export default StudentUpload;