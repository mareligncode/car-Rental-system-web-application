import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const EmployeeForm = ({ onEmployeeAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        workplace: 'Main Office', // Set a default value for the dropdown
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            await axios.post('https://car-rental-system-web-application.onrender.com/api/employees', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Employee added successfully!');
            onEmployeeAdded(); // This function (passed from AdminDashboard) refreshes the employee list
            setFormData({ name: '', email: '', password: '', workplace: 'Main Office' }); // Reset form after submission
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to add employee. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit} noValidate>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-2">
                <Form.Control
                    type="text"
                    placeholder="Employee Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-2">
                <Form.Control
                    type="email"
                    placeholder="Employee Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-2">
                <Form.Control
                    type="password"
                    placeholder="Temporary Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="8"
                />
                 <Form.Text className="text-muted">
                    Must be at least 8 characters.
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Assign Workplace</Form.Label>
                <Form.Select
                    name="workplace"
                    value={formData.workplace}
                    onChange={handleChange}
                >
                    <option value="Main Office">Main Office</option>
                    <option value="Airport Branch">Airport Branch</option>
                    <option value="Downtown Station">Downtown Station</option>
                    <option value="Westside Garage">Westside Garage</option>
                </Form.Select>
            </Form.Group>

            <Button type="submit" className="w-100" disabled={loading}>
                {loading ? 'Adding Employee...' : 'Add Employee'}
            </Button>
        </Form>
    );
};

export default EmployeeForm;
