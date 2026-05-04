import React, { useEffect, useRef } from 'react';
import './ResultPanel.css';

function formatDisease(str) {
  return str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function parseClass(raw) {
  const parts     = raw.split('___');
  const crop      = parts[0].replace(/_/g, ' ');
  const disease   = (parts[1] || parts[0]).replace(/_/g, ' ');
  const isHealthy = raw.toLowerCase().includes('healthy');
  const display   = isHealthy ? 'Healthy' : formatDisease(disease);
  return { crop, disease, display, isHealthy };
}

function formatTop5Label(raw) {
  const parts = raw.split('___');
  const crop  = parts[0].replace(/_/g, ' ');
  const dis   = (parts[1] || parts[0]).replace(/_/g, ' ');
  return crop === dis ? crop : `${crop} — ${dis}`;
}

// ── Animated Bar ─────────────────────────────────────────
function Bar({ pct, isFirst }) {
  const ref = useRef(null);
  useEffect(() => {
    const t = setTimeout(() => {
      if (ref.current) ref.current.style.width = pct + '%';
    }, 150);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="bar-track">
      <div
        ref={ref}
        className={`bar-fill ${isFirst ? 'rank-1' : 'other'}`}
        style={{ width: 0 }}
      />
    </div>
  );
}

// ── Confidence Fill ───────────────────────────────────────
function ConfMeter({ conf }) {
  const ref = useRef(null);
  useEffect(() => {
    const t = setTimeout(() => {
      if (ref.current) ref.current.style.width = conf + '%';
    }, 80);
    return () => clearTimeout(t);
  }, [conf]);

  const cls = conf >= 70 ? 'high' : conf >= 40 ? 'mid' : 'low';
  return (
    <div className="conf-meter-track">
      <div ref={ref} className={`conf-meter-fill ${cls}`} style={{ width: 0 }} />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────
export default function ResultPanel({ result, preview, imgMeta }) {
  if (!preview) return null;

  const isLoading = preview && !result;
  const parsed    = result ? parseClass(result.class) : null;
  const conf      = result?.confidence ?? 0;
  const top5      = result?.top5 ?? [];

  return (
    <div className={`result-section ${result ? 'visible' : 'preview-only'}`}>

      {/* STATUS BANNER */}
      {result && (
        <div className={`status-banner ${parsed.isHealthy ? 'healthy' : 'diseased'}`}>
          <span className="status-icon">{parsed.isHealthy ? '✅' : '⚠️'}</span>
          <span>
            {parsed.isHealthy
              ? 'Healthy Plant Detected — No Disease Found'
              : `Disease Detected: ${parsed.display}`}
          </span>
          <span className="conf-pill">{conf.toFixed(2)}% confidence</span>
        </div>
      )}

      {/* IMAGE PANEL */}
      <div className="panel">
        <div className="panel-head">
          <div className="panel-head-dot" />
          <h3>Input Image {isLoading && <span className="analysing">Analysing…</span>}</h3>
        </div>
        <div className="panel-body">
          <img src={preview} alt="Uploaded leaf" className="preview-img" />
          <div className="img-meta">
            <span>📐 {imgMeta.size || '—'}</span>
            <span>📄 {imgMeta.name || '—'}</span>
          </div>
        </div>
      </div>

      {/* PREDICTION PANEL */}
      {result && (
        <div className="panel">
          <div className="panel-head">
            <div className="panel-head-dot amber" />
            <h3>Model Prediction</h3>
          </div>
          <div className="panel-body">

            <p className="pred-class-name">{parsed.display}</p>
            <p className="pred-plant">{parsed.crop.toUpperCase()}</p>

            {/* Confidence meter */}
            <div className="conf-meter">
              <div className="conf-meter-label">
                <span>Confidence Score</span>
                <span>{conf.toFixed(2)}%</span>
              </div>
              <ConfMeter conf={conf} />
            </div>

            {/* Info table */}
            <table className="info-table">
              <tbody>
                <tr>
                  <td>Predicted Class</td>
                  <td>{parsed.display}</td>
                </tr>
                <tr>
                  <td>Disease Status</td>
                  <td>
                    <span className={`tag ${parsed.isHealthy ? 'healthy' : 'diseased'}`}>
                      {parsed.isHealthy ? 'Healthy' : 'Diseased'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Confidence</td>
                  <td>{conf.toFixed(2)}%</td>
                </tr>
                <tr>
                  <td>Crop Type</td>
                  <td>{parsed.crop}</td>
                </tr>
              </tbody>
            </table>

            {/* Top-5 */}
            {top5.length > 0 && (
              <>
                <p className="top5-title">Top-5 Predicted Probabilities</p>
                {top5.map((item, i) => (
                  <div className={`top5-item rank-${i + 1}`} key={item.class}>
                    <span className="rank-num">{item.rank}</span>
                    <div className="bar-wrap">
                      <div className="bar-label" title={formatTop5Label(item.class)}>
                        {formatTop5Label(item.class)}
                      </div>
                      <Bar pct={item.probability} isFirst={i === 0} />
                    </div>
                    <span className="bar-pct">{item.probability.toFixed(2)}%</span>
                  </div>
                ))}
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
