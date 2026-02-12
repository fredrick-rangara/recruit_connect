import React, { useState } from 'react';

function ContactModal({ isOpen, onClose, talentName }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate sending an email/message
    setTimeout(() => {
      alert(`Message sent to ${talentName}!`);
      setSending(false);
      setMessage('');
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}>&times;</button>
        
        <h2 style={{ marginBottom: '10px', fontSize: '1.6rem' }}>Contact {talentName}</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '25px', fontSize: '0.9rem' }}>
          Send a professional message to build your next big project together.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Message</label>
            <textarea 
              placeholder={`Hi ${talentName}, we're interested in your profile...`}
              style={{ width: '100%', minHeight: '150px', padding: '15px', borderRadius: '12px', border: '1px solid #eee', marginTop: '10px', fontSize: '1rem', background: '#f9f9f9', outline: 'none' }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          
          <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '25px', lineHeight: '1.4' }}>
            Your message will be securely delivered to {talentName}'s inbox.
          </p>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px' }} disabled={sending}>
            {sending ? 'Sending Message...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactModal;
