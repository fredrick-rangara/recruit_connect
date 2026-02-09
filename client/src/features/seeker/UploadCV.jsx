import React, { useState } from 'react';
import api from '../../services/api';

const UploadCV = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage({ type: '', text: '' }); // Clear previous messages
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first.' });
      return;
    }

    const formData = new FormData();
    formData.append('cv', file);

    setUploading(true);
    try {
      await api.post('/seeker/upload-cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage({ type: 'success', text: '✅ CV uploaded successfully!' });
      setFile(null); // Reset input
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: '❌ Upload failed. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{
      background: 'white',
      padding: '25px',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
    }}>
      <h3 style={{ marginBottom: '10px', color: '#1e293b' }}>Resume / CV</h3>
      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
        Upload your latest resume in PDF or Word format.
      </p>

      <form onSubmit={handleUpload}>
        <div style={{
          border: '2px dashed #cbd5e1',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          marginBottom: '20px',
          position: 'relative'
        }}>
          <input 
            type="file" 
            onChange={handleFileChange} 
            accept=".pdf,.doc,.docx"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer'
            }}
          />
          <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📁</div>
          <span style={{ fontSize: '0.9rem', color: '#475569' }}>
            {file ? file.name : "Click to browse or drag and drop"}
          </span>
        </div>

        <button 
          type="submit" 
          className="btn-purple" 
          disabled={uploading || !file}
          style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: '10px',
            opacity: (uploading || !file) ? 0.7 : 1
          }}
        >
          {uploading ? "Uploading..." : "Upload Resume"}
        </button>
      </form>

      {message.text && (
        <p style={{ 
          marginTop: '15px', 
          fontSize: '0.85rem', 
          textAlign: 'center',
          color: message.type === 'success' ? '#16a34a' : '#dc2626'
        }}>
          {message.text}
        </p>
      )}
    </div>
  );
};

export default UploadCV;