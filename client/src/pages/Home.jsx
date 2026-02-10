import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustedBy from '../components/TrustedBy';
import FeaturedJobs from '../components/FeaturedJobs';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

// Dummy data moved to a constant to simulate a database/API response
const ALL_JOBS = [
  { title: "Junior Software Developer", company: "Slack", location: "Remote", type: "Full Time", salary: "$70k - $90k", logoBg: "bg-purple-600" },
  { title: "UI/UX Designer", company: "Adobe", location: "San Francisco, CA", type: "Full Time", salary: "$100k - $120k", logoBg: "bg-red-500" },
  { title: "Product Manager", company: "Google", location: "Mountain View, CA", type: "Hybrid", salary: "$130k - $160k", logoBg: "bg-blue-500" },
  { title: "Backend Engineer", company: "Airbnb", location: "Remote", type: "Contract", salary: "$80/hr", logoBg: "bg-rose-500" },
];

const Home = () => {
  const [filteredJobs, setFilteredJobs] = useState(ALL_JOBS);

  // This function is passed to the Hero component
  const handleSearch = ({ keyword, location }) => {
    const results = ALL_JOBS.filter(job => 
      job.title.toLowerCase().includes(keyword.toLowerCase()) &&
      job.location.toLowerCase().includes(location.toLowerCase())
    );
    setFilteredJobs(results);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero now receives the handleSearch function */}
      <Hero onSearch={handleSearch} />
      
      <TrustedBy />
      
      {/* FeaturedJobs now receives the filtered list */}
      <FeaturedJobs jobs={filteredJobs} />
      
      <Testimonials />
      
      <Footer />
    </div>
  );
};

export default Home;