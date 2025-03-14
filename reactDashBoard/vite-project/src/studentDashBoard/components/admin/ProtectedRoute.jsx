import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const isAdminLoggedIn = localStorage.getItem("adminToken"); // Check if admin is logged in

    return isAdminLoggedIn ? children : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;