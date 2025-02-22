
import React, { useState } from 'react'

const CertificateHomePage = ({ showCandidateToEnterDetails,showCandidateToEnterId }) => {

    return (
        <div className='btnContainer'>
            <div>
                <button className='landingBtns' onClick={showCandidateToEnterDetails}>Course Completion Certificate</button>
            </div>
            {/* <div>
                <button className='landingBtns'>Course Completion Certificate</button>
            </div> */}
            <div>
                <button className='landingBtns' onClick={showCandidateToEnterId}>Verify Certificate</button>
            </div>
        </div>
    )
}

export default CertificateHomePage