import React, { useState } from 'react';
import { BookingModal } from '../components/BookingModal';
import './BookOnline.css';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
}

export const BookOnline: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const services: Service[] = [
    {
      id: 'findom-mentorship',
      name: 'Findom Mentorship',
      price: 300.00,
      duration: '1 hr',
      description: 'A 1-on-1 intensive session guiding you through target psychology, branding, and billing architectures.'
    },
    {
      id: 'mean-girl-mentorship',
      name: 'Mean Girl Mentorship',
      price: 350.00,
      duration: '1 hr',
      description: 'Unleash your inner authority. A specialized program focused on mindset, confidence building, and commanding power.'
    },
    {
      id: 'custom-session',
      name: 'Custom Session',
      price: 250.00,
      duration: '1 hr',
      description: 'Bespoke consultation tailored to your specific goals, business struggles, or strategic expansion plans.'
    },
    {
      id: 'premium-guidance',
      name: 'Premium Guidance',
      price: 500.00,
      duration: '1 hr',
      description: 'Our most exclusive coaching format. Full business audits, deep diving into branding templates and continuous support setup.'
    },
    {
      id: 'texting-mentorship',
      name: 'Texting Mentorship',
      price: 200.00,
      duration: '1 hr',
      description: 'Master the art of messaging. How to write high-converting scripts, trigger psychological submissive actions, and maintain authority via text.'
    }
  ];

  const handleBookClick = (serviceName: string) => {
    setSelectedService(serviceName);
    setIsModalOpen(true);
  };

  return (
    <div className="book-page">
      <div className="container">
        <h2 className="book-title">Services</h2>
        <p className="book-subtitle">
          Accelerate your success with professional, confidential 1-on-1 coaching sessions designed to unlock your inner potential and secure your financial independence.
        </p>

        <div className="services-list">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-main">
                <h3 className="service-name">{service.name}</h3>
                <div className="service-meta">
                  <span className="service-price">£{service.price.toFixed(2)}</span>
                  <span>|</span>
                  <span>{service.duration}</span>
                </div>
                <p className="service-desc">{service.description}</p>
              </div>
              <button 
                className="btn btn-primary book-btn"
                onClick={() => handleBookClick(service.name)}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>

      <BookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceName={selectedService}
      />
    </div>
  );
};
