
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, Button, Container, Card, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import { FaTrash, FaCar, FaCalendarPlus ,FaFileInvoice} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { useAuth } from '../../context/AuthContext';
import './MyBookings.css';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  // State for modals and actions
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newEndDate, setNewEndDate] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchMyBookings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
     
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get('http://localhost:5000/api/bookings/my-bookings', config);
      setBookings(res.data || []);
    } catch (err) {
      setError('Failed to fetch your bookings. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tx_ref') && params.get('status') === 'success') {
        toast.success("Payment successful! Your booking is confirmed.");
        // Clean the URL to avoid showing the toast on every refresh
        window.history.replaceState(null, '', '/my-bookings');
    }

    fetchMyBookings();
  }, [user, location.search]);

 
  const handleShowCancelModal = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleShowExtendModal = (booking) => {
    setSelectedBooking(booking);
    const currentEndDate = booking.isExtended ? new Date(booking.extendedEndDate) : new Date(booking.endDate);
    // Set initial new end date to one day after current end date
    setNewEndDate(new Date(new Date(currentEndDate).setDate(currentEndDate.getDate() + 1)));
    setShowExtendModal(true);
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    setIsActionLoading(true);
    try {
        const token = localStorage.getItem('token');
        const res = await axios.patch(`http://localhost:5000/api/bookings/${selectedBooking._id}/cancel`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        toast.info(res.data.message);
        fetchMyBookings(); 
    } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to cancel booking.');
    } finally {
        setIsActionLoading(false);
        setShowCancelModal(false);
    }
  };

  const handleExtendBooking = async () => {
    if (!selectedBooking || !newEndDate) return;
    setIsActionLoading(true);
    try {
        const token = localStorage.getItem('token');
        const res = await axios.post(`http://localhost:5000/api/payment/initialize-extension/${selectedBooking._id}`,
            { newEndDate },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.checkout_url) {
            window.location.href = res.data.checkout_url;
        }
    } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to start extension process.');
        setIsActionLoading(false); 
    } finally {
        setShowExtendModal(false);
    }
  };


  if (!user) {
    return (
      <Container className="my-bookings py-5 text-center">
        <Alert variant="warning">Please login to view your bookings.</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-bookings py-5">
      <h1 className="mb-4">My Bookings</h1>

      {(!bookings || bookings.length === 0) ? (
        <Card className="text-center py-5">
          <FaCar size={48} className="mb-3 text-muted mx-auto" />
          <h4>No bookings found</h4>
          <p className="text-muted">You haven't made any bookings yet.</p>
          <Button href="/browse" variant="primary" className="mt-3">
            Browse Cars
          </Button>
        </Card>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Car</th>
                <th>Rental Dates</th>
                <th>Total Price</th>
                {/* <th>Status</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                if (!booking.car) {
                  return (
                    <tr key={booking._id} className="table-danger">
                      <td colSpan="5">
                        This booking is for a car that is no longer in our system. (Booking ID: {booking._id})
                      </td>
                    </tr>
                  );
                }
                const isCancelled = booking.status === 'Cancelled';
                const endDate = booking.isExtended ? new Date(booking.extendedEndDate) : new Date(booking.endDate);
                
                return (
                  <tr key={booking._id} className={isCancelled ? 'cancelled-booking' : ''}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={booking.car.image}
                          alt={`${booking.car.make} ${booking.car.model}`}
                          className="booking-car-image me-3"
                        />
                        <div>
                          <strong>
                            {booking.car.make} {booking.car.model}
                          </strong>
                        </div>
                      </div>
                    </td>
                    <td>
                      {new Date(booking.startDate).toLocaleDateString()} -{' '}
                      {endDate.toLocaleDateString()}
                       {isCancelled && (
                        <div className="text-danger small mt-1">
                          Cancelled on: {new Date(booking.cancellationDetails.cancelledOn).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td>
                        ${booking.totalPrice.toFixed(2)}
                        {isCancelled && (
                          <div className="text-danger small mt-1">
                            Refund: ${booking.cancellationDetails.refundAmount.toFixed(2)} ({booking.cancellationDetails.refundStatus})
                          </div>
                        )}
                    </td>
                    {/* <td>
                      <span
                        className={`badge ${
                          booking.status === 'Confirmed' ? 'bg-success' :
                          booking.status === 'Pending' ? 'bg-warning' :
                          booking.status === 'Extended' ? 'bg-info' :
                          'bg-secondary'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td> */}
                    {/* <td>
                      {booking.status === 'Confirmed' || booking.status === 'Extended' ? (
                          <>
                            <Button variant="outline-danger" size="sm" className="me-2 mb-1" onClick={() => handleShowCancelModal(booking)}>
                                <FaTrash className="me-1" /> Cancel
                            </Button>
                            <Button variant="outline-primary" size="sm" className="mb-1" onClick={() => handleShowExtendModal(booking)}>
                                <FaCalendarPlus className="me-1" /> Extend
                            </Button>
                          </>
                      ) : (
                         <span className="text-muted small">No actions available</span>
                      )}
                    </td> */}
                    <td>
  <div className="d-flex flex-wrap">

    {/* NEW: The Receipt Button is added here for every booking */}
    <Button 
        as={Link} 
        to={`/booking-receipt/${booking._id}`} 
        variant="outline-success" 
        size="sm" 
        className="me-2 mb-1"
    >
      <FaFileInvoice className="me-1" /> Receipt
    </Button>

    {/* KEPT: Your original logic for showing Cancel/Extend buttons is still here */}
    {(booking.status === 'Confirmed' || booking.status === 'Extended') && (
      <>
        <Button variant="outline-danger" size="sm" className="me-2 mb-1" onClick={() => handleShowCancelModal(booking)}>
          <FaTrash className="me-1" /> Cancel
        </Button>
        <Button variant="outline-primary" size="sm" className="mb-1" onClick={() => handleShowExtendModal(booking)}>
          <FaCalendarPlus className="me-1" /> Extend
        </Button>
      </>
    )}

    {/* KEPT: Your original logic for showing a message on cancelled bookings */}
    {isCancelled && (
      <span className="text-muted small">No actions available</span>
    )}
    
  </div>
</td>
                    
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}

      {/* --- Cancel Booking Modal --- */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to cancel this booking?</p>
          <p>A refund request for <strong>50%</strong> of the total price will be submitted.</p>
          <Alert variant="info">
            <strong>Refund Amount: ${(selectedBooking?.totalPrice * 0.5).toFixed(2)}</strong>
            <hr/>
            <small className="mb-0">Please note: The refund will be processed by an administrator and may take a few business days.</small>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)} disabled={isActionLoading}>
            Close
          </Button>
          <Button variant="danger" onClick={handleCancelBooking} disabled={isActionLoading}>
            {isActionLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Yes, Cancel Booking'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- Extend Booking Modal --- */}
      <Modal show={showExtendModal} onHide={() => setShowExtendModal(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Extend Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>Select a new end date. A <strong>5% daily penalty</strong> will be applied to the additional days.</p>
            <Form.Group>
                <Form.Label>New End Date</Form.Label>
                <DatePicker
                    selected={newEndDate}
                    onChange={(date) => setNewEndDate(date)}
                    minDate={new Date(new Date(selectedBooking?.isExtended ? selectedBooking.extendedEndDate : selectedBooking?.endDate).setDate(new Date(selectedBooking?.isExtended ? selectedBooking.extendedEndDate : selectedBooking?.endDate).getDate() + 1))}
                    maxDate={new Date(new Date(selectedBooking?.isExtended ? selectedBooking.extendedEndDate : selectedBooking?.endDate).setDate(new Date(selectedBooking?.isExtended ? selectedBooking.extendedEndDate : selectedBooking?.endDate).getDate() + 20))}
                    className="form-control"
                    popperPlacement="top-end"
                />
                 <Form.Text className="text-muted">
                    You can extend for a maximum of 20 days.
                </Form.Text>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowExtendModal(false)} disabled={isActionLoading}>
                Close
            </Button>
            <Button variant="primary" onClick={handleExtendBooking} disabled={isActionLoading}>
                {isActionLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Proceed to Payment'}
            </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyBookings;