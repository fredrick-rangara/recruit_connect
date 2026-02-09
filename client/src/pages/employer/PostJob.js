import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';
import API from '../../services/api';

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    location: '',
    category: 'Software',
    salary_range: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/jobs', formData);
      alert("Job posted successfully!");
      navigate('/recruitment-hub'); // Go back to dashboard
    } catch (err) {
      alert("Error posting job. Please check all fields.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-500 hover:text-purple-600 mb-6 transition"
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="bg-white p-8 rounded-2xl border shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Post a New Position</h1>
        <p className="text-gray-500 mb-8">Fill in the details below to find your next great hire.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Job Title</label>
              <input 
                type="text" 
                placeholder="e.g. Senior UI Designer"
                className="w-full p-3 border rounded-xl outline-none focus:border-purple-600"
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company Name</label>
              <input 
                type="text" 
                placeholder="Your Company"
                className="w-full p-3 border rounded-xl outline-none focus:border-purple-600"
                onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input 
                type="text" 
                placeholder="e.g. Remote or Nairobi, KE"
                className="w-full p-3 border rounded-xl outline-none focus:border-purple-600"
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Salary Range</label>
              <input 
                type="text" 
                placeholder="e.g. $5k - $8k"
                className="w-full p-3 border rounded-xl outline-none focus:border-purple-600"
                onChange={(e) => setFormData({...formData, salary_range: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Job Description</label>
            <textarea 
              placeholder="Describe the role, responsibilities, and perks..."
              className="w-full p-3 border rounded-xl h-40 outline-none focus:border-purple-600"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            ></textarea>
          </div>

          <button 
            type="submit"
            className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition"
          >
            <Send size={18} /> Publish Job Listing
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;