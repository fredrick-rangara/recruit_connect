import React, { useState } from 'react';
import './ProfileSettings.css';

/**
 * ProfileSettings Component: Allows users to update their personal information,
 * password, and preferences.
 */
const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    fullName: 'Abigael',
    email: 'abigael@example.com',
    phone: '+1 234 567 890',
    location: 'Nairobi, Kenya',
    bio: 'Passionate frontend developer looking for new opportunities in React.',
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  return (
    <div className="settings-container">
      <header className="settings-header">
        <h1>Profile Settings</h1>
        <p>Update your personal information and account security.</p>
      </header>

      <div className="settings-grid">
        {/* Personal Info Form */}
        <section className="settings-card">
          <h2 className="card-title">Personal Information</h2>
          <form className="settings-form" onSubmit={handleUpdate}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={profile.fullName} 
                  onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="text" 
                  value={profile.phone} 
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={profile.email} readOnly disabled className="disabled-input" />
              <small>Email cannot be changed.</small>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input 
                type="text" 
                value={profile.location} 
                onChange={(e) => setProfile({...profile, location: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Professional Bio</label>
              <textarea 
                value={profile.bio} 
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
              ></textarea>
            </div>

            <button type="submit" className="save-settings-btn" disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </section>

        {/* Account Security Placeholder */}
        <section className="settings-card secondary">
          <h2 className="card-title">Security</h2>
          <div className="security-item">
            <div>
              <h3>Change Password</h3>
              <p>Update your password to stay secure.</p>
            </div>
            <button className="outline-btn">Update</button>
          </div>
          <div className="security-item">
            <div>
              <h3>Two-Factor Authentication</h3>
              <p>Add an extra layer of security to your account.</p>
            </div>
            <button className="outline-btn">Enable</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileSettings;
