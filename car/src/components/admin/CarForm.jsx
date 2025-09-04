import { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
const CarForm = ({ selectedCar, onSuccess }) => {
    const [formData, setFormData] = useState({
        make: '',
         model: '',
          year: '',
           type: 'Sedan',
            seats: '5',
             price: '',
        transmission: 'Automatic',
         fuelType: 'Gasoline',
          features: ''
    });
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (selectedCar) {
            setFormData({
                ...selectedCar,
                features: selectedCar.features.join(', ')
            });
        } else {
            setFormData({
                make: '',
                 model: '',
                  year: '',
                   type: 'Sedan',
                    seats: '5',
                     price: '',
                transmission: 'Automatic', 
                fuelType: 'Gasoline',
                 features: ''
            });
        }
    }, [selectedCar]);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!file && !selectedCar) {
        setError('An image is required when adding a new car.');
        setLoading(false);
        return;
    }
    const submissionData = new FormData();
    for (const key in formData) {
        submissionData.append(key, formData[key]);
    }
    if (file) {
        submissionData.append('image', file);
    }
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    try {
        if (selectedCar) {
            await axios.put(`https://car-rental-system-web-application.onrender.com/api/cars/${selectedCar._id}`, submissionData, config);
        } else {
            await axios.post('https://car-rental-system-web-application.onrender.com/api/cars', submissionData, config);
        }
        onSuccess();
        setFormData({ make: '', model: '', year: '', type: 'Sedan', seats: '5', price: '', transmission: 'Automatic', fuelType: 'Gasoline', features: '' });
        setFile(null);
        e.target.reset();
    } catch (err) {
        setError(err.response?.data?.error || 'An unexpected error occurred.');
        console.error(err.response);
    } finally {
        setLoading(false);
    }
};

    return (
        <Form onSubmit={handleSubmit} noValidate>
            {error && <Alert variant="danger">{error}</Alert>}
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-2">
                        <Form.Control name="make" value={formData.make} onChange={handleChange} placeholder="e.g. Toyota" required />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-2">
                        <Form.Control name="model" value={formData.model} onChange={handleChange} placeholder="Model e.g., Camry" required />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-2">
                        <Form.Control name="year" value={formData.year} type="number" onChange={handleChange} placeholder="Year" required min="1990" />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-2">
                        <Form.Control name="price" value={formData.price} type="number" onChange={handleChange} placeholder="Price/day" required min="1" />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-2">
                        <Form.Label>Type</Form.Label>
                        <Form.Select name="type" value={formData.type} onChange={handleChange}>
                            <option>Sedan</option> <option>SUV</option> <option>Truck</option>
                            <option>Luxury</option> <option>Electric</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                 <Col md={6}>
                    <Form.Group className="mb-2">
                        <Form.Label>Seats</Form.Label>
                        <Form.Select name="seats" value={formData.seats} onChange={handleChange}>
                            <option>2</option> <option>3</option> <option>5</option> <option>7</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group className="mb-2">
                <Form.Label>Car Image</Form.Label>
                <Form.Control type="file" name="image" onChange={handleFileChange} required={!selectedCar} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Features</Form.Label>
                <Form.Control name="features" value={formData.features} onChange={handleChange} placeholder="Bluetooth, Backup Camera..." />
                <Form.Text>Separate features with a comma.</Form.Text>
            </Form.Group>

            <Button type="submit" className="w-100" disabled={loading}>
                {loading ? 'Submitting...' : (selectedCar ? 'Update Car' : 'Add Car')}
            </Button>
        </Form>
    );
};

export default CarForm;
