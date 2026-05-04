import React from 'react';
import './LoadingOverlay.css';

export default function LoadingOverlay({ active }) {
  if (!active) return null;
  return (
    <div className="loading-overlay">
      <div className="loading-card">
        <div className="spinner-ring">
          <div /><div /><div /><div />
        </div>
        <p className="loading-title">Analysing Leaf</p>
        <p className="loading-sub">Running deep learning model…</p>
      </div>
    </div>
  );
}
