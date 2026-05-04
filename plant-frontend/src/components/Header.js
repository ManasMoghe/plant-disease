import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <div className="logo-icon">🌿</div>
        <span className="logo-text">
          Crop<span className="logo-accent">Care</span>
        </span>
      </div>
      <nav className="nav">
        <a href="/" className="nav-link">Detector</a>
        <a href="#about" className="nav-link">About</a>
        <span className="badge">Final Year Project</span>
      </nav>
    </header>
  );
}
