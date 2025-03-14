import React,{useState} from 'react'
import Navbar from '../Navbar'
import { API_URL } from '../../data/API_Path'

const StudentRegister = () => {
    const [studentName, setStudentName] = useState("")
    const [studentEmail,setStudentEmail] = useState("")
    const [studentPhone,setStudentPhone] = useState("")
    const [studentCourseName,setStudentCourseName] = useState("")
    const [studentCourseCompleted,setStudentCourseCompleted] = useState(null)
    const [error,setError] = useState("")
    const [loading,setLoading] = useState(false)

    const token = localStorage.getItem("adminToken"); 

    if (!token) {
        setError("User is not authenticated");
        setLoading(false);
        return;
    }

    const validateForm = () => {
        if (!studentName || !studentEmail || !studentPhone || !studentCourseName || studentCourseCompleted === null) {
            setError('All fields are required');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(studentEmail)) {
            setError('Invalid email format');
            return false;
        }
        if (!/^\d{10}$/.test(studentPhone)) {
            setError('Phone number must be 10 digits');
            return false;
        }
        return true;
    };

    const handleSubmit = async(event)=>{
        event.preventDefault();
        setError("")

        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}admin/register-student`,{
                method : 'POST',
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${token}` 
                },
                body:JSON.stringify({studentName,studentEmail,studentPhone,studentCourseName,studentCourseCompleted})
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Registration failed');
            if (response.ok){
                console.log(data);
                setStudentName("");
                setStudentEmail("");
                setStudentPhone("");
                setStudentCourseName("");
                setStudentCourseCompleted(null);
                alert("Student Registered Successfully");
            }
        } catch (error) {
            console.error("Registeration Failed : ",error);
        }finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Navbar />
            <div className="registerSection studentLoginForm">
                <h2 className='formHeading'>Enter Student Details</h2>
                {error && <p className="errorMessage">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label className='labelText'>Student Name : </label>
                    <input type='text' name='studentName' value={studentName} onChange={(e)=> setStudentName(e.target.value)} placeholder='Enter Student Name' /><br />
                    <label className='labelText'>Student Email : </label>
                    <input type='text' name='studentEmail' value={studentEmail} onChange={(e)=> setStudentEmail(e.target.value)} placeholder='Enter Student Email' /><br />
                    <label className='labelText'>Student Phone Number : </label>
                    <input type='text' name='studentPhone' value={studentPhone} onChange={(e)=> setStudentPhone(e.target.value)} placeholder='Enter Student Phone Number' /><br />
                    <label className='labelText'>Course Enrolled : </label>
                    <select name='studentCourseName' value={studentCourseName} onChange={(e)=> setStudentCourseName(e.target.value)}>
                        <option value="" disabled>Select a course</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Data Analytics">Data Analytics</option>
                        <option value="Full Stack Web Development">Full Stack Web Development</option>
                        <option value="Gen AI">Generative AI</option>
                        <option value="AWS">AWS</option>
                    </select>
                    <div>
                        <label className='labelText'>Course Status : </label>
                        <select name="studentCourseCompleted" value={studentCourseCompleted === true ? "Completed" : studentCourseCompleted === false ? "Not Completed" : ""} onChange={(e)=> setStudentCourseCompleted(e.target.value === 'Completed')}>
                            <option value="">Select Course Status</option>
                            <option value="Completed">Completed</option>
                            <option value="Not Completed">Not Completed</option>
                        </select>
                    </div>
                    <button type="submit" className='getCertificateBtn' disabled={loading}>{loading ? 'Registering...' : 'Add Student'}</button>
                </form>
            </div>
        </>

    )
}

export default StudentRegister;