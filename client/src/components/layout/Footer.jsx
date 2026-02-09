import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-purple rounded flex items-center justify-center font-bold">RC</div>
              <span className="text-xl font-bold">Recruit Connect</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Quis enim pellentesque viverra tellus eget malesuada fames ac. 
              Semper feugiat pretium dui ac non id interdum.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Company</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="/about" className="hover:text-brand-purple transition">About Us</a></li>
              <li><a href="/contact" className="hover:text-brand-purple transition">Our Team</a></li>
              <li><a href="/jobs" className="hover:text-brand-purple transition">Partners</a></li>
              <li><a href="/contact" className="hover:text-brand-purple transition">For Employers</a></li>
            </ul>
          </div>

          {/* Job Categories */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Job Categories</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="/jobs" className="hover:text-brand-purple transition">Search Jobs</a></li>
              <li><a href="/jobs" className="hover:text-brand-purple transition">Work From Home</a></li>
              <li><a href="/jobs" className="hover:text-brand-purple transition">Internships</a></li>
              <li><a href="/jobs" className="hover:text-brand-purple transition">Remote Jobs</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe to get latest job alerts.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-brand-purple"
              />
              <button className="absolute right-2 top-2 bg-brand-purple p-1.5 rounded-lg hover:bg-opacity-90 transition">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 Recruit Connect. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon }) => (
  <a href="#" className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-purple transition duration-300">
    {icon}
  </a>
);

export default Footer;