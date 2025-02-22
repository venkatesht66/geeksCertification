import React from 'react'

const StudentVerify = ({showCandidateVerify}) => {

  return (
    <div className="studentLoginForm">
        <h1 className='formHeading'>Verify Certificate</h1>
        <div>
            <label htmlFor="" className='labelText'>Certificate ID : </label>
            <input type="text" />
        </div>
        <button className='getCertificateBtn' onClick={showCandidateVerify}>Verify Certificate</button>
    </div>
  )
}

export default StudentVerify