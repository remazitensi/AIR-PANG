import React from 'react';
// import './MapModal.css';

const MapModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="map-modal-overlay">
      <div className="map-modal-content">
        <button className="map-modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default MapModal;