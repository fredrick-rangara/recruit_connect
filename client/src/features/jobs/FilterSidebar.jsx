import React from 'react';
import './FilterSidebar.css';

/**
 * FilterSidebar: Component for refining job listings based on various criteria.
 */
const FilterSidebar = () => {
  return (
    <aside className="filter-sidebar">
      <div className="filter-section">
        <h3 className="filter-title">Job Type</h3>
        <div className="filter-options">
          {['Full-time', 'Contract', 'Part-time', 'Remote'].map(type => (
            <label key={type} className="filter-checkbox">
              <input type="checkbox" />
              <span className="checkbox-custom"></span>
              {type}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">Experience Level</h3>
        <div className="filter-options">
          {['Entry Level', 'Mid Level', 'Senior Level', 'Director'].map(level => (
            <label key={level} className="filter-checkbox">
              <input type="checkbox" />
              <span className="checkbox-custom"></span>
              {level}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">Salary Range</h3>
        <div className="filter-range">
          <input type="range" min="0" max="200" className="salary-slider" />
          <div className="range-display">
            <span>$0</span>
            <span>$200k+</span>
          </div>
        </div>
      </div>

      <button className="reset-filter-btn">Clear All Filters</button>
    </aside>
  );
};

export default FilterSidebar;
