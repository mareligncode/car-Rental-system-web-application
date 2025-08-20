
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { FaPrint, FaArrowLeft } from 'react-icons/fa';
import './BookingReceipt.css'; 

const BookingReceipt = () => {
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/bookings/${bookingId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBooking(res.data);
            } catch (err) {
                console.log(err)
                setError('Failed to fetch booking details. You may not be authorized to view this.');
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId]);

    const handlePrint = () => {
         window.print();
        
    };

    if (loading) {
        return <Container className="text-center py-5"><Spinner animation="border" /></Container>;
    }

    if (error) {
        return <Container className="text-center py-5"><Alert variant="danger">{error}</Alert></Container>;
    }

    if (!booking) {
        return null;
    }
    
    // Determine the correct end date to display
    const endDate = booking.isExtended ? new Date(booking.extendedEndDate) : new Date(booking.endDate);

    return (
        <Container className="receipt-container py-5">
            <div className="receipt-actions mb-4">
                <Button as={Link} to="/my-bookings" variant="secondary">
                    <FaArrowLeft className="me-2" /> Back to My Bookings
                </Button>
                <Button onClick={handlePrint} variant="primary">
                    <FaPrint className="me-2" /> Print Receipt
                </Button>
            </div>

            <Card className="receipt-card">
                <Card.Header className="bg-dark text-white text-center">
                    <h2>Booking Receipt</h2>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-4">
                        <Col>
                            <h4>RentACar</h4>
                            <p className="mb-0">Marelign Bahirdar, Car City</p>
                        </Col>
                        <Col className="text-end">
                            <p className="mb-0"><strong>Booking ID:</strong> {booking._id}</p>
                            <p className="mb-0"><strong>Date:</strong> {new Date(booking.createdAt).toLocaleDateString()}</p>
                        </Col>
                    </Row>
                    <hr />
                    <Row className="mb-4">
                        <Col md={6}>
                            <h5>Billed To:</h5>
                            <p className="mb-0">{booking.user.name}</p>
                            <p className="mb-0">{booking.user.email}</p>
                            <p className="mb-0">{booking.address}</p>
                        </Col>
                    </Row>
                    <h5>Booking Details:</h5>
                    <Card>
                        <Card.Body>
                             <Row>
                                <Col md={4}>
                                     <img src={booking.car.image} alt="Car" className="img-fluid rounded" />
                                </Col>
                                <Col md={8}>
                                    <h4>{booking.car.make} {booking.car.model}</h4>
                                    <p><strong>Rental Period:</strong> {new Date(booking.startDate).toLocaleDateString()} to {endDate.toLocaleDateString()}</p>
                                    <p><strong>Total Days:</strong> {booking.totalDays}</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <h5 className="mt-4">Payment Summary:</h5>
                    <div className="table-responsive">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>Original Booking Price</td>
                            <td className="text-end">${(booking.totalPrice - (booking.extensionHistory.reduce((acc, curr) => acc + curr.additionalCost, 0))).toFixed(2)}</td>
                          </tr>
                          {booking.extensionHistory.map((ext, index) => (
                            <tr key={index}>
                              <td>Extension Cost</td>
                              <td className="text-end">${ext.additionalCost.toFixed(2)}</td>
                            </tr>
                          ))}
                          <tr className="fw-bold">
                            <td>Total Paid</td>
                            <td className="text-end">${booking.totalPrice.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                     <div className="text-center mt-4">
                        <p className="lead">Thank you for your business!</p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default BookingReceipt;