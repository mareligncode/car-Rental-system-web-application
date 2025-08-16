import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from 'react-bootstrap';

const AdminRoute = ({ children }) => {
    const { user } = useAuth();

    if (user === null) {
        return <div className="text-center p-5"><Spinner animation="border" /></div>;
    }

    return user && user.role === 'admin' ? children : <Navigate to="/" />;
};

export default AdminRoute;