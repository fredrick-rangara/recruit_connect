import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { UserPlus, Search, FileText, CheckCircle } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="bg-white">
      <Navbar />
      <div className="bg-slate-900 py-16 text-center text-white mb-12">
        <h1 className="text-4xl font-bold">About Us</h1>
      </div>

      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">How it works</h2>
          <p className="text-slate-500 mt-2">A quick guide to starting your journey with us</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StepCard icon={<UserPlus />} title="Create Account" desc="Fill in your details and verify your account." />
          <StepCard icon={<Search />} title="Search Job" desc="Use filters to find your perfect match." />
          <StepCard icon={<FileText />} title="Fill Details" desc="Upload your CV and write a cover letter." />
          <StepCard icon={<CheckCircle />} title="Apply Job" desc="Submit and track your applications easily." />
        </div>
      </section>

      {/* FAQ Section Placeholder */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {['Can I upload CV?', 'How long is recruitment?'].map((q, i) => (
              <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center cursor-pointer">
                <span className="font-medium text-slate-700">{q}</span>
                <span className="text-indigo-600">+</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

const StepCard = ({ icon, title, desc }) => (
  <div className="text-center p-6 rounded-2xl hover:bg-slate-50 transition">
    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
      {React.cloneElement(icon, { size: 30 })}
    </div>
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p className="text-sm text-slate-500">{desc}</p>
  </div>
);

export default AboutUs;