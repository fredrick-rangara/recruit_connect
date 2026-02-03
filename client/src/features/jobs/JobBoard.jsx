import React, { useState } from 'react';
import FilterSidebar from './FilterSidebar';
import JobCard from './JobCard';
import './JobBoard.css';

/**
 * JobBoard Component: The main search and browse interface for jobs.
 */
const JobBoard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for initial listing
  const jobs = [
    { id: 1, title: 'Senior Frontend Developer', company: 'TechFlow', location: 'Remote', salary: '$120k', type: 'Full-time', tags: ['React', 'TypeScript', 'Tailwind'] },
    { id: 2, title: 'Backend Engineer', company: 'DataScale', location: 'Austin, TX', salary: '$140k', type: 'Full-time', tags: ['Python', 'Django', 'PostgreSQL'] },
    { id: 3, title: 'Product Designer', company: 'CreativeMind', location: 'London, UK', salary: '$95k', type: 'Contract', tags: ['Figma', 'UI/UX', 'System Design'] },
    { id: 4, title: 'Mobile Developer', company: 'Appify', location: 'Remote', salary: '$110k', type: 'Full-time', tags: ['React Native', 'iOS', 'Android'] },
    { id: 5, title: 'DevOps Engineer', company: 'CloudBase', location: 'Berlin, DE', salary: '$130k', type: 'Full-time', tags: ['AWS', 'Docker', 'Kubernetes'] },
    { id: 6, title: 'Marketing Manager', company: 'BrandBoost', location: 'Remote', salary: '$85k', type: 'Part-time', tags: ['SEO', 'Content', 'Social'] },
  ];

  return (
    <div className="job-board-container">
      {/* Search Header */}
      <header className="job-board-header">
        <div className="header-content">
          <h1 className="board-title">Find your dream job today</h1>
          <p className="board-subtitle">Explore 10,000+ opportunities across top tech companies worldwide.</p>
          
          <div className="board-search-bar">
            <span className="search-icon-large">🔍</span>
            <input 
              type="text" 
              placeholder="Search by job title, company, or keywords..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="board-search-btn">Search</button>
          </div>
        </div>
      </header>

      <div className="job-board-main">
        <FilterSidebar />
        
        <div className="job-listings-area">
          <div className="listing-status">
            <span>Showing {jobs.length} jobs available</span>
            <div className="sort-by">
              Sort by: <select><option>Newest First</option><option>Salary (High to Low)</option></select>
            </div>
          </div>
          
          <div className="job-grid-items">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          <div className="pagination-mock">
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <span className="page-dots">...</span>
            <button className="page-btn">12</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobBoard;
