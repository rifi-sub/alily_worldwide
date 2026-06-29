import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, CheckCircle } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import './BookingModal.css';

interface Service {
  id: string;
  title: string;
  price: number;
  durationMinutes: number;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, service }) => {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Date/Time, 2: Details, 3: Payment, 4: Success
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [paypalConfig, setPaypalConfig] = useState<{ clientId: string; mode: string } | null>(null);
  
  const [successData, setSuccessData] = useState<{ bookingId: string; meetingLink: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedDate('');
      setSelectedTime('');
      setAvailableSlots([]);
      setFormData({ 
        name: user?.name || '', 
        email: user?.email || '' 
      });
      setSuccessData(null);
      setErrorMsg(null);
      
      // Fetch PayPal Config (using worldwide endpoint since it shares the same client ID)
      api.get('/worldwide/payments/config')
        .then(res => setPaypalConfig(res.data))
        .catch(console.error);
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (selectedDate && service) {
      setLoadingSlots(true);
      setSelectedTime('');
      api.get(`/mentorship/slots?date=${selectedDate}&serviceId=${service.id}`)
        .then(res => setAvailableSlots(res.data))
        .catch(err => {
          console.error(err);
          setAvailableSlots([]);
        })
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedDate, service]);

  if (!isOpen || !service) return null;

  const createPayPalOrder = async () => {
    try {
      const res = await api.post('/mentorship/create-order', {
        serviceId: service.id,
        date: selectedDate,
        time: selectedTime
      });
      return res.data.orderId;
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to create order');
      throw err;
    }
  };

  const onApprovePayPal = async (data: any) => {
    try {
      const res = await api.post('/mentorship/capture-order', {
        orderId: data.orderID,
        serviceId: service.id,
        customerName: formData.name,
        customerEmail: formData.email,
        date: selectedDate,
        time: selectedTime
      });
      
      if (res.data.success) {
        setSuccessData({
          bookingId: res.data.bookingId,
          meetingLink: res.data.meetingLink
        });
        setStep(4);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to capture payment');
    }
  };

  const isNextDisabled = 
    (step === 1 && (!selectedDate || !selectedTime)) ||
    (step === 2 && (!formData.name || !formData.email));

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content booking-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={24} />
        </button>
        
        <h3 className="modal-title">Book {service.title}</h3>
        <div className="booking-progress">
          <span className={step >= 1 ? 'active' : ''}>1. Schedule</span>
          <span className={step >= 2 ? 'active' : ''}>2. Details</span>
          <span className={step >= 3 ? 'active' : ''}>3. Payment</span>
        </div>

        <div className="modal-body">
          {errorMsg && <div className="booking-error">{errorMsg}</div>}

          {step === 1 && (
            <div className="step-content">
              <div className="form-group">
                <label><CalendarIcon size={16} /> Select Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={selectedDate} 
                  min={getMinDate()}
                  onChange={e => setSelectedDate(e.target.value)} 
                />
              </div>

              {selectedDate && (
                <div className="slots-container">
                  <label><Clock size={16} /> Available Slots</label>
                  {loadingSlots ? (
                    <p className="loading-text">Finding slots...</p>
                  ) : availableSlots.length === 0 ? (
                    <p className="empty-text">No slots available on this date.</p>
                  ) : (
                    <div className="slots-grid">
                      {availableSlots.map(slot => (
                        <button 
                          key={slot} 
                          className={`slot-btn ${selectedTime === slot ? 'selected' : ''}`}
                          onClick={() => setSelectedTime(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <div className="booking-summary-box">
                <p><strong>Service:</strong> {service.title}</p>
                <p><strong>Date & Time:</strong> {selectedDate} at {selectedTime}</p>
                <p><strong>Total:</strong> £{service.price}</p>
              </div>
              <div className="form-group" style={{marginTop: '1rem'}}>
                <label>Your Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Your Email *</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <div className="booking-summary-box" style={{marginBottom: '1.5rem'}}>
                <p><strong>Total to pay:</strong> £{service.price}</p>
              </div>
              {paypalConfig ? (
                <PayPalScriptProvider
                  options={{
                    clientId: paypalConfig.clientId,
                    currency: 'GBP',
                    intent: 'capture',
                    environment: paypalConfig.mode === 'live' ? 'production' : 'sandbox',
                  }}
                >
                  <PayPalButtons
                    style={{ layout: 'vertical', shape: 'rect', color: 'gold' }}
                    createOrder={createPayPalOrder}
                    onApprove={onApprovePayPal}
                    onError={() => setErrorMsg('PayPal encountered an error. Please try again.')}
                  />
                </PayPalScriptProvider>
              ) : (
                <p>Loading payment system...</p>
              )}
            </div>
          )}

          {step === 4 && successData && (
            <div className="step-content success-step text-center">
              <CheckCircle size={48} color="#28a745" style={{margin: '0 auto 1rem'}} />
              <h4>Booking Confirmed!</h4>
              <p>Your mentorship session is confirmed for {selectedDate} at {selectedTime}.</p>
              <div className="meeting-link-box">
                <p><strong>Meeting Link:</strong></p>
                <a href={successData.meetingLink} target="_blank" rel="noreferrer">{successData.meetingLink}</a>
              </div>
              <p className="small-text text-muted">A confirmation email has also been sent to {formData.email}.</p>
            </div>
          )}
        </div>

        {step < 3 && (
          <div className="modal-footer">
            {step > 1 && (
              <button className="btn btn-outline" onClick={() => setStep((s) => (s - 1) as any)}>Back</button>
            )}
            <button 
              className="btn btn-primary" 
              onClick={() => setStep((s) => (s + 1) as any)} 
              disabled={isNextDisabled}
              style={{ marginLeft: 'auto' }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
