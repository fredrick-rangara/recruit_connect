import React from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Briefcase, Calendar, GraduationCap, DollarSign, Facebook, Twitter, Linkedin, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const JobDetails = () => {
  const { id } = useParams();

  // In a real app, you'd fetch this data from your Flask backend using the 'id'
  const jobData = {
    title: "Corporate Solutions Executive",
    company: "Luffler and Sons",
    location: "New York, USA",
    salary: "$40k - $42k",
    type: "Full Time",
    experience: "3 Years",
    degree: "Master",
    category: "Commerce",
    description: "Nunc sed a nisi purus. Mollis elit faucibus, porta lacus in aliquam. Sit amet elit sit amet mi. Felis eu ultrices a velit massa...",
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      
      {/* Header Banner */}
      <div className="bg-slate-900 py-16 text-center">
        <h1 className="text-4xl font-bold text-white">Job Details</h1>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Job Description</h2>
            <p className="text-slate-600 leading-relaxed">{jobData.description}</p>
            
            <h3 className="text-xl font-bold mt-8 mb-4">Key Responsibilities</h3>
            <ul className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600">
                  <CheckCircle2 className="text-indigo-600 mt-1 shrink-0" size={18} />
                  <span>Et nunc ut tempus duis nisl sed massa. Ornare varius faucibus nisl vitae cras ornare.</span>
                </li>
              ))}
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-4">Professional Skills</h3>
            <ul className="space-y-3">
              {[1, 2, 3].map((i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600">
                  <CheckCircle2 className="text-indigo-600 mt-1 shrink-0" size={18} />
                  <span>Ornare varius faucibus nisl vitae cras ornare.</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
              <div className="flex gap-2">
                {['Full time', 'Commerce', 'New York'].map(tag => (
                  <span key={tag} className="bg-slate-100 text-slate-600 px-4 py-1 rounded-full text-sm">{tag}</span>
                ))}
              </div>
              <div className="flex gap-4 text-slate-400">
                <Facebook size={20} className="hover:text-indigo-600 cursor-pointer" />
                <Twitter size={20} className="hover:text-indigo-600 cursor-pointer" />
                <Linkedin size={20} className="hover:text-indigo-600 cursor-pointer" />
              </div>
            </div>
          </section>

          {/* Bottom Card (Similar Job Preview) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 font-bold text-xl">L</div>
              <div>
                <h4 className="font-bold text-lg">{jobData.title}</h4>
                <p className="text-slate-500 text-sm">{jobData.company}</p>
              </div>
            </div>
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
              Apply Job
            </button>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <aside className="space-y-6">
          {/* Job Overview */}
          <div className="bg-indigo-50/50 p-8 rounded-2xl border border-indigo-100">
            <h3 className="text-xl font-bold mb-6">Job Overview</h3>
            <div className="space-y-6">
              <SidebarItem icon={<Briefcase size={20}/>} label="Job Title" value={jobData.title} />
              <SidebarItem icon={<Calendar size={20}/>} label="Job Type" value={jobData.type} />
              <SidebarItem icon={<GraduationCap size={20}/>} label="Degree" value={jobData.degree} />
              <SidebarItem icon={<DollarSign size={20}/>} label="Offered Salary" value={jobData.salary} />
              <SidebarItem icon={<MapPin size={20}/>} label="Location" value={jobData.location} />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-indigo-50/50 p-8 rounded-2xl border border-indigo-100">
            <h3 className="text-xl font-bold mb-4">Send Us Message</h3>
            <form className="space-y-4">
              <input type="text" placeholder="Full name" className="w-full p-3 rounded-xl bg-white border-none outline-none text-sm" />
              <input type="email" placeholder="Email Address" className="w-full p-3 rounded-xl bg-white border-none outline-none text-sm" />
              <textarea placeholder="Your Message" rows="4" className="w-full p-3 rounded-xl bg-white border-none outline-none text-sm resize-none"></textarea>
              <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
                Send Message
              </button>
            </form>
          </div>
        </aside>

      </main>

      <Footer />
    </div>
  );
};

const SidebarItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="text-indigo-600 mt-1">{icon}</div>
    <div>
      <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">{label}</p>
      <p className="text-slate-900 font-medium">{value}</p>
    </div>
  </div>
);

export default JobDetails;