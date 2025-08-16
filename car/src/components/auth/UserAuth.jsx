import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Tab, Tabs, Form, Button, Container, Alert } from 'react-bootstrap';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './UserAuth.css';
const UserAuth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/');
    } else {
      setErrors({ general: result.error });
    }
    setLoading(false);
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password);
    if (result.success) {
      navigate('/');
    } else {
        setErrors({ general: result.error });
    }
    setLoading(false);
  };
  return (
    <Container className="auth-page py-5">
      <div className="auth-container mx-auto">
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => {
            setActiveTab(k);
            setErrors({}); 
          }}
          className="mb-4"
        >
          <Tab eventKey="login" title="Login">
            <h2 className="text-center mb-4">Login to Your Account</h2>
            {errors.general && <Alert variant="danger">{errors.general}</Alert>}
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaEnvelope />
                  </span>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    required
                  />
                </div>
                {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaLock />
                  </span>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    required
                  />
                </div>
                {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
               <div className="text-center mt-3">
                  <Link to='/forgot-password'>Forgot password?</Link>
              </div>
            </Form>
          </Tab>
          <Tab eventKey="register" title="Register">
            <h2 className="text-center mb-4">Create an Account</h2>
            {errors.general && <Alert variant="danger">{errors.general}</Alert>}
            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaUser />
                  </span>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                    required
                  />
                </div>
                {errors.name && <Form.Text className="text-danger">{errors.name}</Form.Text>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaEnvelope />
                  </span>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    required
                  />
                </div>
                {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaLock />
                  </span>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    required
                    minLength={8}
                  />
                </div>
                {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
                <Form.Text className="text-muted text-warning">
                  <p className='text-warning'>Password must be at least 8 characters must contain upper case lowercase number and symbole
                  </p>
                </Form.Text>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
                  {/* This is the updated block */}
              <div className="text-center mt-3">
                  <Link to='/forgot-password'>Forgot password?</Link>
              </div>
            </Form>
          </Tab>
        </Tabs>
      </div>
    </Container>
  );
};

export default UserAuth;