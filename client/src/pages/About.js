import React from 'react';
import { UserPlus, Upload, Search, CheckCircle, Play } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white">
      {/* Header Section */}
      <section className="bg-brand-dark text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-gray-400 max-w-2xl mx-auto px-4">
          Et nunc ut tempus duis nisl sed massa. Learn how we connect talent with the world's leading companies.
        </p>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto py-24 px-4 text-center">
        <h2 className="text-3xl font-bold mb-2">How it works</h2>
        <p className="text-gray-500 mb-16">Follow these simple steps to land your dream job.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StepCard icon={<UserPlus size={32} className="text-brand-purple" />} title="Create Account" desc="Sign up and build your professional profile." />
          <StepCard icon={<Upload size={32} className="text-brand-purple" />} title="Upload Resume" desc="Share your skills and experience with employers." />
          <StepCard icon={<Search size={32} className="text-brand-purple" />} title="Find Jobs" desc="Search through thousands of curated listings." />
          <StepCard icon={<CheckCircle size={32} className="text-brand-purple" />} title="Apply Job" desc="Get hired and start your new career journey." />
        </div>
      </section>

      {/* Video Call-to-Action Section */}
      <section className="max-w-6xl mx-auto px-4 mb-24">
        <div className="relative h-[400px] rounded-3xl overflow-hidden group cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200" 
            alt="Office" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-brand-dark/50 flex flex-col items-center justify-center text-white p-8">
            <div className="w-16 h-16 bg-brand-purple rounded-full flex items-center justify-center mb-6 shadow-xl animate-pulse">
              <Play fill="white" size={24} />
            </div>
            <h2 className="text-3xl font-bold mb-4">Good Life Begins With A Good Company</h2>
          </div>
        </div>
      </section>
    </div>
  );
};

const StepCard = ({ icon, title, desc }) => (
  <div className="p-8 border border-gray-100 rounded-2xl hover:shadow-xl transition-shadow bg-white">
    <div className="mb-6 flex justify-center">{icon}</div>
    <h3 className="font-bold text-lg mb-3">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default About;