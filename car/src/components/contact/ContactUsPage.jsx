import { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card, Spinner } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import './ContactUsPage.css';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '' 
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await axios.post('https://car-rental-system-web-application.onrender.com/api/contact', formData);

      if (response.status === 201) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setError(null);
  };

  return (
    <Container className="contact-page pt-5 ">
      <h1 className="text-center mb-5 ">Contact Us</h1>
      <Row>
        <Col lg={6} className="mb-4 bg-gradient bg-gray-100 text-dark">
          <div className="contact-info p-4 h-100">
             <h3 className="mb-4">Get in Touch</h3>
             <div className="contact-item mb-4">
               <FaEnvelope className="me-3" size={20} />
               <div>
                 <h5>Email</h5>
                 <p>mareligny@gmail.com</p>
               </div>
             </div>
             <div className="contact-item mb-4">
               <FaPhone className="me-3" size={20} />
               <div>
                 <h5>Phone</h5>
                 <p>+251 989873564</p>
               </div>
             </div>
             <div className="contact-item">
               <FaMapMarkerAlt className="me-3" size={20} />
               <div>
                 <h5>Address</h5>
                 <p>123 Rental Street, bahirdar ethiopia</p>
               </div>
             </div>
           </div>
        </Col>
        <Col lg={6}>
          {submitted ? (
            <Alert variant="success" className="text-center py-4">
              <h4>Thank You!</h4>
              <p>Your message has been sent successfully. We'll get back to you soon.</p>
              <Button variant="outline-success" onClick={handleResetForm}>
                Send Another Message
              </Button>
            </Alert>
          ) : (
            <Card className="contact-form-card p-4 bg-success-subtle">
              <h3 className="mb-4 bg-primary-subtle text-dark text-center rounded-3">Send Us a Message</h3>
              <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form.Group className="mb-3">
                  <Form.Label>Your Name</Form.Label>
                  <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required disabled={submitting} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required disabled={submitting} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} required disabled={submitting} />
                </Form.Group>

                {/* ADD THE MESSAGE TEXTAREA BACK IN */}
                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      {' '}Submitting...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </Form>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ContactUsPage;
