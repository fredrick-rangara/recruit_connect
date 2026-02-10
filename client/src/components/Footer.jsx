import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white text-xl font-bold mb-4">Recruit<span className="text-indigo-400">Connect</span></h3>
          <p className="text-sm">Connecting talent with opportunity since 2026.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">For Candidates</h4>
          <ul className="space-y-2 text-sm">
            <li>Browse Jobs</li>
            <li>Job Alerts</li>
            <li>Candidate Dashboard</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">For Employers</h4>
          <ul className="space-y-2 text-sm">
            <li>Post a Job</li>
            <li>Browse Candidates</li>
            <li>Employer Dashboard</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li>Help Center</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm">
        &copy; 2026 RecruitConnect. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;