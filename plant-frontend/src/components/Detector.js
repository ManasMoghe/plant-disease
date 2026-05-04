import React, { useState, useRef, useEffect } from 'react';
import UploadZone from './UploadZone';
import ResultPanel from './ResultPanel';
import LoadingOverlay from './LoadingOverlay';
import Toast from './Toast';
import './Detector.css';

const API_URL = 'http://127.0.0.1:5000/predict';

export default function Detector() {
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [preview, setPreview]   = useState(null);
  const [imgMeta, setImgMeta]   = useState({ name: '', size: '' });
  const [toast, setToast]       = useState('');
  const resultRef               = useRef(null);

  const showError = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4500);
  };

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      showError('Please upload a valid image file (JPG, PNG, WEBP, BMP).');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      const img = new Image();
      img.onload = () =>
        setImgMeta({ name: file.name, size: `${img.width} × ${img.height} px` });
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);

    // API call
    setResult(null);
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    fetch(API_URL, { method: 'POST', body: formData })
      .then((r) => {
        if (!r.ok) throw new Error('Server error ' + r.status);
        return r.json();
      })
      .then((data) => {
        setLoading(false);
        setResult(data);
      })
      .catch((err) => {
        setLoading(false);
        showError(
          'Could not reach the backend. Make sure Flask is running on port 5000. (' +
            err.message +
            ')'
        );
      });
  };

  // Scroll to result when it appears
  useEffect(() => {
    if (result && resultRef.current) {
      setTimeout(
        () => resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        100
      );
    }
  }, [result]);

  return (
    <main className="detector-main">
      <LoadingOverlay active={loading} />
      <Toast message={toast} />

      <UploadZone onFile={handleFile} />

      {(preview || result) && (
        <div ref={resultRef}>
          <ResultPanel result={result} preview={preview} imgMeta={imgMeta} />
        </div>
      )}
    </main>
  );
}
