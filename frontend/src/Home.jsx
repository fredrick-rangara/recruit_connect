import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minSalary, setMinSalary] = useState(0);
  
  const navigate = useNavigate();

  const categories = ["All", "Remote", "Engineering", "Design", "Marketing"];

  useEffect(() => {
    axios.get("http://localhost:5000/api/jobs")
      .then((res) => {
        setAllJobs(res.data);
        setFilteredJobs(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Complex Filter Logic
  useEffect(() => {
    const filtered = allJobs.filter((job) => {
      // 1. Title/Company Search
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            job.company.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Location Search
      const matchesLocation = job.location.toLowerCase().includes(locationQuery.toLowerCase());
      
      // 3. Category Chip Logic
      const matchesCategory = selectedCategory === "All" || 
                              (selectedCategory === "Remote" 
                                ? job.location.toLowerCase().includes("remote") 
                                : job.title.toLowerCase().includes(selectedCategory.toLowerCase()));
      
      // 4. Salary Parsing (Extracts numbers from strings like "$100k")
      const salaryValue = parseInt(job.salary?.replace(/[^0-9]/g, "")) || 0;
      const matchesSalary = minSalary === 0 || salaryValue >= minSalary;

      return matchesSearch && matchesLocation && matchesCategory && matchesSalary;
    });
    setFilteredJobs(filtered);
  }, [searchQuery, locationQuery, selectedCategory, minSalary, allJobs]);

  const SkeletonCard = () => (
    <div className="border border-slate-100 p-6 rounded-2xl flex items-center justify-between animate-pulse bg-slate-50/50">
      <div className="flex items-center gap-6">
        <div className="w-14 h-14 bg-slate-200 rounded-xl"></div>
        <div className="space-y-3">
          <div className="h-3 w-20 bg-slate-200 rounded-full"></div>
          <div className="h-5 w-48 bg-slate-200 rounded-md"></div>
          <div className="h-4 w-32 bg-slate-200 rounded-md"></div>
        </div>
      </div>
      <div className="h-10 w-28 bg-slate-200 rounded-xl"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pt-20">
      {/* HERO WITH FILTERS */}
      <header className="relative h-[650px] bg-slate-900 flex items-center justify-center text-center overflow-hidden mx-4 my-4 rounded-[40px]">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          alt="Office Background"
        />
        <div className="relative z-10 px-4 w-full max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
            Find Your <span className="text-purple-400">Dream Job</span> Today
          </h1>
          
          {/* SEARCH BAR */}
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
            <div className="hidden md:block w-px bg-slate-100 h-10 self-center" />
            <div className="flex-1 flex items-center px-4">
              <span className="text-slate-400 mr-2">📍</span>
              <input
                className="w-full p-4 outline-none font-bold text-slate-700"
                placeholder="Location"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>
            <button className="bg-purple-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-black transition-all">
              Search
            </button>
          </div>

          {/* QUICK FILTERS */}
          <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full text-xs font-black transition-all uppercase tracking-widest ${
                    selectedCategory === cat 
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30" 
                    : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="h-8 w-px bg-white/20 mx-2 hidden md:block"></div>

            {/* SALARY SLIDER */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
                <label className="text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                  Min Salary: <span className="text-purple-400 text-sm ml-1">${minSalary}k</span>
                </label>
                <input 
                    type="range" min="0" max="200" step="10" 
                    value={minSalary} 
                    onChange={(e) => setMinSalary(parseInt(e.target.value))}
                    className="accent-purple-500 cursor-pointer w-24 md:w-32"
                />
            </div>
          </div>
        </div>
      </header>

      {/* TRUST BAR */}
      <div className="bg-black py-12 mx-4 rounded-[40px]">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-16 items-center">
            <img src="https://img.icons8.com/ios-filled/50/ffffff/slack.png" className="h-8 opacity-60 hover:opacity-100 transition-opacity" alt="Slack" />
            <img src="https://img.icons8.com/ios-filled/50/ffffff/adobe.png" className="h-8 opacity-60 hover:opacity-100 transition-opacity" alt="Adobe" />
            <img src="https://img.icons8.com/ios-filled/50/ffffff/okta.png" className="h-8 opacity-60 hover:opacity-100 transition-opacity" alt="Okta" />
            <img src="https://img.icons8.com/ios-filled/50/ffffff/linear.png" className="h-8 opacity-60 hover:opacity-100 transition-opacity" alt="Linear" />
        </div>
      </div>

      {/* LISTINGS */}
      <main className="max-w-5xl mx-auto py-20 px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tight">
              {searchQuery || locationQuery || selectedCategory !== "All" || minSalary > 0 ? "Search Results" : "Recent Job Listings"}
            </h2>
            <p className="text-slate-500 font-medium mt-2">
              Showing {filteredJobs.length} matching opportunities.
            </p>
          </div>
          {(searchQuery || locationQuery || selectedCategory !== "All" || minSalary > 0) && (
            <button 
              onClick={() => {
                setSearchQuery("");
                setLocationQuery("");
                setSelectedCategory("All");
                setMinSalary(0);
              }}
              className="text-purple-600 font-bold text-sm hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        <div className="space-y-5">
          {loading ? (
            <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="group border border-slate-200 p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between hover:border-purple-600 hover:shadow-2xl hover:shadow-purple-100 transition-all duration-300 bg-white gap-6"
              >
                <div className="flex items-center gap-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-300 text-xl group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                    {job.company?.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full uppercase tracking-widest">
                        {job.type || "Full-Time"}
                      </span>
                      <span className="text-purple-600 text-[10px] font-black px-3 py-1 bg-purple-50 rounded-full uppercase tracking-widest">
                        {job.salary || "Competitive"}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-purple-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-slate-500 font-semibold mt-1">
                      {job.company} <span className="mx-2 text-slate-300">•</span> {job.location}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="w-full md:w-auto bg-purple-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-black transition-all active:scale-95 shadow-xl shadow-purple-100"
                >
                  Job Details
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-bold text-xl">No jobs found matching your criteria.</p>
               <button onClick={() => {setSearchQuery(""); setLocationQuery(""); setSelectedCategory("All"); setMinSalary(0);}} className="mt-4 text-purple-600 font-bold hover:underline">Reset Search</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}