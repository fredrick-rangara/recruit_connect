import React from 'react';
import { MapPin, Clock, DollarSign } from 'lucide-react';

const JobCard = ({ title, company, location, type, salary, logoBg }) => (
  <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-lg transition-shadow cursor-pointer group">
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 ${logoBg} rounded-xl flex items-center justify-center text-white font-bold text-xl`}>
        {company[0]}
      </div>
      <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
        {type}
      </span>
    </div>
    
    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{title}</h3>
    <p className="text-slate-500 text-sm mb-4">{company}</p>
    
    <div className="space-y-2 mb-6">
      <div className="flex items-center text-slate-500 text-sm">
        <MapPin size={16} className="mr-2" /> {location}
      </div>
      <div className="flex items-center text-slate-500 text-sm">
        <DollarSign size={16} className="mr-2" /> {salary} / Year
      </div>
    </div>

    <button className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">
      Apply Now
    </button>
  </div>
);

const FeaturedJobs = () => {
  const jobs = [
    { title: "Junior Software Developer", company: "Slack", location: "Remote", type: "Full Time", salary: "$70k - $90k", logoBg: "bg-purple-600" },
    { title: "UI/UX Designer", company: "Adobe", location: "San Francisco, CA", type: "Full Time", salary: "$100k - $120k", logoBg: "bg-red-500" },
    { title: "Product Manager", company: "Google", location: "Mountain View, CA", type: "Hybrid", salary: "$130k - $160k", logoBg: "bg-blue-500" },
    { title: "Backend Engineer", company: "Airbnb", location: "Remote", type: "Contract", salary: "$80/hr", logoBg: "bg-rose-500" },
  ];

  return (
    <section className="py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Featured Job Circulars</h2>
            <p className="text-slate-500 mt-2">Find the latest jobs from top companies</p>
          </div>
          <button className="text-indigo-600 font-semibold hover:underline">View All Jobs</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobs.map((job, index) => (
            <JobCard key={index} {...job} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;