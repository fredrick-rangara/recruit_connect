import React from 'react';

const TrustedBy = () => {
  const logos = ["Slack", "Adobe", "Google", "Airbnb", "Facebook"];

  return (
    <section className="py-12 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-slate-400 font-medium mb-8">Trusted by 5,000+ companies worldwide</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale">
          {logos.map((logo) => (
            <span key={logo} className="text-2xl font-bold text-slate-800 tracking-tighter">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;