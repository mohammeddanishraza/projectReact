import React from 'react';
import closeIcon from './images/cross-icon.png'; // Replace 'path_to_close_icon.png' with the actual path to your close icon image
import './ImageViewerModal.css';

function ImageViewerModal({ imageUrl, onClose }) {
  return (
    <div className="image-viewer-modal">
      <div className="image-container">
        <button className="close-btn" onClick={onClose}>
          <img src={closeIcon} alt="Close" className="close-icon" />
        </button>
        <img src={imageUrl} alt="Patient Image" className="modal-image" />
      </div>
    </div>
  );
}

export default ImageViewerModal;
