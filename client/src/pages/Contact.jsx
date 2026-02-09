import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Contact = () => {
  const navigate = useNavigate(); // Initialize navigation
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Redirect to success page on success
        navigate('/success');
      } else {
        const errData = await response.json();
        setStatus({ type: 'error', msg: errData.msg || "Failed to send message." });
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus({ type: 'error', msg: "Connection error. Is your Flask server running?" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page" style={{ padding: '80px 0', minHeight: '80vh', background: '#f8fafc' }}>
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>
        <div className="contact-wrapper" style={{ background: 'white', padding: '40px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <header className="contact-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '10px' }}>Get in touch</h1>
            <p style={{ color: '#64748b' }}>Have questions? We'd love to hear from you.</p>
          </header>

          {/* Error display (Success will now redirect) */}
          {status.type === 'error' && (
            <div style={{ 
              padding: '15px', 
              borderRadius: '10px', 
              marginBottom: '20px', 
              textAlign: 'center',
              fontWeight: '600',
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca'
            }}>
              {status.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px', color: '#334155' }}>Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="John Doe" 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                required 
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px', color: '#334155' }}>Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="john@example.com" 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                required 
              />
            </div>

            <div className="form-group" style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px', color: '#334155' }}>Message</label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                placeholder="How can we help?"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '120px', resize: 'vertical' }}
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="btn-purple" 
              disabled={loading}
              style={{ width: '100%', padding: '16px', borderRadius: '12px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;