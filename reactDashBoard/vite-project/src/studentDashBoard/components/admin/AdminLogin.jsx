import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import { API_URL } from '../../data/API_Path';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch(`${API_URL}admin/login`, { 
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
    
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("adminToken", data.token);  // Store token
                window.location.href = "/admin"; // Redirect to Admin Panel
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    // const handleLogout = () => {
    //     localStorage.removeItem("adminToken");  // Remove token
    //     window.location.href = "/admin/login";  // Redirect to login
    // };

    return (
        <>
        <Navbar/>
        <div className="loginContainer">
            <h2 className='formHeading'>Admin Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            /> <br /><br />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            /> <br />
            <button onClick={handleLogin} className='loginBtn'>Login</button>
            
            {error && <p className="errorMessage">{error}</p>}
        </div>
        </>
    );
};

export default AdminLogin;