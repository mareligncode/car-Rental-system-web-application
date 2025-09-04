import { useState } from 'react';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            const res = await axios.post('https://car-rental-system-web-application.onrender.com/api/auth/forgot-password', { email });
            setMessage(res.data.message || 'If an account with that email exists, a password reset link has been sent.');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <Container className="py-5" style={{ maxWidth: '500px' }}>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Forgot Password</h2>
                    <p className="text-center text-muted mb-4">
                        Enter your email address and we will send you a link to reset your password.
                    </p>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading || message}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100" disabled={loading || message}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        <Link to="/auth">Back to Login</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};
export default ForgotPassword;
