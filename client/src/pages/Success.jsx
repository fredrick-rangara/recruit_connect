import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#f8fafc',
      padding: '20px' 
    }}>
      {/* CSS Animations */}
      <style>
        {`
          @keyframes popIn {
            0% { transform: scale(0.5); opacity: 0; }
            70% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-pop { animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both; }
          .animate-slide { animation: slideUp 0.8s ease out both; animation-delay: 0.2s; }
        `}
      </style>

      <div className="animate-pop" style={{ 
        maxWidth: '500px', 
        width: '100%', 
        textAlign: 'center', 
        background: 'white', 
        padding: '50px 40px', 
        borderRadius: '24px', 
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ 
          fontSize: '5rem', 
          marginBottom: '20px',
          display: 'inline-block'
        }}>
          🎉
        </div>
        
        <div className="animate-slide">
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '16px' }}>
            Success!
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '32px' }}>
            Your message has traveled through the interwebs and landed safely in our inbox. 
            We'll be in touch soon!
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              onClick={() => navigate('/')} 
              className="btn-purple"
              style={{ padding: '16px', borderRadius: '12px', fontWeight: '700' }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;