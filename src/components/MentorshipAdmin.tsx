import React, { useState, useEffect } from 'react';
import adminApi from '../lib/adminApi';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit, X } from 'lucide-react';
import './MentorshipAdmin.css';

interface MentorshipService {
  id: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  status: string;
}

interface MentorshipAvailability {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface MentorshipBooking {
  id: string;
  customerEmail: string;
  customerName: string | null;
  amount: number;
  status: string;
  startTime: string;
  endTime: string;
  meetingLink: string | null;
  paypalOrderId: string | null;
  service: MentorshipService;
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const MentorshipAdmin: React.FC = () => {
  const [services, setServices] = useState<MentorshipService[]>([]);
  const [availabilities, setAvailabilities] = useState<MentorshipAvailability[]>([]);
  const [bookings, setBookings] = useState<MentorshipBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [hoveredBooking, setHoveredBooking] = useState<MentorshipBooking | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  };

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(b => {
      const bDate = new Date(b.startTime);
      return bDate.getFullYear() === date.getFullYear() &&
             bDate.getMonth() === date.getMonth() &&
             bDate.getDate() === date.getDate();
    });
  };

  const getAvailabilityForDayOfWeek = (dayOfWeek: number) => {
    return availabilities.filter(a => a.dayOfWeek === dayOfWeek && a.isActive);
  };

  // Modals
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<MentorshipService | null>(null);
  const [serviceForm, setServiceForm] = useState({ title: '', description: '', durationMinutes: '60', price: '50', status: 'active' });

