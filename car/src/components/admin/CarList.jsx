import { Table, Button, Image } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
const CarList = ({ cars, onEdit, onDelete }) => {
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this car?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/cars/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                onDelete();
            } catch (err) {
                console.error('Failed to delete car:', err);
            }
        }
    };
    return (
        <Table responsive striped bordered hover>
            <thead className='bg-dark text-light'>
                <tr>
                    <th>Image</th>
                    <th>Make & Model</th>
                    <th>Price</th>
                    <th>id</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {cars.map((car) => (
                    <tr key={car._id}>
                        <td><Image src={car.image} alt={car.make} width={100} thumbnail /></td>
                        <td>{car.make} {car.model}</td>
                        <td>${car.price}</td>
                        <td>{car._id}</td>
                        <td>
                            <Button variant="info" size="sm" className="me-2" onClick={() => onEdit(car)}>
                                <FaEdit />
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(car._id)}>
                                <FaTrash />
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default CarList;