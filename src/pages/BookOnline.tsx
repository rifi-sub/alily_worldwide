import React, { useState, useEffect } from 'react';
import { BookingModal } from '../components/BookingModal';
import './BookOnline.css';

interface Service {
  id: string;
  title: string;
  price: number;
  durationMinutes: number;
  description: string;
}

export const BookOnline: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    import('../lib/api').then(module => {
      module.default.get('/mentorship/services')
        .then(res => {
          setServices(res.data);
        })
        .catch(err => {
          console.error(err);
        });
    });
  }, []);

  const handleBookClick = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <div className="book-page">
      <div className="container">
        <h2 className="book-title">Services</h2>
        <p className="book-subtitle">
          Accelerate your success with professional, confidential 1-on-1 coaching sessions designed to unlock your inner potential and secure your financial independence.
        </p>

        {services.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-text-muted font-poppins">Loading mentorship services...</p>
          </div>
        ) : (
          <div className="services-list">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-main">
                  <h3 className="service-name">{service.title}</h3>
                  <div className="service-meta">
                    <span className="service-price">£{Number(service.price).toFixed(2)}</span>
                    <span>|</span>
                    <span>{service.durationMinutes} min</span>
                  </div>
                  <p className="service-desc">{service.description}</p>
                </div>
                <button 
                  className="btn btn-primary book-btn"
                  onClick={() => handleBookClick(service)}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <BookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
      />
    </div>
  );
};
