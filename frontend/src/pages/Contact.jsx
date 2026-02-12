import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user ID from local storage if logged in
  const user = JSON.parse(localStorage.getItem('user')) || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        ...formData,
        userId: user?.id || null // Pass userId to link message to an account
      };

      const response = await axios.post('http://localhost:5000/api/contact', payload);
      
      if (response.status === 201) {
        toast.success("Message sent! We'll get back to you soon.");
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT SIDE: INFO */}
        <div>
          <span className="text-purple-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Get in Touch</span>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-8">
            How can we <span className="text-purple-600">help you?</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg mb-12 leading-relaxed">
            Whether you're looking for a job or looking for talent, our team is here to support your journey.
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <FiMail size={24} />
              </div>
              <div>
                <h4 className="font-black text-slate-900">Email Us</h4>
                <p className="text-slate-500 font-bold">support@recruitconnect.com</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                <FiPhone size={24} />
              </div>
              <div>
                <h4 className="font-black text-slate-900">Call Us</h4>
                <p className="text-slate-500 font-bold">+1 (555) 000-0000</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                <FiMapPin size={24} />
              </div>
              <div>
                <h4 className="font-black text-slate-900">Visit Us</h4>
                <p className="text-slate-500 font-bold">123 Tech Avenue, San Francisco</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl shadow-purple-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Full Name</label>
              <input 
                type="text"
                required
                className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Email Address</label>
              <input 
                type="email"
                required
                className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Your Message</label>
              <textarea 
                required
                rows="4"
                className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>

            <button 
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-white hover:text-black text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              <FiSend />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}