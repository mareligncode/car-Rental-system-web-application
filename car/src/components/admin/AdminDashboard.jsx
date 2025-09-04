// import { useState, useEffect } from 'react';
// import { Container, Row, Col, Card } from 'react-bootstrap';
// import axios from 'axios';
// import CarForm from './CarForm';
// import CarList from './CarList';
// import NotificationBell from './NotificationBell'; 
// const AdminDashboard = () => {
//     const [cars, setCars] = useState([]);
//     const [selectedCar, setSelectedCar] = useState(null);


//     const fetchCars = async () => {
//         try {
//             const res = await axios.get('https://car-rental-system-web-application.onrender.com/api/cars');
//             setCars(res.data);
//         } catch (error) {
//             console.error("Failed to fetch cars:", error);
//         }
//     };
//    useEffect(() => {
//         fetchCars();
//     }, []);
//     const handleSuccess = () => {
//         fetchCars();
//         setSelectedCar(null);
//     };
//     return (
//         <Container className="py-5">
//             <h1 className="text-center mb-5">Admin Dashboard</h1>
//             <div className="d-flex justify-content-between align-items-center mb-5">
//                 <h3 className="mb-0">notfication center</h3>
//                 <NotificationBell /> 
//             </div>
//             <Row>
//                 <Col md={4}>
//                     <Card>
//                         <Card.Header>{selectedCar ? 'Edit Car' : 'Add New Car'}</Card.Header>
//                         <Card.Body>
//                             <CarForm
//                                 selectedCar={selectedCar}
//                                 onSuccess={handleSuccess}
//                             />
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col md={8}>
//                     <CarList
//                         cars={cars}
//                         onEdit={setSelectedCar}
//                         onDelete={handleSuccess}
//                     />
//                 </Col>
//             </Row>
//         </Container>
//     );
// };

// export default AdminDashboard;
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Table, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

import CarForm from './CarForm';
import CarList from './CarList';
import EmployeeForm from './EmployeeForm';
import EmployeeList from './EmployeeList';
import NotificationBell from './NotificationBell';
import TaskForm from './TaskForm'; 

const AdminDashboard = () => {
    const [cars, setCars] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [tasks, setTasks] = useState([]); // State for the new task data
    const [selectedCar, setSelectedCar] = useState(null); // For editing cars
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const fetchCars = async () => {
        try {
            const res = await axios.get('https://car-rental-system-web-application.onrender.com/api/cars');
            setCars(res.data);
        } catch (error) {
            console.error("Failed to fetch cars:", error);
            setError('Could not load car data. Please refresh the page.');
        }
    };

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('https://car-rental-system-web-application.onrender.com/api/employees', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(res.data);
        } catch (error) {
            console.error("Failed to fetch employees:", error);
            toast.error("Could not refresh employee list.");
        }
    };

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('https://car-rental-system-web-application.onrender.com/api/tasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            toast.error("Could not load task list.");
        }
    };
   
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            setError('');
            await Promise.all([fetchCars(), fetchEmployees(), fetchTasks()]);
            setLoading(false);
        };
        loadInitialData();
    }, []); 
    const handleCarSuccess = () => {
        fetchCars(); 
        setSelectedCar(null);
    };

    const handleTaskAdded = () => {
        fetchTasks(); 
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task? This cannot be undone.")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`https://car-rental-system-web-application.onrender.com/api/tasks/${taskId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.warn("Task deleted.");
                fetchTasks(); 
            } catch (error) {
                console.log(error)
                toast.error("Failed to delete the task.");
            }
        }
    };

    if (loading) {
        return <Container className="text-center py-5"><Spinner animation="border" /></Container>;
    }

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1 className="mb-0">Admin Dashboard</h1>
                <NotificationBell />
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {/* --- Car Management Section --- */}
            <h2 className="mb-3">Car Management</h2>
            <Row className="mb-5">
                <Col md={4}><Card className="shadow-sm"><Card.Header as="h5">{selectedCar ? 'Edit Car' : 'Add New Car'}</Card.Header><Card.Body><CarForm selectedCar={selectedCar} onSuccess={handleCarSuccess} /></Card.Body></Card></Col>
                <Col md={8}><CarList cars={cars} onEdit={setSelectedCar} onDelete={handleCarSuccess} /></Col>
            </Row>

            <hr className="my-5" />

            {/* --- Employee Management Section --- */}
            <h2 className="mb-3">Employee Management</h2>
            <Row className="mb-5">
                <Col md={4}><Card className="shadow-sm"><Card.Header as="h5">Add New Employee</Card.Header><Card.Body><EmployeeForm onEmployeeAdded={fetchEmployees} /></Card.Body></Card></Col>
                <Col md={8}><EmployeeList employees={employees} onEmployeeDeleted={fetchEmployees} /></Col>
            </Row>
            
            <hr className="my-5" />

            {/* --- Task Management Section (NEW) --- */}
            <h2 className="mb-3">Task Management</h2>
            <Row>
                <Col>
                    <Card className="shadow-sm mb-4">
                        <Card.Header as="h5">Assign New Task</Card.Header>
                        <Card.Body>
                            <TaskForm employees={employees} onTaskAdded={handleTaskAdded} />
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm">
                        <Card.Header as="h5">All Assigned Tasks</Card.Header>
                        <Card.Body>
                            <div className="table-responsive">
                                <Table striped bordered hover>
                                    <thead><tr><th>Description</th><th>Assigned To</th><th>Status</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {tasks.length > 0 ? tasks.map(task => (
                                            <tr key={task._id} className={task.status === 'Completed' ? 'table-secondary' : ''}>
                                                <td style={{ textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}>{task.description}</td>
                                                <td>{task.assignedTo?.name || 'Unassigned'}</td>
                                                <td><span className={`badge bg-${task.status === 'Completed' ? 'success' : 'warning'}`}>{task.status}</span></td>
                                                <td><Button variant="outline-danger" size="sm" onClick={() => handleDeleteTask(task._id)}><FaTrash /></Button></td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="4" className="text-center text-muted">No tasks have been assigned yet.</td></tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;
