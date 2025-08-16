import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Card, Button, Container, Spinner, Alert, Pagination } from 'react-bootstrap';
import { FaFilter, FaCar, FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import axios from 'axios';
import './BrowseCars.css';
import { useAuth } from '../../context/AuthContext';

const BrowseCars = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    type: '',
    priceRange: '',
    transmission: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 6; 

  useEffect(() => {
    const fetchCars = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/cars');
        setCars(res.data);
      } catch (err) {
        setError('Could not fetch cars from the server. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [user]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prevFilter => ({ ...prevFilter, [name]: value }));
    setCurrentPage(1); 
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilter({ type: '', priceRange: '', transmission: '' });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ms-1" />;
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="ms-1" /> 
      : <FaSortDown className="ms-1" />;
  };

  const filteredCars = useMemo(() => {
    let result = cars.filter(car => {
      const matchesSearchTerm = `${car.make} ${car.model}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = filter.type === '' || car.type === filter.type;
      const matchesTransmission = filter.transmission === '' || car.transmission === filter.transmission;
      const matchesPriceRange =
        filter.priceRange === '' ||
        (filter.priceRange === '0-50' && car.price <= 50) ||
        (filter.priceRange === '50-100' && car.price > 50 && car.price <= 100) ||
        (filter.priceRange === '100+' && car.price > 100);
      return matchesSearchTerm && matchesType && matchesTransmission && matchesPriceRange;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [cars, searchTerm, filter, sortConfig]);

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">
          Please <Link to="/auth">login</Link> to browse our fleet of cars.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return <Container className="text-center py-5"><Spinner animation="border" /></Container>;
  }

  if (error) {
    return <Container className="text-center py-5"><Alert variant="danger">{error}</Alert></Container>;
  }

  return (
    <Container className="browse-cars py-5">
      <h1 className="text-center mb-5">Browse Our Fleet</h1>
      <Row>
        <Col md={3} className="mb-4 bg-sucess-subtle">
          <Card className="filter-card">
            <Card.Body>
              <Card.Title className="d-flex align-items-center">
                <FaFilter className="me-2" /> Filters
              </Card.Title>
              <hr />
              <Form>
                <Form.Group className="mb-3" controlId="search">
                  <Form.Label><FaSearch /> Search</Form.Label>
                  <Form.Control type="text" placeholder="e.g., Toyota Camry" value={searchTerm} onChange={handleSearchChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="carType">
                  <Form.Label>Type</Form.Label>
                  <Form.Select name="type" value={filter.type} onChange={handleFilterChange}>
                    <option value="">All</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Truck">Truck</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="priceRange">
                  <Form.Label>Price Range ($/day)</Form.Label>
                  <Form.Select name="priceRange" value={filter.priceRange} onChange={handleFilterChange}>
                    <option value="">All</option>
                    <option value="0-50">$0 - $50</option>
                    <option value="50-100">$50 - $100</option>
                    <option value="100+">$100+</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-4" controlId="transmission">
                  <Form.Label>Transmission</Form.Label>
                  <Form.Select name="transmission" value={filter.transmission} onChange={handleFilterChange}>
                    <option value="">All</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </Form.Select>
                </Form.Group>
                <Button variant="secondary" className="w-100" onClick={handleResetFilters}>
                  Reset Filters
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={9}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <Button 
                variant="link" 
                onClick={() => requestSort('make')}
                className="text-decoration-none"
              >
                Sort by Make {getSortIcon('make')}
              </Button>
              <Button 
                variant="link" 
                onClick={() => requestSort('price')}
                className="text-decoration-none ms-3"
              >
                Sort by Price {getSortIcon('price')}
              </Button>
            </div>
            <div>
              Showing {indexOfFirstCar + 1}-{Math.min(indexOfLastCar, filteredCars.length)} of {filteredCars.length} cars
            </div>
          </div>
          
          <Row xs={1} md={2} lg={3} className="g-4">
            {currentCars.length > 0 ? (
              currentCars.map(car => (
                <Col key={car._id}>
                  <Card className="h-100 car-card">
                    <Card.Img variant="top" src={car.image} alt={`${car.make} ${car.model}`} />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{car.make} {car.model}</Card.Title>
                      <Card.Text className="text-primary fw-bold">${car.price}/day</Card.Text>
                      <div className="car-features mb-3">
                        <span className="badge bg-secondary me-2">{car.transmission}</span>
                        <span className="badge bg-secondary me-2">{car.seats} seats</span>
                        <span className="badge bg-secondary">{car.type}</span>
                      </div>
                      <Link to={`/cars/${car._id}`} className="btn btn-primary w-100 mt-auto">
                        View Details
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col xs={12} className="text-center py-5">
                <FaCar size={48} className="mb-3 text-muted" />
                <h4>No cars match your search criteria</h4>
                <p className="text-muted">Try adjusting your filters or search term.</p>
              </Col>
            )}
          </Row>

          {filteredCars.length > carsPerPage && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} />
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <Pagination.Item 
                    key={number} 
                    active={number === currentPage}
                    onClick={() => setCurrentPage(number)}
                  >
                    {number}
                  </Pagination.Item>
                ))}
                
                <Pagination.Next onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
              </Pagination>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BrowseCars;