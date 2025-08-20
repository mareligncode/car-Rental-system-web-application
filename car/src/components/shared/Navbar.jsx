import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaCar, FaBars, FaTimes ,FaClipboardList } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';
import { FaCog } from 'react-icons/fa';
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand text-light" to="/">
          <FaCar className="me-2 text-light" /> RentACar
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto">
            <li  className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                to="/"
                onClick={() => setIsOpen(false)}
                id="home"
              >
                Home
              </Link>
            </li>

            {/* Show these routes only when user is logged in */}
            {user && (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/browse' ? 'active' : ''}`} 
                    to="/browse"
                    onClick={() => setIsOpen(false)}
                 id="browse" >
                    Browse Cars
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`} 
                    to="/contact"
                    onClick={() => setIsOpen(false)}
                  id="contact">
                    Contact
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/my-bookings' ? 'active' : ''}`} 
                    to="/my-bookings"
                    onClick={() => setIsOpen(false)}
                 id='booking' >
                    My History
                  </Link>
                </li>
              </>
            )}
          </ul>
          
          <div className="d-flex">
            {user ? (
              <div className="d-flex align-items-center">
                <span className="me-3 text-white">Welcome, {user.name}</span>
                <button className="btn btn-danger" onClick={logout}>Logout</button>
              </div>
            ) : (
              <Link 
                className="btn btn-outline-light" 
                to="/auth"
                onClick={() => setIsOpen(false)}
              >
                <FaUser className="me-2" /> Login/Register
              </Link>
            )}
          </div>
          <ul className="navbar-nav me-auto">
                {/* ... existing nav links ... */}
                {user && user.role === 'admin' && (
                    <li className="nav-item">
                        <Link className="nav-link" to="/admin">
                            <FaCog className="me-1" /> Admin
                        </Link>
                    </li>
                )}
                 {user && (user.role === 'employee' || user.role === 'admin') && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/employee-dashboard">
                                    <FaClipboardList className="me-1" /> Employee
                                </Link>
                            </li>
                        )}
            </ul>
        </div>
         
      </div>
          
    </nav>
  );
};

export default Navbar;