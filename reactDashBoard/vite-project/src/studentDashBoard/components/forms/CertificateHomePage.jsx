
import React, { useState } from 'react'

const CertificateHomePage = ({ showCandidateToEnterDetails,showCandidateVerify }) => {

    return (
        <div className='homeContainer'>
            <h1>Welcome to the Certification Portal</h1>
            <div className="btnContainer">
            <div>
                <button className='landingBtns' onClick={showCandidateToEnterDetails}>Course Completion Certificate</button>
            </div>
            {/* <div>
                <button className='landingBtns'>Course Completion Certificate</button>
            </div> */}
            <div>
                <button className='landingBtns' onClick={showCandidateVerify}>Verify Certificate</button>
            </div>
            </div>
            
        </div>
    )
}

export default CertificateHomePage