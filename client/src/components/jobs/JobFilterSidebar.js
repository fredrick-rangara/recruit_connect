import React from 'react';

const JobFilterSidebar = ({ filters, setFilters }) => {
  const categories = ['Design', 'Software', 'Marketing', 'Finance', 'Management'];
  const jobTypes = ['Full-Time', 'Part-Time', 'Remote', 'Contract'];

  const handleCheckboxChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  return (
    <div className="bg-white p-6 border rounded-xl shadow-sm">
      <h3 className="font-bold mb-4 text-lg">Filters</h3>
      
      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="font-semibold text-sm mb-3">Category</h4>
        {categories.map(cat => (
          <label key={cat} className="flex items-center gap-2 mb-2 text-sm text-gray-600 cursor-pointer">
            <input 
              type="radio" 
              name="category" 
              className="accent-purple-600"
              onChange={() => handleCheckboxChange('category', cat)}
            />
            {cat}
          </label>
        ))}
      </div>

      {/* Job Type Filter */}
      <div className="mb-6 border-t pt-4">
        <h4 className="font-semibold text-sm mb-3">Job Type</h4>
        {jobTypes.map(type => (
          <label key={type} className="flex items-center gap-2 mb-2 text-sm text-gray-600 cursor-pointer">
            <input 
              type="checkbox" 
              className="accent-purple-600"
              onChange={() => handleCheckboxChange('jobType', type)}
            />
            {type}
          </label>
        ))}
      </div>

      <button 
        onClick={() => window.location.reload()}
        className="w-full text-purple-600 border border-purple-600 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition"
      >
        Reset All Filters
      </button>
    </div>
  );
};

export default JobFilterSidebar;