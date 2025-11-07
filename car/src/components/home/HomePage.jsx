import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './HomePage.css'
import bgImage1 from '../../assets/images/Yellow and White Modern Car Rental Instagram Post.png';
// import bgImage2 from '../../assets/images/car16.webp'; 
// import bgImage3 from '../../assets/images/car6.jpg'; 
// import bgImage4 from '../../assets/images/car21.webp';
// import bgImage5 from '../../assets/images/car3.webp'; 
import bgImage6 from '../../assets/images/car20.webp'; 
const backgroundImages = [bgImage1,bgImage6];
const Homepage = () => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const nextBackground = () => {
    setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
  };

  const prevBackground = () => {
    setCurrentBgIndex((prevIndex) => (prevIndex - 1 + backgroundImages.length) % backgroundImages.length);
  };

  useEffect(() => {
    const timer = setTimeout(nextBackground, 300000); 
    return () => clearTimeout(timer);
  }, [currentBgIndex]);

  return (
    <div className="homepage">
      <section className="hero-section">
        {/* Background Image Slider */}
        <div className="background-slider">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`background-image ${index === currentBgIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>
        <div className="hero-overlay"></div>

        <Container className="hero-container">
          <Row className="align-items-center min-vh-100">
            <Col lg={7} className="hero-content">
              <h3 className="hero-title">wellcome to our rent</h3>
              <p className="hero-subtitle">
               car rental system
              </p>
            </Col>
           
          </Row>
        </Container>

        {/* Navigation Arrows */}
        <button className="nav-arrow prev-arrow" onClick={prevBackground}>
          <FaChevronLeft />
        </button>
        <button className="nav-arrow next-arrow" onClick={nextBackground}>
          <FaChevronRight />
        </button>
      </section>
    </div>
  );
};

export default Homepage;
