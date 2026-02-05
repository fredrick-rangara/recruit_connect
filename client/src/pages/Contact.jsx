import React from 'react';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! We'll get back to you soon.");
  };

  return (
    <div className="container">
      <div className="contact-container">
        {/* HEADER SECTION */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontWeight: 800, fontSize: '2.5rem', marginBottom: '10px' }}>
            Get in touch
          </h1>
          <p className="text-muted">
            Have questions? We'd love to hear from you.
          </p>
        </header>

        {/* CONTACT FORM */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="john@example.com" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea 
              placeholder="How can we help?"
              required
              style={{ 
                width: '100%', 
                padding: '14px', 
                borderRadius: '10px', 
                border: '1px solid var(--border-color)', 
                minHeight: '150px',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: '1rem'
              }}
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="btn-purple" 
            style={{ marginTop: '10px', fontSize: '1.1rem' }}
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;