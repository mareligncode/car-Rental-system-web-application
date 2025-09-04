import { Table, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const EmployeeList = ({ employees, onEmployeeDeleted }) => {
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to permanently delete this employee?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`https://car-rental-system-web-application.onrender.com/api/employees/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.warn('Employee has been deleted.');
                onEmployeeDeleted(); 
            } catch (err) {
                console.log(err)
                toast.error('Failed to delete employee.');
            }
        }
    };

    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Workplace</th> {/* The new column header */}
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {employees.map((employee) => (
                    <tr key={employee._id}>
                        <td>{employee.name}</td>
                        <td>{employee.email}</td>
                        <td>
                            <span className="badge bg-secondary">{employee.workplace}</span> {/* The new data cell */}
                        </td>
                        <td>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(employee._id)}>
                                <FaTrash />
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default EmployeeList;
