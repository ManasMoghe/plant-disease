import React from 'react';
import './Hero.css';

const stats = [
  { num: '23',   label: 'Disease Classes' },
  { num: '35k+', label: 'Training Images' },
  { num: 'CNN',  label: 'Architecture'    },
];

export default function Hero() {
  return (
    <section className="hero">
      <p className="hero-eyebrow">AI-Powered Agricultural Intelligence</p>
      <h1 className="hero-title">
        Detect Plant Diseases<br />
        <em>Instantly &amp; Accurately</em>
      </h1>
      <p className="hero-sub">
        Upload a leaf image and our deep learning model will identify the disease,
        confidence level, and classification within seconds.
      </p>
      <div className="stats-row">
        {stats.map(s => (
          <div className="stat" key={s.label}>
            <span className="stat-num">{s.num}</span>
            <span className="stat-lbl">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
