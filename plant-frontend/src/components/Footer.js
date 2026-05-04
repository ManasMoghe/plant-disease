import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer-text">
        CropCare &mdash; Final Year Project &middot; Built with CNN &amp; Flask
      </p>
      <p className="footer-sub">
        Model trained on PlantVillage Dataset &middot; 23 disease classes &middot; 35k+ images
      </p>
    </footer>
  );
}
