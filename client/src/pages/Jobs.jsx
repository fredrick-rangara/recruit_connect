import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../store/jobsSlice';
import JobCard from '../components/JobCard';

function Jobs() {
  const dispatch = useDispatch();
  const jobsState = useSelector((state) => state.jobs) || { list: [], status: 'idle' };
  const { list: jobs, status } = jobsState;

  const [filters, setFilters] = useState({
    title: '',
    location: '',
    category: [],
    type: [], // full-time, part-time
    experience: [] // senior, junior
  });

  useEffect(() => {
    dispatch(fetchJobs()).catch(console.error);
  }, [dispatch]);

  const handleCheckbox = (field, value) => {
    setFilters(prev => {
        const current = prev[field];
        if (current.includes(value)) {
            return { ...prev, [field]: current.filter(item => item !== value) };
        } else {
            return { ...prev, [field]: [...current, value] };
        }
    });
  };

  const filteredJobs = jobs.filter(job => {
      if (filters.title && !job.title.toLowerCase().includes(filters.title.toLowerCase()) && !job.company?.name.toLowerCase().includes(filters.title.toLowerCase())) return false;
      if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.category.length > 0 && !filters.category.includes(job.category)) return false;
      // Mock logic for fields that might not exist in backend model yet
      if (filters.type.length > 0) return true; // Placeholder
      if (filters.experience.length > 0) return true; // Placeholder
      return true;
  });

  return (
    <div className="container" style={{ padding: '40px 20px', display: 'grid', gridTemplateColumns: '250px 1fr', gap: '40px' }}>
      
      {/* Sidebar Filters */}
      <aside style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', height: 'fit-content' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Search Filters</h3>
        
        <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Search by Job Title</label>
            <input 
                type="text" 
                placeholder="Job Title or Company" 
                className="btn"
                style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', cursor: 'text' }}
                value={filters.title}
                onChange={e => setFilters({...filters, title: e.target.value})}
            />
        </div>

        <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Location</label>
            <input 
                type="text" 
                placeholder="Choose city" 
                className="btn"
                style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', cursor: 'text' }}
                value={filters.location}
                onChange={e => setFilters({...filters, location: e.target.value})}
            />
        </div>

        <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Category</label>
            {['Engineering', 'Design', 'Marketing', 'Sales', 'Customer Support'].map(cat => (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                    <input 
                        type="checkbox" 
                        id={`cat-${cat}`} 
                        checked={filters.category.includes(cat)}
                        onChange={() => handleCheckbox('category', cat)}
                        style={{ marginRight: '8px' }}
                    />
                    <label htmlFor={`cat-${cat}`} style={{ fontSize: '0.9rem', color: '#64748b' }}>{cat}</label>
                </div>
            ))}
        </div>

        <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Job Type</label>
            {['Full Time', 'Part Time', 'Freelance', 'Contract'].map(type => (
                <div key={type} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                    <input 
                        type="checkbox" 
                        id={`type-${type}`}
                        checked={filters.type.includes(type)}
                        onChange={() => handleCheckbox('type', type)}
                        style={{ marginRight: '8px' }}
                    />
                    <label htmlFor={`type-${type}`} style={{ fontSize: '0.9rem', color: '#64748b' }}>{type}</label>
                </div>
            ))}
        </div>
        
        <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '10px' }}
            onClick={() => setFilters({ title: '', location: '', category: [], type: [], experience: [] })}
        >
            Reset Filters
        </button>
      </aside>

      {/* Main Content */}
      <main>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Showing {filteredJobs.length} results</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Sort by:</span>
                <select className="btn" style={{ padding: '8px', border: '1px solid #e2e8f0' }}>
                    <option>Latest</option>
                    <option>Oldest</option>
                </select>
            </div>
        </div>

        <div className="job-list">
            {status === 'loading' ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
            ) : filteredJobs.length > 0 ? (
                filteredJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                ))
            ) : (
                <div style={{ textAlign: 'center', padding: '50px', background: '#f8fafc', borderRadius: '12px' }}>
                    No jobs found. Try adjusting your filters.
                </div>
            )}
        </div>
      </main>
    </div>
  );
}

export default Jobs;
