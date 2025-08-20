import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Table, Button } from 'react-bootstrap';
import { FaTasks, FaUserCheck, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]); // Changed from bookings
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchMyTasks = async () => {
        if (!user) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/tasks/mytasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data);
        } catch (err) {
            console.log(err)
            setError('Failed to fetch your assigned tasks.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        setLoading(true);
        fetchMyTasks();
    }, [user]);

    const handleCompleteTask = async (taskId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/tasks/${taskId}/complete`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Task marked as complete!");
            fetchMyTasks(); // Refresh list to show updated status
        } catch (error) {
            toast.error("Could not update task status.");
            console.log(error)
        }
    };

    if (loading) { /* ... (no change) ... */ }
    if (error) { /* ... (no change) ... */ }

    return (
        <Container className="py-5 employee-dashboard">
            <h1 className="text-center mb-5">Employee Dashboard</h1>
            <Row className="mb-4 g-4">
                <Col md={12}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                           {/* ... (Profile Card - no change) ... */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="shadow-sm">
                        <Card.Header as="h5" className="d-flex align-items-center">
                            <FaTasks className="me-2" /> Your Assigned Tasks
                        </Card.Header>
                        <Card.Body>
                            <Table responsive striped bordered hover className="mt-2 mb-0">
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.length > 0 ? (
                                        tasks.map(task => (
                                            <tr key={task._id} className={task.status === 'Completed' ? 'table-light text-muted' : ''}>
                                                <td style={{ textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}>
                                                    {task.description}
                                                </td>
                                                <td>
                                                    <span className={`badge bg-${task.status === 'Completed' ? 'success' : 'warning'}`}>
                                                        {task.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="outline-success"
                                                        size="sm"
                                                        onClick={() => handleCompleteTask(task._id)}
                                                        disabled={task.status === 'Completed'}
                                                    >
                                                        <FaCheck /> Mark Complete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center text-muted py-3">You have no assigned tasks.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EmployeeDashboard;