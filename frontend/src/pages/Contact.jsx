import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent! We'll be in touch soon.");
      setLoading(false);
      e.target.reset();
    }, 1500);
  };

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Contact Info Sidebar */}
        <div className="md:w-2/5 bg-slate-900 p-12 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-black mb-6 leading-tight">Let's <br />Talk.</h2>
            <p className="text-slate-400 font-medium mb-10">Have questions about your account or need help with a posting?</p>
            
            <div className="space-y-6">
              <div>
                <p className="text-purple-400 text-xs font-black uppercase tracking-widest mb-1">Email Us</p>
                <p className="text-lg font-bold">info@recruitconnect.com</p>
              </div>
              <div>
                <p className="text-purple-400 text-xs font-black uppercase tracking-widest mb-1">Visit Us</p>
                <p className="text-lg font-bold">101 Innovation Way, Tech Hub</p>
              </div>
            </div>
          </div>
          
          <div className="pt-10 border-t border-slate-800">
            <p className="text-slate-500 text-sm">Response time: &lt; 24 hours</p>
          </div>
        </div>

        {/* Form */}
        <div className="md:w-3/5 p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                <input type="text" required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-purple-600 outline-none transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                <input type="email" required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-purple-600 outline-none transition-all" placeholder="john@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
              <select className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-purple-600 outline-none transition-all font-medium">
                <option>General Inquiry</option>
                <option>Technical Support</option>
                <option>Employer Partnership</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
              <textarea rows="4" required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-purple-600 outline-none transition-all" placeholder="How can we help?"></textarea>
            </div>
            <button 
              disabled={loading}
              className="w-full bg-purple-600 text-white py-5 rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-purple-100 flex justify-center items-center gap-3"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}