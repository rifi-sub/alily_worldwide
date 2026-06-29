import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, CheckCircle, Download } from 'lucide-react';
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

// Timezones list
const COMMON_TIMEZONES = [
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris / Madrid (CET/CEST)' },
  { value: 'America/New_York', label: 'New York (EST/EDT)' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)' },
  { value: 'America/Denver', label: 'Denver (MST/MDT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
];

const parseLondonTime = (dateStr: string, timeStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/London',
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false
  });
  
  const parts = formatter.formatToParts(utcDate);
  const getVal = (type: string) => Number(parts.find(p => p.type === type)?.value);
  
  const parsedLondon = Date.UTC(
    getVal('year'),
    getVal('month') - 1,
    getVal('day'),
    getVal('hour') === 24 ? 0 : getVal('hour'),
    getVal('minute')
  );
  
  const diff = utcDate.getTime() - parsedLondon;
  return new Date(utcDate.getTime() + diff);
};

const convertSlotForDisplay = (dateStr: string, londonSlot: string, targetTz: string) => {
  const dateObj = parseLondonTime(dateStr, londonSlot);
  
  const timeString = dateObj.toLocaleTimeString('en-US', {
    timeZone: targetTz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  // Date shift label
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: targetTz,
    year: 'numeric', month: 'numeric', day: 'numeric'
  });
  const parts = formatter.formatToParts(dateObj);
  const getVal = (type: string) => parts.find(p => p.type === type)?.value || '';
  const localDateStr = `${getVal('year')}-${String(getVal('month')).padStart(2, '0')}-${String(getVal('day')).padStart(2, '0')}`;
  
  const [sy, sm, sd] = dateStr.split('-').map(Number);
  const formattedSelected = `${sy}-${String(sm).padStart(2, '0')}-${String(sd).padStart(2, '0')}`;
  
  const diffDays = Math.round(
    (new Date(localDateStr).getTime() - new Date(formattedSelected).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  let offsetLabel = '';
  if (diffDays > 0) offsetLabel = ' (+1 day)';
  if (diffDays < 0) offsetLabel = ' (-1 day)';
  
  return {
    timeString,
    offsetLabel
  };
};

const getDisplayDateTime = (dateStr: string, londonSlot: string, targetTz: string) => {
  const dateObj = parseLondonTime(dateStr, londonSlot);
  const dateFormatted = dateObj.toLocaleDateString('en-US', {
    timeZone: targetTz,
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });
  const timeFormatted = dateObj.toLocaleTimeString('en-US', {
    timeZone: targetTz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  return `${dateFormatted} at ${timeFormatted}`;
};

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

  // Timezone state
  const detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [selectedTimezone, setSelectedTimezone] = useState<string>(detectedTz);

  // Get list of timezones, making sure local detected timezone is included
  const timezonesList = [...COMMON_TIMEZONES];
  if (!timezonesList.find(tz => tz.value === detectedTz)) {
    timezonesList.unshift({ value: detectedTz, label: `Local Time (${detectedTz})` });
  }

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
      setSelectedTimezone(detectedTz);
      
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

  const formatToICSDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const handleDownloadICS = () => {
    if (!successData || !selectedDate || !selectedTime) return;
    
    const start = parseLondonTime(selectedDate, selectedTime);
    const end = new Date(start.getTime() + service.durationMinutes * 60 * 1000);
    
    const dtStart = formatToICSDate(start);
    const dtEnd = formatToICSDate(end);
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Alily Worldwide//Mentorship Booking//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${successData.bookingId}@alilyworldwide.com`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${service.title} - Mentorship Session`,
      `DESCRIPTION:Mentorship session with Goddess A Lilly. Join here: ${successData.meetingLink}`,
      `URL:${successData.meetingLink}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mentorship-session-${successData.bookingId.slice(0, 8)}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label>Your Timezone</label>
                  <select 
                    className="form-control" 
                    value={selectedTimezone}
                    onChange={e => setSelectedTimezone(e.target.value)}
                  >
                    {timezonesList.map(tz => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedDate && (
                <div className="slots-container">
                  <label><Clock size={16} /> Available Slots (in {selectedTimezone})</label>
                  {loadingSlots ? (
                    <p className="loading-text">Finding slots...</p>
                  ) : availableSlots.length === 0 ? (
                    <p className="empty-text">No slots available on this date.</p>
                  ) : (
                    <div className="slots-grid">
                      {availableSlots.map(londonSlot => {
                        const { timeString, offsetLabel } = convertSlotForDisplay(selectedDate, londonSlot, selectedTimezone);
                        return (
                          <button 
                            key={londonSlot} 
                            className={`slot-btn ${selectedTime === londonSlot ? 'selected' : ''}`}
                            onClick={() => setSelectedTime(londonSlot)}
                          >
                            {timeString}{offsetLabel}
                          </button>
                        );
                      })}
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
                <p><strong>Date & Time:</strong> {getDisplayDateTime(selectedDate, selectedTime, selectedTimezone)} ({selectedTimezone})</p>
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
                <p><strong>Service:</strong> {service.title}</p>
                <p><strong>Date & Time:</strong> {getDisplayDateTime(selectedDate, selectedTime, selectedTimezone)} ({selectedTimezone})</p>
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
              <h4 className="animate-scale-in">Booking Confirmed!</h4>
              <p>Your mentorship session is confirmed for:</p>
              <p style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>
                {getDisplayDateTime(selectedDate, selectedTime, selectedTimezone)} ({selectedTimezone})
              </p>
              
              <button 
                className="btn btn-outline" 
                onClick={handleDownloadICS}
                style={{ margin: '1rem auto 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
              >
                <Download size={16} /> Add to Calendar (.ics)
              </button>

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
