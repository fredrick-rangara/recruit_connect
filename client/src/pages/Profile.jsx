import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../store/authSlice';
import API from '../api';
import { toast } from 'react-hot-toast';

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    biography: user?.biography || '',
    interests: user?.interests || ''
  });

  const handleEditToggle = () => {
    if (!isEditing) {
        setFormData({
            username: user?.username || '',
            biography: user?.biography || '',
            interests: user?.interests || ''
        });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
        const res = await API.patch('/auth/me', formData);
        dispatch(updateUser(res.data));
        toast.success('Profile updated successfully!');
        setIsEditing(false);
    } catch (err) {
        toast.error('Failed to update profile.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '80px 0', maxWidth: '600px' }}>
      <div className="job-card" style={{ padding: '40px', borderLeftWidth: '10px' }}>
        <h1 style={{ marginBottom: '30px' }}>Your Profile</h1>
        
        {isEditing ? (
            <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                   <label style={{ fontWeight: '600' }}>Username</label>
                   <input 
                      type="text" 
                      className="btn" 
                      style={{ width: '100%', border: '1px solid #e2e8f0', cursor: 'text', padding: '10px', marginTop: '5px' }}
                      value={formData.username}
                      onChange={e => setFormData({...formData, username: e.target.value})}
                   />
                </div>
                <div>
                   <label style={{ fontWeight: '600' }}>Biography</label>
                   <textarea 
                      className="btn" 
                      style={{ width: '100%', border: '1px solid #e2e8f0', cursor: 'text', padding: '10px', marginTop: '5px', borderRadius: '8px', minHeight: '100px' }}
                      value={formData.biography}
                      onChange={e => setFormData({...formData, biography: e.target.value})}
                      placeholder="Tell us about yourself..."
                   />
                </div>
                <div>
                   <label style={{ fontWeight: '600' }}>Interests</label>
                   <input 
                      type="text" 
                      className="btn" 
                      style={{ width: '100%', border: '1px solid #e2e8f0', cursor: 'text', padding: '10px', marginTop: '5px' }}
                      value={formData.interests}
                      onChange={e => setFormData({...formData, interests: e.target.value})}
                      placeholder="Coding, Design, AI..."
                   />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button className="btn" style={{ flex: 1, background: '#e2e8f0', color: '#475569' }} onClick={handleEditToggle} disabled={loading}>
                        Cancel
                    </button>
                </div>
            </div>
        ) : (
            <>
                <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                    <label style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Username</label>
                    <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>{user?.username || 'user'}</p>
                </div>
                <div>
                    <label style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Email Address</label>
                    <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>{user?.email || 'email@example.com'}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Account Type</label>
                        <p style={{ fontSize: '1.2rem', fontWeight: '600', textTransform: 'capitalize' }}>{user?.role || 'seeker'}</p>
                    </div>
                    <div>
                         <label style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Interests</label>
                         <p style={{ fontSize: '1.1rem', color: '#475569' }}>{user?.interests || 'None listed'}</p>
                    </div>
                </div>
                <div>
                    <label style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Biography</label>
                    <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#334155' }}>{user?.biography || 'No biography added yet.'}</p>
                </div>
                </div>
                <button className="btn btn-primary" style={{ marginTop: '40px', width: '100%' }} onClick={handleEditToggle}>Edit Profile</button>
            </>
        )}
      </div>
    </div>
  );
}

export default Profile;
