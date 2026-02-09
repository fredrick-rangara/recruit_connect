import React, { useEffect, useState } from 'react';
import { Search, MapPin, Briefcase } from 'lucide-react';
import API from '../services/api';
import JobCard from '../components/jobs/JobCard'; // We'll create this reusable component

const Home = () => {
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    // Fetch top 4 recent jobs for the homepage
    const fetchRecentJobs = async () => {
      try {
        const res = await API.get('/jobs?limit=4');
        setRecentJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs", err);
      }
    };
    fetchRecentJobs();
  }, []);

  return (
    <div className="home-container">
      {/* 1. Hero Section */}
      <section className="hero bg-dark text-white text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Find Your Dream Job Today!</h1>
        <p className="text-gray-400 mb-8">Connecting Talent with Opportunities for a Better Future.</p>
        
        <div className="search-bar-container bg-white p-4 rounded-lg shadow-lg flex items-center gap-4 max-w-4xl mx-auto">
          <div className="flex items-center flex-1 border-r pr-4">
            <Search className="text-purple-600 mr-2" size={20} />
            <input type="text" placeholder="Job title or Company" className="w-full outline-none text-black" />
          </div>
          <div className="flex items-center flex-1">
            <MapPin className="text-purple-600 mr-2" size={20} />
            <input type="text" placeholder="Select Location" className="w-full outline-none text-black" />
          </div>
          <button className="bg-purple-600 text-white px-8 py-2 rounded-md hover:bg-purple-700 transition">
            Search Job
          </button>
        </div>
      </section>

      {/* 2. Partner Logos */}
      <section className="partners py-8 border-b flex justify-center gap-12 grayscale opacity-60">
        <span>Slack</span>
        <span>Adobe</span>
        <span>Asana</span>
        <span>Linear</span>
      </section>

      {/* 3. Recent Job Listings */}
      <section className="recent-jobs max-w-6xl mx-auto py-16 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Recent Job Listings</h2>
          <a href="/jobs" className="text-purple-600 font-semibold hover:underline">View all</a>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {recentJobs.length > 0 ? (
            recentJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <p className="text-center text-gray-500">Loading current opportunities...</p>
          )}
        </div>
      </section>

      {/* 4. Testimonials (Static for now) */}
      <section className="testimonials bg-blue-50 py-16">
        <h2 className="text-center text-2xl font-bold mb-10">Testimonials from Our Customers</h2>
        <div className="flex justify-center gap-8 overflow-x-auto px-4">
           {/* Map through your testimonial cards here */}
        </div>
      </section>
    </div>
  );
};

export default Home;