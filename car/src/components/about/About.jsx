import React from 'react';
import { Link } from 'react-router-dom';
import './About.css'; 

const About = () => {
    const companyName = "car Rent Ethiopia"; 
    const foundingYear = 2025;

    return (
        <div className="about-us-page">

            <section className="about-hero">
                <div className="container">
                    <h1>About {companyName}</h1>
                    <p className="lead">
                        Your trusted partner for exploring the beautiful landscapes of Ethiopia.
                         We're more than just a car rental service; we are your gateway to adventure,
                          reliability, and unforgettable memories.
                    </p>
                </div>
            </section>

            <section className="our-story">
                <div className="container">
                    <h2>Our Story</h2>
                    <p>
                        Founded in {foundingYear} by a team of passionate students from different universities, {companyName} was born from a simple idea:
                         to make exploring the hidden gems of Ethiopia safe, accessible, 
                        and hassle-free. We saw a need for a reliable car rental service
                         that understands the unique roads and destinations of our country.
                    </p>
                </div>
            </section>

            <section className="mission-vision">
                <div className="container">
                    <div className="mission-item">
                        <h3>Our Mission</h3>
                        <p>
                            To provide a fleet of reliable, well-maintained vehicles and deliver exceptional, personalized customer service. We empower our clients to navigate Ethiopia with the utmost confidence and ease.
                        </p>
                    </div>
                    <div className="mission-item">
                        <h3>Our Vision</h3>
                        <p>
                            To be the leading and most trusted car rental agency in Ethiopia, celebrated for our commitment to quality, customer satisfaction, and the promotion of sustainable tourism across the nation.
                        </p>
                    </div>
                </div>
            </section>

            <section className="why-choose-us">
                <div className="container">
                    <h2>Why Rent With Us?</h2>
                    <ul className="values-list">
                        <li>
                            <strong>Safety First:</strong> Our fleet is rigorously inspected and regularly serviced to meet the highest safety standards. Your peace of mind is our top priority.
                        </li>
                        <li>
                            <strong>Transparent Pricing:</strong> No hidden fees or surprise charges. The price you see is the price you pay. We believe in honest and clear communication.
                        </li>
                        <li>
                            <strong>Local Expertise:</strong> We aren't just a car company; we are local experts. We can provide valuable advice for your travel plans and offer vehicles perfectly suited for any Ethiopian road.
                        </li>
                         <li>
                            <strong>24/7 Customer Support:</strong> Whether you have a question or need roadside assistance, our dedicated team is available around the clock to support you.
                        </li>
                    </ul>
                </div>
            </section>

            <section className="about-cta">
                <div className="container">
                    <h2>Ready for Your Next Adventure?</h2>
                    <p>Browse our diverse selection of vehicles and start planning your journey through Ethiopia today.</p>
                    
                    <Link to="#" className="cta-button">Explore Our Fleet</Link>
                </div>
            </section>

        </div>
    );
}

export default About;