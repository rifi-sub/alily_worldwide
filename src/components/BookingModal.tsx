import React from 'react';
import { X } from 'lucide-react';
import './BookingModal.css';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, serviceName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={24} />
        </button>
        <h3 className="modal-title">Booking Full</h3>
        <div className="modal-body">
          <p>
            All mentorship slots for <strong>{serviceName}</strong> are currently fully reserved.
          </p>
          <p>
            To join the VIP waiting list, inquire about custom scheduling, or discuss options, please email Goddess A Lilly directly:
          </p>
          <p className="modal-email">
            <a href="mailto:alilyworldwide@gmail.com">alilyworldwide@gmail.com</a>
          </p>
        </div>
        <button className="btn btn-primary" onClick={onClose}>
          Understood
        </button>
      </div>
    </div>
  );
};