  const [isAvailModalOpen, setIsAvailModalOpen] = useState(false);
  const [editingAvail, setEditingAvail] = useState<MentorshipAvailability | null>(null);
  const [availForm, setAvailForm] = useState({ dayOfWeek: '1', startTime: '10:00', endTime: '18:00', isActive: true });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, aRes, bRes] = await Promise.all([
        adminApi.get('/mentorship/admin/services'),
        adminApi.get('/mentorship/admin/availability'),
        adminApi.get('/mentorship/admin/bookings')
      ]);
      setServices(sRes.data);
      setAvailabilities(aRes.data);
      setBookings(bRes.data);
    } catch (err: any) {
      console.error(err);
      alert('Failed to fetch mentorship data.');
    } finally {
      setLoading(false);
    }
  };

  // --- SERVICES ---
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        const res = await adminApi.patch(`/mentorship/admin/services/${editingService.id}`, serviceForm);
        setServices(prev => prev.map(s => s.id === editingService.id ? res.data : s));
      } else {
        const res = await adminApi.post('/mentorship/admin/services', serviceForm);
        setServices([res.data, ...services]);
      }
      setIsServiceModalOpen(false);
      setEditingService(null);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save service');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await adminApi.delete(`/mentorship/admin/services/${id}`);
      setServices(services.filter(s => s.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete service');
    }
  };

  const openServiceModal = (s?: MentorshipService) => {
    if (s) {
      setEditingService(s);
      setServiceForm({ title: s.title, description: s.description || '', durationMinutes: String(s.durationMinutes), price: String(s.price), status: s.status });
    } else {
      setEditingService(null);
      setServiceForm({ title: '', description: '', durationMinutes: '60', price: '50', status: 'active' });
    }
    setIsServiceModalOpen(true);
  };

  // --- AVAILABILITIES ---
  const handleSaveAvail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAvail) {
        const res = await adminApi.patch(`/mentorship/admin/availability/${editingAvail.id}`, availForm);
        setAvailabilities(prev => prev.map(a => a.id === editingAvail.id ? res.data : a).sort((a, b) => a.dayOfWeek - b.dayOfWeek));
      } else {
        const res = await adminApi.post('/mentorship/admin/availability', availForm);
        setAvailabilities([...availabilities, res.data].sort((a, b) => a.dayOfWeek - b.dayOfWeek));
      }
      setIsAvailModalOpen(false);
      setEditingAvail(null);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save availability');
    }
  };

  const handleDeleteAvail = async (id: string) => {
    if (!window.confirm('Delete this schedule block?')) return;
    try {
      await adminApi.delete(`/mentorship/admin/availability/${id}`);
      setAvailabilities(availabilities.filter(a => a.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete availability');
    }
  };

  const openAvailModal = (a?: MentorshipAvailability) => {
    if (a) {
      setEditingAvail(a);
      setAvailForm({ dayOfWeek: String(a.dayOfWeek), startTime: a.startTime, endTime: a.endTime, isActive: a.isActive });
    } else {
      setEditingAvail(null);
      setAvailForm({ dayOfWeek: '1', startTime: '10:00', endTime: '18:00', isActive: true });
    }
    setIsAvailModalOpen(true);
  };

  if (loading) return <div>Loading Mentorship Data...</div>;

  return (
    <div className="mentorship-admin">
      <div className="mentorship-grid">
        {/* Left Column: Services & Schedule */}
        <div className="mentorship-col">
          <div className="mentorship-card">
            <div className="card-header">
              <h3>Mentorship Services</h3>
              <button className="btn btn-sm btn-primary" onClick={() => openServiceModal()}><Plus size={14}/> Add Service</button>
            </div>
            {services.length === 0 ? <p className="empty-text">No services configured.</p> : (
              <ul className="admin-list">
                {services.map(s => (
                  <li key={s.id} className="admin-list-item">
                    <div className="item-info">
                      <strong>{s.title}</strong>
                      <span>{s.durationMinutes} min - £{s.price} - <span className={`status-${s.status}`}>{s.status}</span></span>
                    </div>
                    <div className="item-actions">
                      <button onClick={() => openServiceModal(s)}><Edit size={16}/></button>
                      <button className="text-danger" onClick={() => handleDeleteService(s.id)}><Trash2 size={16}/></button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mentorship-card">
            <div className="card-header">
              <h3>Weekly Schedule</h3>
              <button className="btn btn-sm btn-primary" onClick={() => openAvailModal()}><Plus size={14}/> Add Block</button>
            </div>
            {availabilities.length === 0 ? <p className="empty-text">No availability configured.</p> : (
              <ul className="admin-list">
                {availabilities.map(a => (
                  <li key={a.id} className="admin-list-item">
                    <div className="item-info">
                      <strong>{DAYS_OF_WEEK[a.dayOfWeek]}</strong>
                      <span>{a.startTime} - {a.endTime} {a.isActive ? '' : '(Inactive)'}</span>
                    </div>
                    <div className="item-actions">
                      <button onClick={() => openAvailModal(a)}><Edit size={16}/></button>
                      <button className="text-danger" onClick={() => handleDeleteAvail(a.id)}><Trash2 size={16}/></button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column: Bookings Calendar & Daily Details */}
        <div className="mentorship-col">
          <div className="mentorship-card">
            <div className="card-header">
              <h3>Reservations Calendar</h3>
              <div className="calendar-nav">
                <button type="button" className="btn-nav" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>&lt;</button>
                <span className="calendar-month-year">
                  {currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button type="button" className="btn-nav" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>&gt;</button>
              </div>
            </div>

            <div className="calendar-grid">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <div key={d} className="calendar-weekday-header">{d}</div>
              ))}
              {getDaysInMonth(currentMonth).map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} className="calendar-day empty"></div>;
                
                const dayBookings = getBookingsForDate(day);
                const dayOfWeek = day.getDay();
                const isAvailable = getAvailabilityForDayOfWeek(dayOfWeek).length > 0;
                const isSelected = selectedDate && 
                  selectedDate.getFullYear() === day.getFullYear() &&
                  selectedDate.getMonth() === day.getMonth() &&
                  selectedDate.getDate() === day.getDate();
                const isToday = new Date().toDateString() === day.toDateString();

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isAvailable ? 'available' : ''}`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <span className="day-number">{day.getDate()}</span>
                    {dayBookings.length > 0 && (
                      <span className="booking-badge">{dayBookings.length}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDate && (
            <div className="mentorship-card day-details-card">
              <div className="card-header">
                <h3>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
              </div>

              <div className="details-section">
                <h4>Availability Schedule</h4>
                {getAvailabilityForDayOfWeek(selectedDate.getDay()).length === 0 ? (
                  <p className="empty-text">No hours configured for {DAYS_OF_WEEK[selectedDate.getDay()]}.</p>
                ) : (
                  <div className="avail-slots-list">
                    {getAvailabilityForDayOfWeek(selectedDate.getDay()).map(a => (
                      <span key={a.id} className="avail-slot-badge">
                        {a.startTime} - {a.endTime}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="details-section" style={{ marginTop: '1.5rem' }}>
                <h4>Bookings ({getBookingsForDate(selectedDate).length})</h4>
                {getBookingsForDate(selectedDate).length === 0 ? (
                  <p className="empty-text">No bookings scheduled for this day.</p>
                ) : (
                  <div className="selected-day-bookings">
                    {getBookingsForDate(selectedDate).map(b => (
                      <div
                        key={b.id}
                        className="booking-detail-item"
                        onMouseEnter={() => setHoveredBooking(b)}
                        onMouseLeave={() => setHoveredBooking(null)}
                      >
                        <div className="booking-item-header">
                          <span className="booking-time">
                            {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="status-pill confirmed">{b.status}</span>
                        </div>
                        <div className="booking-item-main">
                          <strong>{b.service?.title}</strong>
                          <p>Client: {b.customerName || 'Anonymous'} ({b.customerEmail})</p>
                          <p>Paid: £{Number(b.amount).toFixed(2)}</p>
                        </div>
                        {b.meetingLink && (
                          <Link to={b.meetingLink} className="btn btn-sm btn-outline join-btn" style={{ marginTop: '0.5rem', display: 'inline-block', textAlign: 'center' }}>
                            Join Call
                          </Link>
                        )}

                        {/* Hover Tooltip Details */}
                        {hoveredBooking?.id === b.id && (
                          <div className="booking-hover-tooltip">
                            <p><strong>Booking ID:</strong> {b.id}</p>
                            <p><strong>PayPal Order:</strong> {b.paypalOrderId || 'N/A'}</p>
                            <p><strong>End Time:</strong> {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Service Modal */}
      {isServiceModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setIsServiceModalOpen(false)}><X size={20}/></button>
            <h3>{editingService ? 'Edit Service' : 'Add Service'}</h3>
            <form onSubmit={handleSaveService}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" className="form-control" value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Duration (mins)</label>
                  <input type="number" className="form-control" value={serviceForm.durationMinutes} onChange={e => setServiceForm({...serviceForm, durationMinutes: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Price (£)</label>
                  <input type="number" step="0.01" className="form-control" value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})}></textarea>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select className="form-control" value={serviceForm.status} onChange={e => setServiceForm({...serviceForm, status: e.target.value})}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Save Service</button>
            </form>
          </div>
        </div>
      )}

      {/* Availability Modal */}
      {isAvailModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setIsAvailModalOpen(false)}><X size={20}/></button>
            <h3>{editingAvail ? 'Edit Block' : 'Add Block'}</h3>
            <form onSubmit={handleSaveAvail}>
              <div className="form-group">
                <label>Day of Week</label>
                <select className="form-control" value={availForm.dayOfWeek} onChange={e => setAvailForm({...availForm, dayOfWeek: e.target.value})}>
                  {DAYS_OF_WEEK.map((day, idx) => (
                    <option key={idx} value={idx}>{day}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Time (HH:MM)</label>
                  <input type="time" className="form-control" value={availForm.startTime} onChange={e => setAvailForm({...availForm, startTime: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>End Time (HH:MM)</label>
                  <input type="time" className="form-control" value={availForm.endTime} onChange={e => setAvailForm({...availForm, endTime: e.target.value})} required />
                </div>
              </div>
              <div className="form-group" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <input type="checkbox" id="isActive" checked={availForm.isActive} onChange={e => setAvailForm({...availForm, isActive: e.target.checked})} />
                <label htmlFor="isActive" style={{marginBottom: 0}}>Active</label>
              </div>
              <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>Save Block</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
