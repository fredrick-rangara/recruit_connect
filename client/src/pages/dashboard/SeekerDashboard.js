// client/src/pages/dashboard/SeekerDashboard.js
import React from 'react';

const SeekerDashboard = () => {
  return (
    <div className="min-h-screen bg-ui-gray p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-brand-dark">Welcome back, Alex!</h1>
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-purple">
            <img src="/path-to-avatar.png" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </header>

        {/* Upload CV Banner from Figma */}
        <div className="bg-brand-purple p-6 rounded-xl flex justify-between items-center text-white mb-8 shadow-lg">
          <div>
            <h2 className="text-xl font-bold">Upload Your CV</h2>
            <p className="text-purple-100 opacity-90">Boost your profile visibility by 90%</p>
          </div>
          <button className="bg-white text-brand-purple px-6 py-2 rounded-lg font-bold hover:bg-purple-50 transition-colors">
            Browse Files
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Application Tracker */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-ui-border">
            <h3 className="font-bold mb-4 border-b pb-2 inline-block border-brand-purple">Application Tracker</h3>
            <div className="py-4">
              <p className="text-sm text-gray-500 italic">Under Review: Senior UI Designer at Apple</p>
              {/* Progress bar logic here */}
            </div>
          </div>

          {/* Profile Strength */}
          <div className="bg-white p-6 rounded-xl border border-ui-border flex flex-col items-center justify-center">
            <h3 className="text-gray-500 text-sm mb-2">Profile Strength</h3>
            <span className="text-3xl font-bold text-brand-purple">75%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;