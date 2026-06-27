import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import heroImg from '../assets/hero.jpeg';

export const Home: React.FC = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section 
        className="home-hero" 
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="hero-content">
          <span className="hero-subtitle">Goddess A Lilly Mentorship</span>
          <h1 className="hero-title">Elevate Your Mindset,<br />Secure Your Future.</h1>
          <Link to="/book-online" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Explore Services
          </Link>
        </div>
      </section>

      {/* Intro Section */}
      <section className="home-intro">
        <div className="container intro-container">
          <h2 className="intro-title">A New Era of Empowerment</h2>
          <p className="intro-text">
            Success in the findom space isn’t about luck—it’s about strategy, confidence, and understanding power dynamics. I help women navigate this world, build strong foundations, and turn their presence into a profitable business.
          </p>
          <Link to="/about-me" className="btn btn-outline">
            Read My Story
          </Link>
        </div>
      </section>

      {/* Testimonials Preview Section */}
      <section className="home-testimonials">
        <div className="container">
          <h2 className="text-center" style={{ marginBottom: '1rem' }}>Client Success</h2>
          <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>
            Hear from alumni who have transformed their lives, established bulletproof boundaries, and achieved financial independence.
          </p>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-text">
                "The transition from financial uncertainty to absolute financial domination was seamless. Goddess A Lilly didn't just teach me a strategy; she redefined my reality."
              </p>
              <span className="testimonial-author">Alumni 01</span>
            </div>
            
            <div className="testimonial-card">
              <p className="testimonial-text">
                "Building a remote lifestyle that feels luxurious and effortless. The mentorship provided the structure I needed to thrive while maintaining my creative soul."
              </p>
              <span className="testimonial-author">Alumni 02</span>
            </div>
            
            <div className="testimonial-card">
              <p className="testimonial-text">
                "Empowerment isn't just about money; it's about the confidence to lead. Goddess A Lilly's mentorship gave me the authority to build my dream life from anywhere."
              </p>
              <span className="testimonial-author">Alumni 03</span>
            </div>
          </div>
          
          <Link to="/success-stories" className="btn btn-outline">
            View All Results
          </Link>
        </div>
      </section>
    </div>
  );
};
