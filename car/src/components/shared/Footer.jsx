import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-fluid"> {/* Changed from container to container-fluid */}
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5>RentACar</h5>
            <p className="">
              Providing the best car rental services since 2023. 
              We offer a wide range of vehicles for all your needs.
            </p>
          </div>
          
          {/* Rest of your footer content remains the same */}
          <div className="col-md-2 mb-4 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-decoration-none  " >Home</a></li>
              <li><a href="/browse" className="text-decoration-none ">Browse Cars</a></li>
              <li><a href="/my-bookings" className="text-decoration-none ">My Bookings</a></li>
              <li><a href="/contact" className="text-decoration-none ">Contact Us</a></li>
              <li><a href="/about" className="text-decoration-none ">About Us</a></li>
            </ul>
          </div>
          
          <div className="col-md-3 mb-4 mb-md-0 text-light">
            <h5>Contact Info</h5>
            <ul className="">
              <li>123 Rental Street</li>
              <li>Car City, CC 12345</li>
              <li>Phone: (555) 123-4567</li>
              <li>Email: marelign@gmail.com</li>
            </ul>
          </div>
          
          <div className="col-md-3">
            <h5>Follow Us</h5>
            <div className="social-icons">
              <a href="https://www.facebook.com/profile.php?id=100070214702976&mibextid=rS40aB7S9Ucbxw6v" className="text-white me-3"><FaFacebook size={20} /></a>
              <a href="" className="text-white me-3"><FaTwitter size={20} /></a>
              <a href="https://www.instagram.com/ma.y4534" className="text-white me-3"><FaInstagram size={20} /></a>
              <a href="https://www.linkedin.com/in/yared-yimer-98700a376/" className="text-white"><FaLinkedin size={20} /></a>
            </div>
          </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 ">
              &copy;2023- {new Date().getFullYear()} Marelign Yimer. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="mb-0">
              <a href="/policy" className="text-decoration-none t me-3">Privacy Policy</a>
              <a href="/terms" className="text-decoration-none ">Terms of Service</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;