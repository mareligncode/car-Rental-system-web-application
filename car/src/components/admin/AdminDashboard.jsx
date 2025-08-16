import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import CarForm from './CarForm';
import CarList from './CarList';
import NotificationBell from './NotificationBell'; 
const AdminDashboard = () => {
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);


    const fetchCars = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/cars');
            setCars(res.data);
        } catch (error) {
            console.error("Failed to fetch cars:", error);
        }
    };
   useEffect(() => {
        fetchCars();
    }, []);
    const handleSuccess = () => {
        fetchCars();
        setSelectedCar(null);
    };
    return (
        <Container className="py-5">
            <h1 className="text-center mb-5">Admin Dashboard</h1>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h3 className="mb-0">notfication center</h3>
                <NotificationBell /> 
            </div>
            <Row>
                <Col md={4}>
                    <Card>
                        <Card.Header>{selectedCar ? 'Edit Car' : 'Add New Car'}</Card.Header>
                        <Card.Body>
                            <CarForm
                                selectedCar={selectedCar}
                                onSuccess={handleSuccess}
                            />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <CarList
                        cars={cars}
                        onEdit={setSelectedCar}
                        onDelete={handleSuccess}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;