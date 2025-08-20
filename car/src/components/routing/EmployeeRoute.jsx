// src/components/routing/EmployeeRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from 'react-bootstrap';

const EmployeeRoute = ({ children }) => {
    const { user } = useAuth();

    if (user === null) {
        return <div className="text-center p-5"><Spinner animation="border" /></div>;
    }

    // Allow access if the user is an employee OR an admin
    return user && (user.role === 'employee' || user.role === 'admin') ? children : <Navigate to="/" />;
};

export default EmployeeRoute;