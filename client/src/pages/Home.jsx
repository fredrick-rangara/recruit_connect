import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { mockJobs } from "../data/mockJobs"; // Ensure this path is correct

const Home = () => {
  // --- State for Filters ---
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  // --- Filter Logic ---
  const [jobs, setJobs] = useState(mockJobs);

  useEffect(() => {
    const filtered = mockJobs.filter((job) => {
      const matchesKeyword = job.title.toLowerCase().includes(keyword.toLowerCase());
      const matchesLocation = job.location.toLowerCase().includes(location.toLowerCase());
      const matchesCategory = category ? job.category === category : true;
      return matchesKeyword && matchesLocation && matchesCategory;
    });
    setJobs(filtered);
  }, [keyword, location, category]);

  const resetSearch = () => {
    setKeyword("");
    setLocation("");
    setCategory("");
  };

  return (
    <div style={{ padding: "0", maxWidth: "100%", margin: "0 auto" }}>
      {/* --- Header Section --- */}
      <header style={{ textAlign: "center", padding: "60px 20px", background: "var(--bg-light)" }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px' }}>Explore Opportunities</h1>
        
        <div className="search-bar-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="search-field">
            <span>🔍</span>
            <input 
              type="text" 
              placeholder="Job title or keyword" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)} 
            />
          </div>
          <div className="search-field">
            <span>📍</span>
            <input 
              type="text" 
              placeholder="City or state" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', padding: '5px' }}>
            <button className="btn-purple" style={{ width: '120px' }}>Search</button>
            {(keyword || category || location) && (
              <button onClick={resetSearch} className="btn-outline" style={{ padding: '10px' }}>Reset</button>
            )}
          </div>
        </div>
      </header>

      {/* --- Logo Marquee --- */}
      <div className="logo-marquee">
        <div className="marquee-content">
          {[1, 2].map((loop) => (
            <React.Fragment key={loop}>
              <div className="marquee-item">🚀 TechFlow</div>
              <div className="marquee-item">☁️ CloudNine</div>
              <div className="marquee-item">⚡ SparkAI</div>
              <div className="marquee-item">🔷 PrismCore</div>
              <div className="marquee-item">🟢 GreenLeaf</div>
              <div className="marquee-item">🎯 AimHigh</div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
        {/* --- Testimonials --- */}
        <section className="testimonials-section">
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '10px' }}>Testimonials from Our Customers</h2>
          <p className="text-muted" style={{ marginBottom: '40px' }}>Trusted by professionals and companies worldwide.</p>
          
          <div className="testimonial-grid">
            {[
              { name: "Marco Kise", title: "Amazing services", text: "Found a senior role in weeks. The process was seamless.", initial: "M" },
              { name: "Kristin Hester", title: "Everything simple", text: "The dashboard layout is the best I've used for job hunting.", initial: "K" },
              { name: "Zion Cisneros", title: "Awesome, thank you!", text: "As an employer, I found top-tier talent effortlessly here.", initial: "Z" }
            ].map((t, i) => (
              <div key={i} className="testimonial-card">
                <div style={{ color: '#fbbf24', marginBottom: '10px' }}>★★★★★</div>
                <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>{t.title}</h4>
                <p className="text-muted" style={{ fontSize: '0.95rem', fontStyle: 'italic' }}>"{t.text}"</p>
                <div className="user-info">
                  <div className="user-avatar">{t.initial}</div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Happy Client</div>
                  </div>
                </div>
                <span className="quote-icon">“</span>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '60px 0' }} />

        {/* --- Category Filtering --- */}
        <section id="job-listings" style={{ scrollMarginTop: '100px', margin: '40px 0' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '15px' }}>Browse by Category</h3>
          <div className="category-pills">
            {['Technology', 'Marketing', 'Design', 'Commerce'].map(cat => (
              <label key={cat} className={`category-pill ${category === cat ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="category"
                  style={{ display: 'none' }}
                  checked={category === cat}
                  onChange={() => setCategory(cat)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </section>

        {/* --- Job Feed --- */}
        <main className="job-feed" style={{ marginTop: '20px', paddingBottom: '80px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>Latest Opportunities</h3>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="stat-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '20px', border: '1px solid #eee', borderRadius: '12px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div className="company-logo-placeholder">
                    {job.company ? job.company[0] : 'J'}
                  </div>
                  <div>
                    <h3 style={{ marginBottom: '4px', fontWeight: 700 }}>{job.title}</h3>
                    <p className="text-muted">{job.company} • {job.location}</p>
                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                      <span className="status-pill">💰 ${job.salary?.toLocaleString() || 'N/A'}</span>
                      <span className="status-pill">🏷️ {job.category}</span>
                    </div>
                  </div>
                </div>
                {/* Updated link to match the dual routes we set in App.jsx */}
                <Link to={`/jobs/${job.id}`} className="btn-purple" style={{ textDecoration: 'none', padding: '12px 24px' }}>
                  Details
                </Link>
              </div>
            ))
          ) : (
            <div className="stat-card" style={{ textAlign: 'center', padding: '60px' }}>
              <p className="text-muted">No jobs found matching your criteria.</p>
              <button onClick={resetSearch} className="btn-purple" style={{ width: 'auto', marginTop: '15px' }}>Clear all filters</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;