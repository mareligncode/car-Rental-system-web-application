import { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const TaskForm = ({ employees, onTaskAdded }) => {
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description || !assignedTo) {
            return toast.error("Please fill out all fields.");
        }
        try {
            const token = localStorage.getItem('token');
            const taskData = { description, assignedTo };
            await axios.post('http://localhost:5000/api/tasks', taskData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Task assigned successfully!");
            setDescription('');
            setAssignedTo('');
            onTaskAdded(); 
        } catch (error) {
            toast.error(error.response?.data?.msg || "Failed to assign task.");
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col md={12} className="mb-2">
                    <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Enter new task description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Col>
                <Col md={7}>
                     <Form.Select
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                    >
                        <option value="">Assign to employee...</option>
                        {employees.map(emp => (
                            <option key={emp._id} value={emp._id}>{emp.name}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={5}>
                    <Button type="submit" className="w-100">Assign Task</Button>
                </Col>
            </Row>
        </Form>
    );
};

export default TaskForm;