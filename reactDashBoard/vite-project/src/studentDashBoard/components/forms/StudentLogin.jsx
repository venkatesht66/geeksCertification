import React,{useState} from 'react'
import {API_URL} from '../../data/API_Path'
import {useNavigate} from 'react-router-dom'

const StudentLogin = ({handleStudentLoginSuccess}) => {
    const [studentPhone,setStudentPhone] = useState("");
    const [studentEmail,setStudentEmail] = useState("");
    const [studentData,setStudentData] = useState(null);
    const [error,setError] = useState("");

    const validateInputs = ()=>{
        const phoneRegex = /^[0-9]{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!phoneRegex.text(studentPhone)){
            setError("Invalid Phone Number. Enter a 10-digit number.");
            return false;
        }

        if (!emailRegex.test(studentEmail)){
            setError("Invalid email format.");
            return false
        }

        setError("");
        return true
    };

    const StudentDetails = async () =>{
        try {
            const response = await fetch(`${API_URL}student/studentLogin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentEmail, studentPhone }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                navigate('/certificate', { state: { student: data } }); // 👈 Pass data via state
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error fetching student data", error);
        }
    }

    const fetchCertificateDetails = async()=>{
        if (!validateInputs()) return;

        try {
            const response = await fetch(`${API_URL}student/studentLogin`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({studentPhone,studentEmail})
            });

            const data = await response.json();

            if (!response.ok){
                throw new Error(data.message || "Error fetching student details");
            }
            setStudentData(data);
            setError("")
            StudentDetails(data);
        } catch (error) {
            setError(error.message);
            setStudentData(null);
        }
    }

    return (
        <div className='studentLoginForm'>
            <h1 className='formHeading'>Course Completion Certificate</h1>
            <div className='formInputs'>
                <div className="mb-3">
                    <label className='labelText'>Candidate Phone Number:</label>
                    <input type="text" value={studentPhone} onChange={(e)=> setStudentPhone(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className='labelText'>Candidate Email Id:</label>
                    <input type="text" value={studentEmail} onChange={(e)=>setStudentEmail(e.target.value)} />
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}
            <button className='getCertificateBtn' onClick={fetchCertificateDetails}>Get Certificate</button>
        </div>
    )
}

export default StudentLogin