import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { login } = useAuth(); 
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match.');
        }
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const res = await axios.patch(`https://car-rental-system-web-application.onrender.com/api/auth/reset-password/${token}`, { password });
            
            localStorage.setItem('token', res.data.token);
            await login(res.data.user.email, password);

            setSuccess('Password has been successfully reset! Redirecting...');
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password. The link may be invalid or expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5" style={{ maxWidth: '500px' }}>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Reset Your Password</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength="8"
                                disabled={loading || success}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading || success}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100" disabled={loading || success}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ResetPassword;
