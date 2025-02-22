import React, { useState } from 'react';
import Navbar from '../Navbar';
import { API_URL } from '../../data/API_Path';

const StudentEdit = () => {
    const [studentPhone, setStudentPhone] = useState("");
    const [updates, setUpdates] = useState(null); // Initially null to hide form
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch student data when button is clicked
    const fetchStudentData = async () => {
        if (!studentPhone.trim()) {
            setError("Please enter a phone number.");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch(`${API_URL}student/admin/edit-student/${studentPhone}`);

            if (!response.ok) {
                throw new Error("Student not found");
            }

            const data = await response.json();
            // Populate form fields if student exists
            setUpdates({
                studentName: data.studentName || "",
                studentEmail: data.studentEmail || "",
                studentCourseName: data.studentCourseName || "",
                studentCourseCompleted: data.studentCourseCompleted || false
            });

            setMessage("Student data loaded successfully!");
        } catch (error) {
            setError(error.message);
            setUpdates({ studentName: "", studentEmail: "", studentCourseName: "", studentCourseCompleted: false });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdates((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        console.log("Sending data:", {
            studentPhone,
            updates: {
                studentName: updates.studentName,
                studentEmail: updates.studentEmail,
                studentCourseName: updates.studentCourseName,
                studentCourseCompleted: updates.studentCourseCompleted
            }
        });

        try {
            const response = await fetch(`${API_URL}student/admin/edit-student`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentPhone, 
                    updates
                }) // Send phone number & updates
            });

            const data = await response.json();
            console.log("Response received:", data);

            if (!response.ok) {
                throw new Error(data.message || "Update failed");
            }

            setMessage("Student Updated Successfully!");
            alert("Student Updated Successfully!");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!studentPhone) {
            alert("Please enter a phone number to delete a student.");
            return;
        }
    
        if (!window.confirm("Are you sure you want to delete this student?")) {
            return; // Cancel delete if user says no
        }
    
        try {
            const response = await fetch(`${API_URL}student/admin/delete-student`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentPhone })
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || "Deletion failed");
            }
    
            alert("Student Deleted Successfully!");
            setStudentPhone(""); // Clear input
            setUpdates({ studentName: "", studentEmail: "", studentCourseName: "", studentCourseCompleted: false });
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <>
            <Navbar />
            <div className="registerSection studentLoginForm">
                <h2 className='formHeading'>Update Student</h2>
                {/* Input for Phone Number */}
                <label className='labelText'>Student Phone:</label>
                <input type="text" value={studentPhone} onChange={(e) => setStudentPhone(e.target.value)} required /> <br />
                {/* Fetch Student Button */}
                {/* <button onClick={fetchStudentData} disabled={loading}>
                    {loading ? "Fetching..." : "Fetch Student"}
                </button> */}
                <button type="button" className='getCertificateBtn' onClick={fetchStudentData}>Show Student Details</button>
                {/* Show error if student is not found */}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {message && <p style={{ color: "green" }}>{message}</p>}
                {/* Show form only if student data is found */}
                {updates &&message && (
                    <form onSubmit={handleSubmit}>
                        <label className='labelText'>Student Name : </label>
                        <input type="text" name="studentName" value={updates.studentName} onChange={handleChange} /><br />
                        <label className='labelText'>Student Email : </label>
                        <input type="email" name="studentEmail" value={updates.studentEmail} onChange={handleChange} /><br />
                        <label className='labelText'>Course Name : </label>
                        <input type="text" name="studentCourseName" value={updates.studentCourseName} onChange={handleChange} />
                        <br />
                        <label className='labelText'>Course Completed : </label>
                        <select className='labelText' name="studentCourseCompleted" value={updates.studentCourseCompleted} onChange={(e) => setUpdates({ ...updates, studentCourseCompleted: e.target.value === "true" })}>
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select><br />
                        <button type="submit" disabled={loading} className='getCertificateBtn'>
                            {loading ? "Updating..." : "Update Student"}
                        </button>
                        <button type="button" onClick={handleDelete} className='getCertificateBtn' style={{ background: "red", color: "white" }}>
                            Delete Student
                        </button>
                    </form>
                )}
            </div>
        </>
    );
}

export default StudentEdit;