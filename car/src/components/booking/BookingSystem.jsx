import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './BookingSystem.css';

const BookingSystem = () => {
    const { id: carId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [car, setCar] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [formData, setFormData] = useState({
        phone: '',
        address: '',
        gender: 'Male',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false); // For payment process

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await axios.get(`https://car-rental-system-web-application.onrender.com/api/cars/${carId}`);
                setCar(res.data);
            } catch (err) {
                console.log(err)
                setError('Could not find the car.');
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [carId]);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!user) {
            setError('Please login to book a car.');
            return;
        }
        if (!startDate || !endDate || !formData.phone || !formData.address) {
            setError('Please fill in all required fields.');
            return;
        }

        setSubmitting(true);

        const bookingData = {
            carId: car._id,
            startDate,
            endDate,
            ...formData,
        };

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('https://car-rental-system-web-application.onrender.com/api/payment/initialize', bookingData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Redirect to Chapa checkout page
            if (response.data.checkout_url) {
                window.location.href = response.data.checkout_url;
            }

        } catch (err) {
            setError(err.response?.data?.error || 'Booking failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Container className="text-center py-5"><Spinner animation="border" /></Container>;
    }

    if (error && !car) {
        return <Container className="text-center py-5"><Alert variant="danger">{error}</Alert></Container>;
    }

    return (
        <Container className="booking-system py-5">
            <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-4">
                <FaArrowLeft className="me-2" /> Back
            </Button>
            <Row>
                <Col lg={6} className="mb-4">
                    <Card>
                         <Card.Img variant="top" src={car.image} />
                         <Card.Body>
                             <Card.Title as="h2">{car.make} {car.model}</Card.Title>
                             <Card.Text className="text-primary h4">${car.price}/day</Card.Text>
                         </Card.Body>
                     </Card>
                </Col>

                <Col lg={6}>
                    <Card className="booking-form-card">
                        <Card.Body>
                            <h3 className="mb-4">Complete Your Booking</h3>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit} noValidate>
                                <h5 className="mb-3">User Information</h5>
                                <Form.Group className="mb-3">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control type="text" value={user ? user.name : ''}  readOnly disabled />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control type="email" value={user ? user.email : ''} readOnly disabled />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleFormChange} required placeholder="Enter your phone number" />
                                </Form.Group>
                                 <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Gender</Form.Label>
                                            <Form.Select name="gender" value={formData.gender} onChange={handleFormChange}>
                                                <option>Male</option>
                                                <option>Female</option>
                                                <option>Other</option>
                                                <option>Prefer not to say</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>Full Address</Form.Label>
                                    <Form.Control as="textarea" rows={2} name="address" value={formData.address} onChange={handleFormChange} required placeholder="Enter your full address" />
                                </Form.Group>

                                <hr />
                                <h5 className="mb-3">Rental Dates</h5>
                                 <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Pickup Date</Form.Label>
                                            <DatePicker selected={startDate} onChange={date => setStartDate(date)} minDate={new Date()} className="form-control" required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Return Date</Form.Label>
                                            <DatePicker selected={endDate} onChange={date => setEndDate(date)} minDate={startDate || new Date()} className="form-control" required />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button variant="primary" type="submit" size="lg" className="w-100 mt-3" disabled={submitting}>
                                    <FaCalendarAlt className="me-2" />
                                    {submitting ? 'Redirecting to Payment...' : 'Proceed to Payment'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default BookingSystem;
