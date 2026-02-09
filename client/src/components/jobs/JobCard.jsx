import React from 'react';
import { MapPin, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  return (
    <div className="job-card bg-white p-6 border rounded-xl flex justify-between items-center hover:shadow-md transition">
      <div className="flex gap-4 items-start">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold">
          {job.company[0]}
        </div>
        <div>
          <h3 className="font-bold text-lg">{job.title}</h3>
          <p className="text-gray-500 text-sm mb-2">{job.company}</p>
          <div className="flex gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
            <span className="flex items-center gap-1"><Clock size={14}/> Full-time</span>
            <span className="flex items-center gap-1"><DollarSign size={14}/> {job.salary}</span>
          </div>
        </div>
      </div>
      <Link 
        to={`/jobs/${job.id}`} 
        className="bg-purple-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
      >
        Job Details
      </Link>
    </div>
  );
};

export default JobCard;