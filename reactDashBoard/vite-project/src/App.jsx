import React from 'react'
import LandingPage from './studentDashBoard/pages/LandingPage'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import StudentRegister from './studentDashBoard/components/forms/StudentRegister'
import StudentEdit from './studentDashBoard/components/forms/StudentEdit';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/certificates' element={<LandingPage/>}/>
        <Route path='/admin'  element={<StudentRegister/>} />
        <Route path='/admin/edit-student' element={<StudentEdit/>}/>
      </Routes>
    </div>
    
  )
}

export default App