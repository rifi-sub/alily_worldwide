import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import api from '../lib/api';
import './MeetingRoom.css';

interface BookingDetails {
  id: string;
  customerName: string | null;
  customerEmail: string;
  startTime: string;
  endTime: string;
  status: string;
  service: {
    title: string;
    durationMinutes: number;
  };
}

export const MeetingRoom: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if admin is logged in
  const isAdmin = !!localStorage.getItem('worldwide_admin_token');

  useEffect(() => {
    if (!bookingId) return;

    setLoading(true);
    api.get(`/mentorship/booking/${bookingId}`)
      .then(res => {
        setBooking(res.data);
      })
      .catch(err => {
        console.error(err);
        setError(err.response?.data?.error || 'Failed to load meeting details.');
      })
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handleLeave = () => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    } else {
      navigate('/members');
    }
  };

  if (loading) {
    return (
      <div className="meeting-room-loading">
        <div className="spinner"></div>
        <p>Connecting to secure meeting server...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="meeting-room-error">
        <ShieldAlert size={48} className="text-danger" />
        <h3>Access Denied</h3>
        <p>{error || 'This meeting room does not exist.'}</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  // Determine display name
  let displayName = 'Guest';
  if (isAdmin) {
    displayName = 'Goddess A Lilly';
  } else if (user) {
    displayName = user.name || user.username || user.email;
  } else if (booking.customerName) {
    displayName = booking.customerName;
  }

  // Construct secure room name
  const roomName = `alily-mentorship-${booking.id}`;

  // Using MiroTalk P2P (completely open WebRTC, no host login required, optimized for iframes)
  const meetingUrl = `https://p2p.mirotalk.com/join/${roomName}?name=${encodeURIComponent(displayName)}`;

  return (
    <div className="meeting-room-page">
      <header className="meeting-header-bar">
        <button className="back-btn" onClick={handleLeave}>
          <ArrowLeft size={18} />
          Leave Meeting
        </button>
        <div className="meeting-info">
          <span className="meeting-title">{booking.service.title}</span>
          <span className="meeting-desc">
            Client: {booking.customerName || booking.customerEmail}
          </span>
        </div>
        <div className="meeting-status-badges">
          <div className="badge badge-live">
            <span className="pulse-dot"></span> Live
          </div>
        </div>
      </header>

      <div className="meeting-iframe-container">
        <iframe
          src={meetingUrl}
          allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-read; clipboard-write; web-share"
          title="ALILY Secure Video Meeting"
          className="meeting-iframe"
        />
      </div>
    </div>
  );
};
