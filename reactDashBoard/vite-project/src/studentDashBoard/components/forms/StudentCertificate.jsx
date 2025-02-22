import React from 'react'
import { useLocation } from 'react-router-dom'

const StudentCertificate = () => {

    const location = useLocation();
    const student = location.state?.student; // 👈 Retrieve student data

    if (!student) {
        return <h2>No Certificate Data Found!</h2>;
    }

    return (
        <div className="studentLoginForm">
            <h1 className='formHeading'>Course Completion Certificate</h1>
            <div className="">
                <div className='courseCompleteDetails'>
                    <label htmlFor="" className='labelText'>Name : </label>
                    <p className='labelText'>{student.studentName}</p>
                </div>
                <div className='courseCompleteDetails'>
                    <label htmlFor="" className='labelText'>Course Taken : </label>
                    <p className='labelText'>{student.studentCourseName}</p>
                </div>
                <div className='courseCompleteDetails'>
                    <label htmlFor="" className='labelText'>Certificate Id : </label>
                    <p className='labelText'>{student.certificateId}</p>
                </div>
            </div>
            <button className='getCertificateBtn'>Download Certificate</button>
        </div>
    )
}

export default StudentCertificate