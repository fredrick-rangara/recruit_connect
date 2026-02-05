import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    keyword: '',
    location: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(filters); 
  };

  return (
    <div className="search-container" style={{ margin: '20px 0', width: '100%' }}>
      <form onSubmit={handleSearch} style={{
        display: 'flex',
        gap: '10px',
        backgroundColor: '#fff',
        padding: '10px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #eee'
      }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', borderRight: '1px solid #eee' }}>
          <span style={{ padding: '0 10px', color: '#999' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Job title, company, or keywords"
            value={filters.keyword}
            onChange={(e) => setFilters({...filters, keyword: e.target.value})}
            style={{ border: 'none', outline: 'none', width: '100%', padding: '10px' }}
          />
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <span style={{ padding: '0 10px', color: '#999' }}>📍</span>
          <input 
            type="text" 
            placeholder="City or state"
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
            style={{ border: 'none', outline: 'none', width: '100%', padding: '10px' }}
          />
        </div>

        <button type="submit" className="btn-purple-main" style={{ width: 'auto', padding: '10px 30px' }}>
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;