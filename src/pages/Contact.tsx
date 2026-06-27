import React, { useState } from 'react';
import './Contact.css';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) {
      alert('Please fill out the required email and message fields.');
      return;
    }
    
    // Simulate API call
    console.log('Contact inquiry submitted:', formData);
    setIsSubmitted(true);
  };

  return (
    <div className="contact-page">
      <div className="container contact-container">
        <h2 className="contact-title">Contact</h2>
        <p className="contact-subtitle">
          Have questions about the mentorship programs, custom options, or private coaching?
          Fill out the form below, and Goddess A Lilly will get back to you directly.
        </p>

        {isSubmitted ? (
          <div className="contact-success">
            <h3>Message Sent</h3>
            <p>
              Thank you for reaching out! Goddess A Lilly will review your message and respond directly via email within 24 to 48 hours.
            </p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
