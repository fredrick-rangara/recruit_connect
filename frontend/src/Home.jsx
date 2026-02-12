import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSlack, FaAtlassian, FaDigitalOcean } from 'react-icons/fa';
import { SiOkta, SiLinear, SiAdobe } from 'react-icons/si';

export default function Home() {
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Ref for scrolling
  const jobsSectionRef = useRef(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minSalary, setMinSalary] = useState(0);
  
  const navigate = useNavigate();
  const categories = ["All", "Remote", "Engineering", "Design", "Marketing"];

  useEffect(() => {
    const fetchJobs = axios.get("http://localhost:5000/api/jobs");
    const fetchTestimonials = axios.get("http://localhost:5000/api/testimonials");

    Promise.all([fetchJobs, fetchTestimonials])
      .then(([jobsRes, testRes]) => {
        setAllJobs(jobsRes.data);
        setFilteredJobs(jobsRes.data);
        setTestimonials(testRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading data:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = allJobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            job.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = job.location.toLowerCase().includes(locationQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || 
                              (selectedCategory === "Remote" 
                                ? job.location.toLowerCase().includes("remote") 
                                : job.title.toLowerCase().includes(selectedCategory.toLowerCase()));
      const salaryValue = parseInt(job.salary?.replace(/[^0-9]/g, "")) || 0;
      const matchesSalary = minSalary === 0 || salaryValue >= minSalary;

      return matchesSearch && matchesLocation && matchesCategory && matchesSalary;
    });
    setFilteredJobs(filtered);
  }, [searchQuery, locationQuery, selectedCategory, minSalary, allJobs]);

  const scrollToJobs = () => {
    jobsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pt-20">
      <header className="relative h-[600px] bg-slate-900 flex items-center justify-center text-center overflow-hidden mx-4 my-4 rounded-[40px]">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          alt="Office Background"
        />
        <div className="relative z-10 px-4 w-full max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
            Find Your <span className="text-purple-400">Dream Job</span> Today
          </h1>
          
          <div className="bg-white p-2 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-2 mb-8 border border-white/20">
            <div className="flex-1 flex items-center px-4">
              <span className="text-slate-400 mr-2">🔍</span>
              <input
                className="w-full p-4 outline-none font-bold text-slate-700"
                placeholder="Job title or keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={scrollToJobs}
              className="bg-purple-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-black transition-all"
            >
              Find Jobs
            </button>
          </div>
        </div>
      </header>

      {/* TRUST BAR */}
      <div className="bg-black py-16 mx-4 rounded-[40px] mb-10">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-12 md:gap-20 items-center px-6">
          {[
            { icon: <FaSlack />, name: "Slack" },
            { icon: <SiAdobe />, name: "Adobe" },
            { icon: <SiOkta />, name: "Okta" },
            { icon: <SiLinear />, name: "Linear" },
            { icon: <FaAtlassian />, name: "Atlassian" },
            { icon: <FaDigitalOcean />, name: "Ocean" }
          ].map((brand, idx) => (
            <div key={idx} className="flex items-center gap-3 text-white/30 hover:text-white transition-all duration-300 group">
              <span className="text-3xl md:text-4xl group-hover:text-purple-400 transition-colors">
                {brand.icon}
              </span>
              <span className="text-lg md:text-xl font-black tracking-tighter uppercase hidden sm:block">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* JOB LISTINGS - Ref attached here */}
      <main ref={jobsSectionRef} id="job-listings" className="max-w-5xl mx-auto py-20 px-4">
        <div className="space-y-5 mb-24">
          {filteredJobs.map((job) => (
            <div key={job.id} className="group border border-slate-200 p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between hover:border-purple-600 hover:shadow-2xl transition-all bg-white gap-6">
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-300 group-hover:text-purple-600 transition-colors">
                  {job.company?.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-black group-hover:text-purple-600 transition-colors">{job.title}</h3>
                  <p className="text-slate-500 font-semibold">{job.company} • {job.location}</p>
                </div>
              </div>
              <button onClick={() => navigate(`/jobs/${job.id}`)} className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-black transition-all">
                Job Details
              </button>
            </div>
          ))}
        </div>

        {/* TESTIMONIALS */}
        <section className="pb-20">
          <div className="text-center mb-12">
            <span className="text-purple-600 font-black text-xs uppercase tracking-widest">Community</span>
            <h2 className="text-4xl font-black tracking-tight mt-2">User Feedback</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex text-yellow-400 mb-4 text-xs">{"★".repeat(t.rating || 5)}</div>
                <p className="text-slate-600 font-medium italic mb-6">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white font-black">
                    {t.name ? t.name[0].toUpperCase() : "?"}
                  </div>
                  <span className="font-bold text-slate-900">{t.name || "Anonymous"}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}