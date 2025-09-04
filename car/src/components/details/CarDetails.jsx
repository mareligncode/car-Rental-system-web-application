import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Card, Button, Container, ListGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import './CarDetails.css';
import { FaCar, FaGasPump, FaCogs, FaUsers, FaCalendarAlt } from 'react-icons/fa';
const CarDetails = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`https://car-rental-system-web-application.onrender.com/api/cars/${id}`);
                setCar(res.data);
            } catch (err) {
                setError('Could not find the requested car.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCarDetails();
    }, [id]);
    if (loading) {
        return <Container className="text-center py-5"><Spinner animation="border" /></Container>;
    }
    if (error || !car) {
        return (
            <Container className="py-5 text-center">
                <Alert variant="danger">{error || 'Car not found'}</Alert>
                <Link to="/browse" className="btn btn-primary mt-3">
                    Browse Available Cars
                </Link>
            </Container>
        );
    }
    return (
        <Container className="car-details py-5">
            <Row>
                <Col lg={6} className="mb-4">
                    <div className="car-image-container">
                        <img src={car.image} alt={`${car.make} ${car.model}`} className="img-fluid rounded" />
                    </div>
                </Col>
                <Col lg={6}>
                    <Card className="details-card">
                        <Card.Body>
                            <h2 className="mb-3">{car.make} {car.model}</h2>
                            <h4 className="text-primary mb-4">${car.price} <small className="text-muted">/ day</small></h4>
                            <ListGroup variant="flush" className="mb-4">
                                <ListGroup.Item className="d-flex align-items-center">
                                    <FaCar className="me-3 text-muted" />
                                    <span>Type: <strong>{car.type}</strong></span>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex align-items-center">
                                    <FaGasPump className="me-3 text-muted" />
                                    <span>Fuel: <strong>{car.fuelType}</strong></span>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex align-items-center">
                                    <FaCogs className="me-3 text-muted" />
                                    <span>Transmission: <strong>{car.transmission}</strong></span>
                                </ListGroup.Item>
                                 <ListGroup.Item className="d-flex align-items-center">
                                    <FaCogs className="me-3 text-muted" />
                                    <span>model: <strong>{car.model}</strong></span>
                                </ListGroup.Item>                         
                                <ListGroup.Item className="d-flex align-items-center">
                                    <FaUsers className="me-3 text-muted" />
                                    <span>Seats: <strong>{car.seats}</strong></span>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex align-items-center">
                                    <Badge bg={car.available ? "success" : "danger"} className="me-3">
                                        {car.available ? 'Available' : 'Not Available'}
                                    </Badge>
                                </ListGroup.Item>
                            </ListGroup>
                            {car.features && car.features.length > 0 && (
                                <div className="features-section mb-4">
                                    <h5>Features</h5>
                                    <div className="d-flex flex-wrap gap-2">
                                        {car.features.map((feature, index) => (
                                            <Badge key={index} bg="info">
                                                {feature}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="d-grid gap-2">
                                <Button
                                    as={Link}
                                    to={`/book/${car._id}`}
                                    variant="primary"
                                    size="lg"
                                    disabled={!car.available}
                                >
                                    <FaCalendarAlt className="me-2" />
                                    {car.available ? 'Book Now' : 'Currently Unavailable'}
                                </Button>
                                <Button as={Link} to="/browse" variant="outline-secondary">
                                    Back to Browse
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CarDetails;
