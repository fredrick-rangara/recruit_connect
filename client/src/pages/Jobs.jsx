import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, MapPin, Briefcase, Clock, DollarSign } from 'lucide-react';

const JobsPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <div className="bg-slate-900 py-16 text-center text-white">
        <h1 className="text-4xl font-bold">Jobs</h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-1/4 space-y-6 bg-white p-6 rounded-2xl shadow-sm h-fit">
          <div>
            <h3 className="font-bold mb-4">Search by Job Title</h3>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input type="text" placeholder="Job title or company" className="w-full pl-10 p-2 bg-slate-50 rounded-lg border-none" />
            </div>
          </div>
          
          <FilterGroup title="Job Type" options={['Full Time', 'Part Time', 'Freelance', 'Contract']} />
          <FilterGroup title="Experience Level" options={['No-experience', 'Fresher', 'Intermediate', 'Expert']} />
          
          <div>
            <h3 className="font-bold mb-4">Salary Range</h3>
            <input type="range" className="w-full accent-indigo-600" min="50" max="10000" />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>$50</span><span>$10,000</span>
            </div>
          </div>
        </aside>

        {/* Job Listings Area */}
        <main className="flex-1 space-y-4">
          <div className="flex justify-between items-center mb-6">
            <p className="text-slate-500">Showing 5-6 of 10 results</p>
            <select className="bg-white border-none rounded-lg p-2 text-sm shadow-sm">
              <option>Sort by latest</option>
            </select>
          </div>
          
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold">RC</div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Junior Software Developer</h3>
                  <p className="text-sm text-slate-500">RecruitConnect Tech</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Briefcase size={14}/> Technology</span>
                    <span className="flex items-center gap-1"><Clock size={14}/> Full Time</span>
                    <span className="flex items-center gap-1"><DollarSign size={14}/> $40k-$60k</span>
                    <span className="flex items-center gap-1"><MapPin size={14}/> Remote</span>
                  </div>
                </div>
              </div>
              <button className="bg-indigo-600/10 text-indigo-600 px-6 py-2 rounded-lg font-bold hover:bg-indigo-600 hover:text-white transition">
                Job Details
              </button>
            </div>
          ))}
        </main>
      </div>
      <Footer />
    </div>
  );
};

const FilterGroup = ({ title, options }) => (
  <div className="border-t border-slate-100 pt-6">
    <h3 className="font-bold mb-4">{title}</h3>
    {options.map(opt => (
      <label key={opt} className="flex items-center gap-2 text-sm text-slate-600 mb-2 cursor-pointer">
        <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-600" /> {opt}
      </label>
    ))}
  </div>
);

export default JobsPage;