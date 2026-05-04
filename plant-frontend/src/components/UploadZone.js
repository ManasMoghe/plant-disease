import React, { useRef, useState } from 'react';
import './UploadZone.css';

export default function UploadZone({ onFile }) {
  const inputRef    = useRef(null);
  const [drag, setDrag] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  return (
    <div
      className={`upload-zone ${drag ? 'drag-over' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="upload-input"
        onChange={(e) => e.target.files[0] && onFile(e.target.files[0])}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="upload-icon">🍃</div>
      <h2 className="upload-title">Drop a leaf image here</h2>
      <p className="upload-sub">or click to browse from your device</p>
      <button
        className="upload-btn"
        onClick={(e) => { e.stopPropagation(); inputRef.current.click(); }}
      >
        📂 Choose Image
      </button>
      <p className="upload-formats">Supports: JPG · PNG · WEBP · BMP</p>
    </div>
  );
}
