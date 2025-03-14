import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import AdminPanel from './studentDashBoard/components/admin/AdminPanel.jsx';
import StudentUpload from './studentDashBoard/components/admin/StudentUpload.jsx';
import StudentRegister from './studentDashBoard/components/admin/StudentRegister.jsx';
import StudentEdit from './studentDashBoard/components/admin/StudentEdit.jsx';
import StudentPanel from "./studentDashBoard/components/forms/StudentPanel";
import StudentLogin from "./studentDashBoard/components/forms/StudentLogin.jsx";
import InternshipCertificateLogin from "./studentDashBoard/components/forms/InternshipCertificateLogin.jsx";
import StudentVerify from "./studentDashBoard/components/forms/StudentVerify.jsx";
import StudentCertificate from './studentDashBoard/components/forms/StudentCertificate.jsx';
import AdminLogin from './studentDashBoard/components/admin/AdminLogin.jsx';
import ProtectedRoute from './studentDashBoard/components/admin/ProtectedRoute.jsx';
import InternshipCertificateDownload from './studentDashBoard/components/forms/InternshipCertificateDownload.jsx' 

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        <Route path="/admin/upload-excel" element={<ProtectedRoute><StudentUpload /></ProtectedRoute>} />
        <Route path="/admin/register-student" element={<ProtectedRoute><StudentRegister /></ProtectedRoute>} />
        <Route path="/admin/edit-student" element={<ProtectedRoute><StudentEdit /></ProtectedRoute>} />
        <Route path="/student" element={<StudentPanel />} />
        <Route path="/student/course-login" element={<StudentLogin />} />
        <Route path="/student/internship-login" element={<InternshipCertificateLogin />} />
        <Route path="/student/verify-certificate" element={<StudentVerify />} />
        <Route path="/certificate" element={<StudentCertificate />} />
        <Route path="/admin/login" element={<AdminLogin/>}/>
        <Route path="/student/internship-certificate" element={<InternshipCertificateDownload/>} />
      </Routes>
    </div>

  )
}

export default App