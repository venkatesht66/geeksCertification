import React,{useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar.jsx';

const AdminPanel = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");  // Remove token
        window.location.href = "/admin/login";  // Redirect to login
    };

    return (
        <>
            <Navbar />
            <div className="adminPanel">
                <h2 className="formHeading">Admin Panel</h2>
                <button onClick={handleLogout} className='logoutBtn'>Logout</button>
                <div className="btnContainer">
                    <div className="">
                        <button className="landingBtns" onClick={() => navigate('/admin/upload-excel')}>
                            Upload Excel Sheet
                        </button>
                    </div>
                    <div className="">
                        <button className="landingBtns" onClick={() => navigate('/admin/register-student')}>
                            Register Student
                        </button>
                    </div>
                    <div className="">
                        <button className="landingBtns" onClick={() => navigate('/admin/edit-student')}>
                            Edit Existing Student
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminPanel;