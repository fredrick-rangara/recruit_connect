import React, { useState } from 'react';

function ContactUs() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✉️</div>
        <h1>Message Received!</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>We'll get back to you within 24 hours. Hang tight!</p>
        <button className="btn btn-primary" style={{ marginTop: '30px' }} onClick={() => window.location.href = '/'}>Go back Home</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '80px 20px', maxWidth: '600px' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px', textAlign: 'center' }}>Get in Touch</h1>
      <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '50px' }}>Have questions? Our team is here to help you navigate your journey.</p>

      <div className="job-card" style={{ padding: '40px', borderRadius: '24px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Full Name</label>
            <input type="text" className="btn" style={{ width: '100%', border: '1px solid #e2e8f0', cursor: 'text', padding: '12px' }} placeholder="John Doe" required />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Email Address</label>
            <input type="email" className="btn" style={{ width: '100%', border: '1px solid #e2e8f0', cursor: 'text', padding: '12px' }} placeholder="john@example.com" required />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Message</label>
            <textarea className="btn" style={{ width: '100%', minHeight: '150px', border: '1px solid #e2e8f0', cursor: 'text', padding: '12px', borderRadius: '12px' }} placeholder="How can we help?" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }}>Send Message</button>
        </form>
      </div>

      <div style={{ marginTop: '50px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'center' }}>
        <div>
          <h4 style={{ marginBottom: '5px' }}>Email Us</h4>
          <p style={{ color: '#3b82f6', fontWeight: '500' }}>support@recruitconnect.com</p>
        </div>
        <div>
          <h4 style={{ marginBottom: '5px' }}>Visit Us</h4>
          <p style={{ color: '#64748b' }}>Nairobi, Kenya</p>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
