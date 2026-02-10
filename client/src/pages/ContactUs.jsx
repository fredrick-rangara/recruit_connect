import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, Clock, MapPin } from 'lucide-react';

const ContactUs = () => {
  return (
    <div className="bg-white">
      <Navbar />
      <div className="bg-slate-900 py-16 text-center text-white mb-12">
        <h1 className="text-4xl font-bold">Contact Us</h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 leading-tight mb-6">
            You Will Grow, You Will Succeed. <span className="text-indigo-600">We Promise That.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <ContactInfo icon={<Phone />} title="Call for Inquiry" detail="+254 700 000 000" />
            <ContactInfo icon={<Mail />} title="Send us email" detail="recruit@connect.com" />
            <ContactInfo icon={<Clock />} title="Opening hours" detail="Mon - Fri: 10AM - 10PM" />
            <ContactInfo icon={<MapPin />} title="Office" detail="Nairobi, Kenya" />
          </div>
        </div>

        <div className="bg-indigo-50/50 p-10 rounded-3xl border border-indigo-100">
          <h3 className="text-2xl font-bold mb-8">Contact Info</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" className="p-3 rounded-xl border-none outline-none shadow-sm" />
              <input type="text" placeholder="Last Name" className="p-3 rounded-xl border-none outline-none shadow-sm" />
            </div>
            <input type="email" placeholder="Email Address" className="w-full p-3 rounded-xl border-none outline-none shadow-sm" />
            <textarea placeholder="Message" rows="5" className="w-full p-3 rounded-xl border-none outline-none shadow-sm resize-none"></textarea>
            <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition">
              Send Message
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const ContactInfo = ({ icon, title, detail }) => (
  <div className="flex gap-4">
    <div className="text-indigo-600 shrink-0">{React.cloneElement(icon, { size: 24 })}</div>
    <div>
      <h4 className="font-bold text-slate-900">{title}</h4>
      <p className="text-slate-500 text-sm mt-1">{detail}</p>
    </div>
  </div>
);

export default ContactUs;