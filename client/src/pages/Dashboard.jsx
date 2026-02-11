import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function Dashboard() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [appsRes, savedRes] = await Promise.all([
          API.get('/applications/me'),
          API.get('/jobs/saved')
        ]);
        setApplications(appsRes.data);
        setSavedJobs(savedRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  // Calculate profile strength
  const profileStrength = () => {
    let score = 25; // Base score
    if (user?.biography) score += 25;
    if (user?.interests) score += 25;
    // Mock resume check (would need real user data field)
    if (applications.length > 0) score += 25;
    return score;
  };

  const handleQuickUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      try {
        await API.post('/upload', formData);
        import('react-hot-toast').then(({ toast }) => toast.success('CV Uploaded and Profile Updated!'));
        // In real app, would verify this updates user profile
      } catch (err) {
        import('react-hot-toast').then(({ toast }) => toast.error('Upload failed'));
      }
  };

  if (loading) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="container" style={{ padding: '40px 20px', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b' }}>Welcome back, {user?.username}!</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             <div style={{textAlign: 'right'}}>
                <div style={{fontSize: '0.8rem', color: '#64748b'}}>Profile Strength</div>
                <div style={{fontWeight: '700', color: '#3b82f6', fontSize: '1.2rem'}}>{profileStrength()}%</div>
             </div>
             <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                {user?.username?.charAt(0).toUpperCase()}
             </div>
        </div>
      </div>

      <div style={{ 
        background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', 
        borderRadius: '20px', 
        padding: '30px', 
        color: 'white', 
        boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '40px'
      }}>
        <div>
           <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
              <span style={{ fontSize: '1.5rem' }}>📤</span>
           </div>
           <h2 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>Upload Your CV</h2>
           <p style={{ opacity: 0.9 }}>Boost your profile visibility by 90%</p>
        </div>
        <label className="btn" style={{ background: 'white', color: '#6366f1', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
            Browse Files
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleQuickUpload} style={{ display: 'none' }} />
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
           <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px', color: '#1e293b' }}>Application Tracker</h3>
           {applications.length === 0 ? (
               <p style={{ color: '#64748b', textAlign: 'center', padding: '40px 0' }}>No active applications. Start applying!</p>
           ) : (
               applications.slice(0, 3).map(app => (
                   <div key={app.id} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                           <span style={{ fontWeight: '600', color: '#1e293b' }}>{app.job.title}</span>
                           <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Under Review: {app.job.company?.name}</span>
                       </div>
                       <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                           <div style={{ 
                               height: '100%', 
                               background: '#3b82f6', 
                               width: app.status === 'hired' ? '100%' : app.status === 'interview' ? '75%' : app.status === 'screening' ? '50%' : '25%',
                               borderRadius: '4px'
                           }}></div>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '0.75rem', color: '#94a3b8' }}>
                           <span>Applied</span>
                           <span>Screening</span>
                           <span>Interview</span>
                           <span>Offer</span>
                       </div>
                   </div>
               ))
           )}
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px', color: '#1e293b' }}>Profile Strength</h3>
            <div style={{ fontSize: '3rem', fontWeight: '800', color: '#6366f1', marginBottom: '5px' }}>{profileStrength()}%</div>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Great job! Keep adding details.</p>
        </div>
      </div>

      {/* Saved Jobs Section */}
      <div style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '25px', fontSize: '1.5rem', fontWeight: '800' }}>Saved Jobs</h2>
          {savedJobs.length === 0 ? (
            <p style={{ color: '#64748b' }}>No saved jobs yet. Browse jobs to save them!</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {savedJobs.map((job) => (
                <div key={job.id} onClick={() => navigate(`/jobs/${job.id}`)} style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ fontWeight: '700', color: '#1e293b', marginBottom: '5px' }}>{job.title}</div>
                  <div style={{ fontSize: '0.9rem', color: '#64748b' }}>{job.company?.name || 'Partner Company'}</div>
                  <div style={{ marginTop: '15px', color: '#3b82f6', fontSize: '0.85rem', fontWeight: '600' }}>View Details →</div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}

export default Dashboard;
