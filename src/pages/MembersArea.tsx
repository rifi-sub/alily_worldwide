import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Calendar, Settings, ExternalLink } from 'lucide-react';
import userApi from '../lib/userApi';
import './MembersArea.css';

interface WorldwideOrder {
  id: string;
  orderCode: string;
  customerEmail: string;
  customerName: string | null;
  amount: number;
  status: string;
  items: any;
  createdAt: string;
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
  service: {
    title: string;
    durationMinutes: number;
  };
}

export const MembersArea: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'bookings' | 'settings'>('orders');
  const [orders, setOrders] = useState<WorldwideOrder[]>([]);
  const [bookings, setBookings] = useState<MentorshipBooking[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Settings form
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      setDataLoading(true);
      Promise.all([
        userApi.get('/members/orders').catch(() => ({ data: [] })),
        userApi.get('/members/bookings').catch(() => ({ data: [] })),
      ]).then(([ordersRes, bookingsRes]) => {
        setOrders(ordersRes.data);
        setBookings(bookingsRes.data);
      }).finally(() => setDataLoading(false));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
    }
  }, [user]);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await userApi.patch('/members/profile', { name: editName });
      updateUser({ name: res.data.name });
      setSaveMsg('Profile updated successfully.');
    } catch (err: any) {
      setSaveMsg(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return <div className="members-page"><div className="container"><p>Loading...</p></div></div>;
  if (!isAuthenticated || !user) return null;

  const getStatusClass = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'confirmed' || s === 'delivered') return 'status-confirmed';
    if (s === 'pending') return 'status-pending';
    if (s === 'cancelled') return 'status-cancelled';
    return 'status-default';
  };

  const parseItems = (items: any): Array<{ name: string; quantity: number }> => {
    if (Array.isArray(items)) return items;
    if (items && typeof items === 'object' && Array.isArray(items.items)) return items.items;
    return [];
  };

  return (
    <div className="members-page">
      <div className="container">
        <div className="members-header">
          <h2 className="members-title">Welcome back{user.name ? `, ${user.name}` : ''}</h2>
          <p className="members-email">{user.email}</p>
        </div>

        <div className="members-tabs">
          <button
            className={`members-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Package size={18} /> My Orders
          </button>
          <button
            className={`members-tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <Calendar size={18} /> My Bookings
          </button>
          <button
            className={`members-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} /> Account
          </button>
        </div>

        <div className="members-content">
          {dataLoading ? (
            <p className="loading-text">Loading your data...</p>
          ) : (
            <>
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="tab-panel">
                  {orders.length === 0 ? (
                    <div className="empty-state">
                      <Package size={40} />
                      <h3>No orders yet</h3>
                      <p>Your purchase history will appear here after your first order.</p>
                    </div>
                  ) : (
                    <div className="orders-list">
                      {orders.map(order => {
                        const itemsList = parseItems(order.items);
                        return (
                          <div key={order.id} className="order-card">
                            <div className="order-card-header">
                              <div>
                                <span className="order-code">{order.orderCode}</span>
                                <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                              </div>
                              <span className={`status-pill ${getStatusClass(order.status)}`}>{order.status}</span>
                            </div>
                            <div className="order-card-body">
                              {itemsList.map((item: any, idx: number) => (
                                <p key={idx} className="order-item-line">
                                  {item.name || item.productId} × {item.quantity}
                                </p>
                              ))}
                            </div>
                            <div className="order-card-footer">
                              <span className="order-total">£{Number(order.amount).toFixed(2)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <div className="tab-panel">
                  {bookings.length === 0 ? (
                    <div className="empty-state">
                      <Calendar size={40} />
                      <h3>No bookings yet</h3>
                      <p>Your mentorship sessions will appear here after you book.</p>
                    </div>
                  ) : (
                    <div className="bookings-list">
                      {bookings.map(booking => {
                        const startDate = new Date(booking.startTime);
                        const isPast = startDate < new Date();
                        return (
                          <div key={booking.id} className={`booking-card ${isPast ? 'past' : ''}`}>
                            <div className="booking-card-header">
                              <strong>{booking.service?.title}</strong>
                              <span className={`status-pill ${getStatusClass(booking.status)}`}>{booking.status}</span>
                            </div>
                            <div className="booking-card-body">
                              <p><strong>Date:</strong> {startDate.toLocaleDateString()}</p>
                              <p><strong>Time:</strong> {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              <p><strong>Duration:</strong> {booking.service?.durationMinutes} min</p>
                              <p><strong>Paid:</strong> £{Number(booking.amount).toFixed(2)}</p>
                              {booking.meetingLink && !isPast && (
                                <a href={booking.meetingLink} target="_blank" rel="noreferrer" className="meeting-link">
                                  <ExternalLink size={14} /> Join Meeting
                                </a>
                              )}
                              {isPast && <span className="past-label">Completed</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="tab-panel settings-panel">
                  <form onSubmit={handleSaveName}>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" className="form-control" value={user.email} disabled />
                    </div>
                    <div className="form-group">
                      <label>Username</label>
                      <input type="text" className="form-control" value={user.username} disabled />
                    </div>
                    <div className="form-group">
                      <label>Display Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Your name"
                      />
                    </div>
                    {saveMsg && (
                      <p className={saveMsg.includes('success') ? 'save-success' : 'save-error'}>{saveMsg}</p>
                    )}
                    <button type="submit" className="btn btn-primary" disabled={saving} style={{ marginTop: '1rem' }}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
