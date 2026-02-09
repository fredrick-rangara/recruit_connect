import React from 'react';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-brand-dark text-white py-16 text-center">
        <h1 className="text-4xl font-bold">Contact Us</h1>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div>
          <h2 className="text-3xl font-bold mb-6">You Will Grow, You Will Succeed. We Promise That</h2>
          <p className="text-gray-500 mb-10">Reach out to our team for any inquiries or support needed.</p>
          
          <div className="grid grid-cols-2 gap-8">
            <ContactInfo icon={<Phone className="text-brand-purple" />} label="Call for inquiry" detail="+234 800-12345" />
            <ContactInfo icon={<Mail className="text-brand-purple" />} label="Send us email" detail="hello@recruitconnect.com" />
            <ContactInfo icon={<Clock className="text-brand-purple" />} label="Opening hours" detail="Mon - Fri: 9AM - 6PM" />
            <ContactInfo icon={<MapPin className="text-brand-purple" />} label="Office" detail="123 Tech Plaza, Nairobi" />
          </div>
        </div>

        {/* Contact Form Box */}
        <div className="bg-[#F4FBF9] p-10 rounded-3xl border border-gray-100">
          <h3 className="text-xl font-bold mb-6">Contact Info</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" className="bg-white border-none rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-brand-purple outline-none" />
              <input type="text" placeholder="Last Name" className="bg-white border-none rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-brand-purple outline-none" />
            </div>
            <input type="email" placeholder="Email Address" className="w-full bg-white border-none rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-brand-purple outline-none" />
            <textarea placeholder="Your Message" className="w-full bg-white border-none rounded-xl p-3 h-32 shadow-sm focus:ring-2 focus:ring-brand-purple outline-none"></textarea>
            <button className="w-full bg-brand-purple text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ContactInfo = ({ icon, label, detail }) => (
  <div className="flex flex-col gap-2">
    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">{icon}</div>
    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
    <p className="text-sm font-semibold">{detail}</p>
  </div>
);

export default Contact;